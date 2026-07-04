import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';

function getUserByEmail(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./dev.db');
    db.get('SELECT * FROM User WHERE email = ?', [email], (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function createUser(user: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./dev.db');
    const id = Date.now().toString();
    db.run(
      'INSERT INTO User (id, email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, user.email, user.password, user.name, user.role, Date.now(), Date.now()],
      (err) => {
        db.close();
        if (err) reject(err);
        else resolve(id);
      }
    );
  });
}

function getEmployees(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./dev.db');
    db.all('SELECT id, email, name, createdAt FROM User WHERE role = ?', ['EMPLOYEE'], (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'HR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await createUser({
      name,
      email,
      password: hashedPassword,
      role: 'EMPLOYEE'
    });

    return NextResponse.json({ success: true, message: 'Employee added successfully', user: { id, name, email } });
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'HR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const employees = await getEmployees();
    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

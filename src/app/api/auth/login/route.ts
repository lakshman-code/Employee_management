import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { setSession } from '@/lib/auth';

// Promisify sqlite3
function getUser(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./dev.db');
    db.get('SELECT * FROM User WHERE email = ?', [email], (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function createUser(user: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./dev.db');
    const id = Date.now().toString();
    db.run(
      'INSERT INTO User (id, email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, user.email, user.password, user.name, user.role, Date.now(), Date.now()],
      (err) => {
        db.close();
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function countUsers(): Promise<number> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./dev.db');
    db.get('SELECT COUNT(*) as count FROM User', (err, row: any) => {
      db.close();
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await getUser(email);

    if (!user) {
      const count = await countUsers();
      if (count === 0 && email === 'admin@company.com') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({
          email,
          password: hashedPassword,
          name: 'HR Admin',
          role: 'HR'
        });
        const newUser = await getUser(email);
        await setSession({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name });
        return NextResponse.json({ success: true, redirect: '/dashboard/hr' });
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await setSession({ id: user.id, email: user.email, role: user.role, name: user.name });

    const redirectUrl = user.role === 'HR' ? '/dashboard/hr' : '/dashboard/employee';
    
    return NextResponse.json({ success: true, redirect: redirectUrl });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

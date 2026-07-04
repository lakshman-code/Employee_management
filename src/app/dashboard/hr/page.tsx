"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HRDashboard() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const fetchEmployees = async () => {
    const res = await fetch('/api/hr/employees');
    if (res.ok) {
      const data = await res.json();
      setEmployees(data.employees);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    const res = await fetch('/api/hr/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      setMessage('Employee added successfully!');
      setName('');
      setEmail('');
      setPassword('');
      fetchEmployees();
    } else {
      setMessage(data.error || 'Failed to add employee');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2>HR Dashboard</h2>
        <button className="btn-primary" onClick={() => router.push('/')}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Add Employee Form */}
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Add New Employee</h3>
          {message && <div style={{ color: 'var(--success)', marginBottom: '16px' }}>{message}</div>}
          <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Temporary Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Allocate Credentials</button>
          </form>
        </div>

        {/* Employee List */}
        <div className="glass-panel animate-fade-in" style={{ padding: '32px', animationDelay: '0.1s' }}>
          <h3 style={{ marginBottom: '24px' }}>Employee Directory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {employees.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No employees found. Add one on the left.</p>
            ) : (
              employees.map((emp: any) => (
                <div key={emp.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{emp.name}</strong>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{emp.email}</div>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Joined: {new Date(emp.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

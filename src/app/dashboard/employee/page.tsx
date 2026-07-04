"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
  const router = useRouter();

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2>Employee Dashboard</h2>
        <button className="btn-primary" onClick={() => router.push('/')}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          <h3>Profile Overview</h3>
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
            Welcome to your portal. Here you can view your details, manage attendance, and request leaves.
          </p>
        </div>

        <div className="glass-panel animate-fade-in" style={{ padding: '32px', animationDelay: '0.1s' }}>
          <h3>Attendance</h3>
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--success)' }}>Check In</button>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--danger)' }}>Check Out</button>
          </div>
        </div>

        <div className="glass-panel animate-fade-in" style={{ padding: '32px', animationDelay: '0.2s' }}>
          <h3>Leave Management</h3>
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Available Leaves: 12</p>
          <button className="btn-primary" style={{ marginTop: '16px', width: '100%' }}>Request Leave</button>
        </div>

      </div>
    </div>
  );
}

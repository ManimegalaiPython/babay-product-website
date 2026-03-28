import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#c2185b', marginBottom: 20 }}>My Profile</h2>
      <div style={{ background: '#fff', border: '1px solid #f0d0da', borderRadius: 12, padding: 28 }}>
        <p><strong>Username:</strong> {user?.username || '—'}</p>
        <p style={{ marginTop: 12 }}><strong>Email:</strong> {user?.email || '—'}</p>
        <p style={{ marginTop: 12 }}><strong>User ID:</strong> {user?.id || '—'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
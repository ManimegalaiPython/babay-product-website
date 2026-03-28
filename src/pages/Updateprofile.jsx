import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: wire to your API update endpoint, e.g. api.updateProfile(formData)
    setMessage('Profile updated successfully!');
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
    outline: 'none',
    fontFamily: 'inherit',
  };

  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151' };

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#c2185b', marginBottom: 20 }}>Update Profile</h2>
      <form
        onSubmit={handleSubmit}
        style={{ background: '#fff', border: '1px solid #f0d0da', borderRadius: 12, padding: 28 }}
      >
        <label style={labelStyle}>Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>New Password <span style={{ fontWeight: 400, color: '#9ca3af' }}>(leave blank to keep current)</span></label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          style={inputStyle}
        />

        {message && (
          <p style={{ color: '#16a34a', fontSize: 13, marginBottom: 12 }}>{message}</p>
        )}

        <button
          type="submit"
          style={{
            background: '#c2185b',
            color: '#fff',
            border: 'none',
            padding: '11px 28px',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfilePage;
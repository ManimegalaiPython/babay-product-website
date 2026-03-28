import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
        return;
      }

      alert('Registered Successfully 🎉');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-overlay">
      <div className="register-modal">
        {/* Close Button */}
        <button className="modal-close" onClick={() => navigate(-1)}>
          <span>✕</span>
        </button>

        <h2 className="modal-title">Register</h2>

        <div className="modal-body">
          {/* LEFT: Image */}
          <div className="modal-image-side">
            <img
              src="/register1.jpg"
              alt="Mother and baby"
              className="modal-image"
            />
          </div>

          {/* RIGHT: Form */}
          <div className="modal-form-side">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                />
              </div>

              <div className="form-group password-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </button>
                </div>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Log In</Link>
            </div>

            <div className="or-divider">
              <span>Or</span>
            </div>

            <div className="social-login">
              <button className="social-btn google" onClick={() => alert('Google registration coming soon!')}>
                Continue with Google <FaGoogle />
              </button>
              <button className="social-btn facebook" onClick={() => alert('Facebook registration coming soon!')}>
                Continue with Facebook <FaFacebook />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
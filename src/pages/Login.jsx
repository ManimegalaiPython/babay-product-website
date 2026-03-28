import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      alert('Login successful 🎉');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        {/* Close Button */}
        <button className="modal-close" onClick={() => navigate(-1)}>
          <span>✕</span>
        </button>

        <h2 className="modal-title">Log In</h2>

        <div className="modal-body">
          {/* LEFT: Image */}
          <div className="modal-image-side">
            <img
              src="/babysleep.webp"
              alt="Sleeping baby"
              className="modal-image"
            />
          </div>

          {/* RIGHT: Form */}
          <div className="modal-form-side">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
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

              <div className="form-links">
                <Link to="/forgot-password" className="forgot-link">
                  Forget password?
                </Link>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register" className="auth-switch-link">Register</Link>
            </div>

            <div className="or-divider">
              <span>Or</span>
            </div>

            <div className="social-login">
              <button className="social-btn google" onClick={() => alert('Google login coming soon!')}>
                Continue with Google <FaGoogle />
              </button>
              <button className="social-btn facebook" onClick={() => alert('Facebook login coming soon!')}>
                Continue with Facebook <FaFacebook />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
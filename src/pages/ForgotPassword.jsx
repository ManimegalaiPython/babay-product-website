import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { resetPassword } = useAuth(); // assumes your auth context has this method
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Check your email for a password reset link.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span className="announcement-icon">🎉</span>
        Get Rs:250 additional off on cart value of Rs:2999 and above
      </div>

      {/* Categories Bar (same as register page) */}
      <div className="categories-bar">
        <div className="categories-container">
          <span className="category-item">All categories ▼</span>
          <span className="category-item">Baby fashion ▼</span>
          <span className="category-item">Toys</span>
          <span className="category-item">Footwear & Accessories ▼</span>
          <span className="category-item">Moms & Baby care ▼</span>
          <span className="category-item">Furniture & Bedding ▼</span>
          <span className="category-item">Rental Services</span>
          <span className="category-item">Offers</span>
        </div>
      </div>

      <div className="forgot-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <span>Forgot Password</span>
        </div>

        <div className="forgot-content">
          <div className="forgot-form-wrapper">
            <h2>Reset Password</h2>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <button type="submit" className="reset-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="back-to-login">
              <Link to="/login">Back to Log In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
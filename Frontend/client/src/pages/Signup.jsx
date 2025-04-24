import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/AuthStyles.css';
import signupImage from '../assets/signup.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container signup">
      <div className="form-container">
        <div className="image-section">
          <img src={signupImage} alt="Signup" className="auth-image" />
        </div>
        <div className="form-section signup">
          <h1 className="auth-title signup">Create Account</h1>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="auth-label signup">Username</label>
              <div className="input-wrapper">
                <FaUser className="input-icon signup" />
                <input
                  className="auth-input signup"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="auth-label signup">Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon signup" />
                <input
                  className="auth-input signup"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="auth-label signup">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon signup" />
                <input
                  className="auth-input signup"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button signup" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            <div className="auth-footer">
              <p className="switch-text">
                Already have an account?
                <button
                  type="button"
                  className="switch-link signup"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

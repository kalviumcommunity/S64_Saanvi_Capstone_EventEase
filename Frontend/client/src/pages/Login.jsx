import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/AuthStyles.css';
import loginImage from '../assets/download.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container login">
      <div className="form-container">
        <div className="image-section">
          <img src={loginImage} alt="Login" className="auth-image" />
        </div>
        <div className="form-section login">
          <h1 className="auth-title login">Welcome Back</h1>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="auth-label login" htmlFor="username">
                Username
              </label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon login" />
                <input
                  className="auth-input login"
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="auth-label login" htmlFor="password">
                Password
              </label>
              <div className="input-wrapper">
                <FaLock className="input-icon login" />
                <input
                  className="auth-input login"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="auth-button login"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="switch-text">
              Don't have an account?{' '}
              <span
                className="switch-link login"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 

import React, { useState } from 'react';
import "../Styles/LoginSignUp.css"
import axios from 'axios';


const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', phone: '' });
  };

  // Handle input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', loginData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      // Redirect to profile or home page
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/signup', signupData);
      localStorage.setItem('token', response.data.token);
      alert('Signup successful! You are now logged in.');
      // Redirect to profile or home page
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <div className="auth-container">
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="form-input"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="toggle-text">
              Don't have an account?{' '}
              <span onClick={toggleForm} className="toggle-link">
                Sign Up
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="form-input"
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={signupData.phone}
                onChange={handleSignupChange}
                className="form-input"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <p className="toggle-text">
              Already have an account?{' '}
              <span onClick={toggleForm} className="toggle-link">
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
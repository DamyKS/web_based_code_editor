import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
          password2: formData.confirmPassword
        })
      });
      
      if (response.ok) {
        // Registration successful: Show success popup message
        setShowSuccess(true);
        // After a short delay, redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 2000); // 2 seconds delay
      } else {
        const data = await response.json();
        setError(Object.values(data).flat().join(' '));
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Account</h1>
      {error && <div className="error-message">{error}</div>}
      {showSuccess && (
        <div className="success-popup">
          Sign up successful!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="signup-submit-btn">Sign Up</button>
      </form>
      
      <div className="signup-footer">
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  );
}

export default Signup;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './styles/Login.css'; // optional styling
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // important for cookies
      });
      
      if (response.ok) {
        // Login successful: show success popup and redirect after delay
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/editor');
        }, 2000); // 2 seconds delay
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h1>Log In</h1>
      {error && <div className="error-message">{error}</div>}
      {showSuccess && (
        <div className="success-popup">
          Login successful!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="login-submit-btn">Log In</button>
      </form>
      
      <div className="login-footer">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <p><Link to="/reset-password">Forgot Password?</Link></p>
      </div>
    </div>
  );
}

export default Login;

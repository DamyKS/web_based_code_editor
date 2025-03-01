import React from 'react';
import { Link } from 'react-router-dom';
// import './styles/LandingPage.css'; 
import './App.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <h1>Welcome to My Online Code Editor</h1>
      <p>Write, run, and preview code in one place.</p>
      <div className="landing-buttons">
        {/* Link to the editor route */}
        <Link to="/editor" className="guest-button">
          Continue as Guest
        </Link>
        
        {/* Link to the login route (or signup) */}
        <Link to="/login" className="login-button">
          Login / Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GoogleButton from './GoogleButton';
import './Auth.css';

const Signup = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Keycodes do not match.');
    }

    setLoading(true);
    try {
      await signup(email, password);
    } catch (err) {
      console.error(err);
      setError('Registration failed. Email may be taken or keycode too weak.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      loginWithGoogle(); // triggers redirect — page will navigate away
    } catch (err) {
      console.error(err);
      setError('Failed to initiate Google login. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo">{"{+H}"}</div>
        <h2 className="auth-title">Register Identity</h2>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Identity (Email)</label>
          <input 
            type="email" 
            className="form-input" 
            placeholder="hacker@root.sh" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>New Keycode (Password)</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Keycode</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="********" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'REGISTER IDENTIFIER'}
        </button>
      </form>

      <div className="auth-divider">OR</div>

      <GoogleButton onClick={handleGoogleLogin} disabled={loading} />

      <div className="auth-footer">
        Already Registered? 
        <span className="auth-link" onClick={onSwitch}>Login</span>
      </div>
    </div>
  );
};

export default Signup;

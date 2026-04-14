import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GoogleButton from './GoogleButton';
import './Auth.css';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError('Failed to log in. Please check your credentials.');
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
        <div className="auth-logo">{"{H}"}</div>
        <h2 className="auth-title">Access Terminal</h2>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Identity (Email)</label>
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
          <label>Keycode (Password)</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Initializing...' : 'ENTER TERMINAL'}
        </button>
      </form>

      <div className="auth-divider">OR</div>

      <GoogleButton onClick={handleGoogleLogin} disabled={loading} />

      <div className="auth-footer">
        New Operator? 
        <span className="auth-link" onClick={onSwitch}>Create Account</span>
      </div>
    </div>
  );
};

export default Login;

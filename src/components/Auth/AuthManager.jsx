import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import MatrixRain from '../MatrixRain';
import './Auth.css';

const AuthManager = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <MatrixRain />
      <div className="crt-overlay" />
      
      <div className="auth-content">
        {isLogin ? (
          <Login onSwitch={() => setIsLogin(false)} />
        ) : (
          <Signup onSwitch={() => setIsLogin(true)} />
        )}
      </div>
      
      <div className="auth-system-info">
        <p>SYSTEM: AUTH_GATEWAY_V2.4</p>
        <p>STATUS: SECURITY_ENFORCED</p>
      </div>
    </div>
  );
};

export default AuthManager;

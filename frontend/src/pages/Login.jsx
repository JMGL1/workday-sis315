import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-logo">workday.</h1>
        <p className="login-subtitle">Inicia sesión en tu cuenta</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Usuario / Rol simulado (ej: admin, rrhh)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required 
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

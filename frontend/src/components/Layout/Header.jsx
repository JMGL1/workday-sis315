import React from 'react';
import { Search, MessageSquare, Bell, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Buscar" className="search-input" />
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <MessageSquare size={20} />
        </button>
        <button className="icon-btn with-badge">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <button className="icon-btn with-badge">
          <Mail size={20} />
          <span className="badge">8</span>
        </button>
        
        <div className="user-profile">
          <img 
            src={user?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
            alt={user?.name || "Usuario"} 
            className="avatar"
          />
          <div className="user-info">
            <span className="user-name">{user?.name || "Usuario"}</span>
            <span className="user-role">{user?.role || "Rol"}</span>
          </div>
          <button className="icon-btn" onClick={logout} style={{marginLeft: '10px'}} title="Cerrar Sesión">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, DollarSign, FileText, UserPlus, Clock, Settings, Star, CreditCard, Box, TrendingUp, Target } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/hcm', label: 'Recursos Humanos', icon: Users },
  { path: '/finanzas', label: 'Finanzas', icon: DollarSign },
  { path: '/nomina', label: 'Nómina', icon: FileText },
  { path: '/reclutamiento', label: 'Reclutamiento', icon: UserPlus },
  { path: '/talento', label: 'Gestión de Talento', icon: Target },
  { path: '/asistencia', label: 'Tiempo y Asistencia', icon: Clock },
  { path: '/gastos', label: 'Gastos', icon: CreditCard },
  { path: '/inventario', label: 'Inventario', icon: Box },
  { path: '/planificacion', label: 'Planificación', icon: TrendingUp },
  { path: '/reportes', label: 'Reportes', icon: FileText },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">workday.</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        
        <div className="nav-section-title">
          <Star size={16} /> Favoritos
        </div>
        <NavLink to="/hcm/empleados" className="nav-item">
          <Users size={20} className="nav-icon" /> Empleados
        </NavLink>
        <NavLink to="/nomina" className="nav-item">
          <FileText size={20} className="nav-icon" /> Pago de Nómina
        </NavLink>
      </nav>
    </aside>
  );
};

import React, { useState } from 'react';
import './Configuracion.css';
import { Save, User, Bell, Shield, Database } from 'lucide-react';

export const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Configuraciones guardadas exitosamente.');
  };

  return (
    <div className="configuracion-page">
      <div className="page-header">
        <div>
          <h1>Configuración del Sistema</h1>
          <p>Ajustes de cuenta, preferencias y seguridad</p>
        </div>
      </div>

      <div className="config-container">
        <div className="config-sidebar card">
          <button 
            className={`config-tab ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            <User size={18} /> Perfil de Usuario
          </button>
          <button 
            className={`config-tab ${activeTab === 'notificaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('notificaciones')}
          >
            <Bell size={18} /> Notificaciones
          </button>
          <button 
            className={`config-tab ${activeTab === 'seguridad' ? 'active' : ''}`}
            onClick={() => setActiveTab('seguridad')}
          >
            <Shield size={18} /> Seguridad
          </button>
          <button 
            className={`config-tab ${activeTab === 'sistema' ? 'active' : ''}`}
            onClick={() => setActiveTab('sistema')}
          >
            <Database size={18} /> Base de Datos
          </button>
        </div>

        <div className="config-content card">
          {activeTab === 'perfil' && (
            <form onSubmit={handleSave} className="nomina-form">
              <h3 className="card-title">Información Personal</h3>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" defaultValue="Administrador Workday" />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input type="email" defaultValue="admin@workday-erp.com" />
              </div>
              <div className="form-group">
                <label>Idioma</label>
                <select>
                  <option>Español (Latinoamérica)</option>
                  <option>English (US)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary mt-3"><Save size={16}/> Guardar Cambios</button>
            </form>
          )}

          {activeTab === 'notificaciones' && (
            <form onSubmit={handleSave} className="nomina-form">
              <h3 className="card-title">Preferencias de Alertas</h3>
              <div className="toggle-group">
                <label>Alertas de Nómina por Email</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="toggle-group">
                <label>Notificaciones de Reclutamiento</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="toggle-group">
                <label>Alertas de Inventario Bajo</label>
                <input type="checkbox" defaultChecked />
              </div>
              <button type="submit" className="btn btn-primary mt-3"><Save size={16}/> Guardar Cambios</button>
            </form>
          )}

          {activeTab === 'seguridad' && (
            <form onSubmit={handleSave} className="nomina-form">
              <h3 className="card-title">Seguridad y Acceso</h3>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input type="password" />
              </div>
              <div className="toggle-group mt-3">
                <label>Autenticación de Dos Pasos (2FA)</label>
                <input type="checkbox" />
              </div>
              <button type="submit" className="btn btn-primary mt-3"><Save size={16}/> Actualizar Seguridad</button>
            </form>
          )}

          {activeTab === 'sistema' && (
            <div className="sistema-info">
              <h3 className="card-title">Estado del Sistema</h3>
              <p><strong>Versión del ERP:</strong> v2.1.0 (Build 2026)</p>
              <p><strong>Base de Datos:</strong> Conectado a PostgreSQL/MySQL</p>
              <p><strong>Última copia de seguridad:</strong> Hoy a las 03:00 AM</p>
              <button type="button" className="btn mt-3" onClick={() => alert('Backup iniciado')}>Forzar Backup Ahora</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

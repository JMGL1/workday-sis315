import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import './Talento.css';

export const Talento = () => {
  const [objetivos, setObjetivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const data = await apiFetch('/api/talento/objetivos');
        setObjetivos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchObjetivos();
  }, []);

  return (
    <div className="talento-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Talento</h1>
          <p>Monitoreo de objetivos corporativos y desempeño</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Objetivos por Departamento</h3>
        {loading ? <p>Cargando objetivos...</p> : (
        <table className="workday-table">
          <thead>
            <tr>
              <th>Título del Objetivo</th>
              <th>Departamento</th>
              <th>Progreso (%)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {objetivos.map(obj => (
              <tr key={obj.id}>
                <td><strong>{obj.titulo}</strong></td>
                <td>{obj.departamento}</td>
                <td>
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar ${obj.progreso === 100 ? 'bg-success' : obj.progreso > 50 ? 'bg-primary' : 'bg-warning'}`}
                      style={{ width: `${obj.progreso}%` }}
                    ></div>
                    <span className="progress-text">{obj.progreso}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${obj.estado.toLowerCase().replace(' ', '-')}`}>
                    {obj.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

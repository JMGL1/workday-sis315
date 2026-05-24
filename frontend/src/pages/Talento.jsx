import React, { useState } from 'react';
import './Talento.css';

export const Talento = () => {
  const [objetivos, setObjetivos] = useState([
    { id: 1, titulo: 'Lanzar nuevo producto al mercado', departamento: 'Tecnología', progreso: 75, estado: 'En Progreso' },
    { id: 2, titulo: 'Aumentar ventas un 20%', departamento: 'Ventas', progreso: 40, estado: 'En Riesgo' },
    { id: 3, titulo: 'Reducir rotación de personal', departamento: 'Recursos Humanos', progreso: 100, estado: 'Completado' },
    { id: 4, titulo: 'Campaña de marketing digital', departamento: 'Marketing', progreso: 10, estado: 'No Iniciado' },
  ]);

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
      </div>
    </div>
  );
};

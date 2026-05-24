import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import './Gastos.css';

export const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGastos = async () => {
    try {
      const data = await apiFetch('/api/gastos/solicitudes');
      setGastos(data);
    } catch (error) {
      console.error('Error fetching gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const submitGasto = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/gastos/solicitudes', {
        method: 'POST',
        body: JSON.stringify({ descripcion, monto: parseFloat(monto) })
      });
      setDescripcion('');
      setMonto('');
      fetchGastos(); // Refresh list
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="gastos-page">
      <div className="page-header">
        <div>
          <h1>Gastos y Viáticos</h1>
          <p>Gestión y rendición de gastos</p>
        </div>
      </div>

      <div className="gastos-container">
        <div className="card">
          <h3 className="card-title">Nuevo Reporte de Gasto</h3>
          <form onSubmit={submitGasto} className="nomina-form">
            <div className="form-group">
              <label>Descripción / Motivo</label>
              <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Monto (Bs)</label>
              <input type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Enviar para Aprobación</button>
          </form>
        </div>

        <div className="card">
          <h3 className="card-title">Mis Solicitudes Recientes</h3>
          {loading ? (
            <p>Cargando solicitudes...</p>
          ) : (
            <table className="workday-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map(g => (
                  <tr key={g.id}>
                    <td>{g.fecha}</td>
                    <td>{g.descripcion}</td>
                    <td>Bs {parseFloat(g.monto).toLocaleString()}</td>
                    <td><span className={`status-badge ${g.estado.toLowerCase()}`}>{g.estado}</span></td>
                  </tr>
                ))}
                {gastos.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">No tienes solicitudes registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

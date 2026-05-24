import React, { useState } from 'react';
import './Gastos.css';

export const Gastos = () => {
  const [gastos, setGastos] = useState([
    { id: 1, fecha: '2026-05-10', descripcion: 'Vuelo a Conferencia', monto: 350.00, estado: 'Aprobado' },
    { id: 2, fecha: '2026-05-12', descripcion: 'Hotel 2 Noches', monto: 200.00, estado: 'Pendiente' },
  ]);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  const submitGasto = (e) => {
    e.preventDefault();
    const nuevoGasto = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      descripcion,
      monto: parseFloat(monto),
      estado: 'Pendiente'
    };
    setGastos([nuevoGasto, ...gastos]);
    setDescripcion('');
    setMonto('');
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
                  <td>Bs {g.monto.toLocaleString()}</td>
                  <td><span className={`status-badge ${g.estado.toLowerCase()}`}>{g.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import './Asistencia.css';

export const Asistencia = () => {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [fichajes, setFichajes] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fichar = (tipo) => {
    const nuevoFichaje = {
      id: Date.now(),
      tipo,
      hora: new Date().toLocaleTimeString(),
      fecha: new Date().toLocaleDateString()
    };
    // Simulate POST /api/asistencia/fichar
    setFichajes([nuevoFichaje, ...fichajes]);
  };

  return (
    <div className="asistencia-page">
      <div className="page-header">
        <div>
          <h1>Tiempo y Asistencia</h1>
          <p>Reloj virtual y registro de marcas</p>
        </div>
      </div>

      <div className="reloj-container">
        <div className="reloj-digital">
          {hora}
        </div>
        <div className="reloj-acciones">
          <button className="btn btn-primary" onClick={() => fichar('Entrada')}>Marcar Entrada</button>
          <button className="btn" style={{backgroundColor: '#E0E0E0', color: '#333'}} onClick={() => fichar('Salida')}>Marcar Salida</button>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="card-title">Tus Registros de Hoy</h3>
        <div className="table-responsive">
          <table className="workday-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {fichajes.map(f => (
                <tr key={f.id}>
                  <td>{f.fecha}</td>
                  <td>{f.hora}</td>
                  <td><span className={`status-badge ${f.tipo === 'Entrada' ? 'activo' : 'inactivo'}`}>{f.tipo}</span></td>
                </tr>
              ))}
              {fichajes.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4">Sin registros hoy.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

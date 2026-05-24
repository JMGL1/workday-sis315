import React, { useState } from 'react';

export const Inventario = () => {
  const [bienes, setBienes] = useState([
    { id: 1, articulo: 'Laptop Dell XPS 15', stock: 5, minimo: 3, estado: 'Óptimo' },
    { id: 2, articulo: 'Monitor LG 27"', stock: 2, minimo: 5, estado: 'Bajo Stock' },
    { id: 3, articulo: 'Silla Ergonómica', stock: 12, minimo: 10, estado: 'Óptimo' },
  ]);

  const reorder = (id) => {
    setBienes(bienes.map(b => b.id === id ? { ...b, stock: b.stock + 10, estado: 'Óptimo' } : b));
    alert('Pedido de reabastecimiento enviado automáticamente.');
  };

  return (
    <div className="inventario-page">
      <div className="page-header">
        <div>
          <h1>Inventario de Activos</h1>
          <p>Control de stock y reabastecimiento</p>
        </div>
      </div>

      <div className="card">
        <table className="workday-table">
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Stock Actual</th>
              <th>Mínimo Requerido</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {bienes.map(b => (
              <tr key={b.id}>
                <td><strong>{b.articulo}</strong></td>
                <td>{b.stock}</td>
                <td>{b.minimo}</td>
                <td><span className={`status-badge ${b.stock <= b.minimo ? 'inactivo' : 'activo'}`}>{b.stock <= b.minimo ? 'Bajo Stock' : 'Óptimo'}</span></td>
                <td>
                  {b.stock <= b.minimo && (
                    <button className="btn btn-primary" onClick={() => reorder(b.id)}>Autopedido</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

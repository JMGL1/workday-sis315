import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export const Inventario = () => {
  const [bienes, setBienes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const data = await apiFetch('/api/inventario/articulos');
        setBienes(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticulos();
  }, []);

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
        {loading ? <p>Cargando inventario...</p> : (
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
        )}
      </div>
    </div>
  );
};

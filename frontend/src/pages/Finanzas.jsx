import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import './Finanzas.css';

export const Finanzas = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        const data = await apiFetch('/api/finanzas/transacciones');
        setTransacciones(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransacciones();
  }, []);

  const balanceMensual = transacciones.reduce((acc, curr) => {
    return curr.tipo === 'ingreso' ? acc + parseFloat(curr.monto) : acc - parseFloat(curr.monto);
  }, 0);

  return (
    <div className="finanzas-page">
      <div className="page-header">
        <div>
          <h1>Finanzas y Contabilidad</h1>
          <p>Balance General e Historial de Transacciones</p>
        </div>
      </div>

      <div className="finanzas-summary">
        <div className="card summary-card bg-primary-light">
          <h3>Balance Global</h3>
          <h2 className={balanceMensual >= 0 ? 'text-success' : 'text-danger'}>
            Bs {balanceMensual.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Historial de Transacciones</h3>
        {loading ? (
          <p>Cargando transacciones...</p>
        ) : (
          <div className="table-responsive">
            <table className="workday-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Categoría</th>
                  <th>Monto (Bs)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {transacciones.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.fecha}</td>
                    <td><strong>{tx.concepto}</strong></td>
                    <td>{tx.categoria}</td>
                    <td className={tx.tipo === 'ingreso' ? 'text-success font-bold' : 'text-danger font-bold'}>
                      {tx.tipo === 'ingreso' ? '+' : '-'} Bs {parseFloat(tx.monto).toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge ${tx.estado.toLowerCase()}`}>
                        {tx.estado}
                      </span>
                    </td>
                  </tr>
                ))}
                {transacciones.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No hay transacciones registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

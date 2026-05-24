import React, { useState } from 'react';
import './Finanzas.css';

export const Finanzas = () => {
  const [transacciones] = useState([
    { id: 1, fecha: '2026-05-01', concepto: 'Pago Nómina', categoria: 'Salarios', tipo: 'egreso', monto: 50000.00, estado: 'Completado' },
    { id: 2, fecha: '2026-05-15', concepto: 'Venta de Servicios a Empresa X', categoria: 'Ventas', tipo: 'ingreso', monto: 120000.00, estado: 'Completado' },
    { id: 3, fecha: '2026-05-18', concepto: 'Compra de Equipos', categoria: 'Activos', tipo: 'egreso', monto: 15000.00, estado: 'Pendiente' },
    { id: 4, fecha: '2026-05-20', concepto: 'Consultoría TI', categoria: 'Servicios', tipo: 'ingreso', monto: 45000.00, estado: 'Completado' },
  ]);

  const balanceMensual = transacciones.reduce((acc, curr) => {
    return curr.tipo === 'ingreso' ? acc + curr.monto : acc - curr.monto;
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
          <h3>Balance Mensual</h3>
          <h2 className={balanceMensual >= 0 ? 'text-success' : 'text-danger'}>
            Bs {balanceMensual.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Historial de Transacciones</h3>
        <div className="table-responsive">
          <table className="workday-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Categoría</th>
                <th>Monto</th>
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
                    {tx.tipo === 'ingreso' ? '+' : '-'} Bs {tx.monto.toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-badge ${tx.estado.toLowerCase()}`}>
                      {tx.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

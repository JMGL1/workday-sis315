import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Planificacion = () => {
  const [presupuestoQ1, setPresupuestoQ1] = useState(150000);
  const [presupuestoQ2, setPresupuestoQ2] = useState(165000);

  const data = {
    labels: ['Q1', 'Q2', 'Q3 (Proyectado)', 'Q4 (Proyectado)'],
    datasets: [
      {
        label: 'Presupuesto (Bs)',
        data: [presupuestoQ1, presupuestoQ2, 180000, 200000],
        backgroundColor: 'rgba(0, 90, 156, 0.7)',
      },
      {
        label: 'Gasto Real (Bs)',
        data: [145000, 160000, null, null],
        backgroundColor: 'rgba(46, 125, 50, 0.7)',
      }
    ],
  };

  const handleGuardar = () => {
    alert('Planificación guardada exitosamente.');
  };

  return (
    <div className="planificacion-page">
      <div className="page-header">
        <div>
          <h1>Planificación Adaptativa</h1>
          <p>Proyección financiera y presupuestos</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">Proyección Trimestral</h3>
        <div style={{ height: '300px' }}>
          <Bar data={data} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Ajuste de Presupuesto Activo</h3>
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
          <div className="form-group">
            <label>Presupuesto Q1 (Bs)</label>
            <input type="number" value={presupuestoQ1} onChange={e => setPresupuestoQ1(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Presupuesto Q2 (Bs)</label>
            <input type="number" value={presupuestoQ2} onChange={e => setPresupuestoQ2(Number(e.target.value))} />
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleGuardar}>Guardar Proyección</button>
      </div>
    </div>
  );
};

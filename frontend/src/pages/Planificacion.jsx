import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
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
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch('/api/planificacion/presupuestos');
        setPresupuestos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: presupuestos.map(p => p.trimestre),
    datasets: [
      {
        label: 'Presupuesto Asignado (Bs)',
        data: presupuestos.map(p => parseFloat(p.monto_asignado)),
        backgroundColor: 'rgba(0, 90, 156, 0.8)',
      },
      {
        label: 'Gasto Real (Bs)',
        data: presupuestos.map(p => parseFloat(p.gasto_real)),
        backgroundColor: 'rgba(46, 125, 50, 0.8)',
      }
    ],
  };

  const handleGuardar = () => {
    alert('Planificación guardada (Simulado)');
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
        {loading ? <p>Cargando datos...</p> : (
        <div style={{ height: '300px' }}>
          <Bar data={data} options={{ maintainAspectRatio: false }} />
        </div>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Ajuste de Presupuesto Activo</h3>
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
          {presupuestos.slice(0, 2).map((p, idx) => (
            <div className="form-group" key={idx}>
              <label>Presupuesto {p.trimestre} (Bs)</label>
              <input type="number" defaultValue={parseFloat(p.monto_asignado)} />
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{marginTop: '15px'}} onClick={handleGuardar}>Guardar Proyección</button>
      </div>
    </div>
  );
};

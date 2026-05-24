import React from 'react';
import './Dashboard.css';
import { Users, DollarSign, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard = () => {
  const { user } = useAuth();

  const lineChartData = {
    labels: ['01', '05', '10', '15', '20', '25', '30'],
    datasets: [
      {
        label: 'Gastos',
        data: [25000, 45000, 42000, 75000, 120000, 110000, 135000],
        borderColor: '#0073E6',
        backgroundColor: 'rgba(0, 115, 230, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ['Recursos Humanos', 'Finanzas', 'Tecnología', 'Operaciones', 'Marketing'],
    datasets: [
      {
        data: [45, 60, 80, 40, 20],
        backgroundColor: [
          '#005A9C', // RRHH
          '#2E7D32', // Finanzas
          '#7B1FA2', // Tecnologia
          '#F57C00', // Operaciones
          '#00BCD4', // Marketing
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenid{user?.username?.endsWith('a') ? 'a' : 'o'}, {user?.username}</h1>
        <p>Resumen general de tu organización</p>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon bg-blue-light">
            <Users size={24} color="var(--color-primary)" />
          </div>
          <div className="metric-info">
            <span className="metric-title">Empleados Activos</span>
            <span className="metric-value">245</span>
            <span className="metric-trend positive">↑ 12 este mes</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon bg-green-light">
            <DollarSign size={24} color="var(--color-accent-green)" />
          </div>
          <div className="metric-info">
            <span className="metric-title">Gastos del Mes</span>
            <span className="metric-value">Bs 154,250</span>
            <span className="metric-trend negative">↓ 8% vs mes anterior</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-orange-light">
            <Calendar size={24} color="var(--color-accent-orange)" />
          </div>
          <div className="metric-info">
            <span className="metric-title">Ausencias Hoy</span>
            <span className="metric-value">18</span>
            <span className="metric-link orange">Ver detalles</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon bg-purple-light">
            <FileText size={24} color="var(--color-accent-purple)" />
          </div>
          <div className="metric-info">
            <span className="metric-title">Nómina del Mes</span>
            <span className="metric-value">Bs 98,780</span>
            <span className="metric-status success">Pagada</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Gráfico de Gastos</h3>
            <select className="card-select">
              <option>Este mes</option>
            </select>
          </div>
          <div className="chart-placeholder" style={{ backgroundColor: 'transparent' }}>
             <Line data={lineChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="card pie-card">
          <h3 className="card-title">Empleados por Departamento</h3>
          <div className="chart-placeholder" style={{ backgroundColor: 'transparent' }}>
            <Pie data={pieChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

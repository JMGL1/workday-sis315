import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';
import './Hcm.css';

export const Hcm = () => {
  const [empleados, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real scenario, this would fetch from the PHP backend:
    // fetch('http://localhost:8000/api/hcm/empleados').then(r => r.json())
    const mockData = [
      { id: 1, nombre: 'Juan Pérez', cargo: 'Desarrollador', departamento: 'Tecnología', fechaIngreso: '15/01/2024', estado: 'Activo' },
      { id: 2, nombre: 'Ana López', cargo: 'Analista Financiero', departamento: 'Finanzas', fechaIngreso: '20/02/2024', estado: 'Activo' },
      { id: 3, nombre: 'Carlos Gómez', cargo: 'Gerente de RRHH', departamento: 'Recursos Humanos', fechaIngreso: '10/03/2024', estado: 'Activo' },
      { id: 4, nombre: 'Lucía Ramírez', cargo: 'Diseñadora UX', departamento: 'Marketing', fechaIngreso: '05/04/2024', estado: 'Activo' },
    ];
    setEmpleados(mockData);
  }, []);

  const filteredEmpleados = empleados.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hcm-page">
      <div className="page-header">
        <div>
          <h1>Directorio de Empleados</h1>
          <p>Gestiona el talento de tu organización</p>
        </div>
        <button className="btn btn-primary flex-center gap-2">
          <Plus size={18} /> Nuevo Empleado
        </button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="search-container table-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o departamento..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="workday-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Fecha Ingreso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpleados.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-small">{emp.nombre.charAt(0)}</div>
                      <span className="user-name">{emp.nombre}</span>
                    </div>
                  </td>
                  <td>{emp.cargo}</td>
                  <td>{emp.departamento}</td>
                  <td>{emp.fechaIngreso}</td>
                  <td>
                    <span className={`status-badge ${emp.estado.toLowerCase()}`}>
                      {emp.estado}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredEmpleados.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">No se encontraron empleados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

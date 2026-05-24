import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import './Hcm.css';

export const Hcm = () => {
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    departamento: 'TI',
    cargo: '',
    salario_base: 0
  });

  const fetchEmpleados = async (search = '') => {
    try {
      setLoading(true);
      const url = search ? `/api/hcm/empleados?search=${encodeURIComponent(search)}` : '/api/hcm/empleados';
      const data = await apiFetch(url);
      setEmpleados(data);
    } catch (error) {
      console.error('Error fetching empleados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmpleados(busqueda);
  };

  const handleCrearEmpleado = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/hcm/empleados', {
        method: 'POST',
        body: JSON.stringify(nuevoEmpleado)
      });
      setShowModal(false);
      setNuevoEmpleado({ nombre: '', departamento: 'TI', cargo: '', salario_base: 0 });
      fetchEmpleados(); // Refresh list
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="hcm-page">
      <div className="page-header">
        <div>
          <h1>Directorio de Empleados</h1>
          <p>Gestión del capital humano de la organización</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nuevo Empleado
        </button>
      </div>

      <div className="card hcm-search">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Buscar por nombre, cargo o departamento..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Buscar</button>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando empleados...</p>
        ) : (
          <div className="table-responsive">
            <table className="workday-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Departamento</th>
                  <th>Cargo</th>
                  <th>Salario Base (Bs)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">{emp.nombre.charAt(0)}</div>
                        <strong>{emp.nombre}</strong>
                      </div>
                    </td>
                    <td>{emp.departamento}</td>
                    <td>{emp.cargo}</td>
                    <td>Bs {parseFloat(emp.salario_base).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${emp.estado.toLowerCase()}`}>
                        {emp.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registrar Nuevo Empleado</h2>
            <form onSubmit={handleCrearEmpleado} className="nomina-form">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" value={nuevoEmpleado.nombre} onChange={e => setNuevoEmpleado({...nuevoEmpleado, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Departamento</label>
                <select value={nuevoEmpleado.departamento} onChange={e => setNuevoEmpleado({...nuevoEmpleado, departamento: e.target.value})}>
                  <option value="TI">Tecnología (TI)</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <input type="text" value={nuevoEmpleado.cargo} onChange={e => setNuevoEmpleado({...nuevoEmpleado, cargo: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Salario Base Mensual (Bs)</label>
                <input type="number" value={nuevoEmpleado.salario_base} onChange={e => setNuevoEmpleado({...nuevoEmpleado, salario_base: e.target.value})} required />
              </div>
              <div className="modal-actions" style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

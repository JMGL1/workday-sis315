import React, { useState } from 'react';
import './Nomina.css';

export const Nomina = () => {
  const [horas, setHoras] = useState(160);
  const [tarifa, setTarifa] = useState(50);
  const [deducciones, setDeducciones] = useState(15);
  const [resultado, setResultado] = useState(null);

  const calcularNomina = (e) => {
    e.preventDefault();
    // Simulate POST /api/payroll/calculate
    const bruto = horas * tarifa;
    const desc = bruto * (deducciones / 100);
    const neto = bruto - desc;
    setResultado({ bruto, neto, desc });
  };

  const aprobarNomina = () => {
    // Simulate POST /api/payroll/approve
    alert('Nómina aprobada y registrada en Finanzas exitosamente.');
    setResultado(null);
  };

  return (
    <div className="nomina-page">
      <div className="page-header">
        <div>
          <h1>Cálculo de Nómina</h1>
          <p>Liquidación de sueldos en tiempo real</p>
        </div>
      </div>

      <div className="nomina-container">
        <div className="card form-card">
          <h3 className="card-title">Parámetros de Cálculo</h3>
          <form onSubmit={calcularNomina} className="nomina-form">
            <div className="form-group">
              <label>Horas Trabajadas</label>
              <input type="number" value={horas} onChange={e => setHoras(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tarifa por Hora (Bs)</label>
              <input type="number" value={tarifa} onChange={e => setTarifa(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Porcentaje Deducciones (%)</label>
              <input type="number" value={deducciones} onChange={e => setDeducciones(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Calcular Bruto/Neto</button>
          </form>
        </div>

        {resultado && (
          <div className="card result-card">
            <h3 className="card-title">Resumen de Liquidación</h3>
            <div className="result-row">
              <span>Salario Bruto:</span>
              <strong>Bs {resultado.bruto.toLocaleString()}</strong>
            </div>
            <div className="result-row">
              <span>Total Deducciones:</span>
              <strong className="text-danger">- Bs {resultado.desc.toLocaleString()}</strong>
            </div>
            <hr className="divider" />
            <div className="result-row total">
              <span>Salario Neto a Pagar:</span>
              <strong className="text-success">Bs {resultado.neto.toLocaleString()}</strong>
            </div>
            <button onClick={aprobarNomina} className="btn btn-primary mt-4 w-100">
              Aprobar y Emitir Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

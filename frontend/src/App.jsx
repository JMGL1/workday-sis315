import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Hcm } from './pages/Hcm';
import { Reclutamiento } from './pages/Reclutamiento';
import { Talento } from './pages/Talento';
import { Finanzas } from './pages/Finanzas';
import { Nomina } from './pages/Nomina';
import { Asistencia } from './pages/Asistencia';
import { Gastos } from './pages/Gastos';
import { Inventario } from './pages/Inventario';
import { Planificacion } from './pages/Planificacion';
import { Configuracion } from './pages/Configuracion';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="hcm" element={<Navigate to="/hcm/empleados" replace />} />
        <Route path="hcm/empleados" element={<Hcm />} />
        <Route path="finanzas" element={<Finanzas />} />
        <Route path="nomina" element={<Nomina />} />
        <Route path="reclutamiento" element={<Reclutamiento />} />
        <Route path="talento" element={<Talento />} />
        <Route path="asistencia" element={<Asistencia />} />
        <Route path="gastos" element={<Gastos />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="planificacion" element={<Planificacion />} />
        <Route path="reportes" element={<Navigate to="/" replace />} /> {/* Analytics covered in Dashboard */}
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

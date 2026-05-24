import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Mock login based on user input
    // Roles: Administrador, RRHH, Finanzas, Gerente, Empleado
    let role = 'Empleado';
    if (username.toLowerCase().includes('admin')) role = 'Administrador';
    else if (username.toLowerCase().includes('rrhh')) role = 'RRHH';
    else if (username.toLowerCase().includes('finanzas')) role = 'Finanzas';
    else if (username.toLowerCase().includes('gerente')) role = 'Gerente';

    setUser({
      name: username || 'Usuario Demo',
      role: role,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

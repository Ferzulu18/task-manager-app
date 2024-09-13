import React, { createContext, useState, useEffect } from 'react';
import {
  isAuthenticated,
  getUser,
  storeLogin,
  clearLogin,
} from '../utils/storage.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());

  // Actualiza el estado de autenticación y el usuario cuando el componente se monta
  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getUser());
  }, []);

  // Maneja el proceso de inicio de sesión
  // Almacena los datos del usuario, actualiza el estado de autenticación y el usuario
  const login = (userData) => {
    storeLogin(userData);
    setAuthenticated(true);
    setUser(userData);
  };

  // Maneja el proceso de cierre de sesión
  // Limpia los datos de inicio de sesión y actualiza el estado de autenticación y el usuario
  const logout = () => {
    clearLogin();
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

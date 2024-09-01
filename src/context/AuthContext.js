import React, { createContext, useState, useEffect } from 'react';
import {
  isAuthenticated,
  getUser,
  storeLogin,
  clearLogin,
} from '../utils/authUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getUser());
  }, []);

  const login = (userData) => {
    storeLogin(userData);
    setAuthenticated(true);
    setUser(userData);
  };

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

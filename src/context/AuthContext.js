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

  // console.log('init', 'authenticated', authenticated, 'user', user);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getUser());
  }, []);

  const login = (userData) => {
    storeLogin(userData);
    setAuthenticated(true);
    setUser(userData);
    // console.log('login', 'authenticated', authenticated, 'user', user);
  };

  const logout = () => {
    clearLogin();
    setAuthenticated(false);
    setUser(null);
    // console.log('logout', 'authenticated', authenticated, 'user', user);
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/utils/authUtils.js

// Function to get authentication status
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Function to set authentication status
export const setAuthentication = (status) => {
  localStorage.setItem('isAuthenticated', status ? 'true' : 'false');
};

// Function to retrieve user information
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Function to create user information (logout)
export const storeLogin = (user) => {
  const { password, confirm, ...userWithoutSensitiveInfo } = user;
  localStorage.setItem('user', JSON.stringify(userWithoutSensitiveInfo));
  localStorage.setItem('isAuthenticated', 'true');
};

// Function to clear user information (logout)
export const clearLogin = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  window.location.href = '/users/login';
};

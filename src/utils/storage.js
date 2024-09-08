// Obtiene el status de autenticación (localStorage)
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Guarda el status de autenticación (localStorage)
export const setAuthentication = (status) => {
  localStorage.setItem('isAuthenticated', status ? 'true' : 'false');
};

// Obtiene la información del usuario (localStorage)
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Creación datos de autentición (localStorage)
export const storeLogin = (user) => {
  const { password, confirm, ...userWithoutSensitiveInfo } = user;
  localStorage.setItem('user', JSON.stringify(userWithoutSensitiveInfo));
  localStorage.setItem('isAuthenticated', 'true');
};

// Eliminación datos de autentición (localStorage)
export const clearLogin = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  window.location.href = '/auth/login';
};

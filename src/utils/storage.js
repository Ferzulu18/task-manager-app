// Funciones para gestionar la autenticación y datos del usuario en localStorage

// Verifica si el usuario está autenticado al revisar el valor almacenado en localStorage.
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Guarda el estado de autenticación en localStorage (true/false).
export const setAuthentication = (status) => {
  localStorage.setItem('isAuthenticated', status ? 'true' : 'false');
};

// Recupera la información del usuario almacenada en localStorage.
// Devuelve un objeto JSON si existe, de lo contrario devuelve null.
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Almacena los datos de autenticación en localStorage, excluyendo información sensible como la contraseña.
// Guarda el objeto `user` sin campos sensibles y marca el usuario como autenticado.
export const storeLogin = (user) => {
  const { password, confirm, ...userWithoutSensitiveInfo } = user; // Elimina la contraseña y la confirmación
  localStorage.setItem('user', JSON.stringify(userWithoutSensitiveInfo)); // Almacena los datos del usuario
  localStorage.setItem('isAuthenticated', 'true'); // Marca al usuario como autenticado
};

// Limpia los datos de autenticación del usuario en localStorage y redirige a la página de inicio de sesión.
export const clearLogin = () => {
  localStorage.removeItem('user'); // Elimina los datos del usuario
  localStorage.removeItem('isAuthenticated'); // Elimina el estado de autenticación
  window.location.href = '/auth/login'; // Redirige a la página de login
};

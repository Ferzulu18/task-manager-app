import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { handleExcept } from '../utils/error.js';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/data`;
const apiSendUrl = `${process.env.REACT_APP_API_URL}/api/send`;
const mailApiToken = process.env.REACT_APP_MAIL_TOKEN || 'token-not-found';

// Función para obtener un usuario por su correo electrónico.
// Se usa para recuperar detalles del usuario que coincide con el correo proporcionado.
const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      params: { email },
    });
    return response.data[0];
  } catch (error) {
    handleExcept('EXC008', error); // Maneja errores específicos de la búsqueda de usuario.
  }
};

// Función para actualizar la contraseña de un usuario.
// Primero obtiene al usuario por correo, luego actualiza la contraseña si el usuario es encontrado.
const updatePassword = async (email, newPassword) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      handleExcept(undefined, Error('Usuario no encontrado')); // Maneja el caso en que el usuario no se encuentra.
    }

    const response = await axios.patch(`${apiUrl}/users/${user.id}`, {
      password: newPassword,
    });

    return response;
  } catch (error) {
    handleExcept('EXC012', error); // Maneja errores relacionados con la actualización de la contraseña.
  }
};

// Función para registrar un nuevo usuario en la base de datos.
// Excluye la información sensible del usuario antes de realizar la solicitud.
export const registerUser = async (userData) => {
  try {
    const { confirm, ...userWithoutSensitiveInfo } = userData;
    const response = await axios.post(`${apiUrl}/users`, {
      ...userWithoutSensitiveInfo,
      role: 'user',
    });
    return response;
  } catch (error) {
    handleExcept('EXC009', error); // Maneja errores específicos de registro de usuario.
  }
};

// Función para autenticar a un usuario usando su correo y contraseña.
// Verifica que el usuario exista y que las credenciales coincidan.
export const loginUser = async ({ email, password }) => {
  try {
    const user = await getUserByEmail(email);

    // Verifica que el usuario y la contraseña coincidan
    if (!user || user.email !== email || user.password !== password) {
      return null; // Retorna null si las credenciales no son válidas.
    }

    return user;
  } catch (error) {
    handleExcept(undefined, error); // Maneja errores durante el inicio de sesión.
  }
};

// Función para recuperar la contraseña de un usuario.
// Genera un token único, lo almacena y envía un enlace de recuperación por correo electrónico.
export const recoverPassword = async (email) => {
  try {
    const token = generateUniqueToken(); // Genera un token UUID para recuperación de contraseña.
    const response = await axios.post(`${apiUrl}/tokens`, {
      token: token,
      email: email,
    });

    if (response.status !== 201) {
      handleExcept(
        'EXC014',
        Error(`${response.status}: ${response.statusText}`)
      ); // Maneja errores al crear el token.
    }

    // Envía el enlace de recuperación al correo electrónico del usuario
    const url = `${process.env.REACT_APP_API_URL}/auth/reset?token=${token}`;
    const responseSend = await axios.post(`${apiSendUrl}/reset`, {
      url: url,
      email: email,
      token: mailApiToken,
    });

    if (responseSend.status !== 200) {
      handleExcept(
        undefined,
        Error(`${responseSend.status}: ${responseSend.data.error}`)
      ); // Maneja errores al enviar el correo de recuperación.
    }
  } catch (error) {
    handleExcept('EXC013', error); // Maneja errores durante el proceso de recuperación de contraseña.
  }
};

// Función para restablecer la contraseña usando un token de recuperación.
// Verifica el token, actualiza la contraseña y elimina el token temporalmente.
export const resetPassword = async (token, newPassword) => {
  let tokenData;
  try {
    const response = await axios.get(`${apiUrl}/tokens`, {
      params: { token },
    });
    tokenData = response.data[0];

    if (!tokenData || !tokenData.token || !tokenData.email) {
      handleExcept(undefined, Error('Token inválido')); // Maneja el caso en que el token no es válido.
    }

    // Verifica la existencia del usuario asociado al token
    const user = await getUserByEmail(tokenData.email);
    if (!user) {
      handleExcept(undefined, Error('Usuario no encontrado')); // Maneja el caso en que el usuario no se encuentra.
    }

    // Actualiza la contraseña del usuario
    await updatePassword(tokenData.email, newPassword);
  } catch (error) {
    handleExcept(undefined, error); // Maneja errores durante el proceso de restablecimiento de contraseña.
  } finally {
    // Elimina el token temporalmente para evitar su reutilización.
    if (tokenData) {
      try {
        await axios.delete(`${apiUrl}/tokens/${tokenData?.id}`);
      } catch (deleteError) {
        console.error('Error al eliminar el token:', deleteError); // Maneja errores al eliminar el token.
      }
    }
  }
};

// Función para generar un token UUID 4 único para recuperación de contraseña.
const generateUniqueToken = () => {
  return uuidv4();
};

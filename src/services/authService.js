import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { handleExcept } from '../utils/error.js';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/data`;
const apiSendUrl = `${process.env.REACT_APP_API_URL}/api/send`;
const mailApiToken = process.env.REACT_APP_MAIL_TOKEN || 'token-not-found';

const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      params: { email },
    });
    return response.data[0];
  } catch (error) {
    handleExcept('EXC008', error);
  }
};

const updatePassword = async (email, newPassword) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      handleExcept(undefined, Error('Usuario no encontrado'));
    }

    const response = await axios.patch(`${apiUrl}/users/${user.id}`, {
      password: newPassword,
    });

    return response;
  } catch (error) {
    handleExcept('EXC012', error);
  }
};

export const registerUser = async (userData) => {
  try {
    const { confirm, ...userWithoutSensitiveInfo } = userData;
    const response = await axios.post(`${apiUrl}/users`, {
      ...userWithoutSensitiveInfo,
      role: 'user',
    });
    return response;
  } catch (error) {
    handleExcept('EXC009', error);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const user = await getUserByEmail(email);

    // Encontrar usuario por email y password
    if (!user || user.email !== email || user.password !== password) {
      return null;
    }

    return user;
  } catch (error) {
    handleExcept(undefined, error);
  }
};

export const recoverPassword = async (email) => {
  try {
    const token = generateUniqueToken();
    const response = await axios.post(`${apiUrl}/tokens`, {
      token: token,
      email: email,
    });
    if (response.status !== 201) {
      handleExcept(
        'EXC014',
        Error(`${response.status}: ${response.statusText}`)
      );
    }
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
      );
    }
  } catch (error) {
    handleExcept('EXC013', error);
  }
};

export const resetPassword = async (token, newPassword) => {
  let tokenData;
  try {
    const response = await axios.get(`${apiUrl}/tokens`, {
      params: { token },
    });
    tokenData = response.data[0];

    if (!tokenData || !tokenData.token || !tokenData.email) {
      handleExcept(undefined, Error('Token inválido'));
    }

    // Validar el token verificando que existe el usuario.
    const user = await getUserByEmail(tokenData.email);
    if (!user) {
      handleExcept(undefined, Error('Usuario no encontrado'));
    }

    // Actualización del password
    await updatePassword(tokenData.email, newPassword);
  } catch (error) {
    handleExcept(undefined, error);
  } finally {
    // Siempre se debe eliminar el token (temporal).
    if (tokenData) {
      try {
        await axios.delete(`${apiUrl}/tokens/${tokenData?.id}`);
      } catch (deleteError) {
        console.error('Error al eliminar el token:', deleteError);
      }
    }
  }
};

// Función para generar un token UUID 4
const generateUniqueToken = () => {
  return uuidv4();
};

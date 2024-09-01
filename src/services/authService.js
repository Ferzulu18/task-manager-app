import axios from 'axios';
import { handleExcept } from '../utils/errorUtils';
import { sendPasswordReset, generateUniqueToken } from '../utils/mailtrapUtils';

const API_URL = 'http://localhost:5000';

const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
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

    const response = await axios.patch(`${API_URL}/users/${user.id}`, {
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
    const response = await axios.post(`${API_URL}/users`, {
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

export const sendResetPassword = async (email) => {
  try {
    const token = generateUniqueToken();
    const response = await axios.post(`${API_URL}/tokens`, {
      token: token,
      email: email,
    });
    if (response.status !== 201) {
      handleExcept(
        'EXC014',
        Error(`${response.status}: ${response.statusText}`)
      );
    }
    await sendPasswordReset(token, email);
  } catch (error) {
    handleExcept('EXC013', error);
  }
};

export const resetPassword = async (token, newPassword) => {
  let tokenData;
  try {
    const response = await axios.get(`${API_URL}/tokens`, {
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
        await axios.delete(`${API_URL}/tokens/${tokenData.id}`);
      } catch (deleteError) {
        console.error('Error al eliminar el token:', deleteError);
      }
    }
  }
};

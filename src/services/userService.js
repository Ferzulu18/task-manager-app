// src/services/userService.js
import axios from 'axios';
import { sendPasswordReset, generateUniqueToken } from '../utils/mailtrapUtils';

const API_URL = 'http://localhost:5000/users';
const API_URL_TOKEN = 'http://localhost:5000/tokens';

const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { email },
    });
    return response.data[0];
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw new Error('Error al obtener el usuario');
  }
};

const updatePassword = async (email, newPassword) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const response = await axios.patch(`${API_URL}/${user.id}`, {
      password: newPassword,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const { confirm, ...userWithoutSensitiveInfo } = userData;
    const response = await axios.post(API_URL, {
      ...userWithoutSensitiveInfo,
      role: 'user',
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const user = await getUserByEmail(email);
    // console.log(user);

    // Find user with matching email and password
    if (!user || user.email !== email || user.password !== password) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const sendResetPassword = async (email) => {
  try {
    const token = generateUniqueToken();
    const response = await axios.post(API_URL_TOKEN, {
      token: token,
      email: email,
    });
    if (response.status !== 201) {
      throw new Error('Error al registrar token de recuperación');
    }
    await sendPasswordReset(token, email);
  } catch (error) {
    throw new Error('Error al enviar el correo de recuperación');
  }
};

export const resetPassword = async (token, newPassword) => {
  let tokenData;
  try {
    // Get token data
    const response = await axios.get(`${API_URL_TOKEN}`, {
      params: { token },
    });
    tokenData = response.data[0];

    if (!tokenData || !tokenData.token || !tokenData.email) {
      throw new Error('Token inválido');
    }

    // Validate token by checking if user exists
    const user = await getUserByEmail(tokenData.email);
    if (!user) {
      throw new Error('Token inválido: el usuario no existe');
    }

    // Update the password
    await updatePassword(tokenData.email, newPassword);
  } catch (error) {
    throw error;
  } finally {
    // Always delete the token
    if (tokenData) {
      try {
        await axios.delete(`${API_URL_TOKEN}/${tokenData.id}`);
      } catch (deleteError) {
        console.error('Error al eliminar el token:', deleteError);
      }
    }
  }
};

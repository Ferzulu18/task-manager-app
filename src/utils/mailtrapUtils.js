import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { handleExcept } from '../utils/errorUtils';
import { getResetContent, getContactContent } from './mailtrapHtml';

const MAILTRAP_API_TOKEN = '12ea43caa140dbcc8d339d1aefc48a13';
const MAILTRAP_API_URL = '/api/send/2069213';
const MAILTRAP_SENDER_NAME = 'Task Manager Admin';
const MAILTRAP_SENDER_EMAIL = 'admin@example.com';

// Función para generar un token UUID 4
export const generateUniqueToken = () => {
  return uuidv4();
};

export const sendPasswordReset = async (token, email) => {
  try {
    const resetURL = `http://localhost:3000/auth/reset?token=${token}`;
    const response = await axios.post(
      MAILTRAP_API_URL,
      {
        from: { email: MAILTRAP_SENDER_EMAIL, name: MAILTRAP_SENDER_NAME },
        to: [{ email: email }],
        subject: 'Recuperación de Contraseña',
        html: getResetContent(resetURL),
        category: 'password_reset',
      },
      {
        headers: {
          Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      handleExcept(
        undefined,
        Error(`Error al enviar el correo: ${response.statusText}`)
      );
    }
  } catch (error) {
    handleExcept(
      undefined,
      Error(`Error al enviar el correo de recuperación: ${error}`)
    );
  }
};

export const sendContactEmail = async (contactData) => {
  try {
    const response = await axios.post(
      MAILTRAP_API_URL,
      {
        from: { email: MAILTRAP_SENDER_EMAIL, name: MAILTRAP_SENDER_NAME },
        to: [{ email: 'admin@example.com' }],
        subject: 'Nuevo Mensaje de Contacto',
        html: getContactContent(contactData),
        category: 'contact_us',
      },
      {
        headers: {
          Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      handleExcept(
        undefined,
        Error(`Error al enviar el correo: ${response.statusText}`)
      );
    }
  } catch (error) {
    handleExcept(
      undefined,
      Error(`Error al enviar el correo de contacto: ${error}`)
    );
  }
};

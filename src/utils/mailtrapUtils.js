import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { getResetContent, getContactContent } from './mailtrapHtml';

const MAILTRAP_API_TOKEN = '12ea43caa140dbcc8d339d1aefc48a13';
const MAILTRAP_API_URL = '/api/send/2069213';
const MAILTRAP_SENDER_NAME = 'Task Manager Admin';
const MAILTRAP_SENDER_EMAIL = 'admin@example.com';

// Función para generar un token
export const generateUniqueToken = () => {
  return uuidv4(); // Genera un UUID versión 4
};

export const sendPasswordReset = async (token, email) => {
  try {
    const response = await axios.post(
      MAILTRAP_API_URL,
      {
        from: { email: MAILTRAP_SENDER_EMAIL, name: MAILTRAP_SENDER_NAME },
        to: [{ email: email }],
        subject: 'Recuperación de Contraseña',
        html: getResetContent(token),
        category: 'Password Reset',
      },
      {
        headers: {
          Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      console.error(`Error al enviar el correo: ${response.statusText}`);
      throw new Error(`Error al enviar el correo: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    throw new Error('Error al enviar el correo de recuperación');
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
        category: 'Contact Us', // Puedes ajustar o eliminar esto según tus necesidades
      },
      {
        headers: {
          Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      console.error(`Error al enviar el correo: ${response.statusText}`);
      throw new Error(`Error al enviar el correo: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al enviar el correo de contacto:', error);
    throw new Error('Error al enviar el correo de contacto');
  }
};

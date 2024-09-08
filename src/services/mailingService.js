import axios from 'axios';
import { handleExcept } from '../utils/error.js';
import { getResetContent, getContactContent } from '../utils/templates.js';

const mailApiUrl = 'https://sandbox.api.mailtrap.io/api/send/2243846';
const mailSenderName = 'Task Manager Admin';
const mailSenderEmail = 'admin@example.com';

export const sendResetPassword = async (resetData) => {
  const { url, email, token } = resetData;

  try {
    const response = await axios.post(
      mailApiUrl,
      {
        from: {
          email: mailSenderEmail,
          name: mailSenderName,
        },
        to: [{ email: email }],
        subject: 'Recuperación de Contraseña',
        html: getResetContent(url),
        category: 'password_reset',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
  const { name, email, subject, message, token } = contactData;

  try {
    const response = await axios.post(
      mailApiUrl,
      {
        from: {
          email: mailSenderEmail,
          name: mailSenderName,
        },
        to: [{ email: mailSenderEmail }],
        subject: 'Nuevo Mensaje de Contacto',
        html: getContactContent(name, email, subject, message),
        category: 'contact_us',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

import axios from 'axios';
import { handleExcept } from '../utils/error.js';
import { getResetContent, getContactContent } from '../utils/templates.js';

const mailApiUrl = 'https://sandbox.api.mailtrap.io/api/send/2243846';
const mailSenderName = 'Task Manager Admin';
const mailSenderEmail = 'admin@example.com';

// Función para enviar un correo de recuperación de contraseña.
// Envía un correo al usuario con un enlace para restablecer su contraseña.
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

    // Verifica si la respuesta del servidor es exitosa (código de estado 200).
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

// Función para enviar un correo de contacto desde el usuario.
// Envía un mensaje de contacto al administrador del sistema.
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

    // Verifica si la respuesta del servidor es exitosa (código de estado 200).
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

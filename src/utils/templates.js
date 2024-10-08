// Genera contenido HTML para emails específicos como recuperación de contraseña y mensajes de contacto.
// Estas funciones retornan una estructura HTML personalizada que puede ser enviada a los usuarios vía email.

export const getResetContent = (url) => {
  // Genera el contenido HTML para el correo de recuperación de contraseña.
  // La URL proporcionada es la que se utilizará para cambiar la contraseña del usuario.
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperación de Contraseña</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333333;
        }
        p {
          color: #555555;
          font-size: 16px;
        }
        a {
          color: #1a73e8;
          text-decoration: none;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          font-size: 16px;
          color: #ffffff;
          background-color: #1a73e8;
          border-radius: 5px;
          text-decoration: none;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #888888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Recuperación de Contraseña</h1>
        <p>Hola,</p>
        <p>Has solicitado recuperar tu contraseña. Para cambiar tu contraseña, por favor haz clic en el siguiente botón:</p>
        <a href="${url}" class="button" target="_blank">Cambiar Contraseña</a>
        <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>
        <div class="footer">
          <p>Gracias,<br>El equipo de Task Manager</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

export const getContactContent = (name, email, subject, message) => {
  // Genera el contenido HTML para el correo de notificación de un nuevo mensaje de contacto.
  // Los parámetros incluyen el nombre del remitente, email, asunto y mensaje.
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Mensaje de Contacto</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333333;
        }
        p {
          color: #555555;
          font-size: 16px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #888888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Nuevo Mensaje de Contacto</h1>
        <p><strong>Nombre Completo:</strong> ${name}</p>
        <p><strong>Correo Electrónico:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
        <div class="footer">
          <p>Gracias,<br>El equipo de Task Manager</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

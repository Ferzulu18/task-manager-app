import express from 'express';
import path from 'path';
import cors from 'cors';
import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import {
  sendResetPassword,
  sendContactEmail,
} from './src/services/mailingService.js';

// Definir el puerto para la API o usar el puerto 5000 por defecto
const apiDataPort = process.env.PORT || 5000;

// Rutas específicas para las APIs de datos, recuperación de contraseña y contacto
const apiDataRoute = '/api/data';
const apiResetRoute = '/api/send/reset';
const apiContactRoute = '/api/send/contact';

// Obtener el nombre de archivo y directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Crear instancia de Express para manejar las solicitudes HTTP
const server = jsonServer.create(); // Crear un servidor JSON simulado para datos de ejemplo
const router = jsonServer.router('db.json'); // Definir la fuente de datos como el archivo 'db.json'
const middlewares = jsonServer.defaults(); // Usar middlewares por defecto para el servidor JSON

server.use(middlewares); // Aplicar middlewares al servidor JSON
server.use(router); // Aplicar el enrutador JSON al servidor

// Configurar middleware de CORS para permitir peticiones desde otros dominios
app.use(cors());

// Habilitar parsing de JSON en las solicitudes entrantes
app.use(express.json());

// Definir la ruta de la API de datos que utilizará el servidor JSON
app.use(apiDataRoute, server);

// Ruta para enviar email de recuperación de contraseña
app.post(apiResetRoute, async (req, res) => {
  const resetData = req.body; // Obtener los datos del cuerpo de la solicitud

  try {
    // Llamar al servicio para enviar el correo de recuperación
    await sendResetPassword(resetData);
    res.status(200).json({ message: 'Email de recuperación enviado.' }); // Responder con éxito
  } catch (error) {
    // Manejar errores y responder con estado 500
    res.status(500).json({ error: error.message });
  }
});

// Ruta para enviar email de contacto
app.post(apiContactRoute, async (req, res) => {
  const contactData = req.body; // Obtener los datos del cuerpo de la solicitud

  try {
    // Llamar al servicio para enviar el correo de contacto
    await sendContactEmail(contactData);
    res.status(200).json({ message: 'Email de contacto enviado.' }); // Responder con éxito
  } catch (error) {
    // Manejar errores y responder con estado 500
    res.status(500).json({ error: error.message });
  }
});

// Servir archivos estáticos de la carpeta 'build' (React frontend)
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (_, res) => {
  // Servir el archivo HTML principal en cualquier otra ruta no especificada
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar el servidor y escuchar en el puerto configurado
app.listen(apiDataPort, () => {
  console.log(`Server is running on port ${apiDataPort}`);
});

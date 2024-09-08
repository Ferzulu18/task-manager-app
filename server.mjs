import express from 'express';
import path from 'path';
import cors from 'cors';
import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import {
  sendResetPassword,
  sendContactEmail,
} from './src/services/mailingService.js';

const apiDataPort = process.env.PORT || 5000;
const apiDataRoute = '/api/data';
const apiResetRoute = '/api/send/reset';
const apiContactRoute = '/api/send/contact';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

app.use(cors());
app.use(express.json());

app.use(apiDataRoute, server);

// Ruta para enviar email de recuperación de contraseña
app.post(apiResetRoute, async (req, res) => {
  const resetData = req.body;

  try {
    await sendResetPassword(resetData);
    res.status(200).json({ message: 'Email de recuperación enviado.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para enviar email de contacto
app.post(apiContactRoute, async (req, res) => {
  const contactData = req.body;

  try {
    await sendContactEmail(contactData);
    res.status(200).json({ message: 'Email de contacto enviado.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servir archivos estáticos de la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Escuchar en el puerto configurado
app.listen(apiDataPort, () => {
  console.log(`Server is running on port ${apiDataPort}`);
});

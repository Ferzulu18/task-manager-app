import axios from 'axios';
import { handleExcept } from '../utils/error.js';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/data`;
const apiSendUrl = `${process.env.REACT_APP_API_URL}/api/send`;
const mailApiToken = process.env.REACT_APP_MAIL_TOKEN || 'token-not-found';

// Función para obtener todas las tareas asociadas a un usuario específico.
// Realiza una solicitud GET al endpoint de tareas filtrando por el ID del usuario.
export const fetchTasks = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/tasks`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    handleExcept('EXC001', error);
  }
};

// Función para crear una nueva tarea.
// Envía los datos de la tarea al servidor con el estado inicial 'todo'.
export const createTask = async (task) => {
  try {
    const response = await axios.post(`${apiUrl}/tasks`, {
      ...task,
      status: 'todo',
    });
    return response.data;
  } catch (error) {
    handleExcept('EXC002', error);
  }
};

// Función para modificar una tarea existente.
// Actualiza los campos especificados de una tarea identificada por su ID.
export const updateTask = async (taskId, updates) => {
  try {
    const response = await axios.patch(`${apiUrl}/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    handleExcept('EXC003', error);
  }
};

// Función para modificar el estado de una tarea.
// Actualiza el estado de una tarea identificada por su ID.
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.patch(`${apiUrl}/tasks/${taskId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    handleExcept('EXC005', error);
  }
};

// Función para eliminar una tarea.
// Envía una solicitud DELETE para eliminar una tarea identificada por su ID.
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${apiUrl}/tasks/${taskId}`);
  } catch (error) {
    handleExcept('EXC004', error);
  }
};

// Función para verificar si el límite de tareas para un usuario ha sido alcanzado.
// Verifica si el número de tareas del usuario es igual o superior a 50.
export const checkTaskLimit = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/tasks`, {
      params: { userId },
    });
    const tasks = response.data;
    return tasks.length >= 50;
  } catch (error) {
    handleExcept('EXC006', error);
  }
};

// Función para enviar un mensaje de contacto.
// Envía los datos de contacto al servidor de correo con un token de autenticación.
export const sendContact = async (contactData) => {
  try {
    const responseSend = await axios.post(`${apiSendUrl}/contact`, {
      ...contactData,
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

import axios from 'axios';
import { handleExcept } from '../utils/error.js';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/data`;
const apiSendUrl = `${process.env.REACT_APP_API_URL}/api/send`;
const mailApiToken = process.env.REACT_APP_MAIL_TOKEN || 'token-not-found';

// Obtener todas las tareas de un usuario específico
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

// Crear una tarea
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

// Modificar una tarea
export const updateTask = async (taskId, updates) => {
  try {
    const response = await axios.patch(`${apiUrl}/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    handleExcept('EXC003', error);
  }
};

// Modificar el estado de una tarea
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

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${apiUrl}/tasks/${taskId}`);
  } catch (error) {
    handleExcept('EXC004', error);
  }
};

// Verificar el límite de tareas, máximo 50.
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

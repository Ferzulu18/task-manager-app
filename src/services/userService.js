import axios from 'axios';
import { handleExcept } from '../utils/errorUtils';

const API_URL = 'http://localhost:5000';

// Obtener todas las tareas de un usuario específico
export const fetchTasks = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
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
    const response = await axios.post(`${API_URL}/tasks`, {
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
    const response = await axios.patch(`${API_URL}/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    handleExcept('EXC003', error);
  }
};

// Modificar el estado de una tarea
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/tasks/${taskId}`, {
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
    await axios.delete(`${API_URL}/tasks/${taskId}`);
  } catch (error) {
    handleExcept('EXC004', error);
  }
};

// Verificar el límite de tareas, máximo 50.
export const checkTaskLimit = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
      params: { userId },
    });
    const tasks = response.data;
    return tasks.length >= 50;
  } catch (error) {
    handleExcept('EXC006', error);
  }
};

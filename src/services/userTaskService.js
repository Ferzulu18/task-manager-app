import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

// Obtener todas las tareas de un usuario específico
export const fetchTasks = async (userId) => {
  try {
    const response = await axios.get(API_URL, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw error;
  }
};

// Crear una tarea
export const createTask = async (task) => {
  try {
    const response = await axios.post(API_URL, {
      ...task,
      status: 'todo',
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    throw error;
  }
};

// Modificar una tarea
export const updateTask = async (taskId, updates) => {
  try {
    const response = await axios.patch(`${API_URL}/${taskId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error al modificar la tarea:', error);
    throw error;
  }
};

// Modificar el estado de una tarea
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${taskId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error al modificar el estado de la tarea:', error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    throw error;
  }
};

// Verificar el límite de tareas
export const checkTaskLimit = async (userId) => {
  try {
    const response = await axios.get(API_URL, { params: { userId } });
    const tasks = response.data;
    return tasks.length >= 50;
  } catch (error) {
    console.error('Error al verificar el límite de tareas:', error);
    throw error;
  }
};

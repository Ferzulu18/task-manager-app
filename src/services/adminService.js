import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:5000';

export const pageSizeDefault = 10;

// Función para consultar y procesar tareas
export const fetchAndProcessTasks = async (
  filters = {},
  sorter = {},
  pagination = {}
) => {
  try {
    // 1. Traer todas las tareas
    const tasksResponse = await axios.get(`${API_URL}/tasks`);
    let tasks = tasksResponse.data;

    // 2. Filtrar por usuario, título y rango de fechas
    if (filters.user) {
      tasks = tasks.filter(
        (task) =>
          task.userEmail.includes(filters.user) ||
          task.userName.includes(filters.user)
      );
    }
    if (filters.title) {
      tasks = tasks.filter((task) => task.title.includes(filters.title));
    }
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      tasks = tasks.filter((task) => dayjs(task.dueDate).isBetween(start, end));
    }

    // 3. Ordenar las tareas
    if (sorter.field && sorter.order) {
      tasks = tasks.sort((a, b) => {
        if (sorter.order === 'ascend') {
          return a[sorter.field] > b[sorter.field] ? 1 : -1;
        } else {
          return a[sorter.field] < b[sorter.field] ? 1 : -1;
        }
      });
    }

    // 4. Paginación
    const { current = 1, pageSize = pageSizeDefault } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = current * pageSize;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    // 5. Traer todos los usuarios y asociarlos a las tareas
    const userIds = paginatedTasks.map((task) => task.userId);
    const usersResponse = await fetchUsersByIds(userIds);
    const users = usersResponse.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const tasksWithUsers = paginatedTasks.map((task) => ({
      ...task,
      userEmail: users[task.userId]?.email,
      userName: users[task.userId]?.name,
      userRole: users[task.userId]?.role,
    }));

    return tasksWithUsers;
  } catch (error) {
    throw new Error('Error fetching and processing tasks');
  }
};

// Función para consultar todos los usuarios
export const fetchUsersByIds = async (userIds = []) => {
  try {
    const usersResponse = await axios.get(`${API_URL}/users`);
    return usersResponse.data.filter((user) => userIds.includes(user.id));
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

// Función para crear una tarea
export const createTask = async (task) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    throw new Error('Error creating task');
  }
};

// Función para actualizar una tarea
export const updateTask = async (taskId, task) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, task);
    return response.data;
  } catch (error) {
    throw new Error('Error updating task');
  }
};

// Función para eliminar una tarea
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
  } catch (error) {
    throw new Error('Error deleting task');
  }
};

// Función para traer todos los usuarios (para la búsqueda en el formulario)
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

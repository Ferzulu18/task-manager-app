import axios from 'axios';
import { isWithinRange } from '../utils/dateUtils';
import { handleExcept } from '../utils/errorUtils';

const API_URL = 'http://localhost:5000';

export const pageSizeDefault = 10;

// Función para traer todos los usuarios (para la búsqueda en el formulario)
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    handleExcept('EXC007', error);
  }
};

// Función para consultar todos los usuarios
export const fetchUsersByIds = async (userIds = []) => {
  try {
    const usersResponse = await axios.get(`${API_URL}/users`);
    return usersResponse.data.filter((user) => userIds.includes(user.id));
  } catch (error) {
    handleExcept('EXC007', error);
  }
};

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

    // 2. Traer todos los usuarios y asociarlos a las tareas
    const userIds = tasks.map((task) => task.userId);
    const usersResponse = await fetchUsersByIds(userIds);
    const users = usersResponse.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const tasksWithUsers = tasks.map((task) => ({
      ...task,
      userEmail: users[task.userId]?.email,
      userName: users[task.userId]?.name,
      userRole: users[task.userId]?.role,
    }));

    let processedTasks = tasksWithUsers;

    // 3. Filtrar por usuario, título y rango de fechas
    if (filters.user) {
      let filteredTasks = [];
      const userFilter = filters.user.toLowerCase().trim();
      processedTasks.forEach((task) => {
        const userEmail = (task?.userEmail || '').toLowerCase().trim();
        const userName = (task?.userName || '').toLowerCase().trim();
        if (userEmail.includes(userFilter) || userName.includes(userFilter)) {
          filteredTasks.push(task);
        }
      });
      processedTasks = filteredTasks;
    }
    if (filters.title) {
      let filteredTasks = [];
      const titleFilter = filters.title.toLowerCase().trim();
      processedTasks.forEach((task) => {
        const title = (task?.title || '').toLowerCase().trim();
        if (title.includes(titleFilter)) {
          filteredTasks.push(task);
        }
      });
      processedTasks = filteredTasks;
    }
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      processedTasks = processedTasks.filter((task) => {
        if (!task || !task.dueDate) return false;
        return isWithinRange(task.dueDate, start, end);
      });
    }

    // 4. Ordenar las tareas
    if (sorter.field && sorter.order) {
      processedTasks = processedTasks.sort((a, b) => {
        const valueA = (a[sorter.field] || '').toLowerCase().trim();
        const valueB = (b[sorter.field] || '').toLowerCase().trim();
        if (sorter.order === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    // 5. Paginación
    pagination.total = processedTasks.length;
    const { current = 1, pageSize = pageSizeDefault } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = current * pageSize;
    const paginatedTasks = processedTasks.slice(startIndex, endIndex);

    return paginatedTasks;
  } catch (error) {
    handleExcept('EXC001', error);
  }
};

// Función para crear una tarea
export const createTask = async (task) => {
  try {
    const { userEmail, userName, userRole, ...userWithoutSensitiveInfo } = task;
    const response = await axios.post(
      `${API_URL}/tasks`,
      userWithoutSensitiveInfo
    );
    return response.data;
  } catch (error) {
    handleExcept('EXC002', error);
  }
};

// Función para actualizar una tarea
export const updateTask = async (taskId, task) => {
  try {
    const { userEmail, userName, userRole, ...userWithoutSensitiveInfo } = task;
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}`,
      userWithoutSensitiveInfo
    );
    return response.data;
  } catch (error) {
    handleExcept('EXC003', error);
  }
};

// Función para eliminar una tarea
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
  } catch (error) {
    handleExcept('EXC004', error);
  }
};

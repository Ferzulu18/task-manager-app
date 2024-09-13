import axios from 'axios';
import { isWithinRange } from '../utils/date.js';
import { handleExcept } from '../utils/error.js';

const apiUrl = `${process.env.REACT_APP_API_URL}/api/data`;

// Función que obtiene la lista de todos los usuarios desde la API.
// Se utiliza principalmente para mostrar opciones de usuarios en un formulario.
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
  } catch (error) {
    handleExcept('EXC007', error); // Maneja los errores usando un código específico.
  }
};

// Función que obtiene la lista de usuarios filtrados por sus IDs.
// Se utiliza para obtener detalles de usuarios específicos dentro de un conjunto de IDs proporcionados.
export const fetchUsersByIds = async (userIds = []) => {
  try {
    const usersResponse = await axios.get(`${apiUrl}/users`);
    return usersResponse.data.filter((user) => userIds.includes(user.id));
  } catch (error) {
    handleExcept('EXC007', error);
  }
};

// Función que consulta todas las tareas, las asocia a usuarios, y permite aplicar filtros, ordenamientos y paginación.
// Filtra tareas por usuario, título y rango de fechas, luego las ordena según los parámetros y las divide en páginas.
export const fetchAndProcessTasks = async (
  filters = {}, // Filtros aplicados (ej. usuario, título, rango de fechas)
  sorter = {}, // Ordenamiento aplicado (ej. campo a ordenar, orden asc/desc)
  pagination = {} // Parámetros de paginación (ej. página actual, tamaño de página)
) => {
  try {
    const tasksResponse = await axios.get(`${apiUrl}/tasks`);
    let tasks = tasksResponse.data;

    // Asocia las tareas con la información de los usuarios correspondientes
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

    // Aplica filtros en base a usuario, título y rango de fechas
    if (filters.user) {
      const userFilter = filters.user.toLowerCase().trim();
      processedTasks = processedTasks.filter((task) => {
        const userEmail = (task?.userEmail || '').toLowerCase().trim();
        const userName = (task?.userName || '').toLowerCase().trim();
        return userEmail.includes(userFilter) || userName.includes(userFilter);
      });
    }
    if (filters.title) {
      const titleFilter = filters.title.toLowerCase().trim();
      processedTasks = processedTasks.filter((task) => {
        const title = (task?.title || '').toLowerCase().trim();
        return title.includes(titleFilter);
      });
    }
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      processedTasks = processedTasks.filter((task) =>
        isWithinRange(task.dueDate, start, end)
      );
    }

    // Ordena las tareas según el campo y orden indicados
    if (sorter.field && sorter.order) {
      processedTasks = processedTasks.sort((a, b) => {
        const valueA = (a[sorter.field] || '').toLowerCase().trim();
        const valueB = (b[sorter.field] || '').toLowerCase().trim();
        return sorter.order === 'ascend'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    // Aplica paginación
    pagination.total = processedTasks.length;
    const { current = 1, pageSize = 10 } = pagination;
    const startIndex = (current - 1) * pageSize;
    const endIndex = current * pageSize;
    return processedTasks.slice(startIndex, endIndex);
  } catch (error) {
    handleExcept('EXC001', error);
  }
};

// Función que crea una nueva tarea en la API, excluyendo información sensible del usuario.
export const createTask = async (task) => {
  try {
    const { userEmail, userName, userRole, ...userWithoutSensitiveInfo } = task;
    const response = await axios.post(
      `${apiUrl}/tasks`,
      userWithoutSensitiveInfo
    );
    return response.data;
  } catch (error) {
    handleExcept('EXC002', error);
  }
};

// Función que actualiza una tarea existente en la API, excluyendo información sensible del usuario.
export const updateTask = async (taskId, task) => {
  try {
    const { userEmail, userName, userRole, ...userWithoutSensitiveInfo } = task;
    const response = await axios.put(
      `${apiUrl}/tasks/${taskId}`,
      userWithoutSensitiveInfo
    );
    return response.data;
  } catch (error) {
    handleExcept('EXC003', error);
  }
};

// Función que elimina una tarea en la API usando su ID.
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${apiUrl}/tasks/${taskId}`);
  } catch (error) {
    handleExcept('EXC004', error);
  }
};

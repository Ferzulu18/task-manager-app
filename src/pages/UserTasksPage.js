import React, { useContext, useState, useEffect } from 'react';
import { Button, Card, Col, Row, Modal, Input, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import KanbanCard from '../components/KanbanCard.js';
import { AuthContext } from '../context/AuthContext.js';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  checkTaskLimit,
} from '../services/userService.js';
import dayjs from 'dayjs';
import { disabledDate } from '../utils/date.js';
import { handleError, handleSuccess } from '../utils/error.js';

const { Option } = Select;

function UserTasksPage() {
  // Extrae el estado de autenticación y el usuario del contexto de autenticación.
  const { authenticated, user } = useContext(AuthContext);

  // Hooks para navegación y ubicación en la aplicación.
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar la visibilidad del modal y almacenar los datos de la tarea.
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [task, setTask] = useState({
    id: null,
    title: '',
    description: '',
    dueDate: null,
    priority: '',
  });

  // Estado para gestionar la tarea que se está arrastrando.
  const [draggedTask, setDraggedTask] = useState(null);

  // Estado para almacenar las tareas organizadas por su estado.
  const [tasks, setTasks] = useState({
    todo: [],
    wip: [],
    done: [],
  });

  // Colores para las prioridades de las tareas.
  const priorityColors = {
    high: '#ff4d4f',
    medium: '#faad14',
    low: '#36cfc9',
  };

  // Efecto para cargar las tareas del usuario cuando el componente se monta o cambian las dependencias.
  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        // Llama al servicio para obtener las tareas del usuario.
        const userTasks = await fetchTasks(user.id);
        // Organiza las tareas por estado.
        setTasks({
          todo: userTasks.filter((task) => task.status === 'todo'),
          wip: userTasks.filter((task) => task.status === 'wip'),
          done: userTasks.filter((task) => task.status === 'done'),
        });
      } catch (error) {
        handleError('ERR007'); // Maneja cualquier error al obtener las tareas.
      }
    };

    // Redirige si el usuario no está autenticado o no es del rol correcto.
    if (!authenticated || !user || user.role !== 'user') {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } else {
      fetchUserTasks();
    }
  }, [authenticated, navigate, location, user]);

  // Función para actualizar las tareas del usuario.
  const refreshUserTasks = async () => {
    try {
      // Vuelve a obtener las tareas del usuario y organiza por estado.
      const userTasks = await fetchTasks(user.id);
      setTasks({
        todo: userTasks.filter((task) => task.status === 'todo'),
        wip: userTasks.filter((task) => task.status === 'wip'),
        done: userTasks.filter((task) => task.status === 'done'),
      });
    } catch (error) {
      handleError('ERR007'); // Maneja cualquier error al obtener las tareas.
    }
  };

  // Muestra el modal para crear o editar una tarea.
  const showModal = (task = {}) => {
    setTask(task);
    setIsModalVisible(true);
  };

  // Cierra el modal y resetea el estado de la tarea.
  const handleCancel = () => {
    setIsModalVisible(false);
    setTask({
      title: '',
      description: '',
      dueDate: null,
      priority: '',
      id: null,
    });
  };

  // Maneja la acción de guardar o modificar una tarea.
  const handleOk = async () => {
    if (!task.title) {
      handleError('ERR010'); // Muestra un error si el título está vacío.
      return;
    }

    if (task.id) {
      // Actualiza la tarea si tiene un ID existente.
      try {
        await updateTask(task.id, { ...task, userId: user.id });
        handleSuccess('INF006'); // Muestra un mensaje de éxito.
      } catch (error) {
        handleError('ERR011'); // Maneja cualquier error al actualizar.
      }
    } else {
      // Crea una nueva tarea si no tiene un ID.
      try {
        const limitReached = await checkTaskLimit(user.id);
        if (limitReached) {
          handleError('ERR013'); // Muestra un error si se ha alcanzado el límite de tareas.
          return;
        }
        await createTask({ ...task, userId: user.id, status: 'todo' });
        handleSuccess('INF007'); // Muestra un mensaje de éxito.
      } catch (error) {
        handleError('ERR011'); // Maneja cualquier error al crear.
      }
    }
    setIsModalVisible(false); // Cierra el modal.
    setTask({
      title: '',
      description: '',
      dueDate: null,
      priority: '',
      id: null,
    });
    refreshUserTasks(); // Refresca la lista de tareas.
  };

  // Maneja el inicio del arrastre de una tarea.
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  // Maneja el soltar una tarea en una nueva columna.
  const handleDrop = async (status) => {
    if (draggedTask) {
      try {
        await updateTaskStatus(draggedTask.id, status);
        handleSuccess('INF009'); // Muestra un mensaje de éxito.
        setDraggedTask(null);
        refreshUserTasks(); // Refresca la lista de tareas.
      } catch (error) {
        handleError('ERR014'); // Maneja cualquier error al actualizar el estado.
      }
    }
  };

  // Muestra una confirmación antes de eliminar una tarea.
  const confirmDelete = (taskId) => {
    Modal.confirm({
      title: 'Confirmar',
      content: '¿Estás seguro de que quieres eliminar esta tarea?',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteTask(taskId);
          handleSuccess('INF008'); // Muestra un mensaje de éxito.
          refreshUserTasks(); // Refresca la lista de tareas.
        } catch (error) {
          handleError('ERR012'); // Maneja cualquier error al eliminar.
        }
      },
    });
  };

  // Maneja el cambio de fecha de vencimiento de una tarea.
  const handleDateChange = (date) => {
    setTask({ ...task, dueDate: date ? date.toISOString() : null });
  };

  return (
    <div className="p-4">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        className="mb-4"
      >
        Crear Tarea
      </Button>

      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="Por hacer"
            className="bg-gray-200 p-4 rounded-lg h-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('todo')}
          >
            {tasks.todo.map((task) => (
              <KanbanCard
                key={task.id}
                item={task}
                onDragStart={() => handleDragStart(task)}
                onDoubleClick={() => showModal(task)}
                onEdit={() => showModal(task)}
                onDelete={() => confirmDelete(task.id)}
                borderColors={priorityColors}
              />
            ))}
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              className="mt-4"
            >
              Nuevo
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="En Proceso"
            className="bg-gray-200 p-4 rounded-lg h-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('wip')}
          >
            {tasks.wip.map((task) => (
              <KanbanCard
                key={task.id}
                item={task}
                onDragStart={() => handleDragStart(task)}
                onDoubleClick={() => showModal(task)}
                onEdit={() => showModal(task)}
                onDelete={() => confirmDelete(task.id)}
                borderColors={priorityColors}
              />
            ))}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Hecho"
            className="bg-gray-200 p-4 rounded-lg h-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('done')}
          >
            {tasks.done.map((task) => (
              <KanbanCard
                key={task.id}
                item={task}
                onDragStart={() => handleDragStart(task)}
                onDoubleClick={() => showModal(task)}
                onEdit={() => showModal(task)}
                onDelete={() => confirmDelete(task.id)}
                borderColors={priorityColors}
              />
            ))}
          </Card>
        </Col>
      </Row>

      <Modal
        title={task.id ? 'Modificar Tarea' : 'Crear Tarea'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={task.id ? 'Modificar' : 'Crear'}
        cancelText="Cancelar"
      >
        <Input
          placeholder="Título"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="mt-2 w-full"
        />
        <Input.TextArea
          placeholder="Descripción"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="mt-2 w-full"
        />
        <DatePicker
          format="YYYY-MM-DD"
          value={task.dueDate ? dayjs(task.dueDate) : null}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          className="mt-2 w-full"
          placeholder="Fecha de vencimiento"
        />
        <Select
          placeholder="Prioridad"
          value={task.priority}
          onChange={(value) => setTask({ ...task, priority: value })}
          className="mt-2 w-full"
        >
          <Option value="high">Alta</Option>
          <Option value="medium">Media</Option>
          <Option value="low">Baja</Option>
        </Select>
      </Modal>
    </div>
  );
}

export default UserTasksPage;

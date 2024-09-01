import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  Input,
  DatePicker,
  Select,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import KanbanCard from '../components/KanbanCard';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  checkTaskLimit,
} from '../services/userService';
import dayjs from 'dayjs';
import { disabledDate } from '../utils/dateUtils';

const { Option } = Select;

function UserTasksPage() {
  const { authenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [task, setTask] = useState({
    id: null,
    title: '',
    description: '',
    dueDate: null,
    priority: '', // Cambio de label a priority
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [tasks, setTasks] = useState({
    todo: [],
    wip: [],
    done: [],
  });
  const priorityColors = {
    high: '#ff4d4f',
    medium: '#faad14',
    low: '#36cfc9',
  };

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const userTasks = await fetchTasks(user.id);
        setTasks({
          todo: userTasks.filter((task) => task.status === 'todo'),
          wip: userTasks.filter((task) => task.status === 'wip'),
          done: userTasks.filter((task) => task.status === 'done'),
        });
      } catch (error) {
        message.error('No se pudieron obtener las tareas');
      }
    };

    if (!authenticated || !user || user.role !== 'user') {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } else {
      fetchUserTasks();
    }
  }, [authenticated, navigate, location, user]);

  const refreshUserTasks = async () => {
    try {
      const userTasks = await fetchTasks(user.id);
      setTasks({
        todo: userTasks.filter((task) => task.status === 'todo'),
        wip: userTasks.filter((task) => task.status === 'wip'),
        done: userTasks.filter((task) => task.status === 'done'),
      });
    } catch (error) {
      message.error('No se pudieron obtener las tareas');
    }
  };

  const showModal = (task = {}) => {
    setTask(task);
    setIsModalVisible(true);
  };

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

  const handleOk = async () => {
    if (!task.title) {
      message.error('El título es obligatorio');
      return;
    }

    if (task.id) {
      try {
        await updateTask(task.id, { ...task, userId: user.id });
        message.success('Tarea modificada con éxito');
      } catch (error) {
        message.error('No se pudo modificar la tarea');
      }
    } else {
      try {
        const limitReached = await checkTaskLimit(user.id);
        if (limitReached) {
          message.error('Has alcanzado el límite máximo de tareas');
          return;
        }
        await createTask({ ...task, userId: user.id, status: 'todo' });
        message.success('Tarea creada con éxito');
      } catch (error) {
        message.error('No se pudo crear la tarea');
      }
    }
    setIsModalVisible(false);
    setTask({
      title: '',
      description: '',
      dueDate: null,
      priority: '',
      id: null,
    });
    refreshUserTasks(); // Refrescar tareas
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (status) => {
    if (draggedTask) {
      try {
        await updateTaskStatus(draggedTask.id, status);
        message.success('Estado de la tarea actualizado con éxito');
        setDraggedTask(null);
        refreshUserTasks(); // Refrescar tareas
      } catch (error) {
        message.error('No se pudo actualizar el estado de la tarea');
      }
    }
  };

  const confirmDelete = (taskId) => {
    Modal.confirm({
      title: 'Confirmar',
      content: '¿Estás seguro de que quieres eliminar esta tarea?',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteTask(taskId);
          message.success('Tarea eliminada con éxito');
          refreshUserTasks(); // Refrescar tareas
        } catch (error) {
          message.error('No se pudo eliminar la tarea');
        }
      },
    });
  };

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
            className="bg-gray-100 p-4 rounded-lg h-full"
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
                borderColors={priorityColors} // Cambiado labelColors por priorityColors
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
            className="bg-gray-100 p-4 rounded-lg h-full"
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
                borderColors={priorityColors} // Cambiado labelColors por priorityColors
              />
            ))}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Hecho"
            className="bg-gray-100 p-4 rounded-lg h-full"
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
                borderColors={priorityColors} // Cambiado labelColors por priorityColors
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
          placeholder="Prioridad" // Cambiado de Etiqueta a Prioridad
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

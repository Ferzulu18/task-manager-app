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
import KanbanCard from '../../components/KanbanCard';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  checkTaskLimit,
} from '../../services/userTaskService';
import dayjs from 'dayjs';
import { disabledDate } from '../../utils/dateUtils';
import '../../styles/users/UserTasksPage.css';

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
    label: '',
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [tasks, setTasks] = useState({
    todo: [],
    wip: [],
    done: [],
  });
  const labelColors = {
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

    if (!authenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } else {
      fetchUserTasks();
    }
  }, [authenticated, navigate, location, setTasks, user]);

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
    setTask({ title: '', description: '', dueDate: null, label: '', id: null });
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
        await createTask({ ...task, userId: user.id, status: 'por hacer' });
        message.success('Tarea creada con éxito');
      } catch (error) {
        message.error('No se pudo crear la tarea');
      }
    }
    setIsModalVisible(false);
    setTask({ title: '', description: '', dueDate: null, label: '', id: null });
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
    // Actualiza el estado con la fecha seleccionada o con null si no se selecciona ninguna fecha
    setTask({ ...task, dueDate: date ? date.toISOString() : null });
  };

  return (
    <div className="kanban-container">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        className="create-task-button"
      >
        Crear Tarea
      </Button>

      <Row gutter={16} className="kanban-columns">
        <Col span={8}>
          <Card
            title="Por hacer"
            className="kanban-column"
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
                borderColors={labelColors}
              />
            ))}
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              className="create-task-button"
            >
              Nuevo
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="En Proceso"
            className="kanban-column"
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
                borderColors={labelColors}
              />
            ))}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Hecho"
            className="kanban-column"
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
                borderColors={labelColors}
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
        />
        <Input.TextArea
          placeholder="Descripción"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="mt-2"
        />
        <DatePicker
          format="YYYY-MM-DD"
          value={task.dueDate ? dayjs(task.dueDate) : null}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          className="mt-2"
        />
        <Select
          placeholder="Etiqueta"
          value={task.label}
          onChange={(value) => setTask({ ...task, label: value })}
          className="mt-2 custom-select"
        >
          <Option value="high">Crítica</Option>
          <Option value="medium">Moderada</Option>
          <Option value="low">Menor</Option>
        </Select>
      </Modal>
    </div>
  );
}

export default UserTasksPage;

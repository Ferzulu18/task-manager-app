import React, { useContext, useState, useEffect } from 'react';
import { Button, Card, Col, Row, Modal, Input, DatePicker, Select } from 'antd';
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
import { handleError, handleSuccess } from '../utils/errorUtils';

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
    priority: '',
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
        handleError('ERR007');
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
      handleError('ERR007');
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
      handleError('ERR010');
      return;
    }

    if (task.id) {
      try {
        await updateTask(task.id, { ...task, userId: user.id });
        handleSuccess('INF006');
      } catch (error) {
        handleError('ERR011');
      }
    } else {
      try {
        const limitReached = await checkTaskLimit(user.id);
        if (limitReached) {
          handleError('ERR013');
          return;
        }
        await createTask({ ...task, userId: user.id, status: 'todo' });
        handleSuccess('INF007');
      } catch (error) {
        handleError('ERR011');
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
    refreshUserTasks();
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (status) => {
    if (draggedTask) {
      try {
        await updateTaskStatus(draggedTask.id, status);
        handleSuccess('INF009');
        setDraggedTask(null);
        refreshUserTasks();
      } catch (error) {
        handleError('ERR014');
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
          handleSuccess('INF008');
          refreshUserTasks();
        } catch (error) {
          handleError('ERR012');
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

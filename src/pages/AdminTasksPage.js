import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Modal,
  Input,
  DatePicker,
  Select,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchAndProcessTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchUsers,
  pageSizeDefault,
} from '../services/adminService';
import dayjs from 'dayjs';
import { disabledDate } from '../utils/dateUtils';
import { handleError, handleSuccess } from '../utils/errorUtils';
import './AdminTasksPage.css';

const { Option } = Select;

function AdminTasksPage() {
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
    userId: '',
  });
  const [users, setUsers] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    title: '',
    dateRange: [],
  });
  const [sorter, setSorter] = useState({ field: 'dueDate', order: 'ascend' });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSizeDefault,
  });

  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
        const tasks = await fetchAndProcessTasks(filters, sorter, pagination);
        setTasksData(tasks);
      } catch (error) {
        handleError('ERR007');
      }
    };

    const fetchUsersList = async () => {
      try {
        const users = await fetchUsers();
        setUsers(users);
      } catch (error) {
        handleError('ERR008');
      }
    };

    if (!authenticated || !user || user.role !== 'admin') {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } else {
      fetchTasksAndUsers();
      fetchUsersList();
    }
  }, [authenticated, navigate, location, user, filters, sorter, pagination]);

  const refreshTasks = async () => {
    try {
      const tasks = await fetchAndProcessTasks(filters, sorter, pagination);
      setTasksData(tasks);
    } catch (error) {
      handleError('ERR009');
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
      userId: '',
      id: null,
    });
  };

  const handleOk = async () => {
    if (!task.title) {
      handleError('ERR010');
      return;
    }

    try {
      if (task.id) {
        await updateTask(task.id, task);
        handleSuccess('INF006');
      } else {
        await createTask(task);
        handleSuccess('INF007');
      }
      setIsModalVisible(false);
      setTask({
        title: '',
        description: '',
        dueDate: null,
        priority: '',
        userId: '',
        id: null,
      });
      refreshTasks();
    } catch (error) {
      handleError('ERR011');
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
          refreshTasks();
        } catch (error) {
          handleError('ERR012');
        }
      },
    });
  };

  const handleDateChange = (date) => {
    setTask({ ...task, dueDate: date ? date.toISOString() : null });
  };

  const handleFilterChange = (value, type) => {
    setFilters({ ...filters, [type]: value });
  };

  const handleDateRangeChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  const handleSortChange = (pagination, filters, sorter) => {
    setSorter({ field: sorter.field, order: sorter.order });
    setPagination(pagination);
    refreshTasks();
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Fecha de Vencimiento',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: true,
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Prioridad',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const color =
          priority === 'high'
            ? 'red'
            : priority === 'medium'
              ? 'orange'
              : 'green';
        return <Tag color={color}>{priorityLabels[priority]}</Tag>;
      },
    },
    {
      title: 'Responsable',
      dataIndex: 'userName',
      key: 'userName',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
      sorter: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  const priorityLabels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  return (
    <div className="p-4">
      <Row gutter={[16, 16]} className="mb-4">
        <Col>
          <Input
            placeholder="Buscar por Usuario"
            value={filters.user}
            onChange={(e) => handleFilterChange(e.target.value, 'user')}
          />
        </Col>
        <Col>
          <Input
            placeholder="Buscar por Título"
            value={filters.title}
            onChange={(e) => handleFilterChange(e.target.value, 'title')}
          />
        </Col>
        <Col>
          <DatePicker.RangePicker
            onChange={handleDateRangeChange}
            placeholder={['Fecha Inicio', 'Fecha Fin']}
          />
        </Col>
        <Col className="ml-auto">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Crear Tarea
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={tasksData}
        rowKey="id"
        onChange={handleSortChange}
        pagination={pagination}
      />

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
          placeholder="Fecha de Vencimiento"
          value={task.dueDate ? dayjs(task.dueDate) : null}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          className="mt-2 w-full"
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
        <Select
          placeholder="Asignar a Usuario"
          value={task.userId}
          onChange={(value) => setTask({ ...task, userId: value })}
          className="mt-2 w-full"
        >
          {users.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}

export default AdminTasksPage;

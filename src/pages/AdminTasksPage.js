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
import { AuthContext } from '../context/AuthContext.js';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchAndProcessTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchUsers,
} from '../services/adminService.js';
import dayjs from 'dayjs';
import { disabledDate } from '../utils/date.js';
import { handleError, handleSuccess } from '../utils/error.js';

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
    pageSize: 10,
  });

  // Efecto que se ejecuta al montar el componente o cuando cambian los filtros, el orden o la paginación
  useEffect(() => {
    // Función para obtener las tareas con los filtros, orden y paginación aplicados
    const fetchTasksAndUsers = async () => {
      try {
        const tasks = await fetchAndProcessTasks(filters, sorter, pagination);
        setTasksData(tasks);
      } catch (error) {
        handleError('ERR007');
      }
    };

    // Función para obtener la lista de usuarios
    const fetchUsersList = async () => {
      try {
        const users = await fetchUsers();
        setUsers(users);
      } catch (error) {
        handleError('ERR008');
      }
    };

    // Verifica si el usuario está autenticado y tiene rol de admin
    if (!authenticated || !user || user.role !== 'admin') {
      const from = location.state?.from?.pathname || '/';
      navigate(from); // Redirige a la página de origen o a la raíz si no está autenticado
    } else {
      fetchTasksAndUsers(); // Obtiene las tareas y usuarios si está autenticado
      fetchUsersList();
    }
  }, [authenticated, navigate, location, user, filters, sorter, pagination]);

  // Función para actualizar los datos de las tareas
  const refreshTasks = async () => {
    try {
      const tasks = await fetchAndProcessTasks(filters, sorter, pagination);
      setTasksData(tasks);
    } catch (error) {
      handleError('ERR009');
    }
  };

  // Muestra el modal para crear o editar una tarea
  const showModal = (task = {}) => {
    setTask(task);
    setIsModalVisible(true);
  };

  // Cierra el modal y reinicia el formulario de la tarea
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

  // Maneja la creación o actualización de una tarea
  const handleOk = async () => {
    if (!task.title) {
      handleError('ERR010');
      return;
    }

    try {
      if (task.id) {
        // Actualiza la tarea existente
        await updateTask(task.id, task);
        handleSuccess('INF006');
      } else {
        // Crea una nueva tarea
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
      refreshTasks(); // Refresca la lista de tareas después de crear o actualizar
    } catch (error) {
      handleError('ERR011');
    }
  };

  // Confirma la eliminación de una tarea con un modal de confirmación
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
          refreshTasks(); // Refresca la lista de tareas después de eliminar
        } catch (error) {
          handleError('ERR012');
        }
      },
    });
  };

  // Maneja el cambio de fecha para la tarea
  const handleDateChange = (date) => {
    setTask({ ...task, dueDate: date ? date.toISOString() : null });
  };

  // Actualiza los filtros según la entrada del usuario
  const handleFilterChange = (value, type) => {
    setFilters({ ...filters, [type]: value });
  };

  // Actualiza el filtro de rango de fechas
  const handleDateRangeChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  // Maneja los cambios en el ordenamiento y la paginación de la tabla
  const handleSortChange = (pagination, filters, sorter) => {
    setSorter({ field: sorter.field, order: sorter.order });
    setPagination(pagination);
    refreshTasks(); // Refresca la lista de tareas con el nuevo orden y paginación
  };

  // Define las columnas de la tabla con su configuración
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

  // Etiquetas para los niveles de prioridad
  const priorityLabels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  // Renderiza el componente
  return (
    <div className="p-4">
      {/* Controles de filtrado y búsqueda */}
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

      {/* Tabla que muestra las tareas */}
      <Table
        columns={columns}
        dataSource={tasksData}
        rowKey="id"
        onChange={handleSortChange}
        pagination={pagination}
      />

      {/* Modal para la creación o edición de tareas */}
      <Modal
        title={task.id ? 'Modificar Tarea' : 'Crear Tarea'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
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
          placeholder="Fecha de Vencimiento"
          value={task.dueDate ? dayjs(task.dueDate) : null}
          onChange={handleDateChange}
          className="mt-2 w-full"
          disabledDate={disabledDate}
        />
        <Select
          placeholder="Prioridad"
          value={task.priority}
          onChange={(value) => setTask({ ...task, priority: value })}
          className="mt-2 w-full"
        >
          {Object.entries(priorityLabels).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Asignar Usuario"
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

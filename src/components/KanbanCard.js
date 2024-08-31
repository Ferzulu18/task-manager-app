import React from 'react';
import { Card, Dropdown, Menu } from 'antd';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { formatDueDate } from '../utils/dateUtils';

function KanbanCard({
  id,
  title,
  dueDate,
  label,
  onDragStart,
  onDoubleClick,
  onEdit,
  onDelete,
}) {
  const handleMenuClick = (e) => {
    if (e.key === 'edit') {
      onEdit();
    } else if (e.key === 'delete') {
      onDelete();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Editar
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        Eliminar
      </Menu.Item>
    </Menu>
  );

  const labelColors = {
    important: '#ff4d4f',
    medium: '#faad14',
    low: '#36cfc9',
  };

  return (
    <Card
      title={title}
      extra={
        <Dropdown menu={menu} trigger={['click']}>
          <EllipsisOutlined className="dropdown-icon" />
        </Dropdown>
      }
      style={{ borderColor: labelColors[label] || '#d9d9d9' }}
      className="kanban-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
        onDragStart();
      }}
      onDoubleClick={() => onDoubleClick && onDoubleClick(id)}
    >
      <p className="kanban-card-due-date">{formatDueDate(dueDate)}</p>
      <p className="kanban-card-description">Descripción de la tarea...</p>
    </Card>
  );
}

export default KanbanCard;

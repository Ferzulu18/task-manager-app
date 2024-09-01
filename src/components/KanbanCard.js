import React from 'react';
import { Card, Dropdown } from 'antd';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { formatHumanDate } from '../utils/dateUtils';
import { truncateText } from '../utils/textUtils';
import '../styles/KanbanCard.css';

function KanbanCard({
  item,
  onDragStart,
  onDoubleClick,
  onEdit,
  onDelete,
  borderColors,
}) {
  const { id, title, description, dueDate, label } = item;

  const menuItems = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Editar',
      onClick: () => onEdit(id),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Eliminar',
      onClick: () => onDelete(id),
    },
  ];

  const menu = {
    items: menuItems.map((item) => ({
      key: item.key,
      label: item.label,
      onClick: item.onClick,
    })),
  };

  return (
    <Card
      title={title}
      extra={
        <Dropdown menu={menu} trigger={['click']}>
          <EllipsisOutlined className="dropdown-icon" />
        </Dropdown>
      }
      style={{ borderColor: borderColors[label] || '#d9d9d9' }}
      className="kanban-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
        onDragStart(id);
      }}
      onDoubleClick={() => onDoubleClick && onDoubleClick(id)}
    >
      <p className="kanban-card-due-date">{formatHumanDate(dueDate)}</p>
      <p className="kanban-card-description">
        {description
          ? truncateText(description, 50)
          : 'Descripción de la tarea...'}
      </p>
    </Card>
  );
}

export default KanbanCard;

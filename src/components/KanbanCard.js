import React from 'react';
import { Card, Dropdown } from 'antd';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { formatHumanDate } from '../utils/dateUtils';
import { truncateText } from '../utils/textUtils';

function KanbanCard({
  item,
  onDragStart,
  onDoubleClick,
  onEdit,
  onDelete,
  borderColors,
}) {
  const { id, title, description, dueDate, priority } = item;

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
      icon: item.icon,
      label: item.label,
      onClick: item.onClick,
    })),
  };

  return (
    <Card
      title={title}
      extra={
        <Dropdown menu={menu} trigger={['click']}>
          <EllipsisOutlined className="text-gray-500 text-xl hover:text-gray-900 cursor-pointer" />
        </Dropdown>
      }
      style={{ borderColor: borderColors[priority] || '#d9d9d9' }}
      className="mb-4 rounded-lg transition-shadow hover:shadow-lg"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id);
        onDragStart(id);
      }}
      onDoubleClick={() => onDoubleClick && onDoubleClick(id)}
    >
      <p className="text-xs text-gray-500 mb-2">{formatHumanDate(dueDate)}</p>
      <p className="text-sm text-gray-800">
        {description
          ? truncateText(description, 50)
          : 'Descripción de la tarea...'}
      </p>
    </Card>
  );
}

export default KanbanCard;

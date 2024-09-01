import React, { useContext } from 'react';
import { Card, Avatar, Typography, Divider, Row, Col, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';

const { Title, Text } = Typography;

function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-6">
      <Card
        title="Perfil de Usuario"
        className="w-full max-w-lg shadow-lg rounded-lg"
      >
        <div className="text-center">
          <Avatar
            icon={<UserOutlined />}
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`}
            size={96}
            className="mx-auto mb-4"
          />
          <Title level={3} className="mb-1">
            {user.name}
          </Title>
          <Text type="secondary">{user.email}</Text>
        </div>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Teléfono:</Text>
            <div className="text-gray-700">+57 312 345 6789</div>
          </Col>
          <Col span={12}>
            <Text strong>Rol:</Text>
            <div className="text-gray-700">Desarrollador Frontend</div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Habilidades:</Text>
            <div className="text-gray-700">
              <Tag color="blue">React</Tag>
              <Tag color="green">Node.js</Tag>
              <Tag color="orange">TypeScript</Tag>
            </div>
          </Col>
          <Col span={12}>
            <Text strong>LinkedIn:</Text>
            <div className="text-gray-700">
              <a
                href="https://www.linkedin.com/in/usuario"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.linkedin.com/in/usuario
              </a>
            </div>
          </Col>
        </Row>
        <Divider />
        <div>
          <Title level={4}>Descripción Personal</Title>
          <Text className="text-gray-700">
            Apasionado por la tecnología, con experiencia en desarrollo de
            software y gestión de proyectos.
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;

import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  DashboardOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import kanbanImage from '../assets/images/kanban.jpg';
import boardImage from '../assets/images/board.jpg';
import efficientImage from '../assets/images/efficient.jpg';

const AboutPage = () => {
  return (
    <div className="p-5 max-w-screen-lg mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-left">Qué Hacemos</h1>
      <hr className="w-24 border-2 border-blue-500 mb-8" />

      <p className="text-lg text-gray-700 leading-relaxed mb-10 text-justify">
        En nuestra plataforma, nos dedicamos a facilitar la vida de nuestros
        usuarios al proporcionar una herramienta robusta y visualmente intuitiva
        para la gestión de tareas. Ya seas un administrador que necesita
        organizar múltiples proyectos, o un usuario regular que busca mantenerse
        al tanto de sus tareas diarias, nuestra plataforma está diseñada para
        adaptarse a tus necesidades.
      </p>

      <Row gutter={[16, 16]} className="mb-10">
        <Col xs={24} sm={12} md={8}>
          <Card
            className="text-center"
            title="Gestión Eficiente"
            bordered={false}
            cover={
              <CheckCircleOutlined className="text-5xl text-blue-500 mb-5" />
            }
          >
            <p>
              Facilita a los usuarios la creación, edición y gestión de sus
              tareas de manera sencilla y eficiente, asegurando que cada
              actividad esté organizada y priorizada.
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="text-center"
            title="Tablero Kanban"
            bordered={false}
            cover={
              <DashboardOutlined className="text-5xl text-blue-500 mb-5" />
            }
          >
            <p>
              Organiza tus tareas visualmente con nuestro tablero estilo Kanban,
              que te permite mover tareas entre columnas de estado de manera
              intuitiva.
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="text-center"
            title="Roles Diferenciados"
            bordered={false}
            cover={
              <UserSwitchOutlined className="text-5xl text-blue-500 mb-5" />
            }
          >
            <p>
              Funcionalidades exclusivas para administradores y usuarios, cada
              uno con herramientas específicas para maximizar la productividad.
            </p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-10 justify-center">
        <Col xs={24} sm={12} md={8}>
          <img
            src={kanbanImage}
            alt="Tablero de gestión de tareas 1"
            className="h-40 w-full rounded-lg shadow-lg"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <img
            src={efficientImage}
            alt="Tablero de gestión de tareas 2"
            className="h-40 w-full rounded-lg shadow-lg"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <img
            src={boardImage}
            alt="Tablero de gestión de tareas 3"
            className="h-40 w-full rounded-lg shadow-lg"
          />
        </Col>
      </Row>
    </div>
  );
};

export default AboutPage;

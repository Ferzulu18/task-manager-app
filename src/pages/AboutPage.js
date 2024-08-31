import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  DashboardOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import '../styles/AboutPage.css';
import kanbanImage from '../assets/images/kanban.jpg';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1 className="about-title">Qué Hacemos</h1>
      <hr className="about-divider" />

      <p className="about-description">
        En nuestra plataforma, nos dedicamos a facilitar la vida de nuestros
        usuarios al proporcionar una herramienta robusta y visualmente intuitiva
        para la gestión de tareas. Ya seas un administrador que necesita
        organizar múltiples proyectos, o un usuario regular que busca mantenerse
        al tanto de sus tareas diarias, nuestra plataforma está diseñada para
        adaptarse a tus necesidades.
      </p>

      <Row gutter={[16, 16]} className="about-features">
        <Col xs={24} sm={12} md={8}>
          <Card
            className="feature-card"
            title="Gestión Eficiente"
            bordered={false}
            cover={<CheckCircleOutlined className="feature-icon" />}
          >
            <p>
              Permite a los usuarios crear, editar y gestionar sus tareas de
              manera sencilla, asegurando que nada se pierda de vista.
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="feature-card"
            title="Tablero Kanban"
            bordered={false}
            cover={<DashboardOutlined className="feature-icon" />}
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
            className="feature-card"
            title="Roles Diferenciados"
            bordered={false}
            cover={<UserSwitchOutlined className="feature-icon" />}
          >
            <p>
              Funcionalidades exclusivas para administradores y usuarios, cada
              uno con herramientas específicas para maximizar la productividad.
            </p>
          </Card>
        </Col>
      </Row>

      <div className="about-image-container">
        <img
          src={kanbanImage}
          alt="Tablero de gestión de tareas"
          className="about-image"
        />
      </div>
    </div>
  );
};

export default AboutPage;

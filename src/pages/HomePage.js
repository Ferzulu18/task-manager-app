import React, { useContext, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import {
  SmileOutlined,
  StarOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import CTAButton from '../components/CTAButton';
import { AuthContext } from '../context/AuthContext';
import '../styles/HomePage.css';

function HomePage() {
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    // console.log('home', 'authenticated', authenticated);
  }, [authenticated]);

  return (
    <div className="home-container">
      <Card className="intro-card">
        <h1 className="intro-title">
          Bienvenido a la Aplicación de Gestión de Tareas
        </h1>
        <p className="intro-description">
          Esta es tu aplicación sencilla para gestionar tareas diarias.
        </p>
        {authenticated ? (
          <>
            <p className="intro-message">
              Ya estás registrado. Empieza a gestionar tus tareas y aprovecha
              todas las funcionalidades.
            </p>
            <CTAButton to="/users/dashboard" text="Ir a mi panel de tareas" />
          </>
        ) : (
          <>
            <p className="intro-message">
              Para comenzar, por favor regístrate en nuestra plataforma o inicia
              sesión si ya tienes una cuenta, y empieza a gestionar tus tareas.
            </p>
            <div className="cta-buttons">
              <CTAButton to="/users/register" text="Regístrate Ahora" />
              <CTAButton to="/users/login" text="Inicia Sesión" />
            </div>
          </>
        )}
      </Card>

      <div className="services-section">
        <h2 className="section-title">Servicios Destacados</h2>
        <Row gutter={16}>
          <Col span={8}>
            <Card className="service-card">
              <SmileOutlined className="service-icon" />
              <h3 className="service-title">Gestión Eficiente</h3>
              <p className="service-description">
                Administra tus tareas con facilidad y organiza tu trabajo de
                manera intuitiva con nuestro tablero estilo Kanban.
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="service-card">
              <StarOutlined className="service-icon" />
              <h3 className="service-title">Usabilidad Amigable</h3>
              <p className="service-description">
                Disfruta de una experiencia de usuario fluida y amigable,
                diseñada para mejorar tu productividad.
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="service-card">
              <UsergroupAddOutlined className="service-icon" />
              <h3 className="service-title">Colaboración</h3>
              <p className="service-description">
                Colabora con otros usuarios y gestiona proyectos en equipo de
                manera eficiente.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="testimonials-section">
        <h2 className="section-title">Testimonios</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p className="testimonial-text">
              "Esta aplicación ha transformado la forma en que gestiono mis
              tareas. ¡Es muy fácil de usar y me ayuda a mantenerme organizada!"
            </p>
            <p className="testimonial-author">- Ana G.</p>
          </div>
          <div className="testimonial">
            <p className="testimonial-text">
              "El tablero estilo Kanban es simplemente genial. Me permite
              visualizar mi flujo de trabajo de una manera muy clara."
            </p>
            <p className="testimonial-author">- Luis P.</p>
          </div>
          <div className="testimonial">
            <p className="testimonial-text">
              "Me encanta la funcionalidad de colaboración. Trabajar en equipo
              nunca ha sido tan fácil y eficiente."
            </p>
            <p className="testimonial-author">- Marta R.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

import React, { useContext, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import {
  SmileOutlined,
  StarOutlined,
  // UsergroupAddOutlined,
} from '@ant-design/icons';
import CTAButton from '../components/CTAButton.js';
import { AuthContext } from '../context/AuthContext.js';

function HomePage() {
  const { authenticated, user } = useContext(AuthContext);

  useEffect(() => {}, [authenticated]);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100">
      <Card className="w-full max-w-4xl text-center mb-8 p-8">
        <h1 className="text-3xl font-bold mb-4">
          Bienvenido a la Aplicación de Gestión de Tareas
        </h1>
        <p className="text-lg mb-4">
          Esta es tu aplicación sencilla para gestionar tareas diarias.
        </p>
        {authenticated && user && user.role === 'user' ? (
          <>
            <p className="mb-6">
              Ya estás registrado. Empieza a gestionar tus tareas y aprovecha
              todas las funcionalidades.
            </p>
            <div className="flex justify-center mt-6">
              <CTAButton
                to="/dashboard"
                text="Ir a mi panel de tareas"
                className="w-40 h-16 text-md"
              />
            </div>
          </>
        ) : authenticated && user && user.role === 'admin' ? (
          <>
            <p className="mb-6">
              Eres administrador. Accede al panel administrativo para gestionar
              usuarios, supervisar tareas y configurar funcionalidades
              avanzadas.
            </p>
            <div className="flex justify-center mt-6">
              <CTAButton
                to="/supervise"
                text="Ir a mi panel administrativo"
                className="w-40 h-16 text-md"
              />
            </div>
          </>
        ) : (
          <>
            <p className="mb-6">
              Para comenzar, por favor regístrate en nuestra plataforma o inicia
              sesión si ya tienes una cuenta, y empieza a gestionar tus tareas.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <CTAButton
                to="/auth/register"
                text="Regístrate Ahora"
                className="w-40 h-16 text-md"
              />
              <CTAButton
                to="/auth/login"
                text="Inicia Sesión"
                className="w-40 h-16 text-md"
              />
            </div>
          </>
        )}
      </Card>

      <div className="w-full max-w-4xl bg-white p-8 shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Servicios Destacados
        </h2>
        <Row gutter={16}>
          <Col span={12}>
            <Card className="text-center p-6 border border-gray-300 rounded-lg">
              <SmileOutlined className="text-blue-500 text-3xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Gestión Eficiente</h3>
              <p className="text-gray-600">
                Administra tus tareas con facilidad y organiza tu trabajo de
                manera intuitiva con nuestro tablero estilo Kanban.
              </p>
            </Card>
          </Col>
          <Col span={12}>
            <Card className="text-center p-6 border border-gray-300 rounded-lg">
              <StarOutlined className="text-blue-500 text-3xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Usabilidad Amigable</h3>
              <p className="text-gray-600">
                Disfruta de una experiencia de usuario fluida y amigable,
                diseñada para mejorar tu productividad.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Testimonios</h2>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl p-6 border border-gray-300 rounded-lg mb-4 bg-gray-50">
            <p className="text-gray-800 mb-2">
              "Esta aplicación ha transformado la forma en que gestiono mis
              tareas. ¡Es muy fácil de usar y me ayuda a mantenerme organizada!"
            </p>
            <p className="text-gray-600 text-right">- Ana G.</p>
          </div>
          <div className="w-full max-w-3xl p-6 border border-gray-300 rounded-lg mb-4 bg-gray-50">
            <p className="text-gray-800 mb-2">
              "El tablero estilo Kanban es simplemente genial. Me permite
              visualizar mi flujo de trabajo de una manera muy clara."
            </p>
            <p className="text-gray-600 text-right">- Luis P.</p>
          </div>
          <div className="w-full max-w-3xl p-6 border border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-800 mb-2">
              "Me encanta la funcionalidad de colaboración. Trabajar en equipo
              nunca ha sido tan fácil y eficiente."
            </p>
            <p className="text-gray-600 text-right">- Marta R.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

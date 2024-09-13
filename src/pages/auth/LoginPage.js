import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import FormButton from '../../components/FormButton.js';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, recoverPassword } from '../../services/authService.js';
import { AuthContext } from '../../context/AuthContext.js';
import { handleError, handleSuccess } from '../../utils/error.js';

function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, login } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Redirige al usuario a la página de origen si está autenticado
  useEffect(() => {
    if (authenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [authenticated, navigate, location]);

  // Maneja el proceso de inicio de sesión
  // Si el usuario es autenticado, se actualiza el contexto y se redirige al usuario
  const handleLogin = async (values) => {
    try {
      const user = await loginUser(values);

      if (user) {
        login(user);
        handleSuccess('INF003');
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        handleError('ERR003');
      }
    } catch (error) {
      handleError('ERR004');
    }
  };

  // Maneja el proceso de recuperación de contraseña
  // Envía un correo de recuperación y oculta el modal en caso de éxito
  const handleForgotPassword = async (values) => {
    try {
      await recoverPassword(values.email);
      handleSuccess('INF004');
      setIsModalVisible(false);
    } catch (error) {
      handleError('ERR005');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <Form form={form} onFinish={handleLogin} layout="vertical">
          <Form.Item
            label="Correo Electrónico"
            name="email"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu correo electrónico',
              },
              { type: 'email', message: 'El correo electrónico no es válido' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa tu contraseña' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/auth/register" className="text-blue-500 hover:underline">
              ¿No tienes una cuenta? Regístrate aquí
            </Link>
          </Form.Item>
          <Form.Item>
            <Link
              onClick={() => setIsModalVisible(true)}
              className="text-blue-500 hover:underline"
            >
              ¿Olvidaste tu contraseña? Recupérala aquí
            </Link>
          </Form.Item>
        </Form>
        <Modal
          title="Recuperar Contraseña"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleForgotPassword}>
            <Form.Item
              label="Correo Electrónico"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa tu correo electrónico',
                },
                {
                  type: 'email',
                  message: 'El correo electrónico no es válido',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <FormButton type="primary" htmlType="submit" className="w-full">
                Enviar Correo de Recuperación
              </FormButton>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default LoginPage;

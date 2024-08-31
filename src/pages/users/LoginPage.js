// src/pages/LoginPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import FormButton from '../../components/FormButton';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, sendResetPassword } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';

function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, login } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (authenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [authenticated, navigate, location]);

  const handleLogin = async (values) => {
    try {
      const user = await loginUser(values);

      if (user) {
        login(user);
        message.success('Inicio de sesión exitoso');

        const from = location.state?.from?.pathname || '/';
        navigate(from);
      } else {
        message.error('Credenciales inválidas');
      }
    } catch (error) {
      message.error('Error al iniciar sesión');
      console.error(error);
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      await sendResetPassword(values.email);
      message.success(
        'Correo de recuperación enviado, revisa tu bandeja de entrada'
      );
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error al enviar el correo de recuperación');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
          className="bg-white p-4 rounded shadow-md"
        >
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
            <Link to="/users/register">
              ¿No tienes una cuenta? Regístrate aquí
            </Link>
          </Form.Item>
          <Form.Item>
            <Link onClick={() => setIsModalVisible(true)}>
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
              <FormButton type="primary" htmlType="submit">
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

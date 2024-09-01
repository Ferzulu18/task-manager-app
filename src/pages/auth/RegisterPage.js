import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { handleError, handleSuccess } from '../../utils/errorUtils';

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [authenticated, navigate, location]);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await registerUser(values);

      if (response.status === 201) {
        handleSuccess('INF002');
        navigate('/auth/login');
      } else {
        handleError('ERR002');
      }
    } catch (error) {
      handleError('ERR002');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <Form
        onFinish={handleRegister}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        layout="vertical"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Registro de Usuario
        </h1>

        <Form.Item
          name="name"
          label="Nombre completo"
          rules={[
            { required: true, message: 'Por favor ingresa tu nombre completo' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
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
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: 'Por favor ingresa tu contraseña' },
            {
              min: 8,
              message: 'La contraseña debe tener al menos 8 caracteres',
            },
            {
              pattern:
                /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                'La contraseña debe ser alfanumérica y contener al menos un carácter especial',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirmar contraseña"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirma tu contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Las contraseñas no coinciden');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Registrarse
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterPage;

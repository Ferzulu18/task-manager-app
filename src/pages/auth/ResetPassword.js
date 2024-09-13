import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { resetPassword } from '../../services/authService.js';
import { handleError, handleSuccess } from '../../utils/error.js';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [token] = useState(
    new URLSearchParams(window.location.search).get('token')
  );

  // Maneja la lógica para restablecer la contraseña usando el token de la URL
  const handleResetPassword = async (values) => {
    try {
      await resetPassword(token, values.password);
      handleSuccess('INF005'); // Muestra un mensaje de éxito si el restablecimiento es exitoso
      navigate('/auth/login'); // Redirige al usuario a la página de inicio de sesión después de un restablecimiento exitoso
    } catch (error) {
      handleError('ERR006'); // Muestra un mensaje de error si ocurre un problema durante el proceso
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Restablecer Contraseña
        </h1>
        <Form form={form} onFinish={handleResetPassword} layout="vertical">
          <Form.Item
            label="Nueva Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu nueva contraseña',
              },
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
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirmar contraseña"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Por favor confirma tu nueva contraseña',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  // Verifica que la contraseña de confirmación coincida con la contraseña ingresada
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
            <Button type="primary" htmlType="submit" className="w-full">
              Restablecer Contraseña
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

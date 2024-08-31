// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { resetPassword } from '../../services/userService';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [token] = useState(
    new URLSearchParams(window.location.search).get('token')
  );

  const handleResetPassword = async (values) => {
    try {
      await resetPassword(token, values.password);
      message.success('Contraseña restablecida exitosamente');
      navigate('/users/login');
    } catch (error) {
      message.error('Error al restablecer la contraseña');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Restablecer Contraseña
        </h1>
        <Form
          form={form}
          onFinish={handleResetPassword}
          layout="vertical"
          className="bg-white p-4 rounded shadow-md"
        >
          <Form.Item
            label="Nueva Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu nueva contraseña',
              },
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

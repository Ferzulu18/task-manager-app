import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import FormButton from '../components/FormButton.js';
import { sendContact } from '../services/userService.js';
import { handleError, handleSuccess } from '../utils/error.js';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const handleContact = async (values) => {
    setLoading(true);
    try {
      await sendContact(values);
      handleSuccess('INF001');
    } catch (error) {
      handleError('ERR001');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-3">Contáctenos</h1>
      <hr className="w-24 border-2 border-blue-900 mb-8" />
      <Form
        name="contact"
        onFinish={handleContact}
        layout="vertical"
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Nombre Completo"
          name="name"
          rules={[
            { required: true, message: 'Por favor ingresa tu nombre completo' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Por favor ingresa un correo electrónico válido',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Asunto"
          name="subject"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el asunto de tu mensaje',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mensaje"
          name="message"
          rules={[{ required: true, message: 'Por favor ingresa tu mensaje' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <FormButton htmlType="submit" loading={loading}>
            Enviar Correo de Contacto
          </FormButton>
        </Form.Item>
      </Form>

      <div className="bg-gray-100 p-1 mt-10 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">
          Información de Contacto Adicional
        </h2>
        <p className="text-lg mb-3 flex items-center">
          <MailOutlined className="text-blue-900 mr-3" />
          <strong>Correo Electrónico:</strong>{' '}
          <a href="mailto:admin@example.com" className="ml-2 text-blue-600">
            admin@example.com
          </a>
        </p>
        <p className="text-lg mb-3 flex items-center">
          <PhoneOutlined className="text-blue-900 mr-3" />
          <strong>Teléfono:</strong>{' '}
          <a href="https://wa.me/573012345678" className="ml-2 text-blue-600">
            +57 301 234 5678
          </a>
        </p>
        <p className="text-lg flex items-center">
          <HomeOutlined className="text-blue-900 mr-3" />
          <strong>Dirección:</strong>{' '}
          <span className="ml-2">
            Calle 45 #67-89, El Poblado, Medellín, Colombia
          </span>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;

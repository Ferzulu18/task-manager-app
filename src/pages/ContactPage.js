import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import FormButton from '../components/FormButton';
import { sendContactEmail } from '../utils/mailtrapUtils';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const handleContact = async (values) => {
    setLoading(true);
    try {
      await sendContactEmail(values);
      message.success(
        'Tu mensaje ha sido enviado con éxito. ¡Gracias por contactarnos!'
      );
    } catch (error) {
      message.error(
        'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contáctenos</h1>
      <hr className="contact-divider" />
      <Form
        name="contact"
        onFinish={handleContact}
        layout="vertical"
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Nombre Completo"
          name="fullName"
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

      <div className="contact-container">
        <h2 className="contact-subtitle">Información de Contacto Adicional</h2>
        <p className="contact-subtitle-item">
          <MailOutlined className="contact-subtitle-icon" />
          <strong>Correo Electrónico:</strong>{' '}
          <a href="mailto:admin@example.com" className="contact-subtitle-text">
            admin@example.com
          </a>
        </p>
        <p className="contact-subtitle-item">
          <PhoneOutlined className="contact-subtitle-icon" />
          <strong>Teléfono:</strong>{' '}
          <a
            href="https://wa.me/573012345678"
            className="contact-subtitle-text"
          >
            +57 301 234 5678
          </a>
        </p>
        <p className="contact-subtitle-other">
          <HomeOutlined className="contact-subtitle-icon" />
          <strong>Dirección:</strong>{' '}
          <span className="contact-subtitle-text">
            Calle 45 #67-89, El Poblado, Medellín, Colombia
          </span>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;

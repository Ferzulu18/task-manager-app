// src/components/FormButton.js
import React from 'react';
import { Button } from 'antd';

const FormButton = ({ type, htmlType, style, children, ...props }) => {
  const defaultStyle = {
    backgroundColor: '#001529',
    color: 'white',
    border: 'none',
    ...style,
  };

  return (
    <Button
      type={type || 'primary'}
      htmlType={htmlType || 'button'}
      style={defaultStyle}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormButton;

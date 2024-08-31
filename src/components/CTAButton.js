// src/components/CTAButton.js
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const CTAButton = ({ to, text }) => {
  return (
    <Link to={to}>
      <Button type="primary" size="large" className="w-full">
        {text}
      </Button>
    </Link>
  );
};

export default CTAButton;

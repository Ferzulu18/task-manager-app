import React from 'react';
import { Layout } from 'antd';

export const { Footer: FooterLayout } = Layout;

function Footer() {
  return (
    <FooterLayout className="footer">
      <div className="flex flex-wrap justify-center items-center gap-5">
        <p className="m-0">
          &copy; {new Date().getFullYear()} Todos los derechos reservados.
        </p>
        <p className="m-0">Desarrollado por Fernando Esteban Zuluaga</p>
        <p className="m-0">
          Contacto:{' '}
          <a
            href="mailto:ferzulu18@gmail.com"
            className="text-[#1890ff] hover:underline"
          >
            ferzulu18@gmail.com
          </a>
        </p>
      </div>
    </FooterLayout>
  );
}

export default Footer;

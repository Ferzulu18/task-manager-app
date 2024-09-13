import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Avatar, Dropdown, Drawer, Button } from 'antd';
import {
  UserOutlined,
  MenuOutlined,
  HomeOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  InfoCircleOutlined,
  IdcardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext.js';
import './Header.css';

function Header() {
  // State para controlar la visibilidad del menú lateral (Drawer)
  const [visible, setVisible] = useState(false);

  // Hook para la navegación programática
  const navigate = useNavigate();

  // Contexto de autenticación para obtener estado de autenticación y funciones de usuario
  const { authenticated, user, logout } = useContext(AuthContext);

  // Hook para manejar cambios en la autenticación y el usuario (vacío en esta versión)
  useEffect(() => {}, [authenticated, user]);

  // Función para manejar el cierre de sesión y redireccionar al login
  const handleLogout = () => {
    logout(); // Llama a la función de cierre de sesión del contexto
    navigate('/auth/login'); // Redirige al login
  };

  // Elementos del menú desplegable del usuario
  const menuItems = [
    {
      key: 'profile',
      label: <NavLink to="/auth/profile">Ver Perfil</NavLink>,
      icon: <IdcardOutlined />,
    },
    {
      key: 'logout',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      onClick: handleLogout, // Llama a la función de cierre de sesión al hacer clic
    },
  ];

  // Configuración del menú desplegable del usuario
  const menu = {
    items: menuItems.map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      onClick: item.onClick,
    })),
  };

  // Elementos del menú de navegación basado en el rol del usuario
  const navItems = [
    {
      key: 'home',
      label: <NavLink to="/">Inicio</NavLink>,
      icon: <HomeOutlined />,
    },
    authenticated &&
      user &&
      user.role === 'user' && {
        key: 'dashboard',
        label: <NavLink to="/dashboard">Mis Tareas</NavLink>,
        icon: <CheckSquareOutlined />,
      },
    authenticated &&
      user &&
      user.role === 'admin' && {
        key: 'dashboard',
        label: <NavLink to="/supervise">Supervisión</NavLink>,
        icon: <CheckSquareOutlined />,
      },
    {
      key: 'about',
      label: <NavLink to="/about">Qué Hacemos</NavLink>,
      icon: <InfoCircleOutlined />,
    },
    {
      key: 'contact',
      label: <NavLink to="/contact">Contáctenos</NavLink>,
      icon: <MessageOutlined />,
    },
  ].filter(Boolean); // Filtra los elementos falsy (para usuarios no autenticados o sin rol)

  // Configuración del menú de navegación con estilos
  const navMenu = navItems.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    className:
      'hover:text-[#001529] hover:bg-[#f0f0f0] border-b-2 border-transparent hover:border-[#1890ff]',
  }));

  // Función para alternar la visibilidad del Drawer
  const toggleDrawer = () => {
    setVisible(!visible);
  };

  return (
    <header className="bg-[#001529] p-4 shadow-md">
      <nav className="flex justify-between items-center">
        <Button
          className="text-white ml-4"
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleDrawer}
        />
        <Drawer
          title="Menú"
          placement="left"
          closable={false}
          onClose={toggleDrawer}
          open={visible}
          className="bg-white"
        >
          <Menu
            mode="inline"
            theme="light"
            className="text-[#001529]"
            items={navMenu}
          />
        </Drawer>
        <div className="flex items-center">
          {!authenticated ? (
            <>
              <Button
                className="text-white ml-4"
                type="link"
                onClick={() => navigate('/auth/register')}
              >
                Registrarme
              </Button>
              <Button
                className="text-white ml-4"
                type="link"
                onClick={() => navigate('/auth/login')}
              >
                Iniciar sesión
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-end">
              <p className="m-0 mr-4 text-white">{user.name}</p>
              <Dropdown menu={menu} placement="bottomRight" trigger={['click']}>
                <Avatar
                  icon={<UserOutlined />}
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`}
                  className="cursor-pointer"
                />
              </Dropdown>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

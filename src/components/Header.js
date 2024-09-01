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
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { authenticated, user, logout } = useContext(AuthContext);

  useEffect(() => {}, [authenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

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
      onClick: handleLogout,
    },
  ];

  const menu = {
    items: menuItems.map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      onClick: item.onClick,
    })),
  };

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
  ].filter(Boolean);

  const navMenu = navItems.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    className:
      'hover:text-[#001529] hover:bg-[#f0f0f0] border-b-2 border-transparent hover:border-[#1890ff]',
  }));

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

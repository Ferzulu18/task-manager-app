import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Avatar, Dropdown, Drawer, Button } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { authenticated, user, logout } = useContext(AuthContext);

  useEffect(() => {
    // console.log('header', 'authenticated', authenticated, 'user', user);
  }, [authenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/users/login');
  };

  const menuItems = [
    {
      key: 'profile',
      label: <NavLink to="/users/profile">Ver Perfil</NavLink>,
    },
    { key: 'logout', label: 'Cerrar Sesión', onClick: handleLogout },
  ];

  const menu = {
    items: menuItems.map((item) => ({
      key: item.key,
      label: item.label,
      onClick: item.onClick,
    })),
  };

  const navItems = [
    {
      key: 'home',
      label: <NavLink to="/">Inicio</NavLink>,
    },
    authenticated && {
      key: 'dashboard',
      label: <NavLink to="/users/dashboard">Mis Tareas</NavLink>,
    },
    {
      key: 'about',
      label: <NavLink to="/about">Qué Hacemos</NavLink>,
    },
    {
      key: 'contact',
      label: <NavLink to="/contact">Contáctenos</NavLink>,
    },
  ].filter(Boolean);

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  return (
    <header className="header">
      <nav className="nav">
        <Button
          className="menu-button"
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
          key="drawer"
          className="drawer-menu"
        >
          <Menu mode="inline" theme="dark" items={navItems} />
        </Drawer>
        {authenticated && user && (
          <Dropdown menu={menu} placement="bottomRight" trigger={['click']}>
            <Avatar
              icon={<UserOutlined />}
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`}
              className="avatar"
            />
          </Dropdown>
        )}
      </nav>
    </header>
  );
}

export default Header;

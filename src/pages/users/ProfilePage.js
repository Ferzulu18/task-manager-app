// src/pages/users/ProfilePage.js
import React, { useEffect, useContext } from 'react';
import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';

function ProfilePage() {
  const { authenticated, user } = useContext(AuthContext);

  useEffect(() => {
    // console.log('profile', 'authenticated', authenticated, 'user', user);
  }, [authenticated, user]);

  if (!user) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Perfil de Usuario" className="w-full max-w-md">
        <div className="text-center">
          <Avatar
            icon={<UserOutlined />}
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`}
            size={64}
          />
          <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
          <p className="text-lg mt-2">{user.email}</p>
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;

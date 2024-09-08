import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Layout } from 'antd';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import HomePage from './pages/HomePage.js';
import AboutPage from './pages/AboutPage.js';
import ContactPage from './pages/ContactPage.js';
import RegisterPage from './pages/auth/RegisterPage.js';
import LoginPage from './pages/auth/LoginPage.js';
import UserTasksPage from './pages/UserTasksPage.js';
import AdminTasksPage from './pages/AdminTasksPage.js';
import ProfilePage from './pages/auth/ProfilePage.js';
import ResetPasswordPage from './pages/auth/ResetPassword.js';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout className="layout">
          <Header />
          <Layout className="site-layout">
            <Content className="site-layout-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<UserTasksPage />} />
                <Route path="/supervise" element={<AdminTasksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/reset" element={<ResetPasswordPage />} />
                <Route path="/auth/profile" element={<ProfilePage />} />
              </Routes>
            </Content>
            <Footer />
          </Layout>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

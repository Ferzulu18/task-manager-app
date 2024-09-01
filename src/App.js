import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import UserTasksPage from './pages/UserTasksPage';
import AdminTasksPage from './pages/AdminTasksPage';
import ProfilePage from './pages/auth/ProfilePage';
import ResetPasswordPage from './pages/auth/ResetPassword';
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

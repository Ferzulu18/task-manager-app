// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/users/RegisterPage';
import LoginPage from './pages/users/LoginPage'; // Nueva ruta
import UserTasksPage from './pages/users/UserTasksPage';
import ProfilePage from './pages/users/ProfilePage';
import ResetPasswordPage from './pages/users/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/users/register" element={<RegisterPage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/reset" element={<ResetPasswordPage />} />
          <Route path="/users/profile" element={<ProfilePage />} />
          <Route path="/users/dashboard" element={<UserTasksPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

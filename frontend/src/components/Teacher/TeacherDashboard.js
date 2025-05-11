import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../../utils';
import Sidebar from './TSidebar';
import Chatbot from '../Chatbot';  // Import Chatbot
import '../../css/TeacherCss/TeacherDashboardLayout.css';

const TeacherDashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      setLoggedInUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="teacher-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Teacher Dashboard</h2>
      </div>
      <Chatbot />  {/* Add Chatbot here */}
      <ToastContainer />
    </div>
  );
};

export default TeacherDashboard;

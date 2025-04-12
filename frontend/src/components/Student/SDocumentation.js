import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import Sidebar from './SSidebar';
import '../../css/StudentCss/StudentDashboardLayout.css';
import '../../css/StudentCss/sDocumentation.css';

const SDocumentation = () => {
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
    handleSuccess('User Loggedout');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="student-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Documentation</h2>
        {/* Add your documentation upload/preview UI here */}
        <p>This is where the student can upload or view project documentation.</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SDocumentation;

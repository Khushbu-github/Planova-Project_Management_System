import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import Sidebar from './SSidebar';
import '../../css/StudentCss/StudentDashboardLayout.css';
import '../../css/StudentCss/sProjectStatus.css';

const SProjectStatus = () => {
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
        <h2>Project Status</h2>
        {/* Add your status table, cards or status list here */}
        <p>This is where project status info will appear.</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SProjectStatus;

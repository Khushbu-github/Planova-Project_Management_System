import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../../utils';
import Sidebar from './TSidebar';
import Chatbot from '../Chatbot';
import TeacherTeams from './TeacherTeams';

const TeacherDashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  // Dark theme with gradient styles
  const styles = {
    container: {
      display: 'flex',
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    },
    contentArea: {
      flex: '1',
      padding: '40px',  // Increased padding for more space
      overflowY: 'auto',
      backgroundColor: '#121212',
    },
    welcomeHeading: {
      background: 'linear-gradient(90deg, #a36fe7 0%, #5271ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.5rem',
      marginBottom: '25px',  // Increased margin for more space
    },
    subHeading: {
      background: 'linear-gradient(90deg, #9669e0 30%, #6f89ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.8rem',
      marginBottom: '30px',  // Increased margin for more space
    }
  };

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
    <div style={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.contentArea}>
        <h1 style={styles.welcomeHeading}>Welcome, {loggedInUser?.name}</h1>
        <h3 style={styles.subHeading}>Student Teams</h3>
        <TeacherTeams />
      </div>
      <Chatbot />
      <ToastContainer />
    </div>
  );
};

export default TeacherDashboard;
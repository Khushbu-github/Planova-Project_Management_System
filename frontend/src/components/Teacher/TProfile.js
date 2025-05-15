import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import Sidebar from './TSidebar';

// Icons
import { FaUser, FaEnvelope, FaUserShield } from 'react-icons/fa';

const TProfile = () => {
  const [user, setUser] = useState(null);
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
      padding: '30px',
      overflowY: 'auto',
      backgroundColor: '#121212',
    },
    welcomeHeading: {
      background: 'linear-gradient(90deg, #a36fe7 0%, #5271ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.5rem',
      marginBottom: '10px',
    },
    subHeading: {
      background: 'linear-gradient(90deg, #9669e0 30%, #6f89ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.8rem',
      marginBottom: '25px',
    },
    profileContainer: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      maxWidth: '600px',
      border: '1px solid #333',
    },
    profileField: {
      marginBottom: '20px',
      padding: '15px',
      borderBottom: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    fieldLabel: {
      color: '#8a8a8a',
      fontSize: '0.9rem',
      marginBottom: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    fieldValue: {
      color: '#ffffff',
      fontSize: '1.2rem',
      padding: '5px 0',
    },
    nameValue: {
      background: 'linear-gradient(90deg, #c074fc 0%, #7592ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    emailValue: {
      color: '#a8c0ff',
      fontSize: '1.2rem',
    },
    roleValue: {
      background: 'linear-gradient(90deg, #9056ec 0%, #7fa0ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    loadingText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '1.5rem',
      padding: '100px 0',
      background: '#121212',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          toast.error(data.message || 'Failed to load profile');
        }
      } catch (err) {
        toast.error('Server error loading profile');
      }
    };

    fetchProfile();

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

  if (!user) return <div style={styles.loadingText}>Loading profile...</div>;

  return (
    <div style={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.contentArea}>
        <h1 style={styles.welcomeHeading}>Welcome, {loggedInUser?.name}</h1>
        <h2 style={styles.subHeading}>Profile</h2>
        <div style={styles.profileContainer}>
          <div style={styles.profileField}>
            <span style={styles.fieldLabel}>
              <FaUser style={{ color: '#c074fc' }} />
              NAME
            </span>
            <span style={styles.nameValue}>{user.name}</span>
          </div>
          
          <div style={styles.profileField}>
            <span style={styles.fieldLabel}>
              <FaEnvelope style={{ color: '#a8c0ff' }} />
              EMAIL
            </span>
            <span style={styles.emailValue}>{user.email}</span>
          </div>
          
          <div style={styles.profileField}>
            <span style={styles.fieldLabel}>
              <FaUserShield style={{ color: '#9056ec' }} />
              ROLE
            </span>
            <span style={styles.roleValue}>{user.role}</span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TProfile;

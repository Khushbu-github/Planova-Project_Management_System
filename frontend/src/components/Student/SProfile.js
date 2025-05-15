import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import Sidebar from './SSidebar';

// Icons
import { FaUser, FaEnvelope, FaUserGraduate, FaLayerGroup } from 'react-icons/fa';

const SProfile = () => {
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

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

  const styles = {
    container: {
      display: 'flex',
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: 'sans-serif',
    },
    contentArea: {
      flex: '1',
      padding: '30px',
      overflowY: 'auto',
      backgroundColor: '#101010',
    },
    title: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.5rem',
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    subtitle: {
      background: 'linear-gradient(90deg, #9b5de5 30%, #00bbf9 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.8rem',
      marginBottom: '25px',
    },
    profileContainer: {
      backgroundColor: '#121212',
      borderRadius: '12px',
      padding: '30px',
      maxWidth: '600px',
      border: '1px solid #333',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
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
      color: '#b39ddb',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    fieldValue: {
      color: '#e0e0e0',
      fontSize: '1.2rem',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  };

  if (!user) return <p style={styles.loading}>Loading profile...</p>;

  return (
    <>
      <div style={styles.container}>
        <Sidebar onLogout={handleLogout} />
        <div style={styles.contentArea}>
          <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
          <h2 style={styles.subtitle}>Profile</h2>
          <div style={styles.profileContainer}>
            <div style={styles.profileField}>
              <span style={styles.fieldLabel}>
                <FaUser style={{ color: '#c084fc' }} />
                NAME
              </span>
              <span style={styles.fieldValue}>{user.name}</span>
            </div>

            <div style={styles.profileField}>
              <span style={styles.fieldLabel}>
                <FaEnvelope style={{ color: '#7ec8ff' }} />
                EMAIL
              </span>
              <span style={styles.fieldValue}>{user.email}</span>
            </div>

            <div style={styles.profileField}>
              <span style={styles.fieldLabel}>
                <FaUserGraduate style={{ color: '#a371f7' }} />
                ROLE
              </span>
              <span style={styles.fieldValue}>{user.role}</span>
            </div>

            {user.role === 'student' && user.semester && (
              <div style={styles.profileField}>
                <span style={styles.fieldLabel}>
                  <FaLayerGroup style={{ color: '#84fab0' }} />
                  SEMESTER
                </span>
                <span style={styles.fieldValue}>{user.semester}</span>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SProfile;

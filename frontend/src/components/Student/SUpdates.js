import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SSidebar';
// Removed CSS imports as we're using inline styles
// import '../../css/StudentCss/StudentDashboardLayout.css';

const SUpdates = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) setLoggedInUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('Logged out');
    setTimeout(() => navigate('/login'), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/updates/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, message })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Update submitted!');
        setTitle('');
        setMessage('');
      } else {
        toast.error(data.message || 'Failed to submit update');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  // Dark theme styles with purple and blue gradients consistent with other components
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      position: 'relative',
      fontFamily: 'sans-serif'
    },
    contentArea: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      padding: '25px 30px',
      overflowY: 'auto',
      backgroundColor: '#101010'
    },
    title: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.5rem',
      marginBottom: '10px',
      fontWeight: 'bold',
      fontFamily: 'sans-serif'
    },
    subtitle: {
      color: '#e0e0e0',
      fontSize: '1.8rem',
      marginBottom: '25px',
      fontFamily: 'sans-serif'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
   
      width: '100%'
    },
    input: {
      backgroundColor: '#121212',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '15px',
      color: '#fff',
      fontSize: '1rem',
      fontFamily: 'sans-serif',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      width: '100%'
    },
    inputFocus: {
      borderColor: '#b721ff'
    },
    textarea: {
      backgroundColor: '#121212',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '15px',
      color: '#fff',
      fontSize: '1rem',
      fontFamily: 'sans-serif',
      minHeight: '150px',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      width: '100%'
    },
    button: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      padding: '15px 25px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      alignSelf: 'flex-start',
      fontFamily: 'sans-serif'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 18px rgba(142, 45, 226, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.contentArea}>
        <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
        <h2 style={styles.subtitle}>Submit Project Update</h2>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Update Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#b721ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#333';
            }}
          />
          
          <textarea
            placeholder="Update Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={styles.textarea}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#b721ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#333';
            }}
          ></textarea>
          
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(142, 45, 226, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Send Update
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SUpdates;
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from './TSidebar';

const TUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

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
    heading: {
      background: 'linear-gradient(90deg, #a36fe7 0%, #5271ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.2rem',
      marginBottom: '25px',
    },
    noUpdates: {
      color: '#aaaaaa',
      fontSize: '1.2rem',
      textAlign: 'center',
      padding: '50px 0',
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      marginTop: '20px',
      border: '1px solid #333',
    },
    updatesList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    updateCard: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      border: '1px solid #333',
      transition: 'transform 0.3s ease',
    },
    updateTitle: {
      background: 'linear-gradient(90deg, #c074fc 0%, #7592ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.4rem',
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    studentName: {
      color: '#9f7aea',
      fontSize: '1.1rem',
      fontStyle: 'italic',
      marginBottom: '12px',
      display: 'block',
    },
    updateMessage: {
      color: '#dddddd',
      fontSize: '1rem',
      lineHeight: '1.6',
      padding: '10px 0',
      margin: '10px 0',
      borderTop: '1px solid #333',
      borderBottom: '1px solid #333',
    },
    timestamp: {
      color: '#888888',
      fontSize: '0.9rem',
      display: 'block',
      textAlign: 'right',
      marginTop: '10px',
    },
    loadingText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '1.5rem',
      padding: '100px 0',
    }
  };

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/updates/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) setUpdates(data);
        else toast.error(data.message || 'Failed to fetch updates');
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.contentArea}>
        <h2 style={styles.heading}>Student Updates</h2>
        
        {loading ? (
          <div style={styles.loadingText}>Loading updates...</div>
        ) : updates.length === 0 ? (
          <p style={styles.noUpdates}>No updates found.</p>
        ) : (
          <ul style={styles.updatesList}>
            {updates.map((update) =>
              update.studentId ? (
                <li 
                  key={update._id} 
                  style={styles.updateCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <div style={styles.updateTitle}>{update.title}</div>
                  <span style={styles.studentName}>from {update.studentId.name}</span>
                  <p style={styles.updateMessage}>{update.message}</p>
                  <small style={styles.timestamp}>
                    {new Date(update.createdAt).toLocaleString()}
                  </small>
                </li>
              ) : null
            )}
          </ul>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TUpdates;
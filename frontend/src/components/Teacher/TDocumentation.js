import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import Sidebar from './TSidebar';

const TDocumentation = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);


  // Dark theme with gradient styles (matching TUpdates)
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
    welcomeText: {
      color: '#dddddd',
      fontSize: '1.2rem',
      marginBottom: '20px',
    },
    noDocuments: {
      color: '#aaaaaa',
      fontSize: '1.2rem',
      textAlign: 'center',
      padding: '50px 0',
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      marginTop: '20px',
      border: '1px solid #333',
    },
    documentsList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    documentCard: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      border: '1px solid #333',
      transition: 'transform 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    },
    documentTitle: {
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
    viewButton: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      padding: '10px 16px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      marginTop: 'auto',
      alignSelf: 'flex-end',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    timestamp: {
      color: '#888888',
      fontSize: '0.9rem',
      display: 'block',
      marginTop: '10px',
      marginBottom: '15px',
    },
    loadingText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '1.5rem',
      padding: '100px 0',
    }
  };

  useEffect(() => {
    // Get logged in user data
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      setLoggedInUser(JSON.parse(userData));
    }
    
    // Fetch documents
    const fetchDocs = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/documents/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setDocuments(data);
        } else {
          toast.error(data.message || 'Failed to load documents');
        }
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  

  const handleViewDocument = (documentId) => {
    // Navigate to a document view page or open in a new tab
    // This is a placeholder - implement according to your application's needs
    toast.info('Opening document...');
    // navigate(`/teacher/document/${documentId}`);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.contentArea}>
        <h2 style={styles.heading}>Documentation</h2>
        <p style={styles.welcomeText}>Welcome, {loggedInUser?.name}</p>
        
        {loading ? (
          <div style={styles.loadingText}>Loading documents...</div>
        ) : documents.length === 0 ? (
          <p style={styles.noDocuments}>No documents uploaded yet.</p>
        ) : (
          <ul style={styles.documentsList}>
            {documents.map((doc) =>
              doc.studentId ? (
                <li 
                  key={doc._id} 
                  style={styles.documentCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <div style={styles.documentTitle}>{doc.title}</div>
                  <span style={styles.studentName}>from {doc.studentId.name}</span>
                  {doc.createdAt && (
                    <small style={styles.timestamp}>
                      {new Date(doc.createdAt).toLocaleString()}
                    </small>
                  )}
                  <button 
                    style={styles.viewButton}
                    onClick={() => handleViewDocument(doc._id)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#3a4a65';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#2d3748';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    View Document
                  </button>
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

export default TDocumentation;
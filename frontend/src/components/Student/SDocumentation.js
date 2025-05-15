import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import Sidebar from './SSidebar';
// Removed CSS imports as we're using inline styles
// import '../../css/StudentCss/StudentDashboardLayout.css';
// import '../../css/StudentCss/sDocumentation.css';

const SDocumentation = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file selected');
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Document uploaded successfully');
        setTitle('');
        setFile(null);
        setFileName('No file selected');
      } else {
        toast.error(data.message || 'Upload failed');
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
      marginBottom: '20px',
      fontFamily: 'sans-serif'
    },
    description: {
      color: '#9e9e9e',
      fontSize: '1.1rem',
      marginBottom: '30px',
      fontFamily: 'sans-serif'
    },
    uploadForm: {
      backgroundColor: '#121212',
      borderRadius: '10px',
      padding: '30px',
  
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      border: '1px solid #333',
      fontFamily: 'sans-serif',
      animation: 'fadeIn 0.5s ease'
    },
    formGroup: {
      marginBottom: '20px'
    },
    inputText: {
      width: '100%',
      padding: '12px 15px',
      backgroundColor: '#1e1e1e',
      border: '1px solid #333',
      borderRadius: '5px',
      color: '#e0e0e0',
      fontSize: '1rem',
      fontFamily: 'sans-serif',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    fileInputContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '25px'
    },
    customFileInput: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    fileLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 15px',
      backgroundColor: '#2d2d2d',
      border: '1px solid #444',
      borderRadius: '5px',
      color: '#b39ddb',
      cursor: 'pointer',
      fontSize: '1rem',
      fontFamily: 'sans-serif',
      transition: 'all 0.3s ease'
    },
    fileInputHidden: {
      display: 'none'
    },
    fileName: {
      padding: '8px 0',
      color: '#9e9e9e',
      fontSize: '0.9rem',
      fontFamily: 'sans-serif'
    },
    submitButton: {
      background: 'linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '12px 20px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      fontFamily: 'sans-serif',
      width: '100%',
      marginTop: '10px'
    },
    buttonHover: {
      boxShadow: '0 4px 15px rgba(142, 45, 226, 0.4)',
      transform: 'translateY(-2px)'
    }
  };

  // For animation
  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <Sidebar onLogout={handleLogout} />
        <div style={styles.contentArea}>
          <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
          <h2 style={styles.subtitle}>Documentation</h2>
          <p style={styles.description}>
            This is where you can upload or view project documentation.
          </p>

          <form onSubmit={handleUpload} style={styles.uploadForm}>
            <div style={styles.formGroup}>
              <input
                type="text"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.inputText}
              />
            </div>
            
            <div style={styles.fileInputContainer}>
              <div style={styles.customFileInput}>
                <label 
                  htmlFor="document-file" 
                  style={styles.fileLabel}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#363636';
                    e.currentTarget.style.borderColor = '#555';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#2d2d2d';
                    e.currentTarget.style.borderColor = '#444';
                  }}
                >
                  Choose Document (.pdf, .doc, .docx)
                </label>
                <input
                  id="document-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  style={styles.fileInputHidden}
                />
              </div>
              <div style={styles.fileName}>{fileName}</div>
            </div>
            
            <button 
              type="submit" 
              style={styles.submitButton}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(142, 45, 226, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Upload Document
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SDocumentation;
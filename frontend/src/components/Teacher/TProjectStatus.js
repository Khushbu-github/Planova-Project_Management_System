import React, { useState, useEffect } from 'react';
import Sidebar from './TSidebar';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TProjectStatus = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [task, setTask] = useState({ title: '', description: '', studentId: '' });
  const [loading, setLoading] = useState(true);
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
    formContainer: {
      backgroundColor: '#1e1e1e',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      
      border: '1px solid #333',
    },
    inputField: {
      width: '100%',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      padding: '12px 15px',
      color: '#ffffff',
      fontSize: '1rem',
      marginBottom: '20px',
      outline: 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    textareaField: {
      width: '100%',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      padding: '12px 15px',
      color: '#ffffff',
      fontSize: '1rem',
      marginBottom: '20px',
      minHeight: '150px',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      fontFamily: 'Arial, sans-serif',
    },
    selectField: {
      width: '100%',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      padding: '12px 15px',
      color: '#ffffff',
      fontSize: '1rem',
      marginBottom: '25px',
      outline: 'none',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: 'linear-gradient(45deg, transparent 50%, #8a8a8a 50%), linear-gradient(135deg, #8a8a8a 50%, transparent 50%)',
      backgroundPosition: 'calc(100% - 20px) center, calc(100% - 15px) center',
      backgroundSize: '5px 5px, 5px 5px',
      backgroundRepeat: 'no-repeat',
    },
    button: {
      background: 'linear-gradient(90deg, #6441a5 0%, #2a73cc 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '14px 25px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(106, 90, 205, 0.4)',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(106, 90, 205, 0.5)',
    },
    fieldLabel: {
      color: '#a8a8a8',
      marginBottom: '8px',
      display: 'block',
      fontSize: '0.9rem',
    },
    loadingText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '1.5rem',
      padding: '100px 0',
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) setLoggedInUser(JSON.parse(userData));

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized access');
      navigate('/login');
      return;
    }

    setLoading(true);
    fetch('http://localhost:5000/api/tasks/students', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Forbidden');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          throw new Error('Invalid student data');
        }
      })
      .catch(err => {
        console.error('Failed to load students:', err);
        toast.error("Failed to fetch students");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleAssign = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/tasks/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Task Assigned");
        setTask({ title: '', description: '', studentId: '' });
      } else {
        toast.error(data.message || "Assignment failed");
      }
    } catch (err) {
      toast.error("An error occurred while assigning task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('Logged out');
    setTimeout(() => navigate('/login'), 1000);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Sidebar onLogout={handleLogout} />
        <div style={styles.contentArea}>
          <div style={styles.loadingText}>Loading students data...</div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.contentArea}>
        <h1 style={styles.welcomeHeading}>Welcome, {loggedInUser?.name}</h1>
        <h2 style={styles.subHeading}>Assign Project Task</h2>
        
        <div style={styles.formContainer}>
          <div>
            <label style={styles.fieldLabel}>TITLE</label>
            <input
              style={{
                ...styles.inputField,
                ':focus': {
                  borderColor: '#6441a5',
                  boxShadow: '0 0 0 2px rgba(106, 90, 205, 0.2)',
                }
              }}
              name="title"
              placeholder="Enter task title"
              value={task.title}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#6441a5';
                e.target.style.boxShadow = '0 0 0 2px rgba(106, 90, 205, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div>
            <label style={styles.fieldLabel}>DESCRIPTION</label>
            <textarea
              style={{
                ...styles.textareaField,
                ':focus': {
                  borderColor: '#6441a5',
                  boxShadow: '0 0 0 2px rgba(106, 90, 205, 0.2)',
                }
              }}
              name="description"
              placeholder="Provide detailed task description"
              value={task.description}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#6441a5';
                e.target.style.boxShadow = '0 0 0 2px rgba(106, 90, 205, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div>
            <label style={styles.fieldLabel}>STUDENT</label>
            <select
              style={{
                ...styles.selectField,
                ':focus': {
                  borderColor: '#6441a5',
                  boxShadow: '0 0 0 2px rgba(106, 90, 205, 0.2)',
                }
              }}
              name="studentId"
              value={task.studentId}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#6441a5';
                e.target.style.boxShadow = '0 0 0 2px rgba(106, 90, 205, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#444';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Select a student</option>
              {Array.isArray(students) &&
                students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
          
          <button 
            style={styles.button}
            onClick={handleAssign}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(106, 90, 205, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 10px rgba(106, 90, 205, 0.4)';
            }}
          >
            Assign Task
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TProjectStatus;
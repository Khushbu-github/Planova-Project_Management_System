import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SSidebar';
// Removed CSS imports as we're using inline styles
// import '../../css/StudentCss/StudentDashboardLayout.css';
// import '../../css/StudentCss/sProjectStatus.css';

const SProjectStatus = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) setLoggedInUser(JSON.parse(userData));

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/tasks/student', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(data);
        } else {
          toast.error(data.message || "Failed to fetch tasks");
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('Logged out');
    setTimeout(() => navigate('/login'), 1000);
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
    taskList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    taskItem: {
      backgroundColor: '#121212',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      border: '1px solid #333',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      fontFamily: 'sans-serif'
    },
    taskItemHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 18px rgba(142, 45, 226, 0.2)'
    },
    taskTitle: {
      color: '#b39ddb',
      fontSize: '1.3rem',
      marginBottom: '10px',
      fontWeight: 'bold',
      fontFamily: 'sans-serif'
    },
    taskDescription: {
      color: '#e0e0e0',
      fontSize: '1rem',
      lineHeight: '1.5',
      fontFamily: 'sans-serif'
    },
    noTasks: {
      color: '#9e9e9e',
      fontSize: '1.1rem',
      textAlign: 'center',
      marginTop: '30px',
      backgroundColor: '#121212',
      borderRadius: '10px',
      padding: '20px',
      fontFamily: 'sans-serif'
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.contentArea}>
        <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
        <h2 style={styles.subtitle}>Your Assigned Tasks</h2>
        
        {tasks.length > 0 ? (
          <ul style={styles.taskList}>
            {tasks.map(task => (
              <li 
                key={task._id} 
                style={styles.taskItem}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(142, 45, 226, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.5)';
                }}
              >
                <div style={styles.taskTitle}>{task.title}</div>
                <p style={styles.taskDescription}>{task.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div style={styles.noTasks}>
            No tasks assigned yet. Check back later or contact your team leader.
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SProjectStatus;
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SSidebar';
import '../../css/StudentCss/StudentDashboardLayout.css';
import '../../css/StudentCss/sProjectStatus.css';

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

  return (
    <div className="student-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Your Assigned Tasks</h2>
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SProjectStatus;

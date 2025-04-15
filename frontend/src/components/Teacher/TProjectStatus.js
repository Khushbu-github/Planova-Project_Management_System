import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../../utils';
import Sidebar from './TSidebar';
import '../../css/TeacherCss/tProjectStatus.css';

const TProjectStatus = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      setLoggedInUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects/all', {
          headers: {
            'Authorization': token
          }
        });
        const result = await response.json();
        if (result.success) {
          setProjects(result.projects);
        } else {
          handleError(result.message);
        }
      } catch (err) {
        handleError("Error fetching submissions");
      }
    };
    fetchSubmissions();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="teacher-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>All Student Project Submissions</h2>
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project._id} className="project-item">
              <strong>{project.title}</strong> by {project.student?.name || "Unknown Student"}<br />
              <small>{project.description}</small>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TProjectStatus; 
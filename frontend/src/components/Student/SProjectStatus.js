import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../../utils';
import Sidebar from './SSidebar';
import '../../css/StudentCss/StudentDashboardLayout.css';
import '../../css/StudentCss/sProjectStatus.css';

const SProjectStatus = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [project, setProject] = useState({
    title: '',
    description: ''
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project.title || !project.description) {
      return handleError("Both title and description are required");
    }

    try {
      const response = await fetch('http://localhost:5000/api/projects/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(project)
      });

      const result = await response.json();
      if (result.success) {
        handleSuccess("Project submitted successfully!");
        setProject({ title: '', description: '' });
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError("Error submitting project");
    }
  };

  return (
    <div className="student-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Submit Your Project</h2>
        <form onSubmit={handleSubmit} className="project-form">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={project.title}
            onChange={handleChange}
            placeholder="Project Title"
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            placeholder="Project Description"
          />

          <button type="submit">Submit Project</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SProjectStatus; 
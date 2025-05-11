import React, { useState, useEffect } from 'react';
import Sidebar from './TSidebar';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../css/TeacherCss/tProjectStatus.css';

const TProjectStatus = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [task, setTask] = useState({ title: '', description: '', studentId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) setLoggedInUser(JSON.parse(userData));

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized access');
      navigate('/login');
      return;
    }

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

  return (
    <div className="teacher-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Assign Project Task</h2>

        <input
          name="title"
          placeholder="Title"
          value={task.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={task.description}
          onChange={handleChange}
        />
        <select
          name="studentId"
          value={task.studentId}
          onChange={handleChange}
        >
          <option value="">Select Student</option>
          {Array.isArray(students) &&
            students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
        </select>
        <button onClick={handleAssign}>Assign Task</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TProjectStatus;

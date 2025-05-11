import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from './TSidebar';
import '../../css/TeacherCss/TeacherDashboardLayout.css';

const TUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
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
      }
    };

    fetchUpdates();
  }, []);

  return (
    <div className="teacher-dashboard-container">
      <Sidebar />
      <div className="content-area">
        <h2>Student Updates</h2>
        <ul>
          {updates.map((update) => (
            <li key={update._id}>
              <strong>{update.title}</strong> from <em>{update.studentId.name}</em>
              <p>{update.message}</p>
              <small>{new Date(update.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TUpdates;

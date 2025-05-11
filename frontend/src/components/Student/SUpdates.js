import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from './SSidebar';
import '../../css/StudentCss/StudentDashboardLayout.css';

const SUpdates = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/updates/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, message })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Update submitted!');
        setTitle('');
        setMessage('');
      } else {
        toast.error(data.message || 'Failed to submit update');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="student-dashboard-container">
      <Sidebar />
      <div className="content-area">
        <h2>Submit Project Update</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Update Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Update Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Send Update</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SUpdates;

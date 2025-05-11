import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import Sidebar from './SSidebar';
import '../../css/StudentCss/StudentDashboardLayout.css';
import '../../css/StudentCss/sDocumentation.css';

const SDocumentation = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
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
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="student-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Documentation</h2>
        <p>This is where the student can upload or view project documentation.</p>

        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="text"
            placeholder="Enter document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit">Upload Document</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SDocumentation;

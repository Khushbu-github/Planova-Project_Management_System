import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { handleSuccess } from '../../utils';
import Sidebar from './TSidebar';
import '../../css/TeacherCss/tDocumentation.css';

const TDocumentation = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get logged in user data
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      setLoggedInUser(JSON.parse(userData));
    }

    // Fetch documents
    const fetchDocs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/documents/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setDocuments(data);
        else toast.error(data.message || 'Failed to load documents');
      } catch (err) {
        toast.error('Something went wrong');
      }
    };
    
    fetchDocs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Loggedout');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="teacher-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Documentation</h2>
        
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul className="doc-list">
            {documents.map((doc) => (
              <li key={doc._id} className="doc-item">
                <strong>{doc.title}</strong> from <em>{doc.studentId.name}</em>
                <br />
                <a
                  href={`http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TDocumentation;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';
import Sidebar from './SSidebar';
import Chatbot from '../Chatbot';  // Import Chatbot
import '../../css/StudentCss/StudentDashboardLayout.css';

function StudentDashboard() {
    const [loggedInUser, setLoggedInUser] = useState(null);
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

    return (
        <div className="student-dashboard-container">
            <Sidebar onLogout={handleLogout} />
            <div className="content-area">
                <h1>Welcome, {loggedInUser?.name}</h1>
                <h2>Student Dashboard</h2>
            </div>
            <Chatbot />  {/* Add Chatbot here */}
            <ToastContainer />
        </div>
    );
}

export default StudentDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';
import Sidebar from './SSidebar';
import Chatbot from '../Chatbot';
import CreateTeam from './CreateTeam';
import TeamList from './TeamList';
// Removed CSS imports as we're using inline styles

function StudentDashboard() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // Dark theme styles with purple and blue gradients
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
    tabContent: {
      backgroundColor: '#121212',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      flex: '1',
      fontFamily: 'sans-serif'
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
      marginBottom: '20px',
      fontFamily: 'sans-serif'
    },
    semesterInfo: {
      color: '#9e9e9e',
      fontSize: '1.1rem',
      marginBottom: '20px',
      fontFamily: 'sans-serif'
    },
    semesterStrong: {
      color: '#b39ddb',
      fontFamily: 'sans-serif'
    },
    tabsContainer: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
      marginBottom: '25px',
      fontFamily: 'sans-serif'
    },
    tabButton: {
      backgroundColor: '#2d2d2d',
      color: '#e0e0e0',
      border: 'none',
      borderRadius: '5px',
      padding: '12px 20px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      fontFamily: 'sans-serif'
    },
    activeTabButton: {
      background: 'linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(142, 45, 226, 0.3)'
    },
    resourceContainer: {
      marginTop: '30px',
      padding: '25px',
      backgroundColor: '#1e1e1e',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      fontFamily: 'sans-serif'
    },
    resourceTitle: {
      color: '#b39ddb',
      fontSize: '1.6rem',
      marginBottom: '30px',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    },
    resourceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '25px',
      justifyContent: 'center'
    },
    resourceLink: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#e0e0e0',
      padding: '20px 15px',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      backgroundColor: '#2d2d2d',
      border: '1px solid #333',
      fontFamily: 'sans-serif'
    },
    resourceLinkHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 15px rgba(142, 45, 226, 0.2)',
      backgroundColor: '#363636'
    },
    resourceIcon: {
      width: '70px',
      height: '70px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    resourceImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    },
    resourceName: {
      fontSize: '1.1rem',
      textAlign: 'center',
      marginTop: '8px',
      fontFamily: 'sans-serif',
      fontWeight: '500'
    }
  };

  const renderTabs = () => (
    <div style={styles.tabsContainer}>
      <button
        style={{
          ...styles.tabButton,
          ...(activeTab === 'dashboard' ? styles.activeTabButton : {})
        }}
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </button>
      <button
        style={{
          ...styles.tabButton,
          ...(activeTab === 'create-team' ? styles.activeTabButton : {})
        }}
        onClick={() => setActiveTab('create-team')}
      >
        Create Team
      </button>
      <button
        style={{
          ...styles.tabButton,
          ...(activeTab === 'my-teams' ? styles.activeTabButton : {})
        }}
        onClick={() => setActiveTab('my-teams')}
      >
        My Teams
      </button>
    </div>
  );

  const renderResourceLinks = () => {
    const resources = [
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
        fallbackIcon: '/api/placeholder/70/70' // Increased placeholder size
      },
      {
        name: 'Udemy',
        url: 'https://udemy.com',
        icon: 'https://s.udemycdn.com/meta/default-meta-image-v2.png',
        fallbackIcon: '/api/placeholder/70/70'
      },
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com',
        icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
        fallbackIcon: '/api/placeholder/70/70'
      },
      {
        name: 'GeeksforGeeks',
        url: 'https://geeksforgeeks.org',
        icon: 'https://media.geeksforgeeks.org/gfg-gg-logo.svg',
        fallbackIcon: '/api/placeholder/70/70'
      },
      {
        name: 'LeetCode',
        url: 'https://leetcode.com',
        icon: 'https://leetcode.com/static/images/LeetCode_logo_rvs.png',
        fallbackIcon: '/api/placeholder/70/70'
      },
      {
        name: 'Codeforces',
        url: 'https://codeforces.com',
        icon: 'https://codeforces.org/s/0/favicon-32x32.png',
        fallbackIcon: '/api/placeholder/70/70'
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
        icon: 'https://github.githubassets.com/favicons/favicon.svg',
        fallbackIcon: '/api/placeholder/70/70'
      }
    ];

    // Function to handle image loading errors
    const handleImageError = (e) => {
      // If the image fails to load, use the fallback
      const fallbackSrc = e.target.getAttribute('data-fallback');
      if (fallbackSrc && e.target.src !== fallbackSrc) {
        e.target.src = fallbackSrc;
      }
    };

    return (
      <div style={styles.resourceContainer}>
        <h3 style={styles.resourceTitle}>Learning & Development Resources</h3>
        <div style={styles.resourceGrid}>
          {resources.map((resource, index) => (
            <a 
              key={index} 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.resourceLink}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(142, 45, 226, 0.3)';
                e.currentTarget.style.backgroundColor = '#363636';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = '#2d2d2d';
              }}
            >
              <div style={styles.resourceIcon}>
                <img 
                  src={resource.icon} 
                  alt={`${resource.name} icon`}
                  style={styles.resourceImage}
                  onError={handleImageError}
                  data-fallback={resource.fallbackIcon}
                />
              </div>
              <span style={styles.resourceName}>{resource.name}</span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
            <h2 style={styles.subtitle}>Student Dashboard</h2>
            {loggedInUser?.semester && (
              <p style={styles.semesterInfo}>
                <strong style={styles.semesterStrong}>Semester:</strong> {loggedInUser.semester}
              </p>
            )}
            {renderTabs()}
            {renderResourceLinks()}
          </>
        );
      case 'create-team':
        return (
          <>
            <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
            {renderTabs()}
            <CreateTeam />
          </>
        );
      case 'my-teams':
        return (
          <>
            <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
            {renderTabs()}
            <TeamList />
          </>
        );
      default:
        return <div>Select an option from the tabs</div>;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.contentArea}>
        <div style={styles.tabContent}>{renderContent()}</div>
      </div>
      <Chatbot />
      <ToastContainer />
    </div>
  );
}

export default StudentDashboard;
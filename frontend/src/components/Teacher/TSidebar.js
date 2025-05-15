import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Bell,
  FileText,
  User,
  LogOut
} from 'lucide-react';

export default function TeacherSidebar({ onLogout }) {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  
  const handleSetActive = (path) => {
    setActiveLink(path);
  };
  
  const navItems = [
    { 
      path: '/teacher/dashboard', 
      text: 'Dashboard', 
      icon: <LayoutDashboard size={20} />
    },
    { 
      path: '/teacher/project-status', 
      text: 'Assign Tasks', 
      icon: <ClipboardList size={20} />
    },
    { 
      path: '/teacher/updates', 
      text: 'Updates', 
      icon: <Bell size={20} />
    },
    { 
      path: '/teacher/documentation', 
      text: 'Documentation', 
      icon: <FileText size={20} />
    },
    { 
      path: '/teacher/profile', 
      text: 'Profile', 
      icon: <User size={20} />
    }
  ];

  return (
       <>
      {/* Inject global style reset */}
      <style>{`* { padding: 0; margin: 0; box-sizing: border-box; }`}</style>
    <div style={{
      backgroundColor: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(12px)',
      color: 'white',
      padding: '25px 20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '280px',
      boxShadow: '5px 0 20px rgba(0, 0, 0, 0.2)',
      borderRight: '1px solid rgba(123, 97, 255, 0.1)',
      position: 'sticky',
      top: 0,
      left: 0
    }}>
      <h2 style={{ 
        fontSize: '2rem',
        fontWeight: '800',
        margin: '10px 0 35px 0',
        background: 'linear-gradient(to right, #4a6cf7, #8364e8, #b54ef8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        textAlign: 'left',
        letterSpacing: '1px',
        textShadow: '0 0 30px rgba(123, 97, 255, 0.3)'
      }}>
        Planova
      </h2>
      
      <div style={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(138, 126, 242, 0.5), transparent)',
        margin: '0 0 25px 0'
      }}></div>
      
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          onClick={() => handleSetActive(item.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: activeLink === item.path ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '12px',
            fontWeight: activeLink === item.path ? '600' : '400',
            fontSize: '1rem',
            position: 'relative',
            transition: 'all 0.3s ease',
            background: activeLink === item.path 
              ? 'linear-gradient(90deg, rgba(123, 97, 255, 0.2) 0%, rgba(123, 97, 255, 0) 100%)' 
              : 'transparent',
            boxShadow: activeLink === item.path ? '0 0 20px rgba(123, 97, 255, 0.1)' : 'none'
          }}
          onMouseOver={(e) => {
            if (activeLink !== item.path) {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'linear-gradient(90deg, rgba(123, 97, 255, 0.1) 0%, rgba(123, 97, 255, 0) 100%)';
            }
          }}
          onMouseOut={(e) => {
            if (activeLink !== item.path) {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {activeLink === item.path && 
            <div style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '4px',
              height: '70%',
              background: 'linear-gradient(to bottom, #4a6cf7, #8364e8)',
              borderRadius: '0 4px 4px 0'
            }}></div>
          }
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeLink === item.path 
              ? (item.path === '/teacher/dashboard' ? '#4a6cf7' : 
                 item.path === '/teacher/project-status' ? '#8364e8' : 
                 item.path === '/teacher/updates' ? '#b54ef8' : 
                 item.path === '/teacher/documentation' ? '#6e98ff' : '#b395ff')
              : 'rgba(255, 255, 255, 0.7)'
          }}>
            {item.icon}
          </div>
          <span>{item.text}</span>
        </Link>
      ))}
      
      <div style={{ flexGrow: 1 }}></div>
      
      <div style={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(138, 126, 242, 0.5), transparent)',
        margin: '15px 0'
      }}></div>
      
      <button 
        onClick={onLogout} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          color: 'rgba(255, 255, 255, 0.7)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '12px 16px',
          fontSize: '1rem',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          width: '100%',
          textAlign: 'left'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 97, 97, 0.1) 0%, rgba(255, 97, 97, 0) 100%)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <LogOut size={20} style={{ color: '#ff6161' }} />
        <span>Logout</span>
      </button>
    </div>
        </>
  );
}
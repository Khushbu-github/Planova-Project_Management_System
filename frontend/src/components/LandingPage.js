import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/login');
  };
  
  // This style ensures the app takes over the entire screen
  // by injecting global styles first
  React.useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    // Add CSS rules to remove margin and padding from html and body
    style.innerHTML = `
      html, body, #root {
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        background: #000000 !important;
      }
    `;
    // Append style to document head
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div style={{
      background: '#000000',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontFamily: '"Poppins", sans-serif'
    }}>
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at top right, rgba(119, 61, 189, 0.15) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(65, 105, 225, 0.1) 0%, transparent 50%)',
        zIndex: 1
      }}></div>
      
      {/* Content container - full page with no padding */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          maxWidth: '100%',
          width: '100%',
          height: '100%',
          padding: '60px 40px',
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px'
        }}>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: '800',
            margin: '0',
            background: 'linear-gradient(to right, #4a6cf7, #8364e8, #b54ef8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            textAlign: 'center',
            letterSpacing: '1px',
            textShadow: '0 0 30px rgba(123, 97, 255, 0.5)'
          }}>
            Welcome to Planova
          </h1>
          
          <div style={{
            width: '80%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(138, 126, 242, 0.5), transparent)',
            margin: '0'
          }}></div>
          
          <div style={{
            width: '100%',
            padding: '26px 0 40px',
            maxWidth: '80%'
          }}>
            <p style={{
              fontSize: '1.5rem',
              lineHeight: '1.8',
              textAlign: 'center',
              margin: '0 auto',
              background: 'linear-gradient(to right, #6e98ff, #b395ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}>
              Planova is your smart academic planner that empowers teachers and students to coordinate, plan, and manage tasks efficiently. Experience seamless scheduling, intuitive interfaces, and a collaborative platform designed for modern education.
            </p>
          </div>
          
          <div style={{
            width: '80%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(138, 126, 242, 0.5), transparent)',
            margin: '0'
          }}></div>
          
          <button 
            onClick={handleGetStarted}
            style={{
              padding: '20px 60px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4a6cf7 0%, #8364e8 50%, #b54ef8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 25px rgba(123, 97, 255, 0.6)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(123, 97, 255, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(123, 97, 255, 0.6)';
            }}
          >
            Get Started
          </button>
          
          <div style={{
            marginTop: '50px',
            display: 'flex',
            justifyContent: 'space-around',
            width: '80%'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px',
                background: 'linear-gradient(to right, #4a6cf7, #6e98ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent'
              }}>✓</div>
              <p style={{
                margin: '0',
                background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontSize: '1.2rem',
                fontWeight: '500'
              }}>Easy Planning</p>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px',
                background: 'linear-gradient(to right, #8364e8, #b395ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent'
              }}>⟳</div>
              <p style={{
                margin: '0',
                background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontSize: '1.2rem',
                fontWeight: '500'
              }}>Sync Everywhere</p>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px',
                background: 'linear-gradient(to right, #b54ef8, #b395ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent'
              }}>⚡</div>
              <p style={{
                margin: '0',
                background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontSize: '1.2rem',
                fontWeight: '500'
              }}>Fast & Intuitive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;


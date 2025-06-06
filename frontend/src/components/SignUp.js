import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student', // default role
        semester: 1 // set as number by default
    });
    
    const navigate = useNavigate();
    
    // This style ensures the app takes over the entire screen
    // by injecting global styles first
    useEffect(() => {
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
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Convert semester to number if it's the semester field
        if (name === 'semester') {
            setSignupInfo(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setSignupInfo(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role, semester } = signupInfo;
        
        if (!name || !email || !password || !role) {
            return handleError('All fields are required');
        }
        
        if (role === 'student' && semester === null) {
            return handleError('Please select your semester');
        }
        
        try {
            // Ensure semester is sent as a number for student role
            const payload = {
                name,
                email,
                password,
                role
            };
            
            // Only include semester for students and ensure it's a number
            if (role === 'student') {
                payload.semester = Number(semester);
            }
            
            console.log('Sending payload:', payload);
            
            const response = await fetch(`http://localhost:5000/api/auth/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            console.log('Response data:', result);
            
            const { success, message, error } = result;
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/login'), 1000);
            } else if (error) {
                handleError(error?.details[0]?.message || message);
            } else {
                handleError(message);
            }
        } catch (err) {
            console.error('Error during signup:', err);
            handleError(err.message);
        }
    };
    
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
            
            {/* Content container */}
            <div style={{
                width: '100%',
                maxWidth: '550px',
                padding: '40px',
                background: 'rgba(10, 10, 15, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                boxShadow: '0 0 40px rgba(123, 97, 255, 0.3)',
                position: 'relative',
                zIndex: 2,
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    margin: '0 0 5px 0',
                    background: 'linear-gradient(to right, #4a6cf7, #8364e8, #b54ef8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    textAlign: 'center',
                    letterSpacing: '1px',
                    textShadow: '0 0 30px rgba(123, 97, 255, 0.3)'
                }}>
                    Join Planova
                </h1>
                
                <div style={{
                    width: '100%',
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, rgba(138, 126, 242, 0.5), transparent)',
                    margin: '0 0 30px 0'
                }}></div>
                
                <form onSubmit={handleSignup} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <label style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textFillColor: 'transparent'
                        }}>Name</label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='name'
                            placeholder='Enter your name...'
                            value={signupInfo.name}
                            style={{
                                padding: '16px 20px',
                                fontSize: '1rem',
                                background: 'rgba(30, 30, 40, 0.8)',
                                border: '1px solid rgba(123, 97, 255, 0.3)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.8)';
                                e.target.style.boxShadow = '0 0 10px rgba(123, 97, 255, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <label style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textFillColor: 'transparent'
                        }}>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={signupInfo.email}
                            style={{
                                padding: '16px 20px',
                                fontSize: '1rem',
                                background: 'rgba(30, 30, 40, 0.8)',
                                border: '1px solid rgba(123, 97, 255, 0.3)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.8)';
                                e.target.style.boxShadow = '0 0 10px rgba(123, 97, 255, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <label style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textFillColor: 'transparent'
                        }}>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={signupInfo.password}
                            style={{
                                padding: '16px 20px',
                                fontSize: '1rem',
                                background: 'rgba(30, 30, 40, 0.8)',
                                border: '1px solid rgba(123, 97, 255, 0.3)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.8)';
                                e.target.style.boxShadow = '0 0 10px rgba(123, 97, 255, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <label style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textFillColor: 'transparent'
                        }}>Role</label>
                        <select 
                            name='role' 
                            onChange={handleChange} 
                            value={signupInfo.role}
                            style={{
                                padding: '16px 20px',
                                fontSize: '1rem',
                                background: 'rgba(30, 30, 40, 0.8)',
                                border: '1px solid rgba(123, 97, 255, 0.3)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%237B61FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 20px center',
                                backgroundSize: '16px'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.8)';
                                e.target.style.boxShadow = '0 0 10px rgba(123, 97, 255, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(123, 97, 255, 0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <option value='student'>Student</option>
                            <option value='teacher'>Teacher</option>
                        </select>
                    </div>
                    
                    {signupInfo.role === 'student' && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <label style={{
                                fontSize: '1rem',
                                fontWeight: '500',
                                background: 'linear-gradient(to right, #6e98ff, #b395ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textFillColor: 'transparent'
                            }}>Semester</label>
                            <select 
                                name='semester' 
                                onChange={handleChange} 
                                value={signupInfo.semester}
                                style={{
                                    padding: '16px 20px',
                                    fontSize: '1rem',
                                    background: 'rgba(30, 30, 40, 0.8)',
                                    border: '1px solid rgba(123, 97, 255, 0.3)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%237B61FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 20px center',
                                    backgroundSize: '16px'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(123, 97, 255, 0.8)';
                                    e.target.style.boxShadow = '0 0 10px rgba(123, 97, 255, 0.3)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(123, 97, 255, 0.3)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>{sem}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    <button 
                        type='submit'
                        style={{
                            padding: '18px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #4a6cf7 0%, #8364e8 50%, #b54ef8 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 0 20px rgba(123, 97, 255, 0.4)',
                            marginTop: '10px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(123, 97, 255, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(123, 97, 255, 0.4)';
                        }}
                    >
                        Sign Up
                    </button>
                    
                    <div style={{
                        width: '100%',
                        height: '1px',
                        background: 'linear-gradient(to right, transparent, rgba(138, 126, 242, 0.5), transparent)',
                        margin: '10px 0'
                    }}></div>
                    
                    <div style={{
                        textAlign: 'center',
                        fontSize: '1rem',
                        fontWeight: '400',
                        color: '#e0e0ff'
                    }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                color: '#b395ff',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.color = '#4a6cf7';
                                e.target.style.textShadow = '0 0 8px rgba(123, 97, 255, 0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.color = '#b395ff';
                                e.target.style.textShadow = 'none';
                            }}
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;
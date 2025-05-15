import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Sidebar from './SSidebar';
import 'react-toastify/dist/ReactToastify.css';

const SDiscussions = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messageContainerRef = useRef(null);
  const navigate = useNavigate();

  // Initialize socket connection
  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      const user = JSON.parse(userData);
      setLoggedInUser(user);
      
      // Create socket connection
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);
      
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !loggedInUser) return;
    
    // Join room with user's ID
    socket.emit('join', loggedInUser.id);
    
    // Listen for incoming messages
    socket.on('getMessage', (data) => {
      const { senderId, text, createdAt } = data;
      
      // Only add message if it's from the currently selected user
      if (selectedUser && senderId === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            _id: Date.now(), // temporary ID
            senderId,
            receiverId: loggedInUser.id,
            text,
            createdAt,
          },
        ]);
      }
    });
    
    // Listen for online users
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });
    
    // Listen for typing indicator
    socket.on('userTyping', (data) => {
      if (selectedUser && data.senderId === selectedUser._id) {
        setIsTyping(data.isTyping);
      }
    });
    
    return () => {
      socket.off('getMessage');
      socket.off('onlineUsers');
      socket.off('userTyping');
    };
  }, [socket, loggedInUser, selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, [loggedInUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      setIsTyping(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/messages/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/messages/${selectedUser._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!socket || !selectedUser) return;
    
    // Clear existing timeout
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Emit typing status
    socket.emit('typing', {
      senderId: loggedInUser.id,
      receiverId: selectedUser._id,
      isTyping: true
    });
    
    // Set timeout to stop typing indicator after 2 seconds
    const timeout = setTimeout(() => {
      socket.emit('typing', {
        senderId: loggedInUser.id,
        receiverId: selectedUser._id,
        isTyping: false
      });
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Stop typing indicator
      if (typingTimeout) clearTimeout(typingTimeout);
      socket.emit('typing', {
        senderId: loggedInUser.id,
        receiverId: selectedUser._id,
        isTyping: false
      });

      // Emit socket event
      socket.emit('sendMessage', {
        senderId: loggedInUser.id,
        receiverId: selectedUser._id,
        text: newMessage
      });

      // Send message via API
      const response = await fetch(`http://localhost:5000/api/messages/send/${selectedUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newMessage })
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        // Add the new message to our messages array
        setMessages(prev => [...prev, data.message]);
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  // Enhanced styles matching the dark theme with purple and blue gradients
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
    title: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.5rem',
      marginBottom: '10px',
      fontWeight: 'bold'
    },
    subtitle: {
      color: '#e0e0e0',
      fontSize: '1.8rem',
      marginBottom: '25px'
    },
    chatContainer: {
      display: 'flex',
      flex: '1',
      backgroundColor: '#121212',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
      height: 'calc(100vh - 200px)',
    },
    userList: {
      width: '280px',
      borderRight: '1px solid #222',
      overflowY: 'auto',
      backgroundColor: '#151515',
      padding: '15px 0'
    },
    userListTitle: {
      padding: '0 20px 15px',
      color: '#b0b0b0',
      borderBottom: '1px solid #222',
      fontSize: '1.2rem',
      marginBottom: '10px'
    },
    userListContent: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    userItem: (isSelected) => ({
      padding: '12px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'background-color 0.3s ease',
      backgroundColor: isSelected ? '#1e1e2d' : 'transparent',
      borderLeft: isSelected ? '3px solid #b721ff' : '3px solid transparent',
      ':hover': {
        backgroundColor: '#1a1a2a'
      }
    }),
    userName: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    onlineIndicator: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#4CAF50',
      display: 'inline-block'
    },
    chatArea: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    chatHeader: {
      padding: '20px',
      borderBottom: '1px solid #222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    chatHeaderTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#fff'
    },
    userStatus: {
      fontSize: '0.9rem',
      color: '#4CAF50',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    messageContainer: {
      flex: '1',
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    messageBubble: (isSent) => ({
      maxWidth: '70%',
      alignSelf: isSent ? 'flex-end' : 'flex-start',
      backgroundColor: isSent 
        ? 'linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)' 
        : '#2d2d3d',
      background: isSent 
        ? 'linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)' 
        : '#2d2d3d',
      padding: '12px 15px',
      borderRadius: isSent 
        ? '15px 15px 0 15px' 
        : '15px 15px 15px 0',
      position: 'relative',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      wordBreak: 'break-word'
    }),
    messageText: {
      color: '#fff',
      fontSize: '0.95rem',
      lineHeight: '1.4'
    },
    messageTime: {
      fontSize: '0.7rem',
      color: 'rgba(255,255,255,0.7)',
      marginTop: '5px',
      textAlign: 'right'
    },
    typingIndicator: {
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    typingDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#b0b0b0',
      display: 'inline-block',
      animation: 'typingAnimation 1s infinite ease-in-out',
      animationDelay: index => `${index * 0.3}s`
    },
    messageInputForm: {
      padding: '15px',
      borderTop: '1px solid #222',
      display: 'flex',
      gap: '10px'
    },
    messageInput: {
      flex: '1',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '12px 15px',
      color: '#fff',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    sendButton: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      border: 'none',
      borderRadius: '8px',
      padding: '0 20px',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    selectUserPrompt: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#686868',
      fontSize: '1.2rem',
      fontStyle: 'italic'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#686868'
    },
    noMessages: {
      textAlign: 'center',
      color: '#686868',
      padding: '20px',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.contentArea}>
        <h1 style={styles.title}>Welcome, {loggedInUser?.name}</h1>
        <h2 style={styles.subtitle}>Discussions</h2>
        
        <div style={styles.chatContainer}>
          <div style={styles.userList}>
            <h3 style={styles.userListTitle}>Users</h3>
            {users.length > 0 ? (
              <ul style={styles.userListContent}>
                {users.map(user => (
                  <li 
                    key={user._id} 
                    style={{
                      ...styles.userItem(selectedUser?._id === user._id),
                      backgroundColor: selectedUser?._id === user._id ? '#1e1e2d' : 'transparent',
                      borderLeft: selectedUser?._id === user._id ? '3px solid #b721ff' : '3px solid transparent',
                    }}
                    onClick={() => setSelectedUser(user)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = selectedUser?._id === user._id ? '#1e1e2d' : '#1a1a2a';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = selectedUser?._id === user._id ? '#1e1e2d' : 'transparent';
                    }}
                  >
                    <div style={styles.userName}>
                      {user.name}
                    </div>
                    {onlineUsers.includes(user._id) && <span style={styles.onlineIndicator}></span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{padding: '0 20px', color: '#686868'}}>No users available</p>
            )}
          </div>
          
          <div style={styles.chatArea}>
            {selectedUser ? (
              <>
                <div style={styles.chatHeader}>
                  <h3 style={styles.chatHeaderTitle}>{selectedUser.name}</h3>
                  {onlineUsers.includes(selectedUser._id) && (
                    <div style={styles.userStatus}>
                      <span style={styles.onlineIndicator}></span>
                      Online
                    </div>
                  )}
                </div>
                
                <div style={styles.messageContainer} ref={messageContainerRef}>
                  {loading ? (
                    <div style={styles.loadingContainer}>Loading messages...</div>
                  ) : messages.length > 0 ? (
                    messages.map(msg => (
                      <div 
                        key={msg._id} 
                        style={{
                          ...styles.messageBubble(msg.senderId === loggedInUser?.id),
                          background: msg.senderId === loggedInUser?.id 
                            ? 'linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)' 
                            : '#2d2d3d',
                        }}
                      >
                        <div style={styles.messageText}>{msg.text}</div>
                        <div style={styles.messageTime}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={styles.noMessages}>No messages yet. Start a conversation!</div>
                  )}
                  
                  {isTyping && (
                    <div style={styles.typingIndicator}>
                      <span style={{...styles.typingDot, animationDelay: '0s'}}></span>
                      <span style={{...styles.typingDot, animationDelay: '0.3s'}}></span>
                      <span style={{...styles.typingDot, animationDelay: '0.6s'}}></span>
                    </div>
                  )}
                </div>
                
                <form style={styles.messageInputForm} onSubmit={sendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    style={styles.messageInput}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#b721ff';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#333';
                    }}
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    style={{
                      ...styles.sendButton,
                      opacity: !newMessage.trim() ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                      if(newMessage.trim()) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(142, 45, 226, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div style={styles.selectUserPrompt}>
                <p>Select a user to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Add keyframe animation for typing indicator */}
      <style>
        {`
          @keyframes typingAnimation {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
};

export default SDiscussions;
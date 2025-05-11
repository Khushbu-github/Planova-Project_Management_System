import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../../utils';
import { io } from 'socket.io-client';
import Sidebar from './SSidebar';
import '../../css/StudentCss/StudentDashboardLayout.css';
import '../../css/StudentCss/sDiscussions.css';

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
        handleError(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      handleError('Error fetching users');
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
        handleError(data.message || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      handleError('Error fetching messages');
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
        handleError(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      handleError('Error sending message');
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Loggedout');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="student-dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <div className="content-area">
        <h1>Welcome, {loggedInUser?.name}</h1>
        <h2>Discussions</h2>
        
        <div className="chat-container">
          <div className="user-list">
            <h3>Users</h3>
            {users.length > 0 ? (
              <ul>
                {users.map(user => (
                  <li 
                    key={user._id} 
                    className={selectedUser?._id === user._id ? 'selected' : ''}
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.name}
                    {onlineUsers.includes(user._id) && <span className="online-indicator"></span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users available</p>
            )}
          </div>
          
          <div className="chat-area">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <h3>Chat with {selectedUser.name}</h3>
                  {onlineUsers.includes(selectedUser._id) && <span className="user-status">Online</span>}
                </div>
                
                <div className="message-container" ref={messageContainerRef}>
                  {loading ? (
                    <div className="loading">Loading messages...</div>
                  ) : messages.length > 0 ? (
                    messages.map(msg => (
                      <div 
                        key={msg._id} 
                        className={`message ${msg.senderId === loggedInUser?.id ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">{msg.text}</div>
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">No messages yet. Start a conversation!</div>
                  )}
                  
                  {isTyping && (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
                
                <form className="message-input-form" onSubmit={sendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                  />
                  <button type="submit" disabled={!newMessage.trim()}>Send</button>
                </form>
              </>
            ) : (
              <div className="select-user-prompt">
                <p>Select a user to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SDiscussions;

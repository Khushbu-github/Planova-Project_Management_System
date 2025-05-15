import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Define all styles as objects with dark theme
  const styles = {
    chatbotContainer: {
      fontFamily: 'sans-serif',
    },
    chatToggleButton: {
      position: 'fixed',
      bottom: '25px',
      right: '25px',
      width: '60px',
      height: '60px',
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      color: 'white',
      fontSize: '24px',
      border: 'none',
      borderRadius: '50%',
      boxShadow: '0 6px 16px rgba(183, 33, 255, 0.4)',
      cursor: 'pointer',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      animation: open ? 'none' : 'jump 0.8s ease-in-out infinite alternate',
    },
    chatToggleButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(183, 33, 255, 0.5)',
    },
    chatbot: {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      width: '400px',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      background: '#101010',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      overflow: 'hidden',
      animation: 'expandIn 0.4s ease forwards',
      transition: 'all 0.3s ease',
      border: '1px solid #333',
    },
    chatHeader: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      color: 'white',
      padding: '15px 20px',
      fontWeight: 600,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    },
    chatHeaderTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '16px',
    },
    chatAvatar: {
      fontSize: '20px',
    },
    minimizeButton: {
      background: 'none',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '20px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
    },
    minimizeButtonHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
    },
    chatMessages: {
      padding: '20px',
      overflowY: 'auto',
      flex: 1,
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    message: {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '18px',
      position: 'relative',
      wordWrap: 'break-word',
      lineHeight: 1.4,
      fontSize: '14px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    },
    userMessage: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      color: 'white',
      alignSelf: 'flex-end',
      borderBottomRightRadius: '4px',
    },
    botMessage: {
      background: '#1a1a1a',
      color: '#e0e0e0',
      alignSelf: 'flex-start',
      borderBottomLeftRadius: '4px',
      borderLeft: '3px solid #b721ff',
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      columnGap: '4px',
    },
    typingDot: {
      height: '8px',
      width: '8px',
      backgroundColor: '#b721ff',
      borderRadius: '50%',
      display: 'inline-block',
      opacity: 0.8,
    },
    typingDot1: {
      animation: 'typing 1s infinite ease-in-out',
      animationDelay: '0ms',
    },
    typingDot2: {
      animation: 'typing 1s infinite ease-in-out',
      animationDelay: '200ms',
    },
    typingDot3: {
      animation: 'typing 1s infinite ease-in-out',
      animationDelay: '400ms',
    },
    chatInput: {
      display: 'flex',
      padding: '12px',
      background: '#101010',
      borderTop: '1px solid #333',
    },
    textInput: {
      flex: 1,
      padding: '15px',
      border: '1px solid #333',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border 0.3s ease',
      fontSize: '14px',
      backgroundColor: '#121212',
      color: '#fff',
    },
    textInputFocus: {
      borderColor: '#b721ff',
    },
    sendButton: {
      background: 'linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)',
      color: 'white',
      border: 'none',
      width: '45px',
      height: '45px',
      borderRadius: '8px',
      marginLeft: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
    },
    sendButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 18px rgba(142, 45, 226, 0.3)',
    },
    sendButtonDisabled: {
      background: '#333',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
    svgIcon: {
      width: '20px',
      height: '20px',
    },
  };

  // Add keyframe animations via a style tag in useEffect
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes jump {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
      }
      
      @keyframes expandIn {
        from {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          width: 350px;
          height: 500px;
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
          width: 400px;
          height: 600px;
        }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes typing {
        0% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0); }
      }
      
      /* Custom scrollbar for webkit browsers */
      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }
      
      .chat-messages::-webkit-scrollbar-track {
        background: #121212;
      }
      
      .chat-messages::-webkit-scrollbar-thumb {
        background-color: rgba(183, 33, 255, 0.4);
        border-radius: 3px;
      }
      
      .chat-messages::-webkit-scrollbar-thumb:hover {
        background-color: rgba(183, 33, 255, 0.6);
      }
    `;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Generate a random user ID if none exists
      const newUserId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
    
    // Add welcome message when first opened
    if (open && messages.length === 0) {
      setMessages([
        { 
          sender: 'bot', 
          text: 'Hello! 👋 I\'m your Virtual Teacher. How can I help you today?' 
        }
      ]);
    }
  }, [open, messages.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => setOpen(prev => !prev);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Log the payload for debugging
      const payload = { message: input.trim(), userId };
      console.log('Sending payload:', payload);
      
      const res = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API error:', res.status, errorData);
        throw new Error(`API returned ${res.status}: ${JSON.stringify(errorData)}`);
      }
      
      const data = await res.json();
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply || 'Sorry, I could not process your request.' }]);
    } catch (err) {
      console.error('Error in chat request:', err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: `Sorry, something went wrong. Please try again. Error: ${err.message}` 
        }
      ]);
    }
  };

  // State for hover effects
  const [btnHover, setBtnHover] = useState(false);
  const [minBtnHover, setMinBtnHover] = useState(false);
  const [sendBtnHover, setSendBtnHover] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div style={styles.chatbotContainer} className="chatbot-container">
      <button 
        style={{
          ...styles.chatToggleButton,
          ...(btnHover ? styles.chatToggleButtonHover : {})
        }}
        onClick={toggleChat}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        aria-label="Toggle chat"
      >
        {open ? '✕' : '💬'}
      </button>
      
      {open && (
        <div style={styles.chatbot} className="chatbot">
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderTitle}>
              <span style={styles.chatAvatar}>👩‍🏫</span>
              <span>Virtual Teacher</span>
            </div>
            <button 
              style={{
                ...styles.minimizeButton,
                ...(minBtnHover ? styles.minimizeButtonHover : {})
              }}
              onClick={toggleChat}
              onMouseEnter={() => setMinBtnHover(true)}
              onMouseLeave={() => setMinBtnHover(false)}
              aria-label="Minimize chat"
            >
              —
            </button>
          </div>
          
          <div style={styles.chatMessages} className="chat-messages">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  ...styles.message,
                  ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage)
                }}
              >
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div style={{...styles.message, ...styles.botMessage, ...{background: '#1a1a1a'}}}>
                <div style={styles.typingIndicator}>
                  <span style={{...styles.typingDot, ...styles.typingDot1}}></span>
                  <span style={{...styles.typingDot, ...styles.typingDot2}}></span>
                  <span style={{...styles.typingDot, ...styles.typingDot3}}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div style={styles.chatInput}>
            <input
              style={{
                ...styles.textInput,
                ...(inputFocused ? styles.textInputFocus : {})
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Ask a question..."
              aria-label="Chat input"
            />
            <button 
              style={{
                ...styles.sendButton,
                ...(sendBtnHover && input.trim() ? styles.sendButtonHover : {}),
                ...(!input.trim() ? styles.sendButtonDisabled : {})
              }}
              onClick={handleSendMessage}
              disabled={!input.trim()}
              onMouseEnter={() => setSendBtnHover(true)}
              onMouseLeave={() => setSendBtnHover(false)}
              aria-label="Send message"
            >
              <svg 
                style={styles.svgIcon}
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
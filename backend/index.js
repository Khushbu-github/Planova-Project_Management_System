let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let http = require('http');
const { Server } = require('socket.io');

const AuthRouter = require('./Routes/AuthRouter.js');
const studentRoutes = require('./Routes/StudentRoutes.js');
const teacherRoutes = require('./Routes/TeacherRoutes.js');
const projectRoutes = require('./Routes/ProjectRoutes');


require('dotenv').config();
require('./Models/db.js');

// Middleware
app.use(cookieParser()); // Parses cookies

// ✅ CORS Middleware – only ONCE with proper config
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

app.use('/api/projects', projectRoutes);


// Server setup
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

// Map to store online users
let onlineUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a room (based on user ID)
  socket.on('join', (userId) => {
    // Add user to online users map
    onlineUsers.set(userId, socket.id);
    
    // Join personal room
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
    
    // Broadcast the list of online users to all connected clients
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });

  // Handle sending a message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    io.to(receiverId).emit('getMessage', {
      senderId,
      text,
      createdAt: new Date()
    });
  });

  // Handle user typing status
  socket.on('typing', ({ senderId, receiverId, isTyping }) => {
    io.to(receiverId).emit('userTyping', {
      senderId,
      isTyping
    });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove the user from the online users map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    
    // Broadcast the updated list of online users
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
});

// Update the server to use the http server instead of app directly
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
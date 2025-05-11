let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter.js');
const studentRoutes = require('./Routes/StudentRoutes.js');
const teacherRoutes = require('./Routes/TeacherRoutes.js');
const messageRoutes = require('./Routes/messageRoutes.js');
const taskRoutes = require('./Routes/TaskRoutes');
const updateRoutes = require('./Routes/UpdateRoutes.js');
const documentRoutes = require('./Routes/DocumentRoutes.js');
const ProfileRoutes = require('./Routes/ProfileRoutes.js');
const chatbotRoutes = require('./Routes/chatbot');

const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');


require('dotenv').config();
require('./Models/db.js');

app.use(cookieParser()); // this will allow us to parse the cookie and extract the token from it 

app.use(cors({
  origin: "http://localhost:3000", // this is necessary because we are sending request from the frontend server to the backend server 
  credentials: true // using this the cookies and authorization headers would be sent in the request 
}))
app.use(express.json()); 
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', AuthRouter);

app.use('/api/student', studentRoutes);

app.use('/api/teacher', teacherRoutes);

app.use("/api/messages", messageRoutes)

app.use("/api/tasks", taskRoutes); 

app.use("/api/updates", updateRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/documents', documentRoutes);

app.use('/api/auth', ProfileRoutes);

app.use('/api/chatbot', chatbotRoutes);


// Create server using http
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
# 📘 Planova - Project Management System

**Planova** is a full-stack academic project management system designed to streamline collaboration between students and teachers. It offers structured dashboards, real-time communication, documentation handling, task assignments, and more — all within a role-based environment.

## 🚀 Features

### 🧑‍🎓 Student Dashboard
- **Dashboard**: View team details and project status.
- **Project Status**: Submit updates and progress logs.
- **Documentation**: Upload and manage project files.
- **Discussion**: Chat live with teammates.
- **Profile**: View and manage your profile.

### 🧑‍🏫 Teacher Dashboard
- **Dashboard**: Monitor student teams and projects.
- **Project Status**: Review student-submitted updates.
- **Documentation**: View uploaded project files.
- **Profile**: Manage account details.

## 🏗️ Tech Stack

- **Frontend**: React, Tailwind CSS, Socket.io
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)

## 🔐 Authentication & Access

- Secure login/signup for students and teachers
- Role-based access control with protected routes
- JWT-based authentication

## 📦 Installation

### Prerequisites
- Node.js
- MongoDB

### Clone the Repository
```bash
git clone https://github.com/your-username/planova.git
cd planova
```
### Set up backend

cd backend
npm install
Create a `.env` file in the backend folder with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
npm start

### Set up frontend
cd frontend
npm install
npm start


### 📌 Usage
Register and log in as either a student or a teacher.

Students can create teams, submit project updates, upload documentation, and chat in real time.

Teachers can assign tasks, monitor updates, and approve or reject fund requests.

The system ensures all interactions are role-specific and secure.



###  

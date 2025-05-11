import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

// Public Pages
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/SignUp';

// Student Full Pages
import StudentDashboard from './components/Student/StudentDashboard';
import SProjectStatus from './components/Student/SProjectStatus';
import SUpdates from './components/Student/SUpdates';
import SDocumentation from './components/Student/SDocumentation';
import SProfile from './components/Student/SProfile';
import SDiscussions from './components/Student/SDiscussions';

// Teacher Full Pages
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import TProjectStatus from './components/Teacher/TProjectStatus';
import TUpdates from './components/Teacher/TUpdates';
import TDocumentation from './components/Teacher/TDocumentation';
import TProfile from './components/Teacher/TProfile';

function App() {
  const PrivateRoute = ({ element, allowedRole }) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    return user && user.role === allowedRole
      ? element
      : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<PrivateRoute element={<StudentDashboard />} allowedRole="student" />} />
        <Route path="/student/project-status" element={<PrivateRoute element={<SProjectStatus />} allowedRole="student" />} />
        <Route path="/student/updates" element={<PrivateRoute element={<SUpdates />} allowedRole="student" />} />
        <Route path="/student/documentation" element={<PrivateRoute element={<SDocumentation />} allowedRole="student" />} />
        <Route path="/student/discussions" element={<PrivateRoute element={<SDiscussions />} allowedRole="student" />} />
        <Route path="/student/profile" element={<PrivateRoute element={<SProfile />} allowedRole="student" />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<PrivateRoute element={<TeacherDashboard />} allowedRole="teacher" />} />
        <Route path="/teacher/project-status" element={<PrivateRoute element={<TProjectStatus />} allowedRole="teacher" />} />
        <Route path="/teacher/updates" element={<PrivateRoute element={<TUpdates />} allowedRole="teacher" />} />
        <Route path="/teacher/documentation" element={<PrivateRoute element={<TDocumentation />} allowedRole="teacher" />} />
        <Route path="/teacher/profile" element={<PrivateRoute element={<TProfile />} allowedRole="teacher" />} />
      </Routes>
    </div>
  );
}

export default App;

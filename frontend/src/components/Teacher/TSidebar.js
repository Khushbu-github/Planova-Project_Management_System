import { Link } from 'react-router-dom';


export default function TeacherSidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <h3 style={{ marginBottom: '30px' }}>Planova</h3>
      <Link to="/teacher/dashboard">Dashboard</Link>
      <Link to="/teacher/project-status">Assign Tasks</Link>
      <Link to="/teacher/updates">Updates</Link>
      <Link to="/teacher/documentation">Documentation</Link>
      <Link to="/teacher/profile">Profile</Link>

      <div style={{ flexGrow: 1 }}></div>
      <button onClick={onLogout} style={{ marginTop: '40px' }}>Logout</button>
    </div>
  );
}

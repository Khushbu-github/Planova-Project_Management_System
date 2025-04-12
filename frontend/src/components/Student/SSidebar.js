
import { Link } from 'react-router-dom';


export default function Sidebar({ onLogout }) {
    return (
        <div className="sidebar">
            <h3 style={{ marginBottom: '30px' }}>Planova</h3>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/project-status">Project Status</Link>
            <Link to="/student/documentation">Documentation</Link>
            <Link to="/student/discussions">Discussion</Link>
            <Link to="/student/funds">Funds</Link>
            <Link to="/student/profile">Profile</Link>

            <div style={{ flexGrow: 1 }}></div>
            <button onClick={onLogout} style={{ marginTop: '40px' }}>
                Logout
            </button>
        </div>
    );
}


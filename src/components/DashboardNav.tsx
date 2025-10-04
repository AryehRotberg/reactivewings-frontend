import { useState } from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../services/user';
import '../styles/DashboardNav.css';

export default function DashboardNav() {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <nav className="top-nav">
            <div className="dashboard-nav-container">
                <Link to="/" className="dashboard-logo">
                    <span className="dashboard-logo-icon">✈️</span>
                    <span>reactivewings</span>
                </Link>
                <div className="menu-container">
                    <button
                        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                        <span className="hamburger"></span>
                    </button>
                    <div className={`menu-dropdown ${menuOpen ? 'show' : ''}`}>
                        <div className="menu-item" onClick={handleLogout}>
                            <span className="menu-icon">🚪</span>
                            <span className="menu-text">Log Out</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

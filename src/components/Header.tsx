import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Header.css';

interface HeaderProps {
    onSignIn: () => void;
}

export default function Header({ onSignIn }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleSignIn = () => {
        onSignIn();
        closeMenu();
    };

    return (
        <header className="header" id="header">
            <nav className="header-nav-container">
                <Link to="/" className="header-logo">
                    <span className="header-logo-icon">✈️</span>
                    <span>reactivewings</span>
                </Link>

                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li><a href="#features" className="nav-link" onClick={closeMenu}>תכונות</a></li>
                    <li><a href="#contact" className="nav-link" onClick={closeMenu}>צור קשר</a></li>
                    <li>
                        <a
                            href="https://github.com/AryehRotberg/flights"
                            className="nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                        >
                            תיעוד
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/AryehRotberg/flights/issues"
                            className="nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                        >
                            תמיכה
                        </a>
                    </li>
                    <li>
                        <button onClick={handleSignIn} className="nav-cta">
                            התחבר
                        </button>
                    </li>
                </ul>

                <div
                    className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
    );
}

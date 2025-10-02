import { Link } from 'react-router-dom';
import '../styles/Header.css';

interface HeaderProps {
    onSignIn: () => void;
}

export default function Header({ onSignIn }: HeaderProps) {
    return (
        <header className="header" id="header">
            <nav className="header-nav-container">
                <Link to="/" className="header-logo">
                    <span className="header-logo-icon">✈️</span>
                    <span>reactivewings.com</span>
                </Link>

                <ul className="nav-menu">
                    <li><a href="#features" className="nav-link">Features</a></li>
                    <li><a href="#stats" className="nav-link">System Stats</a></li>
                    <li>
                        <a
                            href="https://github.com/AryehRotberg/flights"
                            className="nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Documentation
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/AryehRotberg/flights/issues"
                            className="nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Support
                        </a>
                    </li>
                    <li>
                        <button onClick={onSignIn} className="nav-cta">
                            Sign In
                        </button>
                    </li>
                </ul>

                <div className="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
    );
}

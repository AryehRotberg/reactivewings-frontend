import '../styles/Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-column footer-brand">
                        <h3 className="footer-logo">✈️ reactivewings</h3>
                        <p className="footer-description">
                            Real-time flight tracking and monitoring system for Ben Gurion Airport.
                            Stay updated with the latest flight information and never miss a departure or arrival.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">Navigation</h4>
                        <ul className="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="/dashboard">Dashboard</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">Connect</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="mailto:contact@reactivewings.com">
                                    <span style={{ marginRight: '8px' }}>✉️</span>
                                    Email Us
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/AryehRotberg/reactivewings-frontend" target="_blank" rel="noopener noreferrer">
                                    <span style={{ marginRight: '8px' }}>💻</span>
                                    Source Code
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/AryehRotberg/reactivewings-frontend/issues" target="_blank" rel="noopener noreferrer">
                                    <span style={{ marginRight: '8px' }}>🐛</span>
                                    Report Issue
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} reactivewings. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

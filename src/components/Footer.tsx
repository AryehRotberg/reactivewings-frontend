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
                            מערכת מעקב וניטור טיסות בזמן אמת לנמל התעופה בן גוריון.
                            הישארו מעודכנים עם המידע האחרון על טיסות ואל תפספסו המראה או נחיתה.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">ניווט</h4>
                        <ul className="footer-links">
                            <li><a href="#home">ראשי</a></li>
                            <li><a href="#features">תכונות</a></li>
                            <li><a href="/dashboard">לוח בקרה</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-heading">צור קשר</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="mailto:contact@reactivewings.com">
                                    <span style={{ marginRight: '8px' }}>✉️</span>
                                    שלח מייל
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/AryehRotberg/reactivewings-frontend" target="_blank" rel="noopener noreferrer">
                                    <span style={{ marginRight: '8px' }}>💻</span>
                                    קוד מקור
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/AryehRotberg/reactivewings-frontend/issues" target="_blank" rel="noopener noreferrer">
                                    <span style={{ marginRight: '8px' }}>🐛</span>
                                    דווח על בעיה
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} reactivewings. כל הזכויות שמורות.
                    </p>
                </div>
            </div>
        </footer>
    );
}

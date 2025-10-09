import '../styles/Hero.css';

interface HeroProps {
    onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
    return (
        <main className="main-content">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span>🛫</span>
                        <span>מערכת ניטור טיסות נתב"ג</span>
                    </div>

                    <h1 className="hero-title">
                        אל תפספסו עדכוני טיסות עם
                        <span className="highlight"> התראות חכמות</span>
                    </h1>

                    <p className="hero-description">
                        מערכת ניטור טיסות לנמל התעופה הבינלאומי בן גוריון.
                        הירשמו לטיסות ספציפיות וקבלו התראות מיידיות במייל
                        כאשר מתרחשים שינויים בסטטוס, טרמינל או לוח זמנים.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-button" onClick={onGetStarted}>
                            <span>התחל לעקוב אחר טיסות</span>
                            {/* <span>→</span> */}
                        </button>
                        <a href="#features" className="secondary-button">
                            <span>צפה בתכונות</span>
                            <span>↓</span>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

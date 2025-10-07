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
                        <span>Ben Gurion Airport Flight Monitoring</span>
                    </div>

                    <h1 className="hero-title">
                        Never miss a flight update with
                        <span className="highlight"> intelligent notifications</span>
                    </h1>

                    <p className="hero-description">
                        Flight monitoring system for Ben Gurion International Airport.
                        Subscribe to specific flights and receive instant email notifications
                        when status, terminal, or schedule changes occur.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-button" onClick={onGetStarted}>
                            <span>Start Monitoring Flights</span>
                            {/* <span>→</span> */}
                        </button>
                        <a href="#features" className="secondary-button">
                            <span>See Features</span>
                            <span>↓</span>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

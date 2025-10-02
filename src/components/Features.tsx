import '../styles/Features.css';

const features = [
    {
        icon: '🔔',
        title: 'Smart Email Notifications',
        description: 'Automated HTML email alerts via SendGrid when subscribed flights experience status changes, terminal updates, schedule modifications, or counter assignments.'
    },
    {
        icon: '⚡',
        title: 'Real-time Data Sync',
        description: "Automatically syncs flight data from Ben Gurion Airport's API every 60 seconds, ensuring you always have the most current flight information."
    },
    {
        icon: '🔐',
        title: 'Google OAuth Security',
        description: 'Secure user authentication with Google OAuth 2.0 integration. No passwords to remember - just sign in with your Google account.'
    },
    {
        icon: '✈️',
        title: 'Ben Gurion Airport Focus',
        description: "Specialized monitoring for Israel's main international hub with comprehensive coverage of all departures and arrivals."
    },
    {
        icon: '📱',
        title: 'Flight Subscriptions',
        description: 'Subscribe to specific flights for personalized updates. Manage multiple subscriptions and receive notifications only for flights you care about.'
    },
    {
        icon: '⚡',
        title: 'Reactive Architecture',
        description: 'Built with Spring WebFlux for high-performance, non-blocking operations. Cloud-ready deployment on Google Kubernetes Engine ensures reliability.'
    }
];

export default function Features() {
    return (
        <section className="features-section" id="features">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-title">Powerful Flight Monitoring</h2>
                    <p className="features-subtitle">
                        Stay informed with real-time flight updates, automated notifications, and comprehensive subscription management.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

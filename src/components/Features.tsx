import '../styles/Features.css';

const features = [
    {
        icon: '🔔',
        title: 'התראות חכמות במייל',
        description: 'התראות אוטומטיות במייל HTML דרך SendGrid כאשר טיסות שאליהן נרשמתם חווים שינויים בסטטוס, עדכוני טרמינל, שינויי לוח זמנים או הקצאות דלפק.'
    },
    {
        icon: '⚡',
        title: 'סנכרון נתונים בזמן אמת',
        description: 'סנכרון אוטומטי של נתוני טיסות מממשק ה-API של נתב"ג כל 60 שניות, מבטיח שתמיד יהיה לכם את המידע העדכני ביותר על הטיסות.'
    },
    {
        icon: '🔐',
        title: 'אבטחת Google OAuth',
        description: 'אימות משתמשים מאובטח עם אינטגרציית Google OAuth 2.0. אין צורך לזכור סיסמאות - פשוט התחברו עם חשבון Google שלכם.'
    },
    {
        icon: '✈️',
        title: 'התמקדות בנמל התעופה בן גוריון',
        description: 'ניטור מתמחה למוקד הבינלאומי המרכזי של ישראל עם כיסוי מקיף של כל ההמראות והנחיתות.'
    },
    {
        icon: '📱',
        title: 'מינויים לטיסות',
        description: 'הירשמו לטיסות ספציפיות לעדכונים מותאמים אישית. נהלו מספר מינויים וקבלו התראות רק עבור הטיסות שחשובות לכם.'
    },
    {
        icon: '⚡',
        title: 'ארכיטקטורה ריאקטיבית',
        description: 'נבנה עם Spring WebFlux לביצועים גבוהים ופעולות לא חוסמות. פריסה מוכנה לענן ב-Google Kubernetes Engine מבטיחה אמינות.'
    }
];

export default function Features() {
    return (
        <section className="features-section" id="features">
            <div className="features-container">
                <div className="features-header">
                    <h2 className="features-title">ניטור טיסות מתקדם</h2>
                    <p className="features-subtitle">
                        הישארו מעודכנים עם עדכוני טיסות בזמן אמת, התראות אוטומטיות וניהול מינויים מקיף.
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

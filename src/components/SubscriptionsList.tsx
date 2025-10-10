import { unsubscribeFromFlight } from '../services/flights';
import { formatDate, formatScheduledTimeForAPI } from '../utils/dateUtils';
import type { Flight } from '../types';
import '../styles/SubscriptionsList.css';

interface SubscriptionsListProps {
    subscriptions: Flight[];
    onUnsubscribe: () => void;
    onMessage: (message: string, isError: boolean) => void;
}

export default function SubscriptionsList({
    subscriptions,
    onUnsubscribe,
    onMessage
}: SubscriptionsListProps) {
    const handleDelete = async (flight: Flight) => {
        try {
            await unsubscribeFromFlight(
                flight.airlineCode,
                flight.flightNumber,
                formatScheduledTimeForAPI(flight.scheduledTime)
            );
            onMessage('המינוי הוסר בהצלחה!', false);
            onUnsubscribe();
        } catch (err) {
            console.error('Error unsubscribing:', err);
            onMessage('נכשל בהסרת המינוי.', true);
        }
    };

    if (subscriptions.length === 0) {
        return (
            <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
                <h3>אין מינויים פעילים</h3>
                <p>הירשם לטיסה הראשונה שלך כדי להתחיל!</p>
            </div>
        );
    }

    return (
        <>
            <h3>✈️ מינויים פעילים</h3>
            {subscriptions.map((sub, index) => (
                <div key={index} className="subscription-item">
                    <div className="subscription-details">
                        <div className="detail-item">
                            <span className="detail-label">טיסה</span>
                            <span className="detail-value">
                                <span className="flight-icon">✈️</span>
                                {sub.airlineCode} {sub.flightNumber}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">חברת תעופה</span>
                            <span className="detail-value">{sub.airlineName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">זמן משוער</span>
                            <span className="detail-value">{formatDate(sub.estimatedTime)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">יעד</span>
                            <span className="detail-value">
                                {sub.cityHe || 'לא זמין'} ({sub.countryHe || 'לא זמין'})
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">סטטוס</span>
                            <span className="detail-value">{sub.statusHe || 'לא ידוע'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">טרמינל</span>
                            <span className="detail-value">{sub.terminal || 'לא אושר'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">דלפקים</span>
                            <span className="detail-value">{sub.counters || 'לא אושר'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">אזור צ׳ק אין</span>
                            <span className="detail-value">{sub.checkinZone || 'לא אושר'}</span>
                        </div>
                    </div>
                    <button
                        className="btn btn-danger delete-subscription-btn"
                        onClick={() => handleDelete(sub)}
                    >
                        <span className="btn-icon">🗑️</span>
                        <span className="btn-text">הסר מינוי</span>
                    </button>
                </div>
            ))}
        </>
    );
}

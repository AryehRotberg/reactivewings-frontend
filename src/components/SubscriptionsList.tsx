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
            onMessage('Subscription deleted successfully!', false);
            onUnsubscribe();
        } catch (err) {
            console.error('Error unsubscribing:', err);
            onMessage('Failed to delete subscription.', true);
        }
    };

    if (subscriptions.length === 0) {
        return (
            <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
                <h3>No Active Subscriptions</h3>
                <p>Subscribe to your first flight to get started!</p>
            </div>
        );
    }

    return (
        <>
            <h3>✈️ Active Subscriptions</h3>
            {subscriptions.map((sub, index) => (
                <div key={index} className="subscription-item">
                    <div className="subscription-details">
                        <div className="detail-item">
                            <span className="detail-label">Flight</span>
                            <span className="detail-value">
                                <span className="flight-icon">✈️</span>
                                {sub.airlineCode} {sub.flightNumber}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Airline Company</span>
                            <span className="detail-value">{sub.airlineName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Estimated Time</span>
                            <span className="detail-value">{formatDate(sub.estimatedTime)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Destination</span>
                            <span className="detail-value">
                                {sub.cityEn || 'N/A'} ({sub.countryEn || 'N/A'})
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className="detail-value">{sub.statusEn || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Terminal</span>
                            <span className="detail-value">{sub.terminal || 'NOT CONFIRMED'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Counters</span>
                            <span className="detail-value">{sub.counters || 'NOT CONFIRMED'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Check-in Zone</span>
                            <span className="detail-value">{sub.checkinZone || 'NOT CONFIRMED'}</span>
                        </div>
                    </div>
                    <button
                        className="btn btn-danger delete-subscription-btn"
                        onClick={() => handleDelete(sub)}
                    >
                        <span className="btn-icon">🗑️</span>
                        <span className="btn-text">Remove Subscription</span>
                    </button>
                </div>
            ))}
        </>
    );
}

import { useState } from 'react';
import { searchFlights, subscribeToFlight } from '../services/flights';
import { getTodayDate } from '../utils/dateUtils';
import '../styles/SubscriptionForm.css';

interface SubscriptionFormProps {
    onSubscriptionAdded: () => void;
    onMessage: (message: string, isError: boolean) => void;
}

export default function SubscriptionForm({ onSubscriptionAdded, onMessage }: SubscriptionFormProps) {
    const [airlineCode, setAirlineCode] = useState('');
    const [flightNumber, setFlightNumber] = useState('');
    const [scheduledDate, setScheduledDate] = useState(getTodayDate());
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!airlineCode || !flightNumber || !scheduledDate) {
            onMessage('אנא מלאו את כל השדות.', true);
            return;
        }

        setLoading(true);

        try {
            const searchResults = await searchFlights(airlineCode, flightNumber, scheduledDate);

            if (!searchResults || searchResults.length === 0) {
                onMessage('לא נמצאו טיסות עם הקריטריונים שצוינו.', true);
                setLoading(false);
                return;
            }

            await subscribeToFlight(searchResults);
            onMessage('מינוי לטיסה נוסף בהצלחה!', false);

            // Reset form
            setAirlineCode('');
            setFlightNumber('');
            setScheduledDate(getTodayDate());

            onSubscriptionAdded();
        } catch (err) {
            console.error('Error subscribing:', err);
            onMessage('נכשל בהוספת מינוי.', true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <h2>🔔 הירשם לטיסה</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row-triple">
                    <div className="form-group">
                        <label htmlFor="airlineCode">קוד חברת תעופה</label>
                        <input
                            type="text"
                            id="airlineCode"
                            placeholder="לדוגמה: LY"
                            value={airlineCode}
                            onChange={(e) => setAirlineCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="flightNumber">מספר טיסה</label>
                        <input
                            type="text"
                            id="flightNumber"
                            placeholder="לדוגמה: 001"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="scheduledDate">תאריך מתוכנן</label>
                        <input
                            type="date"
                            id="scheduledDate"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    <span className="btn-text">
                        {loading ? 'מבצע רישום...' : 'הירשם לטיסה'}
                    </span>
                </button>
            </form>
        </div>
    );
}

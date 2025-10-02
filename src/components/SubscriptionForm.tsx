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
            onMessage('Please fill in all fields.', true);
            return;
        }

        setLoading(true);

        try {
            const searchResults = await searchFlights(airlineCode, flightNumber, scheduledDate);

            if (!searchResults || searchResults.length === 0) {
                onMessage('No flights found with the specified criteria.', true);
                setLoading(false);
                return;
            }

            await subscribeToFlight(searchResults);
            onMessage('Flight subscription added successfully!', false);

            // Reset form
            setAirlineCode('');
            setFlightNumber('');
            setScheduledDate(getTodayDate());

            onSubscriptionAdded();
        } catch (err) {
            console.error('Error subscribing:', err);
            onMessage('Failed to add subscription.', true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <h2>🔔 Subscribe to a Flight</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row-triple">
                    <div className="form-group">
                        <label htmlFor="airlineCode">Airline Code</label>
                        <input
                            type="text"
                            id="airlineCode"
                            placeholder="e.g. EL AL"
                            value={airlineCode}
                            onChange={(e) => setAirlineCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="flightNumber">Flight Number</label>
                        <input
                            type="text"
                            id="flightNumber"
                            placeholder="e.g. LY001"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="scheduledDate">Scheduled Date</label>
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
                        {loading ? 'Subscribing...' : 'Subscribe to Flight'}
                    </span>
                </button>
            </form>
        </div>
    );
}

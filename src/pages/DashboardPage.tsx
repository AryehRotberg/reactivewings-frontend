import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';
import { useUserInfo } from '../hooks/useUserInfo';
import { useToast } from '../hooks/useToast';
import { useAuthCallback } from '../hooks/useAuthCallback';
import DashboardNav from '../components/DashboardNav';
import SubscriptionForm from '../components/SubscriptionForm';
import SubscriptionsList from '../components/SubscriptionsList';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import '../styles/Dashboard.css';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { userInfo, loading, refetch } = useUserInfo();
    const { toast, showToast } = useToast();

    useAuthCallback(() => {
        refetch(true);
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleMessage = (message: string, isError: boolean) => {
        showToast(message, isError ? 'error' : 'success');
    };

    return (
        <div className="dashboard-page">
            {loading && <LoadingSpinner />}
            <DashboardNav />
            <div className="container">
                <div className="header">
                    <h1>Flight Subscription Manager</h1>
                    <p>Stay updated with real-time flight information</p>
                </div>

                <div className="content">
                    <SubscriptionForm
                        onSubscriptionAdded={() => refetch(false)}
                        onMessage={handleMessage}
                    />

                    <div className="section">
                        <h2>📋 Your Subscriptions</h2>
                        <button onClick={() => refetch(false)} className="btn btn-refresh">
                            <span className="btn-icon">🔄</span>
                            <span className="btn-text">Refresh Subscriptions</span>
                        </button>

                        {userInfo && (
                            <div className="user-info">
                                <h3>👤 User Information</h3>
                                <p><strong>Email:</strong> {userInfo.email}</p>
                            </div>
                        )}

                        {!loading && (
                            <SubscriptionsList
                                subscriptions={userInfo?.subscriptions || []}
                                onUnsubscribe={() => refetch(false)}
                                onMessage={handleMessage}
                            />
                        )}
                    </div>
                </div>

                <Toast
                    message={toast.message}
                    type={toast.type}
                    visible={toast.visible}
                />
            </div>
        </div>
    );
}

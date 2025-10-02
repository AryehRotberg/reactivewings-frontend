import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOauthCallback } from '../services/auth';

export function useAuthCallback(onTokenProcessed?: () => void) {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const hasToken = params.has('token');
        
        handleOauthCallback();
        
        if (hasToken) {
            if (onTokenProcessed)
                onTokenProcessed();
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, onTokenProcessed]);
}

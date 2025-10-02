import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOauthCallback } from '../services/auth';

export function useAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        handleOauthCallback();
        const params = new URLSearchParams(window.location.search);
        if (params.get('token')) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);
}

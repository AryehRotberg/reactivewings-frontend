import { useState, useEffect } from 'react';
import { getUserInfo } from '../services/user';
import type { UserInfo } from '../types';

export function useUserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserInfo = async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        }
        setError(null);
        try {
            const data = await getUserInfo();
            setUserInfo(data);
        } catch (err) {
            setError('Failed to fetch user info');
            console.error(err);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return { userInfo, loading, error, refetch: fetchUserInfo };
}

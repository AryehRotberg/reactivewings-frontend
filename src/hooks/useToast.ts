import { useState } from 'react';

interface ToastState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

export function useToast() {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        visible: false
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    return { toast, showToast };
}

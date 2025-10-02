import '../styles/Toast.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

export default function Toast({ message, type, visible }: ToastProps) {
    if (!visible) return null;

    return (
        <div className={`message ${type === 'error' ? 'error' : 'success'}`}>
            {type === 'error' ? '❌' : '✅'} {message}
        </div>
    );
}

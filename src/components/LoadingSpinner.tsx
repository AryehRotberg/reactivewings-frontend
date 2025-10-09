import '../styles/Loading.css';

export default function LoadingSpinner() {
    return (
        <div className="page-loading-overlay">
            <div className="spinner"></div>
            <div>טוען מערכת ניהול טיסות...</div>
        </div>
    );
}

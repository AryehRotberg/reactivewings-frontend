import { useEffect, useRef } from 'react';
import '../styles/Stats.css';

const stats = [
    { value: 60, label: 'Second Data Sync' },
    { value: 24, label: 'Hour Monitoring' },
    { value: 99.9, label: '% System Uptime' },
    { value: 1, label: "Israel's Main Airport" }
];

export default function Stats() {
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statNumbers = entry.target.querySelectorAll('.stat-number');
                        statNumbers.forEach((el) => {
                            const element = el as HTMLElement;
                            const targetValue = parseFloat(element.getAttribute('data-value') || '0');
                            animateValue(element, 0, targetValue, 2000);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
        const startTime = performance.now();
        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = start + (end - start) * progress;
            element.textContent = end % 1 === 0 ? Math.floor(value).toString() : value.toFixed(1);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    return (
        <section className="stats-section" id="stats" ref={statsRef}>
            <div className="stats-container">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <span className="stat-number" data-value={stat.value}>0</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

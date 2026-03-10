import React, { useState, useEffect } from 'react';

const StatCard = ({ label, value, trend, icon, color }) => (
    <div className="stat-card glass-panel scale-in">
        <div className="stat-header">
            <span className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>{icon}</span>
            <span className="stat-trend" style={{ color: trend.startsWith('+') ? 'var(--neon-emerald)' : 'var(--neon-pink)' }}>
                {trend}
            </span>
        </div>
        <div className="stat-body">
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
        <div className="stat-progress-bg">
            <div className="stat-progress-bar" style={{ width: '70%', backgroundColor: color }}></div>
        </div>
    </div>
);

const ActivityChart = () => {
    // A quick animated mock chart using SVG
    return (
        <div className="activity-chart glass-panel">
            <div className="chart-header">
                <h3>Neural Activity</h3>
                <span className="status-badge pulse">Live</span>
            </div>
            <div className="chart-container">
                <svg viewBox="0 0 400 150" className="chart-svg">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--neon-accent)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,120 Q50,80 100,100 T200,60 T300,90 T400,40 V150 H0 Z"
                        fill="url(#chartGradient)"
                    />
                    <path
                        d="M0,120 Q50,80 100,100 T200,60 T300,90 T400,40"
                        fill="none"
                        stroke="var(--neon-accent)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="chart-line-anim"
                    />
                    {/* Data Points */}
                    <circle cx="100" cy="100" r="4" fill="var(--neon-accent)" />
                    <circle cx="200" cy="60" r="4" fill="var(--neon-accent)" />
                    <circle cx="300" cy="90" r="4" fill="var(--neon-accent)" />
                </svg>
            </div>
        </div>
    );
};

export default function HomeView() {
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const hours = new Date().getHours();
        if (hours < 12) setGreeting('Good Morning, Voyager');
        else if (hours < 18) setGreeting('Good Afternoon, Voyager');
        else setGreeting('Good Evening, Voyager');

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-view stagger-container">
            <div className="dashboard-hero slide-up">
                <div className="hero-content">
                    <h1 className="neon-text glow-pulse">{greeting}</h1>
                    <p className="subtitle">The Neural Nexus is operating at optimal capacity. Welcome back.</p>
                </div>
                <div className="hero-time glass-panel">
                    <span className="time-digit">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="date-digit">
                        {currentTime.toLocaleTimeString([], { second: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    label="AI Sync Tokens"
                    value="42.8k"
                    trend="+12.4%"
                    icon="⚡"
                    color="var(--neon-accent)"
                />
                <StatCard
                    label="Active Neurons"
                    value="1,284"
                    trend="+8.2%"
                    icon="🧠"
                    color="var(--neon-purple)"
                />
                <StatCard
                    label="Response Latency"
                    value="14ms"
                    trend="-2.1ms"
                    icon="⏱️"
                    color="var(--neon-emerald)"
                />
                <StatCard
                    label="Logic Synthesis"
                    value="98.2%"
                    trend="Stable"
                    icon="💎"
                    color="var(--neon-pink)"
                />
            </div>

            <div className="dashboard-main-grid">
                <ActivityChart />

                <div className="dashboard-section glass-panel accent-border">
                    <div className="section-header">
                        <h3>Active Personas</h3>
                        <button className="btn-icon">⚙️</button>
                    </div>
                    <div className="persona-list">
                        {['Education', 'Agriculture', 'Coding', 'Research'].map((p, idx) => (
                            <div key={p} className="persona-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="persona-icon-mini">{p[0]}</div>
                                <div className="persona-info">
                                    <span className="persona-name">{p}</span>
                                    <span className="persona-status">Synchronized</span>
                                </div>
                                <div className="persona-glow"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="recent-activity glass-panel">
                <div className="section-header">
                    <h3>Recent Neural Links</h3>
                    <span className="view-all">View History</span>
                </div>
                <div className="recent-table">
                    {[
                        { title: 'Python Loop Optimization', role: 'Coding', time: '2h ago', status: 'Completed' },
                        { title: 'Genetic Research Analysis', role: 'Research', time: '5h ago', status: 'Stored' },
                        { title: 'Soil Enrichment Strategy', role: 'Agriculture', time: 'Yesterday', status: 'Completed' }
                    ].map((item, idx) => (
                        <div key={idx} className="recent-row">
                            <span className="row-title">{item.title}</span>
                            <span className="row-tag">{item.role}</span>
                            <span className="row-time">{item.time}</span>
                            <span className="row-status badge-success">{item.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import React from 'react';

export default function GlobalSidebar({ activeView, setActiveView }) {
    const MENU_ITEMS = [
        { id: 'home', label: 'Dashboard', icon: '🏠' },
        { id: 'chat', label: 'AI Assistants', icon: '🤖' },
        { id: 'tools', label: 'AI Toolbox', icon: '🛠️' },
        { id: 'learning', label: 'Learning Center', icon: '📚' },
        { id: 'workspace', label: 'Workspace', icon: '🖋️' },
        { id: 'profile', label: 'Nexus Profile', icon: '👤' }
    ];

    return (
        <div className="global-sidebar glass-panel slide-right">
            <div className="sidebar-brand scale-in">
                <div className="brand-logo">N</div>
                <span className="neon-text">Nexus Hub</span>
            </div>
            <nav className="sidebar-nav stagger-container">
                {MENU_ITEMS.map((item, index) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer slide-up">
                <div className="status-container glass-panel">
                    <div className="status-header">
                        <span className="dot pulse-blue"></span>
                        <span className="status-text">Neural Link Active</span>
                    </div>
                    <div className="status-meta">Latency: 14ms | 98% Sync</div>
                </div>
            </div>
        </div>
    );
}

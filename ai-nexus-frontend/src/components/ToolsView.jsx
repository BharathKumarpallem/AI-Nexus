import React from 'react';

const ToolCard = ({ id, label, icon, items, delay }) => (
    <div className="tool-card glass-panel scale-in" style={{ animationDelay: delay }}>
        <div className="tool-card-glow"></div>
        <div className="tool-header">
            <div className="tool-icon-wrapper">
                <span className="tool-icon">{icon}</span>
            </div>
            <div className="tool-title-group">
                <h3>{label}</h3>
                <span className="module-status">Online</span>
            </div>
        </div>
        <div className="tool-content">
            <ul className="tool-items">
                {items.map((item, idx) => (
                    <li key={idx}>
                        <span className="bullet"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
        <div className="tool-footer">
            <button className="btn btn-secondary tool-btn">
                <span>Access Module</span>
                <span className="btn-arrow">→</span>
            </button>
        </div>
    </div>
);

export default function ToolsView() {
    const TOOLS = [
        { id: 'file', label: 'Neural Document Analysis', icon: '📄', items: ['Synthesize PDF Insights', 'Logic Extraction', 'Context Summarization'] },
        { id: 'image', label: 'Ethereal Image Synthesis', icon: '🎨', items: ['Cinematic Concept Art', 'Neural UI Mockups', 'Architecture Blueprints'] },
        { id: 'search', label: 'Global Knowledge Stream', icon: '🌐', items: ['Live Intelligence Feed', 'Factual Verification', 'Cross-Source Analysis'] },
        { id: 'shopping', label: 'Market Intelligence', icon: '🛒', items: ['Value Handshake Protocol', 'Arbitrage Analysis', 'Smart Acquisition'] }
    ];

    return (
        <div className="tools-view stagger-container">
            <div className="view-header slide-up">
                <h1 className="neon-text glow-pulse">AI Nexus Tool Modules</h1>
                <p className="subtitle">High-fidelity neural modules designed for complex synthesis and materialization.</p>
            </div>

            <div className="tools-grid">
                {TOOLS.map((tool, index) => (
                    <ToolCard
                        key={tool.id}
                        {...tool}
                        delay={`${index * 0.15}s`}
                    />
                ))}
            </div>
        </div>
    );
}

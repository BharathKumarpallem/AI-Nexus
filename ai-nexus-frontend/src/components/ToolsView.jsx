import React from 'react';

export default function ToolsView() {
    const TOOLS = [
        { id: 'file', label: 'File & Document Tools', icon: '📄', items: ['Upload PDFs & Documents', 'Extract Key Insights', 'Summarize Large Files'] },
        { id: 'image', label: 'Image Creation Module', icon: '🎨', items: ['Generate Concept Art', 'Create UI Mockups', 'Diagram Synthesis'] },
        { id: 'search', label: 'Global Web Search', icon: '🌐', items: ['Live News Gathering', 'Factual Summaries', 'Source Analysis'] },
        { id: 'shopping', label: 'Shopping Research Proxy', icon: '🛒', items: ['Product Comparisons', 'Price Analysis', 'Recommendations'] }
    ];

    return (
        <div className="tools-view slide-up">
            <h1 className="neon-text glow-pulse">AI Tool Modules</h1>
            <p>Access specialized neural modules for high-fidelity work.</p>

            <div className="tools-grid">
                {TOOLS.map(tool => (
                    <div key={tool.id} className="tool-card glass-panel">
                        <div className="tool-header">
                            <span className="tool-icon">{tool.icon}</span>
                            <h3>{tool.label}</h3>
                        </div>
                        <ul className="tool-items">
                            {tool.items.map((item, idx) => (
                                <li key={idx}>⚡ {item}</li>
                            ))}
                        </ul>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>Initialize {tool.label.split(' ')[0]}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

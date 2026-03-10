import React, { useState } from 'react';

const WorkspaceSidebarCard = ({ title, desc, icon, btnText, variant = 'secondary', delay }) => (
    <div className={`workspace-side-card glass-panel slide-right ${variant === 'primary' ? 'accent-blue' : ''}`} style={{ animationDelay: delay }}>
        <div className="side-card-header">
            <span className="side-card-icon">{icon}</span>
            <h4>{title}</h4>
        </div>
        <p>{desc}</p>
        <button className={`btn btn-${variant} full-width`}>{btnText}</button>
    </div>
);

export default function WorkspaceView() {
    const [title, setTitle] = useState('Neural Project Alpha');

    return (
        <div className="workspace-view stagger-container">
            <div className="view-header slide-up">
                <div className="header-badge">Creative Mode Active</div>
                <h1 className="neon-text glow-pulse">Infinite Workspace</h1>
                <p className="subtitle">High-latency neural drafting and comprehensive project orchestration.</p>
            </div>

            <div className="workspace-grid-premium">
                <div className="workspace-main-editor glass-panel slide-up">
                    <div className="editor-toolbar">
                        <div className="editor-title-group">
                            <span className="dot pulse-blue"></span>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="editor-title-input"
                            />
                        </div>
                        <div className="editor-actions">
                            <button className="toolbar-btn">💾 Save</button>
                            <button className="toolbar-btn">📤 Export</button>
                            <button className="toolbar-btn primary">✨ Refine</button>
                        </div>
                    </div>
                    <div className="editor-content">
                        <textarea
                            placeholder="Begin your neural synthesis here..."
                            className="workspace-textarea"
                        ></textarea>
                    </div>
                </div>

                <div className="workspace-sidebar">
                    <WorkspaceSidebarCard
                        title="Deep Reasoning"
                        desc="Activate multi-chain logic processing for complex problems."
                        icon="🧠"
                        btnText="Initialize Link"
                        delay="0.3s"
                    />
                    <WorkspaceSidebarCard
                        title="Research Matrix"
                        desc="Cross-reference global data streams for factual grounding."
                        icon="🔬"
                        btnText="Scan Matrix"
                        delay="0.5s"
                    />
                    <WorkspaceSidebarCard
                        title="Canvas Canvas"
                        desc="Switch to a visual orchestration environment."
                        icon="🎨"
                        btnText="Launch Nexus"
                        variant="primary"
                        delay="0.7s"
                    />
                </div>
            </div>
        </div>
    );
}

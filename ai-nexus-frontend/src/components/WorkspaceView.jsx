import React from 'react';

export default function WorkspaceView() {
    return (
        <div className="workspace-view slide-up">
            <h1 className="neon-text glow-pulse">Creative Workspace</h1>
            <p>A collaborative writing, planning, and brainstorming environment.</p>

            <div className="workspace-grid">
                <div className="workspace-main glass-panel">
                    <div className="workspace-header">
                        <span className="workspace-title">Untitled Workspace</span>
                        <div className="actions">
                            <span className="action">Save</span>
                            <span className="action">Export</span>
                        </div>
                    </div>
                    <div className="workspace-content">
                        <textarea placeholder="Brainstorm ideas, draft long-form documents, outline projects..."></textarea>
                    </div>
                </div>

                <div className="workspace-side glass-panel">
                    <h3>Thinking Mode</h3>
                    <p>Provide deep reasoning and step-by-step analysis.</p>
                    <button className="btn btn-secondary">Activate Deep Reasoning</button>

                    <h3 style={{ marginTop: '2rem' }}>Deep Research Mode</h3>
                    <p>Literature-style explanations and multi-viewpoint analysis.</p>
                    <button className="btn btn-secondary">Initialize Research</button>

                    <h3 style={{ marginTop: '2rem' }}>Canvas Tool</h3>
                    <p>Collaborative writing or planning workspace.</p>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Launch Canvas</button>
                </div>
            </div>
        </div>
    );
}

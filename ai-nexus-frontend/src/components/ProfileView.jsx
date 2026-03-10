import React from 'react';

export default function ProfileView() {
    return (
        <div className="profile-view stagger-container">
            <div className="view-header slide-up">
                <h1 className="neon-text glow-pulse">Nexus Profile Identity</h1>
                <p className="subtitle">Manage your neural presence and system-wide handshakes.</p>
            </div>

            <div className="profile-grid">
                <div className="profile-card-main glass-panel slide-up">
                    <div className="profile-hero">
                        <div className="avatar-wrapper">
                            <div className="avatar pulsing-avatar">N</div>
                            <div className="avatar-ring"></div>
                        </div>
                        <div className="profile-basic-info">
                            <h2 className="user-name">Nexus Identity</h2>
                            <span className="user-rank">Level 4 Neural Architect</span>
                            <div className="badge-row">
                                <span className="rank-badge">Tier 1 Elite</span>
                                <span className="rank-badge gold">Verified Link</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-stats-grid">
                        <div className="mini-stat">
                            <span className="value">1.2M</span>
                            <span className="label">Tokens</span>
                        </div>
                        <div className="mini-stat">
                            <span className="value">48</span>
                            <span className="label">Visuals</span>
                        </div>
                        <div className="mini-stat">
                            <span className="value">156</span>
                            <span className="label">Nodes</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn btn-primary">Synchronize Identity</button>
                        <button className="btn btn-secondary">Neural Export</button>
                    </div>
                </div>

                <div className="profile-settings-column">
                    <div className="profile-section-card glass-panel slide-right" style={{ animationDelay: '0.4s' }}>
                        <h3>System Credentials</h3>
                        <div className="credentials-form">
                            <div className="input-field-group">
                                <label>User Alias</label>
                                <div className="input-wrapper">
                                    <input type="text" value="Identity" readOnly className="nexus-input-dim" />
                                    <span className="input-icon-lock">🔒</span>
                                </div>
                            </div>
                            <div className="input-field-group">
                                <label>Neural Channel</label>
                                <div className="input-wrapper">
                                    <input type="email" value="user@nexus.hub" readOnly className="nexus-input-dim" />
                                    <span className="input-icon-lock">🔒</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section-card glass-panel slide-right" style={{ animationDelay: '0.6s' }}>
                        <h3>Memory Nodes (Saved)</h3>
                        <div className="memory-nodes-list">
                            <div className="memory-node-item">
                                <div className="node-icon">📝</div>
                                <div className="node-text">
                                    <span className="node-title">Python Architecture Optim...</span>
                                    <span className="node-date">24 Mar 2026</span>
                                </div>
                            </div>
                            <div className="memory-node-item">
                                <div className="node-icon">🔬</div>
                                <div className="node-text">
                                    <span className="node-title">Soil Composition Analysis</span>
                                    <span className="node-date">18 Mar 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

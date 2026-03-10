import React from 'react';

export default function ProfileView() {
    return (
        <div className="profile-view slide-up">
            <div className="view-header">
                <h1 className="neon-text glow-pulse">Nexus Profile</h1>
                <p>Manage your account settings and neural link credentials.</p>
            </div>

            <div className="profile-container glass-panel">
                <div className="avatar-section">
                    <div className="avatar pulsing-avatar">U</div>
                    <button className="btn">Change Identity Image</button>
                    <span>User Alias: Identity</span>
                    <span>Status: Level 4 Neural Link</span>
                </div>

                <div className="settings-section">
                    <div className="setting-group">
                        <label>Account Credentials</label>
                        <input type="text" value="Identity" readOnly className="neon-border" />
                        <input type="email" value="user@nexus.hub" readOnly className="neon-border" />
                    </div>

                    <div className="setting-group">
                        <label>Saved Chats & Bookmarks</label>
                        <div className="bookmarks">
                            <div className="bookmark-item">Saved: Python Algorithms</div>
                            <div className="bookmark-item">Saved: Yield Analysis</div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <label>Usage Statistics</label>
                        <ul className="stats-list">
                            <li>Tokens Consumed: 1.2M</li>
                            <li>Images Generated: 48</li>
                            <li>Research Points: 156</li>
                        </ul>
                    </div>

                    <div className="actions">
                        <button className="btn btn-primary">Update Profile</button>
                        <button className="btn btn-secondary">Export Identity Data</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

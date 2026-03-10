import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelector from '../components/RoleSelector';
import ChatBox from '../components/ChatBox';
import { getHistory } from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import GlobalSidebar from '../components/GlobalSidebar';
import HomeView from '../components/HomeView';
import ProfileView from '../components/ProfileView';
import ToolsView from '../components/ToolsView';
import LearningView from '../components/LearningView';
import WorkspaceView from '../components/WorkspaceView';
import DashboardBackground from '../components/DashboardBackground';

export default function Dashboard() {
    const navigate = useNavigate();
    const [currentRole, setCurrentRole] = useState('education');
    const [messages, setMessages] = useState([]);
    const [activeView, setActiveView] = useState('home'); // Home is the new User Dashboard
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }

        getHistory().then(history => {
            const formatted = [];
            history.forEach(chat => {
                formatted.push({
                    id: chat.id + '_user',
                    text: chat.prompt,
                    type: 'user',
                    role: chat.role
                });
                formatted.push({
                    id: chat.id + '_ai',
                    text: chat.response,
                    type: 'ai',
                    role: chat.role
                });
            });
            setMessages(formatted);
        }).catch(err => {
            console.error("Auth error", err);
            localStorage.removeItem('token');
            navigate('/');
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleRoleChange = (roleId) => {
        if (roleId === currentRole) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentRole(roleId);
            setIsTransitioning(false);
        }, 300);
    };

    const handleViewChange = (viewId) => {
        if (viewId === activeView) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveView(viewId);
            setIsTransitioning(false);
        }, 300);
    };

    const roleFilteredMessages = messages.filter(m => m.role === currentRole);

    const renderActiveView = () => {
        switch (activeView) {
            case 'home': return <HomeView />;
            case 'chat': return (
                <div className="chat-assistant-view slide-up">
                    <div className="side-column">
                        <WeatherWidget key="global_weather" />
                        <RoleSelector currentRole={currentRole} onSelect={handleRoleChange} />
                    </div>
                    <div className="center-column">
                        <ChatBox
                            key={currentRole}
                            currentRole={currentRole}
                            messages={roleFilteredMessages}
                            setMessages={setMessages}
                        />
                    </div>
                </div>
            );
            case 'tools': return <ToolsView />;
            case 'learning': return <LearningView />;
            case 'workspace': return <WorkspaceView />;
            case 'profile': return <ProfileView />;
            default: return <HomeView />;
        }
    };

    return (
        <div className={`nexus-layout ${isTransitioning ? 'switching' : ''}`}>
            <DashboardBackground />
            <GlobalSidebar activeView={activeView} setActiveView={handleViewChange} />

            <div className="main-viewport">
                <header className="header slide-down">
                    <div className="header-title-group">
                        <span className="subtitle-label">System Active / v1.0.4</span>
                        <h2 className="neon-text glow-pulse">AI Nexus Frontier</h2>
                    </div>
                    <div className="header-actions">
                        <div className="user-profile-summary">
                            <span className="user-badge">Nexus Mind: <span className="neon-accent">Authorized</span></span>
                        </div>
                        <button className="btn btn-logout" onClick={handleLogout}>
                            <span className="logout-icon">⏻</span>
                            Disconnect
                        </button>
                    </div>
                </header>

                <main className="content-container">
                    {!isTransitioning && renderActiveView()}
                </main>
            </div>
        </div>
    );
}

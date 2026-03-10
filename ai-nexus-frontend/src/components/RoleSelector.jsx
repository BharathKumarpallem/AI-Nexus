import React from 'react';

const ROLES = [
    { id: 'education', label: '🎓 Education Assistant', desc: 'Step-by-step concepts, practice & tutor' },
    { id: 'agriculture', label: '🌾 Agriculture Assistant', desc: 'Field-ready advice & sustainable solutions' },
    { id: 'career', label: '💼 Career & Interview Coach', desc: 'Resumes, Q&A practice & strategy' },
    { id: 'coding', label: '💻 Coding Assistant', desc: 'Optimized code, logic & mentoring' },
    { id: 'health', label: '🧘 Health & Wellness', desc: 'Balanced lifestyle, safety & support' },
    { id: 'research', label: '🔬 Research & Explorer', desc: 'Analytical structured knowledge' }
];

export default function RoleSelector({ currentRole, onSelect }) {
    return (
        <div className="sidebar">
            <h3 className="neon-text glow-pulse" style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.4rem' }}>AI Modes</h3>
            {ROLES.map(role => (
                <button
                    key={role.id}
                    className={`role-btn ${currentRole === role.id ? 'active' : ''}`}
                    onClick={() => onSelect(role.id)}
                >
                    <div className="role-title">{role.label}</div>
                    <div className="role-desc">{role.desc}</div>
                </button>
            ))}
        </div>
    );
}

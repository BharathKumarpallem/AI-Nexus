import React from 'react';

const LessonCard = ({ title, role, time, delay }) => (
    <div className="lesson-row scale-in" style={{ animationDelay: delay }}>
        <div className="lesson-meta">
            <span className="lesson-role-badge">{role}</span>
        </div>
        <div className="lesson-main">
            <span className="lesson-title">{title}</span>
            <span className="lesson-details">Theoretical Framework • {time}</span>
        </div>
        <div className="lesson-action">
            <button className="btn-icon-round">▶</button>
        </div>
    </div>
);

export default function LearningView() {
    const LESSONS = [
        { title: 'Python Neural Optimization', role: 'Coding', time: '15 min' },
        { title: 'Soil Enrichment Handshake', role: 'Agriculture', time: '20 min' },
        { title: 'Executive Logic Strategy', role: 'Career', time: '25 min' },
        { title: 'Quantum Research Methods', role: 'Research', time: '40 min' }
    ];

    return (
        <div className="learning-view stagger-container">
            <div className="view-header slide-up">
                <h1 className="neon-text glow-pulse">Cognitive Learning Center</h1>
                <p className="subtitle">Expand your neural capabilities through structured knowledge transfer sessions.</p>
            </div>

            <div className="learning-main-grid">
                <div className="learning-card-main glass-panel slide-up">
                    <div className="card-header-premium">
                        <div className="icon-box">📚</div>
                        <div className="text-box">
                            <h3>Curated Learning Paths</h3>
                            <p>Synchronize with specialized AI teachers.</p>
                        </div>
                    </div>
                    <div className="lesson-list-premium">
                        {LESSONS.map((lesson, idx) => (
                            <LessonCard key={idx} {...lesson} delay={`${idx * 0.1 + 0.3}s`} />
                        ))}
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary full-width">Initialize New Session</button>
                    </div>
                </div>

                <div className="learning-side-column">
                    <div className="learning-card glass-panel slide-right" style={{ animationDelay: '0.4s' }}>
                        <div className="icon-box-small">⚡</div>
                        <h3>Assessment Engine</h3>
                        <p>Generate cognitive puzzles from any topic.</p>
                        <div className="quiz-options">
                            <div className="quiz-tag">#LogicAssessment</div>
                            <div className="quiz-tag">#TheoryHandshake</div>
                        </div>
                        <button className="btn btn-secondary full-width">Materialize Quiz</button>
                    </div>

                    <div className="learning-card glass-panel accent-emerald slide-right" style={{ animationDelay: '0.6s' }}>
                        <div className="icon-box-small">💎</div>
                        <h3>Synthesis Rewards</h3>
                        <p>Track your cognitive growth milestones.</p>
                        <div className="progress-orb-container">
                            <div className="progress-orb">
                                <span className="orb-text">84%</span>
                                <svg className="orb-svg" viewBox="0 0 36 36">
                                    <path className="orb-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="orb-fill" strokeDasharray="84, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

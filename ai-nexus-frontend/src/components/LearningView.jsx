import React from 'react';

export default function LearningView() {
    const LESSONS = [
        { title: 'Python Loop Theory', role: 'Coding Assistant', time: '15 min' },
        { title: 'Soil Enrichment Techniques', role: 'Agriculture Assistant', time: '20 min' },
        { title: 'Interview Strategy Guide', role: 'Career Coach', time: '25 min' }
    ];

    return (
        <div className="learning-view slide-up">
            <h1 className="neon-text glow-pulse">Learning Modules</h1>
            <p>Teach users new topics with structured neural lessons.</p>

            <div className="learning-sections-grid">
                <div className="learning-card glass-panel">
                    <h3>Study & Learn</h3>
                    <p>Explain concepts, create learning paths, and provide exercises.</p>
                    <div className="lesson-list">
                        {LESSONS.map((lesson, idx) => (
                            <div key={idx} className="lesson-item">
                                <span className="lesson-role">{lesson.role}</span>
                                <span className="lesson-title">{lesson.title}</span>
                                <span className="lesson-time">{lesson.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 'auto' }}>Start New Session</button>
                </div>

                <div className="learning-card glass-panel">
                    <h3>Quiz Generator</h3>
                    <p>Generate quizzes based on topics for knowledge assessments.</p>
                    <div className="quiz-preview">
                        <div className="quiz-item">⚡ Multiple Choice Questions</div>
                        <div className="quiz-item">⚡ Practice Mock Tests</div>
                    </div>
                    <button className="btn btn-secondary">Generate Quiz Node</button>
                </div>
            </div>
        </div>
    );
}

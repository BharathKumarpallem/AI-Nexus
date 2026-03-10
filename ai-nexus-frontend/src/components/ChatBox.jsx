import React, { useState, useRef, useEffect } from 'react';
import { sendChat, generateImage, searchImages } from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function ChatBox({ currentRole, messages, setMessages }) {
    const [inputStr, setInputStr] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchEnabled, setSearchEnabled] = useState(false);
    const [imageSearchEnabled, setImageSearchEnabled] = useState(false);
    const [imageGenEnabled, setImageGenEnabled] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const toggleTool = (tool) => {
        if (tool === 'search') {
            setSearchEnabled(!searchEnabled);
            setImageSearchEnabled(false);
            setImageGenEnabled(false);
        } else if (tool === 'imageSearch') {
            setImageSearchEnabled(!imageSearchEnabled);
            setSearchEnabled(false);
            setImageGenEnabled(false);
        } else if (tool === 'imageGen') {
            setImageGenEnabled(!imageGenEnabled);
            setSearchEnabled(false);
            setImageSearchEnabled(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputStr.trim() || loading) return;

        const userMsg = {
            id: Date.now().toString() + '_user',
            text: inputStr,
            type: 'user',
            role: currentRole
        };

        setMessages(prev => [...prev, userMsg]);
        setInputStr('');
        setLoading(true);

        try {
            if (imageSearchEnabled) {
                const res = await searchImages(userMsg.text);
                const aiMsg = {
                    id: Date.now().toString() + '_ai',
                    text: `### 🖼️ Search Results for: *${userMsg.text}*\n\n` +
                        res.images.map(img => `![Result](${img})`).join('\n\n'),
                    type: 'ai',
                    role: currentRole
                };
                setMessages(prev => [...prev, aiMsg]);
            } else if (imageGenEnabled) {
                const res = await generateImage(userMsg.text);
                const aiMsg = {
                    id: Date.now().toString() + '_ai',
                    text: `![Generated Image](${res.image_url})\n\n### 🎨 Vision Output\nGenerated image based on: *"${userMsg.text}"*`,
                    type: 'ai',
                    role: currentRole
                };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                const res = await sendChat({ role: currentRole, prompt: userMsg.text });
                const aiMsg = {
                    id: res.id.toString() + '_ai',
                    text: res.response,
                    type: 'ai',
                    role: res.role
                };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (err) {
            console.error(err);
            const errorMsg = {
                id: Date.now().toString() + '_err',
                text: "System Notification: The AI module encountered a temporary sync issue. Please retry in a moment.",
                type: 'ai',
                role: 'system'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleSpeak = (text) => {
        const synth = window.speechSynthesis;
        if (synth.speaking) {
            synth.cancel();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Role-based Voice Profiles
        const profiles = {
            education: { pitch: 1.1, rate: 0.95 },   // Patient & Clear
            agriculture: { pitch: 0.85, rate: 0.9 }, // Grounded & Steady
            career: { pitch: 1.0, rate: 1.05 },      // Professional & Sharp
            coding: { pitch: 1.0, rate: 1.2 },       // Fast & Logical
            health: { pitch: 0.9, rate: 0.85 },      // Calm & Soothing
            research: { pitch: 0.95, rate: 1.0 }     // Analytical & Neutral
        };

        const config = profiles[currentRole] || profiles.education;
        utterance.pitch = config.pitch;
        utterance.rate = config.rate;

        // Try to pick a natural sounding voice if available
        const voices = synth.getVoices();
        const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
        if (preferred) utterance.voice = preferred;

        synth.speak(utterance);
    };

    const handleGenerateImage = async () => {
        if (!inputStr.trim() || loading) return;
        const userPrompt = inputStr.trim();
        setInputStr('');
        setLoading(true);

        const userMsg = {
            id: Date.now().toString() + '_user',
            text: `🎨 Vision Request: "${userPrompt}"`,
            type: 'user',
            role: currentRole
        };
        setMessages(prev => [...prev, userMsg]);

        try {
            const res = await generateImage(userPrompt);
            const aiMsg = {
                id: Date.now().toString() + '_ai',
                text: `![Generated Image](${res.image_url})\n\n### 🎨 Vision Output\nGenerated image based on: *"${userPrompt}"*`,
                type: 'ai',
                role: currentRole
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            alert('Image generation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-area glass-panel">
            <div className="chat-header-bar">
                <div className="header-info">
                    <span className="assistant-name">{currentRole.toUpperCase()} ASSISTANT</span>
                    <span className="online-status">● Active Session</span>
                </div>
            </div>
            <div className="chat-thread">
                {messages.length === 0 && (
                    <div className="flex-center empty-chat">
                        <img src={`/avatars/${currentRole}.png`} alt="AI Bot" className="pulsing-avatar-large" onError={(e) => e.target.style.display = 'none'} />
                        <h2>How can I help you today?</h2>
                        <p>Start a conversation with your {currentRole} assistant.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.type}`}>
                        <div className="message-avatar">
                            {msg.type === 'ai' ? (
                                <img src={`/avatars/${msg.role}.png`} alt="AI" onError={(e) => e.target.style.display = 'none'} />
                            ) : (
                                <div className="user-avatar">U</div>
                            )}
                        </div>
                        <div className="message-content">
                            {msg.type === 'ai' ? (
                                <>
                                    <ReactMarkdown
                                        components={{
                                            img: ({ node, ...props }) => (
                                                <div className="image-artifact-container">
                                                    <img {...props} crossOrigin="anonymous" className="generated-visual" />
                                                    <div className="image-actions">
                                                        <button
                                                            className="action-btn"
                                                            onClick={() => {
                                                                const link = document.createElement('a');
                                                                link.href = props.src;
                                                                link.download = 'nexus_materialization.jpg';
                                                                link.click();
                                                            }}
                                                            title="Download Vision Artifact"
                                                        >
                                                            💾 Save
                                                        </button>
                                                        <button
                                                            className="action-btn"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(props.src);
                                                                alert('Neural link copied to clipboard.');
                                                            }}
                                                            title="Copy Vision Link"
                                                        >
                                                            🔗 Copy
                                                        </button>
                                                        <button
                                                            className="action-btn"
                                                            onClick={async () => {
                                                                try {
                                                                    await navigator.share({
                                                                        title: 'AI Nexus Materialization',
                                                                        text: 'Check out this generated visual from the Nexus Hub.',
                                                                        url: props.src
                                                                    });
                                                                } catch (err) {
                                                                    navigator.clipboard.writeText(props.src);
                                                                    alert('Linked to grid clipboard (Sharing not supported on this node).');
                                                                }
                                                            }}
                                                            title="Share Vision"
                                                        >
                                                            📡 Share
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                    <button className="tts-btn" onClick={() => handleSpeak(msg.text)}>🔊 Speak Response</button>
                                </>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-row ai">
                        <div className="message-avatar">
                            <img src={`/avatars/${currentRole}.png`} alt="AI" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <div className="message-content typing">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-wrapper" onSubmit={handleSend}>
                <div className="chat-tools">
                    <button
                        type="button"
                        className={`tool-btn ${searchEnabled ? 'active' : ''}`}
                        onClick={() => toggleTool('search')}
                        title="Search the Web"
                    >
                        🌐
                    </button>
                    <button
                        type="button"
                        className={`tool-btn ${imageSearchEnabled ? 'active' : ''}`}
                        onClick={() => toggleTool('imageSearch')}
                        title="Search Images"
                        disabled={loading}
                    >
                        🖼️
                    </button>
                    <button
                        type="button"
                        className={`tool-btn ${imageGenEnabled ? 'active' : ''}`}
                        onClick={() => toggleTool('imageGen')}
                        title="AI Vision / Image Gen"
                        disabled={loading}
                    >
                        🎨
                    </button>
                </div>
                <input
                    type="text"
                    placeholder={
                        imageGenEnabled ? "🎨 vision grid ready: Describe what to generate..." :
                            imageSearchEnabled ? "🖼️ image search active: Searching global archives..." :
                                searchEnabled ? "🌐 research mode: Finding live data..." :
                                    `Message ${currentRole} assistant...`
                    }
                    value={inputStr}
                    onChange={e => setInputStr(e.target.value)}
                    className="neon-border"
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    Send
                </button>
            </form>
        </div>
    );
}

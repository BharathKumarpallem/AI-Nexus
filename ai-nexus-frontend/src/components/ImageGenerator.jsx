import React, { useState } from 'react';
import { generateImage } from '../services/api';

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const data = await generateImage(prompt);
            setImageUrl(data.image_url);
        } catch (err) {
            console.error("Image generation failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="image-gen-section glass-panel slide-up">
            <h3 className="neon-text glow-pulse">🎨 Nexus Image Studio</h3>
            <p className="subtitle">Convert your requirements into visual reality</p>

            <form onSubmit={handleGenerate} className="image-gen-form">
                <input
                    type="text"
                    placeholder="Describe the image you want to create..."
                    className="neon-border"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="spinner"></span> : 'Generate Magic'}
                </button>
            </form>

            {imageUrl && (
                <div className="image-result slide-down">
                    <img src={imageUrl} alt="AI Generated" className="generated-img" />
                    <a href={imageUrl} target="_blank" rel="noreferrer" className="btn btn-secondary mt-2">Download Image</a>
                </div>
            )}
        </div>
    );
}

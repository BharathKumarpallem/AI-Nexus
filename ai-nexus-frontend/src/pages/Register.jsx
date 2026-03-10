import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, generateOtp, googleLogin } from '../services/api';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

/**
 * THE OMNI-NEXUS MASTER SHOW LIST (100+ Titles)
 */
const SHOWS = [
    "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen", "Chainsaw Man", "Hunter x Hunter",
    "Naruto", "One Piece", "Dragon Ball Z", "My Hero Academia", "Fullmetal Alchemist Brotherhood",
    "Death Note", "Tokyo Ghoul", "Blue Exorcist", "Fire Force", "Tokyo Revengers", "Steins Gate",
    "Cowboy Bebop", "Code Geass", "Neon Genesis Evangelion", "Psycho Pass", "Cyberpunk Edgerunners",
    "Berserk", "Mushoku Tensei", "Overlord", "The Promised Neverland", "Spy x Family",
    "Kaguya Sama Love is War", "Fruits Basket", "Ranking of Kings", "Gintama", "Haikyuu",
    "K-On", "Your Lie in April", "Clannad", "Yu Yu Hakusho", "Rurouni Kenshin", "Trigun",
    "Samurai Champloo", "Bleach", "Inuyasha", "Pokemon", "Solo Leveling", "Breaking Bad",
    "The Wire", "The Sopranos", "Game of Thrones", "Chernobyl", "Band of Brothers",
    "Stranger Things", "Better Call Saul", "Mad Men", "The Last of Us", "Succession",
    "Dark", "The Boys", "Severance", "The Mandalorian", "Black Mirror", "The Witcher",
    "House of the Dragon", "Westworld"
];

const TMDB_API_KEY = "52d4fa156d5dfe0c3ef7936e1e6f4b0d";
const TMDB_IMG_URL = "https://image.tmdb.org/t/p/original";
const DANBOORU_LOGIN = "KUMARPALLEM";
const DANBOORU_API_KEY = "pQ4se4u77pvghBipoDZu4DhF";

const GOOGLE_CLIENT_ID = "398387535892-1519hnotknlkrec9pkqcmsn2ctjn7gg8.apps.googleusercontent.com";
const GITHUB_CLIENT_ID = "Ov23liz3UUxIcsbEYwnY";

function SocialLoginButtons({ handleSocialLogin }) {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => handleSocialLogin('Google', tokenResponse),
        onError: () => console.log('Neural Handshake Failed')
    });

    return (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button type="button" onClick={() => login()} className="social-btn" style={{
                width: '100%', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '600', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s', fontSize: '0.85rem'
            }}>
                <span style={{ color: '#4285F4' }}>G</span> Google Auth
            </button>
            <button type="button" onClick={() => handleSocialLogin('GitHub')} className="social-btn" style={{
                width: '100%', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '600', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s', fontSize: '0.85rem'
            }}>
                <span style={{ color: '#fff' }}>G</span> GitHub Forge
            </button>
        </div>
    );
}

export default function Register() {
    const navigate = useNavigate();

    // Identity State
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Visual Engine State
    const [currentShow, setCurrentShow] = useState(SHOWS[0]);
    const [wallpaper, setWallpaper] = useState("");
    const [isFading, setIsFading] = useState(true);

    // Dual-Core Neural Visual Engine (TMDB + Danbooru Hybrid)
    const updateWallpaper = async (showName) => {
        try {
            setIsFading(false);
            const useDanbooru = Math.random() > 0.8; // 20% weight to Danbooru for high-art anime hits

            if (useDanbooru) {
                // Danbooru Neural Fetch
                const response = await fetch(
                    `https://danbooru.donmai.us/posts.json?login=${DANBOORU_LOGIN}&api_key=${DANBOORU_API_KEY}&tags=${encodeURIComponent(showName)}+rating:safe&limit=1`
                );
                const data = await response.json();
                if (data && data.length > 0 && data[0].file_url) {
                    setTimeout(() => {
                        setWallpaper(data[0].file_url);
                        setIsFading(true);
                    }, 400);
                    return;
                }
            }

            // TMDB Cinematic Fetch (Default/Fallback)
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(showName)}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const bestMatch = data.results.find(res => res.backdrop_path) || data.results[0];
                if (bestMatch.backdrop_path) {
                    const imgUrl = `${TMDB_IMG_URL}${bestMatch.backdrop_path}`;
                    setTimeout(() => {
                        setWallpaper(imgUrl);
                        setIsFading(true);
                    }, 400);
                }
            }
        } catch (err) {
            console.error("Neural Visual Rejection:", err);
        }
    };

    // Initialize & 60s Cycle
    useEffect(() => {
        const firstShow = SHOWS[Math.floor(Math.random() * SHOWS.length)];
        setCurrentShow(firstShow);
        updateWallpaper(firstShow);

        const interval = setInterval(() => {
            const nextShow = SHOWS[Math.floor(Math.random() * SHOWS.length)];
            setCurrentShow(nextShow);
            updateWallpaper(nextShow);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleGenerateOtp = async () => {
        if (!email) {
            setError('Contact details missing');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await generateOtp({ email });
            setOtpSent(true);
            setMessage(res.message);
        } catch (err) {
            setError('Nexus pulse failure');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Access keys mismatch');
            return;
        }
        setLoading(true);
        try {
            await register({ username, password, email, otp, fullName });
            navigate('/');
        } catch (err) {
            setError('Registry denied');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider, response) => {
        if (provider === 'Google') {
            setLoading(true);
            try {
                // Fetch info from Google using the token
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${response.access_token}` }
                });
                const userInfo = await userInfoRes.json();

                const res = await googleLogin({
                    email: userInfo.email,
                    name: userInfo.name
                });
                localStorage.setItem('token', res.access_token);
                navigate('/dashboard');
            } catch (err) {
                setError('Google Neural Handshake Failure');
            } finally {
                setLoading(false);
            }
        } else if (provider === 'GitHub') {
            const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
            window.location.assign(githubUrl);
        }
    };

    // Handle GitHub OAuth Code Reception
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            setLoading(true);
            const processGithub = async () => {
                try {
                    const res = await githubLogin({ code, email: `${Math.random().toString(36).substring(7)}@github.users` });
                    localStorage.setItem('token', res.access_token);
                    navigate('/dashboard');
                } catch (err) {
                    setError('GitHub Neural Link Failed');
                } finally {
                    setLoading(false);
                }
            };
            processGithub();
        }
    }, [navigate]);

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="nexus-render-root" style={{
                position: 'relative',
                background: '#010409',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100vw',
                fontFamily: "'Outfit', sans-serif"
            }}>

                {/* OMNI-NEXUS SYSTEM BACKGROUND (V17.0 TMDB CORE) */}
                <div className="background-engine" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                    {/* Luminous Core Fallback (Ensures NO BLACK SCREEN) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 10% 10%, rgba(69, 243, 255, 0.45) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(255, 0, 255, 0.35) 0%, transparent 50%), linear-gradient(135deg, #01060e 0%, #0d1a2d 100%)',
                        zIndex: 0
                    }}></div>

                    {/* DYNAMIC TMDB MASTERPIECE */}
                    {wallpaper && (
                        <div
                            key={wallpaper}
                            className="ken-burns-layer"
                            style={{
                                position: 'absolute',
                                inset: '-10%',
                                width: '120vw',
                                height: '120vh',
                                backgroundImage: `url("${wallpaper}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
                                opacity: isFading ? 1 : 0,
                                transition: 'opacity 3s ease-in-out',
                                zIndex: 1
                            }}
                        ></div>
                    )}

                    {/* Cinematic Vignette */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.92) 100%)',
                        zIndex: 2
                    }}></div>
                </div>

                <div className="status-hud" style={{
                    position: 'fixed',
                    bottom: '40px',
                    left: '40px',
                    background: 'rgba(1, 1, 1, 0.9)',
                    padding: '16px 32px',
                    borderRadius: '80px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    zIndex: 100,
                    backdropFilter: 'blur(50px)',
                    boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div className="pulse-indicator"></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.6, letterSpacing: '4px', fontWeight: 'bold' }}>NEURAL SYNC</span>
                        <span style={{ color: '#fff', fontWeight: '950', fontSize: '1.2rem', letterSpacing: '2px', opacity: 0.9 }}>{currentShow.toUpperCase()}</span>
                    </div>
                </div>

                <div className="interface-wrapper" style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '480px',
                    padding: '20px'
                }}>
                    <div className="glass-card" style={{
                        background: 'rgba(2, 6, 15, 0.05)',
                        backdropFilter: 'blur(30px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 20px rgba(255, 255, 255, 0.03)',
                        borderRadius: '45px',
                        padding: '2.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div className="neon-outer-glow"></div>

                        <div className="portal-header" style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
                            <div className="logo-icon" style={{
                                width: '60px', height: '60px', margin: '0 auto 15px auto',
                                background: 'linear-gradient(135deg, #111, #000)', borderRadius: '18px',
                                boxShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 19L7 5M7 19V5M17 19V5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '950', color: '#fff', letterSpacing: '-1px', marginBottom: '4px' }}>Nexus Hub</h2>
                            <h1 style={{ fontSize: '1.8rem', color: '#fff', opacity: 0.6, fontWeight: '950', marginBottom: '0.2rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Forge</h1>
                        </div>

                        {error && <div className="alert-error" style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(255,0,0,0.12)', borderLeft: '3px solid #ff4444', borderRadius: '10px', color: '#fff', fontSize: '0.8rem' }}>{error}</div>}
                        {message && <div className="alert-success" style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(0,255,0,0.12)', borderLeft: '3px solid #00c851', borderRadius: '10px', color: '#fff', fontSize: '0.8rem' }}>{message}</div>}

                        <form onSubmit={handleRegister}>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="field">
                                    <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '950', color: '#fff', opacity: 0.5, letterSpacing: '1px', marginBottom: '5px' }}>NAME</label>
                                    <input type="text" placeholder="Identity" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ background: 'rgba(255,255,255,0.06)', border: 'none', padding: '12px 14px', borderRadius: '10px', color: '#fff', width: '100%', fontSize: '0.85rem', outline: 'none' }} />
                                </div>
                                <div className="field">
                                    <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '950', color: '#fff', opacity: 0.5, letterSpacing: '1px', marginBottom: '5px' }}>ALIAS</label>
                                    <input type="text" placeholder="ID" value={username} onChange={e => setUsername(e.target.value)} required style={{ background: 'rgba(255,255,255,0.06)', border: 'none', padding: '12px 14px', borderRadius: '10px', color: '#fff', width: '100%', fontSize: '0.85rem', outline: 'none' }} />
                                </div>
                            </div>

                            <div className="field" style={{ marginTop: '1.2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '950', color: '#fff', opacity: 0.5, letterSpacing: '1px', marginBottom: '5px' }}>NEURAL FREQUENCY (EMAIL)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="email" placeholder="conscious@nexus.ai" value={email} onChange={e => setEmail(e.target.value)} required style={{ background: 'rgba(255,255,255,0.06)', border: 'none', padding: '12px 14px', borderRadius: '10px', color: '#fff', flex: 1, fontSize: '0.85rem', outline: 'none' }} />
                                    <button type="button" onClick={handleGenerateOtp} disabled={loading || !email} style={{ padding: '0 15px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#fff', cursor: 'pointer', fontWeight: '950', textTransform: 'uppercase', fontSize: '0.7rem' }}>SYNC</button>
                                </div>
                            </div>

                            {otpSent && (
                                <div className="field" style={{ marginTop: '1.2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '950', color: '#fff', opacity: 0.5, letterSpacing: '2px', marginBottom: '5px' }}>VERIFICATION ECHO</label>
                                    <input type="text" placeholder="••••••" value={otp} onChange={e => setOtp(e.target.value)} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px', color: '#fff', width: '100%', textAlign: 'center', fontSize: '1.6rem', letterSpacing: '8px', fontWeight: '950', outline: 'none' }} />
                                </div>
                            )}

                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '1.2rem' }}>
                                <div className="field" style={{ position: 'relative' }}>
                                    <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '950', color: '#fff', opacity: 0.5, letterSpacing: '1px', marginBottom: '5px' }}>ACCESS KEY</label>
                                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ background: 'rgba(255,255,255,0.06)', border: 'none', padding: '12px 14px', borderRadius: '10px', color: '#fff', width: '100%', fontSize: '0.85rem', outline: 'none' }} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', bottom: '10px', background: 'none', border: 'none', color: '#00bc00', cursor: 'pointer', opacity: 0.8, fontSize: '0.65rem', fontWeight: '950' }}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                                </div>
                                <div className="field">
                                    <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '950', color: '#fff', opacity: 0.5, letterSpacing: '1px', marginBottom: '5px' }}>RE-ACCESS KEY</label>
                                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ background: 'rgba(255,255,255,0.06)', border: 'none', padding: '12px 14px', borderRadius: '10px', color: '#fff', width: '100%', fontSize: '0.85rem', outline: 'none' }} />
                                </div>
                            </div>

                            <button type="submit" className="submit-portal-btn" style={{
                                width: '100%', height: '54px', fontSize: '1.1rem', marginTop: '1.8rem', borderRadius: '18px',
                                background: 'linear-gradient(90deg, #111, #444)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                                fontWeight: '950', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                                textTransform: 'uppercase', letterSpacing: '2px'
                            }} disabled={loading || !otpSent}>
                                {loading ? 'BYPASSING...' : 'INITIALIZE LINK'}
                            </button>

                            <SocialLoginButtons handleSocialLogin={handleSocialLogin} />
                        </form>

                        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                            Linked already? <Link to="/" style={{ color: '#fff', textDecoration: 'underline', fontWeight: '950', marginLeft: '6px', opacity: 0.8 }}>ACCESS HUB</Link>
                        </p>
                    </div>
                </div>

                <style>{`
                 .ken-burns-layer { animation: cinematicZoom 60s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
                @keyframes cinematicZoom { 0% { transform: scale(1); } 100% { transform: scale(1.3) translate(-2%, -2%); } }
                .pulse-indicator { width: 14px; height: 14px; background: #fff; border-radius: 50%; box-shadow: 0 0 20px rgba(255,255,255,0.4); animation: pulseGlow 2s infinite; }
                @keyframes pulseGlow { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(2); opacity: 0.1; } 100% { transform: scale(1); opacity: 1; } }
                .neon-outer-glow { position: absolute; inset: -1px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 45px; pointer-events: none; }
                .submit-portal-btn:hover { transform: translateY(-3px); filter: brightness(1.2); transition: 0.4s; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6); }
                .social-btn:hover { background: rgba(255,255,255,0.12) !important; transform: scale(1.02); }
                input::placeholder { color: rgba(255,255,255,0.1); }
            `}</style>
            </div>
        </GoogleOAuthProvider>
    );
}

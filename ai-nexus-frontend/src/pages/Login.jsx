import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, googleLogin, githubLogin } from '../services/api';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import globeImg from '../assets/nexus_globe.png';

const GOOGLE_CLIENT_ID = "398387535892-1519hnotknlkrec9pkqcmsn2ctjn7gg8.apps.googleusercontent.com";
const GITHUB_CLIENT_ID = "Ov23liz3UUxIcsbEYwnY";

function SocialLoginButtons({ handleSocialLogin }) {
    const googleLoginTrigger = useGoogleLogin({
        onSuccess: tokenResponse => handleSocialLogin('Google', tokenResponse),
        onError: () => console.log('Neural Handshake Failed')
    });

    return (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => googleLoginTrigger()} className="social-btn" style={{
                flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '600', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s'
            }}>
                <span style={{ color: '#4285F4' }}>G</span> Google
            </button>
            <button type="button" onClick={() => handleSocialLogin('GitHub')} className="social-btn" style={{
                flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: '600', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s'
            }}>
                <span style={{ color: '#fff' }}>G</span> GitHub
            </button>
        </div>
    );
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login({ username, password });
            localStorage.setItem('token', res.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || "Access Denied");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider, response) => {
        if (provider === 'Google') {
            setLoading(true);
            try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${response.access_token}` }
                });
                const userInfo = await userInfoRes.json();
                const res = await googleLogin({ email: userInfo.email, name: userInfo.name });
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

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="nexus-login-root" style={{
                position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#010409', overflow: 'hidden', padding: '20px'
            }}>

                {/* DUAL-LAYER BACKGROUND (V18.2 MONOCHROME CORE) */}
                <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #080808 0%, #000 100%)', opacity: 0.8 }}></div>
                    <div style={{
                        position: 'absolute', inset: '-180px',
                        backgroundImage: `url("${globeImg}")`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                        opacity: 0.65, animation: 'globeRotate 120s infinite linear', filter: 'brightness(1.5) contrast(0.8) grayscale(1)'
                    }}></div>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #010409 90%)' }}></div>
                </div>

                <div className="login-interface" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>
                    <div className="glass-card slide-up" style={{
                        background: 'rgba(2, 6, 15, 0.05)', backdropFilter: 'blur(30px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '40px', padding: '3.5rem',
                        boxShadow: '0 0 100px rgba(0,0,0,0.8), 0 0 30px rgba(255, 255, 255, 0.05)'
                    }}>

                        <div className="portal-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div className="logo-icon" style={{
                                width: '64px', height: '64px', margin: '0 auto 20px auto',
                                background: 'linear-gradient(135deg, #111, #000)', borderRadius: '20px',
                                boxShadow: '0 0 40px rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 19L7 5M7 19V5M17 19V5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '0.85rem', fontWeight: '950', color: '#fff', opacity: 0.6, letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '12px' }}>Nexus Hub</h2>
                            <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '950', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Initialize</h1>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>Welcome to the Neural Frontier.</p>
                        </div>

                        {error && <div className="error-alert" style={{ marginBottom: '1.5rem', background: 'rgba(255,0,0,0.1)', color: '#ff4444', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>}

                        <form onSubmit={handleLogin}>
                            <div className="input-field" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', color: '#fff', opacity: 0.5, fontSize: '0.65rem', fontWeight: '950', letterSpacing: '1px', marginBottom: '8px' }}>USER ALIAS</label>
                                <input type="text" placeholder="Identity" value={username} onChange={e => setUsername(e.target.value)} required style={{
                                    width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '14px', color: '#fff', fontSize: '1rem', outline: 'none'
                                }} />
                            </div>

                            <div className="input-field" style={{ position: 'relative', marginBottom: '2rem' }}>
                                <label style={{ display: 'block', color: '#fff', opacity: 0.5, fontSize: '0.65rem', fontWeight: '950', letterSpacing: '1px', marginBottom: '8px' }}>ACCESS KEY</label>
                                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{
                                    width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '14px', color: '#fff', fontSize: '1rem', outline: 'none'
                                }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                    position: 'absolute', right: '14px', bottom: '12px', background: 'none', border: 'none', color: '#fff', opacity: 0.6, cursor: 'pointer',
                                    fontWeight: '950', fontSize: '0.7rem'
                                }}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                            </div>

                            <button type="submit" className="login-submit-btn" disabled={loading} style={{
                                width: '100%', height: '58px', borderRadius: '18px', background: 'linear-gradient(90deg, #222, #555)', border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', fontWeight: '950', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                                textTransform: 'uppercase', letterSpacing: '3px', transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}>
                                {loading ? 'Materializing...' : 'Sync Access'}
                            </button>

                            <SocialLoginButtons handleSocialLogin={handleSocialLogin} />
                        </form>

                        <div className="auth-footer" style={{ marginTop: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>
                            New existence? <Link to="/register" style={{ color: '#fff', textDecoration: 'underline', fontWeight: '950', marginLeft: '6px', opacity: 0.8 }}>Forge Link</Link>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes globeRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .login-submit-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4) !important; }
                    .social-btn:hover { background: rgba(255,255,255,0.08) !important; transform: translateY(-2px); }
                    input::placeholder { color: rgba(255,255,255,0.15); }
                `}</style>
            </div>
        </GoogleOAuthProvider>
    );
}

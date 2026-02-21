import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage({ onLogin }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(form.username, form.password);
            } else {
                await register(form.username, form.email, form.password);
            }
            onLogin();
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong 🐸');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e8f5e9 0%, #f5f5dc 40%, #c8e6c9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '24px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Floating lily pad decorations */}
            {[...Array(6)].map((_, i) => (
                <motion.div key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.15, scale: 1, y: [0, -10, 0] }}
                    transition={{ delay: i * 0.2, duration: 3 + i, repeat: Infinity, repeatType: 'reverse' }}
                    style={{
                        position: 'absolute',
                        width: 60 + i * 20,
                        height: 60 + i * 20,
                        borderRadius: '50%',
                        background: 'var(--sage)',
                        left: `${10 + i * 15}%`,
                        top: `${10 + i * 12}%`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* Header */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                style={{ textAlign: 'center' }}
            >
                <div style={{ fontSize: '72px', marginBottom: '8px' }}>🐸</div>
                <h1 className="font-pixel" style={{
                    fontSize: 'clamp(14px, 3vw, 22px)',
                    color: 'var(--earth)',
                    lineHeight: 1.6,
                    textShadow: '2px 2px 4px rgba(107,66,38,0.2)',
                }}>
                    Leap of Faith
                </h1>
                <p style={{ color: 'var(--pond)', marginTop: '8px', fontWeight: 600 }}>
                    Your personal happiness lily pad 🌿
                </p>
            </motion.div>

            {/* Card */}
            <motion.div
                className="pond-card"
                initial={{ y: 40, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
                style={{ width: '100%', maxWidth: '420px', padding: '36px' }}
            >
                {/* Tab switch */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
                    {['login', 'register'].map((tab) => (
                        <button key={tab}
                            onClick={() => { setMode(tab); setError(''); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: 'none',
                                borderRadius: '10px',
                                fontFamily: 'Nunito, sans-serif',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                background: mode === tab ? 'var(--sage)' : 'var(--cream-dark)',
                                color: mode === tab ? 'var(--cream)' : 'var(--earth)',
                                transition: 'all 0.2s ease',
                            }}>
                            {tab === 'login' ? '🐸 Hop In' : '🌿 Join the Pond'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--earth)' }}>
                            Username
                        </label>
                        <input
                            className="pond-input"
                            placeholder="your_froggy_name"
                            value={form.username}
                            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                            required
                        />
                    </div>

                    <AnimatePresence>
                        {mode === 'register' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <label style={{ fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--earth)' }}>
                                    Email
                                </label>
                                <input
                                    className="pond-input"
                                    type="email"
                                    placeholder="frog@pond.com"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    required={mode === 'register'}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label style={{ fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--earth)' }}>
                            Password
                        </label>
                        <input
                            className="pond-input"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            required
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    background: '#fee2e2',
                                    color: '#991b1b',
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                }}
                            >
                                🐸 {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        className="btn-sage"
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.95 }}
                        style={{ marginTop: '8px', fontSize: '1rem' }}
                    >
                        {loading ? '🌀 Hopping...' : mode === 'login' ? '🐸 Hop In!' : '🌿 Join the Pond!'}
                    </motion.button>
                </form>
            </motion.div>

            {/* Frog images */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
                style={{
                    position: 'absolute', right: '5%', bottom: '5%',
                    width: 'clamp(80px, 12vw, 160px)',
                    opacity: 0.85,
                    pointerEvents: 'none',
                }}
            >
                <img src="/frogs/frog2.jpg" alt="happy frog" style={{ width: '100%', borderRadius: '12px' }} />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: 'spring' }}
                style={{
                    position: 'absolute', left: '5%', bottom: '10%',
                    width: 'clamp(70px, 10vw, 130px)',
                    opacity: 0.8,
                    pointerEvents: 'none',
                }}
            >
                <img src="/frogs/frog1.jpg" alt="angy frog" style={{ width: '100%', borderRadius: '12px' }} />
            </motion.div>
        </div>
    );
}

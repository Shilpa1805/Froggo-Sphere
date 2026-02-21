import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function GratitudePond({ onGravityShift, onNoteSubmit }) {
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const baseGravityRef = useRef(null);

    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);

        // Shift gravity as user types
        if (baseGravityRef.current === null && val.length === 1) {
            // Capture initial gravity when user starts typing
            baseGravityRef.current = 1.0;
        }
        if (val.length > 0) {
            const progress = Math.min(val.length / 80, 1); // Fully lifts at ~80 chars
            const newGravity = Math.max(0, 1.0 - progress);
            onGravityShift(newGravity);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        try {
            await axios.post('/gratitude/', { content: text.trim() });
            onNoteSubmit(text.trim());
            setText('');
            baseGravityRef.current = null;
            setSubmitted(true);
            onGravityShift(0); // fully lift
            setTimeout(() => setSubmitted(false), 3000);
        } catch (_) { }
        setLoading(false);
    };

    return (
        <motion.div
            className="pond-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
                padding: '24px',
                background: 'rgba(245,245,220,0.92)',
                borderColor: 'var(--sage-light)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>🌿</span>
                <div>
                    <h3 style={{
                        fontFamily: 'Press Start 2P, monospace',
                        fontSize: 'clamp(8px, 1.5vw, 11px)',
                        color: 'var(--earth)',
                        lineHeight: 1.6,
                    }}>
                        The Gratitude Pond
                    </h3>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--pond)',
                        fontWeight: 600,
                        marginTop: '4px',
                    }}>
                        What are you grateful for today?
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                    className="pond-input"
                    rows={3}
                    placeholder="Today I'm grateful for..."
                    value={text}
                    onChange={handleChange}
                    style={{
                        resize: 'none',
                    }}
                />

                {/* Gravity lift indicator */}
                {text.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <div style={{
                            flex: 1, height: '6px',
                            background: 'var(--cream-dark)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}>
                            <motion.div
                                animate={{ width: `${Math.min((text.length / 80) * 100, 100)}%` }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--sage), var(--lily-glow))',
                                    borderRadius: '3px',
                                }}
                            />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--pond)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {text.length >= 80 ? '🌟 Fully lifted!' : `✨ ${Math.round((text.length / 80) * 100)}% lifted`}
                        </span>
                    </motion.div>
                )}

                <motion.button
                    className="btn-sage"
                    type="submit"
                    disabled={loading || !text.trim()}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        opacity: text.trim() ? 1 : 0.6,
                        width: '100%',
                    }}
                >
                    {loading ? '🌀 Planting...' : '🌸 Release to the Pond'}
                </motion.button>
            </form>

            <AnimatePresence>
                {submitted && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            marginTop: '12px',
                            textAlign: 'center',
                            color: 'var(--sage-dark)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                        }}
                    >
                        🌿 Your gratitude is now floating in the pond! ✨
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

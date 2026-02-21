import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const MOODS = [
    { emoji: '😭', label: 'Very Low', score: 1, gravity: 1.0, color: '#fee2e2' },
    { emoji: '😔', label: 'Low', score: 2, gravity: 0.7, color: '#fef3c7' },
    { emoji: '😐', label: 'Meh', score: 3, gravity: 0.4, color: '#fef9c3' },
    { emoji: '🙂', label: 'Good', score: 4, gravity: 0.15, color: '#dcfce7' },
    { emoji: '🐸', label: 'Toad-ally Amazing!', score: 5, gravity: 0.0, color: '#bbf7d0' },
];

export default function MoodModal({ onClose, onMoodSelect }) {
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSelect = async (mood) => {
        setSelected(mood);
        setSaving(true);
        try {
            await axios.post('/moods/', { mood_score: mood.score, mood_label: mood.label });
        } catch (_) { }
        onMoodSelect(mood.gravity, mood.score);
        setSaving(false);
        setTimeout(onClose, 600);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(26,46,26,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                <motion.div
                    className="pond-card"
                    initial={{ scale: 0.7, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.7, y: 40, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                    onClick={e => e.stopPropagation()}
                    style={{ maxWidth: '480px', width: '100%', padding: '36px', textAlign: 'center' }}
                >
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌿</div>
                    <h2 style={{
                        fontFamily: 'Press Start 2P, monospace',
                        fontSize: 'clamp(10px, 2vw, 14px)',
                        color: 'var(--earth)',
                        marginBottom: '8px',
                        lineHeight: 1.8,
                    }}>
                        How's your lily pad today?
                    </h2>
                    <p style={{ color: 'var(--pond)', marginBottom: '28px', fontWeight: 600 }}>
                        Tap a frog to check in 🐸
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {MOODS.map((mood) => (
                            <motion.button
                                key={mood.score}
                                onClick={() => handleSelect(mood)}
                                whileHover={{ scale: 1.2, y: -4 }}
                                whileTap={{ scale: 0.9 }}
                                animate={selected?.score === mood.score ? { scale: [1, 1.3, 1] } : {}}
                                style={{
                                    background: selected?.score === mood.score ? mood.color : 'var(--cream-dark)',
                                    border: `3px solid ${selected?.score === mood.score ? 'var(--sage)' : 'transparent'}`,
                                    borderRadius: '16px',
                                    padding: '14px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                    minWidth: '72px',
                                    transition: 'background 0.2s ease',
                                    boxShadow: selected?.score === mood.score ? '0 4px 12px rgba(135,169,107,0.4)' : 'none',
                                }}
                            >
                                <span style={{ fontSize: '36px' }}>{mood.emoji}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--earth)', lineHeight: 1.3 }}>
                                    {mood.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    {saving && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ marginTop: '20px', color: 'var(--pond)', fontWeight: 600 }}
                        >
                            🌿 Saving your mood...
                        </motion.p>
                    )}

                    <button
                        onClick={onClose}
                        style={{
                            marginTop: '24px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--sage-dark)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            fontFamily: 'Nunito, sans-serif',
                        }}
                    >
                        Maybe later 🍃
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

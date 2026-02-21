import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import FrogMascot from '../components/FrogMascot';
import MoodModal from '../components/MoodModal';
import GratitudePond from '../components/GratitudePond';
import HappinessRibbit from '../components/HappinessRibbit';
import PhysicsWrapper from '../components/PhysicsWrapper';
import StarryPondBackground from '../components/StarryPondBackground';

export default function Dashboard({ user, onLogout }) {
    const [antiGravity, setAntiGravity] = useState(false);
    const [gravity, setGravity] = useState(0.5);
    const [showMoodModal, setShowMoodModal] = useState(false);
    const [physicsTokens, setPhysicsTokens] = useState([]);
    const [streak, setStreak] = useState({ streak_days: 0, accessory_level: 0, total_notes: 0 });
    const [moodScore, setMoodScore] = useState(null);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        axios.get('/gratitude/streak').then(r => setStreak(r.data)).catch(() => { });
    }, []);

    const handleAntiGravityToggle = () => {
        const next = !antiGravity;
        setAntiGravity(next);
        if (next) {
            setGravity(0);
            document.body.classList.add('anti-gravity');
            showNotif('🌟 Anti-Gravity activated! UI elements are now floating!');
        } else {
            setGravity(0.5);
            document.body.classList.remove('anti-gravity');
            setPhysicsTokens([]);
        }
    };

    const handleMoodSelect = (newGravity, score) => {
        setGravity(newGravity);
        setMoodScore(score);
        if (score <= 2) {
            showNotif('💚 Froggo is here for you. Keep going 🐸');
        } else if (score === 5) {
            showNotif("🌟 Toad-ally Amazing! You're flying!");
        }
    };

    const handleGravityShift = useCallback((val) => {
        setGravity(val);
        if (val === 0 && !antiGravity) {
            setAntiGravity(true);
            document.body.classList.add('anti-gravity');
        }
    }, [antiGravity]);

    const handleNoteSubmit = useCallback(async (text) => {
        setPhysicsTokens(prev => [...prev, { type: 'lily', text, id: Date.now() }]);
        const r = await axios.get('/gratitude/streak').catch(() => null);
        if (r) {
            const prev = streak.accessory_level;
            setStreak(r.data);
            if (r.data.accessory_level > prev) {
                const accessories = ['', '🌸 a Flower', '🎩 a Hat', '👑 a Crown', '🌟 a Star'];
                showNotif(`🎉 Froggo earned ${accessories[r.data.accessory_level]}! Check the mascot!`);
            }
        }
    }, [streak]);

    const handleSpawnBubble = useCallback((text) => {
        setPhysicsTokens(prev => [...prev, { type: 'bubble', text, id: Date.now() + 1 }]);
        if (!antiGravity) {
            setAntiGravity(true);
            document.body.classList.add('anti-gravity');
            setGravity(0);
        }
    }, [antiGravity]);

    const showNotif = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 4000);
    };

    const gravityLabel = gravity === 0 ? '✨ Floating!' : gravity >= 0.8 ? '😔 Heavy...' : `🌿 ${Math.round((1 - gravity) * 100)}% lifted`;

    return (
        <div style={{
            minHeight: '100vh',
            position: 'relative',
            transition: 'background 1s ease',
            background: antiGravity
                ? 'var(--night)'
                : 'linear-gradient(135deg, #e8f5e9 0%, #f5f5dc 50%, #c8e6c9 100%)',
        }}>
            {/* Starry pond */}
            <StarryPondBackground active={antiGravity} />

            {/* Physics wrapper */}
            <PhysicsWrapper active={antiGravity} gravity={gravity} physicsTokens={physicsTokens}>
                {/* ─── Main content ─────────────────────────────────── */}
                <div style={{ position: 'relative', zIndex: 10, padding: 'clamp(16px, 3vw, 32px)', maxWidth: '900px', margin: '0 auto' }}>

                    {/* Header */}
                    <motion.header
                        className="physics-body"
                        data-label="header"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '28px',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <h1 className="font-pixel" style={{
                                fontSize: 'clamp(10px, 2vw, 16px)',
                                color: antiGravity ? 'var(--lily)' : 'var(--earth)',
                                transition: 'color 0.8s ease',
                                textShadow: antiGravity ? '0 0 12px rgba(168,213,162,0.6)' : 'none',
                            }}>
                                🐸 Leap of Faith
                            </h1>
                            <p style={{
                                color: antiGravity ? 'var(--sage-light)' : 'var(--pond)',
                                fontWeight: 700,
                                marginTop: '4px',
                                transition: 'color 0.8s ease',
                            }}>
                                Hey {user?.username}! {streak.streak_days > 0 ? `🔥 ${streak.streak_days}-day streak!` : 'Welcome to the pond!'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{
                                background: antiGravity ? 'rgba(168,213,162,0.1)' : 'var(--cream-dark)',
                                borderRadius: '50px',
                                padding: '6px 14px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: antiGravity ? 'var(--lily)' : 'var(--pond)',
                                border: `1px solid ${antiGravity ? 'var(--sage)' : 'var(--sage-light)'}`,
                                transition: 'all 0.5s ease',
                            }}>
                                {gravityLabel}
                            </div>
                            <button
                                onClick={onLogout}
                                style={{
                                    background: 'none',
                                    border: '1px solid var(--sage-light)',
                                    borderRadius: '50px',
                                    padding: '6px 14px',
                                    cursor: 'pointer',
                                    fontFamily: 'Nunito, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    color: antiGravity ? 'var(--sage-light)' : 'var(--sage-dark)',
                                }}
                            >
                                🚪 Hop Out
                            </button>
                        </div>
                    </motion.header>

                    {/* Streak banner */}
                    {streak.streak_days >= 3 && (
                        <motion.div
                            className="pond-card physics-body"
                            data-label="streak-banner"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                                padding: '16px 24px',
                                marginBottom: '20px',
                                background: antiGravity ? 'rgba(168,213,162,0.1)' : 'rgba(168,213,162,0.3)',
                                borderColor: 'var(--lily-glow)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                            }}
                        >
                            <span style={{ fontSize: '32px' }}>🏆</span>
                            <div>
                                <p style={{ fontWeight: 800, color: antiGravity ? 'var(--lily)' : 'var(--pond)' }}>
                                    {streak.streak_days}-Day Gratitude Streak!
                                </p>
                                <p style={{ fontSize: '0.85rem', color: antiGravity ? 'var(--sage-light)' : 'var(--sage-dark)' }}>
                                    Froggo's level: {['Plain 🐸', '🌸 Flower', '🎩 Hatted', '👑 Royal', '🌟 Legendary'][Math.min(streak.accessory_level, 4)]}
                                    {' — '}
                                    {streak.total_notes} gratitude note{streak.total_notes !== 1 ? 's' : ''} total
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Action buttons row */}
                    <motion.div
                        className="physics-body"
                        data-label="action-buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}
                    >
                        {/* Lift Your Spirits */}
                        <motion.button
                            onClick={handleAntiGravityToggle}
                            whileHover={{ scale: 1.04, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            animate={antiGravity ? {
                                boxShadow: ['0 0 10px rgba(168,213,162,0.3)', '0 0 30px rgba(168,213,162,0.7)', '0 0 10px rgba(168,213,162,0.3)'],
                            } : {}}
                            transition={antiGravity ? { repeat: Infinity, duration: 2 } : {}}
                            style={{
                                background: antiGravity
                                    ? 'linear-gradient(135deg, #1a4a2a, #2d6a40)'
                                    : 'linear-gradient(135deg, var(--earth-light), var(--earth))',
                                color: 'var(--cream)',
                                border: `2px solid ${antiGravity ? 'var(--lily)' : 'transparent'}`,
                                borderRadius: '50px',
                                padding: '14px 24px',
                                fontFamily: 'Nunito, sans-serif',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: antiGravity ? '0 0 20px rgba(168,213,162,0.5)' : '0 4px 15px rgba(107,66,38,0.3)',
                                transition: 'all 0.4s ease',
                            }}
                        >
                            {antiGravity ? '🌍 Back to Earth' : '✨ Lift Your Spirits!'}
                        </motion.button>

                        {/* Mood Check-in */}
                        <motion.button
                            onClick={() => setShowMoodModal(true)}
                            whileHover={{ scale: 1.04, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-sage"
                        >
                            🌿 Mood Check-In
                        </motion.button>

                        {/* Happiness Ribbit */}
                        <HappinessRibbit onSpawnBubble={handleSpawnBubble} antiGravity={antiGravity} />
                    </motion.div>

                    {/* Main cards grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                        {/* Gratitude Pond */}
                        <GratitudePond
                            onGravityShift={handleGravityShift}
                            onNoteSubmit={handleNoteSubmit}
                            antiGravity={antiGravity}
                        />

                        {/* Frog tips card */}
                        <motion.div
                            className="pond-card physics-body"
                            data-label="tips-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                padding: '24px',
                                background: antiGravity ? 'rgba(26,46,26,0.8)' : undefined,
                                transition: 'background 0.8s ease',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '28px' }}>🐸</span>
                                <h3 className="font-pixel" style={{
                                    fontSize: 'clamp(8px, 1.5vw, 10px)',
                                    color: antiGravity ? 'var(--lily)' : 'var(--earth)',
                                    lineHeight: 1.6,
                                    transition: 'color 0.5s ease',
                                }}>
                                    Froggo's Pond Tips
                                </h3>
                            </div>

                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { icon: '✨', text: 'Click "Lift Your Spirits" to enter anti-gravity mode!' },
                                    { icon: '🌿', text: 'Type a gratitude note — watch the world get lighter!' },
                                    { icon: '🐸', text: 'Type "ribbit" on your keyboard for a surprise! 🎉' },
                                    { icon: '🌸', text: `Log gratitude 3 days in a row to earn Froggo an accessory!` },
                                    { icon: '💚', text: 'Drag and toss any floating element when in anti-gravity mode!' },
                                ].map((tip, i) => (
                                    <motion.li key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
                                    >
                                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{tip.icon}</span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: antiGravity ? 'var(--sage-light)' : 'var(--earth)',
                                            fontWeight: 600,
                                            lineHeight: 1.5,
                                            transition: 'color 0.5s ease',
                                        }}>
                                            {tip.text}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Frog image */}
                            <motion.img
                                src="/frogs/frog1.svg"
                                alt="angy frog"
                                animate={{ y: [0, -5, 0], rotate: [0, 1, -1, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                style={{
                                    width: '80px',
                                    borderRadius: '12px',
                                    marginTop: '20px',
                                    display: 'block',
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Anti-gravity hint */}
                    <AnimatePresence>
                        {antiGravity && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                style={{
                                    marginTop: '24px',
                                    textAlign: 'center',
                                    color: 'var(--sage-light)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                }}
                            >
                                🌌 Drag & toss the floating cards! Type "ribbit" for a surprise!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PhysicsWrapper>

            {/* Overlays (not in physics world) */}
            <FrogMascot accessoryLevel={streak.accessory_level} />

            {/* Toast notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 300,
                            background: 'var(--earth)',
                            color: 'var(--cream)',
                            borderRadius: '50px',
                            padding: '12px 24px',
                            fontWeight: 700,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                            whiteSpace: 'nowrap',
                            maxWidth: '90vw',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                    >
                        {notification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mood Modal */}
            <AnimatePresence>
                {showMoodModal && (
                    <MoodModal
                        onClose={() => setShowMoodModal(false)}
                        onMoodSelect={handleMoodSelect}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

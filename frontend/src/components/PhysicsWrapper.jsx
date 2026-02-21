import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

/**
 * PhysicsWrapper v2 — DOM-Sync Physics
 *
 * Instead of the Matter.js canvas renderer (which only draws colored rectangles),
 * this version runs the physics engine invisibly and syncs CSS transforms of real
 * DOM elements to their corresponding physics bodies every animation frame.
 *
 * Results: the actual styled React cards, buttons, and tokens float & collide.
 */
export default function PhysicsWrapper({ active, gravity = 0.5, children, physicsTokens = [] }) {
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const rafRef = useRef(null);
    const pairsRef = useRef([]);       // { body, el, w, h, origStyle }
    const tokenBodiesRef = useRef([]); // { body, token, w, h }
    const ribbitBufferRef = useRef('');
    const constraintRef = useRef(null);

    const [tokenPositions, setTokenPositions] = useState({});

    useEffect(() => {
        if (!active) return;

        const { Engine, Runner, World, Bodies, Body, Composite, Constraint, Query } = Matter;

        const engine = Engine.create();
        engine.gravity.y = gravity;
        engineRef.current = engine;

        const w = window.innerWidth, h = window.innerHeight;

        // Invisible boundary walls
        const walls = [
            Bodies.rectangle(w / 2, h + 25, w * 2, 50, { isStatic: true }),
            Bodies.rectangle(w / 2, -25, w * 2, 50, { isStatic: true }),
            Bodies.rectangle(-25, h / 2, 50, h * 2, { isStatic: true }),
            Bodies.rectangle(w + 25, h / 2, 50, h * 2, { isStatic: true }),
        ];
        World.add(engine.world, walls);

        // ── Grab .physics-body DOM elements ──────────────────────────────
        const elements = Array.from(document.querySelectorAll('.physics-body'));
        const pairs = [];

        elements.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const bw = Math.max(rect.width, 80);
            const bh = Math.max(rect.height, 40);
            const cx = rect.left + bw / 2;
            const cy = rect.top + bh / 2;

            const body = Bodies.rectangle(cx, cy, bw, bh, {
                restitution: 0.45,
                friction: 0.08,
                frictionAir: gravity <= 0.05 ? 0.022 : 0.012,
            });

            Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 7,
                y: gravity <= 0.05 ? (Math.random() - 0.5) * 5 : -Math.random() * 9,
            });
            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

            // Snapshot original styles, switch to fixed positioning
            const origStyle = {
                position: el.style.position,
                top: el.style.top,
                left: el.style.left,
                margin: el.style.margin,
                transform: el.style.transform,
                zIndex: el.style.zIndex,
                width: el.style.width,
                pointerEvents: el.style.pointerEvents,
            };

            el.style.position = 'fixed';
            el.style.top = '0px';
            el.style.left = '0px';
            el.style.margin = '0';
            el.style.width = `${bw}px`;
            el.style.zIndex = '60';
            el.style.pointerEvents = 'none';
            el.style.transformOrigin = 'center center';
            el.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            el.style.cursor = 'grab';

            World.add(engine.world, body);
            pairs.push({ body, el, w: bw, h: bh, origStyle });
        });

        pairsRef.current = pairs;

        // ── Token bodies (gratitude lily pads + speech bubbles) ───────────
        const tokenBodies = physicsTokens.map((token, i) => {
            const tw = token.type === 'lily' ? 210 : 250;
            const th = 58;
            const body = Bodies.rectangle(
                50 + Math.random() * (window.innerWidth - 300),
                50 + Math.random() * 200,
                tw, th,
                {
                    restitution: 0.55,
                    frictionAir: gravity <= 0.05 ? 0.025 : 0.012,
                    label: `token-${token.id || i}`,
                }
            );
            Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 4,
                y: gravity <= 0.05 ? (Math.random() - 0.5) * 3 : -Math.random() * 6,
            });
            World.add(engine.world, body);
            return { body, token, w: tw, h: th };
        });

        tokenBodiesRef.current = tokenBodies;

        // ── Mouse / touch drag ───────────────────────────────────────────
        let activeConstraint = null;

        const allDynamicBodies = () => [
            ...pairs.map(p => p.body),
            ...tokenBodies.map(t => t.body),
        ];

        const getEventPos = (e) => {
            const src = e.touches?.[0] ?? e;
            return { x: src.clientX, y: src.clientY };
        };

        const onPointerDown = (e) => {
            const mp = getEventPos(e);
            const hit = Query.point(allDynamicBodies(), mp);
            if (hit.length === 0) return;

            const hitBody = hit[0];
            activeConstraint = Constraint.create({
                pointA: { x: mp.x, y: mp.y },
                bodyB: hitBody,
                pointB: { x: mp.x - hitBody.position.x, y: mp.y - hitBody.position.y },
                stiffness: 0.12,
                length: 0,
            });
            World.add(engine.world, activeConstraint);
            constraintRef.current = activeConstraint;
            e.preventDefault();
        };

        const onPointerMove = (e) => {
            if (!activeConstraint) return;
            const mp = getEventPos(e);
            activeConstraint.pointA = { x: mp.x, y: mp.y };
        };

        const onPointerUp = () => {
            if (activeConstraint) {
                World.remove(engine.world, activeConstraint);
                activeConstraint = null;
                constraintRef.current = null;
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);
        document.addEventListener('touchstart', onPointerDown, { passive: false });
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('touchend', onPointerUp);

        // ── Ribbit Easter egg ────────────────────────────────────────────
        const onKeyDown = (e) => {
            ribbitBufferRef.current = (ribbitBufferRef.current + e.key.toLowerCase()).slice(-10);
            if (ribbitBufferRef.current.endsWith('ribbit')) {
                ribbitBufferRef.current = '';
                Composite.allBodies(engine.world).forEach(body => {
                    if (!body.isStatic) {
                        Body.applyForce(body, body.position, {
                            x: (Math.random() - 0.5) * 0.09,
                            y: -0.09 - Math.random() * 0.05,
                        });
                    }
                });
            }
        };
        window.addEventListener('keydown', onKeyDown);

        // ── RAF sync loop ────────────────────────────────────────────────
        const posCache = {};

        const syncLoop = () => {
            // Sync real DOM elements
            pairs.forEach(({ body, el, w, h }) => {
                const { x, y } = body.position;
                const a = body.angle;
                el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${a}rad)`;
            });

            // Sync token positions for React rendering
            let dirty = false;
            tokenBodies.forEach(({ body, token, w, h }) => {
                const key = String(token.id ?? token.text?.slice(0, 20) ?? Math.random());
                const { x, y } = body.position;
                const a = body.angle;
                const prev = posCache[key];
                if (!prev || Math.abs(prev.x - x) > 0.3 || Math.abs(prev.y - y) > 0.3) {
                    posCache[key] = { x: x - w / 2, y: y - h / 2, angle: a, key };
                    dirty = true;
                }
            });

            if (dirty) setTokenPositions({ ...posCache });

            rafRef.current = requestAnimationFrame(syncLoop);
        };

        const runner = Runner.create();
        Runner.run(runner, engine);
        runnerRef.current = runner;
        rafRef.current = requestAnimationFrame(syncLoop);

        // ── Resize: update walls ────────────────────────────────────────
        const onResize = () => {
            walls.forEach(wall => World.remove(engine.world, wall));
            const nw = window.innerWidth, nh = window.innerHeight;
            [
                Bodies.rectangle(nw / 2, nh + 25, nw * 2, 50, { isStatic: true }),
                Bodies.rectangle(nw / 2, -25, nw * 2, 50, { isStatic: true }),
                Bodies.rectangle(-25, nh / 2, 50, nh * 2, { isStatic: true }),
                Bodies.rectangle(nw + 25, nh / 2, 50, nh * 2, { isStatic: true }),
            ].forEach(w => World.add(engine.world, w));
        };
        window.addEventListener('resize', onResize);

        return () => {
            Runner.stop(runner);
            Engine.clear(engine);
            cancelAnimationFrame(rafRef.current);

            // Restore all DOM elements
            pairs.forEach(({ el, origStyle }) => {
                Object.entries(origStyle).forEach(([k, v]) => {
                    el.style[k] = v ?? '';
                });
                el.style.cursor = '';
                el.style.transformOrigin = '';
            });

            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('mousemove', onPointerMove);
            document.removeEventListener('mouseup', onPointerUp);
            document.removeEventListener('touchstart', onPointerDown);
            document.removeEventListener('touchmove', onPointerMove);
            document.removeEventListener('touchend', onPointerUp);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', onResize);

            setTokenPositions({});
        };
    }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

    // Live gravity updates
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.gravity.y = gravity;
        }
    }, [gravity]);

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
            {children}

            {/* Render tokens as real styled DOM elements positioned by physics */}
            {active && physicsTokens.map((token) => {
                const key = String(token.id ?? token.text?.slice(0, 20) ?? '');
                const pos = tokenPositions[key];
                if (!pos) return null;

                if (token.type === 'lily') {
                    return (
                        <div
                            key={key}
                            className="lily-token"
                            style={{
                                position: 'fixed',
                                left: 0, top: 0,
                                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.angle}rad)`,
                                transformOrigin: 'center center',
                                width: '210px',
                                background: 'linear-gradient(135deg, #7fc47a, #4A7C59)',
                                border: '2.5px solid #a8d5a2',
                                borderRadius: '50px',
                                padding: '11px 18px',
                                color: '#fff',
                                fontFamily: 'Nunito, sans-serif',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                lineHeight: 1.4,
                                zIndex: 70,
                                pointerEvents: 'all',
                                cursor: 'grab',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                userSelect: 'none',
                                boxShadow: '0 0 18px rgba(127,196,122,0.55), 0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        >
                            <span style={{ fontSize: '18px', flexShrink: 0 }}>🌿</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {token.text?.slice(0, 38)}{(token.text?.length ?? 0) > 38 ? '…' : ''}
                            </span>
                        </div>
                    );
                }

                // Speech bubble
                return (
                    <div
                        key={key}
                        style={{
                            position: 'fixed',
                            left: 0, top: 0,
                            transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.angle}rad)`,
                            transformOrigin: 'center center',
                            width: '250px',
                            background: '#F5F5DC',
                            border: '2.5px solid #87A96B',
                            borderRadius: '20px',
                            padding: '12px 16px',
                            color: '#6B4226',
                            fontFamily: 'Nunito, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            zIndex: 70,
                            pointerEvents: 'all',
                            cursor: 'grab',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            userSelect: 'none',
                            boxShadow: '0 6px 20px rgba(107,66,38,0.2)',
                        }}
                    >
                        <span style={{ fontSize: '22px', flexShrink: 0, lineHeight: 1 }}>🐸</span>
                        <span>{token.text}</span>
                    </div>
                );
            })}
        </div>
    );
}

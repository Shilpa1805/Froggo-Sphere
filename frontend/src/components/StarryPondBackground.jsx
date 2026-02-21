import { useEffect, useRef } from 'react';

// Generates a starry, animated pond background on a canvas
export default function StarryPondBackground({ active }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const starsRef = useRef([]);
    const lilyPadsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Generate stars
        starsRef.current = Array.from({ length: 120 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.3 + 0.05,
            opacity: Math.random() * 0.7 + 0.3,
            twinkle: Math.random() * Math.PI * 2,
        }));

        // Generate lily pads
        lilyPadsRef.current = Array.from({ length: 8 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 30 + 15,
            speed: Math.random() * 0.5 + 0.1,
            angle: Math.random() * Math.PI * 2,
            drift: Math.random() * 0.01,
        }));

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Deep pond gradient background
            const bg = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.8
            );
            bg.addColorStop(0, '#1f3a2a');
            bg.addColorStop(0.5, '#162a1a');
            bg.addColorStop(1, '#0d1a10');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Parallax offset from mouse
            const px = (mouseRef.current.x / canvas.width - 0.5) * 20;
            const py = (mouseRef.current.y / canvas.height - 0.5) * 15;

            // Stars
            starsRef.current.forEach(star => {
                star.twinkle += 0.02;
                const twinkledOpacity = star.opacity * (0.7 + 0.3 * Math.sin(star.twinkle));

                ctx.save();
                ctx.globalAlpha = twinkledOpacity;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(
                    star.x + px * star.speed,
                    star.y + py * star.speed - t * star.speed,
                    star.r, 0, Math.PI * 2
                );
                ctx.fill();
                ctx.restore();

                // Wrap stars
                if (star.y - t * star.speed < -5) {
                    star.y += canvas.height + 10;
                }
            });

            // Lily pads
            lilyPadsRef.current.forEach(pad => {
                pad.angle += pad.drift;
                const x = pad.x + Math.cos(pad.angle) * 15 + px * 0.5;
                const y = pad.y + Math.sin(pad.angle) * 8 + py * 0.3;

                ctx.save();
                ctx.globalAlpha = 0.3;
                // Lily pad shape
                const grad = ctx.createRadialGradient(x, y, 0, x, y, pad.size);
                grad.addColorStop(0, '#87A96B');
                grad.addColorStop(1, '#4A7C59');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, pad.size, 0, Math.PI * 2);
                ctx.fill();
                // Notch
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#0d1a10';
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, pad.size, -Math.PI / 6, Math.PI / 6);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            });

            // Reflection shimmer
            for (let i = 0; i < 5; i++) {
                const shimX = (Math.sin(t * 0.5 + i * 1.3) * 0.3 + 0.5) * canvas.width;
                const shimY = (Math.cos(t * 0.3 + i * 0.7) * 0.3 + 0.5) * canvas.height;
                const shimGrad = ctx.createRadialGradient(shimX, shimY, 0, shimX, shimY, 60);
                shimGrad.addColorStop(0, 'rgba(168, 213, 162, 0.06)');
                shimGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = shimGrad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            t += 0.008;
            animRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw', height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}

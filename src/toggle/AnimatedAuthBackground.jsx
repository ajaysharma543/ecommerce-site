import React, { useEffect, useRef } from 'react';

function AnimatedAuthBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = canvas.getContext('2d');
    let width, height, particles, animationId;

    const COLORS = ['rgba(251,191,36,', 'rgba(94,234,212,', 'rgba(255,255,255,'];

    const resize = () => {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const initParticles = () => {
      const count = Math.min(50, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (Math.random() * 1.4 + 0.4) * window.devicePixelRatio,
        speed: (Math.random() * 0.25 + 0.05) * window.devicePixelRatio,
        drift: (Math.random() - 0.5) * 0.15 * window.devicePixelRatio,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const twinkle = (Math.sin(t * p.twinkleSpeed + p.twinklePhase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${(p.alpha * twinkle).toFixed(3)})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };

    resize();
    initParticles();

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(draw);
    } else {
      draw(0); // paint a single static frame
    }

    const handleResize = () => { resize(); initParticles(); };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(30,41,59,0.6) 0%, #0B0F19 70%)',
        }}
      />

      {/* blueprint grid, slowly panning */}
      <div
        className="absolute inset-0 opacity-[0.07] animate-grid-pan"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* drifting glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-float-slow" />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl animate-float-slow"
        style={{ animationDelay: '2.5s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-indigo-500/5 blur-3xl animate-float-slow"
        style={{ animationDelay: '5s' }}
      />

      {/* vertical scan-line sweep */}
      <div
        className="absolute inset-x-0 top-0 h-40 animate-scan"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(251,191,36,0.08), transparent)',
        }}
      />

      {/* particle field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* edge vignette so content stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 40%, #0B0F19 100%)',
        }}
      />
    </div>
  );
}

export default AnimatedAuthBackground;
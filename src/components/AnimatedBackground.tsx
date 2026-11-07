import React, { useEffect, useRef } from 'react';
import { AnimatedBackgroundMode, AppTheme } from '../types/calculator';

interface AnimatedBackgroundProps {
  mode: AnimatedBackgroundMode;
  theme: AppTheme;
  isDark: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  char?: string;
  alpha: number;
}

const MATH_CHARS = ['π', '∑', '∫', '∞', '√', 'e', 'Δ', 'λ', 'θ', 'f(x)', 'α', 'φ', '≈', '≠', '±'];

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  mode,
  theme,
  isDark,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === 'off') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = width < 768 ? 32 : 64;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        char: Math.random() > 0.4 ? MATH_CHARS[Math.floor(Math.random() * MATH_CHARS.length)] : undefined,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Color palette based on theme
    const getColors = () => {
      switch (theme) {
        case 'aurora-cosmic':
          return { primary: '#06b6d4', secondary: '#10b981', tertiary: '#6366f1', glow: 'rgba(6, 182, 212, 0.15)' };
        case 'obsidian-gold':
          return { primary: '#eab308', secondary: '#f59e0b', tertiary: '#d97706', glow: 'rgba(234, 179, 8, 0.12)' };
        case 'synthwave-80s':
          return { primary: '#ec4899', secondary: '#06b6d4', tertiary: '#a855f7', glow: 'rgba(236, 72, 153, 0.18)' };
        case 'emerald-glass':
          return { primary: '#10b981', secondary: '#34d399', tertiary: '#059669', glow: 'rgba(16, 185, 129, 0.14)' };
        case 'cyberpunk':
          return { primary: '#facc15', secondary: '#06b6d4', tertiary: '#ec4899', glow: 'rgba(250, 204, 21, 0.15)' };
        case 'sakura':
          return { primary: '#f43f5e', secondary: '#fb7185', tertiary: '#f472b6', glow: 'rgba(244, 63, 94, 0.15)' };
        case 'paper-notebook':
          return { primary: '#3b82f6', secondary: '#94a3b8', tertiary: '#64748b', glow: 'rgba(59, 130, 246, 0.08)' };
        default:
          return isDark
            ? { primary: '#3b82f6', secondary: '#60a5fa', tertiary: '#818cf8', glow: 'rgba(59, 130, 246, 0.12)' }
            : { primary: '#2563eb', secondary: '#3b82f6', tertiary: '#93c5fd', glow: 'rgba(37, 99, 235, 0.08)' };
      }
    };

    let tick = 0;

    const render = () => {
      tick += 0.012;
      const colors = getColors();

      ctx.clearRect(0, 0, width, height);

      if (mode === 'aurora') {
        // Organic aurora glowing orbs
        const grad1 = ctx.createRadialGradient(
          width * 0.25 + Math.sin(tick * 0.7) * 80,
          height * 0.3 + Math.cos(tick * 0.5) * 60,
          20,
          width * 0.25,
          height * 0.3,
          width * 0.55
        );
        grad1.addColorStop(0, colors.glow);
        grad1.addColorStop(1, 'transparent');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        const grad2 = ctx.createRadialGradient(
          width * 0.75 + Math.cos(tick * 0.6) * 90,
          height * 0.7 + Math.sin(tick * 0.8) * 70,
          30,
          width * 0.75,
          height * 0.7,
          width * 0.6
        );
        grad2.addColorStop(0, colors.glow);
        grad2.addColorStop(1, 'transparent');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
      }

      if (mode === 'waves') {
        // Smooth sine wave ripples
        ctx.lineWidth = 1.5;
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.strokeStyle = colors.primary;
          ctx.globalAlpha = 0.08 + j * 0.03;
          for (let x = 0; x <= width; x += 15) {
            const y = height * (0.35 + j * 0.18) + Math.sin(x * 0.004 + tick + j * 1.5) * 35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Render math particles and connective network
      if (mode === 'particles' || mode === 'aurora' || mode === 'matrix') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Connective lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = width < 768 ? 85 : 120;

            if (dist < maxDist) {
              ctx.beginPath();
              ctx.strokeStyle = colors.primary;
              ctx.globalAlpha = (1 - dist / maxDist) * (isDark ? 0.14 : 0.08);
              ctx.lineWidth = 0.8;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Draw particle or glyph
          ctx.globalAlpha = isDark ? p.alpha * 0.6 : p.alpha * 0.35;
          if (p.char) {
            ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
            ctx.fillStyle = colors.secondary;
            ctx.fillText(p.char, p.x, p.y);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors.primary;
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, theme, isDark]);

  if (mode === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: 0.95 }}
      />
    </div>
  );
};

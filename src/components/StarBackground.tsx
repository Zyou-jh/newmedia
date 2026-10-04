import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  hue: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

/**
 * 全屏星空粒子背景：闪烁的星星 + 偶发流星。
 * fixed 定位、pointer-events-none，可叠在任意页面底层。
 */
export default function StarBackground({
  density = 1,
  className = '',
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    const shooting: ShootingStar[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 提高密度（除数越小星星越多）
      const count = Math.floor(
        ((window.innerWidth * window.innerHeight) / 2600) * density
      );
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        // 星星半径
        r: Math.random() * 1.7 + 0.4,
        baseAlpha: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.75 ? 265 : Math.random() > 0.5 ? 190 : 0,
      }));
    }

    let lastShoot = 0;

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const s of stars) {
        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        if (s.hue === 190) ctx.fillStyle = `rgba(125,211,252,${alpha})`;
        else if (s.hue === 265) ctx.fillStyle = `rgba(196,181,253,${alpha})`;
        else ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      // 偶发流星（间隔更短、触发概率更高）
      if (t - lastShoot > 2200 && Math.random() > 0.98) {
        lastShoot = t;
        shooting.push({
          x: Math.random() * window.innerWidth * 0.7,
          y: Math.random() * window.innerHeight * 0.4,
          vx: 6 + Math.random() * 3,
          vy: 3 + Math.random() * 2,
          life: 1,
        });
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const m = shooting[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.012;
        if (m.life <= 0) {
          shooting.splice(i, 1);
          continue;
        }
        const grad = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x - m.vx * 12,
          m.y - m.vy * 12
        );
        grad.addColorStop(0, `rgba(190,227,255,${m.life})`);
        grad.addColorStop(1, 'rgba(190,227,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
    />
  );
}

import { useEffect, useRef } from 'react';
import { introConfig } from './introConfig';

function makeGlow() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, 'rgba(255,255,255,0.95)');
  glow.addColorStop(0.22, 'rgba(34,211,238,0.8)');
  glow.addColorStop(0.55, 'rgba(59,130,246,0.28)');
  glow.addColorStop(1, 'rgba(34,211,238,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 32, 32);
  return canvas;
}

/**
 * Falling water that later bends into the portrait.
 * `modeRef` is 'fall' | 'merge' | 'ambient'. The loop pauses while the tab is hidden.
 */
export function WaterfallCanvas({ modeRef, targetRef, runId, enabled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: true });
    const sprite = makeGlow();
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const count = mobile ? introConfig.particles.mobile : introConfig.particles.desktop;
    const streams = mobile ? 6 : 12;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let particles = [];
    let mist = [];

    function spawn(index) {
      const stream = index % streams;
      const layer = 0.55 + (index % 3) * 0.25;
      return {
        x: ((stream + 0.5) / streams) * width + (Math.random() - 0.5) * 14,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (3.1 + Math.random() * 4.2) * layer,
        size: (3.1 + Math.random() * 3.4) * layer,
        alpha: 0.62 + Math.random() * 0.38,
        layer,
        seed: Math.random() * Math.PI * 2,
      };
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function aim() {
      const node = targetRef.current;
      if (!node) return { x: width * 0.72, y: height * 0.46 };
      const photo = node.getBoundingClientRect();
      const host = canvas.getBoundingClientRect();
      return {
        x: photo.left - host.left + photo.width / 2,
        y: photo.top - host.top + photo.height / 2,
      };
    }

    function tick(now) {
      if (!running) return;
      if (document.hidden) {
        frame = 0;
        return;
      }
      const mode = modeRef.current;
      const point = aim();
      const visible = mode === 'ambient' ? particles.slice(0, mobile ? 16 : 32) : particles;
      context.clearRect(0, 0, width, height);

      for (const particle of visible) {
        if (mode === 'fall') {
          particle.vx += Math.sin(now * 0.0012 + particle.seed) * 0.012;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.985;
          if (particle.y > height - 6) {
            if (mist.length < 36) {
              mist.push({ x: particle.x, y: height - 4, a: 0.45, vy: -0.8 - Math.random() * 0.8 });
            }
            particle.y = -12;
            particle.x += (Math.random() - 0.5) * 18;
          }
        } else if (mode === 'merge') {
          const dx = point.x - particle.x;
          const dy = point.y - particle.y;
          particle.vx = particle.vx * 0.84 + dx * 0.02;
          particle.vy = particle.vy * 0.84 + dy * 0.022;
          particle.x += particle.vx;
          particle.y += particle.vy;
          const dist = Math.hypot(dx, dy);
          if (dist < 34) particle.alpha *= 0.9;
          if (particle.alpha < 0.08) Object.assign(particle, spawn(Math.floor(Math.random() * count)), { y: -20, alpha: 0.7 });
        } else {
          particle.x += Math.sin(now * 0.0007 + particle.seed) * 0.22;
          particle.y += 0.28 * particle.layer;
          particle.alpha = 0.1 + (Math.sin(now * 0.002 + particle.seed) + 1) * 0.07;
          if (particle.y > height + 10) {
            particle.y = -10;
            particle.x = Math.random() * width;
          }
        }

        const size = particle.size * 6;
        context.globalAlpha = particle.alpha * 0.5;
        context.drawImage(sprite, particle.x - size * 0.45, particle.y - particle.vy * 3.4, size * 0.9, Math.max(size * 2.8, 18));
        context.globalAlpha = particle.alpha;
        context.drawImage(sprite, particle.x - size / 2, particle.y - size / 2, size, size);
      }

      mist = mist.filter((drop) => drop.a > 0.03);
      for (const drop of mist) {
        drop.y += drop.vy;
        drop.a *= 0.96;
        context.globalAlpha = drop.a;
        context.drawImage(sprite, drop.x - 10, drop.y - 10, 20, 20);
      }
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(tick);
    }

    function onVisible() {
      if (!document.hidden && running && !frame) frame = window.requestAnimationFrame(tick);
    }

    resize();
    particles = Array.from({ length: count }, (_, index) => spawn(index));
    frame = window.requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, modeRef, runId, targetRef]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

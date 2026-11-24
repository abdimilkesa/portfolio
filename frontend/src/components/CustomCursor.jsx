import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

function kindFrom(target) {
  if (!(target instanceof Element)) return 'default';
  if (target.closest('input, textarea, select, [contenteditable="true"]')) return 'field';
  if (target.closest('[data-cursor="project"]')) return 'project';
  if (target.closest('img')) return 'image';
  if (target.closest('button, [role="button"], .btn')) return 'button';
  if (target.closest('a')) return 'link';
  return 'default';
}

export function CustomCursor() {
  const reduce = useReducedMotion();
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const root = document.documentElement;
    let frame = 0;
    let scrollTimer = 0;
    let x = 0;
    let y = 0;
    let ringX = 0;
    let ringY = 0;
    let moved = false;
    let active = false;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return undefined;

    function allowed() {
      return media.matches && !reduce && window.innerWidth >= 900;
    }

    function setEnabled(on) {
      active = on;
      root.classList.toggle('has-cursor', on);
      if (!on) {
        ring.dataset.ready = 'false';
        dot.dataset.ready = 'false';
      }
    }

    function paintKind(target) {
      const kind = kindFrom(target);
      ring.dataset.kind = kind === 'field' ? 'default' : kind;
      const hidden = kind === 'field';
      ring.dataset.ready = hidden ? 'false' : 'true';
      dot.dataset.ready = hidden ? 'false' : 'true';
    }

    function onMove(event) {
      if (!active) return;
      x = event.clientX;
      y = event.clientY;
      if (!moved) {
        ringX = x;
        ringY = y;
        moved = true;
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      paintKind(event.target);
    }

    function loop() {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = window.requestAnimationFrame(loop);
    }

    function startLoop() {
      if (frame) return;
      frame = window.requestAnimationFrame(loop);
    }

    function stopLoop() {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function onDown() {
      ring.dataset.down = 'true';
      dot.dataset.down = 'true';
    }

    function onUp() {
      ring.dataset.down = 'false';
      dot.dataset.down = 'false';
    }

    function onLeave() {
      ring.dataset.ready = 'false';
      dot.dataset.ready = 'false';
    }

    function onScroll() {
      if (!active) return;
      ring.dataset.scrolling = 'true';
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        ring.dataset.scrolling = 'false';
      }, 160);
      paintKind(document.elementFromPoint(x, y));
    }

    function sync() {
      const on = allowed();
      setEnabled(on);
      if (on) startLoop();
      else stopLoop();
    }

    sync();
    media.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(scrollTimer);
      media.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll, true);
      root.classList.remove('has-cursor');
    };
  }, [reduce]);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" data-kind="default" data-ready="false" aria-hidden="true">
        <span className="cursor-ring-shape" />
        <span className="cursor-label">VIEW</span>
      </div>
      <div ref={dotRef} className="cursor-dot" data-ready="false" aria-hidden="true">
        <span className="cursor-dot-shape" />
      </div>
    </>
  );
}

import { useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/** Button follows the pointer a little, then springs back. */
export function Magnetic({ children, className = '', strength = 0.22 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20 });
  const springY = useSpring(y, { stiffness: 260, damping: 20 });

  if (reduce) return <div className={`inline-block ${className}`}>{children}</div>;

  function move(event) {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    x.set((event.clientX - (box.left + box.width / 2)) * strength);
    y.set((event.clientY - (box.top + box.height / 2)) * strength);
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={move}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Card tilts toward the pointer and shows a soft light under it. */
export function TiltCard({ children, className = '' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 22 });
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false });

  if (reduce) return <div className={className}>{children}</div>;

  function move(event) {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    setSpot({ x, y, on: true });
    rotateX.set(((y - box.height / 2) / (box.height / 2)) * -4.5);
    rotateY.set(((x - box.width / 2) / (box.width / 2)) * 4.5);
  }

  return (
    <motion.div className={className} style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={() => {
          setSpot((current) => ({ ...current, on: false }));
          rotateX.set(0);
          rotateY.set(0);
        }}
        style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-[1.5rem] transition-opacity duration-300"
          style={{
            opacity: spot.on ? 1 : 0,
            background: `radial-gradient(420px circle at ${spot.x}px ${spot.y}px, rgba(16,185,129,0.22), transparent 70%)`,
          }}
        />
        {children}
      </motion.div>
    </motion.div>
  );
}

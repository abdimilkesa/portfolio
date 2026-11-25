import { motion } from 'framer-motion';

const origins = [
  { x: -140, y: 18 },
  { x: 150, y: -16 },
  { x: 6, y: 96 },
  { x: -8, y: -88 },
];

function Letter({ char, index, step, startDelay }) {
  if (char === ' ') return <span className="inline-block w-[0.35em]">&nbsp;</span>;
  const from = origins[index % origins.length];
  const wave = Math.sin(index * 0.85) * 34;
  const delay = startDelay + index * step;
  return (
    <motion.span
      className="inline-block will-change-transform"
      initial={{ x: from.x, y: from.y, opacity: 0, rotate: index % 2 ? 14 : -14, filter: 'blur(8px)' }}
      animate={{ x: [from.x, wave, 0], y: [from.y, wave * 0.55, 0], opacity: 1, rotate: 0, filter: 'blur(0px)' }}
      transition={{ delay, duration: 1.05, ease: [0.16, 1, 0.3, 1], times: [0, 0.55, 1] }}
    >
      <motion.span
        className="inline-block"
        animate={{ y: [0, -3.5, 0, 2.5, 0] }}
        transition={{ delay: delay + 1.05, duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {char}
      </motion.span>
    </motion.span>
  );
}

/** Real text in the DOM. Letters travel on a wave, then keep a quiet ripple. */
export function WavyText({ text, startDelay = 0, className = '' }) {
  const step = text.length > 18 ? 0.02 : 0.05;
  return (
    <span className={className} role="text" aria-label={text}>
      {Array.from(text).map((char, index) => (
        <Letter key={`${text}-${index}`} char={char} index={index} step={step} startDelay={startDelay} />
      ))}
    </span>
  );
}

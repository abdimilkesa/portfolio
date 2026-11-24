import { motion, useReducedMotion } from 'framer-motion';
import { Typewriter } from '../Typewriter';
import { useProfile } from '../../hooks/usePortfolio';

const roles = [
  'AI Engineer',
  'Full-Stack Developer',
  'Software Engineer',
  'AI Enthusiast',
  'Problem Solver',
  'Technology Innovator',
];

export function Hero() {
  const { content: profile } = useProfile();
  const reduce = useReducedMotion();
  const portrait = profile?.profileImage;
  const name = profile?.name || 'Abdi Milki';

  return (
    <section id="home" className="relative isolate overflow-hidden bg-ink">
      <div className="bg-grid fade-radial pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-[#60A5FA]/25 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute right-[-3rem] bottom-0 h-80 w-80 rounded-full bg-[#2563EB]/10 blur-3xl animate-drift-reverse" />
      <div className="pointer-events-none absolute top-28 right-[14%] hidden h-16 w-16 rounded-2xl border border-accent/40 bg-elevated/80 animate-float lg:block" />
      <div className="pointer-events-none absolute bottom-28 left-[8%] hidden h-10 w-10 rounded-full border border-[#93C5FD] animate-float-slow lg:block" />

      <div className="container-page grid min-h-[calc(100dvh-4rem)] items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="eyebrow text-accent-strong">Hello, I'm</p>
          <h1 className="font-display mt-4 text-5xl font-semibold tracking-tight text-navy sm:text-7xl">{name}.</h1>
          <p className="font-display mt-6 text-2xl text-fg sm:text-3xl">I'm a passionate</p>
          <p className="font-display mt-1 text-[clamp(1.7rem,7vw,3.15rem)] leading-tight font-semibold">
            <Typewriter words={roles} />
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            I'm a Software Engineering student at Jimma University, passionate about building intelligent systems, developing modern applications, and using technology to solve real-world problems.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="btn btn-primary" href="#projects">
              Explore My Projects
            </a>
            <a className="btn btn-ghost" href="#contact">
              Let's Connect
            </a>
          </div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-md"
          animate={reduce ? undefined : { y: [0, -12, 0] }}
          transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-8 rounded-full bg-[#60A5FA]/30 blur-3xl" />
          <div className="relative aspect-square overflow-hidden rounded-full border-[6px] border-surface bg-elevated shadow-[0_24px_60px_-24px_rgba(37,99,235,0.55)] ring-8 ring-elevated">
            {portrait ? (
              <img src={portrait} alt={`Portrait of ${name}`} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center">
                <p className="font-display text-6xl font-semibold tracking-[0.12em] text-gradient">AM</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

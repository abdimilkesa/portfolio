import { ArrowDown, Download } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useProfile } from '../../hooks/usePortfolio';

const chips = ['JavaScript', 'Python', 'React', 'AI'];

export function Hero() {
  const { content: profile } = useProfile();
  const reduce = useReducedMotion();
  const portrait = profile?.profileImage;

  return (
    <section id="home" className="relative isolate overflow-hidden">
      <div className="bg-grid fade-radial pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-24 left-[10%] h-72 w-72 rounded-full bg-accent-strong/20 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute right-[-4rem] bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-drift-reverse" />

      <div className="container-page grid min-h-[calc(100dvh-4rem)] items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <motion.p
            className="eyebrow text-accent"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Hello, I'm Abdi Milki
          </motion.p>
          <motion.h1
            className="font-display mt-5 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05 }}
          >
            Building <span className="text-gradient">Intelligent</span> Digital Experiences.
          </motion.h1>
          <p className="mt-6 max-w-xl text-lg text-white/90">{profile?.title}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{profile?.summary}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="btn btn-primary" href="#projects">
              Explore My Work
            </a>
            <a className="btn btn-accent" href="#contact">
              Let's Connect
            </a>
            {profile?.cvUrl ? (
              <a className="btn btn-ghost" href={profile.cvUrl}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download My CV
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="panel spotlight relative overflow-hidden rounded-[2rem] p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-ink-deep">
              {portrait ? (
                <img src={portrait} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover" />
              ) : (
                <div className="relative grid h-full place-items-center">
                  <div className="absolute inset-8 rounded-full border border-white/10 animate-orbit" />
                  <div className="absolute inset-16 rounded-full border border-accent/30 animate-orbit-reverse" />
                  <div className="bg-dots absolute inset-0 opacity-40" />
                  <div className="text-center">
                    <p className="font-display text-6xl font-semibold tracking-[0.14em] text-gradient">AM</p>
                    <p className="mt-3 text-sm text-muted">Portrait placeholder</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ul className="pointer-events-none absolute inset-x-0 -bottom-4 flex justify-center gap-2">
            {chips.map((chip, index) => (
              <li
                key={chip}
                className="tag animate-float bg-card/80 backdrop-blur"
                style={{ animationDelay: `${index * 0.4}s` }}
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a href="#about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-subtle lg:block">
        <span className="sr-only">Scroll to about</span>
        <ArrowDown className="h-5 w-5 animate-scroll-cue" aria-hidden="true" />
      </a>
    </section>
  );
}

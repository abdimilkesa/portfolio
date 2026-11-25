import { Brain, GraduationCap, Layers, Target } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '../Reveal';
import { useProfile } from '../../hooks/usePortfolio';

const cards = [
  { icon: GraduationCap, label: 'Education', value: 'Jimma University' },
  { icon: Brain, label: 'Main Interest', value: 'Artificial Intelligence' },
  { icon: Layers, label: 'Development', value: 'Full-Stack Applications' },
  { icon: Target, label: 'Career Goal', value: 'AI Engineer' },
];

export function About() {
  const reduce = useReducedMotion();
  const { content: profile } = useProfile();
  const university = profile?.university || 'Jimma University';

  return (
    <section id="about" className="bg-ink-deep py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow text-accent-strong">About</p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">About Me</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">Turning ideas into intelligent solutions.</p>
        </Reveal>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-7">
            <p>
              I'm {profile?.name || 'Abdi Milki'}, a Software Engineering student at {university} with a strong interest in Artificial Intelligence, full-stack development, and innovative technology.
            </p>
            <p>
              I enjoy exploring new technologies, building practical applications, and developing solutions that can make a meaningful difference.
            </p>
            <p>
              My long-term ambition is to become an AI Engineer and contribute to creating intelligent systems that address real-world challenges.
            </p>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5">
            {cards.map((card, index) => (
              <Reveal key={card.label} delay={index * 0.05}>
                <motion.article whileHover={reduce ? undefined : { y: -4 }} className="panel h-full rounded-3xl p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-elevated text-accent-strong">
                    <card.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm text-subtle">{card.label}</h3>
                  <p className="mt-1 text-base font-medium text-navy">
                    {card.label === 'Education' ? university : card.value}
                  </p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

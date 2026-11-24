import { Compass, GraduationCap, MapPin, Target } from 'lucide-react';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { useProfile } from '../../hooks/usePortfolio';

export function About() {
  const { content: profile } = useProfile();
  const cards = [
    { icon: GraduationCap, label: 'Education', value: `${profile?.education || 'Software Engineering'} · ${profile?.university || 'Jimma University'}` },
    { icon: Compass, label: 'Current focus', value: profile?.currentFocus },
    { icon: Target, label: 'Career goal', value: profile?.careerGoal },
    { icon: MapPin, label: 'Location', value: profile?.location || 'Ethiopia' },
  ];

  return (
    <section id="about" className="container-page py-24 sm:py-32">
      <Reveal>
        <SectionHeading index="01" eyebrow="About" title="Beyond the Code." />
      </Reveal>
      <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="text-lg leading-relaxed text-muted">{profile?.biography}</p>
          <blockquote className="font-display mt-8 border-l-2 border-accent pl-5 text-2xl leading-snug text-white">
            {profile?.mission}
          </blockquote>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {cards.map((card, index) => (
            <Reveal key={card.label} delay={index * 0.05}>
              <article className="panel rounded-3xl p-5">
                <card.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-sm text-subtle">{card.label}</h3>
                <p className="mt-1 text-base text-white">{card.value}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

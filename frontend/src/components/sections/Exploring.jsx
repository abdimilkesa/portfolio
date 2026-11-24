import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { useProfile } from '../../hooks/usePortfolio';

export function Exploring() {
  const { content: profile } = useProfile();
  const interests = profile?.interests || [];

  return (
    <section id="exploring" className="border-y border-line bg-ink-deep py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="04" eyebrow="Exploring" title="Always Learning. Always Building." />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest, index) => (
            <Reveal key={interest.title} delay={index * 0.04}>
              <article className="panel h-full rounded-3xl p-6">
                <p className="font-display text-sm text-accent">0{index + 1}</p>
                <h3 className="font-display mt-6 text-2xl">{interest.title}</h3>
                <p className="mt-3 text-muted">{interest.summary}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

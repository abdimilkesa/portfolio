import { Reveal } from '../Reveal';
import { useExperience, useProfile } from '../../hooks/usePortfolio';
import { EXPERIENCE_LABEL, experiencePeriod } from '../../lib/labels';

export function Experience() {
  const { content: entries } = useExperience();
  const { content: profile } = useProfile();
  const interests = profile?.interests || [];

  return (
    <section id="experience" className="bg-ink py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow text-accent-strong">Experience</p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">Experience & Learning</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Software Engineering studies at Jimma University, alongside full-stack practice, AI interests, and personal project work. Only recorded entries appear on the timeline.
          </p>
        </Reveal>

        <ol className="relative mt-12 space-y-6 border-l border-accent/30 pl-8">
          {entries.map((entry, index) => (
            <Reveal key={entry._id || `${entry.organization}-${entry.title}`} delay={index * 0.05}>
              <li className="panel relative rounded-3xl p-6">
                <span className="absolute top-8 -left-[2.4rem] h-3.5 w-3.5 rounded-full border-2 border-surface bg-accent-strong shadow-[0_0_0_4px_var(--color-elevated)]" />
                <p className="text-sm font-medium text-accent-strong">{EXPERIENCE_LABEL[entry.type] || entry.type}</p>
                <p className="mt-1 text-sm text-subtle">{experiencePeriod(entry)}</p>
                <h3 className="font-display mt-3 text-2xl text-navy">{entry.title}</h3>
                <p className="mt-1 text-muted">{entry.organization}</p>
                {entry.description ? <p className="mt-3 max-w-2xl text-muted">{entry.description}</p> : null}
              </li>
            </Reveal>
          ))}
        </ol>

        {interests.length ? (
          <div className="mt-14">
            <Reveal>
              <h3 className="font-display text-2xl text-navy">What I'm exploring</h3>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interests.map((interest, index) => (
                <Reveal key={interest.title} delay={index * 0.04}>
                  <article className="panel h-full rounded-3xl p-6">
                    <p className="text-sm font-medium text-accent-strong">0{index + 1}</p>
                    <h4 className="font-display mt-4 text-xl text-navy">{interest.title}</h4>
                    <p className="mt-3 text-muted">{interest.summary}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

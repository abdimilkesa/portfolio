import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { useExperience } from '../../hooks/usePortfolio';
import { EXPERIENCE_LABEL, experiencePeriod } from '../../lib/labels';

export function Experience() {
  const { content: entries } = useExperience();

  return (
    <section id="experience" className="container-page py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          index="05"
          eyebrow="Experience"
          title="The path so far."
          text="Education is listed as it stands. Hackathons, collaborations, competitions, workshops, and certifications appear here only after they are added."
        />
      </Reveal>
      <ol className="mt-12 space-y-4">
        {entries.map((entry, index) => (
          <Reveal key={entry._id || `${entry.organization}-${entry.title}`} delay={index * 0.04}>
            <li className="panel grid gap-4 rounded-3xl p-6 md:grid-cols-[180px_1fr]">
              <div>
                <p className="text-sm text-accent">{EXPERIENCE_LABEL[entry.type] || entry.type}</p>
                <p className="mt-2 text-sm text-subtle">{experiencePeriod(entry)}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl">{entry.title}</h3>
                <p className="mt-1 text-muted">{entry.organization}</p>
                {entry.description ? <p className="mt-3 max-w-2xl text-muted">{entry.description}</p> : null}
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

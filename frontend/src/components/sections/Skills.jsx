import { Reveal } from '../Reveal';
import { TechIcon } from '../TechIcon';
import { useSkills } from '../../hooks/usePortfolio';
import { SKILL_CATEGORIES } from '../../lib/labels';

export function Skills() {
  const { content: skills } = useSkills();
  const known = new Set(skills.map((skill) => skill.category));
  const categories = [
    ...SKILL_CATEGORIES.filter((category) => known.has(category)),
    ...[...known].filter((category) => !SKILL_CATEGORIES.includes(category)),
  ];

  return (
    <section id="skills" className="bg-ink py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow text-accent-strong">Skills</p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">Technical Skills</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            The languages, frameworks, and areas currently in the profile. Nothing here is scored as a percentage.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category} delay={index * 0.04}>
              <article className="panel h-full rounded-3xl p-5">
                <h3 className="font-display text-lg text-navy">{category}</h3>
                <ul className="mt-4 grid grid-cols-1 gap-2">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => (
                      <li
                        key={skill._id || skill.name}
                        className="flex items-center gap-3 rounded-2xl border border-transparent px-2 py-2 transition hover:border-line hover:bg-elevated"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-elevated text-accent-strong">
                          <TechIcon name={skill.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-fg">{skill.name}</span>
                      </li>
                    ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

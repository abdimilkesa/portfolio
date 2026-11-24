import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
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
    <section id="skills" className="border-y border-line bg-surface/40 py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Skills"
            title="Tools I work with."
            text="A working set, kept editable from the admin dashboard. No proficiency scores — the list is the list."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category} delay={index * 0.04}>
              <article className="panel h-full rounded-3xl p-5">
                <h3 className="font-display text-lg">{category}</h3>
                <ul className="mt-4 space-y-2">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => (
                      <li key={skill._id || skill.name} className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-white/[0.03]">
                        <span className="grid h-9 w-9 place-items-center rounded-xl border border-line text-accent">
                          <TechIcon name={skill.icon} className="h-4 w-4" />
                        </span>
                        <span>{skill.name}</span>
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

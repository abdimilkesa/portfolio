import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { ProjectArt } from '../ProjectArt';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { useProjects } from '../../hooks/usePortfolio';
import { PROJECT_CATEGORIES, STATUS_LABEL } from '../../lib/labels';

export function Projects() {
  const { content: projects } = useProjects();
  const [category, setCategory] = useState('All');
  const present = [...new Set(projects.map((project) => project.category))];
  const categories = ['All', ...PROJECT_CATEGORIES.filter((item) => present.includes(item)), ...present.filter((item) => !PROJECT_CATEGORIES.includes(item))];
  const visible = projects.filter((project) => category === 'All' || project.category === category);

  return (
    <section id="projects" className="container-page py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Things I've Built."
          text="Turning ideas into functional digital experiences."
        />
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            className={`btn ${category === item ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {visible.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.04}>
            <article className="panel spotlight group flex h-full flex-col overflow-hidden rounded-[1.7rem]">
              <Link to={`/projects/${project.slug}`} className="block">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt="" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <ProjectArt category={project.category} title={project.title} />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tag">{project.category}</span>
                  <span className="tag">{STATUS_LABEL[project.status] || project.status}</span>
                  {project.featured ? <span className="tag text-accent">Featured</span> : null}
                </div>
                <h3 className="font-display mt-4 text-2xl">
                  <Link to={`/projects/${project.slug}`} className="hover:text-accent-soft">
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-muted">{project.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <li key={tech} className="tag">
                      {project.status === 'planned' ? `Focus: ${tech}` : tech}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link className="btn btn-ghost" to={`/projects/${project.slug}`}>
                    View project <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {project.githubUrl ? (
                    <a className="btn btn-ghost" href={project.githubUrl} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                  {project.liveDemoUrl ? (
                    <a className="btn btn-primary" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
                      Live Demo
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {visible.length === 0 ? <p className="mt-8 text-muted">No projects in this category yet.</p> : null}
    </section>
  );
}

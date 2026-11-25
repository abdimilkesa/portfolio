import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ProjectArt } from '../ProjectArt';
import { Reveal } from '../Reveal';
import { TiltCard } from '../motion/Kinetic';
import { useProjects } from '../../hooks/usePortfolio';
import { PROJECT_CATEGORIES, STATUS_LABEL } from '../../lib/labels';

function ProjectCard({ project, featured = false }) {
  return (
    <TiltCard className={featured ? 'md:col-span-2' : ''}>
      <article data-cursor="project" className={`panel group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] ${featured ? 'lg:grid lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
      <Link to={`/projects/${project.slug}`} className="block overflow-hidden">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt="" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <ProjectArt category={project.category} title={project.title} />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag">{project.category}</span>
          <span className="tag">{STATUS_LABEL[project.status] || project.status}</span>
          {project.featured ? <span className="tag border-line bg-elevated text-accent-strong">Featured</span> : null}
        </div>
        <h3 className="font-display mt-4 text-2xl text-navy">
          <Link to={`/projects/${project.slug}`} className="hover:text-accent-strong">
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
            View Project <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
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
    </TiltCard>
  );
}

export function Projects() {
  const { content: projects } = useProjects();
  const [category, setCategory] = useState('All');
  const present = [...new Set(projects.map((project) => project.category))];
  const categories = ['All', ...PROJECT_CATEGORIES.filter((item) => present.includes(item)), ...present.filter((item) => !PROJECT_CATEGORIES.includes(item))];
  const visible = projects.filter((project) => category === 'All' || project.category === category);
  const featured = visible.find((project) => project.featured);
  const rest = featured ? visible.filter((project) => project !== featured) : visible;

  return (
    <section id="projects" className="bg-ink-deep py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow text-accent-strong">Projects</p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">Featured Projects</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">Some things I've been building.</p>
        </Reveal>

        <div className="mt-8 inline-flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-slate-950/80 p-1.5" role="group" aria-label="Filter projects">
          {categories.map((item) => {
            const selected = category === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                className={`relative rounded-xl px-3.5 py-2 text-xs font-bold ${selected ? 'text-slate-950' : 'text-slate-300 hover:text-white'}`}
                onClick={() => setCategory(item)}
              >
                {selected ? (
                  <motion.span
                    layoutId="projectFilterPill"
                    className="absolute inset-0 rounded-xl bg-emerald-400"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                  />
                ) : null}
                <span className="relative z-10">{item}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {featured ? (
            <Reveal className="md:col-span-2">
              <ProjectCard project={featured} featured />
            </Reveal>
          ) : null}
          {rest.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.05}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        {visible.length === 0 ? <p className="mt-8 text-muted">No projects in this category yet.</p> : null}
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ProjectArt } from '../components/ProjectArt';
import { projectBySlug, useProjects } from '../hooks/usePortfolio';
import { STATUS_LABEL } from '../lib/labels';

export function ProjectPage() {
  const { slug } = useParams();
  const { content: projects, isSuccess, isError } = useProjects();
  const project = projectBySlug(projects, slug);

  useEffect(() => {
    const previous = document.title;
    document.title = project ? `${project.title} | Abdi Milki` : 'Project | Abdi Milki';
    return () => {
      document.title = previous;
    };
  }, [project]);

  if (!project && (isSuccess || isError)) {
    return (
      <div className="container-page py-28">
        <p className="eyebrow text-accent">Project</p>
        <h1 className="font-display mt-4 text-4xl">That project is not on the site.</h1>
        <Link className="btn btn-primary mt-8" to="/#projects">
          Back to projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return <p className="container-page py-28 text-muted">Loading project…</p>;
  }

  const techLabel = project.status === 'planned' ? 'Planned focus' : 'Technologies';

  return (
    <article className="container-page py-16 sm:py-20">
      <Link className="text-sm text-muted hover:text-white" to="/#projects">
        ← All projects
      </Link>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="tag">{project.category}</span>
        <span className="tag">{STATUS_LABEL[project.status] || project.status}</span>
        {project.featured ? <span className="tag text-accent">Featured</span> : null}
      </div>
      <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">{project.description}</p>
      <div className="panel mt-10 overflow-hidden rounded-[1.7rem]">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt="" className="aspect-[16/8] w-full object-cover" />
        ) : (
          <ProjectArt category={project.category} title={project.title} />
        )}
      </div>
      {project.detailedDescription ? (
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">{project.detailedDescription}</p>
      ) : null}
      {project.technologies?.length ? (
        <div className="mt-8">
          <h2 className="text-sm text-subtle">{techLabel}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-2">
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
        {!project.githubUrl && !project.liveDemoUrl ? (
          <p className="text-sm text-subtle">No repository or live demo has been added for this project.</p>
        ) : null}
      </div>
    </article>
  );
}

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage, fieldErrors } from '../../api/client';
import { Field, Notice } from '../../components/admin/Fields';
import { PROJECT_CATEGORIES, STATUS_LABEL } from '../../lib/labels';

const blank = {
  title: '',
  slug: '',
  description: '',
  detailedDescription: '',
  category: PROJECT_CATEGORIES[0],
  technologies: '',
  githubUrl: '',
  liveDemoUrl: '',
  featured: false,
  status: 'planned',
};

function toForm(project) {
  return {
    title: project.title,
    slug: project.slug,
    description: project.description,
    detailedDescription: project.detailedDescription || '',
    category: project.category,
    technologies: (project.technologies || []).join(', '),
    githubUrl: project.githubUrl || '',
    liveDemoUrl: project.liveDemoUrl || '',
    featured: Boolean(project.featured),
    status: project.status || 'planned',
  };
}

export function ProjectsAdmin() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['projects', 'admin'],
    queryFn: async () => (await api.get('/projects')).data.data,
  });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [notice, setNotice] = useState(null);
  const [errors, setErrors] = useState({});

  const save = useMutation({
    mutationFn: async () => {
      const body = {
        ...form,
        technologies: form.technologies.split(',').map((item) => item.trim()).filter(Boolean),
        featured: form.featured,
      };
      const response =
        editing === 'new' ? await api.post('/projects', body) : await api.put(`/projects/${editing}`, body);
      const project = response.data.data;
      if (file) {
        const data = new FormData();
        data.append('image', file);
        await api.put(`/projects/${project._id}/thumbnail`, data);
      }
    },
    onSuccess: async () => {
      setNotice({ tone: 'success', text: 'Project saved.' });
      setEditing(null);
      setFile(null);
      setErrors({});
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      setErrors(fieldErrors(error));
      setNotice({ tone: 'error', text: errorMessage(error, 'The project could not be saved.') });
    },
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  function begin(project) {
    setNotice(null);
    setErrors({});
    setFile(null);
    if (!project) {
      setEditing('new');
      setForm(blank);
      return;
    }
    setEditing(project._id);
    setForm(toForm(project));
  }

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  if (query.isPending) return <p className="text-muted">Loading projects…</p>;
  if (query.isError) return <Notice>{errorMessage(query.error)}</Notice>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Projects</h1>
        <button type="button" className="btn btn-primary" onClick={() => begin(null)}>
          Add project
        </button>
      </div>
      {notice ? <div className="mt-4"><Notice tone={notice.tone}>{notice.text}</Notice></div> : null}

      {editing ? (
        <form
          className="panel mt-6 grid gap-4 rounded-3xl p-5"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Title" error={errors.title}>
            <input className="input" name="title" value={form.title} onChange={update} required />
          </Field>
          <Field label="Slug" error={errors.slug}>
            <input className="input" name="slug" value={form.slug} onChange={update} placeholder="Leave blank to generate one" />
          </Field>
          <Field label="Short description" error={errors.description}>
            <textarea className="input" name="description" value={form.description} onChange={update} required />
          </Field>
          <Field label="Detailed description" error={errors.detailedDescription}>
            <textarea className="input" name="detailedDescription" value={form.detailedDescription} onChange={update} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" error={errors.category}>
              <select className="input" name="category" value={form.category} onChange={update}>
                {(PROJECT_CATEGORIES.includes(form.category) ? PROJECT_CATEGORIES : [form.category, ...PROJECT_CATEGORIES]).map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Status" error={errors.status}>
              <select className="input" name="status" value={form.status} onChange={update}>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Technologies, separated by commas" error={errors.technologies}>
            <input className="input" name="technologies" value={form.technologies} onChange={update} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="GitHub URL" error={errors.githubUrl}>
              <input className="input" name="githubUrl" value={form.githubUrl} onChange={update} placeholder="https://" />
            </Field>
            <Field label="Live demo URL" error={errors.liveDemoUrl}>
              <input className="input" name="liveDemoUrl" value={form.liveDemoUrl} onChange={update} placeholder="https://" />
            </Field>
          </div>
          <Field label="Thumbnail">
            <input className="input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" checked={form.featured} onChange={update} />
            Featured project
          </label>
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save project'}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <ul className="mt-6 space-y-3">
        {query.data.map((project) => (
          <li key={project._id} className="panel flex flex-wrap items-center justify-between gap-3 rounded-3xl p-4">
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-muted">
                {project.category} · {STATUS_LABEL[project.status] || project.status}
                {project.featured ? ' · Featured' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => begin(project)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Delete “${project.title}”?`)) remove.mutate(project._id);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

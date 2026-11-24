import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../api/client';
import { Field, Notice } from '../../components/admin/Fields';
import { SKILL_CATEGORIES } from '../../lib/labels';

const blank = { name: '', category: SKILL_CATEGORIES[0], icon: 'sparkles', displayOrder: 0 };

export function SkillsAdmin() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['skills', 'admin'],
    queryFn: async () => (await api.get('/skills')).data.data,
  });
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const save = useMutation({
    mutationFn: async () => {
      const body = { ...form, displayOrder: Number(form.displayOrder) || 0 };
      if (editing === 'new') await api.post('/skills', body);
      else await api.put(`/skills/${editing}`, body);
    },
    onSuccess: async () => {
      setNotice('Skill saved.');
      setEditing(null);
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
    onError: (error) => setNotice(errorMessage(error, 'The skill could not be saved.')),
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/skills/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  });

  if (query.isPending) return <p className="text-muted">Loading skills…</p>;
  if (query.isError) return <Notice>{errorMessage(query.error)}</Notice>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Skills</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditing('new');
            setForm(blank);
            setNotice('');
          }}
        >
          Add skill
        </button>
      </div>
      {notice ? <div className="mt-4"><Notice tone={notice === 'Skill saved.' ? 'success' : 'error'}>{notice}</Notice></div> : null}
      {editing ? (
        <form
          className="panel mt-6 grid gap-4 rounded-3xl p-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Name">
            <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </Field>
          <Field label="Category">
            <input className="input" list="skill-categories" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
            <datalist id="skill-categories">
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Field>
          <Field label="Icon key">
            <input className="input" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} />
          </Field>
          <Field label="Display order">
            <input className="input" type="number" min="0" max="999" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: event.target.value })} />
          </Field>
          <div className="flex gap-2 sm:col-span-2">
            <button className="btn btn-primary" disabled={save.isPending} type="submit">
              Save skill
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      <ul className="mt-6 space-y-2">
        {query.data.map((skill) => (
          <li key={skill._id} className="panel flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <div>
              <p>{skill.name}</p>
              <p className="text-sm text-subtle">{skill.category}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setEditing(skill._id);
                  setForm({
                    name: skill.name,
                    category: skill.category,
                    icon: skill.icon || '',
                    displayOrder: skill.displayOrder || 0,
                  });
                }}
              >
                Edit
              </button>
              <button type="button" className="btn btn-danger" onClick={() => remove.mutate(skill._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

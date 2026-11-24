import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../api/client';
import { Field, Notice } from '../../components/admin/Fields';
import { EXPERIENCE_LABEL, inputDate } from '../../lib/labels';

const blank = {
  title: '',
  organization: '',
  description: '',
  type: 'education',
  startDate: '',
  endDate: '',
  current: false,
};

export function ExperienceAdmin() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['experience', 'admin'],
    queryFn: async () => (await api.get('/experience')).data.data,
  });
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const save = useMutation({
    mutationFn: async () => {
      const body = { ...form, startDate: form.startDate || null, endDate: form.current ? null : form.endDate || null };
      if (editing === 'new') await api.post('/experience', body);
      else await api.put(`/experience/${editing}`, body);
    },
    onSuccess: async () => {
      setNotice('Timeline entry saved.');
      setEditing(null);
      await queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
    onError: (error) => setNotice(errorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/experience/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experience'] }),
  });

  if (query.isPending) return <p className="text-muted">Loading timeline…</p>;
  if (query.isError) return <Notice>{errorMessage(query.error)}</Notice>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Experience</h1>
        <button type="button" className="btn btn-primary" onClick={() => { setEditing('new'); setForm(blank); setNotice(''); }}>
          Add entry
        </button>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">Leave dates empty when you do not want to invent them.</p>
      {notice ? <div className="mt-4"><Notice tone={notice.includes('saved') ? 'success' : 'error'}>{notice}</Notice></div> : null}
      {editing ? (
        <form className="panel mt-6 grid gap-4 rounded-3xl p-5" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title"><input className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></Field>
            <Field label="Organization"><input className="input" value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} required /></Field>
          </div>
          <Field label="Type">
            <select className="input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              {Object.entries(EXPERIENCE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <Field label="Description"><textarea className="input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date"><input className="input" type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></Field>
            <Field label="End date"><input className="input" type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} disabled={form.current} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.current} onChange={(event) => setForm({ ...form, current: event.target.checked })} />
            Current
          </label>
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={save.isPending}>Save entry</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      ) : null}
      <ul className="mt-6 space-y-3">
        {query.data.map((entry) => (
          <li key={entry._id} className="panel flex items-center justify-between gap-3 rounded-2xl p-4">
            <div>
              <p>{entry.title}</p>
              <p className="text-sm text-subtle">{entry.organization} · {EXPERIENCE_LABEL[entry.type]}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setEditing(entry._id);
                  setForm({
                    title: entry.title,
                    organization: entry.organization,
                    description: entry.description || '',
                    type: entry.type,
                    startDate: inputDate(entry.startDate),
                    endDate: inputDate(entry.endDate),
                    current: Boolean(entry.current),
                  });
                }}
              >
                Edit
              </button>
              <button type="button" className="btn btn-danger" onClick={() => remove.mutate(entry._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

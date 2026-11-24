import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../api/client';
import { Field, Notice } from '../../components/admin/Fields';

function profileForm(data) {
  if (!data) return empty;
  return {
    ...empty,
    ...data,
    socialLinks: { ...empty.socialLinks, ...data.socialLinks },
    interests: data.interests || [],
  };
}

const empty = {
  name: '',
  greeting: '',
  headline: '',
  headlineAccent: '',
  title: '',
  statement: '',
  summary: '',
  biography: '',
  mission: '',
  university: '',
  education: '',
  location: '',
  currentFocus: '',
  careerGoal: '',
  socialLinks: { github: '', linkedin: '', x: '', email: '' },
  interests: [],
};

export function ProfileAdmin() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['profile', 'admin'],
    queryFn: async () => (await api.get('/profile')).data.data,
    retry: false,
  });
  const [draft, setDraft] = useState(null);
  const [portrait, setPortrait] = useState(null);
  const [cv, setCv] = useState(null);
  const [notice, setNotice] = useState('');
  const form = draft ?? profileForm(query.isSuccess ? query.data : null);

  const save = useMutation({
    mutationFn: async () => {
      await api.put('/profile', {
        ...form,
        interests: form.interests.filter((item) => item.title.trim() && item.summary.trim()),
      });
      if (portrait) {
        const data = new FormData();
        data.append('image', portrait);
        await api.put('/profile/portrait', data);
      }
      if (cv) {
        const data = new FormData();
        data.append('document', cv);
        await api.put('/profile/cv', data);
      }
    },
    onSuccess: async () => {
      setNotice('Profile saved.');
      setPortrait(null);
      setCv(null);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => setNotice(errorMessage(error, 'The profile could not be saved.')),
  });

  if (query.isPending) return <p className="text-muted">Loading profile…</p>;
  if (query.isError && query.error?.response?.status !== 404) return <Notice>{errorMessage(query.error)}</Notice>;

  function text(name) {
    return {
      value: form[name] || '',
      onChange: (event) => setDraft({ ...form, [name]: event.target.value }),
    };
  }

  return (
    <form
      className="max-w-3xl"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice('');
        save.mutate();
      }}
    >
      <h1 className="font-display text-4xl">Home & profile</h1>
      <p className="mt-2 text-muted">The name and portrait appear on the home page. Skills, projects, and timeline entries stay on their own pages.</p>
      <div className="mt-6 grid gap-4">
        <Field label="Home greeting"><input className="input" {...text('greeting')} placeholder="Hello, I'm Abdi Milki" /></Field>
        <Field label="Home headline"><input className="input" {...text('headline')} placeholder="Building Intelligent Digital Experiences." /></Field>
        <Field label="Highlighted word"><input className="input" {...text('headlineAccent')} placeholder="Intelligent" /></Field>
        <Field label="Home supporting line"><input className="input" {...text('title')} required /></Field>
        <Field label="Home summary"><textarea className="input" {...text('summary')} /></Field>
        <Field label="Home portrait">
          <input className="input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setPortrait(event.target.files?.[0] || null)} />
        </Field>
        <Field label="Name"><input className="input" {...text('name')} required /></Field>
        <Field label="Brand statement"><textarea className="input" {...text('statement')} /></Field>
        <Field label="Biography"><textarea className="input" {...text('biography')} required /></Field>
        <Field label="Mission"><textarea className="input" {...text('mission')} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="University"><input className="input" {...text('university')} /></Field>
          <Field label="Education"><input className="input" {...text('education')} /></Field>
          <Field label="Location"><input className="input" {...text('location')} /></Field>
          <Field label="Current focus"><input className="input" {...text('currentFocus')} /></Field>
        </div>
        <Field label="Career goal"><textarea className="input" {...text('careerGoal')} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {['github', 'linkedin', 'x', 'email'].map((key) => (
            <Field key={key} label={key === 'x' ? 'X URL' : key === 'email' ? 'Public email' : `${key} URL`}>
              <input
                className="input"
                value={form.socialLinks[key] || ''}
                onChange={(event) =>
                  setDraft({
                    ...form,
                    socialLinks: { ...form.socialLinks, [key]: event.target.value },
                  })
                }
              />
            </Field>
          ))}
        </div>
        <fieldset>
          <legend className="mb-3 text-sm text-muted">Interests</legend>
          <div className="space-y-3">
            {form.interests.map((interest, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-2">
                <input
                  className="input"
                  value={interest.title}
                  aria-label={`Interest ${index + 1} title`}
                  onChange={(event) => {
                    const interests = form.interests.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, title: event.target.value } : item,
                    );
                    setDraft({ ...form, interests });
                  }}
                />
                <input
                  className="input"
                  value={interest.summary}
                  aria-label={`Interest ${index + 1} summary`}
                  onChange={(event) => {
                    const interests = form.interests.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, summary: event.target.value } : item,
                    );
                    setDraft({ ...form, interests });
                  }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ghost mt-3"
            onClick={() => setDraft({ ...form, interests: [...form.interests, { title: '', summary: '' }] })}
          >
            Add interest
          </button>
        </fieldset>
        <Field label="CV (PDF)">
          <input className="input" type="file" accept="application/pdf" onChange={(event) => setCv(event.target.files?.[0] || null)} />
        </Field>
      </div>
      {notice ? <div className="mt-4"><Notice tone={notice === 'Profile saved.' ? 'success' : 'error'}>{notice}</Notice></div> : null}
      <button className="btn btn-primary mt-6" type="submit" disabled={save.isPending}>
        {save.isPending ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api, errorMessage, fieldErrors } from '../../api/client';
import { Reveal } from '../Reveal';
import { SocialLinks } from '../SocialLinks';
import { useProfile } from '../../hooks/usePortfolio';

const empty = { name: '', email: '', subject: '', message: '', company: '' };

export function Contact() {
  const { content: profile } = useProfile();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post('/contact', body);
      return data;
    },
    onSuccess: () => {
      setSent(true);
      setForm(empty);
      setErrors({});
    },
    onError: (error) => setErrors(fieldErrors(error)),
  });

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setSent(false);
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.subject.trim().length < 2) next.subject = 'Enter a subject.';
    if (form.message.trim().length < 10) next.message = 'Write a message of at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    mutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      company: form.company,
    });
  }

  return (
    <section id="contact" className="bg-ink-deep py-24 sm:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow text-accent-strong">Contact</p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
            Let's Build Something Amazing Together.
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">Have an idea, project, or opportunity? I'd love to hear about it.</p>
          <SocialLinks className="mt-8" links={profile?.socialLinks} />
        </Reveal>

        <Reveal>
          <form className="panel relative rounded-[1.7rem] p-6 sm:p-8" onSubmit={submit} noValidate>
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={update} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" value={form.name} error={errors.name} onChange={update} autoComplete="name" />
              <Field label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={update} autoComplete="email" />
            </div>
            <div className="mt-4">
              <Field label="Subject" name="subject" value={form.subject} error={errors.subject} onChange={update} />
            </div>
            <div className="mt-4">
              <Field label="Message" name="message" value={form.message} error={errors.message} onChange={update} multiline />
            </div>
            {mutation.isError ? (
              <p role="alert" className="mt-4 text-sm text-danger">
                {mutation.error?.response
                  ? errorMessage(mutation.error, 'The message could not be sent.')
                  : 'The API is not running, so the message was not saved. Start it after MongoDB is connected.'}
              </p>
            ) : null}
            {sent ? (
              <p role="status" className="mt-4 text-sm text-positive">
                Message received. I'll read it from the admin dashboard.
              </p>
            ) : null}
            <button className="btn btn-primary mt-6" type="submit" disabled={mutation.isPending}>
              <Send className="h-4 w-4" aria-hidden="true" />
              {mutation.isPending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, name, error, multiline, ...props }) {
  const id = `contact-${name}`;
  const inputProps = {
    id,
    name,
    className: 'input',
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? `${id}-error` : undefined,
    ...props,
  };
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-muted">
        {label}
      </label>
      {multiline ? <textarea {...inputProps} rows={6} /> : <input {...inputProps} />}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../api/client';
import { Field, Notice } from '../../components/admin/Fields';
import { useSession } from '../../hooks/useSession';

export function AccountAdmin() {
  const session = useSession();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(session.data?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notice, setNotice] = useState(null);
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setNotice(null);
    setPending(true);
    try {
      const { data } = await api.patch('/auth/account', {
        email,
        currentPassword,
        newPassword,
      });
      queryClient.setQueryData(['me'], data.data);
      setCurrentPassword('');
      setNewPassword('');
      setNotice({ tone: 'success', text: 'Sign-in details updated.' });
    } catch (error) {
      setNotice({ tone: 'error', text: errorMessage(error, 'The sign-in details could not be updated.') });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="max-w-xl" onSubmit={submit}>
      <h1 className="font-display text-4xl">Account</h1>
      <p className="mt-2 text-muted">Change the email and password used on the admin sign-in page.</p>
      <div className="mt-6 grid gap-4">
        <Field label="Sign-in email">
          <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" />
        </Field>
        <Field label="Current password">
          <input className="input" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required minLength={12} autoComplete="current-password" />
        </Field>
        <Field label="New password">
          <input className="input" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={12} autoComplete="new-password" placeholder="Leave blank to keep the current password" />
        </Field>
      </div>
      {notice ? (
        <div className="mt-4">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      ) : null}
      <button className="btn btn-primary mt-6" type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Update sign-in'}
      </button>
    </form>
  );
}

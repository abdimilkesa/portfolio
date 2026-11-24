import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../api/client';
import { Notice } from '../../components/admin/Fields';
import { useSession } from '../../hooks/useSession';

export function AdminLogin() {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  if (session.isSuccess) return <Navigate to="/admin" replace />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      await api.post('/auth/login', { email, password });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/admin');
    } catch (err) {
      const status = err?.response?.status;
      setError(
        status === 401
          ? errorMessage(err, 'The email or password is incorrect.')
          : 'The API is not running, so sign-in cannot be checked yet.',
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <form className="panel w-full max-w-md rounded-[1.7rem] p-8" onSubmit={submit}>
        <p className="font-display tracking-[0.18em]">AM</p>
        <h1 className="font-display mt-6 text-3xl">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Use the administrator account created from your environment file. There is no public registration.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm text-muted">
              Email
            </label>
            <input
              id="admin-email"
              className="input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm text-muted">
              Password
            </label>
            <input
              id="admin-password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={12}
            />
          </div>
        </div>
        <Notice>{error}</Notice>
        <button className="btn btn-primary mt-6 w-full" type="submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

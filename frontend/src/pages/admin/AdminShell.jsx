import { LogOut } from 'lucide-react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useSession } from '../../hooks/useSession';

const links = [
  ['/admin', 'Overview'],
  ['/admin/projects', 'Projects'],
  ['/admin/skills', 'Skills'],
  ['/admin/experience', 'Experience'],
  ['/admin/profile', 'Profile'],
  ['/admin/messages', 'Messages'],
];

export function AdminShell() {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (session.isPending) {
    return <p className="grid min-h-dvh place-items-center text-muted">Checking your session…</p>;
  }
  if (session.isError) return <Navigate to="/admin/login" replace />;

  async function logout() {
    await api.post('/auth/logout');
    queryClient.removeQueries({ queryKey: ['me'] });
    navigate('/admin/login');
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="font-display tracking-[0.18em]">AM</p>
            <p className="text-sm text-subtle">Admin</p>
          </div>
          <button type="button" className="btn btn-ghost h-10 w-10 px-0" onClick={logout}>
            <span className="sr-only">Log out</span>
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col" aria-label="Admin">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm whitespace-nowrap ${isActive ? 'bg-white/10 text-white' : 'text-muted hover:text-white'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="px-4 py-8 sm:px-8">
        <p className="mb-6 text-sm text-subtle">Signed in as {session.data.email}</p>
        <Outlet />
      </div>
    </div>
  );
}

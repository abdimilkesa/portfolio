import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { api, errorMessage } from '../../api/client';
import { Notice } from '../../components/admin/Fields';
import { formatStamp } from '../../lib/labels';

export function OverviewPage() {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data.data,
  });

  if (query.isPending) return <p className="text-muted">Loading overview…</p>;
  if (query.isError) return <Notice>{errorMessage(query.error, 'The overview could not be loaded.')}</Notice>;

  const { counts, recentMessages } = query.data;
  const cards = [
    ['Projects', counts.projects],
    ['Messages', counts.messages],
    ['Unread', counts.unreadMessages],
    ['Skills', counts.skills],
    ['Timeline', counts.experience],
  ];

  return (
    <div>
      <h1 className="font-display text-4xl">Overview</h1>
      <p className="mt-2 text-muted">Counts come from the database.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <article key={label} className="panel rounded-3xl p-5">
            <p className="text-sm text-subtle">{label}</p>
            <p className="font-display mt-3 text-4xl">{value}</p>
          </article>
        ))}
      </div>
      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Recent messages</h2>
          <Link className="text-sm text-accent" to="/admin/messages">
            View all
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="mt-4 text-muted">No messages yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line rounded-3xl border border-line">
            {recentMessages.map((message) => (
              <li key={message._id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="font-medium">{message.subject}</p>
                  <p className="text-sm text-muted">
                    {message.name} · {message.email}
                  </p>
                </div>
                <p className="text-sm text-subtle">
                  {message.isRead ? 'Read' : 'Unread'} · {formatStamp(message.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

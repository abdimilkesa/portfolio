import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../api/client';
import { Notice } from '../../components/admin/Fields';
import { formatStamp } from '../../lib/labels';

export function MessagesAdmin() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['messages'],
    queryFn: async () => (await api.get('/contact')).data.data,
  });
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');

  const read = useMutation({
    mutationFn: ({ id, isRead }) => api.patch(`/contact/${id}/read`, { isRead }),
    onSuccess: async (response) => {
      setSelected(response.data.data);
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => setNotice(errorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/contact/${id}`),
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (query.isPending) return <p className="text-muted">Loading messages…</p>;
  if (query.isError) return <Notice>{errorMessage(query.error)}</Notice>;

  return (
    <div>
      <h1 className="font-display text-4xl">Messages</h1>
      {notice ? <div className="mt-4"><Notice>{notice}</Notice></div> : null}
      {query.data.length === 0 ? <p className="mt-6 text-muted">No messages yet.</p> : null}
      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <ul className="space-y-2">
          {query.data.map((message) => (
            <li key={message._id}>
              <button
                type="button"
                className={`panel w-full rounded-2xl px-4 py-3 text-left ${selected?._id === message._id ? 'border-accent/50' : ''}`}
                onClick={() => {
                  setSelected(message);
                  if (!message.isRead) read.mutate({ id: message._id, isRead: true });
                }}
              >
                <p className="font-medium">{message.subject}</p>
                <p className="text-sm text-muted">{message.name}</p>
                <p className="text-xs text-subtle">{message.isRead ? 'Read' : 'Unread'} · {formatStamp(message.createdAt)}</p>
              </button>
            </li>
          ))}
        </ul>
        {selected ? (
          <article className="panel rounded-3xl p-5">
            <p className="text-sm text-subtle">{formatStamp(selected.createdAt)}</p>
            <h2 className="font-display mt-2 text-2xl">{selected.subject}</h2>
            <p className="mt-2 text-muted">{selected.name} · <a className="text-accent" href={`mailto:${selected.email}`}>{selected.email}</a></p>
            <p className="mt-5 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => read.mutate({ id: selected._id, isRead: !selected.isRead })}>
                Mark {selected.isRead ? 'unread' : 'read'}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('Delete this message?')) remove.mutate(selected._id);
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}

export function Notice({ tone = 'error', children }) {
  if (!children) return null;
  const style =
    tone === 'success' ? 'border-positive/30 text-positive' : 'border-danger/40 text-danger';
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`rounded-2xl border px-4 py-3 text-sm ${style}`}>
      {children}
    </p>
  );
}

export function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted">{label}</label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-danger">{error}</p> : null}
    </div>
  );
}

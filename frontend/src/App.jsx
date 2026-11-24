import { useEffect, useState } from 'react';
import axios from 'axios';

// Phase 1 smoke test: proves Tailwind tokens, fonts and the /api proxy work.
// Replaced by the real router in Phase 2.
export default function App() {
  const [health, setHealth] = useState('checking…');

  useEffect(() => {
    axios
      .get('/api/health')
      .then(({ data }) => setHealth(`API ${data.data.status}, database ${data.data.database}`))
      .catch(() => setHealth('API unreachable'));
  }, []);

  return (
    <main className="container-page grid min-h-dvh place-content-center gap-4 text-center">
      <p className="eyebrow text-accent">Phase 1 · Foundation</p>
      <h1 className="font-display text-5xl font-semibold tracking-tight">
        Building <span className="text-gradient">Intelligent</span> Digital Experiences.
      </h1>
      <p className="text-muted">{health}</p>
    </main>
  );
}

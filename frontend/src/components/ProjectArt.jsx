const tones = {
  'AI & Machine Learning': 'from-accent/30 via-accent-strong/10 to-transparent',
  'Full-Stack Development': 'from-white/15 via-accent/10 to-transparent',
  'Web Applications': 'from-accent-soft/20 via-white/5 to-transparent',
  'Software Engineering': 'from-accent-strong/25 via-transparent to-accent/10',
};

export function ProjectArt({ category, title }) {
  const tone = tones[category] || tones['Software Engineering'];
  return (
    <div className={`relative aspect-[16/10] overflow-hidden bg-ink bg-gradient-to-br ${tone}`} aria-hidden="true">
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div className="absolute -top-8 right-6 h-28 w-28 rounded-full border border-white/15" />
      <div className="absolute top-10 right-12 h-16 w-16 rounded-full border border-accent/40" />
      <div className="absolute bottom-5 left-5 h-px w-24 bg-accent/70" />
      <p className="font-display absolute bottom-4 right-4 text-4xl font-semibold text-white/15">
        {title.slice(0, 1)}
      </p>
    </div>
  );
}

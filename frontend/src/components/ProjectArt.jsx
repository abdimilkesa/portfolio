const tones = {
  'AI & Machine Learning': 'from-[#DBEAFE] via-white to-[#EFF6FF]',
  'Full-Stack Development': 'from-[#EFF6FF] via-white to-[#F8FAFC]',
  'Web Applications': 'from-[#E0F2FE] via-white to-[#EFF6FF]',
  'Software Engineering': 'from-[#F8FAFC] via-white to-[#DBEAFE]',
};

export function ProjectArt({ category, title }) {
  const tone = tones[category] || tones['Software Engineering'];
  return (
    <div className={`project-art relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${tone}`} aria-hidden="true">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -top-8 right-6 h-28 w-28 rounded-full border border-[#BFDBFE]" />
      <div className="absolute top-10 right-12 h-16 w-16 rounded-full bg-[#60A5FA]/20" />
      <p className="font-display absolute bottom-4 left-5 text-sm font-medium tracking-wide text-accent-strong">{category}</p>
      <p className="font-display absolute right-4 bottom-3 text-5xl font-semibold text-[#2563EB]/15">{title.slice(0, 1)}</p>
    </div>
  );
}

export function SectionHeading({ index, eyebrow, title, text }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow text-accent">
        {index} <span className="text-subtle">/</span> {eyebrow}
      </p>
      <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-lg text-muted">{text}</p> : null}
    </div>
  );
}

const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });
const stampFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

export const STATUS_LABEL = {
  planned: 'Planned',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export const EXPERIENCE_LABEL = {
  education: 'Education',
  experience: 'Experience',
  hackathon: 'Hackathon',
  collaboration: 'Collaboration',
  competition: 'Competition',
  workshop: 'Workshop',
  certification: 'Certification',
  milestone: 'Milestone',
};

export const PROJECT_CATEGORIES = [
  'AI & Machine Learning',
  'Full-Stack Development',
  'Web Applications',
  'Software Engineering',
];

export const SKILL_CATEGORIES = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'AI and Emerging Technologies',
];

export function formatMonth(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return monthFormat.format(date);
}

export function formatStamp(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return stampFormat.format(date);
}

export function experiencePeriod(entry) {
  const start = formatMonth(entry.startDate);
  const end = entry.current ? 'Present' : formatMonth(entry.endDate);
  if (!start && !end) return entry.current ? 'Present' : 'Dates not added yet';
  if (!start) return end;
  return end ? `${start} — ${end}` : start;
}

export function inputDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

import { Link } from 'react-router';
import { useProfile } from '../../hooks/usePortfolio';
import { SocialLinks } from '../SocialLinks';

const links = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['contact', 'Contact'],
];

const year = new Date().getFullYear();

export function Footer() {
  const { content: profile } = useProfile();

  return (
    <footer className="border-t border-line">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[0.18em]">AM</p>
          <p className="mt-4 max-w-sm text-muted">
            {profile?.statement ||
              'I build intelligent digital experiences and explore how technology and Artificial Intelligence can solve real-world problems.'}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow text-subtle">Navigate</p>
          <ul className="mt-4 space-y-2">
            {links.map(([id, label]) => (
              <li key={id}>
                <a className="text-muted hover:text-white" href={`/#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow text-subtle">Connect</p>
          <SocialLinks className="mt-4" links={profile?.socialLinks} />
          <Link className="mt-4 inline-block text-sm text-muted hover:text-white" to="/admin/login">
            Admin
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile?.name || 'Abdi Milki'}</p>
          <p>Designed and built with curiosity, creativity, and code.</p>
        </div>
      </div>
    </footer>
  );
}

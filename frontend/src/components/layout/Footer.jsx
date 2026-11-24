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
  const name = profile?.name || 'Abdi Milki';

  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold text-navy">{name}</p>
          <p className="mt-3 max-w-sm text-muted">Software Engineering Student | Aspiring AI Engineer.</p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow text-subtle">Navigate</p>
          <ul className="mt-4 space-y-2">
            {links.map(([id, label]) => (
              <li key={id}>
                <a className="text-muted hover:text-accent-strong" href={`/#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow text-subtle">Connect</p>
          <SocialLinks className="mt-4" links={profile?.socialLinks} />
          <Link className="mt-4 inline-block text-sm text-muted hover:text-accent-strong" to="/admin/login">
            Admin
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page py-5 text-sm text-subtle">
          <p>© {year} {name}</p>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { ThemeToggle } from '../ThemeToggle';
import { useProfile } from '../../hooks/usePortfolio';

const links = [
  ['home', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['contact', 'Contact'],
];

function hrefFor(pathname, id) {
  return pathname === '/' ? `#${id}` : `/#${id}`;
}

export function Navbar() {
  const { pathname } = useLocation();
  const { content: profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return undefined;
    const nodes = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const cv = profile?.cvUrl;

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md ${scrolled ? 'shadow-[0_8px_24px_-18px_rgba(15,23,42,0.35)]' : ''}`}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-display text-lg font-semibold text-navy" aria-label="Abdi Milki, home">
          {profile?.name || 'Abdi Milki'}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={hrefFor(pathname, id)}
              aria-current={pathname === '/' && active === id ? 'true' : undefined}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                pathname === '/' && active === id
                  ? 'bg-elevated text-accent-strong'
                  : 'text-muted hover:text-accent-strong'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {cv ? (
            <a className="btn btn-ghost" href={cv}>
              Download CV
            </a>
          ) : null}
          <ThemeToggle />
          <a className="btn btn-primary" href={hrefFor(pathname, 'contact')}>
            Contact
          </a>
        </div>

        <ThemeToggle className="lg:hidden" />
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-line lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={hrefFor(pathname, id)}
                className="rounded-2xl px-3 py-3 text-lg"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              {cv ? (
                <a className="btn btn-ghost" href={cv} onClick={() => setOpen(false)}>
                  Download CV
                </a>
              ) : null}
              <a className="btn btn-primary" href={hrefFor(pathname, 'contact')} onClick={() => setOpen(false)}>
                Contact
              </a>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

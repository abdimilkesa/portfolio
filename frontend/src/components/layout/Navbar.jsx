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
    const onScroll = () => {
      const hero = pathname === '/' ? document.getElementById('home') : null;
      const limit = hero ? Math.max(80, hero.offsetHeight - 80) : 12;
      setScrolled(window.scrollY > limit);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

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
  const overIntro = pathname === '/' && !scrolled;

  return (
    <header className="sticky top-3 z-40 px-4 sm:px-6">
      <div
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 backdrop-blur-2xl sm:px-6 ${
          overIntro
            ? 'border-white/10 bg-[#0B1120]/75 text-white shadow-xl shadow-black/40'
            : 'border-line bg-surface/85 text-navy shadow-xl'
        }`}
      >
        <Link to="/" className={`font-code text-lg font-extrabold tracking-tight ${overIntro ? 'text-white' : 'text-navy'}`} aria-label="Abdi Milki, home">
          <span className="mr-2 inline-grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-500 text-base font-black text-slate-950">A.</span>
          {(profile?.name || 'Abdi').split(' ')[0]}
          <span className="text-emerald-400">.dev</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={hrefFor(pathname, id)}
              aria-current={pathname === '/' && active === id ? 'true' : undefined}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                pathname === '/' && active === id
                  ? overIntro
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-elevated text-accent-strong'
                  : overIntro
                    ? 'text-slate-300 hover:text-white'
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
          className={`grid h-11 w-11 place-items-center rounded-full border lg:hidden ${overIntro ? 'border-white/20 bg-white/10 text-white' : 'border-line bg-surface text-navy'}`}
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

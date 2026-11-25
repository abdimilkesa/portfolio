import { Mail } from 'lucide-react';
import { brandIcons } from '../lib/brands';

const items = [
  { key: 'github', label: 'GitHub', brand: 'github' },
  { key: 'linkedin', label: 'LinkedIn', brand: null },
  { key: 'x', label: 'X', brand: 'x' },
  { key: 'email', label: 'Email', brand: null },
];

function hrefFor(key, value) {
  if (!value) return '';
  return key === 'email' ? `mailto:${value}` : value;
}

export function SocialLinks({ links, className = '', variant = 'default' }) {
  const glass = variant === 'glass';
  const available = items
    .map((item) => ({ ...item, href: hrefFor(item.key, links?.[item.key]) }))
    .filter((item) => item.href);

  if (!available.length) {
    return (
      <p className={`text-sm ${glass ? 'text-white/75' : 'text-subtle'} ${className}`}>
        Social profiles can be added from the admin profile.
      </p>
    );
  }

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {available.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            className={glass ? 'intro-btn intro-btn-glass h-11 w-11 px-0' : 'btn btn-ghost h-11 w-11 px-0'}
            {...(item.key === 'email' ? {} : { target: '_blank', rel: 'noreferrer' })}
          >
            <span className="sr-only">{item.label}</span>
            {item.brand ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d={brandIcons[item.brand].path} />
              </svg>
            ) : item.key === 'email' ? (
              <Mail className="h-4 w-4" aria-hidden="true" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.6 4.8 6V24h-4v-7.7c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V24h-4V8.5z"
                />
              </svg>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

function readTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem('am-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#080D19' : '#FFFFFF');
}

export function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(readTheme);
  const light = theme === 'light';

  function toggle() {
    const next = light ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button type="button" className={`btn btn-ghost h-11 w-11 px-0 ${className}`} onClick={toggle} aria-pressed={!light}>
      <span className="sr-only">{light ? 'Switch to dark theme' : 'Switch to light theme'}</span>
      <span key={theme} className="theme-icon">
        {light ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      </span>
    </button>
  );
}

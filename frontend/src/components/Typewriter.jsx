import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const FALLBACK = ['AI Engineer'];

export function Typewriter({ words = FALLBACK }) {
  const reduce = useReducedMotion();
  const longest = words.reduce((current, word) => (word.length > current.length ? word : current), words[0] || '');
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduce ? words[0] || '' : '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return undefined;
    const full = words[index] || '';
    const pause = !deleting && text === full;
    const delay = pause ? 1500 : deleting ? 38 : 72;
    const timer = window.setTimeout(() => {
      if (pause) {
        setDeleting(true);
        return;
      }
      if (deleting && text === '') {
        setDeleting(false);
        setIndex((current) => (current + 1) % words.length);
        return;
      }
      const nextLength = text.length + (deleting ? -1 : 1);
      setText(full.slice(0, nextLength));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [deleting, index, reduce, text, words]);

  return (
    <span className="inline-grid max-w-full align-bottom">
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">
        {longest}
      </span>
      <span className="col-start-1 row-start-1 whitespace-nowrap" aria-live="polite" aria-atomic="true">
        <span className="text-gradient">{reduce ? words[0] : text}</span>
        {reduce ? null : <span className="type-caret" aria-hidden="true" />}
      </span>
    </span>
  );
}

import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="container-page grid min-h-[70dvh] place-content-center py-24 text-center">
      <p className="eyebrow text-accent">404</p>
      <h1 className="font-display mt-4 text-5xl">This page is not part of the site.</h1>
      <Link className="btn btn-primary mt-8" to="/">
        Back home
      </Link>
    </div>
  );
}

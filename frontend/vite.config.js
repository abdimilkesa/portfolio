import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The whole monorepo shares one `.env` file at the repository root.
const rootDir = fileURLToPath(new URL('..', import.meta.url));

/** Replaces `__SITE_URL__` in index.html so canonical/Open Graph URLs are absolute. */
function siteUrlPlugin(siteUrl) {
  return {
    name: 'portfolio:site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const apiTarget = env.DEV_API_PROXY_TARGET || `http://localhost:${env.PORT || 5000}`;
  const siteUrl = (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/+$/, '');

  const proxy = Object.fromEntries(
    ['/api', '/sitemap.xml', '/robots.txt'].map((path) => [
      path,
      { target: apiTarget, changeOrigin: true },
    ]),
  );

  return {
    envDir: rootDir,
    plugins: [react(), tailwindcss(), siteUrlPlugin(siteUrl)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, strictPort: true, proxy },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 600,
    },
  };
});

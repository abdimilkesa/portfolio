import { Project } from '../models/index.js';
import { env } from '../config/env.js';
import { openMedia } from '../services/media.js';

export async function streamMedia(req, res, next) {
  try {
    const opened = await openMedia(req.params.id);
    if (!opened) {
      res.status(404).json({ success: false, message: 'That file was not found.' });
      return;
    }

    const type = opened.file.contentType || 'application/octet-stream';
    res.set('Content-Type', type);
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('X-Content-Type-Options', 'nosniff');
    if (!type.startsWith('image/')) {
      const name = String(opened.file.filename || 'download').replace(/[^\w.\- ]+/g, '');
      res.set('Content-Disposition', `attachment; filename="${name || 'download'}"`);
    }
    opened.stream.on('error', next);
    opened.stream.pipe(res);
  } catch (error) {
    next(error);
  }
}

function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
    return map[char];
  });
}

export async function sitemap(_req, res) {
  const origin = env.siteUrl;
  const projects = await Project.find().select('slug updatedAt').sort({ updatedAt: -1 });
  const urls = [
    { loc: `${origin}/`, priority: '1.0' },
    ...projects.map((project) => ({
      loc: `${origin}/projects/${project.slug}`,
      priority: '0.7',
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${xmlEscape(url.loc)}</loc><priority>${url.priority}</priority></url>`)
  .join('\n')}
</urlset>`;
  res.type('application/xml').send(body);
}

export function robots(_req, res) {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${env.siteUrl}/sitemap.xml\n`);
}

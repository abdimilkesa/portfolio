import path from 'node:path';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env, paths } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { securityHeaders } from './config/security.js';
import { requireAjaxHeader } from './middleware/csrf.js';
import { sanitizeRequest } from './middleware/sanitize.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { robots, sitemap } from './controllers/seoController.js';
import apiRouter from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);

  app.use(securityHeaders());
  app.use(compression());
  if (!env.isTest) app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use(sanitizeRequest);

  app.use('/api', requireAjaxHeader, apiRouter);
  app.get('/robots.txt', robots);
  app.get('/sitemap.xml', sitemap);

  if (env.serveFrontend) {
    const dist = paths.frontendDist;
    app.use(express.static(dist, { index: false, maxAge: env.isProduction ? '1h' : 0 }));
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(dist, 'index.html'), (error) => {
        if (error) next(error);
      });
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

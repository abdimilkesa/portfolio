/**
 * Creates `<repo>/.env` from `.env.example` with a freshly generated JWT secret.
 * Never overwrites an existing `.env`.
 *
 *   npm run setup:env
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { paths } from '../config/env.js';

const examplePath = path.join(paths.root, '.env.example');
const targetPath = path.join(paths.root, '.env');

if (fs.existsSync(targetPath)) {
  console.log('.env already exists: leaving it untouched.');
  process.exit(0);
}

const secret = crypto.randomBytes(48).toString('hex');
const content = fs
  .readFileSync(examplePath, 'utf8')
  .replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`);

fs.writeFileSync(targetPath, content, { mode: 0o600 });

console.log(`Created ${targetPath} with a newly generated JWT_SECRET.
Next steps:
  1. Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in .env
  2. Point MONGODB_URI at your database (or run \`npm run db:local\`)
  3. Run \`npm run seed\` and \`npm run seed:admin\``);

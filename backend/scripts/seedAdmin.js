import bcrypt from 'bcrypt';
import { pathToFileURL } from 'node:url';
import { assertRuntimeConfig, env } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Admin } from '../models/index.js';

const WEAK = /change-me|replace-with|your-password|password123|admin123/i;

export function adminSeedInput() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || '');
  const name = String(process.env.ADMIN_NAME || 'Abdi Milki').trim() || 'Abdi Milki';

  if (!email || !email.includes('@') || email.endsWith('@example.com')) {
    return { skip: 'Set ADMIN_EMAIL in .env to a real address, then run npm run seed:admin.' };
  }
  if (password.length < 12 || password.length > 72 || WEAK.test(password)) {
    return { skip: 'Set ADMIN_PASSWORD in .env to 12–72 characters that are not a placeholder, then run npm run seed:admin.' };
  }
  return { email, password, name };
}

export async function seedAdminFromEnv() {
  const input = adminSeedInput();
  if (input.skip) return { skipped: true, reason: input.skip };

  const passwordHash = await bcrypt.hash(input.password, 12);
  const existing = await Admin.findOne({ email: input.email });
  if (existing) {
    existing.name = input.name;
    existing.password = passwordHash;
    existing.role = 'admin';
    await existing.save();
    return { updated: true, email: input.email };
  }

  await Admin.create({
    name: input.name,
    email: input.email,
    password: passwordHash,
    role: 'admin',
  });
  return { created: true, email: input.email };
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  try {
    assertRuntimeConfig();
    await connectDatabase(env.mongoUri);
    const result = await seedAdminFromEnv();
    if (result.skipped) console.log(result.reason);
    else if (result.created) console.log(`Administrator created for ${result.email}. Remove ADMIN_PASSWORD from .env when you no longer need to reseed.`);
    else console.log(`Administrator password updated for ${result.email}.`);
    await disconnectDatabase();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

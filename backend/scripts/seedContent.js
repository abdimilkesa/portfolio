import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { paths, assertRuntimeConfig, env } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { Experience, Profile, Project, Skill } from '../models/index.js';

export function loadPortfolioContent() {
  const file = path.join(paths.root, 'frontend', 'src', 'content', 'portfolio.json');
  return JSON.parse(readFileSync(file, 'utf8'));
}

export async function seedIfEmpty() {
  const content = loadPortfolioContent();
  const created = [];

  if ((await Profile.countDocuments()) === 0) {
    await Profile.create(content.profile);
    created.push('profile');
  }
  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany(content.skills);
    created.push('skills');
  }
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany(content.projects);
    created.push('projects');
  }
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany(content.experience);
    created.push('experience');
  }

  return created;
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  try {
    assertRuntimeConfig();
    await connectDatabase(env.mongoUri);
    const created = await seedIfEmpty();
    console.log(created.length ? `Seeded: ${created.join(', ')}` : 'Content already exists. Nothing was overwritten.');
    await disconnectDatabase();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

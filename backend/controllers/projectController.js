import { Project } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { removeMedia, storeImage } from '../services/media.js';
import { asBoolean, asList, slugify } from '../utils/values.js';

async function uniqueSlug(base, ignoreId) {
  const root = slugify(base);
  let slug = root;
  let suffix = 2;
  for (;;) {
    const filter = { slug };
    if (ignoreId) filter._id = { $ne: ignoreId };
    const exists = await Project.exists(filter);
    if (!exists) return slug;
    slug = `${root}-${suffix}`.slice(0, 160);
    suffix += 1;
  }
}

function projectPayload(body, slug) {
  return {
    title: body.title,
    slug,
    description: body.description,
    detailedDescription: body.detailedDescription || '',
    category: body.category,
    technologies: asList(body.technologies),
    githubUrl: body.githubUrl || '',
    liveDemoUrl: body.liveDemoUrl || '',
    featured: asBoolean(body.featured),
    status: body.status || 'planned',
  };
}

export async function listProjects(req, res) {
  const filter = {};
  if (req.query.category) filter.category = String(req.query.category).slice(0, 80);
  if (req.query.featured === 'true') filter.featured = true;
  const projects = await Project.find(filter).sort({ featured: -1, createdAt: -1 });
  res.json({ success: true, data: projects });
}

export async function getProject(req, res, next) {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return next(ApiError.notFound('That project was not found.'));
  res.json({ success: true, data: project });
}

export async function createProject(req, res) {
  const slug = await uniqueSlug(req.body.slug || req.body.title);
  const project = await Project.create(projectPayload(req.body, slug));
  res.status(201).json({ success: true, data: project });
}

export async function updateProject(req, res, next) {
  const current = await Project.findById(req.params.id);
  if (!current) return next(ApiError.notFound('That project was not found.'));
  const slug = await uniqueSlug(req.body.slug || current.slug, current._id);
  const project = await Project.findByIdAndUpdate(current._id, projectPayload(req.body, slug), {
    returnDocument: 'after',
    runValidators: true,
  });
  res.json({ success: true, data: project });
}

export async function deleteProject(req, res, next) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return next(ApiError.notFound('That project was not found.'));
  await removeMedia(project.thumbnail);
  await Promise.all(project.gallery.map((url) => removeMedia(url)));
  res.json({ success: true, data: { deleted: true } });
}

export async function uploadThumbnail(req, res, next) {
  if (!req.file) return next(ApiError.badRequest('Choose an image to upload.'));
  const project = await Project.findById(req.params.id);
  if (!project) return next(ApiError.notFound('That project was not found.'));
  const url = await storeImage(req.file.buffer, req.file.originalname);
  const previous = project.thumbnail;
  project.thumbnail = url;
  await project.save();
  if (previous && previous !== url) await removeMedia(previous);
  res.json({ success: true, data: project });
}

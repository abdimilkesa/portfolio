import { Experience } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asBoolean, emptyToNull } from '../utils/values.js';

function experiencePayload(body) {
  const current = asBoolean(body.current);
  return {
    title: body.title,
    organization: body.organization,
    description: body.description || '',
    type: body.type || 'experience',
    startDate: emptyToNull(body.startDate),
    endDate: current ? null : emptyToNull(body.endDate),
    current,
  };
}

export async function listExperience(_req, res) {
  const entries = await Experience.find().sort({ current: -1, startDate: -1, createdAt: -1 });
  res.json({ success: true, data: entries });
}

export async function createExperience(req, res) {
  const entry = await Experience.create(experiencePayload(req.body));
  res.status(201).json({ success: true, data: entry });
}

export async function updateExperience(req, res, next) {
  const entry = await Experience.findByIdAndUpdate(req.params.id, experiencePayload(req.body), {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!entry) return next(ApiError.notFound('That timeline entry was not found.'));
  res.json({ success: true, data: entry });
}

export async function deleteExperience(req, res, next) {
  const entry = await Experience.findByIdAndDelete(req.params.id);
  if (!entry) return next(ApiError.notFound('That timeline entry was not found.'));
  res.json({ success: true, data: { deleted: true } });
}

import { Skill } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

function skillPayload(body) {
  return {
    name: body.name,
    category: body.category,
    icon: body.icon || '',
    displayOrder: Number.isFinite(Number(body.displayOrder)) ? Number(body.displayOrder) : 0,
  };
}

export async function listSkills(_req, res) {
  const skills = await Skill.find().sort({ category: 1, displayOrder: 1, name: 1 });
  res.json({ success: true, data: skills });
}

export async function createSkill(req, res, next) {
  try {
    const skill = await Skill.create(skillPayload(req.body));
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    if (error?.code === 11000) {
      return next(ApiError.conflict('That skill is already in this category.'));
    }
    throw error;
  }
}

export async function updateSkill(req, res, next) {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, skillPayload(req.body), {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!skill) return next(ApiError.notFound('That skill was not found.'));
    res.json({ success: true, data: skill });
  } catch (error) {
    if (error?.code === 11000) {
      return next(ApiError.conflict('That skill is already in this category.'));
    }
    throw error;
  }
}

export async function deleteSkill(req, res, next) {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return next(ApiError.notFound('That skill was not found.'));
  res.json({ success: true, data: { deleted: true } });
}

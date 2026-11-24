import { Profile } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { removeMedia, storeDocument, storeImage } from '../services/media.js';

const TEXT_FIELDS = [
  'name',
  'title',
  'statement',
  'summary',
  'biography',
  'mission',
  'university',
  'education',
  'location',
  'currentFocus',
  'careerGoal',
];

function profilePayload(body) {
  const payload = {};
  for (const field of TEXT_FIELDS) {
    if (body[field] !== undefined) payload[field] = body[field];
  }
  if (body.socialLinks && typeof body.socialLinks === 'object') {
    payload.socialLinks = {
      github: body.socialLinks.github || '',
      linkedin: body.socialLinks.linkedin || '',
      x: body.socialLinks.x || '',
      email: body.socialLinks.email || '',
    };
  }
  if (Array.isArray(body.interests)) {
    payload.interests = body.interests
      .map((item) => ({ title: String(item?.title || '').trim(), summary: String(item?.summary || '').trim() }))
      .filter((item) => item.title && item.summary)
      .slice(0, 8);
  }
  return payload;
}

export async function getProfile(_req, res, next) {
  const profile = await Profile.findOne();
  if (!profile) return next(ApiError.notFound('The profile has not been created yet.'));
  res.json({ success: true, data: profile });
}

export async function updateProfile(req, res) {
  const payload = profilePayload(req.body);
  const existing = await Profile.findOne();
  const profile = existing
    ? await Profile.findByIdAndUpdate(existing._id, payload, { returnDocument: 'after', runValidators: true })
    : await Profile.create(payload);
  res.json({ success: true, data: profile });
}

export async function uploadPortrait(req, res, next) {
  if (!req.file) return next(ApiError.badRequest('Choose an image to upload.'));
  const profile = await Profile.findOne();
  if (!profile) return next(ApiError.notFound('Create the profile before uploading a portrait.'));

  const url = await storeImage(req.file.buffer, req.file.originalname);
  const previous = profile.profileImage;
  profile.profileImage = url;
  await profile.save();
  if (previous && previous !== url) await removeMedia(previous);
  res.json({ success: true, data: profile });
}

export async function uploadCv(req, res, next) {
  if (!req.file) return next(ApiError.badRequest('Choose a PDF to upload.'));
  const profile = await Profile.findOne();
  if (!profile) return next(ApiError.notFound('Create the profile before uploading a CV.'));

  const url = await storeDocument(req.file.buffer, req.file.originalname, req.file.mimetype);
  const previous = profile.cvUrl;
  profile.cvUrl = url;
  await profile.save();
  if (previous && previous !== url) await removeMedia(previous);
  res.json({ success: true, data: profile });
}

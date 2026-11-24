import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

function filter(allowed, message) {
  return (_req, file, cb) => {
    if (allowed.has(file.mimetype)) cb(null, true);
    else cb(ApiError.unsupportedMediaType(message));
  };
}

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.uploads.maxImageBytes, files: 1 },
  fileFilter: filter(
    new Set(['image/jpeg', 'image/png', 'image/webp']),
    'Upload a PNG, JPG, or WebP image.',
  ),
}).single('image');

export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.uploads.maxDocumentBytes, files: 1 },
  fileFilter: filter(new Set(['application/pdf']), 'Upload a PDF document.'),
}).single('document');

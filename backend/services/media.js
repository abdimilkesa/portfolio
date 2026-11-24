import mongoose from 'mongoose';
import sharp from 'sharp';
import { ApiError } from '../utils/ApiError.js';

const BUCKET = 'media';

function bucket() {
  if (mongoose.connection.readyState !== 1) {
    throw ApiError.badRequest('File storage is unavailable until the database is connected.');
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET });
}

export function mediaUrl(id) {
  return `/api/media/${id}`;
}

export function mediaIdFromUrl(url) {
  const id = String(url || '').split('/').filter(Boolean).pop();
  return mongoose.isValidObjectId(id) ? id : null;
}

export async function storeImage(buffer, filename) {
  let processed;
  try {
    processed = await sharp(buffer)
      .rotate()
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw ApiError.badRequest('That image could not be processed. Use a PNG, JPG, or WebP file.');
  }

  const id = new mongoose.Types.ObjectId();
  const store = bucket();
  await new Promise((resolve, reject) => {
    const stream = store.openUploadStreamWithId(id, filename || 'image.webp', {
      contentType: 'image/webp',
    });
    stream.on('error', reject);
    stream.on('finish', resolve);
    stream.end(processed);
  });
  return mediaUrl(id);
}

export async function storeDocument(buffer, filename, contentType) {
  const id = new mongoose.Types.ObjectId();
  const store = bucket();
  await new Promise((resolve, reject) => {
    const stream = store.openUploadStreamWithId(id, filename || 'document.pdf', { contentType });
    stream.on('error', reject);
    stream.on('finish', resolve);
    stream.end(buffer);
  });
  return mediaUrl(id);
}

export async function removeMedia(url) {
  const id = mediaIdFromUrl(url);
  if (!id) return;
  await bucket()
    .delete(new mongoose.Types.ObjectId(id))
    .catch(() => {});
}

export async function openMedia(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const store = bucket();
  const objectId = new mongoose.Types.ObjectId(id);
  const files = await store.find({ _id: objectId }).limit(1).toArray();
  if (!files.length) return null;
  return { file: files[0], stream: store.openDownloadStream(objectId) };
}

import mongoose from 'mongoose';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl.split('?')[0]}`));
}

function normalizeError(error) {
  if (error instanceof ApiError) return error;

  if (error instanceof mongoose.Error.ValidationError) {
    return ApiError.validation(
      Object.values(error.errors).map((issue) => ({ field: issue.path, message: issue.message })),
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value provided for "${error.path}".`);
  }

  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || error.keyPattern || {})[0] || 'value';
    return ApiError.conflict(`A record with this ${field} already exists.`, [
      { field, message: `This ${field} is already in use.` },
    ]);
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') return ApiError.payloadTooLarge('The file is too large.');
    return ApiError.badRequest(
      error.code === 'LIMIT_UNEXPECTED_FILE' ? 'Unexpected file field.' : error.message,
    );
  }

  if (error?.type === 'entity.parse.failed') {
    return ApiError.badRequest('The request body contains invalid JSON.');
  }

  if (error?.type === 'entity.too.large') {
    return ApiError.payloadTooLarge('The request body is too large.');
  }

  const statusCode = Number(error?.statusCode || error?.status);
  if (statusCode >= 400 && statusCode < 500) {
    return new ApiError(statusCode, error.message || 'The request could not be processed.');
  }

  return null;
}

// Express recognises error handlers by their four-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, _next) {
  const known = normalizeError(error);
  const statusCode = known?.statusCode ?? 500;

  if (!known) {
    logger.error(`Unhandled error on ${req.method} ${req.originalUrl}:`, error);
  }

  if (res.headersSent) {
    res.end();
    return;
  }

  const body = {
    success: false,
    message: known
      ? known.message
      : env.isProduction
        ? 'Something went wrong on our side. Please try again later.'
        : error?.message || 'Internal server error',
  };

  if (known?.errors) body.errors = known.errors;
  if (!known && !env.isProduction && error?.stack) body.stack = error.stack;

  res.status(statusCode).json(body);
}

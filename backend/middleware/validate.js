import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((issue) => ({
    field: String(issue.path || 'form'),
    message: issue.msg,
  }));
  next(ApiError.validation(errors));
}

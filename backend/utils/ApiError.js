/**
 * An error that is safe to show to API clients. Anything that is not an
 * ApiError is treated as unexpected and its details are hidden in production.
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    if (errors?.length) this.errors = errors;
  }

  static badRequest(message = 'The request could not be processed.', errors) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Please sign in to continue.') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You do not have permission to perform this action.') {
    return new ApiError(403, message);
  }

  static notFound(message = 'The requested resource was not found.') {
    return new ApiError(404, message);
  }

  static conflict(message, errors) {
    return new ApiError(409, message, errors);
  }

  static payloadTooLarge(message = 'The uploaded content is too large.') {
    return new ApiError(413, message);
  }

  static unsupportedMediaType(message = 'This file type is not supported.') {
    return new ApiError(415, message);
  }

  static validation(errors, message = 'Please correct the highlighted fields.') {
    return new ApiError(422, message, errors);
  }
}

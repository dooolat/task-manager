import ApiError from '../utils/ApiError.js';

const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error?.name === 'ValidationError' && error?.errors) {
    return new ApiError(
      400,
      'Validation failed',
      Object.values(error.errors).map((item) => item.message)
    );
  }

  if (error?.name === 'CastError') {
    return new ApiError(400, `Invalid ${error.path}`);
  }

  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyValue || {})[0] || 'field';
    return new ApiError(409, `${duplicateField} already exists`);
  }

  if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
    return new ApiError(401, 'Invalid or expired token');
  }

  return new ApiError(500, 'Something went wrong');
};

export const errorHandler = (error, _req, res, _next) => {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: normalizedError.message,
    ...(normalizedError.errors?.length ? { errors: normalizedError.errors } : {})
  });
};


import ApiError from '../utils/ApiError.js';
import { verifyAuthToken } from '../services/token.service.js';

export const requireAuth = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.slice(7);
    const payload = verifyAuthToken(token);

    req.userId = payload.userId;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};


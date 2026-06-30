import rateLimit from 'express-rate-limit';

const createAuthLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message
      });
    }
  });

export const createLoginLimiter = (windowMs = 15 * 60 * 1000, max = 10) =>
  createAuthLimiter({
    windowMs,
    max,
    message: 'Too many login attempts. Please try again later.'
  });

export const createRegisterLimiter = (windowMs = 15 * 60 * 1000, max = 5) =>
  createAuthLimiter({
    windowMs,
    max,
    message: 'Too many registration attempts. Please try again later.'
  });


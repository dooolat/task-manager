import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { createLoginLimiter, createRegisterLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';

const createAuthRoutes = ({ rateLimitWindowMs, rateLimitMax } = {}) => {
  const router = Router();

  router.post(
    '/register',
    createRegisterLimiter(rateLimitWindowMs, rateLimitMax),
    validate({ body: registerSchema }),
    register
  );
  router.post('/login', createLoginLimiter(rateLimitWindowMs, rateLimitMax), validate({ body: loginSchema }), login);

  return router;
};

export default createAuthRoutes;

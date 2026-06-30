import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(5000),
  MONGODB_URI: Joi.string().required().messages({
    'string.empty': 'MONGODB_URI is required'
  }),
  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.empty': 'JWT_SECRET is required',
    'string.min': 'JWT_SECRET must be at least 32 characters long'
  }),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  CLIENT_URL: Joi.string().required().messages({
    'string.empty': 'CLIENT_URL is required'
  }),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().integer().positive().default(60)
}).unknown(true);

let cachedEnvironment = null;

const normalizeOrigins = (value) =>
  value
    .split(',')
    .map((origin) => {
      const trimmedOrigin = origin.trim();

      if (!trimmedOrigin) {
        return null;
      }

      try {
        return new URL(trimmedOrigin).origin;
      } catch {
        throw new Error(`CLIENT_URL contains an invalid origin: ${trimmedOrigin}`);
      }
    })
    .filter(Boolean);

export const loadEnvironment = () => {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const { value, error } = envSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false
  });

  if (error) {
    const details = error.details.map((detail) => `- ${detail.message.replace(/['"]/g, '')}`).join('\n');
    throw new Error(`Environment validation failed:\n${details}`);
  }

  const allowedOrigins = normalizeOrigins(value.CLIENT_URL);

  if (allowedOrigins.length === 0) {
    throw new Error('Environment validation failed:\n- CLIENT_URL must contain at least one approved origin');
  }

  cachedEnvironment = {
    NODE_ENV: value.NODE_ENV,
    PORT: Number(value.PORT),
    MONGODB_URI: value.MONGODB_URI,
    JWT_SECRET: value.JWT_SECRET,
    JWT_EXPIRES_IN: value.JWT_EXPIRES_IN,
    CLIENT_URL: value.CLIENT_URL,
    CLIENT_ORIGINS: allowedOrigins,
    RATE_LIMIT_WINDOW_MS: Number(value.RATE_LIMIT_WINDOW_MS),
    RATE_LIMIT_MAX: Number(value.RATE_LIMIT_MAX)
  };

  return cachedEnvironment;
};


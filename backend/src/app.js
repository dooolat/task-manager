import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mountRoutes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';

export const createApp = ({ corsOrigins = [], nodeEnv = 'development', authRateLimit = {} } = {}) => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  if (nodeEnv === 'development') {
    app.use(morgan('dev'));
  } else if (nodeEnv === 'production') {
    app.use(morgan('combined'));
  }

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Task Manager API is running'
    });
  });

  mountRoutes(app, { authRateLimit });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;

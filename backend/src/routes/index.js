import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import profileRoutes from './profile.routes.js';
import taskRoutes from './task.routes.js';

const mountRoutes = (app, options = {}) => {
  app.use(authRoutes(options.authRateLimit));
  app.use(profileRoutes);
  app.use(taskRoutes);
  app.use(categoryRoutes);
};

export default mountRoutes;

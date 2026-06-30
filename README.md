# Task Manager Full-Stack App

A production-ready task manager built for the **Industry Practice Project for Military Practice Students**.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** Joi
- **Environment:** dotenv

## Features

- JWT register, login, and profile endpoints
- Protected CRUD APIs for tasks and categories
- Search, status filter, priority filter, and pagination for tasks
- Dashboard stats for total, completed, pending, and high-priority tasks
- Responsive UI for desktop, tablet, and mobile
- Light and dark mode
- Local storage for token, filter state, and search state
- Centralized backend error handling
- Security hardening with CORS allowlisting, rate limiting, helmet, and compression
- Startup validation for required environment variables

## Project Structure

```txt
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    validators/

frontend/
  src/
    components/
    context/
    hooks/
    pages/
    services/
    styles/
    utils/
```

## Environment Variables

Copy the example files before running the app:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

Do not commit real `.env` files to GitHub and do not include them in LMS submissions. Only submit `.env.example` files with template values.

### Backend variables

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV`
- `CLIENT_URL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_manager
JWT_SECRET=change_this_to_a_very_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=60
```

### Frontend variables

- `VITE_API_URL`

Example:

```env
VITE_API_URL=http://localhost:5000
```

### Environment validation

The backend validates required environment variables on startup. If a variable is missing or invalid, the server exits with a clear error message instead of starting in a broken state.

## Local Setup

### Root workspace setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment files:

   ```bash
   copy backend\.env.example backend\.env
   copy frontend\.env.example frontend\.env
   ```

3. Add a real MongoDB Atlas connection string to `backend/.env`.

4. Run the backend:

   ```bash
   npm run dev --workspace backend
   ```

5. In a second terminal, run the frontend:

   ```bash
   npm run dev --workspace frontend
   ```

6. Open the frontend:

   - `http://localhost:5173`

### Separate folder setup

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

### Convenience command

From the repository root, you can also run both apps together:

```bash
npm run dev
```

## Production Commands

- Backend: `npm run start --workspace backend`
- Frontend build: `npm run build --workspace frontend`

## Deployment

### Live Links

- Frontend: https://task-manager-frontend-coral-rho.vercel.app
- Backend API: https://task-manager-backend-i9ac.onrender.com

### Screenshots

#### Login

![Login page](docs/screenshots/login.jpg)

#### Registration

![Registration page](docs/screenshots/register.jpg)

#### Dashboard

![Dashboard page](docs/screenshots/dashboard.jpg)

#### Tasks

![Tasks page](docs/screenshots/tasks.jpg)

#### Categories

![Categories page](docs/screenshots/categories.jpg)

#### Profile

![Profile page](docs/screenshots/profile.jpg)

### Database on MongoDB Atlas

1. Create a MongoDB Atlas account and cluster.
2. Create a database user with a strong password.
3. Add the required network access rule for your deployment provider.
4. Copy the connection string and set it as `MONGODB_URI`.
5. Use a database name such as `task_manager`.

### Backend on Render

The repository includes `render.yaml` for Render deployment.

1. Create a new Render web service from this repository.
2. Set the backend root directory to `backend` if configuring manually.
3. Add these environment variables on Render:

   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `PORT` if your Render service requires it
   - `JWT_EXPIRES_IN`
   - `RATE_LIMIT_WINDOW_MS`
   - `RATE_LIMIT_MAX`

4. Use these commands if configuring manually:

   ```bash
   npm install
   npm run start
   ```

5. Set `CLIENT_URL` to the deployed Vercel frontend URL so CORS only accepts approved origins.

### Frontend on Vercel

The repository includes `frontend/vercel.json` for SPA routing.

1. Import the repository into Vercel.
2. Set the project root to `frontend`.
3. Add this environment variable on Vercel:

   - `VITE_API_URL`

4. Set `VITE_API_URL` to the deployed Render backend URL.
5. Use this build command:

   ```bash
   npm run build
   ```

6. Deploy with the included rewrite rules so React Router routes resolve correctly.

## API Documentation

### Authentication

#### `POST /register`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

Returns:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {},
    "token": "jwt_token"
  }
}
```

#### `POST /login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### `GET /profile`

Requires `Authorization: Bearer <token>`.

### Tasks

#### `POST /tasks`

```json
{
  "title": "Prepare practice report",
  "description": "Summarize the weekly progress",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-06-30",
  "categoryId": "optional_category_id"
}
```

#### `GET /tasks`

Supports:

- `search`
- `status`
- `priority`
- `page`
- `limit`

Example:

```bash
/tasks?search=project&status=completed&page=1&limit=10
```

#### `GET /tasks/:id`
#### `PUT /tasks/:id`
#### `DELETE /tasks/:id`
#### `GET /tasks/summary`

Returns total, completed, pending, and high-priority counts for the dashboard.

### Categories

#### `POST /categories`

```json
{
  "name": "Study",
  "color": "#4f46e5"
}
```

#### `GET /categories`
#### `PUT /categories/:id`
#### `DELETE /categories/:id`

## Validation Rules

- Email must be valid
- Password must be at least 8 characters and include uppercase, lowercase, and a number
- Task title is required
- Required fields return `400` responses with readable messages

## Security Notes

- JWT tokens are stored in local storage for the frontend session.
- Task filters and search state are also persisted in local storage.
- Authentication routes are rate limited to reduce brute-force attempts.
- Only origins listed in `CLIENT_URL` are allowed by CORS.
- Real `.env` files must stay local and must not be submitted or committed.
- Deleting a category keeps its tasks and clears their category reference.

## Deployment Files

- `render.yaml` configures the backend for Render
- `frontend/vercel.json` configures frontend SPA routing for Vercel

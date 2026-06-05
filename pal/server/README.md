# StudyHub Backend API

Production-ready Node.js + MongoDB API for StudyHub.

## Run Locally

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

## Environment Variables

Create or update `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

Use a managed MongoDB connection string, HTTPS, a strong JWT secret, and a locked-down `CORS_ORIGIN` value in production.

## Project Structure

```text
server/
  config/          environment and database setup
  middleware/      auth, validation, security, logging, error handling
  models/          User, Note
  routes/          REST API routes
  utils/           async and token helpers
  server.js        Express app bootstrap
```

## Core Models

`User`: profile, hashed password, role, course, semester, and saved notes.

`Note`: study note metadata, uploaded files, likes, downloads, and owner details.

## API Endpoints

### Health

`GET /api/health`

Returns server status, uptime, timestamp, and memory usage.

### Authentication

`POST /api/auth/register`

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "password": "password123",
  "course": "B.Tech",
  "semester": 4
}
```

`POST /api/auth/login`

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

`GET /api/auth/me`

Requires `Authorization: Bearer <token>`.

### Users

`GET /api/users/:id`

`PUT /api/users/:id`

`GET /api/users/:id/stats`

Profile updates and stats require authentication. Users can update their own profile; admins can update any profile.

### Notes

`GET /api/notes?search=dbms&semester=4&subject=database&course=B.Tech&page=1&limit=20`

`GET /api/notes/:id`

`POST /api/notes`

`PUT /api/notes/:id`

`DELETE /api/notes/:id`

`POST /api/notes/:id/like`

Create, update, delete, and like actions require authentication. Note updates are limited to the owner or admin.

### Global Search

`GET /api/search?q=database&limit=8`

Returns matching notes.

## Security And Operations

Passwords are hashed with bcrypt before save. JWT tokens include `userId`, `email`, and `role`. The API includes request logging, security headers, input sanitization, JSON body limits, CORS configuration, centralized errors, and in-memory rate limiting.

For production, place the API behind HTTPS, use MongoDB Atlas or a managed MongoDB service, set `NODE_ENV=production`, rotate secrets outside source control, and use persistent infrastructure logging/monitoring.

## Verification

```bash
node -e "require('./server')"
npm audit --omit=dev
```

# StudyHub - Complete Setup Guide

## Project Structure

This is a full-stack notes-sharing application with:
- **Frontend**: React with React Router for navigation
- **Backend**: Node.js with Express
- **Database**: MongoDB

```
pal/
├── public/
├── src/
│   ├── api/              # API service functions
│   ├── components/       # Reusable components
│   │   ├── Layout.js     # Main layout wrapper
│   │   ├── Navbar.js     # Navigation bar
│   │   ├── Footer.js
│   │   ├── NoteCard.js
│   │   └── Sidebar.js
│   ├── context/          # React Context (Authentication)
│   │   └── AuthContext.js
│   ├── pages/            # Page components
│   ├── styles/           # CSS files
│   └── App.js
├── server/               # Backend server
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/           # API endpoints
│   │   ├── auth.js       # Authentication routes
│   │   ├── notes.js      # Notes CRUD operations
│   │   └── users.js      # User profile routes
│   ├── middleware/       # Custom middleware
│   │   └── auth.js       # JWT authentication
│   ├── server.js         # Main server file
│   ├── .env              # Environment variables
│   └── package.json
└── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas cloud)
- npm or yarn

## Installation & Setup

### 1. Frontend Setup

```bash
# Navigate to project root
cd pal

# Install frontend dependencies
npm install

# Add the required environment file
# Create a .env file in pal/ directory
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Install MongoDB community (if using local database)
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: Follow official documentation

# Start MongoDB service (if using local database)
# Windows: mongod
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 3. Environment Variables

**Backend (.env in server/ folder):**
```
MONGODB_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
```

Or for MongoDB Atlas (cloud):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studyhub
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
```

## Running the Application

### Terminal 1 - Backend Server

```bash
cd server
npm run dev
```

Or for production:
```bash
npm start
```

Server runs on: `http://localhost:5000`

### Terminal 2 - Frontend React App

```bash
cd pal
npm start
```

Frontend runs on: `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Login user
- `GET /me` - Get current user (requires token)

### Notes Routes (`/api/notes`)
- `GET /` - Get all notes (with filtering)
- `GET /:id` - Get single note
- `POST /` - Create note (authenticated)
- `PUT /:id` - Update note (authenticated, owner only)
- `DELETE /:id` - Delete note (authenticated, owner only)
- `POST /:id/like` - Like/Unlike note (authenticated)

### Users Routes (`/api/users`)
- `GET /:id` - Get user profile
- `PUT /:id` - Update user profile (authenticated, owner only)

## Key Features Implemented

### ✅ Improved Navigation
- **Navbar Component**: Full React Router integration with dynamic links
- **Conditional Navigation**: Shows different links based on authentication status
- **Layout Wrapper**: Consistent header/footer across pages
- **Responsive Design**: Mobile-friendly navigation menu

### ✅ Authentication System
- **JWT Token-based**: Secure token authentication
- **Context API**: Global auth state management
- **Protected Routes**: Pages accessible only to authenticated users
- **Auto-logout**: Invalid token handling
- **Password Hashing**: bcryptjs for secure password storage

### ✅ MongoDB Integration
- **User Model**: Store user profiles and credentials
- **Note Model**: Store, search, and manage notes
- **Relationships**: MongoDB references between users and notes
- **Indexing**: Optimized queries for search functionality

### ✅ API Services
- **Centralized API**: All backend calls in one service file
- **Error Handling**: Comprehensive error messages
- **Token Management**: Automatic token injection in requests

## Database Setup (MongoDB)

### Using MongoDB Compass (GUI)
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Create database: `studyhub`

### Using MongoDB Atlas (Cloud)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` with your connection string

## Sample API Requests

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "course": "B.Tech",
  "semester": 3
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Note (with token)
```bash
POST http://localhost:5000/api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Database Design",
  "subject": "DBMS",
  "description": "Complete guide to database design",
  "content": "...",
  "course": "B.Tech",
  "semester": 4,
  "tags": ["database", "sql"]
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB is listening on port 27017

### CORS Errors
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Backend has CORS enabled for localhost

### Token Expires
- Token expires in 7 days (configurable in `auth.js` route)
- Clear localStorage and login again
- Check `JWT_SECRET` consistency

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows: netstat -ano | findstr :5000 then taskkill /PID <pid>
# Mac/Linux: lsof -i :5000 then kill -9 <pid>

# Kill process on port 3000 (frontend)
# Windows: netstat -ano | findstr :3000 then taskkill /PID <pid>
# Mac/Linux: lsof -i :3000 then kill -9 <pid>
```

## Next Steps

1. Update login/signup pages to connect with API
2. Update dashboard to fetch user's notes
3. Update MyNotes page to display user notes
4. Implement file upload for notes
5. Add search and filter functionality
6. Deploy to production (Heroku, Vercel, etc.)

## Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Never commit `.env` file
- Implement rate limiting for production
- Use HTTPS for production deployment
- Validate all user inputs on backend

## Dependencies

### Frontend
- react
- react-router-dom
- react-dom

### Backend
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv

## Support & Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [React Router Documentation](https://reactrouter.com)

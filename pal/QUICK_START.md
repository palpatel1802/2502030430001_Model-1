# Quick Start Guide

## 🚀 Fastest Way to Get Started

### Option 1: Using MongoDB Locally

#### Windows
1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB starts automatically

#### Mac
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

### Option 2: Using MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string (looks like `mongodb+srv://...`)
4. Skip MongoDB local installation

## 📦 Installation

### Step 1: Backend Setup
```bash
cd pal/server
npm install
```

### Step 2: Frontend Setup
```bash
cd pal
npm install
```

### Step 3: Create Environment Files

**File: `pal/.env`**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**File: `pal/server/.env`**
```
MONGODB_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=your_secret_key_12345
PORT=5000
```

*If using MongoDB Atlas, replace MONGODB_URI with your connection string*

## ▶️ Running the Application

### Terminal 1: Start Backend
```bash
cd pal/server
npm run dev
```
✅ Backend runs on `http://localhost:5000`

### Terminal 2: Start Frontend
```bash
cd pal
npm start
```
✅ Frontend opens on `http://localhost:3000`

## 🧪 Test the Application

### 1. Register New User
- Go to http://localhost:3000/signup
- Fill in details and submit
- Should redirect to dashboard

### 2. Login
- Go to http://localhost:3000/login
- Use registered credentials
- Should see navbar with your name and navigation options

### 3. Explore Navigation
- Click "Dashboard" - View user dashboard
- Click "Upload" - Upload new notes
- Click "Explore" - Search and browse notes
- Click "My Notes" - View your uploaded notes
- Click "Profile" - Edit user profile
- Click "Logout" - Logout from app

## ✨ What's New

### 🎨 Improved Navigation
- ✅ Dynamic navbar that shows/hides links based on login status
- ✅ Displays user name when logged in
- ✅ Smooth transitions and responsive design
- ✅ Professional gradient styling

### 🔐 Authentication System
- ✅ Secure JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Automatic token management
- ✅ Context-based auth state

### 💾 MongoDB Database
- ✅ User management with secure passwords
- ✅ Note storage with relationships
- ✅ Search and filter capabilities
- ✅ Like/unlike functionality

### 🔌 REST API
- ✅ Complete authentication endpoints
- ✅ Full CRUD for notes
- ✅ User profile management
- ✅ Error handling and validation

## 📂 File Structure

```
pal/
├── public/
├── src/
│   ├── api/
│   │   └── apiService.js      ← API calls here
│   ├── components/
│   │   ├── Layout.js          ← Page wrapper with navbar
│   │   └── Navbar.js          ← Improved navigation
│   ├── context/
│   │   └── AuthContext.js     ← Authentication state
│   ├── pages/
│   │   ├── Login.js           ← Updated with API
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   └── ...
│   ├── styles/
│   │   ├── Navbar.css         ← New styling
│   │   └── ...
│   └── App.js                 ← Updated with auth
├── server/
│   ├── models/
│   │   ├── User.js            ← User schema
│   │   └── Note.js            ← Note schema
│   ├── routes/
│   │   ├── auth.js            ← Auth endpoints
│   │   ├── notes.js           ← Notes endpoints
│   │   └── users.js           ← User endpoints
│   ├── middleware/
│   │   └── auth.js            ← JWT verification
│   ├── server.js              ← Express app
│   ├── .env                   ← Configuration
│   └── package.json
├── SETUP_GUIDE.md             ← Detailed guide
└── package.json
```

## 🐛 Common Issues

### MongoDB not connecting?
- Check MongoDB is running
- Verify MONGODB_URI is correct in `.env`
- Try local: `mongodb://localhost:27017/studyhub`

### Port already in use?
```bash
# Kill process on port 5000
windows: netstat -ano | findstr :5000
mac/linux: lsof -i :5000
```

### CORS errors?
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Frontend should call http://localhost:5000/api

### Can't login?
- Check credentials are correct
- Verify JWT_SECRET is set in .env
- Check server console for errors

## 📚 Next Steps

1. **Update remaining pages** to connect with API
2. **Implement file upload** for notes with cloud storage
3. **Add search** functionality on frontend
4. **Deploy** to production (Heroku, Vercel)
5. **Add more features** like comments, ratings, etc.

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT Guide](https://jwt.io)
- [React Router](https://reactrouter.com)

## ✅ Checklist

- [ ] MongoDB installed/configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env files created with correct values
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Navbar shows user info when logged in
- [ ] Can navigate between pages

Once all checked, your StudyHub is ready! 🎉

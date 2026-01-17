# Velion DKN - Frontend

React frontend for the Digital Knowledge Network system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create `.env` file:
```bash
cp .env.example .env
```

Configure API URL (defaults to http://localhost:5000/api):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm start
```

App will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Features

- **Authentication** - Login/Register with JWT
- **Dashboard** - Overview with stats and recent activity
- **Documents** - Browse, search, filter, upload, download
- **Leaderboard** - Top contributors ranking
- **Experts** - Find colleagues by expertise
- **Responsive Design** - Works on desktop and mobile

## Pages

- `/login` - User login
- `/register` - New user registration
- `/` - Dashboard (protected)
- `/documents` - Document repository (protected)
- `/documents/:id` - Document details (protected)
- `/upload` - Upload new document (protected)
- `/leaderboard` - Knowledge leaderboard (protected)
- `/experts` - Expert directory (protected)

## Tech Stack

- React 18
- React Router v6
- Axios
- React Icons
- React Toastify
- CSS Variables

## Project Structure

```
src/
├── components/
│   └── Navbar.js          # Navigation bar
├── context/
│   └── AuthContext.js     # Authentication state
├── pages/
│   ├── Dashboard.js       # Main dashboard
│   ├── Documents.js       # Document list
│   ├── DocumentDetail.js  # Single document
│   ├── UploadDocument.js  # Upload form
│   ├── Leaderboard.js     # Top contributors
│   ├── Experts.js         # Expert directory
│   ├── Login.js           # Login page
│   └── Register.js        # Registration
├── services/
│   └── api.js             # Axios configuration
├── App.css                # Global styles
├── App.js                 # Main app component
└── index.js               # Entry point
```

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Deployment

Deploy to Netlify, Vercel, or any static hosting:

1. Build the app: `npm run build`
2. Upload `build/` folder
3. Set `REACT_APP_API_URL` environment variable to your backend URL
4. Configure redirects for SPA routing

Example `_redirects` file for Netlify:
```
/*    /index.html   200
```

# 🚀 Dayflow HRMS - Live Project Links

## ✅ Project Status: RUNNING

### 🌐 Frontend (React + Vite)
**Status:** ✅ LIVE and Running
- **Main URL:** http://localhost:5173
- **Landing Page:** http://localhost:5173
- **Login Page:** http://localhost:5173/login
- **Register Page:** http://localhost:5173/register
- **Dashboard:** http://localhost:5173/dashboard (after login)

### 🔧 Backend API (Node.js + Express)
**Status:** ⚠️ Starting (may need MongoDB)
- **API Base URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **API Docs:** http://localhost:5000

---

## 📋 Quick Start Guide

### 1. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

### 2. First Time Setup
1. **Register a new account** at http://localhost:5173/register
2. **Login** at http://localhost:5173/login
3. **Explore the dashboard** with modern UI features

### 3. Backend Requirements
- **MongoDB:** Required for database operations
  - If not running, start MongoDB: `mongod`
  - Or use MongoDB Atlas (cloud) and update `MONGO_URI` in `server/.env`
- **Redis:** Optional (for caching, app works without it)

---

## 🎨 Features Available

### ✅ Frontend Features
- Modern landing page with hero section
- Dark/Light mode toggle
- Real-time notifications
- KPI dashboard with charts
- Attendance heat-map visualization
- Leave trend charts
- Responsive mobile-first design

### ✅ Backend Features
- JWT authentication
- Role-based access control (RBAC)
- Biometric/Geo-fenced attendance
- Automated payroll with tax calculation
- PDF payslip generation
- Performance appraisal with OKRs
- AI-based predictions
- Audit logs
- File versioning

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance
- `POST /api/attendance/checkin` - Check in with location
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance` - Get attendance records

### Payroll
- `POST /api/payroll/calculate` - Calculate payroll
- `GET /api/payroll` - Get payroll records
- `GET /api/payroll/:id/download` - Download payslip

---

## 🛠️ Troubleshooting

### Frontend Not Loading?
- Check if port 5173 is available
- Restart: `cd client && npm run dev`

### Backend Errors?
- Ensure MongoDB is running
- Check `server/.env` configuration
- View server logs in the backend terminal

### PostCSS/Tailwind Errors?
- Already fixed! Using `postcss.config.cjs`
- Clear cache if needed: `rm -rf client/node_modules/.vite`

---

## 📝 Notes

- Both servers are running in separate PowerShell windows
- Frontend hot-reloads automatically on code changes
- Backend requires MongoDB connection for full functionality
- Redis is optional but recommended for production

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Status:** ✅ Frontend LIVE | ⚠️ Backend Starting


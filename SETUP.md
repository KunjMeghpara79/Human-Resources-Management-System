# Dayflow HRMS - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   # Server
   cd server
   npm install
   
   # Client
   cd ../client
   npm install
   ```

2. **Configure Environment**
   - Copy `server/.env.example` to `server/.env`
   - Update MongoDB URI and JWT secret

3. **Start MongoDB & Redis**
   ```bash
   # MongoDB (if not running as service)
   mongod
   
   # Redis (if not running as service)
   redis-server
   ```

4. **Run the Application**
   ```bash
   # From root directory
   npm run dev
   ```

   Or separately:
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev
   
   # Terminal 2 - Client
   cd client && npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Landing Page: http://localhost:5173/ (or /landing)

## Features Overview

### ✅ Completed Features

1. **Modern UI**
   - ✅ Landing page with hero section
   - ✅ Modern dashboard with KPI cards
   - ✅ Attendance heat-map visualization
   - ✅ Leave trend charts
   - ✅ Dark/Light mode toggle
   - ✅ Responsive mobile-first design
   - ✅ Real-time notifications

2. **Advanced Attendance**
   - ✅ Biometric attendance support
   - ✅ Geo-fenced check-in/check-out
   - ✅ Location tracking
   - ✅ Remote work mode tracking

3. **Automated Payroll**
   - ✅ Tax slab calculation
   - ✅ Automated payroll processing
   - ✅ PDF payslip generation
   - ✅ Background job processing

4. **Performance Management**
   - ✅ OKR-based performance tracking
   - ✅ Peer feedback system
   - ✅ Manager reviews
   - ✅ Self-assessments

5. **AI Predictions**
   - ✅ Leave pattern prediction
   - ✅ Attrition risk assessment
   - ✅ Factor-based analysis

6. **Organization Management**
   - ✅ Hierarchical structure
   - ✅ Reporting relationships
   - ✅ Department/Team management

7. **Security & Compliance**
   - ✅ JWT authentication
   - ✅ RBAC with granular permissions
   - ✅ Audit logs
   - ✅ File versioning

8. **Infrastructure**
   - ✅ Redis caching
   - ✅ Bull queue for background jobs
   - ✅ Socket.io for real-time updates
   - ✅ RESTful microservice architecture

## API Testing

Use tools like Postman or Thunder Client to test the API endpoints.

### Example API Calls

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Check In (with geo-location):**
```bash
POST http://localhost:5000/api/attendance/checkin
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "workMode": "OFFICE"
}
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check service status
- Verify MONGO_URI in `.env` file

### Redis Connection Issues
- Redis is optional but recommended for caching
- If Redis is not available, the app will work but without caching
- To install Redis: `brew install redis` (Mac) or download from redis.io

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Find process
  lsof -i :5000
  # Kill process
  kill -9 <PID>
  ```

### Module Not Found Errors
- Run `npm install` in both server and client directories
- Delete `node_modules` and `package-lock.json`, then reinstall

## Production Deployment

1. **Build Client**
   ```bash
   cd client
   npm run build
   ```

2. **Set Environment Variables**
   - Use strong JWT_SECRET
   - Set NODE_ENV=production
   - Configure production MongoDB URI
   - Set up Redis cluster

3. **Start Server**
   ```bash
   cd server
   npm start
   ```

4. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name hrms-api
   ```

## Next Steps

- Configure email service for notifications
- Set up SSL/TLS certificates
- Configure production database backups
- Set up monitoring and logging
- Configure CI/CD pipeline


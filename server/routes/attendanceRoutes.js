const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

router.post('/checkin', protect, checkPermission('attendance:create:own'), attendanceController.checkIn);
router.post('/checkout', protect, checkPermission('attendance:create:own'), attendanceController.checkOut);
router.get('/', protect, checkPermission('attendance:read:own'), attendanceController.getAttendance);
router.get('/all', protect, checkPermission('attendance:read'), attendanceController.getAllAttendance);

module.exports = router;

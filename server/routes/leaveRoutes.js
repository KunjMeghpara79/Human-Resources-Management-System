const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, applyLeave)
    .get(protect, admin, getAllLeaves);

router.get('/my', protect, getMyLeaves);
router.put('/:id', protect, admin, updateLeaveStatus);

module.exports = router;

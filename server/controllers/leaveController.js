const LeaveRequest = require('../models/LeaveRequest');

// @desc    Apply for Leave
// @route   POST /api/leave
// @access  Private
const applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    try {
        const leave = await LeaveRequest.create({
            user: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Leave Requests
// @route   GET /api/leave/my
// @access  Private
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Leave Requests (Admin)
// @route   GET /api/leave
// @access  Private/Admin
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Leave Status (Approve/Reject)
// @route   PUT /api/leave/:id
// @access  Private/Admin
const updateLeaveStatus = async (req, res) => {
    const { status, adminComment } = req.body;

    try {
        const leave = await LeaveRequest.findById(req.params.id);

        if (leave) {
            leave.status = status;
            if (adminComment) {
                leave.adminComment = adminComment;
            }
            const updatedLeave = await leave.save();
            res.json(updatedLeave);
        } else {
            res.status(404).json({ message: 'Leave request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };

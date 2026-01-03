const Payroll = require('../models/Payroll');
const { calculatePayroll } = require('../services/payrollService');
const { payslipQueue } = require('../config/queue');
const { cacheGet, cacheSet } = require('../config/redis');

// Calculate and process payroll
exports.calculatePayroll = async (req, res) => {
    try {
        const { userId, month, year } = req.body;

        const payroll = await calculatePayroll(userId, month, year);

        // Queue payslip generation
        await payslipQueue.add({
            payrollId: payroll._id
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            }
        });

        res.json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payroll with caching
exports.getPayroll = async (req, res) => {
    try {
        const userId = req.user._id;
        const { month, year } = req.query;

        const cacheKey = `payroll:${userId}:${month}:${year}`;
        let payroll = await cacheGet(cacheKey);

        if (!payroll) {
            payroll = await Payroll.findOne({ user: userId, month, year })
                .populate('user', 'name email department jobTitle');
            
            if (payroll) {
                await cacheSet(cacheKey, payroll, 3600);
            }
        }

        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }

        res.json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all payrolls (admin)
exports.getAllPayrolls = async (req, res) => {
    try {
        const { month, year } = req.query;
        const query = {};

        if (month) query.month = month;
        if (year) query.year = year;

        const payrolls = await Payroll.find(query)
            .populate('user', 'name email department')
            .sort({ year: -1, month: -1 });

        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Download payslip
exports.downloadPayslip = async (req, res) => {
    try {
        const { payrollId } = req.params;
        const payroll = await Payroll.findById(payrollId);

        if (!payroll || !payroll.payslipPath) {
            return res.status(404).json({ message: 'Payslip not found' });
        }

        // Check if user has permission
        if (req.user.role !== 'ADMIN' && req.user.role !== 'HR' && 
            payroll.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.download(payroll.payslipPath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

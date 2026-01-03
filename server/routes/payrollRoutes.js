const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

router.post('/calculate', protect, checkPermission('payroll:create'), payrollController.calculatePayroll);
router.get('/', protect, checkPermission('payroll:read'), payrollController.getPayroll);
router.get('/all', protect, checkPermission('payroll:read'), payrollController.getAllPayrolls);
router.get('/:payrollId/download', protect, checkPermission('payroll:read'), payrollController.downloadPayslip);

module.exports = router;

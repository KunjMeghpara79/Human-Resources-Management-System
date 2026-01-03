const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const auditController = require('../controllers/auditController');

router.use(protect);

router.get('/', checkPermission('audit:read'), auditController.getAuditLogs);
router.get('/:id', checkPermission('audit:read'), auditController.getAuditLog);

module.exports = router;


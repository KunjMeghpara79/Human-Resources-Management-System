const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const performanceController = require('../controllers/performanceController');

router.use(protect);

router.post('/', checkPermission('performance:create'), performanceController.createPerformance);
router.get('/', checkPermission('performance:read'), performanceController.getPerformances);
router.get('/:id', checkPermission('performance:read'), performanceController.getPerformance);
router.put('/:id', checkPermission('performance:update'), performanceController.updatePerformance);
router.post('/:id/okrs', checkPermission('performance:update'), performanceController.addOKR);
router.post('/:id/peer-feedback', checkPermission('performance:update'), performanceController.addPeerFeedback);

module.exports = router;


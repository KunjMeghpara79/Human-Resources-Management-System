const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const organizationController = require('../controllers/organizationController');

router.use(protect);

router.get('/hierarchy', checkPermission('organization:read'), organizationController.getHierarchy);
router.get('/:id', checkPermission('organization:read'), organizationController.getOrganization);
router.post('/', checkPermission('organization:create'), organizationController.createOrganization);
router.put('/:id', checkPermission('organization:update'), organizationController.updateOrganization);

module.exports = router;


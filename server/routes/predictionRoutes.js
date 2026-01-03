const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const predictionController = require('../controllers/predictionController');

router.use(protect);

router.post('/leave/:employeeId', checkPermission('predictions:create'), predictionController.predictLeave);
router.post('/attrition/:employeeId', checkPermission('predictions:create'), predictionController.predictAttrition);
router.get('/attrition', checkPermission('predictions:read'), predictionController.getAttritionPredictions);
router.get('/leave/:employeeId', checkPermission('predictions:read'), predictionController.getLeavePredictions);

module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const documentController = require('../controllers/documentController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/documents/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.use(protect);

router.post('/', checkPermission('documents:create'), upload.single('file'), documentController.uploadDocument);
router.get('/', checkPermission('documents:read'), documentController.getDocuments);
router.get('/:id', checkPermission('documents:read'), documentController.getDocument);
router.post('/:id/version', checkPermission('documents:update'), upload.single('file'), documentController.addVersion);
router.get('/:id/versions', checkPermission('documents:read'), documentController.getVersions);

module.exports = router;


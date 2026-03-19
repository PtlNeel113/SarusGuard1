const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require('../controllers/pollutionController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/report', authenticate, upload.single('image'), createReport);
router.get('/', getReports);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateReportStatus);

module.exports = router;

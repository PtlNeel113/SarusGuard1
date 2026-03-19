const express = require('express');
const router = express.Router();
const { detectWetland, detectBird, predictDryingRisk, getJobStatus } = require('../controllers/aiController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/wetland-detection', authenticate, authorize('ADMIN', 'RESEARCHER'), detectWetland);
router.post('/bird-detection', authenticate, upload.single('image'), detectBird);
router.get('/drying-risk/:wetland_id', authenticate, predictDryingRisk);
router.get('/job-status/:job_id', authenticate, getJobStatus);

module.exports = router;

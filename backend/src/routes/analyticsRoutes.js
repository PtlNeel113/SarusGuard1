const express = require('express');
const router = express.Router();
const { calculateHealthScore, getDashboardStats } = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

router.get('/health-score/:wetland_id', calculateHealthScore);
router.get('/dashboard/stats', authenticate, getDashboardStats);

module.exports = router;

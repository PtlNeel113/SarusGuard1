const express = require('express');
const router = express.Router();
const { detectEncroachment, getAlerts } = require('../controllers/encroachmentController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/detect', authenticate, authorize('ADMIN', 'RESEARCHER'), 
  upload.fields([{ name: 'before', maxCount: 1 }, { name: 'after', maxCount: 1 }]), 
  detectEncroachment
);
router.get('/alerts', getAlerts);

module.exports = router;

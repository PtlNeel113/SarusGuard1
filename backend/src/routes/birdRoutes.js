const express = require('express');
const router = express.Router();
const { createSighting, getSightings } = require('../controllers/birdController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/sighting', authenticate, upload.single('image'), createSighting);
router.get('/', getSightings);

module.exports = router;

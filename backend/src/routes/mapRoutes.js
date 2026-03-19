const express = require('express');
const router = express.Router();
const { getWetlandsGeoJSON, getBirdSightingsGeoJSON, getPollutionReportsGeoJSON } = require('../controllers/mapController');

router.get('/wetlands', getWetlandsGeoJSON);
router.get('/bird-sightings', getBirdSightingsGeoJSON);
router.get('/pollution-reports', getPollutionReportsGeoJSON);

module.exports = router;

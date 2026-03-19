const express = require('express');
const router = express.Router();
const { getAllWetlands, getWetlandById, createWetland, updateWetland } = require('../controllers/wetlandController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const Joi = require('joi');

const wetlandSchema = Joi.object({
  name: Joi.string().required(),
  district: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  areaSqKm: Joi.number().required(),
  waterLevel: Joi.number().optional(),
  vegetationIndex: Joi.number().optional(),
  healthScore: Joi.number().optional()
});

router.get('/', getAllWetlands);
router.get('/:id', getWetlandById);
router.post('/', authenticate, authorize('ADMIN'), validate(wetlandSchema), createWetland);
router.put('/:id', authenticate, authorize('ADMIN'), updateWetland);

module.exports = router;

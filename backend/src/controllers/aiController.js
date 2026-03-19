const axios = require('axios');
const prisma = require('../config/database');
const { uploadToCloudinary } = require('../config/cloudinary');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

const detectWetland = async (req, res) => {
  try {
    const { wetland_id, start_date, end_date, latitude, longitude, buffer_km } = req.body;

    const response = await axios.post(`${AI_SERVICE_URL}/ai/wetland-detection`, {
      wetland_id,
      start_date,
      end_date,
      latitude,
      longitude,
      buffer_km: buffer_km || 2.0
    }, {
      timeout: 300000 // 5 minutes
    });

    const result = response.data.data;

    // Save detection result to database
    await prisma.wetland.update({
      where: { id: wetland_id },
      data: {
        waterLevel: result.wetland_area_km2,
        healthScore: Math.max(0, 100 - Math.abs(result.change_percentage))
      }
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Wetland detection error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const detectBird = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { latitude, longitude } = req.body;

    // Send image to AI service
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post(
      `${AI_SERVICE_URL}/ai/bird-detection`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000 // 30 seconds
      }
    );

    const result = response.data.data;

    // Save bird sighting to database
    const sighting = await prisma.birdSighting.create({
      data: {
        species: result.species,
        imageUrl: result.image_url,
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        reportedBy: req.user.id,
        verified: result.verified
      }
    });

    res.json({
      success: true,
      data: {
        ...result,
        sighting_id: sighting.id
      }
    });
  } catch (error) {
    console.error('Bird detection error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const predictDryingRisk = async (req, res) => {
  try {
    const { wetland_id } = req.params;

    const response = await axios.get(
      `${AI_SERVICE_URL}/ai/drying-risk/${wetland_id}`,
      { timeout: 10000 }
    );

    const result = response.data.data;

    // Update wetland health score based on risk
    const healthScore = Math.round((1 - result.drying_risk) * 100);
    
    await prisma.wetland.update({
      where: { id: wetland_id },
      data: { healthScore }
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Risk prediction error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getJobStatus = async (req, res) => {
  try {
    const { job_id } = req.params;

    const response = await axios.get(`${AI_SERVICE_URL}/ai/job-status/${job_id}`);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  detectWetland,
  detectBird,
  predictDryingRisk,
  getJobStatus
};

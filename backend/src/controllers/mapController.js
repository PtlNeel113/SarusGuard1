const prisma = require('../config/database');

const getWetlandsGeoJSON = async (req, res) => {
  try {
    const { district, min_health, max_health } = req.query;

    const where = {};
    if (district) where.district = district;
    if (min_health || max_health) {
      where.healthScore = {};
      if (min_health) where.healthScore.gte = parseFloat(min_health);
      if (max_health) where.healthScore.lte = parseFloat(max_health);
    }

    const wetlands = await prisma.wetland.findMany({
      where,
      select: {
        id: true,
        name: true,
        district: true,
        latitude: true,
        longitude: true,
        areaSqKm: true,
        waterLevel: true,
        vegetationIndex: true,
        healthScore: true
      }
    });

    // Convert to GeoJSON format
    const geojson = {
      type: "FeatureCollection",
      features: wetlands.map(wetland => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [wetland.longitude, wetland.latitude]
        },
        properties: {
          id: wetland.id,
          name: wetland.name,
          district: wetland.district,
          area_sq_km: wetland.areaSqKm,
          water_level: wetland.waterLevel,
          vegetation_index: wetland.vegetationIndex,
          health_score: wetland.healthScore || 0
        }
      }))
    };

    res.json(geojson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBirdSightingsGeoJSON = async (req, res) => {
  try {
    const { species, verified, start_date, end_date } = req.query;

    const where = {};
    if (species) where.species = { contains: species, mode: 'insensitive' };
    if (verified !== undefined) where.verified = verified === 'true';
    if (start_date || end_date) {
      where.date = {};
      if (start_date) where.date.gte = new Date(start_date);
      if (end_date) where.date.lte = new Date(end_date);
    }

    const sightings = await prisma.birdSighting.findMany({
      where,
      take: 1000, // Limit for performance
      select: {
        id: true,
        species: true,
        latitude: true,
        longitude: true,
        verified: true,
        confidence: true,
        date: true,
        imageUrl: true
      }
    });

    const geojson = {
      type: "FeatureCollection",
      features: sightings.map(sighting => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [sighting.longitude, sighting.latitude]
        },
        properties: {
          id: sighting.id,
          species: sighting.species,
          verified: sighting.verified,
          confidence: sighting.confidence,
          date: sighting.date,
          image_url: sighting.imageUrl
        }
      }))
    };

    res.json(geojson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPollutionReportsGeoJSON = async (req, res) => {
  try {
    const { pollution_type, status } = req.query;

    const where = {};
    if (pollution_type) where.pollutionType = pollution_type;
    if (status) where.status = status;

    const reports = await prisma.pollutionReport.findMany({
      where,
      take: 1000,
      select: {
        id: true,
        pollutionType: true,
        description: true,
        latitude: true,
        longitude: true,
        status: true,
        imageUrl: true,
        createdAt: true
      }
    });

    const geojson = {
      type: "FeatureCollection",
      features: reports.map(report => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [report.longitude, report.latitude]
        },
        properties: {
          id: report.id,
          pollution_type: report.pollutionType,
          description: report.description,
          status: report.status,
          image_url: report.imageUrl,
          created_at: report.createdAt
        }
      }))
    };

    res.json(geojson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWetlandsGeoJSON,
  getBirdSightingsGeoJSON,
  getPollutionReportsGeoJSON
};

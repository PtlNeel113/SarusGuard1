const prisma = require('../config/database');
const axios = require('axios');
const { getCache, setCache } = require('../config/redis');

const calculateHealthScore = async (req, res) => {
  try {
    const { wetland_id } = req.params;

    const cacheKey = `health:${wetland_id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const [wetland, birdCount, pollutionCount] = await Promise.all([
      prisma.wetland.findUnique({ where: { id: wetland_id } }),
      prisma.birdSighting.count({
        where: {
          latitude: { gte: 0 },
          longitude: { gte: 0 }
        }
      }),
      prisma.pollutionReport.count({
        where: {
          latitude: { gte: 0 },
          longitude: { gte: 0 },
          status: 'APPROVED'
        }
      })
    ]);

    if (!wetland) {
      return res.status(404).json({ error: 'Wetland not found' });
    }

    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/health-score`, {
      water_index: wetland.waterLevel || 0.5,
      vegetation_index: wetland.vegetationIndex || 0.5,
      bird_population: birdCount,
      pollution_reports: pollutionCount
    });

    const healthScore = aiResponse.data.health_score;

    const analytics = await prisma.healthAnalytics.create({
      data: {
        wetlandId: wetland_id,
        waterIndex: wetland.waterLevel || 0.5,
        birdPopulationIndex: Math.min(birdCount / 100, 1),
        pollutionIndex: Math.max(1 - (pollutionCount / 50), 0),
        vegetationIndex: wetland.vegetationIndex || 0.5,
        healthScore
      }
    });

    await prisma.wetland.update({
      where: { id: wetland_id },
      data: { healthScore }
    });

    const result = { wetland, analytics, healthScore };
    await setCache(cacheKey, result, 1800);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const cacheKey = 'dashboard:stats';
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const [
      totalWetlands,
      birdSightings,
      pollutionReports,
      encroachmentAlerts,
      avgHealthScore
    ] = await Promise.all([
      prisma.wetland.count(),
      prisma.birdSighting.count(),
      prisma.pollutionReport.count(),
      prisma.encroachmentAlert.count({ where: { status: 'ACTIVE' } }),
      prisma.wetland.aggregate({
        _avg: { healthScore: true }
      })
    ]);

    const stats = {
      total_wetlands: totalWetlands,
      bird_sightings: birdSightings,
      pollution_reports: pollutionReports,
      encroachment_alerts: encroachmentAlerts,
      health_score_avg: avgHealthScore._avg.healthScore || 0
    };

    await setCache(cacheKey, stats, 300);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { calculateHealthScore, getDashboardStats };

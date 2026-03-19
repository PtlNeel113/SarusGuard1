const prisma = require('../config/database');
const { getCache, setCache, deleteCache } = require('../config/redis');

const getAllWetlands = async (req, res) => {
  try {
    const { page = 1, limit = 10, district } = req.query;
    const skip = (page - 1) * limit;

    const cacheKey = `wetlands:${page}:${limit}:${district || 'all'}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const where = district ? { district } : {};

    const [wetlands, total] = await Promise.all([
      prisma.wetland.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.wetland.count({ where })
    ]);

    const result = {
      wetlands,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    };

    await setCache(cacheKey, result, 600);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWetlandById = async (req, res) => {
  try {
    const { id } = req.params;

    const wetland = await prisma.wetland.findUnique({
      where: { id },
      include: {
        encroachmentAlerts: { take: 5, orderBy: { detectedAt: 'desc' } },
        healthAnalytics: { take: 10, orderBy: { date: 'desc' } }
      }
    });

    if (!wetland) {
      return res.status(404).json({ error: 'Wetland not found' });
    }

    res.json(wetland);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createWetland = async (req, res) => {
  try {
    const wetland = await prisma.wetland.create({
      data: req.body
    });

    await deleteCache('wetlands:*');
    res.status(201).json(wetland);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWetland = async (req, res) => {
  try {
    const { id } = req.params;

    const wetland = await prisma.wetland.update({
      where: { id },
      data: req.body
    });

    await deleteCache('wetlands:*');
    res.json(wetland);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllWetlands, getWetlandById, createWetland, updateWetland };

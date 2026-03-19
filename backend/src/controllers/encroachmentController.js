const axios = require('axios');
const prisma = require('../config/database');
const { uploadToCloudinary } = require('../config/cloudinary');

const detectEncroachment = async (req, res) => {
  try {
    const { wetlandId } = req.body;
    let satelliteBefore, satelliteAfter;

    if (req.files) {
      const beforeResult = await uploadToCloudinary(req.files.before[0].buffer, 'satellite-images');
      const afterResult = await uploadToCloudinary(req.files.after[0].buffer, 'satellite-images');
      
      satelliteBefore = beforeResult.secure_url;
      satelliteAfter = afterResult.secure_url;
    }

    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/detect-encroachment`, {
      before_image: satelliteBefore,
      after_image: satelliteAfter
    });

    const alert = await prisma.encroachmentAlert.create({
      data: {
        wetlandId,
        satelliteBefore,
        satelliteAfter,
        changePercentage: aiResponse.data.change_percentage
      }
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    const { wetlandId, status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (wetlandId) where.wetlandId = wetlandId;
    if (status) where.status = status;

    const [alerts, total] = await Promise.all([
      prisma.encroachmentAlert.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { detectedAt: 'desc' },
        include: {
          wetland: { select: { name: true, district: true } }
        }
      }),
      prisma.encroachmentAlert.count({ where })
    ]);

    res.json({
      alerts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { detectEncroachment, getAlerts };

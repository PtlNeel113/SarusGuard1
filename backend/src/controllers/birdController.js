const prisma = require('../config/database');
const { uploadToCloudinary } = require('../config/cloudinary');

const createSighting = async (req, res) => {
  try {
    const { species, latitude, longitude } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'bird-sightings');
      imageUrl = result.secure_url;
    }

    const sighting = await prisma.birdSighting.create({
      data: {
        species,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        imageUrl,
        reportedBy: req.user.id
      }
    });

    res.status(201).json(sighting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSightings = async (req, res) => {
  try {
    const { species, startDate, endDate, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (species) where.species = { contains: species, mode: 'insensitive' };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [sightings, total] = await Promise.all([
      prisma.birdSighting.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        include: {
          user: { select: { name: true, email: true } }
        }
      }),
      prisma.birdSighting.count({ where })
    ]);

    res.json({
      sightings,
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

module.exports = { createSighting, getSightings };

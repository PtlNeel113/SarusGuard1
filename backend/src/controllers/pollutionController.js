const prisma = require('../config/database');
const { uploadToCloudinary } = require('../config/cloudinary');

const createReport = async (req, res) => {
  try {
    const { pollutionType, description, latitude, longitude } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'pollution-reports');
      imageUrl = result.secure_url;
    }

    const report = await prisma.pollutionReport.create({
      data: {
        pollutionType,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        imageUrl,
        reportedBy: req.user.id
      }
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const { status, pollutionType, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (pollutionType) where.pollutionType = pollutionType;

    const [reports, total] = await Promise.all([
      prisma.pollutionReport.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } }
        }
      }),
      prisma.pollutionReport.count({ where })
    ]);

    res.json({
      reports,
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

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await prisma.pollutionReport.update({
      where: { id },
      data: { status }
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createReport, getReports, updateReportStatus };

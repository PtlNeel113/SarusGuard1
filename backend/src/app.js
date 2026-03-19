const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const wetlandRoutes = require('./routes/wetlandRoutes');
const birdRoutes = require('./routes/birdRoutes');
const pollutionRoutes = require('./routes/pollutionRoutes');
const encroachmentRoutes = require('./routes/encroachmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const mapRoutes = require('./routes/mapRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/wetlands', wetlandRoutes);
app.use('/api/birds', birdRoutes);
app.use('/api/pollution', pollutionRoutes);
app.use('/api/encroachment', encroachmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/maps', mapRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;

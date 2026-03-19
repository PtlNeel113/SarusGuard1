# SarusGuard Backend - Smart Wetland Protection System

Production-ready backend for environmental monitoring platform tracking wetlands, Sarus crane habitats, pollution reports, and encroachment alerts.

## Tech Stack

- Node.js + Express.js
- PostgreSQL + PostGIS
- Prisma ORM
- Redis (caching)
- JWT Authentication
- Cloudinary (image storage)
- Python Flask (AI microservice)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. Start Services

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Docker Deployment

```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get profile

### Wetlands
- GET `/api/wetlands` - List wetlands
- GET `/api/wetlands/:id` - Get wetland details
- POST `/api/wetlands` - Create wetland (Admin)
- PUT `/api/wetlands/:id` - Update wetland (Admin)

### Bird Sightings
- POST `/api/birds/sighting` - Report sighting
- GET `/api/birds` - Get sightings

### Pollution Reports
- POST `/api/pollution/report` - Submit report
- GET `/api/pollution` - Get reports
- PATCH `/api/pollution/:id/status` - Update status (Admin)

### Encroachment Detection
- POST `/api/encroachment/detect` - Detect encroachment
- GET `/api/encroachment/alerts` - Get alerts

### Analytics
- GET `/api/analytics/health-score/:wetland_id` - Calculate health score
- GET `/api/analytics/dashboard/stats` - Dashboard statistics

## AI Service

Start Python microservice:

```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

## License

MIT


## AI Services Integration

SarusGuard now includes three production-ready AI services:

### 1. Real Satellite Wetland Detection
- Google Earth Engine + Sentinel-2 imagery
- NDWI calculation for water body detection
- Tracks wetland area changes over time
- Endpoint: `POST /api/ai/wetland-detection`

### 2. AI Bird Species Identification
- YOLOv8 object detection
- Trained on Cornell Bird Dataset
- Identifies Sarus Crane and other wetland birds
- Endpoint: `POST /api/ai/bird-detection`

### 3. Wetland Drying Risk Prediction
- Random Forest machine learning model
- Analyzes rainfall, vegetation, pollution, temperature
- Provides risk scores and recommendations
- Endpoint: `GET /api/ai/drying-risk/:wetland_id`

### Setup AI Services

```bash
# Navigate to AI service directory
cd ai-service

# Install Python dependencies
pip install -r requirements.txt

# Setup Google Earth Engine
python scripts/setup_gee.py

# Train risk prediction model
python scripts/train_risk_model.py

# Start AI service
uvicorn main:app --reload --port 5000
```

### Run Complete System with Docker

```bash
# Start all services (backend, AI, database, redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### API Examples

**Detect Wetland Changes:**
```bash
curl -X POST http://localhost:3000/api/ai/wetland-detection \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "wetland_id": "uuid",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "latitude": 22.5645,
    "longitude": 72.9289
  }'
```

**Identify Bird Species:**
```bash
curl -X POST http://localhost:3000/api/ai/bird-detection \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@bird_photo.jpg" \
  -F "latitude=22.5645" \
  -F "longitude=72.9289"
```

**Predict Drying Risk:**
```bash
curl http://localhost:3000/api/ai/drying-risk/wetland-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Map Visualization APIs

**Get Wetlands GeoJSON:**
```bash
curl http://localhost:3000/api/maps/wetlands
```

**Get Bird Sightings GeoJSON:**
```bash
curl http://localhost:3000/api/maps/bird-sightings?species=Sarus%20Crane
```

**Get Pollution Reports GeoJSON:**
```bash
curl http://localhost:3000/api/maps/pollution-reports?status=APPROVED
```

### Environment Variables

Add to your `.env` file:

```env
# AI Service
AI_SERVICE_URL=http://localhost:5000

# Google Earth Engine
GEE_SERVICE_ACCOUNT=your-account@project.iam.gserviceaccount.com
GEE_PRIVATE_KEY_FILE=/path/to/key.json

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### System Architecture

```
Frontend (Next.js)
    ↓
Backend API (Node.js/Express) ← JWT Auth, Rate Limiting
    ↓
Redis Queue ← Async Job Processing
    ↓
AI Services (Python/FastAPI)
    ├── Google Earth Engine (Wetland Detection)
    ├── YOLOv8 (Bird Detection)
    └── Random Forest (Risk Prediction)
    ↓
PostgreSQL + PostGIS (Geospatial Data)
Cloudinary/S3 (Image Storage)
```

### Performance Metrics

- Wetland Detection: < 5 minutes
- Bird Detection: < 30 seconds  
- Risk Prediction: < 10 seconds
- API Response: < 200ms (excluding AI processing)
- Concurrent Requests: 100+

### Model Training

See `ai-service/scripts/` for training scripts:
- `train_risk_model.py` - Train Random Forest risk prediction
- `train_bird_model.py` - Fine-tune YOLOv8 on bird dataset
- `setup_gee.py` - Configure Google Earth Engine

### Production Deployment

1. Setup Google Earth Engine service account
2. Configure Cloudinary for image storage
3. Train models with real datasets
4. Deploy with Docker Compose or Kubernetes
5. Enable GPU for faster bird detection (optional)
6. Setup monitoring and logging

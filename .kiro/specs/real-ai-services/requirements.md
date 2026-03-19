# Requirements Document: Real AI Services for SarusGuard

## 1. Feature Overview

Implement three production-ready AI services for the SarusGuard environmental monitoring platform to enable real-time wetland detection, bird species identification, and predictive risk assessment using real datasets and processing pipelines.

## 2. User Stories

### 2.1 Satellite Wetland Detection
**As a** wetland researcher  
**I want to** analyze satellite imagery to detect water bodies and track wetland changes over time  
**So that** I can monitor wetland shrinkage and take conservation action

### 2.2 AI Bird Identification
**As a** citizen scientist  
**I want to** upload bird photos and get automatic species identification  
**So that** I can contribute to biodiversity monitoring without expert knowledge

### 2.3 Wetland Drying Risk Prediction
**As a** conservation officer  
**I want to** see predictive risk scores for wetlands based on environmental data  
**So that** I can prioritize intervention efforts and allocate resources effectively

## 3. Functional Requirements

### 3.1 Satellite Wetland Detection Service

#### 3.1.1 Data Acquisition
- System must fetch Sentinel-2 satellite imagery from Google Earth Engine
- System must support date range queries (start_date, end_date)
- System must support geographic bounding box queries for Anand district
- System must handle 10-meter resolution imagery
- System must access imagery updated every 5 days

#### 3.1.2 NDWI Calculation
- System must calculate Normalized Difference Water Index using formula: (Green - NIR) / (Green + NIR)
- System must use Sentinel-2 Band 3 (Green) and Band 8 (NIR)
- System must classify pixels with NDWI > 0 as water
- System must generate binary water mask raster

#### 3.1.3 Area Calculation
- System must count water pixels in the mask
- System must calculate wetland area using pixel_area = 100m² (10m × 10m)
- System must convert area to square kilometers
- System must compare current area with previous imagery
- System must calculate change percentage: (previous_area - current_area) / previous_area

#### 3.1.4 API Endpoint
- Endpoint: POST /api/ai/wetland-detection
- Request must accept: wetland_id, date_range, coordinates
- Response must include: wetland_area_km2, change_percentage, water_mask_image_url
- System must store water mask images in cloud storage
- System must save detection results to database

### 3.2 AI Bird Detection Service

#### 3.2.1 Model Requirements
- System must support YOLOv8 object detection OR ResNet50 classification
- Model must be trained/fine-tuned on Cornell Bird Dataset
- Model must identify: Sarus Crane, Painted Stork, Black-headed Ibis, Openbill Stork
- Model must achieve minimum 85% confidence threshold for verification

#### 3.2.2 Image Processing
- System must accept image uploads via POST /api/birds/upload
- System must validate image format (JPEG, PNG)
- System must validate image size (max 10MB)
- System must preprocess images for model input
- System must send images to AI service endpoint: /ai/bird-detection

#### 3.2.3 Inference and Results
- System must predict species name with confidence score
- System must return bounding box coordinates for detected birds
- System must mark predictions as verified if confidence >= 0.85
- System must save results to BirdSightings table with fields: species, confidence, image_url, latitude, longitude, reported_by
- Response must include: species, confidence, verified status

### 3.3 Predictive Wetland Drying Risk Service

#### 3.3.1 Data Sources
- System must fetch rainfall data from IMD (India Meteorological Department)
- System must extract water level trends from historical NDWI data
- System must calculate vegetation index (NDVI) from satellite imagery
- System must aggregate pollution reports count from database
- System must aggregate encroachment alerts count from database
- System must fetch temperature data

#### 3.3.2 Feature Engineering
- System must create feature vector with: rainfall_last_30_days, water_area_change, vegetation_index, pollution_count, temperature
- System must normalize features for model input
- System must handle missing data with appropriate defaults

#### 3.3.3 Risk Prediction Model
- System must use Random Forest or Gradient Boosting classifier
- Model must output risk_score between 0 and 1
- System must categorize risk: Low (0-0.33), Moderate (0.34-0.66), High (0.67-1.0)
- System must generate actionable recommendations based on risk level

#### 3.3.4 API Endpoint
- Endpoint: GET /api/ai/drying-risk/:wetland_id
- Response must include: wetland name, drying_risk score, category, recommendation
- System must cache predictions for 24 hours
- System must update predictions when new data is available

### 3.4 Asynchronous Processing

#### 3.4.1 Redis Queue Integration
- System must queue AI processing jobs in Redis
- System must prevent server overload with job throttling
- System must provide job status tracking (pending, processing, completed, failed)
- System must implement retry logic for failed jobs (max 3 retries)
- System must set job timeout (5 minutes for satellite, 30 seconds for bird detection)

### 3.5 Map Visualization API

#### 3.5.1 Geospatial Endpoints
- Endpoint: GET /api/maps/wetlands
- Response must return array of wetlands with: id, name, latitude, longitude, health_score
- System must support filtering by district, health_score range
- System must use PostGIS for efficient geospatial queries
- System must return GeoJSON format for map rendering

## 4. Non-Functional Requirements

### 4.1 Performance
- Satellite detection must complete within 5 minutes
- Bird detection must complete within 30 seconds
- Risk prediction must complete within 10 seconds
- API response time must be < 200ms (excluding AI processing)
- System must handle 100 concurrent requests

### 4.2 Accuracy
- Bird detection model must achieve >= 85% accuracy on test set
- Wetland area calculation must have <= 5% error margin
- Risk prediction model must achieve >= 80% precision

### 4.3 Scalability
- System must support horizontal scaling of AI microservices
- System must handle 10,000 bird detections per day
- System must process 100 wetland analyses per day
- Database must efficiently store 1M+ bird sightings

### 4.4 Security
- All API endpoints must require JWT authentication
- System must implement rate limiting (100 requests/15 minutes per user)
- Image uploads must be validated and sanitized
- System must implement role-based access control (Admin, Researcher, Citizen)
- Sensitive credentials must be stored in environment variables

### 4.5 Reliability
- System must have 99.5% uptime
- Failed jobs must be logged and retryable
- System must gracefully handle Google Earth Engine API failures
- System must provide meaningful error messages to users

### 4.6 Data Storage
- Images must be stored in AWS S3 or Cloudinary
- Geospatial data must be stored in PostgreSQL with PostGIS extension
- System must implement data retention policy (images: 2 years, analytics: 5 years)

## 5. Technical Constraints

### 5.1 Technology Stack
- Backend API: Node.js + Express.js
- AI Microservices: Python + FastAPI
- Database: PostgreSQL 14+ with PostGIS 3.3+
- Message Queue: Redis 7+
- Satellite Data: Google Earth Engine API
- ML Frameworks: TensorFlow 2.x or PyTorch 2.x
- Geospatial Processing: Rasterio, GeoPandas
- Image Storage: AWS S3 or Cloudinary

### 5.2 External Dependencies
- Google Earth Engine account with API access
- Cornell Bird Dataset or equivalent for model training
- IMD weather data API access
- Cloud storage account (AWS S3 or Cloudinary)

### 5.3 Deployment
- Backend must run in Docker containers
- AI services must run in GPU-enabled containers (optional but recommended)
- Database must be hosted on Supabase or AWS RDS
- System must support deployment on Railway, Render, or AWS

## 6. Acceptance Criteria

### 6.1 Satellite Wetland Detection
- [ ] System successfully fetches Sentinel-2 imagery for Anand district coordinates
- [ ] NDWI calculation produces accurate water masks
- [ ] Wetland area is calculated in square kilometers
- [ ] Change percentage is computed by comparing two time periods
- [ ] Water mask images are stored and accessible via URL
- [ ] API returns all required fields in correct format

### 6.2 AI Bird Detection
- [ ] System accepts image uploads and validates format/size
- [ ] Model identifies Sarus Crane with >= 85% confidence
- [ ] Model identifies at least 4 wetland bird species
- [ ] Bounding boxes are returned for detected birds
- [ ] Results are saved to database with all required fields
- [ ] API returns species, confidence, and verification status

### 6.3 Wetland Drying Risk Prediction
- [ ] System aggregates data from 5+ sources (rainfall, NDWI, NDVI, pollution, temperature)
- [ ] Feature vector is correctly constructed and normalized
- [ ] Model predicts risk score between 0 and 1
- [ ] Risk is categorized as Low, Moderate, or High
- [ ] Recommendations are generated based on risk level
- [ ] API returns all required fields

### 6.4 System Integration
- [ ] Redis queue successfully processes async jobs
- [ ] Job status can be tracked and queried
- [ ] Failed jobs are retried up to 3 times
- [ ] Map API returns GeoJSON with wetland locations
- [ ] All endpoints require authentication
- [ ] Rate limiting prevents abuse

### 6.5 Performance and Quality
- [ ] Satellite detection completes within 5 minutes
- [ ] Bird detection completes within 30 seconds
- [ ] Risk prediction completes within 10 seconds
- [ ] System handles 100 concurrent requests
- [ ] Bird detection model achieves >= 85% accuracy
- [ ] System maintains 99.5% uptime

## 7. Out of Scope

- Real-time video stream analysis
- Mobile app development (backend API only)
- Custom satellite imagery sources beyond Google Earth Engine
- Automated drone integration
- Multi-language support (English only)
- Historical data migration from legacy systems

# SarusGuard AI Services

Production-ready AI microservices for environmental monitoring using real datasets and processing pipelines.

## Services

### 1. Wetland Detection Service
- Uses Google Earth Engine and Sentinel-2 satellite imagery
- Calculates NDWI (Normalized Difference Water Index)
- Generates water masks and tracks area changes
- 10-meter resolution, 5-day update frequency

### 2. Bird Detection Service
- YOLOv8-based bird species identification
- Trained on Cornell Bird Dataset
- Detects: Sarus Crane, Painted Stork, Black-headed Ibis, Openbill Stork
- 85%+ confidence threshold for verification

### 3. Wetland Drying Risk Prediction
- Random Forest model for risk assessment
- Analyzes: rainfall, NDWI trends, vegetation, pollution, temperature
- Outputs risk score (0-1) and actionable recommendations

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Setup Google Earth Engine

```bash
python scripts/setup_gee.py
```

### 3. Train Models (Optional)

```bash
# Train risk prediction model
python scripts/train_risk_model.py

# Train bird detection model (requires dataset)
python scripts/train_bird_model.py --dataset /path/to/dataset --epochs 50
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 5. Run Service

```bash
# Development
uvicorn main:app --reload --port 5000

# Production
uvicorn main:app --host 0.0.0.0 --port 5000 --workers 4
```

## API Endpoints

### Wetland Detection
```
POST /ai/wetland-detection
Body: {
  "wetland_id": "uuid",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "latitude": 22.5645,
  "longitude": 72.9289,
  "buffer_km": 2.0
}
```

### Bird Detection
```
POST /ai/bird-detection
Content-Type: multipart/form-data
Body: image file
```

### Drying Risk Prediction
```
GET /ai/drying-risk/{wetland_id}
```

### Job Status
```
GET /ai/job-status/{job_id}
```

## Docker Deployment

```bash
docker build -t sarusguard-ai .
docker run -p 5000:5000 --env-file .env sarusguard-ai
```

## Model Training

### Risk Prediction Model
The Random Forest model requires historical wetland data with features:
- rainfall_last_30_days
- water_area_change
- vegetation_index
- pollution_count
- temperature
- encroachment_count
- water_level_trend

### Bird Detection Model
Fine-tune YOLOv8 on Cornell Bird Dataset or similar:
1. Download dataset
2. Convert to YOLO format
3. Run training script
4. Model saved to `models/bird_yolov8.pt`

## Performance

- Wetland detection: < 5 minutes
- Bird detection: < 30 seconds
- Risk prediction: < 10 seconds

## Requirements

- Python 3.10+
- Google Earth Engine account
- Cloudinary account (for image storage)
- Redis (for job queuing)
- 4GB+ RAM (8GB+ recommended for model training)
- GPU optional but recommended for bird detection

## License

MIT

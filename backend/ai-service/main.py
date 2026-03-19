from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
from dotenv import load_dotenv

from services.wetland_detection import WetlandDetectionService
from services.bird_detection import BirdDetectionService
from services.risk_prediction import RiskPredictionService
from utils.redis_queue import RedisQueue

load_dotenv()

app = FastAPI(title="SarusGuard AI Services", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

wetland_service = WetlandDetectionService()
bird_service = BirdDetectionService()
risk_service = RiskPredictionService()
redis_queue = RedisQueue()

class WetlandDetectionRequest(BaseModel):
    wetland_id: str
    start_date: str
    end_date: str
    latitude: float
    longitude: float
    buffer_km: float = 2.0

class RiskPredictionRequest(BaseModel):
    wetland_id: str

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "SarusGuard AI"}

@app.post("/ai/wetland-detection")
async def detect_wetland(request: WetlandDetectionRequest, background_tasks: BackgroundTasks):
    """
    Detect wetland water bodies using Google Earth Engine and Sentinel-2 imagery.
    Calculates NDWI, generates water mask, and computes area changes.
    """
    try:
        job_id = redis_queue.enqueue_job("wetland_detection", request.dict())
        
        result = await wetland_service.detect_wetland(
            wetland_id=request.wetland_id,
            start_date=request.start_date,
            end_date=request.end_date,
            latitude=request.latitude,
            longitude=request.longitude,
            buffer_km=request.buffer_km
        )
        
        redis_queue.mark_job_complete(job_id, result)
        
        return {
            "job_id": job_id,
            "status": "completed",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/bird-detection")
async def detect_bird(file: UploadFile = File(...)):
    """
    Detect and classify bird species from uploaded images using YOLOv8.
    Returns species name, confidence score, and bounding boxes.
    """
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_bytes = await file.read()
        
        result = await bird_service.detect_bird(image_bytes, file.filename)
        
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/drying-risk/{wetland_id}")
async def predict_drying_risk(wetland_id: str):
    """
    Predict wetland drying risk using Random Forest model.
    Analyzes rainfall, NDWI trends, vegetation, pollution, and temperature.
    """
    try:
        result = await risk_service.predict_risk(wetland_id)
        
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/job-status/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of an async AI processing job"""
    status = redis_queue.get_job_status(job_id)
    if not status:
        raise HTTPException(status_code=404, detail="Job not found")
    return status

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)

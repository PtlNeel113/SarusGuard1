# Design Document: Real AI Services for SarusGuard

## Overview

This design implements three production-ready AI services for the SarusGuard environmental monitoring platform: (1) Real satellite wetland detection using Google Earth Engine and Sentinel-2 imagery with NDWI calculations, (2) AI-powered bird species identification from user-uploaded photos using YOLOv8 or ResNet50 trained on Cornell Bird Dataset, and (3) Predictive wetland drying risk assessment using Random Forest models with multi-source environmental data. The architecture uses Python FastAPI microservices for AI processing, Node.js Express for the backend API gateway, Redis for async job queuing, PostgreSQL with PostGIS for geospatial data storage, and Cloudinary/S3 for image storage. All services process real datasets and produce actionable insights for wetland conservation.

## Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Dashboard]
        MOBILE[Mobile App]
    end
    
    subgraph "API Gateway - Node.js + Express"
        API[Express API Server]
        AUTH[JWT Auth Middleware]
        UPLOAD[Multer Upload Handler]
        RATE[Rate Limiter]
    end
    
    subgraph "Message Queue"
        REDIS[Redis Queue]
    end
    
    subgraph "AI Microservices - Python + FastAPI"
        AI_API[FastAPI Server]
        
        subgraph "Service 1: Satellite Detection"
            GEE[Google Earth Engine Client]
            NDWI[NDWI Calculator]
            MASK[Water Mask Generator]
        end
        
        subgraph "Service 2: Bird Detection"
            YOLO[YOLOv8 Model]
            RESNET[ResNet50 Classifier]
            PREPROCESS[Image Preprocessor]
        end
        
        subgraph "Service 3: Risk Prediction"
            RF[Random Forest Model]
            FEATURE[Feature Extractor]
            WEATHER[Weather Data Fetcher]
        end
    end
    
    subgraph "Data Layer"
        POSTGRES[(PostgreSQL + PostGIS)]
        S3[AWS S3 / Cloudinary]
        GEE_CLOUD[Google Earth Engine Cloud]
    end
    
    WEB --> API
    MOBILE --> API
    API --> AUTH
    API --> UPLOAD
    API --> RATE
    API --> REDIS
    
    REDIS --> AI_API
    
    AI_API --> GEE
    AI_API --> YOLO
    AI_API --> RESNET
    AI_API --> RF
    
    GEE --> GEE_CLOUD
    GEE --> NDWI
    NDWI --> MASK
    
    YOLO --> PREPROCESS
    RESNET --> PREPROCESS
    
    RF --> FEATURE
    FEATURE --> WEATHER
    
    AI_API --> POSTGRES
    AI_API --> S3
    API --> POSTGRES
    UPLOAD --> S3

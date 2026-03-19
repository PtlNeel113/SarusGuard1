# Deployment Guide

## Local Development

1. Install dependencies:
```bash
npm install
cd ai-service && pip install -r requirements.txt
```

2. Setup PostgreSQL with PostGIS:
```bash
docker run --name postgres-postgis -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgis/postgis:15-3.3
```

3. Setup Redis:
```bash
docker run --name redis -p 6379:6379 -d redis:7-alpine
```

4. Run migrations:
```bash
npm run prisma:migrate
```

5. Start services:
```bash
npm run dev
cd ai-service && python app.py
```

## Docker Deployment

```bash
docker-compose up -d
```

## Cloud Deployment (Railway/Render)

1. Connect GitHub repository
2. Add environment variables
3. Deploy PostgreSQL addon
4. Deploy Redis addon
5. Deploy backend service
6. Deploy AI service separately

## Environment Variables

Required:
- DATABASE_URL
- JWT_SECRET
- REDIS_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- AI_SERVICE_URL

## Database Migration

```bash
npx prisma migrate deploy
```

## Health Check

```bash
curl http://localhost:3000/health
curl http://localhost:5000/health
```

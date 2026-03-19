🌍 SarusGuard – Smart Wetland Protection System

AI-powered platform to monitor, analyze, and protect wetlands in real time.

🚨 Problem

Wetlands are rapidly disappearing due to:

Urbanization & encroachment

Pollution & water extraction

Lack of real-time monitoring

Result: Biodiversity loss, declining Sarus crane habitats, and environmental damage.

💡 Solution

SarusGuard provides an end-to-end monitoring system:

🛰️ Satellite wetland detection (NDWI analysis)

🧠 AI bird identification (YOLOv8)

📍 Citizen pollution reporting (GPS + images)

📊 AI-based wetland health score

⚡ Real-time alerts & dashboard

⚡ Key Advantage

Most solutions are fragmented.
We integrate everything:

Detection → Analysis → Action

🏗️ Tech Stack

Frontend: Next.js, Tailwind, Leaflet

Backend: Node.js, Express

Database: PostgreSQL + PostGIS

AI: FastAPI, YOLOv8, TensorFlow/PyTorch

Data: Google Earth Engine, Sentinel-2

🔬 How It Works

1. Satellite data detects wetland changes

2. AI identifies bird species from images

3. Users report pollution with location proof

4. System generates a real-time health score

  🏗️ Project Architecture

Your current structure is decent but not explained — that’s a mistake. Fix it like this:

SarusGuard/
│
├── frontend/ (Next.js App)
│   ├── src/
│   ├── public/
│
├── backend/ (Node.js + Express API)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│
├── ai-services/ (FastAPI Microservices)
│   ├── bird-detection/
│   ├── satellite-analysis/
│
├── database/
│   ├── PostgreSQL + PostGIS
│
├── .env
├── package.json
└── README.md
📊 Market Opportunity

Most teams ignore this — judges don’t.

🌍 50+ countries need monitoring

📈 35% CAGR (environmental tech)

🎯 Target users:

Governments

NGOs

Researchers

Revenue Model

Government SaaS subscriptions

NGO contracts

Environmental analytics API

🚀 Getting Started
1. Clone Repo
git clone https://github.com/PtlNeel113/sarusguard.git
cd sarusguard
2. Install Dependencies
npm install
3. Run Frontend
npm run dev
4. Run Backend
cd backend
npm install
npm start
5. Run AI Services
cd ai-services
uvicorn main:app --reload

🔮 Future Roadmap

🚁 Drone-based monitoring

🌊 IoT water sensors

🌍 Global wetland expansion

🧠 Migration prediction AI

👥 Team

INFINITE CODING

Neel Patel (Leader)

Niraj Sharma

Kaival Solanki

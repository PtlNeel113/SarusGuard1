import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
import httpx
from typing import Dict
from datetime import datetime, timedelta

class RiskPredictionService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'rainfall_last_30_days',
            'water_area_change',
            'vegetation_index',
            'pollution_count',
            'temperature',
            'encroachment_count',
            'water_level_trend'
        ]
        self.initialize_model()
    
    def initialize_model(self):
        """Initialize or load trained Random Forest model"""
        model_path = 'models/risk_prediction_rf.pkl'
        scaler_path = 'models/risk_scaler.pkl'
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            print("Loaded trained risk prediction model")
        else:
            # Initialize new model (will need training)
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            self.scaler = StandardScaler()
            print("Initialized new risk prediction model (needs training)")
    
    async def predict_risk(self, wetland_id: str) -> Dict:
        """
        Predict wetland drying risk based on multiple environmental factors.
        
        Args:
            wetland_id: Unique identifier for the wetland
            
        Returns:
            Dictionary with risk score, category, and recommendations
        """
        try:
            # Gather features from multiple sources
            features = await self._gather_features(wetland_id)
            
            # Prepare feature vector
            feature_vector = self._prepare_features(features)
            
            # Make prediction
            if self.model and hasattr(self.model, 'predict_proba'):
                risk_score = self.model.predict_proba(feature_vector)[0][1]
            else:
                # Fallback: calculate risk using weighted formula
                risk_score = self._calculate_risk_heuristic(features)
            
            # Categorize risk
            risk_category = self._categorize_risk(risk_score)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(risk_score, features)
            
            return {
                "wetland_id": wetland_id,
                "wetland_name": features.get('wetland_name', 'Unknown'),
                "drying_risk": round(risk_score, 3),
                "risk_category": risk_category,
                "recommendation": recommendations,
                "features": features,
                "analysis_date": datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Risk prediction failed: {str(e)}")
    
    async def _gather_features(self, wetland_id: str) -> Dict:
        """
        Gather features from multiple data sources.
        
        Returns:
            Dictionary of feature values
        """
        backend_url = os.getenv('BACKEND_URL', 'http://localhost:3000')
        
        features = {
            'wetland_id': wetland_id,
            'wetland_name': 'Unknown'
        }
        
        try:
            async with httpx.AsyncClient() as client:
                # Get wetland details
                wetland_response = await client.get(f'{backend_url}/api/wetlands/{wetland_id}')
                if wetland_response.status_code == 200:
                    wetland_data = wetland_response.json()
                    features['wetland_name'] = wetland_data.get('name', 'Unknown')
                    features['vegetation_index'] = wetland_data.get('vegetationIndex', 0.5)
                    features['water_level_trend'] = wetland_data.get('waterLevel', 0.5)
                
                # Get pollution reports count
                pollution_response = await client.get(
                    f'{backend_url}/api/pollution',
                    params={'wetland_id': wetland_id}
                )
                if pollution_response.status_code == 200:
                    pollution_data = pollution_response.json()
                    features['pollution_count'] = len(pollution_data.get('reports', []))
                else:
                    features['pollution_count'] = 0
                
                # Get encroachment alerts count
                encroachment_response = await client.get(
                    f'{backend_url}/api/encroachment/alerts',
                    params={'wetlandId': wetland_id}
                )
                if encroachment_response.status_code == 200:
                    encroachment_data = encroachment_response.json()
                    features['encroachment_count'] = len(encroachment_data.get('alerts', []))
                else:
                    features['encroachment_count'] = 0
                
        except Exception as e:
            print(f"Error fetching backend data: {e}")
            features['pollution_count'] = 0
            features['encroachment_count'] = 0
        
        # Fetch weather data (rainfall and temperature)
        weather_data = await self._fetch_weather_data(wetland_id)
        features['rainfall_last_30_days'] = weather_data.get('rainfall', 50.0)
        features['temperature'] = weather_data.get('temperature', 30.0)
        
        # Calculate water area change from historical data
        features['water_area_change'] = await self._calculate_water_area_change(wetland_id)
        
        return features
    
    async def _fetch_weather_data(self, wetland_id: str) -> Dict:
        """
        Fetch weather data from IMD or weather API.
        For production, integrate with actual IMD API.
        """
        # Placeholder: In production, fetch from IMD API
        # For now, return simulated data
        return {
            'rainfall': np.random.uniform(20, 100),  # mm in last 30 days
            'temperature': np.random.uniform(25, 40)  # Celsius
        }
    
    async def _calculate_water_area_change(self, wetland_id: str) -> float:
        """
        Calculate water area change from historical NDWI data.
        Returns percentage change (negative means shrinking).
        """
        # Placeholder: In production, query historical wetland detection results
        # For now, return simulated change
        return np.random.uniform(-30, 10)  # Percentage change
    
    def _prepare_features(self, features: Dict) -> np.ndarray:
        """
        Prepare feature vector for model input.
        
        Returns:
            Normalized feature array
        """
        feature_vector = np.array([[
            features.get('rainfall_last_30_days', 50.0),
            features.get('water_area_change', 0.0),
            features.get('vegetation_index', 0.5),
            features.get('pollution_count', 0),
            features.get('temperature', 30.0),
            features.get('encroachment_count', 0),
            features.get('water_level_trend', 0.5)
        ]])
        
        # Normalize features
        if self.scaler and hasattr(self.scaler, 'transform'):
            try:
                feature_vector = self.scaler.transform(feature_vector)
            except:
                pass  # Use raw features if scaler not fitted
        
        return feature_vector
    
    def _calculate_risk_heuristic(self, features: Dict) -> float:
        """
        Calculate risk score using weighted heuristic formula.
        Used as fallback when model is not trained.
        """
        # Normalize and weight each factor
        rainfall_score = max(0, 1 - (features.get('rainfall_last_30_days', 50) / 100))
        water_change_score = max(0, -features.get('water_area_change', 0) / 50)
        vegetation_score = 1 - features.get('vegetation_index', 0.5)
        pollution_score = min(1, features.get('pollution_count', 0) / 20)
        temperature_score = max(0, (features.get('temperature', 30) - 25) / 20)
        encroachment_score = min(1, features.get('encroachment_count', 0) / 10)
        
        # Weighted average
        risk_score = (
            rainfall_score * 0.25 +
            water_change_score * 0.25 +
            vegetation_score * 0.15 +
            pollution_score * 0.15 +
            temperature_score * 0.10 +
            encroachment_score * 0.10
        )
        
        return min(1.0, max(0.0, risk_score))
    
    def _categorize_risk(self, risk_score: float) -> str:
        """Categorize risk score into Low, Moderate, or High"""
        if risk_score < 0.33:
            return "Low"
        elif risk_score < 0.67:
            return "Moderate"
        else:
            return "High"
    
    def _generate_recommendations(self, risk_score: float, features: Dict) -> str:
        """Generate actionable recommendations based on risk factors"""
        recommendations = []
        
        if risk_score >= 0.67:
            recommendations.append("URGENT: Immediate intervention required")
        
        if features.get('rainfall_last_30_days', 50) < 30:
            recommendations.append("Low rainfall detected - monitor water levels closely")
        
        if features.get('water_area_change', 0) < -15:
            recommendations.append("Significant water loss detected - investigate causes")
        
        if features.get('pollution_count', 0) > 5:
            recommendations.append("High pollution levels - implement cleanup measures")
        
        if features.get('encroachment_count', 0) > 3:
            recommendations.append("Multiple encroachment alerts - enforce protection measures")
        
        if features.get('vegetation_index', 0.5) < 0.3:
            recommendations.append("Low vegetation health - consider restoration programs")
        
        if not recommendations:
            recommendations.append("Continue regular monitoring and maintenance")
        
        return " | ".join(recommendations)
    
    def train_model(self, training_data_path: str):
        """
        Train Random Forest model on historical wetland data.
        This should be run separately during model preparation.
        """
        try:
            # Load training data
            df = pd.read_csv(training_data_path)
            
            X = df[self.feature_names]
            y = df['risk_label']  # 0 = low risk, 1 = high risk
            
            # Fit scaler
            self.scaler.fit(X)
            X_scaled = self.scaler.transform(X)
            
            # Train model
            self.model.fit(X_scaled, y)
            
            # Save model and scaler
            os.makedirs('models', exist_ok=True)
            joblib.dump(self.model, 'models/risk_prediction_rf.pkl')
            joblib.dump(self.scaler, 'models/risk_scaler.pkl')
            
            print("Model training completed and saved")
            
        except Exception as e:
            print(f"Model training failed: {e}")
            raise

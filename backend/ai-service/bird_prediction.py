import numpy as np
from sklearn.preprocessing import MinMaxScaler

def predict_habitat_suitability(bird_sightings, wetland_health):
    """Predict habitat suitability based on bird sightings and wetland health"""
    
    num_sightings = len(bird_sightings) if isinstance(bird_sightings, list) else bird_sightings
    
    sighting_score = min(num_sightings / 50, 1.0) * 40
    health_score = wetland_health * 60
    
    suitability_score = sighting_score + health_score
    
    recommendations = []
    
    if suitability_score < 40:
        recommendations.append("Critical: Immediate conservation action required")
        recommendations.append("Increase water quality monitoring")
        recommendations.append("Reduce human disturbance")
    elif suitability_score < 70:
        recommendations.append("Moderate: Continue monitoring bird populations")
        recommendations.append("Maintain current conservation efforts")
    else:
        recommendations.append("Excellent: Habitat is suitable for Sarus cranes")
        recommendations.append("Continue current management practices")
    
    return {
        'suitability_score': round(suitability_score, 2),
        'recommendations': recommendations,
        'bird_diversity_index': round(min(num_sightings / 30, 1.0), 2)
    }

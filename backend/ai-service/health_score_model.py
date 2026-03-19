import numpy as np

def calculate_health_score(water_index, vegetation_index, bird_population, pollution_reports):
    """Calculate ecosystem health score (0-100)"""
    
    water_score = water_index * 25
    
    vegetation_score = vegetation_index * 25
    
    bird_score = min(bird_population / 100, 1.0) * 30
    
    pollution_penalty = min(pollution_reports / 20, 1.0) * 20
    
    health_score = water_score + vegetation_score + bird_score - pollution_penalty
    
    health_score = max(0, min(100, health_score))
    
    return round(health_score, 2)

def get_health_status(score):
    """Get health status based on score"""
    if score >= 80:
        return 'excellent'
    elif score >= 60:
        return 'good'
    elif score >= 40:
        return 'moderate'
    else:
        return 'critical'

def get_recommendations(score, water_index, vegetation_index, pollution_reports):
    """Generate recommendations based on health metrics"""
    recommendations = []
    
    if water_index < 0.5:
        recommendations.append("Water quality needs improvement")
    
    if vegetation_index < 0.5:
        recommendations.append("Vegetation restoration required")
    
    if pollution_reports > 10:
        recommendations.append("High pollution levels detected - immediate action needed")
    
    if score < 40:
        recommendations.append("Critical ecosystem health - emergency intervention required")
    
    return recommendations

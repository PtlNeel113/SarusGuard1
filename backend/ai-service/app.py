from flask import Flask, request, jsonify
import numpy as np
from wetland_detection import detect_wetland_changes
from bird_prediction import predict_habitat_suitability
from health_score_model import calculate_health_score

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/detect-encroachment', methods=['POST'])
def detect_encroachment():
    try:
        data = request.json
        before_image = data.get('before_image')
        after_image = data.get('after_image')
        
        result = detect_wetland_changes(before_image, after_image)
        
        return jsonify({
            'change_percentage': result['change_percentage'],
            'affected_area': result['affected_area'],
            'risk_level': result['risk_level']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/habitat-prediction', methods=['POST'])
def habitat_prediction():
    try:
        data = request.json
        bird_sightings = data.get('bird_sightings', [])
        wetland_health = data.get('wetland_health', 0.5)
        
        result = predict_habitat_suitability(bird_sightings, wetland_health)
        
        return jsonify({
            'suitability_score': result['suitability_score'],
            'recommendations': result['recommendations']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health-score', methods=['POST'])
def health_score():
    try:
        data = request.json
        water_index = data.get('water_index', 0.5)
        vegetation_index = data.get('vegetation_index', 0.5)
        bird_population = data.get('bird_population', 0)
        pollution_reports = data.get('pollution_reports', 0)
        
        score = calculate_health_score(
            water_index, 
            vegetation_index, 
            bird_population, 
            pollution_reports
        )
        
        return jsonify({
            'health_score': score,
            'status': 'critical' if score < 40 else 'moderate' if score < 70 else 'healthy'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

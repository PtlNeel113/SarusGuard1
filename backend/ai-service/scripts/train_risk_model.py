"""
Script to train Random Forest model for wetland drying risk prediction.
This should be run with historical wetland data.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os

def generate_synthetic_training_data(n_samples=1000):
    """
    Generate synthetic training data for demonstration.
    In production, use real historical wetland data.
    """
    np.random.seed(42)
    
    data = {
        'rainfall_last_30_days': np.random.uniform(10, 150, n_samples),
        'water_area_change': np.random.uniform(-40, 20, n_samples),
        'vegetation_index': np.random.uniform(0, 1, n_samples),
        'pollution_count': np.random.randint(0, 30, n_samples),
        'temperature': np.random.uniform(20, 45, n_samples),
        'encroachment_count': np.random.randint(0, 15, n_samples),
        'water_level_trend': np.random.uniform(0, 1, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Generate risk labels based on features
    # High risk if: low rainfall, negative water change, low vegetation, high pollution
    risk_score = (
        (1 - df['rainfall_last_30_days'] / 150) * 0.25 +
        (np.maximum(0, -df['water_area_change']) / 40) * 0.25 +
        (1 - df['vegetation_index']) * 0.15 +
        (df['pollution_count'] / 30) * 0.15 +
        ((df['temperature'] - 20) / 25) * 0.10 +
        (df['encroachment_count'] / 15) * 0.10
    )
    
    df['risk_label'] = (risk_score > 0.5).astype(int)
    
    return df

def train_risk_prediction_model(data_path=None):
    """
    Train Random Forest model for wetland drying risk prediction.
    
    Args:
        data_path: Path to CSV file with historical wetland data
    """
    print("Starting risk prediction model training...")
    
    # Load or generate training data
    if data_path and os.path.exists(data_path):
        print(f"Loading data from: {data_path}")
        df = pd.read_csv(data_path)
    else:
        print("Generating synthetic training data...")
        df = generate_synthetic_training_data(1000)
    
    # Features and target
    feature_names = [
        'rainfall_last_30_days',
        'water_area_change',
        'vegetation_index',
        'pollution_count',
        'temperature',
        'encroachment_count',
        'water_level_trend'
    ]
    
    X = df[feature_names]
    y = df['risk_label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("Training Random Forest classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    
    print("\n" + "="*50)
    print("Model Evaluation")
    print("="*50)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk']))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    print("\nFeature Importance:")
    for name, importance in zip(feature_names, model.feature_importances_):
        print(f"  {name}: {importance:.3f}")
    
    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/risk_prediction_rf.pkl')
    joblib.dump(scaler, 'models/risk_scaler.pkl')
    
    print("\n✓ Model training completed!")
    print("✓ Model saved to: models/risk_prediction_rf.pkl")
    print("✓ Scaler saved to: models/risk_scaler.pkl")
    
    return model, scaler

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train risk prediction model')
    parser.add_argument('--data', type=str, help='Path to training data CSV')
    
    args = parser.parse_args()
    
    train_risk_prediction_model(args.data)

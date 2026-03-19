"""
Script to train YOLOv8 bird detection model on Cornell Bird Dataset.
This should be run separately to prepare the model before deployment.
"""

from ultralytics import YOLO
import os

def train_bird_detection_model(dataset_path, epochs=50):
    """
    Train YOLOv8 model for bird species detection.
    
    Args:
        dataset_path: Path to dataset directory containing data.yaml
        epochs: Number of training epochs
    """
    print("Starting bird detection model training...")
    
    # Load pretrained YOLOv8 model
    model = YOLO('yolov8n.pt')
    
    # Train on custom bird dataset
    # Dataset should be in YOLO format with data.yaml containing:
    # - path: dataset root
    # - train: train images path
    # - val: validation images path
    # - names: list of species names
    
    results = model.train(
        data=f'{dataset_path}/data.yaml',
        epochs=epochs,
        imgsz=640,
        batch=16,
        name='bird_detection',
        patience=10,
        save=True,
        device=0  # Use GPU if available
    )
    
    # Save the trained model
    os.makedirs('models', exist_ok=True)
    model.save('models/bird_yolov8.pt')
    
    print("✓ Model training completed!")
    print(f"✓ Model saved to: models/bird_yolov8.pt")
    
    # Validate the model
    metrics = model.val()
    print(f"\nValidation Metrics:")
    print(f"  mAP50: {metrics.box.map50:.3f}")
    print(f"  mAP50-95: {metrics.box.map:.3f}")
    
    return model

def prepare_cornell_dataset(source_path, output_path):
    """
    Convert Cornell Bird Dataset to YOLO format.
    
    Args:
        source_path: Path to Cornell Bird Dataset
        output_path: Path to save YOLO-formatted dataset
    """
    print("Converting Cornell Bird Dataset to YOLO format...")
    
    # This is a placeholder - actual implementation would:
    # 1. Read Cornell Bird Dataset images and annotations
    # 2. Convert to YOLO format (images + txt labels)
    # 3. Create train/val split
    # 4. Generate data.yaml
    
    # Species to focus on for wetland monitoring
    target_species = [
        "Sarus Crane",
        "Painted Stork",
        "Black-headed Ibis",
        "Openbill Stork",
        "Common Crane",
        "Egret",
        "Heron"
    ]
    
    print(f"✓ Target species: {', '.join(target_species)}")
    print(f"✓ Dataset will be saved to: {output_path}")
    
    # TODO: Implement actual conversion logic
    
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train bird detection model')
    parser.add_argument('--dataset', type=str, required=True, help='Path to dataset')
    parser.add_argument('--epochs', type=int, default=50, help='Number of epochs')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.dataset):
        print(f"Error: Dataset path not found: {args.dataset}")
        print("\nTo use this script:")
        print("1. Download Cornell Bird Dataset or similar")
        print("2. Convert to YOLO format using prepare_cornell_dataset()")
        print("3. Run: python train_bird_model.py --dataset /path/to/dataset --epochs 50")
    else:
        train_bird_detection_model(args.dataset, args.epochs)

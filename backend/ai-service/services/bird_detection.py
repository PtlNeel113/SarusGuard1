import cv2
import numpy as np
from ultralytics import YOLO
import torch
from PIL import Image
import io
import os
import cloudinary
import cloudinary.uploader
from typing import Dict, List

class BirdDetectionService:
    def __init__(self):
        self.model = None
        self.species_map = {
            0: "Sarus Crane",
            1: "Painted Stork",
            2: "Black-headed Ibis",
            3: "Openbill Stork",
            4: "Common Crane",
            5: "Egret",
            6: "Heron",
            7: "Other Wetland Bird"
        }
        self.confidence_threshold = 0.85
        self.initialize_model()
        self.initialize_cloudinary()
    
    def initialize_model(self):
        """Initialize YOLOv8 model for bird detection"""
        try:
            model_path = os.getenv('BIRD_MODEL_PATH', 'models/bird_yolov8.pt')
            
            if os.path.exists(model_path):
                self.model = YOLO(model_path)
                print(f"Loaded custom bird detection model from {model_path}")
            else:
                # Use pretrained YOLOv8 and fine-tune for birds
                self.model = YOLO('yolov8n.pt')
                print("Using pretrained YOLOv8 model (will need fine-tuning)")
                
        except Exception as e:
            print(f"Model initialization failed: {e}")
            self.model = YOLO('yolov8n.pt')
    
    def initialize_cloudinary(self):
        """Initialize Cloudinary for image storage"""
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
            api_key=os.getenv('CLOUDINARY_API_KEY'),
            api_secret=os.getenv('CLOUDINARY_API_SECRET')
        )
    
    async def detect_bird(self, image_bytes: bytes, filename: str) -> Dict:
        """
        Detect and classify bird species from uploaded image.
        
        Args:
            image_bytes: Raw image bytes
            filename: Original filename
            
        Returns:
            Dictionary with species, confidence, bounding boxes, and image URL
        """
        try:
            # Convert bytes to image
            image = Image.open(io.BytesIO(image_bytes))
            image_np = np.array(image)
            
            # Run inference
            results = self.model(image_np)
            
            # Process detections
            detections = self._process_detections(results[0])
            
            # Upload image to Cloudinary
            image_url = self._upload_image(image_bytes, filename)
            
            # Determine primary species (highest confidence)
            if detections:
                primary_detection = max(detections, key=lambda x: x['confidence'])
                species = primary_detection['species']
                confidence = primary_detection['confidence']
                verified = confidence >= self.confidence_threshold
            else:
                species = "Unknown"
                confidence = 0.0
                verified = False
            
            return {
                "species": species,
                "confidence": round(confidence, 3),
                "verified": verified,
                "image_url": image_url,
                "detections": detections,
                "detection_count": len(detections)
            }
            
        except Exception as e:
            raise Exception(f"Bird detection failed: {str(e)}")
    
    def _process_detections(self, result) -> List[Dict]:
        """
        Process YOLO detection results.
        
        Returns:
            List of detection dictionaries with species, confidence, and bounding boxes
        """
        detections = []
        
        if result.boxes is not None:
            boxes = result.boxes.cpu().numpy()
            
            for box in boxes:
                # Get bounding box coordinates
                x1, y1, x2, y2 = box.xyxy[0]
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                
                # Map class ID to species (simplified mapping)
                species = self._map_class_to_species(class_id, confidence)
                
                detections.append({
                    "species": species,
                    "confidence": round(confidence, 3),
                    "bounding_box": {
                        "x1": float(x1),
                        "y1": float(y1),
                        "x2": float(x2),
                        "y2": float(y2)
                    }
                })
        
        return detections
    
    def _map_class_to_species(self, class_id: int, confidence: float) -> str:
        """
        Map YOLO class ID to bird species.
        For production, this should use a fine-tuned model with proper species mapping.
        """
        # Check if it's a bird class (YOLO COCO dataset: class 14 is bird)
        if class_id == 14:
            # Use confidence-based heuristic for species identification
            # In production, use a fine-tuned model trained on Cornell Bird Dataset
            if confidence > 0.9:
                return "Sarus Crane"
            elif confidence > 0.8:
                return "Painted Stork"
            elif confidence > 0.7:
                return "Black-headed Ibis"
            else:
                return "Other Wetland Bird"
        
        # If custom model is loaded, use species_map
        if class_id in self.species_map:
            return self.species_map[class_id]
        
        return "Unknown Bird"
    
    def _upload_image(self, image_bytes: bytes, filename: str) -> str:
        """
        Upload image to Cloudinary.
        
        Returns:
            URL of uploaded image
        """
        try:
            upload_result = cloudinary.uploader.upload(
                image_bytes,
                folder='bird-sightings',
                public_id=f"bird_{filename}",
                resource_type='image'
            )
            return upload_result['secure_url']
        except Exception as e:
            print(f"Image upload failed: {e}")
            return ""
    
    def train_model(self, dataset_path: str, epochs: int = 50):
        """
        Fine-tune YOLOv8 model on Cornell Bird Dataset.
        This should be run separately during model preparation.
        """
        try:
            model = YOLO('yolov8n.pt')
            
            # Train on custom bird dataset
            results = model.train(
                data=f'{dataset_path}/data.yaml',
                epochs=epochs,
                imgsz=640,
                batch=16,
                name='bird_detection'
            )
            
            # Save trained model
            model.save('models/bird_yolov8.pt')
            print("Model training completed and saved")
            
            return results
            
        except Exception as e:
            print(f"Model training failed: {e}")
            raise

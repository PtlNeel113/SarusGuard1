import ee
import numpy as np
import requests
from datetime import datetime, timedelta
from typing import Dict, Tuple
import os
import cloudinary
import cloudinary.uploader

class WetlandDetectionService:
    def __init__(self):
        self.initialize_gee()
        self.initialize_cloudinary()
        
    def initialize_gee(self):
        """Initialize Google Earth Engine"""
        try:
            ee.Initialize()
        except Exception as e:
            print(f"GEE initialization failed: {e}")
            print("Attempting to authenticate...")
            try:
                ee.Authenticate()
                ee.Initialize()
            except:
                print("Using service account authentication")
                credentials = ee.ServiceAccountCredentials(
                    os.getenv('GEE_SERVICE_ACCOUNT'),
                    os.getenv('GEE_PRIVATE_KEY_FILE')
                )
                ee.Initialize(credentials)
    
    def initialize_cloudinary(self):
        """Initialize Cloudinary for image storage"""
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
            api_key=os.getenv('CLOUDINARY_API_KEY'),
            api_secret=os.getenv('CLOUDINARY_API_SECRET')
        )
    
    async def detect_wetland(
        self,
        wetland_id: str,
        start_date: str,
        end_date: str,
        latitude: float,
        longitude: float,
        buffer_km: float = 2.0
    ) -> Dict:
        """
        Detect wetland water bodies using Sentinel-2 imagery and NDWI calculation.
        
        Args:
            wetland_id: Unique identifier for the wetland
            start_date: Start date for imagery (YYYY-MM-DD)
            end_date: End date for imagery (YYYY-MM-DD)
            latitude: Center latitude
            longitude: Center longitude
            buffer_km: Buffer radius in kilometers
            
        Returns:
            Dictionary with wetland area, change percentage, and water mask URL
        """
        try:
            # Define area of interest
            point = ee.Geometry.Point([longitude, latitude])
            aoi = point.buffer(buffer_km * 1000)  # Convert km to meters
            
            # Get current period imagery
            current_area, current_mask_url = self._process_period(
                aoi, start_date, end_date, f"{wetland_id}_current"
            )
            
            # Get previous period imagery (30 days before)
            prev_start = (datetime.strptime(start_date, '%Y-%m-%d') - timedelta(days=30)).strftime('%Y-%m-%d')
            prev_end = (datetime.strptime(end_date, '%Y-%m-%d') - timedelta(days=30)).strftime('%Y-%m-%d')
            
            previous_area, _ = self._process_period(
                aoi, prev_start, prev_end, f"{wetland_id}_previous"
            )
            
            # Calculate change percentage
            if previous_area > 0:
                change_percentage = ((previous_area - current_area) / previous_area) * 100
            else:
                change_percentage = 0.0
            
            return {
                "wetland_id": wetland_id,
                "wetland_area_km2": round(current_area, 4),
                "previous_area_km2": round(previous_area, 4),
                "change_percentage": round(change_percentage, 2),
                "water_mask_image_url": current_mask_url,
                "analysis_date": end_date,
                "coordinates": {"latitude": latitude, "longitude": longitude}
            }
            
        except Exception as e:
            raise Exception(f"Wetland detection failed: {str(e)}")
    
    def _process_period(
        self,
        aoi: ee.Geometry,
        start_date: str,
        end_date: str,
        image_name: str
    ) -> Tuple[float, str]:
        """
        Process satellite imagery for a specific time period.
        
        Returns:
            Tuple of (area_in_km2, water_mask_url)
        """
        # Load Sentinel-2 imagery
        sentinel = ee.ImageCollection('COPERNICUS/S2_SR') \
            .filterBounds(aoi) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
            .median()
        
        # Calculate NDWI: (Green - NIR) / (Green + NIR)
        # Sentinel-2 bands: B3 = Green, B8 = NIR
        ndwi = sentinel.normalizedDifference(['B3', 'B8']).rename('NDWI')
        
        # Create water mask (NDWI > 0 indicates water)
        water_mask = ndwi.gt(0)
        
        # Calculate water area
        pixel_area = ee.Image.pixelArea()
        water_area = water_mask.multiply(pixel_area).reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=aoi,
            scale=10,  # 10 meter resolution
            maxPixels=1e9
        )
        
        # Convert to km²
        area_m2 = water_area.getInfo().get('NDWI', 0)
        area_km2 = area_m2 / 1_000_000
        
        # Generate visualization and upload to Cloudinary
        water_mask_url = self._export_water_mask(water_mask, aoi, image_name)
        
        return area_km2, water_mask_url
    
    def _export_water_mask(
        self,
        water_mask: ee.Image,
        aoi: ee.Geometry,
        image_name: str
    ) -> str:
        """
        Export water mask as image and upload to Cloudinary.
        
        Returns:
            URL of uploaded water mask image
        """
        try:
            # Get thumbnail URL from Earth Engine
            vis_params = {
                'min': 0,
                'max': 1,
                'palette': ['white', 'blue']
            }
            
            url = water_mask.getThumbURL({
                'region': aoi,
                'dimensions': 512,
                'format': 'png',
                **vis_params
            })
            
            # Download image
            response = requests.get(url)
            if response.status_code == 200:
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    response.content,
                    folder='wetland-masks',
                    public_id=image_name,
                    resource_type='image'
                )
                return upload_result['secure_url']
            else:
                return ""
                
        except Exception as e:
            print(f"Water mask export failed: {e}")
            return ""

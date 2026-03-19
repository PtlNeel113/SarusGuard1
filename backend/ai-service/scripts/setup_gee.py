"""
Script to authenticate and setup Google Earth Engine.
Run this once before using the wetland detection service.
"""

import ee
import os

def setup_gee():
    """Setup Google Earth Engine authentication"""
    print("Setting up Google Earth Engine...")
    
    try:
        # Try to initialize (will fail if not authenticated)
        ee.Initialize()
        print("✓ Google Earth Engine already authenticated")
    except Exception as e:
        print("Google Earth Engine not authenticated. Starting authentication...")
        
        # Authenticate
        ee.Authenticate()
        
        # Initialize after authentication
        ee.Initialize()
        print("✓ Google Earth Engine authentication successful")
    
    # Test the connection
    try:
        image = ee.Image('COPERNICUS/S2_SR/20200101T000000_20200101T000000_T43QGE')
        print("✓ Successfully connected to Google Earth Engine")
        print(f"✓ Test image info: {image.getInfo()['type']}")
    except Exception as e:
        print(f"✗ Connection test failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = setup_gee()
    if success:
        print("\n✓ Google Earth Engine setup complete!")
        print("You can now use the wetland detection service.")
    else:
        print("\n✗ Setup failed. Please check your credentials.")

from pydantic import BaseModel, Field
from typing import Optional


class PredictionRequest(BaseModel):
    location: str = Field(..., description="Property location/city (e.g. 'new-delhi', 'bangalore', 'mumbai')", min_length=1)
    carpet_area_sqft: float = Field(..., description="Carpet area in square feet", gt=0, le=50000)
    floor_num: int = Field(..., description="Floor number (0 for Ground, negative for Basement)", ge=-5, le=150)
    bathroom: int = Field(..., description="Number of bathrooms", ge=1, le=30)
    balcony: int = Field(0, description="Number of balconies", ge=0, le=20)
    furnishing: str = Field("Semi-Furnished", description="Furnishing status ('Furnished', 'Semi-Furnished', 'Unfurnished')")
    transaction: str = Field("Resale", description="Transaction type ('New Property', 'Resale', 'Other')")
    ownership: str = Field("Freehold", description="Ownership type ('Freehold', 'Leasehold', 'Co-operative Society', 'Power Of Attorney')")
    facing: str = Field("East", description="Facing direction ('East', 'North', 'West', 'South', etc.)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "location": "new-delhi",
                "carpet_area_sqft": 1250.0,
                "floor_num": 3,
                "bathroom": 2,
                "balcony": 2,
                "furnishing": "Semi-Furnished",
                "transaction": "Resale",
                "ownership": "Freehold",
                "facing": "East"
            }
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price in INR (numerical)")
    formatted_price: str = Field(..., description="Human-readable formatted price (e.g. ₹ 42.50 Lac, ₹ 1.25 Cr)")
    currency: str = "INR"
    status: str = "success"


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    model_loaded: bool = True


from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import PredictionRequest, PredictionResponse, HealthResponse
from app.services.inference import model_service
from app.core.config import settings
from app.utils.logging_config import logger

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint returning service status and model readiness.
    """
    return HealthResponse(
        status="ok",
        version=settings.VERSION,
        model_loaded=model_service.is_ready
    )


@router.get("/locations", response_model=List[str], tags=["Metadata"])
async def get_locations():
    """
    Returns sorted list of allowed property locations supported by the trained model.
    """
    if not model_service.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model service is not ready."
        )
    return sorted(list(model_service.allowed_locations))


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict_house_price(request: PredictionRequest):
    """
    Predicts house price in INR given property specifications.
    """
    if not model_service.is_ready:
        logger.error("Prediction attempted before model initialization.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction model is currently unavailable."
        )
    try:
        return model_service.predict(request)
    except ValueError as ve:
        logger.warning(f"Validation error during prediction: {ve}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as exc:
        logger.exception(f"Unexpected error during prediction: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during inference."
        )


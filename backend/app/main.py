from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.utils.logging_config import logger
from app.services.inference import model_service
from app.api.routes.prediction import router as prediction_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to load machine learning artifacts once at application startup.
    """
    logger.info("Initializing FastAPI application lifespan...")
    try:
        model_service.load_artifacts(
            model_path=settings.MODEL_PATH,
            locations_path=settings.LOCATIONS_PATH
        )
        logger.info("Model artifacts loaded successfully at startup.")
    except Exception as exc:
        logger.exception(f"Failed to load model artifacts on startup: {exc}")
        raise exc

    yield

    logger.info("Application shutting down. Cleaning up resources.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade API for Indian House Price Prediction using Scikit-Learn Pipeline.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(prediction_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to the House Price Prediction API",
        "documentation": "/docs",
        "health": "/health"
    }


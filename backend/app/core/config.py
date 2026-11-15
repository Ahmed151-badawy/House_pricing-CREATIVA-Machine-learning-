import json
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "House Price Prediction API"
    VERSION: str = "1.0.0"
    MODEL_PATH: str = str(BASE_DIR / "models" / "house_price.pkl")
    LOCATIONS_PATH: str = str(BASE_DIR / "models" / "locations.json")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()


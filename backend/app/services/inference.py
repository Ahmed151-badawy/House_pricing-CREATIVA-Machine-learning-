import os
import json
import joblib
from typing import Set, Tuple, Any
from app.utils.logging_config import logger
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.preprocessing import prepare_input_dataframe, format_inr_price


class ModelService:
    def __init__(self):
        self.model: Any = None
        self.allowed_locations: Set[str] = set()
        self.is_ready: bool = False

    def load_artifacts(self, model_path: str, locations_path: str) -> None:
        """
        Loads the exported scikit-learn pipeline and allowed locations list.
        """
        logger.info(f"Loading ML model from: {model_path}")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")

        self.model = joblib.load(model_path)
        logger.info("ML model pipeline loaded successfully.")

        logger.info(f"Loading allowed locations from: {locations_path}")
        if os.path.exists(locations_path):
            with open(locations_path, "r", encoding="utf-8") as f:
                locations_list = json.load(f)
                self.allowed_locations = set(loc.strip().lower() for loc in locations_list)
            logger.info(f"Loaded {len(self.allowed_locations)} allowed locations.")
        else:
            logger.warning(f"Locations file not found at: {locations_path}, defaulting to empty set.")
            self.allowed_locations = set()

        self.is_ready = True

    def predict(self, request: PredictionRequest) -> PredictionResponse:
        """
        Processes a prediction request and returns predicted price in numerical
        and formatted currency representation.
        """
        if not self.is_ready or self.model is None:
            raise RuntimeError("Model is not loaded or service is not initialized.")

        input_df = prepare_input_dataframe(request, self.allowed_locations)
        logger.debug(f"Input features for inference: {input_df.to_dict(orient='records')}")

        raw_prediction = self.model.predict(input_df)[0]
        # In case prediction produces negative values on pathological inputs, clip at 0
        predicted_price = max(0.0, float(raw_prediction))
        formatted_price = format_inr_price(predicted_price)

        logger.info(f"Prediction result: {predicted_price:,.0f} ({formatted_price})")
        return PredictionResponse(
            predicted_price=round(predicted_price, 2),
            formatted_price=formatted_price,
            currency="INR",
            status="success"
        )


model_service = ModelService()


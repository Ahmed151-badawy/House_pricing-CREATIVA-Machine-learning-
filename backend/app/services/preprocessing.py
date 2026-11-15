from typing import List, Set
import pandas as pd
from app.schemas.prediction import PredictionRequest


TRAINING_FEATURE_ORDER = [
    "carpet_area_sqft",
    "floor_num",
    "bathroom",
    "balcony",
    "location_grouped",
    "Furnishing",
    "Transaction",
    "Ownership",
    "facing"
]


def prepare_input_dataframe(request: PredictionRequest, allowed_locations: Set[str]) -> pd.DataFrame:
    """
    Transforms a validated PredictionRequest into a single-row DataFrame
    matching the exact feature schema and column order expected by the trained pipeline.
    Maps unrecognized locations to 'other'.
    """
    normalized_loc = request.location.strip().lower()
    location_grouped = normalized_loc if normalized_loc in allowed_locations else "other"

    row_data = {
        "carpet_area_sqft": float(request.carpet_area_sqft),
        "floor_num": float(request.floor_num),
        "bathroom": float(request.bathroom),
        "balcony": float(request.balcony),
        "location_grouped": location_grouped,
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
    }

    df = pd.DataFrame([row_data], columns=TRAINING_FEATURE_ORDER)
    return df


def format_inr_price(price: float) -> str:
    """
    Formats a numeric price in INR into human-readable Indian currency representation
    (Crores or Lakhs).
    """
    if price < 0:
        return "₹ 0"
    if price >= 10_000_000:
        cr_val = price / 10_000_000
        return f"₹ {cr_val:.2f} Cr"
    elif price >= 100_000:
        lac_val = price / 100_000
        return f"₹ {lac_val:.2f} Lac"
    else:
        return f"₹ {price:,.0f}"


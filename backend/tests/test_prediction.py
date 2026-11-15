import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.inference import model_service


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_endpoint(client):
    """Verify health endpoint returns status 200 and ok."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True


def test_model_loading_behavior():
    """Verify model is properly initialized and loaded in memory."""
    assert model_service.is_ready is True
    assert model_service.model is not None
    assert len(model_service.allowed_locations) > 0


def test_prediction_successful(client):
    """Verify valid input produces 200 with numerical predicted price."""
    payload = {
        "location": "bangalore",
        "carpet_area_sqft": 1200.0,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], (int, float))
    assert data["predicted_price"] > 0
    assert "formatted_price" in data
    assert "₹" in data["formatted_price"]


def test_prediction_unknown_location(client):
    """Verify unknown location is gracefully mapped to 'other' and produces prediction."""
    payload = {
        "location": "non_existent_city_xyz_12345",
        "carpet_area_sqft": 900.0,
        "floor_num": 1,
        "bathroom": 1,
        "balcony": 1,
        "furnishing": "Unfurnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "North"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_price"] > 0


def test_prediction_invalid_area(client):
    """Verify negative or zero carpet area triggers 422 Unprocessable Entity."""
    payload = {
        "location": "new-delhi",
        "carpet_area_sqft": -50.0,  # Invalid negative area
        "floor_num": 2,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_prediction_missing_required_field(client):
    """Verify missing required field triggers 422."""
    payload = {
        "location": "mumbai",
        # carpet_area_sqft is missing
        "floor_num": 4,
        "bathroom": 2,
        "balcony": 1
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_locations_endpoint(client):
    """Verify locations endpoint returns list of supported locations."""
    response = client.get("/locations")
    assert response.status_code == 200
    locations = response.json()
    assert isinstance(locations, list)
    assert len(locations) > 0
    assert "other" in locations


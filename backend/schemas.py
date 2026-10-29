from pydantic import BaseModel

class SoilInput(BaseModel):
    soil_type: str
    crop_type: str
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    temperature: float
    humidity: float
    moisture: float
    rainfall: float
    season: str
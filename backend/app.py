import os
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import SoilInput
from model_utils import predict_fertilizer
from database import insert_prediction, get_history

app = FastAPI(title="AgriSoil ML Backend")

origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if origins_env.strip() == "*":
    allow_origins = ["*"]
else:
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True if "*" not in allow_origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(data: SoilInput):
    try:
        soil_map = {
            "clay": "Clay",
            "sandy": "Sandy",
            "silt": "Silt",
            "loam": "Loamy",
            "loamy": "Loamy",
        }

        crop_map = {
            "wheat": "Wheat",
            "rice": "Rice",
            "maize": "Maize",
            "cotton": "Cotton",
            "sugarcane": "Sugarcane",
            "potato": "Potato",
            "tomato": "Tomato",
        }

        season_map = {
            "kharif": "Kharif",
            "rabi": "Rabi",
            "zaid": "Zaid",
        }

        data.soil_type = soil_map.get(str(data.soil_type).strip().lower(), data.soil_type)
        data.crop_type = crop_map.get(str(data.crop_type).strip().lower(), data.crop_type)
        data.season = season_map.get(str(data.season).strip().lower(), data.season)

        fertilizer, confidence = predict_fertilizer(data)

        record = {
            "soil_type": data.soil_type,
            "crop_type": data.crop_type,
            "nitrogen": data.nitrogen,
            "phosphorus": data.phosphorus,
            "potassium": data.potassium,
            "ph": data.ph,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "moisture": data.moisture,
            "rainfall": data.rainfall,
            "season": data.season,
            "recommended_fertilizer": fertilizer,
            "confidence": round(confidence, 2) if confidence is not None else None,
            "created_at": datetime.now(timezone.utc),
        }

        saved = insert_prediction(record)

        return {
            "recommended_fertilizer": fertilizer,
            "confidence": round(confidence, 2) if confidence is not None else None,
            "saved": saved,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/history")
def history():
    try:
        items = get_history(20)
        return {"history": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch history: {str(e)}")
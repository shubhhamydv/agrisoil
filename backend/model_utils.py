from pathlib import Path
import joblib

MODEL_PATH = Path(__file__).resolve().parent / "model" / "fertilizer_model.pkl"
model = joblib.load(MODEL_PATH)

def predict_fertilizer(data):
    payload = {
        "soil_type": [data.soil_type],
        "crop_type": [data.crop_type],
        "nitrogen": [data.nitrogen],
        "phosphorus": [data.phosphorus],
        "potassium": [data.potassium],
        "ph": [data.ph],
        "temperature": [data.temperature],
        "humidity": [data.humidity],
        "moisture": [data.moisture],
        "rainfall": [data.rainfall],
        "season": [data.season],
    }

    import pandas as pd
    df = pd.DataFrame(payload)

    prediction = model.predict(df)[0]

    confidence = None
    classifier = model.named_steps["classifier"]
    transformed = model.named_steps["preprocessor"].transform(df)

    if hasattr(classifier, "predict_proba"):
        probs = classifier.predict_proba(transformed)[0]
        confidence = float(max(probs) * 100)

    return prediction, confidence
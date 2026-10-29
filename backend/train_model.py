import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder

MODEL_DIR = "model"
os.makedirs(MODEL_DIR, exist_ok=True)

DATA_PATH = "fertilizer_recommendation.csv"

df = pd.read_csv(DATA_PATH)


df = df[
    [
        "Soil_Type",
        "Crop_Type",
        "Nitrogen_Level",
        "Phosphorus_Level",
        "Potassium_Level",
        "Soil_pH",
        "Temperature",
        "Humidity",
        "Soil_Moisture",
        "Rainfall",
        "Season",
        "Recommended_Fertilizer",
    ]
].copy()


df = df.rename(
    columns={
        "Soil_Type": "soil_type",
        "Crop_Type": "crop_type",
        "Nitrogen_Level": "nitrogen",
        "Phosphorus_Level": "phosphorus",
        "Potassium_Level": "potassium",
        "Soil_pH": "ph",
        "Temperature": "temperature",
        "Humidity": "humidity",
        "Soil_Moisture": "moisture",
        "Rainfall": "rainfall",
        "Season": "season",
        "Recommended_Fertilizer": "fertilizer",
    }
)

X = df.drop(columns=["fertilizer"])
y = df["fertilizer"]

categorical_features = ["soil_type", "crop_type", "season"]
numeric_features = [
    "nitrogen",
    "phosphorus",
    "potassium",
    "ph",
    "temperature",
    "humidity",
    "moisture",
    "rainfall",
]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="most_frequent")),
                    ("onehot", OneHotEncoder(handle_unknown="ignore")),
                ]
            ),
            categorical_features,
        ),
        (
            "num",
            Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="median")),
                ]
            ),
            numeric_features,
        ),
    ]
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=200, random_state=42)),
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

joblib.dump(model, os.path.join(MODEL_DIR, "fertilizer_model.pkl"))

print(f"Model trained successfully")
print(f"Accuracy: {acc * 100:.2f}%")
print(f"Saved to: {os.path.join(MODEL_DIR, 'fertilizer_model.pkl')}")
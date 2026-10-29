import json
import os
from pathlib import Path
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "agrisoil"

is_mongo_connected = False
client = None
db = None
predictions_collection = None

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=1500)
    client.server_info()
    is_mongo_connected = True
    db = client[DB_NAME]
    predictions_collection = db["predictions"]
    print("MongoDB connected successfully")
except Exception as e:
    print(f"MongoDB not available ({e}). Using local fallback storage.")

# Local file storage fallback
DATA_FILE = Path(__file__).resolve().parent / "predictions_local.json"

def insert_prediction(record: dict):
    if is_mongo_connected and predictions_collection is not None:
        try:
            predictions_collection.insert_one(record)
            return True
        except Exception as e:
            print(f"Failed to insert into MongoDB: {e}")
    
    # Save to local JSON
    try:
        history = get_history()
        # Convert datetime to ISO string for JSON serialization
        rec = dict(record)
        if "created_at" in rec and hasattr(rec["created_at"], "isoformat"):
            rec["created_at"] = rec["created_at"].isoformat()
        if "_id" in rec:
            del rec["_id"]
        history.insert(0, rec)
        DATA_FILE.write_text(json.dumps(history[:50], indent=2), encoding="utf-8")
        return True
    except Exception as e:
        print(f"Failed to save locally: {e}")
        return False

def get_history(limit: int = 20):
    if is_mongo_connected and predictions_collection is not None:
        try:
            return list(
                predictions_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
            )
        except Exception as e:
            print(f"Failed to fetch from MongoDB: {e}")
            
    if DATA_FILE.exists():
        try:
            data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            return data[:limit]
        except Exception:
            return []
    return []
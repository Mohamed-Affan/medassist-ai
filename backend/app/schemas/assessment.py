from pydantic import BaseModel
from typing import List, Optional

class AssessmentSubmit(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    pain_level: int
    symptoms: List[str]
    duration_days: int
    medical_history: List[str]
    lifestyle_smoking: str
    lifestyle_alcohol: str

class DiseasePredictionResponse(BaseModel):
    name: str
    description: str
    confidence: int
    severity: str
    doctor_specialty: str
    precautions: List[str]

class ExplainabilityResponse(BaseModel):
    primary_matched: List[str]
    primary_missing: List[str]
    reasoning: str

class PreventiveCareResponse(BaseModel):
    diet_foods_to_eat: List[str]
    diet_foods_to_avoid: List[str]
    exercise_advice: str
    water_target: str
    sleep_target: str
    general_tips: List[str]

class AssessmentResultResponse(BaseModel):
    prediction_id: str
    predictions: List[DiseasePredictionResponse]
    is_emergency: bool
    explainability: ExplainabilityResponse
    preventive_care: PreventiveCareResponse

from datetime import datetime

class PredictionHistoryResponse(BaseModel):
    id: str
    symptoms_summary: str
    predicted_disease: str
    confidence: float
    timestamp: datetime


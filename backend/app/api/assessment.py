from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.database import models
from app.api.auth import get_current_user
from app.schemas.assessment import AssessmentSubmit, AssessmentResultResponse, DiseasePredictionResponse, PredictionHistoryResponse
from app.ml import prediction_engine

router = APIRouter(prefix="/assessment", tags=["Symptom Assessment"])

@router.get("/symptoms", response_model=List[str])
def get_symptoms(current_user: models.User = Depends(get_current_user)):
    """
    Returns a sorted list of all available symptoms in the knowledge base.
    """
    return prediction_engine.ALL_SYMPTOMS

@router.post("/submit", response_model=AssessmentResultResponse)
def submit_assessment(
    assessment: AssessmentSubmit,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Processes symptoms through the ML diagnostic pipeline, saves the results to the DB,
    and returns a normalized diagnosis, emergency checks, and preventive care action items.
    """
    # 1. Run prediction pipeline
    biometrics = {
        "age": assessment.age,
        "gender": assessment.gender,
        "pain_level": assessment.pain_level,
        "height": assessment.height,
        "weight": assessment.weight
    }
    
    result = prediction_engine.predict_disease(assessment.symptoms, biometrics)
    primary_prediction = result["predictions"][0]
    
    # 2. Save prediction record to Database
    symptoms_str = ", ".join(assessment.symptoms)
    
    # Calculate BMI
    bmi_val = None
    if assessment.height and assessment.weight:
        h_m = assessment.height / 100
        bmi_val = float(round(assessment.weight / (h_m * h_m), 1))
        
    new_prediction = models.Prediction(
        user_id=current_user.id,
        symptoms_summary=symptoms_str,
        predicted_disease=primary_prediction["name"],
        confidence=float(primary_prediction["confidence"]),
        age=assessment.age,
        gender=assessment.gender,
        height=assessment.height,
        weight=assessment.weight,
        bmi=bmi_val,
        pain_level=assessment.pain_level,
        duration_days=assessment.duration_days,
        medical_history=", ".join(assessment.medical_history) if assessment.medical_history else "None",
        lifestyle_smoking=assessment.lifestyle_smoking,
        lifestyle_alcohol=assessment.lifestyle_alcohol
    )
    
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    
    # 3. Format response
    predictions_response = [
        DiseasePredictionResponse(
            name=p["name"],
            description=p["description"],
            confidence=p["confidence"],
            severity=p["severity"],
            doctor_specialty=p["doctor_specialty"],
            precautions=p["precautions"]
        ) for p in result["predictions"]
    ]
    
    return AssessmentResultResponse(
        prediction_id=new_prediction.id,
        predictions=predictions_response,
        is_emergency=result["is_emergency"],
        explainability=result["explainability"],
        preventive_care=result["preventive_care"]
    )

from fastapi.responses import StreamingResponse
from app.services import pdf_service

@router.get("/report/{prediction_id}/download")
def download_report(
    prediction_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Validates user, extracts the database prediction logs, compiles a ReportLab PDF structure,
    and returns a downloadable file stream directly to the browser.
    """
    prediction = db.query(models.Prediction).filter(
        models.Prediction.id == prediction_id,
        models.Prediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Health report not found."
        )
        
    pdf_buffer = pdf_service.generate_assessment_pdf(prediction, current_user)
    
    headers = {
        "Content-Disposition": f"attachment; filename=health_report_{prediction_id[:8]}.pdf"
    }
    
    return StreamingResponse(pdf_buffer, headers=headers, media_type="application/pdf")

@router.get("/history", response_model=List[PredictionHistoryResponse])
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Returns a list of all historical symptom assessments logged by the authenticated user,
    ordered by date descending.
    """
    predictions = db.query(models.Prediction).filter(
        models.Prediction.user_id == current_user.id
    ).order_by(models.Prediction.timestamp.desc()).all()
    
    return [
        PredictionHistoryResponse(
            id=p.id,
            symptoms_summary=p.symptoms_summary,
            predicted_disease=p.predicted_disease,
            confidence=p.confidence,
            timestamp=p.timestamp
        ) for p in predictions
    ]


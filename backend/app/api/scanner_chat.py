from fastapi import APIRouter, File, UploadFile, Header, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.api.auth import get_current_user
from app.database import models
from app.ml import cnn_scanner
from app.ml import chat_agent

router = APIRouter(tags=["Vision & Chat Agents"])

class ChatMessageSubmit(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    response: str

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class HeatmapPoint(BaseModel):
    x: float
    y: float
    val: float

class ScannerResultResponse(BaseModel):
    condition: str
    description: str
    confidence: int
    severity: str
    specialist: str
    precautions: List[str]
    bounding_box: BoundingBox
    activations: List[HeatmapPoint]

@router.post("/scanner/upload", response_model=ScannerResultResponse)
async def upload_scanner_image(
    file: UploadFile = File(...),
    scan_type: str = Header(..., alias="Scan-Type"),
    current_user: models.User = Depends(get_current_user)
):
    """
    Accepts an uploaded image file, processes the binary data through a simulated
    Convolutional Neural Network (CNN) pipeline, and returns estimated condition,
    confidence metrics, and bounding box region coordinates of interest.
    """
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Supported formats: PNG, JPG, JPEG, WEBP."
        )
        
    try:
        content = await file.read()
        analysis = cnn_scanner.analyze_scan_image(content, scan_type, file.filename)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing computer vision inference: {str(e)}"
        )

@router.post("/chat/message", response_model=ChatMessageResponse)
def post_chat_message(
    payload: ChatMessageSubmit,
    current_user: models.User = Depends(get_current_user)
):
    """
    Receives user dialogue query, matches clinical knowledge-base patterns, and returns
    empathetic, structured medical FAQs and lifestyle guides.
    """
    if not payload.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message content cannot be blank."
        )
        
    response_text = chat_agent.generate_chat_response(payload.message)
    return ChatMessageResponse(response=response_text)

import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from app.database import models

def generate_assessment_pdf(prediction: models.Prediction, user: models.User) -> io.BytesIO:
    """
    Generates an educational summary of a saved rule-based assessment. It is not a
    clinical report, diagnosis, prescription, or treatment plan.
    """
    buffer = io.BytesIO()
    
    # 1. Setup Document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=45,
        bottomMargin=45
    )
    
    story = []
    
    # 2. Setup Styles
    styles = getSampleStyleSheet()
    
    PRIMARY_COLOR = colors.HexColor("#1E3A8A")  # Deep Clinical Blue
    TEXT_COLOR = colors.HexColor("#334155")     # Slate grey body
    ACCENT_COLOR = colors.HexColor("#0D9488")    # Forest Teal
    
    # Custom paragraph styles
    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=PRIMARY_COLOR,
        spaceAfter=5
    )
    
    subheader_style = ParagraphStyle(
        'DocSubHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=15
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=PRIMARY_COLOR,
        spaceBefore=14,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        textColor=TEXT_COLOR,
        leading=13.5,
        spaceAfter=6
    )
    
    table_text_style = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=TEXT_COLOR,
        leading=12
    )

    table_header_style = ParagraphStyle(
        'TableHeaderText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=PRIMARY_COLOR,
        leading=12
    )

    advisory_style = ParagraphStyle(
        'AdvisoryText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        textColor=colors.HexColor("#475569"),
        leading=11,
        spaceBefore=22
    )
    
    # 3. Add Content Elements
    # Header Title & Subtitle
    story.append(Paragraph("MedAssist Educational Assessment Summary", header_style))
    story.append(Paragraph("RULE-BASED SYMPTOM PATTERN MATCHING — NOT A MEDICAL DIAGNOSIS", subheader_style))
    story.append(Spacer(1, 5))
    
    # Patient Demographics & Biometrics Table
    demo_data = [
        [
            Paragraph("<b>Patient Name:</b>", body_style), Paragraph(user.name, body_style),
            Paragraph("<b>Assessment Date:</b>", body_style), Paragraph(prediction.timestamp.strftime("%Y-%m-%d %H:%M UTC"), body_style)
        ],
        [
            Paragraph("<b>Email:</b>", body_style), Paragraph(user.email, body_style),
            Paragraph("<b>Age / Gender:</b>", body_style), Paragraph(f"{prediction.age or 'N/A'} / {prediction.gender or 'N/A'}", body_style)
        ],
        [
            Paragraph("<b>Height / Weight:</b>", body_style), Paragraph(f"{prediction.height or 'N/A'} cm / {prediction.weight or 'N/A'} kg", body_style),
            Paragraph("<b>Body Mass Index (BMI):</b>", body_style), Paragraph(f"{prediction.bmi or 'N/A'}", body_style)
        ],
        [
            Paragraph("<b>Pain Scale / Duration:</b>", body_style), Paragraph(f"Score {prediction.pain_level or 'N/A'} / {prediction.duration_days or 'N/A'} days", body_style),
            Paragraph("<b>Medical History:</b>", body_style), Paragraph(prediction.medical_history or "None", body_style)
        ],
        [
            Paragraph("<b>Smoking / Alcohol:</b>", body_style), Paragraph(f"Smoking: {prediction.lifestyle_smoking or 'N/A'} | Alcohol: {prediction.lifestyle_alcohol or 'N/A'}", body_style),
            Paragraph("", body_style), Paragraph("", body_style)
        ]
    ]
    
    demo_table = Table(demo_data, colWidths=[110, 150, 130, 140])
    demo_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    
    story.append(demo_table)
    story.append(Spacer(1, 10))
    
    # Logged Clinical Indicators
    story.append(Paragraph("Reported Symptoms and Context", section_heading))
    story.append(Paragraph(f"The patient reported the following clinical indicators: <b>{prediction.symptoms_summary}</b>", body_style))
    story.append(Spacer(1, 8))
    
    # Diagnostic Predictions
    story.append(Paragraph("Rule-Based Pattern-Match Summary", section_heading))
    
    pred_headers = [
        Paragraph("<b>Matched Knowledge-Base Entry</b>", table_header_style),
        Paragraph("<b>Normalized Match Score</b>", table_header_style),
        Paragraph("<b>Suggested Follow-Up</b>", table_header_style)
    ]
    
    # Calculate triage priority text
    triage_priority = "Routine Care Pathway"
    if prediction.confidence > 75:
        triage_priority = "Urgent Care Clinic Referral"
    elif prediction.confidence > 45:
        triage_priority = "Primary Care Consultation"
        
    # Check for critical conditions explicitly
    if "Emergency" in prediction.predicted_disease or prediction.pain_level >= 8:
        triage_priority = "EMERGENCY TRIAGE REFERRAL"
        
    # Progress Bar representing confidence
    conf_pct = int(prediction.confidence)
    bar_width = 110
    filled_width = (conf_pct / 100) * bar_width
    empty_width = bar_width - filled_width
    
    progress_bar_table = Table([["", ""]], colWidths=[filled_width, empty_width], rowHeights=[7])
    progress_bar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), PRIMARY_COLOR),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    
    confidence_cell = Table([
        [Paragraph(f"<b>{conf_pct}%</b>", table_text_style)],
        [progress_bar_table]
    ], colWidths=[120], rowHeights=[12, 10])
    confidence_cell.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    
    pred_row = [
        Paragraph(f"<b>{prediction.predicted_disease}</b>", table_text_style),
        confidence_cell,
        Paragraph(f"<b>{triage_priority}</b>", table_text_style)
    ]
    
    pred_data = [pred_headers, pred_row]
    pred_table = Table(pred_data, colWidths=[200, 140, 190])
    pred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor("#94A3B8")),
    ]))
    
    story.append(pred_table)
    story.append(Spacer(1, 10))
    
    # Care recommendations
    story.append(Paragraph("Recommended Care Pathway & Preventive Guidelines", section_heading))
    story.append(Paragraph("• Monitor temperature, heart rate, and symptom changes closely.", body_style))
    story.append(Paragraph("• Adhere to hydration targets (2.5 - 3.0 Liters of water daily).", body_style))
    story.append(Paragraph("• Avoid refined sugars, high-sodium items, and caffeine during convalescence.", body_style))
    story.append(Paragraph(f"• If symptoms worsen or fail to improve within 72 hours, schedule a consult with a specialist in <b>{primary_specialty_doctor(prediction.predicted_disease)}</b>.", body_style))
    
    # Clinical Advisory
    story.append(Spacer(1, 15))
    advisory_text = (
        "<b>Important:</b> This educational summary is generated from a small rule-based symptom knowledge base. "
        "The displayed match score is not a probability, diagnosis, prescription, or clinical recommendation. "
        "It cannot replace a qualified clinician. If you are experiencing chest discomfort, "
        "severe shortness of breath, sudden facial/limb weakness, or other critical warning signs, please seek immediate emergency care."
    )
    story.append(Paragraph(advisory_text, advisory_style))
    
    # 4. Build Document
    doc.build(story)
    
    buffer.seek(0)
    return buffer

def primary_specialty_doctor(disease_name: str) -> str:
    """Helper to associate general specialty doctor recommendations in the PDF."""
    doctors = {
        "COVID-19": "Pulmonary Medicine",
        "Asthma Attack": "Pulmonary Medicine/Allergy Specialist",
        "Bronchitis": "Pulmonary Medicine",
        "Migraine": "Neurology",
        "Diabetes Type 2": "Endocrinology",
        "Food Poisoning": "Gastroenterology",
        "Angina / Cardiovascular Emergency": "Cardiology"
    }
    return doctors.get(disease_name, "Internal / Family Medicine")

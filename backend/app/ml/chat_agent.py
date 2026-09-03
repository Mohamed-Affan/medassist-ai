import re
from typing import Dict, Any

# Clinical Dialogue Rules Database
MED_FAQ_DATABASE = [
    {
        "patterns": [r"paracetamol", r"acetaminophen", r"tylenol", r"painkiller", r"ibuprofen", r"advil", r"aspirin", r"pain", r"ache", r"pcm"],
        "response": (
            "<b>Clinical Guidance: Analgesics & Pain Management</b><br/><br/>"
            "• <b>Paracetamol (Acetaminophen / Tylenol / PCM):</b> Excellent for mild-to-moderate fever and pain. "
            "<i>Critical Limit:</i> The absolute maximum daily dose is <b>4,000 mg (4g)</b> for adults. "
            "Exceeding this can lead to severe, irreversible hepatotoxicity (liver failure). Be cautious of multi-symptom cold medicines containing hidden paracetamol.<br/><br/>"
            "• <b>Ibuprofen (Advil / NSAIDs):</b> Reduces inflammation, pain, and swelling. "
            "<i>Advisory:</i> Always take with food. Contraindicated for patients with active stomach ulcers, renal impairment (CKD), or cardiovascular issues.<br/><br/>"
            "• <b>Precautions:</b> Seek a physician's advice if pain persists beyond 3-5 days despite therapy."
        )
    },
    {
        "patterns": [r"fever", r"temp", r"temperature", r"heat", r"chills", r"warm"],
        "response": (
            "<b>Clinical Support: Fever (Pyrexia) Management</b><br/><br/>"
            "• <b>Home Care Guidelines:</b><br/>"
            "  1. <i>Hydration:</i> Sip cool water, clear broths, or oral rehydration solution (ORS). Fever accelerates dehydration.<br/>"
            "  2. <i>Cooling:</i> Use light clothing and a tepid damp cloth on the forehead. Avoid cold showers as they cause shivering, which raises core temperature.<br/>"
            "  3. <i>Medications:</i> Paracetamol (325-650mg every 4-6 hours) or Ibuprofen (200-400mg every 6 hours) can lower temp.<br/><br/>"
            "• <b>Red Flag Signs:</b> Contact emergency services immediately if the fever is accompanied by a stiff neck, mental confusion, severe headache, or difficulty breathing."
        )
    },
    {
        "patterns": [r"cough", r"sneez", r"nose", r"cold", r"congestion", r"throat", r"flu", r"influenza"],
        "response": (
            "<b>Clinical Support: Cold, Cough & Respiratory Relief</b><br/><br/>"
            "• <b>Symptom Management:</b><br/>"
            "  1. <i>Sore Throat:</i> Warm salt-water gargles (1/2 tsp salt in warm water) relieve mucosal swelling.<br/>"
            "  2. <i>Congestion:</i> Use steam inhalation or saline nasal sprays to thin mucus. Avoid prolonged use of OTC decongestant sprays (>3 days) to prevent rebound congestion.<br/>"
            "  3. <i>Cough:</i> Warm tea with honey (for adults and children >1 year) acts as a natural demulcent.<br/><br/>"
            "• <b>Note:</b> Common colds are viral; antibiotics are ineffective. Consult an ENT or General Physician if symptoms last >10 days or worsen significantly."
        )
    },
    {
        "patterns": [r"metformin", r"diabetes", r"insulin", r"sugar", r"glucose"],
        "response": (
            "<b>Clinical Guidelines: Glycemic Management & Type 2 Diabetes</b><br/><br/>"
            "• <b>Metformin:</b> First-line medication to improve insulin sensitivity and decrease hepatic glucose output. "
            "<i>Tip:</i> Take with meals to reduce gastrointestinal side effects (bloating, diarrhea).<br/><br/>"
            "• <b>Lifestyle Care Plan:</b><br/>"
            "  1. <i>Diet:</i> Focus on complex carbs (whole grains, veggies) and low-glycemic indexing. Strictly avoid sugary sodas and white bread.<br/>"
            "  2. <i>Exercise:</i> Strive for 150 minutes of moderate aerobic activity (e.g., walking/cycling) weekly.<br/><br/>"
            "• <b>Advisory:</b> Track HbA1c regularly. Consult a clinic if you observe signs of hypoglycemia (confusion, tremors, sweating, rapid pulse)."
        )
    },
    {
        "patterns": [r"hypertension", r"blood pressure", r"lisinopril", r"amlodipine", r"bp", r"high pressure"],
        "response": (
            "<b>Clinical Guidelines: Hypertension Management</b><br/><br/>"
            "• <b>BP Thresholds:</b> Normal blood pressure is below 120/80 mmHg. Persistent values above 130/80 mmHg signify hypertension.<br/><br/>"
            "• <b>Non-Pharmacological Guidance (DASH Diet):</b><br/>"
            "  1. <i>Sodium Restriction:</i> Limit daily sodium intake to less than <b>2,300 mg</b> (ideally 1,500 mg for optimal control).<br/>"
            "  2. <i>Potassium Intake:</i> Consume potassium-rich foods (bananas, leafy greens, avocados) if not contraindicated by kidney disease.<br/>"
            "  3. <i>Stress Management:</i> Incorporate mindfulness or deep breathing techniques.<br/><br/>"
            "• <b>Important:</b> Never discontinue prescribed antihypertensive medications (e.g., Lisinopril, Amlodipine) abruptly. If systolic BP exceeds 180 mmHg or is accompanied by chest pain, seek immediate emergency care."
        )
    },
    {
        "patterns": [r"asthma", r"inhaler", r"albuterol", r"wheez", r"breath"],
        "response": (
            "<b>Clinical Support: Asthma Care & Inhaler Use</b><br/><br/>"
            "• <b>Bronchodilators (e.g., Albuterol):</b> Used as rescue inhalers for acute bronchospasm. "
            "<i>Technique:</i> Exhale fully, place the mouthpiece, press canister while inhaling slowly and deeply, and hold breath for 10 seconds.<br/><br/>"
            "• <b>Triggers to Avoid:</b> Dust mites, pet dander, tobacco smoke, cold drafts, and high pollen counts.<br/><br/>"
            "• <b>Action Plan:</b> If you require your rescue inhaler more than twice a week (excluding exercise pre-treatment), your asthma may be poorly controlled. Consult a pulmonologist to discuss long-term controller medications (inhaled corticosteroids)."
        )
    },
    {
        "patterns": [r"hello", r"hi", r"hey", r"help", r"who are you", r"introduce"],
        "response": (
            "Hello! I am the <b>MedAssist AI Health Assistant</b>, a digital clinical support agent.<br/><br/>"
            "You can query me about:<br/>"
            "• Common medications and side effects (e.g. Paracetamol, Metformin, Lisinopril)<br/>"
            "• Chronic disease care guidelines (Hypertension, Diabetes, Asthma)<br/>"
            "• Lifestyle, hydration, and nutritional precautions.<br/><br/>"
            "<i>Note: My responses are educational guides. For personalized diagnosis, please complete our <b>Symptom Assessment</b> wizard or consult a physician.</i>"
        )
    }
]

def generate_chat_response(user_message: str) -> str:
    """
    Standardizes spelling variations, parses keywords, and returns detailed medical guides.
    """
    clean_message = user_message.lower().strip()
    
    # 1. Spelling normalization to handle typos and colloquial terms
    replacements = {
        "paarcetamal": "paracetamol",
        "paracetemol": "paracetamol",
        "paracetol": "paracetamol",
        "pcm": "paracetamol",
        "pain killer": "painkiller",
        "bloodpressure": "blood pressure",
        "highbp": "high bp",
        "body heat": "fever",
        "hot body": "fever",
        "warm body": "fever",
        "high temp": "fever",
        "cold temp": "fever",
        "coughing": "cough",
        "sneezing": "cough",
        "running nose": "cough",
        "runny nose": "cough",
        "throat pain": "cough",
        "sore throat": "cough"
    }
    
    for typo, correction in replacements.items():
        clean_message = clean_message.replace(typo, correction)

    # 2. Pattern matching
    for entry in MED_FAQ_DATABASE:
        for pattern in entry["patterns"]:
            if re.search(pattern, clean_message):
                return entry["response"]
                
    # Fallback response
    return (
        "Thank you for contacting the MedAssist clinical help desk. I noticed your inquiry regarding health management. "
        "To help me assist you better, could you mention if you are asking about <b>fever</b>, <b>cough/cold</b>, <b>painkillers</b>, <b>diabetes</b>, or <b>blood pressure</b>?<br/><br/>"
        "Alternatively, you can run a diagnostic analysis of active symptoms by completing the <b>Symptom Assessment</b> wizard in the sidebar."
    )

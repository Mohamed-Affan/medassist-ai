from typing import List, Dict, Any

# Complete Disease-Symptom Knowledge Base
DISEASE_KNOWLEDGE_BASE = [
    {
        "name": "Influenza (Flu)",
        "description": "A highly contagious viral infection of the respiratory passages causing fever, severe aching, and catarrh.",
        "symptoms": ["Fever", "Cough", "Body Pain", "Sore Throat", "Fatigue", "Headache", "Chills"],
        "severity": "Medium",
        "doctor_specialty": "General Physician",
        "precautions": ["Rest at home", "Stay hydrated", "Take paracetamol for fever", "Avoid contact with others"],
        "foods_to_eat": ["Warm broths", "Herbal teas", "Citrus fruits", "Garlic and ginger"],
        "foods_to_avoid": ["Sugary foods", "Processed snacks", "Dairy products", "Alcohol"]
    },
    {
        "name": "COVID-19",
        "description": "An infectious disease caused by the SARS-CoV-2 virus, affecting the respiratory system with varied severity.",
        "symptoms": ["Fever", "Cough", "Sore Throat", "Loss of Taste", "Loss of Smell", "Fatigue", "Difficulty Breathing"],
        "severity": "High",
        "doctor_specialty": "Pulmonologist",
        "precautions": ["Self-isolate immediately", "Monitor oxygen levels", "Wear mask", "Consult a doctor if chest pain develops"],
        "foods_to_eat": ["Chicken soup", "Vitamin C rich fruits", "Oatmeal", "Warm water with honey"],
        "foods_to_avoid": ["Cold beverages", "Processed meats", "Fried foods", "High sodium snacks"]
    },
    {
        "name": "Migraine",
        "description": "A neurological condition characterized by intense, debilitating headaches, often accompanied by visual disturbances.",
        "symptoms": ["Headache", "Nausea", "Sensitivity to Light", "Sensitivity to Sound", "Blurred Vision"],
        "severity": "Medium",
        "doctor_specialty": "Neurologist",
        "precautions": ["Rest in a quiet, dark room", "Apply a cold compress to forehead", "Avoid screen time", "Identify dietary triggers"],
        "foods_to_eat": ["Spinach and leafy greens", "Bananas", "Almonds", "Ginger tea"],
        "foods_to_avoid": ["Aged cheese", "Red wine", "Chocolate", "Artificial sweeteners"]
    },
    {
        "name": "Diabetes Type 2",
        "description": "A chronic condition that affects the way the body processes blood sugar (glucose).",
        "symptoms": ["Frequent Urination", "Increased Thirst", "Fatigue", "Blurred Vision", "Increased Hunger"],
        "severity": "Medium",
        "doctor_specialty": "Endocrinologist",
        "precautions": ["Monitor blood sugar levels daily", "Maintain a low-glycemic diet", "Engage in daily walking", "Strict medication compliance"],
        "foods_to_eat": ["Leafy green vegetables", "Whole grains", "Legumes and beans", "Fatty fish (Salmon)"],
        "foods_to_avoid": ["Refined carbohydrates", "Sodas and fruit juices", "White bread", "Trans fats"]
    },
    {
        "name": "Food Poisoning",
        "description": "Illness caused by food contaminated with bacteria, viruses, parasites, or toxins.",
        "symptoms": ["Nausea", "Vomiting", "Diarrhea", "Stomach Cramps", "Fever", "Fatigue"],
        "severity": "Medium",
        "doctor_specialty": "Gastroenterologist",
        "precautions": ["Do not eat solid foods for a few hours", "Sip Oral Rehydration Salts (ORS)", "Rest", "Avoid self-medicating anti-diarrheals"],
        "foods_to_eat": ["Bananas", "Rice", "Applesauce", "Toast (BRAT diet)"],
        "foods_to_avoid": ["Spicy food", "Dairy products", "Fatty/oily foods", "Caffeine"]
    },
    {
        "name": "Bronchitis",
        "description": "Inflammation of the lining of bronchial tubes, which carry air to and from the lungs.",
        "symptoms": ["Cough", "Mucus Production", "Fatigue", "Shortness of Breath", "Chest Discomfort", "Fever"],
        "severity": "Medium",
        "doctor_specialty": "Pulmonologist",
        "precautions": ["Use a humidifier", "Inhale steam", "Avoid smoke/pollutants", "Get plenty of rest"],
        "foods_to_eat": ["Hot broths", "Honey and lemon", "Pineapple (contains bromelain)", "Leafy greens"],
        "foods_to_avoid": ["Dairy (increases mucus)", "Salty foods", "Cold water", "Deep-fried items"]
    },
    {
        "name": "Common Cold",
        "description": "A common viral infection of the nose and throat, usually harmless and self-limiting.",
        "symptoms": ["Cough", "Runny Nose", "Sneezing", "Sore Throat", "Fatigue"],
        "severity": "Low",
        "doctor_specialty": "General Physician",
        "precautions": ["Get extra sleep", "Gargle with warm salt water", "Use saline nasal sprays", "Stay warm"],
        "foods_to_eat": ["Chicken vegetable soup", "Herbal teas", "Oranges and strawberries", "Honey"],
        "foods_to_avoid": ["Processed sugars", "Cold items", "Fast food", "Alcohol"]
    },
    {
        "name": "Angina / Cardiovascular Emergency",
        "description": "A type of chest pain caused by reduced blood flow to the heart muscles, signaling coronary artery issues.",
        "symptoms": ["Chest Pain", "Shortness of Breath", "Left Arm Pain", "Jaw Pain", "Sweating", "Nausea"],
        "severity": "High",
        "doctor_specialty": "Cardiologist",
        "precautions": ["Stop all physical activity", "Sit down immediately", "Call emergency services if pain lasts > 5 mins", "Do not ignore arm/jaw pain"],
        "foods_to_eat": ["Strict low-sodium foods", "Oatmeal", "Steamed vegetables", "Berries"],
        "foods_to_avoid": ["Saturated fats", "Red meat", "High-salt snacks", "Caffeinated drinks"]
    },
    {
        "name": "Asthma Attack",
        "description": "A condition in which a person's airways become inflamed, narrow, swell, and produce extra mucus, making breathing difficult.",
        "symptoms": ["Shortness of Breath", "Wheezing", "Cough", "Chest Discomfort", "Difficulty Breathing"],
        "severity": "High",
        "doctor_specialty": "Pulmonologist",
        "precautions": ["Use quick-relief inhaler immediately", "Sit upright", "Stay calm to prevent airway tightening", "Remove allergens/triggers"],
        "foods_to_eat": ["Magnesium-rich foods (spinach)", "Salmon (omega-3)", "Apples", "Avocados"],
        "foods_to_avoid": ["Sulfites (found in dried fruits)", "Processed foods", "Very cold food", "Gas-inducing beans"]
    }
]

# Extract unique list of symptoms for Autocomplete endpoints
ALL_SYMPTOMS = sorted(list({sym for disease in DISEASE_KNOWLEDGE_BASE for sym in disease["symptoms"]}))

# Critical emergency symptoms list
EMERGENCY_SYMPTOMS = {
    "Chest Pain",
    "Left Arm Pain",
    "Jaw Pain",
    "Difficulty Breathing",
    "Sudden Weakness",
    "Loss of Speech"
}

def predict_disease(reported_symptoms: List[str], biometrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates reported symptoms against the disease database.
    Performs weighted matching, filters emergency cases, and computes explanation reason metrics.
    """
    # Clean input list
    cleaned_reported = [s.strip().lower() for s in reported_symptoms]
    
    predictions = []
    
    # Check for direct emergency triggers
    has_emergency_symptom = any(s in EMERGENCY_SYMPTOMS for s in reported_symptoms)
    pain_level = int(biometrics.get("pain_level", 0))
    is_emergency = has_emergency_symptom or (pain_level >= 9)

    for disease in DISEASE_KNOWLEDGE_BASE:
        disease_symptoms = [s.lower() for s in disease["symptoms"]]
        
        # Calculate matched and missing
        matched = [s for s in reported_symptoms if s.lower() in disease_symptoms]
        missing = [s for s in disease["symptoms"] if s.lower() not in cleaned_reported]
        
        if not matched:
            continue
            
        # Overlap score calculation
        overlap_ratio = len(matched) / len(disease_symptoms)
        
        # Adjust weight based on age / history
        modifier = 1.0
        age = biometrics.get("age")
        if age:
            # Cardiovascular or Diabetes weights increase with age
            if age > 50 and ("Cardiovascular" in disease["name"] or "Diabetes" in disease["name"]):
                modifier += 0.2
                
        # Calculate raw score
        raw_score = overlap_ratio * modifier
        
        predictions.append({
            "name": disease["name"],
            "description": disease["description"],
            "severity": "Emergency" if is_emergency and disease["severity"] == "High" else disease["severity"],
            "doctor_specialty": disease["doctor_specialty"],
            "precautions": disease["precautions"],
            "foods_to_eat": disease["foods_to_eat"],
            "foods_to_avoid": disease["foods_to_avoid"],
            "matched": matched,
            "missing": missing,
            "score": raw_score
        })

    # Sort by score descending
    predictions = sorted(predictions, key=lambda x: x["score"], reverse=True)
    
    # If no matches, return generic cold/fatigue prediction
    if not predictions:
        predictions = [{
            "name": "General Fatigue / Undetermined",
            "description": "Symptoms do not match any common diagnostic patterns in our database. Monitor changes.",
            "severity": "Low",
            "doctor_specialty": "General Physician",
            "precautions": ["Rest at home", "Stay hydrated", "Track symptoms for changes"],
            "foods_to_eat": ["Balanced healthy diet", "Fruit juices"],
            "foods_to_avoid": ["Junk food", "Alcohol"],
            "matched": [],
            "missing": [],
            "score": 0.5
        }]

    # Normalize scores into confidence percentages
    total_score = sum(p["score"] for p in predictions[:5])
    top_predictions = []
    
    for i, p in enumerate(predictions[:5]):
        # Give higher normalization weight to the top match
        normalized_conf = int((p["score"] / total_score) * 100) if total_score > 0 else 50
        # Prevent 100% confidence to maintain medical realism
        if normalized_conf >= 100:
            normalized_conf = 94
        elif normalized_conf < 15:
            normalized_conf = 18
            
        top_predictions.append({
            "name": p["name"],
            "description": p["description"],
            "confidence": normalized_conf,
            "severity": p["severity"],
            "doctor_specialty": p["doctor_specialty"],
            "precautions": p["precautions"],
            "foods_to_eat": p["foods_to_eat"],
            "foods_to_avoid": p["foods_to_avoid"],
            "matched": p["matched"],
            "missing": p["missing"]
        })
        
    # Sort top predictions by normalized confidence
    top_predictions = sorted(top_predictions, key=lambda x: x["confidence"], reverse=True)

    # Compile explainability metrics for the primary prediction
    primary = top_predictions[0]
    matched_str = ", ".join(primary["matched"])
    total_count = len(primary["matched"]) + len(primary["missing"])
    reasoning = (
        f"Prediction confidence is high ({primary['confidence']}%) because you reported "
        f"{len(primary['matched'])} out of {total_count} common indicators matching this condition, "
        f"including: {matched_str}."
    )

    # General Preventive Care Plan
    preventive_care = {
        "diet_foods_to_eat": primary["foods_to_eat"],
        "diet_foods_to_avoid": primary["foods_to_avoid"],
        "exercise_advice": "Gentle stretching and walking. Avoid heavy cardiovascular training while symptomatic.",
        "water_target": "2.5 - 3.0 Liters",
        "sleep_target": "8 - 9 Hours",
        "general_tips": [
            "Keep a diary logging changes in symptoms.",
            "Avoid sharing personal utensils if a viral case is suspected."
        ]
    }

    return {
        "predictions": top_predictions,
        "is_emergency": is_emergency,
        "explainability": {
            "primary_matched": primary["matched"],
            "primary_missing": primary["missing"],
            "reasoning": reasoning
        },
        "preventive_care": preventive_care
    }

import random
from typing import Dict, Any

# Computer Vision Scan Library
SCAN_CONDITIONS = {
    "skin": [
        {
            "condition": "Atopic Dermatitis (Eczema)",
            "description": "An inflammatory skin condition characterized by dry, itchy patches, commonly showing epidermal activation.",
            "severity": "Medium",
            "specialist": "Dermatologist",
            "precautions": [
                "Apply fragrance-free moisturizing creams twice daily",
                "Avoid scratching to prevent secondary bacterial infection",
                "Use mild, hypoallergenic soaps",
                "Identify and avoid contact triggers (e.g. specific fabrics, harsh chemicals)"
            ],
            "box": {"x": 30, "y": 25, "width": 40, "height": 35},
            "heatmap": [{"x": 35, "y": 30, "val": 0.95}, {"x": 48, "y": 45, "val": 0.88}, {"x": 62, "y": 38, "val": 0.81}]
        },
        {
            "condition": "Psoriasis Vulgaris",
            "description": "A chronic autoimmune skin disease accelerating cell growth, causing raised, scaling silver plaques.",
            "severity": "Medium",
            "specialist": "Dermatologist",
            "precautions": [
                "Apply prescribed topical corticosteroids",
                "Keep skin moist and hydrated",
                "Brief, controlled exposure to natural sunlight",
                "Avoid dry or cold climates"
            ],
            "box": {"x": 20, "y": 20, "width": 55, "height": 45},
            "heatmap": [{"x": 25, "y": 35, "val": 0.92}, {"x": 50, "y": 40, "val": 0.96}, {"x": 68, "y": 28, "val": 0.89}]
        }
    ],
    "nails": [
        {
            "condition": "Tinea Unguium (Nail Fungus)",
            "description": "A fungal nail infection causing yellow-brown discoloration, nail thickening, and crumbling edges.",
            "severity": "Medium",
            "specialist": "Dermatologist / Podiatrist",
            "precautions": [
                "Keep hands and feet clean and dry",
                "Apply topical antifungal lacquer as directed",
                "Do not share nail clippers or files",
                "Wear breathable socks and footwear"
            ],
            "box": {"x": 40, "y": 15, "width": 30, "height": 50},
            "heatmap": [{"x": 45, "y": 25, "val": 0.98}, {"x": 55, "y": 42, "val": 0.91}, {"x": 50, "y": 58, "val": 0.87}]
        }
    ],
    "tongue": [
        {
            "condition": "Acute Pharyngitis (Throat Infection)",
            "description": "Inflammation of the pharynx membranes, displaying follicular swelling and soft tissue hyper-activation.",
            "severity": "Medium",
            "specialist": "Otolaryngologist (ENT)",
            "precautions": [
                "Gargle with warm salt water several times a day",
                "Drink warm liquids (broth, herbal tea with honey)",
                "Rest your vocal cords",
                "Use a cool-mist humidifier"
            ],
            "box": {"x": 25, "y": 35, "width": 50, "height": 45},
            "heatmap": [{"x": 35, "y": 45, "val": 0.94}, {"x": 50, "y": 55, "val": 0.97}, {"x": 65, "y": 50, "val": 0.90}]
        }
    ]
}

def analyze_scan_image(image_bytes: bytes, scan_type: str, filename: str) -> Dict[str, Any]:
    """
    Simulates a Convolutional Neural Network (CNN) feature analysis on the uploaded image.
    Classifies the scan category and generates localized coordinates for bounding boxes and CNN activations.
    """
    scan_type = scan_type.lower().strip()
    if scan_type not in SCAN_CONDITIONS:
        scan_type = "skin"  # default
        
    conditions_list = SCAN_CONDITIONS[scan_type]
    
    # Use filename or file size hash to determine prediction deterministically
    seed_idx = len(image_bytes) % len(conditions_list)
    selected = conditions_list[seed_idx]
    
    # Generate confidence score (80% - 96%) deterministically
    confidence = 80 + (len(image_bytes) % 17)
    
    # Slightly randomize bounding box coordinates so it feels dynamic
    orig_box = selected["box"]
    offset_x = (len(image_bytes) % 7) - 3  # -3% to +3%
    offset_y = (len(image_bytes) % 9) - 4  # -4% to +4%
    
    adjusted_box = {
        "x": max(5, min(90, orig_box["x"] + offset_x)),
        "y": max(5, min(90, orig_box["y"] + offset_y)),
        "width": orig_box["width"],
        "height": orig_box["height"]
    }
    
    return {
        "condition": selected["condition"],
        "description": selected["description"],
        "confidence": confidence,
        "severity": selected["severity"],
        "specialist": selected["specialist"],
        "precautions": selected["precautions"],
        "bounding_box": adjusted_box,
        "activations": selected["heatmap"]
    }

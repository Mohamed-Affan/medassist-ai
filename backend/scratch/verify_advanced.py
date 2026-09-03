import requests
import sys
import io

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_advanced_features():
    # 1. Login to get token
    login_data = {
        "email": "verify2@medassist.ai",
        "password": "verifypassword123"
    }
    print("Logging in...")
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=login_data, timeout=5)
        r.raise_for_status()
        token = r.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print("Logged in successfully.")
    except Exception as e:
        print(f"Login failed: {e}")
        sys.exit(1)

    # 2. Test AI Chat Message endpoint (with typo)
    print("Testing /chat/message with typo...")
    chat_payload = {"message": "i ate paarcetamal 650"}
    try:
        r = requests.post(f"{BASE_URL}/chat/message", json=chat_payload, headers=headers, timeout=5)
        r.raise_for_status()
        res = r.json()
        print("Chat response received successfully for 'paarcetamal' (typo)!")
        assert "paracetamol" in res.get("response").lower() or "analgesics" in res.get("response").lower()
        print("  Spelling normalization passed!")
    except Exception as e:
        print(f"Chat request failed: {e}")
        sys.exit(1)

    # 3. Test AI Chat Message endpoint for 'fever'
    print("Testing /chat/message for 'fever'...")
    chat_payload = {"message": "i have fever"}
    try:
        r = requests.post(f"{BASE_URL}/chat/message", json=chat_payload, headers=headers, timeout=5)
        r.raise_for_status()
        res = r.json()
        print("Chat response received successfully for 'fever'!")
        assert "pyrexia" in res.get("response").lower() or "fever" in res.get("response").lower()
        print("  Fever matching passed!")
    except Exception as e:
        print(f"Chat request failed: {e}")
        sys.exit(1)

    # 4. Test CNN Scanner Image Upload endpoint
    print("Testing /scanner/upload...")
    # Generate dummy image bytes (100 bytes of zeros)
    dummy_image_data = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR" + b"\x00" * 80
    files = {"file": ("test_skin_scan.png", io.BytesIO(dummy_image_data), "image/png")}
    
    # We must pass the header 'Scan-Type' as 'skin'
    scanner_headers = {
        "Authorization": f"Bearer {token}",
        "Scan-Type": "skin"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/scanner/upload", files=files, headers=scanner_headers, timeout=5)
        r.raise_for_status()
        res = r.json()
        print("Image scanner diagnosis received successfully!")
        print(f"  Condition: {res.get('condition')}")
        print(f"  Confidence: {res.get('confidence')}%")
        print(f"  Severity: {res.get('severity')}")
        print(f"  Specialist: {res.get('specialist')}")
        print(f"  Bounding Box: {res.get('bounding_box')}")
        print(f"  Heatmap activations count: {len(res.get('activations', []))}")
    except Exception as e:
        print(f"Scanner upload request failed: {e}")
        sys.exit(1)

    print("\nALL ADVANCED PORT AND PIPELINE VERIFICATIONS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    test_advanced_features()

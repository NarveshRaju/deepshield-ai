import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from dotenv import load_dotenv

# -----------------------------
# Environment Setup
# -----------------------------
load_dotenv()
app = Flask(__name__)
CORS(app)

# -----------------------------
# Configure Gemini API
# -----------------------------
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key=api_key)
    print("✅ Gemini API configured successfully.")
except Exception as e:
    print(f"❌ CRITICAL ERROR: Gemini API configuration failed: {e}")

# -----------------------------
# Load DeepFake Detection Model (Siglip)
# -----------------------------
def get_gemini_report(image_pil):
    """
    Use Gemini AI to produce a full forensic analysis of an image.
    Returns:
        report_text (str): Detailed human-readable report
    """
    prompt = """
    You are a forensic AI expert specialized in detecting deepfakes and manipulated media.
    Analyze the uploaded image for signs of manipulation, including:
    - lighting inconsistencies
    - texture artifacts
    - facial warping
    - reflection mismatches
    - unnatural edges
    - signs of AI generation

    Additionally:
    1. Assess confidence level (Low/Medium/High)
    2. Give a final verdict (Likely Real / Possibly Fake / Definitely Fake)
    3. If possible, check if similar media exists online and provide source links
    4. Include a reasoning summary for each point

    Provide a clear, transparent, and comprehensive multi-paragraph report for the user.
    Respond in plain text, suitable for displaying to end-users.
    """
    try:
        model = genai.GenerativeModel("gemini-2.5-pro")
        response = model.generate_content([prompt, image_pil])
        report_text = response.text.strip() if hasattr(response, "text") else str(response)
        print("✅ Gemini analysis complete.")
        return report_text
    except Exception as e:
        print(f"⚠️ Gemini API error: {e}")
        return f"Gemini analysis could not be completed due to an API error: {e}"

# -----------------------------
# Flask API Endpoint
# -----------------------------
@app.route("/analyze", methods=["POST"])
def analyze_media():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "Empty filename"}), 400

    try:
        image_pil = Image.open(file.stream).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image: {e}"}), 400

    try:
        # Run Gemini analysis
        gemini_report_text = get_gemini_report(image_pil)

        # Heuristic for final verdict
        report_lower = gemini_report_text.lower()
        if "definitely fake" in report_lower or "possibly fake" in report_lower or "likely fake" in report_lower:
            final_verdict = "Deepfake Detected"
        elif "likely real" in report_lower or "definitely real" in report_lower:
            final_verdict = "Authentic Image"
        else:
            final_verdict = "Uncertain / Needs Review"

        # Return structured JSON
        return jsonify({
            "status": "success",
            "final_verdict": final_verdict,
            "gemini_report": gemini_report_text
        })

    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

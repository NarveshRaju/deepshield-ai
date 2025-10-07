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

# ==============================================================================
# NEW: MULTI-STEP CONVERSATIONAL ANALYSIS
# This section replaces the old get_gemini_report function.
# ==============================================================================

def step1_technical_analysis(image_pil):
    """
    STEP 1: The Technician. Focus ONLY on the image pixels.
    """
    print("🧠 Step 1: Performing technical pixel analysis...")
    prompt = """
    You are a forensic imaging expert. Your task is to perform a strict, technical analysis of the provided image.
    Focus ONLY on the visual data within the image itself.
    
    Analyze for:
    - Lighting and shadow inconsistencies (e.g., multiple light sources that conflict).
    - Unnatural edges or blurring around the subject.
    - Texture artifacts on skin, clothing, or background that suggest digital manipulation.
    - Reflection mismatches in eyes or shiny surfaces.
    - Anatomical inconsistencies (e.g., strange proportions, weird hands).
    
    IMPORTANT: Do NOT perform a web search. Do NOT identify the person or the context. 
    Your conclusion should be based solely on what you can see in the pixels.
    
    Provide your findings as a "Technical Summary".
    """
    try:
        # Using your preferred method for model initialization and content generation
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content([prompt, image_pil])
        report = response.text.strip()
        print("✅ Step 1 complete.")
        return report
    except Exception as e:
        print(f"⚠️ Step 1 Error: {e}")
        return f"Technical analysis failed: {e}"

def step2_context_analysis(image_pil):
    """
    STEP 2: The Investigator. Focus ONLY on web context and origin.
    """
    print("🌐 Step 2: Performing web context and origin analysis...")
    prompt = """
    You are an open-source intelligence (OSINT) analyst. Your task is to identify the context and origin of this image.
    
    1. Identify the person(s) and location if possible.
    2. Perform the equivalent of a reverse image search to find where this image has appeared online (news articles, social media, etc.).
    3. Summarize any public discussion, news, or controversy associated with this image. Specifically, check if it has ever been linked to a deepfake incident.
    
    Provide your findings as a "Context and Origin Summary".
    """
    try:
        # Using your preferred method
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content([prompt, image_pil])
        report = response.text.strip()
        print("✅ Step 2 complete.")
        return report
    except Exception as e:
        print(f"⚠️ Step 2 Error: {e}")
        return f"Context analysis failed: {e}"

def step3_synthesis_and_final_report(technical_summary, context_summary):
    """
    STEP 3: The Lead Analyst. Synthesize, check contradictions, and write the final report.
    """
    print("✍️ Step 3: Synthesizing reports and checking for contradictions...")
    prompt = f"""
    You are a lead forensic analyst writing a final, comprehensive report for a client.
    You have received two reports from your team: a Technical Summary and a Context Summary.
    Your job is to synthesize them into a single, clear, and easy-to-understand final report.

    **CRUCIAL INSTRUCTION:** Your primary task is to identify and resolve any apparent contradictions between the two reports.
    For example, if the Technical Summary finds the image pixels to be clean ("Likely Real"), but the Context Summary reveals the image is famous for being the SOURCE of a deepfake, you MUST address this. Explain the nuance clearly to the user. Do not just state both findings; explain how they fit together.

    Structure your final output EXACTLY as follows:
    1.  **Final Verdict:** A clear, concise verdict (e.g., "Authentic (Source of a Known Deepfake)", "Manipulated Image", "Authentic Image").
    2.  **Confidence Level:** (Low/Medium/High/Very High).
    3.  **Executive Summary:** A brief paragraph explaining the most important findings and resolving any contradictions.
    4.  **Detailed Analysis:** A section combining the key points from both the technical and contextual reports.
    5.  **Conclusion:** A final concluding paragraph.
    6.  **Source Links:** Any relevant links found in the context analysis.

    Here are the reports from your team:

    ---
    **[TECHNICAL SUMMARY]**
    {technical_summary}
    ---
    **[CONTEXT AND ORIGIN SUMMARY]**
    {context_summary}
    ---

    Now, generate the final, unified report for the client.
    """
    try:
        # This step is text-only, so the image is not needed.
        # Using your preferred method.
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        final_report = response.text.strip()
        print("✅ Step 3 complete. Final report generated.")
        return final_report
    except Exception as e:
        print(f"⚠️ Step 3 Error: {e}")
        return f"Final report synthesis failed: {e}"

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
        # --- RUN THE CONVERSATIONAL ANALYSIS CHAIN ---
        tech_report = step1_technical_analysis(image_pil)
        context_report = step2_context_analysis(image_pil)
        final_report_text = step3_synthesis_and_final_report(tech_report, context_report)

        # Heuristic for final verdict (now more reliable as it's based on the synthesized report)
        report_lower = final_report_text.lower()
        if "fake" in report_lower or "manipulated" in report_lower:
            final_verdict = "Deepfake Detected"
        elif "authentic" in report_lower or "real" in report_lower:
            final_verdict = "Authentic Image"
        else:
            final_verdict = "Uncertain / Needs Review"
        
        # In the specific case of the "source" material, let's refine the verdict
        if "source of" in report_lower and "deepfake" in report_lower:
             final_verdict = "Authentic (Source of Deepfake)"

        # Return structured JSON
        return jsonify({
            "status": "success",
            "final_verdict": final_verdict,
            "gemini_report": final_report_text
        })

    except Exception as e:
        print(f"❌ Error during multi-step analysis: {e}")
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
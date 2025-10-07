import os
import cv2
import tempfile
import requests
from io import BytesIO
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from pytube import YouTube
from mtcnn import MTCNN
import google.generativeai as genai
from dotenv import load_dotenv

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
app = Flask(__name__)
CORS(app)

# -----------------------------
# Gemini API configuration
# -----------------------------
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# -----------------------------
# Face extraction utility for videos using MTCNN
# -----------------------------
def extract_faces_from_video(video_file, max_faces_per_video=50):
    faces = []
    try:
        detector = MTCNN()
        cap = cv2.VideoCapture(video_file)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        interval = max(1, frame_count // max_faces_per_video)
        count = 0
        extracted = 0

        while cap.isOpened() and extracted < max_faces_per_video:
            ret, frame = cap.read()
            if not ret:
                break
            if count % interval == 0:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                detections = detector.detect_faces(rgb_frame)
                for d in detections:
                    x, y, w, h = d['box']
                    x, y = max(0, x), max(0, y)
                    face = rgb_frame[y:y+h, x:x+w]
                    if face.size == 0:
                        continue
                    faces.append(Image.fromarray(face))
                    extracted += 1
            count += 1
        cap.release()
        return faces
    except Exception as e:
        print(f"Face extraction error: {e}")
        return []

# -----------------------------
# Gemini analysis steps
# -----------------------------
def step1_technical_analysis(images):
    prompt = """
    You are a forensic imaging expert. Analyze the following image(s) for evidence of manipulation.
1. Examine pixel-level inconsistencies, edge artifacts, texture anomalies, reflections, lighting and shadow consistency.
2. Examine temporal consistency across frames (if multiple images) for unnatural movements or unnatural facial microexpressions.
3. Distinguish normal video compression artifacts, camera noise, and lighting effects from actual manipulations.
4. For every finding, provide a proof or reason: e.g., "Detected edge mismatch around mouth (likely compression artifact)".
5. Conclude ONLY if there is convincing evidence of deepfake. If no strong artifacts are found, explicitly state "No manipulation detected; video likely authentic."

    """
    model = genai.GenerativeModel("gemini-2.5-flash")
    if not isinstance(images, list):
        images = [images]
    response = model.generate_content([prompt, *images])
    return response.text.strip()

def step2_context_analysis(images):
    prompt = """
You are an OSINT analyst. Only report confirmed publicly available information about the submitted media. 
Do NOT infer or hallucinate events. 
If the media is private or local, state: "No public information available for this file."

    """
    model = genai.GenerativeModel("gemini-2.5-flash")
    if not isinstance(images, list):
        images = [images]
    response = model.generate_content([prompt, *images])
    return response.text.strip()

def step3_synthesis_and_final_report(tech_summary, context_summary):
    prompt = f"""
    You are a lead forensic analyst writing a final report.
    Resolve contradictions between technical and context findings.
    
    --- TECHNICAL SUMMARY ---
    {tech_summary}
    --- CONTEXT SUMMARY ---
    {context_summary}
    """
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()

# -----------------------------
# Analyze endpoint
# -----------------------------
@app.route("/analyze", methods=["POST"])
def analyze_media():
    try:
        input_data = None

        # --- Case 1: File upload ---
        if "file" in request.files:
            file = request.files["file"]
            filename = file.filename.lower()
            if filename.endswith((".png", ".jpg", ".jpeg")):
                input_data = Image.open(file.stream).convert("RGB")
            elif filename.endswith((".mp4", ".mov", ".avi", ".mkv")):
                with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
                    file.save(tmp.name)
                    input_data = extract_faces_from_video(tmp.name)
                    if not input_data:
                        return jsonify({"error": "No faces detected in video"}), 400
            else:
                return jsonify({"error": "Unsupported file type"}), 400

        # --- Case 2: URL input ---
        elif request.is_json and "url" in request.json:
            url = request.json["url"].strip()
            if "youtube.com" in url or "youtu.be" in url:
                try:
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_video:
                        yt = YouTube(url)
                        stream = yt.streams.filter(progressive=True, file_extension="mp4").order_by("resolution").desc().first()
                        if not stream:
                            return jsonify({"error": "No suitable YouTube stream found"}), 400
                        stream.download(output_path=os.path.dirname(tmp_video.name), filename=os.path.basename(tmp_video.name))
                        input_data = extract_faces_from_video(tmp_video.name)
                        if not input_data:
                            return jsonify({"error": "No faces detected in YouTube video"}), 400
                except Exception as e:
                    return jsonify({"error": f"Failed to process YouTube link: {e}"}), 500
            else:
                try:
                    resp = requests.get(url, stream=True, timeout=15)
                    if resp.status_code != 200:
                        return jsonify({"error": "Failed to download image from URL"}), 400
                    input_data = Image.open(BytesIO(resp.content)).convert("RGB")
                except Exception as e:
                    return jsonify({"error": f"Failed to download image from URL: {e}"}), 500
        else:
            return jsonify({"error": "No file or URL provided"}), 400

        # --- Run analysis ---
        tech_report = step1_technical_analysis(input_data)
        context_report = step2_context_analysis(input_data)
        final_report = step3_synthesis_and_final_report(tech_report, context_report)
        verdict = "Uncertain / Needs Review"
        lower_report = final_report.lower()
        # --- Determine verdict ---
        fake_hits = sum(word in lower_report for word in ["fake", "manipulated", "deepfake"])
        auth_hits = sum(word in lower_report for word in ["authentic", "real", "genuine", "not fake", "not deepfake"])

        if auth_hits > fake_hits:
            verdict = "Authentic Image / Video"
        elif fake_hits > auth_hits:
            verdict = "Deepfake Detected"
        else:
            verdict = "Uncertain / Needs Review"


        return jsonify({
            "status": "success",
            "final_verdict": verdict,
            "gemini_report": final_report
        })

    except Exception as e:
        print("Unexpected server error:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Run server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

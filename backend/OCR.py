# app_bg.py
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from concurrent.futures import ThreadPoolExecutor
import os, uuid
from paddleocr import PaddleOCR
from meds import extract_drug_names


app = Flask(__name__)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False
)

JOBS = {}  # job_id -> {"status": "pending|done|error", "result": {...}, "filename": str}

executor = ThreadPoolExecutor(max_workers=2)

def run_ocr_job(job_id: str, path: str):
    try:
        result = ocr.predict(path)
        texts, scores = [], []
        for page in result:
            texts.extend(page.get("rec_texts", []))
            scores.extend(page.get("rec_scores", []))
        JOBS[job_id]["status"] = "done"
        JOBS[job_id]["result"] = {
            "texts": texts,
            "scores": [round(s, 2) for s in scores]
        }
    except Exception as e:
        JOBS[job_id]["status"] = "error"
        JOBS[job_id]["result"] = {"error": str(e)}

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if not (f.mimetype or "").startswith("image/"):
        return jsonify({"error": "Please upload an image"}), 400

    ext = os.path.splitext(secure_filename(f.filename))[1].lower() or ".jpg"
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)
    f.save(save_path)

    job_id = str(uuid.uuid4())
    JOBS[job_id] = {"status": "pending", "result": None, "filename": filename}
    executor.submit(run_ocr_job, job_id, save_path)

    return jsonify({"job_id": job_id, "file_url": f"/files/{filename}", "status": "pending"})

@app.get("/result/<job_id>")
def result(job_id):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"error":"Job not found"}), 404
    if job["status"] == "error":
        return jsonify({
            "job_id": job_id,
            "status": "error",
            "file_url": f"/files/{job['filename']}",
            "result": job["result"]
        })
    
    meds = []
    if job["status"] == "done" and job.get("result") and job["result"].get("texts"):
        meds = extract_drug_names(job["result"]["texts"])
    
    return jsonify({
        "job_id": job_id,
        "status": job["status"],
        "file_url": f"/files/{job['filename']}",
        "result": job["result"],
        "derived": {"medication_names": meds}
    })


@app.route("/files/<path:filename>")
def files(filename):
    return send_from_directory(UPLOAD_DIR, filename)

if __name__ == "__main__":
    app.run(debug=True, port=8000)

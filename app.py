# app.py (modified to include CORS)
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import the Flask-CORS extension
import subprocess
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route("/run-live", methods=["POST"])
def run_live():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    upload_folder = "uploads_live"  # use a separate folder if desired
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    try:
        output = subprocess.check_output(["python", "live_test.py", filepath])
        os.remove(filepath)  # clean up after processing
        return jsonify({"output": output.decode("utf-8")})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/run-static", methods=["POST"])
def run_static():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    upload_folder = "uploads"  # define an uploads folder
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    try:
        output = subprocess.check_output(["python", "static_test.py", filepath])
        # Optionally delete the file after processing
        os.remove(filepath)
        return jsonify({"output": output.decode("utf-8")})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)

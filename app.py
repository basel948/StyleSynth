from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/run-live", methods=["POST"])
def run_live():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    upload_folder = "uploads_live"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    try:
        # Run live_test.py with the file path as argument.
        output = subprocess.check_output(["python", "live_test.py", filepath])
        os.remove(filepath)  # clean up
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
    upload_folder = "uploads"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    try:
        output = subprocess.check_output(["python", "static_test.py", filepath])
        os.remove(filepath)
        return jsonify({"output": output.decode("utf-8")})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)

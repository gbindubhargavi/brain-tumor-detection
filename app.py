import os
import sys
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = 'model/brain_tumor_model.keras'

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('model', exist_ok=True)

# Load the trained model
try:
    model = load_model(MODEL_PATH)
    print("✅ Model loaded successfully from", MODEL_PATH)
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Preprocess image for model prediction"""
    try:
        img = Image.open(image_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0
        return img_array
    except Exception as e:
        print(f"Error processing image: {e}")
        raise

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({
            'error': 'Model not available',
            'message': 'Please train the model first'
        }), 500
    
    if 'file' not in request.files:
        return jsonify({
            'error': 'No file uploaded',
            'message': 'Please select an image file'
        }), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({
            'error': 'No file selected',
            'message': 'Please select an image file'
        }), 400
    
    if not (file and allowed_file(file.filename)):
        return jsonify({
            'error': 'Invalid file type',
            'message': 'Allowed file types: PNG, JPG, JPEG'
        }), 400
    
    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Preprocess and predict
        processed_img = preprocess_image(filepath)
        prediction = model.predict(processed_img)
        confidence = float(prediction[0][0]) * 100
        
        # Format results
        if confidence > 50:
            result = "No Brain Tumor Detected"
            confidence = round(confidence, 2)
        else:
            result = "Brain Tumor Detected"
            confidence = round(100 - confidence, 2)
        
        return jsonify({
            'success': True,
            'result': result,
            'confidence': confidence,
            'image_url': f'uploads/{filename}',
            'message': 'Analysis completed successfully'
        })
    
    except Exception as e:
        # Clean up uploaded file if error occurs
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({
            'error': 'Processing error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
    app.run(debug=True)
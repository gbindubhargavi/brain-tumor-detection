# 🧠 Brain Tumor Detection Using MRI Scans

This project focuses on detecting brain tumors from MRI images using deep learning. It is designed to assist medical professionals by providing quick and accurate predictions through a web interface.

## 📝 Project Description

Brain tumors are potentially life-threatening and require early detection for effective treatment. This project uses a Convolutional Neural Network (CNN) to classify MRI images as either showing a brain tumor or not. The application is built as a full-stack web app using Python (Flask) for the backend and HTML, CSS, JavaScript for the frontend.

## 💡 Features

- Upload MRI images and receive a prediction.
- Deep learning model trained with TensorFlow and Keras.
- Web-based interface with a clean, medical-themed design.
- Fast and reliable predictions.

## 📂 Project Structure

brain-tumor-detection/
│
├── static/
│ ├── css/
│ ├── js/
│ └── uploaded_images/
│
├── templates/
│ └── index.html
│
├── model/
│ └── brain_tumor_model.keras
│
├── dataset/
│ ├── brain_tumor/
│ └── no_tumor/
│
├── app.py
├── README.md
└── requirements.txt


## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Flask
- **Deep Learning:** TensorFlow, Keras
- **Dataset:** MRI Brain Tumor Dataset (brain_tumor / no_tumor folders)

## 🧪 Dataset

The dataset consists of labeled MRI brain scan images, organized into two classes:
- `brain_tumor`: Contains images with visible tumors.
- `no_tumor`: Contains images with no tumors.

*You can add the dataset source link here if it's publicly available.*

## 🔍 How It Works

1. User uploads an MRI image through the browser.
2. Image is processed and passed to the CNN model.
3. Model returns the prediction: `Brain Tumor` or `No Tumor`.
4. Result is displayed instantly on the screen.

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip

### Installation

```bash
git clone https://github.com/yourusername/brain-tumor-detection.git
cd brain-tumor-detection
pip install -r requirements.txt

python app.py


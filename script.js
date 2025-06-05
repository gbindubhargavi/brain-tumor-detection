document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const newScanBtn = document.getElementById('newScanBtn');
    const resultSection = document.getElementById('resultSection');
    const previewImage = document.getElementById('previewImage');
    const resultText = document.getElementById('resultText');
    const resultIcon = document.getElementById('resultIcon');
    const resultDescription = document.getElementById('resultDescription');
    const meterBar = document.getElementById('meterBar');
    const confidenceValue = document.getElementById('confidenceValue');
    
    let selectedFile = null;
    
    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    dropArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', handleFiles);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }
    
    function handleFiles(e) {
        const files = e.target.files;
        if (files.length) {
            selectedFile = files[0];
            if (selectedFile.type.match('image.*')) {
                analyzeBtn.disabled = false;
                
                // Preview the image
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(selectedFile);
            } else {
                showAlert('Please select an image file (JPEG, PNG)');
            }
        }
    }
    
    analyzeBtn.addEventListener('click', analyzeImage);
    newScanBtn.addEventListener('click', resetForm);
    
    function analyzeImage() {
        if (!selectedFile) return;
        
        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<div class="spinner"></div> Analyzing...';
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Display results
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred during analysis. Please try again.');
            resetForm();
        });
    }
    
    function displayResults(data) {
        // Update UI with results
        resultSection.style.display = 'flex';
        document.querySelector('.upload-section').style.display = 'none';
        
        previewImage.src = `/static/${data.image_url}`;
        resultText.textContent = data.result;
        confidenceValue.textContent = `${data.confidence}%`;
        
        // Update meter bar
        meterBar.style.setProperty('--width', `${data.confidence}%`);
        
        // Update icon and colors based on result
        if (data.result.includes('Detected')) {
            resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            resultIcon.style.color = '#e74c3c';
            meterBar.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
            resultDescription.innerHTML = `
                Our analysis indicates a potential brain tumor with ${data.confidence}% confidence.
                <strong>Please consult with a medical professional for further evaluation.</strong>
            `;
        } else {
            resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            resultIcon.style.color = '#2ecc71';
            meterBar.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
            resultDescription.innerHTML = `
                No signs of brain tumor detected (${data.confidence}% confidence).
                However, this doesn't rule out all possible conditions. 
                <strong>Consult a doctor if you have concerns.</strong>
            `;
        }
    }
    
    function resetForm() {
        selectedFile = null;
        fileInput.value = '';
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyze Scan';
        resultSection.style.display = 'none';
        document.querySelector('.upload-section').style.display = 'block';
    }
    
    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});
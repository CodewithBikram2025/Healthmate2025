document.addEventListener('DOMContentLoaded', () => {
    const sensor = document.getElementById('sensor');
    const ecgLine = document.getElementById('ecg-line');
    const bpmValue = document.getElementById('bpm-value');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    let isMeasuring = false;
    let bpmInterval;
    let ecgInterval;
    let baseBPM = 72;
    let isFingerPlaced = false;
    
    // Generate ECG path data
    function generateECGPath() {
        let pathData = 'M 0 50 ';
        const segments = 20;
        
        for (let i = 0; i < segments; i++) {
            // Baseline
            pathData += `L ${i*25 + 5} 50 `;
            
            // P wave
            pathData += `L ${i*25 + 7} 40 `;
            pathData += `L ${i*25 + 9} 60 `;
            pathData += `L ${i*25 + 11} 50 `;
            
            // QRS complex
            pathData += `L ${i*25 + 12} 70 `;
            pathData += `L ${i*25 + 13} 30 `;
            pathData += `L ${i*25 + 14} 50 `;
            
            // T wave
            pathData += `L ${i*25 + 16} 35 `;
            pathData += `L ${i*25 + 18} 65 `;
            pathData += `L ${i*25 + 20} 50 `;
        }
        
        return pathData;
    }
    
    // Animate ECG line
    function animateECG() {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', generateECGPath());
        ecgLine.innerHTML = '';
        ecgLine.appendChild(path);
        
        let position = 0;
        ecgInterval = setInterval(() => {
            position = (position + 1) % 500;
            ecgLine.style.transform = `translateX(-${position}px)`;
        }, 30);
    }
    
    // Update BPM display
    function updateBPM() {
        if (!isFingerPlaced) {
            bpmValue.textContent = '--';
            return;
        }
        
        // Add small random variation
        const variation = Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
        const currentBPM = Math.max(50, Math.min(140, baseBPM + variation));
        
        bpmValue.textContent = currentBPM;
        
        // Update color based on BPM
        if (currentBPM < 60) {
            bpmValue.style.color = '#3498db';
        } else if (currentBPM <= 100) {
            bpmValue.style.color = '#2ecc71';
        } else if (currentBPM <= 120) {
            bpmValue.style.color = '#f39c12';
        } else {
            bpmValue.style.color = '#e74c3c';
        }
    }
    
    // Start measurement
    startBtn.addEventListener('click', () => {
        if (isMeasuring) return;
        
        isMeasuring = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        statusIndicator.style.background = '#f39c12';
        statusText.textContent = "Detecting pulse...";
        
        // Start ECG animation
        animateECG();
        
        // Start BPM updates
        bpmInterval = setInterval(updateBPM, 1500);
    });
    
    // Stop measurement
    stopBtn.addEventListener('click', () => {
        isMeasuring = false;
        isFingerPlaced = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        clearInterval(bpmInterval);
        clearInterval(ecgInterval);
        ecgLine.innerHTML = '';
        
        sensor.classList.remove('active');
        statusIndicator.style.background = '#95a5a6';
        statusText.textContent = "Ready to measure";
        bpmValue.textContent = "--";
    });
    
    // Finger detection
    function startMeasurement() {
        if (!isMeasuring) return;
        isFingerPlaced = true;
        sensor.classList.add('active');
        statusIndicator.style.background = '#2ecc71';
        statusText.textContent = "Measuring...";
        updateBPM();
    }
    
    function stopMeasurement() {
        isFingerPlaced = false;
        sensor.classList.remove('active');
        if (isMeasuring) {
            statusIndicator.style.background = '#f39c12';
            statusText.textContent = "Place finger on sensor";
        }
        bpmValue.textContent = "--";
    }
    
    // Mouse events
    sensor.addEventListener('mousedown', startMeasurement);
    sensor.addEventListener('mouseup', stopMeasurement);
    sensor.addEventListener('mouseleave', stopMeasurement);
    
    // Touch events
    sensor.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startMeasurement();
    });
    
    sensor.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopMeasurement();
    });
});
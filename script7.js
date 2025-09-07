document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const resultContainer = document.getElementById('result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiMessage = document.getElementById('bmi-message');

    calculateBtn.addEventListener('click', calculateBMI);

    // Also calculate when pressing Enter in input fields
    heightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateBMI();
    });
    
    weightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateBMI();
    });

    function calculateBMI() {
        const height = parseFloat(heightInput.value) / 100; // Convert cm to m
        const weight = parseFloat(weightInput.value);
        
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert('Please enter valid height and weight values');
            return;
        }
        
        const bmi = weight / (height * height);
        displayResult(bmi);
    }

    function displayResult(bmi) {
        resultContainer.classList.remove('hidden');
        
        // Animate the BMI value counting up
        animateValue(bmiValue, 0, bmi, 1000);
        
        // Determine category and set appropriate color/message
        let category, message, color;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            message = 'You are underweight. Consider gaining some weight for better health.';
            color = '#3498db';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal';
            message = 'Great! You have a healthy weight. Keep it up!';
            color = '#2ecc71';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            message = 'You are overweight. Consider some lifestyle changes to improve your health.';
            color = '#f39c12';
        } else {
            category = 'Obese';
            message = 'You are obese. Please consult with a healthcare professional for guidance.';
            color = '#e74c3c';
        }
        
        bmiCategory.textContent = category;
        bmiCategory.style.color = color;
        bmiMessage.textContent = message;
        bmiValue.style.color = color;
    }

    // Function to animate the counting up of the BMI value
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalCaloriesDisplay = document.querySelector('.total-calories');
    const calorieMessage = document.querySelector('.calorie-message');
    const resetBtn = document.getElementById('reset-btn');
    const scaleBar = document.querySelector('.scale-bar');
    
    let totalCalories = 0;
    
    // Update calorie count when checkboxes are clicked
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const calories = parseInt(this.dataset.calories);
            
            if (this.checked) {
                totalCalories += calories;
            } else {
                totalCalories -= calories;
            }
            
            updateCalorieDisplay();
        });
    });
    
    // Reset all selections
    resetBtn.addEventListener('click', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        totalCalories = 0;
        updateCalorieDisplay();
    });
    
    // Update the display with current calories
    function updateCalorieDisplay() {
        totalCaloriesDisplay.textContent = totalCalories;
        
        // Update the message based on calorie range
        if (totalCalories === 0) {
            calorieMessage.textContent = 'Select foods to see your total calorie intake';
        } else if (totalCalories < 300) {
            calorieMessage.textContent = 'Light meal - Great for a snack!';
        } else if (totalCalories < 600) {
            calorieMessage.textContent = 'Moderate meal - Good balance!';
        } else {
            calorieMessage.textContent = 'Hearty meal - Make sure to stay active!';
        }
        
        // Update the scale indicator
        // Max scale is set to 1000 calories for visualization
        const scalePosition = Math.min(totalCalories / 1000 * 100, 100);
        scaleBar.style.background = `linear-gradient(to right, #2ecc71 0%, #2ecc71 ${scalePosition}%, #f1c40f ${scalePosition}%, #f1c40f 70%, #e74c3c 70%, #e74c3c 100%)`;
    }
});
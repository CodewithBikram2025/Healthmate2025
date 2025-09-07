// Store data in localStorage
let medications = JSON.parse(localStorage.getItem('medications')) || [];
let healthLogs = JSON.parse(localStorage.getItem('healthLogs')) || [];
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// Medication Functions
// Add these new functions to your existing JavaScript file

function updateProfilePhoto() {
    const fileInput = document.getElementById('photoInput');
    const userPhoto = document.getElementById('userPhoto');
    
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            userPhoto.src = e.target.result;
            localStorage.setItem('userPhoto', e.target.result);
        };
        
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Modify the existing addMedication function
function addMedication() {
    const name = document.getElementById('medName').value;
    const time = document.getElementById('medTime').value;
    const imageInput = document.getElementById('medImage');
    
    if (name && time) {
        const medication = { name, time };
        
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                medication.image = e.target.result;
                medications.push(medication);
                localStorage.setItem('medications', JSON.stringify(medications));
                displayMedications();
                document.getElementById('medName').value = '';
                document.getElementById('medTime').value = '';
                imageInput.value = '';
            };
            
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            medications.push(medication);
            localStorage.setItem('medications', JSON.stringify(medications));
            displayMedications();
            document.getElementById('medName').value = '';
            document.getElementById('medTime').value = '';
        }
    }
}

// Modify the existing displayMedications function
function displayMedications() {
    const list = document.getElementById('medicationList');
    list.innerHTML = '';
    medications.forEach((med, index) => {
        const div = document.createElement('div');
        div.className = 'med-card';
        div.innerHTML = `
            ${med.image ? `<img src="${med.image}" alt="${med.name}">` : ''}
            <div>
                <p>${med.name} - ${med.time}</p>
                <button onclick="deleteMedication(${index})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Add this to your window.onload function
window.onload = function() {
    displayMedications();
    displayHealthData();
    displayContacts();
    
    // Set up medication reminder checks
    setInterval(checkMedications, 60000); // Check every minute
    
    // Load saved profile photo
    const savedPhoto = localStorage.getItem('userPhoto');
    if (savedPhoto) {
        document.getElementById('userPhoto').src = savedPhoto;
    }
};

function checkMedications() {
    const now = new Date();
    const currentTime = now.getHours() + ':' + now.getMinutes();
    
    medications.forEach(med => {
        if (med.time === currentTime) {
            alert(`Time to take ${med.name}!`);
        }
    });
}
// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const paymentForm = document.querySelector('.payment-form');
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.getElementById('credit-card-form');
    const upiForms = document.getElementById('upi-forms');
    const phonepeForm = document.getElementById('phonepe-form');
    const googlepayForm = document.getElementById('googlepay-form');
    const paypalForm = document.getElementById('paypal-form');
    const submitBtn = document.getElementById('submit-btn');
    const paymentStatus = document.getElementById('payment-status');
    
    // QR Code elements
    const phonepeQr = document.getElementById('phonepe-qr');
    const googlepayQr = document.getElementById('googlepay-qr');
    
    // Initialize QR Codes
    let phonepeQrCode, googlepayQrCode;
    
    // Format card number input
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
        });
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all forms first
            creditCardForm.classList.add('hidden');
            upiForms.classList.add('hidden');
            phonepeForm.classList.add('hidden');
            googlepayForm.classList.add('hidden');
            paypalForm.classList.add('hidden');
            
            // Show selected form
            switch(this.id) {
                case 'credit-card':
                    creditCardForm.classList.remove('hidden');
                    break;
                case 'phonepe':
                    upiForms.classList.remove('hidden');
                    phonepeForm.classList.remove('hidden');
                    generatePhonePeQr();
                    break;
                case 'googlepay':
                    upiForms.classList.remove('hidden');
                    googlepayForm.classList.remove('hidden');
                    generateGooglePayQr();
                    break;
                case 'paypal':
                    upiForms.classList.remove('hidden');
                    paypalForm.classList.remove('hidden');
                    break;
            }
        });
    });
    
    // Generate PhonePe QR Code
    function generatePhonePeQr() {
        if (phonepeQrCode) {
            phonepeQrCode.clear();
        }
        
        const amount = document.getElementById('amount').value || '100';
        const upiId = document.getElementById('phonepe-id').value || '1234567890@ybl';
        
        const paymentData = {
            payeeVPA: upiId,
            payeeName: "Merchant Name",
            amount: amount,
            currency: "INR",
            transactionNote: "Payment for services"
        };
        
        phonepeQrCode = new QRCode(phonepeQr, {
            text: JSON.stringify(paymentData),
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    // Generate Google Pay QR Code
    function generateGooglePayQr() {
        if (googlepayQrCode) {
            googlepayQrCode.clear();
        }
        
        const amount = document.getElementById('amount').value || '2';
        const upiId = document.getElementById('googlepay-id').value || '8348458035-2@ybl';
        
        const paymentData = {
            pa: upiId,
            pn: "Merchant Name",
            am: amount,
            cu: "INR",
            tn: "Payment for services"
        };
        
        googlepayQrCode = new QRCode(googlepayQr, {
            text: `upi://pay?${new URLSearchParams(paymentData).toString()}`,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    // Form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get selected payment method
        const selectedMethod = document.querySelector('input[name="payment"]:checked').id;
        
        // Validate form based on selected method
        if (!validateForm(selectedMethod)) {
            return;
        }
        
        // Disable submit button during processing
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate payment processing
        setTimeout(() => {
            // In a real app, you would make an API call to your payment processor here
            const amount = document.getElementById('amount').value;
            const name = document.getElementById('fullname').value;
            
            paymentStatus.innerHTML = `
                <p><i class="fas fa-check-circle"></i> Payment of $${amount} processed successfully!</p>
                <p>Thank you, ${name}!</p>
                <p>Transaction ID: ${generateTransactionId()}</p>
            `;
            paymentStatus.classList.remove('hidden');
            paymentStatus.classList.add('success');
            
            // Reset form
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
            
            // Scroll to payment status
            paymentStatus.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
    
    // Form validation
    function validateForm(method) {
        // Basic validation for all fields
        const requiredFields = ['fullname', 'email', 'phone', 'address', 'amount'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--danger-color)';
                isValid = false;
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        // Method-specific validation
        switch(method) {
            case 'credit-card':
                const cardFields = ['card-number', 'expiry', 'cvv', 'card-name'];
                cardFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (!field.value.trim()) {
                        field.style.borderColor = 'var(--danger-color)';
                        isValid = false;
                    } else {
                        field.style.borderColor = '#ddd';
                    }
                });
                
                // Validate card number length (16 digits without spaces)
                const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
                if (cardNumber.length !== 16) {
                    document.getElementById('card-number').style.borderColor = 'var(--danger-color)';
                    isValid = false;
                }
                break;
                
            case 'phonepe':
                if (!document.getElementById('phonepe-id').value.trim()) {
                    document.getElementById('phonepe-id').style.borderColor = 'var(--danger-color)';
                    isValid = false;
                }
                break;
                
            case 'googlepay':
                if (!document.getElementById('googlepay-id').value.trim()) {
                    document.getElementById('googlepay-id').style.borderColor = 'var(--danger-color)';
                    isValid = false;
                }
                break;
                
            case 'paypal':
                if (!document.getElementById('paypal-email').value.trim()) {
                    document.getElementById('paypal-email').style.borderColor = 'var(--danger-color)';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            paymentStatus.innerHTML = '<p><i class="fas fa-exclamation-circle"></i> Please fill all required fields correctly.</p>';
            paymentStatus.classList.remove('hidden');
            paymentStatus.classList.add('error');
            return false;
        }
        
        return true;
    }
    
    // Generate random transaction ID
    function generateTransactionId() {
        return 'TXN' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    }
    
    // Initialize with credit card form visible
    creditCardForm.classList.remove('hidden');
    
    // Generate initial QR codes if needed
    document.getElementById('phonepe-id').addEventListener('input', generatePhonePeQr);
    document.getElementById('googlepay-id').addEventListener('input', generateGooglePayQr);
    document.getElementById('amount').addEventListener('input', function() {
        if (!phonepeForm.classList.contains('hidden')) generatePhonePeQr();
        if (!googlepayForm.classList.contains('hidden')) generateGooglePayQr();
    });
    
    // PayPal login button
    document.getElementById('paypal-login').addEventListener('click', function(e) {
        e.preventDefault();
        alert('In a real implementation, this would redirect to PayPal login');
    });
});
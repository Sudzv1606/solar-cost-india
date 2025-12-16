// ===================================
// CALCULATOR STEP NAVIGATION
// No changes to calculation logic
// ===================================

// Current step tracker
let currentStep = 1;

// Navigate to a specific step
function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.calculator-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show target step
    const targetStep = document.querySelector(`.calculator-step[data-step="${stepNumber}"]`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;

        // Update progress indicator
        updateProgressIndicator(stepNumber);
    }

    // Scroll to top of calculator
    document.querySelector('.calculator-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update progress indicator
function updateProgressIndicator(step) {
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
        const stepNum = index + 1;

        if (stepNum < step) {
            // Completed step
            progressStep.classList.remove('active');
            progressStep.classList.add('completed');
        } else if (stepNum === step) {
            // Current step
            progressStep.classList.add('active');
            progressStep.classList.remove('completed');
        } else {
            // Future step
            progressStep.classList.remove('active', 'completed');
        }
    });

    // Update progress text
    const progressText = document.querySelector('.progress-text');
    const stepNames = ['Electricity usage', 'Location context', 'Roof and feasibility'];
    if (progressText) {
        progressText.textContent = `Step ${step} of 3 — ${stepNames[step - 1]}`;
    }
}

// Check Step 1 completion (monthly bill)
function checkStep1() {
    const monthlyBill = document.getElementById('monthlyBill').value;
    const continueBtn = document.getElementById('step1Continue');

    if (monthlyBill && monthlyBill >= 500) {
        continueBtn.disabled = false;
    } else {
        continueBtn.disabled = true;
    }
}

// Check Step 2 completion (state selection)
function checkStep2() {
    const state = document.getElementById('state').value;
    const continueBtn = document.getElementById('step2Continue');

    if (state) {
        continueBtn.disabled = false;

        // Show D ISCOM chip if city is selected
        const city = document.getElementById('city').value;
        const discomChip = document.getElementById('discomChip');
        const discomSelect = document.getElementById('discom');

        if (city && discomSelect.options.length > 0 && discomSelect.value) {
            const discomDisplay = document.getElementById('discomDisplay');
            if (discomDisplay && discomSelect.selectedOptions[0]) {
                discomDisplay.textContent = discomSelect.selectedOptions[0].text;
                discomChip.style.display = 'inline-flex';
            }
        }
    } else {
        continueBtn.disabled = true;
    }
}

// Check Step 3 completion
function checkStep3() {
    const homeType = document.getElementById('homeType').value;
    const roofOwnership = document.getElementById('roofOwnership').value;
    const roofArea = document.getElementById('roofArea').value;

    // Enable calculate button if all required fields are filled
    // This is already handled by form validation, but we can add visual feedback
}

// Card selection function
function selectCard(cardElement, fieldId, value) {
    // Remove selected class from all cards in the same group
    const parentGrid = cardElement.parentElement;
    parentGrid.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card
    cardElement.classList.add('selected');

    // Update hidden input value
    const hiddenInput = document.getElementById(fieldId);
    if (hiddenInput) {
        hiddenInput.value = value;
    }

    // Check step 3 completion
    checkStep3();
}

// Form submission handler (with loading state)
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('solarCalculator');
    const calculateButton = document.getElementById('calculateButton');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Show loading state
            if (calculateButton) {
                const btnText = calculateButton.querySelector('.btn-text');
                const btnLoading = calculateButton.querySelector('.btn-loading');

                if (btnText && btnLoading) {
                    btnText.style.display = 'none';
                    btnLoading.style.display = 'inline-flex';
                    calculateButton.disabled = true;
                }
            }

            // Simulate analysis delay (500-700ms)
            setTimeout(() => {
                // Call the original calculate function
                if (typeof calculateSolar === 'function') {
                    calculateSolar();
                }

                // Restore button state
                if (calculateButton) {
                    const btnText = calculateButton.querySelector('.btn-text');
                    const btnLoading = calculateButton.querySelector('.btn-loading');

                    if (btnText && btnLoading) {
                        btnText.style.display = 'inline';
                        btnLoading.style.display = 'none';
                        calculateButton.disabled = false;
                    }
                }
            }, 600);
        });
    }

    // Initialize - enable step 1 continue button if bill has value
    checkStep1();
});

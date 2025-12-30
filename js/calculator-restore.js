/**
 * =============================================
 * CALCULATOR STATE RESTORATION MODULE
 * =============================================
 *
 * Restores calculator inputs from URL parameters
 * Includes validation and sanitization to prevent
 * invalid/troll URLs from breaking the UI
 *
 * Features:
 * - Parameter validation (clamping, whitelisting)
 * - Silent error handling (ignore invalid values)
 * - Session tracking for analytics segmentation
 * - Auto-calculate on full params
 */

// =============================================
// VALIDATION CONSTANTS
// =============================================
const VALIDATION_RULES = {
    bill: { min: 500, max: 25000 },           // Clamp bill to reasonable range
    states: [                                   // Whitelist of valid states
        'maharashtra', 'karnataka', 'gujarat', 'tamil-nadu',
        'delhi', 'rajasthan', 'madhya-pradesh', 'west-bengal',
        'andhra-pradesh', 'telangana', 'uttar-pradesh'
    ],
    homeTypes: ['independent', 'apartment', 'farmhouse'],
    roofOwnerships: ['own', 'shared', 'no-access'],
    roofAreas: ['less-300', '300-600', '600-1000', '1000-1500', 'more-1500']
};

// City whitelist per state (validates after state is loaded)
const CITIES_BY_STATE = {
    maharashtra: ['pune', 'mumbai', 'nagpur'],
    karnataka: ['bangalore'],
    gujarat: ['ahmedabad', 'surat'],
    delhi: ['delhi_ncr', 'gurgaon', 'noida']
};

/**
 * Validate and sanitize a parameter value
 *
 * @param {string} paramName - Name of the parameter
 * @param {*} value - Value to validate
 * @returns {string|number|null} Validated value or null if invalid
 */
function validateParam(paramName, value) {
    if (!value && value !== 0) return null;

    switch (paramName) {
        case 'bill':
            const num = parseInt(value, 10);
            if (isNaN(num)) return null;
            // Clamp to valid range
            return Math.max(VALIDATION_RULES.bill.min,
                Math.min(VALIDATION_RULES.bill.max, num));

        case 'state':
            return VALIDATION_RULES.states.includes(value) ? value : null;

        case 'city':
            // Cities are validated after state is known
            return value; // Will be validated during restoration

        case 'ht':
            return VALIDATION_RULES.homeTypes.includes(value) ? value : null;

        case 'ro':
            return VALIDATION_RULES.roofOwnerships.includes(value) ? value : null;

        case 'ra':
            return VALIDATION_RULES.roofAreas.includes(value) ? value : null;

        default:
            return null; // Unknown param, ignore
    }
}

/**
 * Restore calculator from URL parameters
 */
function restoreCalculatorFromURL() {
    const params = new URLSearchParams(window.location.search);

    // Validate each parameter before restoration
    const bill = validateParam('bill', params.get('bill'));
    const state = validateParam('state', params.get('state'));
    const city = validateParam('city', params.get('city'));
    const homeType = validateParam('ht', params.get('ht'));
    const roofOwnership = validateParam('ro', params.get('ro'));
    const roofArea = validateParam('ra', params.get('ra'));

    // Check if we have valid share params
    const hasValidParams = bill || state;

    if (!hasValidParams) {
        return; // No valid params, nothing to restore
    }

    // =============================================
    // Restore bill amount (validated and clamped)
    // =============================================
    if (bill) {
        const billInput = document.getElementById('monthlyBill');
        const billSlider = document.getElementById('billSlider');

        if (billInput) {
            billInput.value = bill;
        }
        if (billSlider) {
            billSlider.value = Math.min(Math.max(bill, billSlider.min), billSlider.max);
        }
    }

    // =============================================
    // Restore state (validated against whitelist)
    // =============================================
    if (state) {
        const stateSelect = document.getElementById('state');

        if (stateSelect) {
            stateSelect.value = state;

            // Trigger state change to load cities
            if (typeof updateCities === 'function') {
                updateCities(state);
            }
            stateSelect.dispatchEvent(new Event('change'));

            // =============================================
            // Restore city (validate against loaded cities)
            // =============================================
            if (city) {
                setTimeout(() => {
                    const citySelect = document.getElementById('city');
                    if (citySelect) {
                        // Check if city is valid for this state
                        const validCities = CITIES_BY_STATE[state] || [];
                        const cityIsValid = validCities.includes(city);

                        if (cityIsValid) {
                            citySelect.value = city;
                            citySelect.dispatchEvent(new Event('change'));

                            // Show DISCOM chip if applicable
                            const discomSelect = document.getElementById('discom');
                            const discomChip = document.getElementById('discomChip');
                            const discomDisplay = document.getElementById('discomDisplay');

                            if (discomSelect && discomChip && discomDisplay) {
                                setTimeout(() => {
                                    if (discomSelect.value) {
                                        discomDisplay.textContent = discomSelect.selectedOptions[0]?.text || '-';
                                        discomChip.style.display = 'inline-flex';
                                    }
                                }, 50);
                            }
                        }
                    }
                }, 100);
            }
        }
    }

    // =============================================
    // Restore home type (validated)
    // =============================================
    if (homeType) {
        const homeTypeInput = document.getElementById('homeType');
        if (homeTypeInput) {
            homeTypeInput.value = homeType;

            // Visual card selection
            const cards = document.querySelectorAll('.selection-card');
            cards.forEach(card => {
                const onclickAttr = card.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes(`'${homeType}'`)) {
                    card.classList.add('selected');
                }
            });
        }
    }

    // =============================================
    // Restore roof ownership (validated)
    // =============================================
    if (roofOwnership) {
        const roofOwnershipInput = document.getElementById('roofOwnership');
        if (roofOwnershipInput) {
            roofOwnershipInput.value = roofOwnership;

            // Visual card selection
            const cards = document.querySelectorAll('.selection-card');
            cards.forEach(card => {
                const onclickAttr = card.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes(`'${roofOwnership}'`)) {
                    card.classList.add('selected');
                }
            });
        }
    }

    // =============================================
    // Restore roof area (validated)
    // =============================================
    if (roofArea) {
        const roofAreaSelect = document.getElementById('roofArea');
        if (roofAreaSelect) {
            roofAreaSelect.value = roofArea;
        }
    }

    // =============================================
    // Mark session as restored for analytics
    // =============================================
    sessionStorage.setItem('restored_from_share', 'true');
    sessionStorage.setItem('restored_params', JSON.stringify({
        has_bill: !!bill,
        has_state: !!state,
        has_city: !!city,
        has_home_type: !!homeType,
        has_roof_ownership: !!roofOwnership,
        has_roof_area: !!roofArea,
        has_full_params: !!(bill && state && homeType && roofOwnership && roofArea)
    }));

    // =============================================
    // Auto-calculate or navigate to appropriate step
    // =============================================
    if (bill && state) {
        // Hide location prompt
        const locationPrompt = document.getElementById('locationPrompt');
        if (locationPrompt) {
            locationPrompt.style.display = 'none';
        }

        // Scroll to calculator
        const calculatorContainer = document.querySelector('.calculator-container');
        if (calculatorContainer) {
            calculatorContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        setTimeout(() => {
            if (homeType && roofOwnership && roofArea) {
                // All params present, auto-calculate
                const form = document.getElementById('solarCalculator');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            } else {
                // Partial params, navigate to appropriate step
                const targetStep = homeType ? 3 : 2;
                if (typeof goToStep === 'function') {
                    goToStep(targetStep);
                }
            }
        }, 500);
    }

    // =============================================
    // Track restored session with segmentation
    // =============================================
    if (typeof gtag === 'function') {
        gtag('event', 'restore_calculator', {
            has_all_params: !!(bill && state && homeType && roofOwnership && roofArea),
            has_bill: !!bill,
            has_state: !!state,
            has_full_params: !!(bill && state && homeType && roofOwnership && roofArea),
            restored_from_share: true
        });
    }
}

// =============================================
// Initialize on DOM ready
// =============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreCalculatorFromURL);
} else {
    restoreCalculatorFromURL();
}

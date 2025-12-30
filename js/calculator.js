/**
 * Main Solar Calculator Script
 * Integrates the configuration system and calculation engine
 * Location-aware, India-first calculator
 */

// Global variables
let currentConfig = null;
let calculationResults = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize calculator with national defaults
    initializeCalculator();

    // Set up event listeners
    setupEventListeners();

    // Load default state if any
    loadLocationFromParams();
});

/**
 * Initialize calculator with configuration
 */
function initializeCalculator(state = null, city = null) {
    // Get configuration for location
    currentConfig = getCalculatorConfig(state, city);

    // Update UI to reflect location
    updateLocationDisplay(state, city);

    // Update any location-specific UI elements
    if (currentConfig.discoms) {
        updateDiscomOptions(currentConfig.discoms);
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Form submission
    const form = document.getElementById('solarCalculator');
    if (form) {
        form.addEventListener('submit', handleCalculatorSubmit);
    }

    // State selection
    const stateSelect = document.getElementById('state');
    if (stateSelect) {
        stateSelect.addEventListener('change', handleStateChange);
    }

    // City selection
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.addEventListener('change', handleCityChange);
    }

    // Input synchronization for bill slider
    const billSlider = document.getElementById('billSlider');
    const billInput = document.getElementById('monthlyBill');

    if (billSlider && billInput) {
        billSlider.addEventListener('input', function () {
            updateBillValue(this.value);
        });

        billInput.addEventListener('input', function () {
            updateSliderValue(this.value);
        });
    }
}

/**
 * Handle calculator form submission
 */
function handleCalculatorSubmit(e) {
    e.preventDefault();

    try {
        // Get form values with validation
        const monthlyBill = parseFloat(document.getElementById('monthlyBill').value);
        const state = document.getElementById('state').value;
        const city = document.getElementById('city').value;

        // Input validation
        if (!monthlyBill || isNaN(monthlyBill) || monthlyBill <= 0) {
            alert('Please enter a valid monthly electricity bill amount.');
            return;
        }

        if (monthlyBill < 500) {
            alert('Monthly bill too low. Solar may not be cost-effective for bills under ₹500.');
            return;
        }

        if (monthlyBill > 50000) {
            alert('Monthly bill seems unusually high. Please verify the amount or contact us for commercial solutions.');
            return;
        }

        // Get configuration for selected location
        const config = getCalculatorConfig(state, city);

        // Prepare inputs for calculation
        const inputs = {
            monthlyBill: monthlyBill,
            state: state,
            city: city,
            location: getLocationDisplayName(state, city)
        };

        // Track calculation with user type segmentation
        if (typeof gtag === 'function') {
            const isRestored = sessionStorage.getItem('restored_from_share') === 'true';

            gtag('event', 'calculator_submit', {
                state: state,
                has_city: !!city,
                user_type: isRestored ? 'shared_link_user' : 'organic_user'
            });
        }

        // Perform calculation using the engine
        calculationResults = calculatorEngine.calculate(inputs, config);

        // Display results
        displayResults(calculationResults);

        // Scroll to results
        document.getElementById('calculatorResults').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Update CTA based on location
        updateCallToAction(state, city);

    } catch (error) {
        console.error('Calculation error:', error);
        alert('An error occurred during calculation. Please try again or contact support if the problem persists.');
    }
}

/**
 * Display calculation results
 */
async function displayResults(results) {
    const resultsContainer = document.getElementById('calculatorResults');

    // Add timestamp for print/PDF
    const timestamp = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    resultsContainer.setAttribute('data-generated-timestamp', timestamp);

    // Generate HTML for results
    const resultsHTML = generateResultsHTML(results);

    // Update container
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.style.display = 'block';
    // document.getElementById('leadCaptureSection').style.display = 'block';

    // Generate Smart Insights if available
    if (window.insightManager && results) {
        await generateAIExplanation(results);
    }
}

/**
 * Generate Smart Insights explanation for calculator results
 */
async function generateAIExplanation(results) {
    try {
        // Execute calculator insight engine
        const engineResult = await insightManager.executeEngine(
            'Calculator_Insight_Engine',
            {
                calculatorOutputs: {
                    system: results.system,
                    cost: results.cost,
                    financial: results.financial
                },
                locationContext: results.metadata.locationLevel,
                configSource: results.metadata.configSource
            }
        );

        // Add explanation to results
        const explanationDiv = document.getElementById('aiExplanation');
        if (explanationDiv && engineResult.qa.status === 'PASS') {
            explanationDiv.innerHTML = `
                <div class="ai-explanation">
                    <h4>💡 Smart Insights</h4>
                    <div class="explanation-content">
                        ${engineResult.content}
                    </div>
                </div>
            `;
            explanationDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Failed to generate insights:', error);
    }
}

/**
 * Generate HTML for results display
 */
function generateResultsHTML(results) {
    const system = results.system;
    const cost = results.cost;
    const financial = results.financial;
    const info = results.info;

    // Get input values for summary
    const bill = document.getElementById('monthlyBill')?.value || 'N/A';
    const state = document.getElementById('state')?.value || 'N/A';
    const city = document.getElementById('city')?.value || '';
    const location = city ? `${getCitiesForState(state)[city] || city}, ${getStatesList()[state] || state}` : (getStatesList()[state] || 'India (National Average)');

    return `
        <div class="results-header">
            <h3>Your Solar Estimate</h3>
            <p class="result-label">${info.resultLabel}</p>
            ${info.fallbackMessage ? `<p class="fallback-message">${info.fallbackMessage}</p>` : ''}
        </div>

        <!-- INPUT SUMMARY (visible in print/PDF) -->
        <div class="input-summary">
            <h5>Input Summary</h5>
            <ul style="margin: 0; padding-left: 1.2rem;">
                <li>Monthly Electricity Bill: ₹${formatIndianNumber(bill)}</li>
                <li>Location: ${location}</li>
                <li>Generation: ${system.monthlyGeneration} units/month (estimated)</li>
            </ul>
        </div>

        <!-- SHARE ACTIONS -->
        <div class="share-actions">
            <h4>Share Your Estimate</h4>
            <div class="share-buttons">
                <button onclick="shareResults.copyLink()" class="share-btn copy-btn">
                    <span class="btn-icon">🔗</span>
                    <span class="btn-text">Copy Link</span>
                </button>
                <button onclick="shareResults.downloadPDF()" class="share-btn pdf-btn">
                    <span class="btn-icon">📄</span>
                    <span class="btn-text">Download PDF</span>
                </button>
                <button onclick="shareResults.shareWhatsApp()" class="share-btn whatsapp-btn">
                    <span class="btn-icon">💬</span>
                    <span class="btn-text">WhatsApp</span>
                </button>
            </div>
            <div class="share-feedback" id="shareFeedback" style="display:none;"></div>
        </div>
        <!-- END SHARE ACTIONS -->

        <!-- INSIDER CONTEXT INJECTION -->
        ${(function () {
            try {
                const stateValue = document.getElementById('state').value;
                const insiderData = (typeof REGULATION_DATA !== 'undefined') ? (REGULATION_DATA[stateValue] || REGULATION_DATA["default"]) : null;

                if (insiderData && insiderData.insider_notes && insiderData.insider_notes.length > 0) {
                    const notesHtml = insiderData.insider_notes.map(note => `
                        <div class="insider-note">
                            <span class="note-title">${note.title}:</span>
                            <span class="note-message">${note.message}</span>
                        </div>
                    `).join('');

                    return `
                    <div class="insider-box" style="margin-top: 0; margin-bottom: 2rem;">
                        <div class="insider-header">
                            <span class="insider-icon">⚠️</span>
                            <h3>Local rules to be aware of in ${insiderData.stateName}</h3>
                        </div>
                        <div class="insider-list">
                            ${notesHtml}
                        </div>
                        <div class="insider-footer">
                            * These are procedural considerations, not deal-breakers.
                        </div>
                    </div>`;
                }
            } catch (e) { console.error("Insider box error", e); }
            return '';
        })()}
        <!-- END INSIDER CONTEXT -->

        <div class="results-grid">
            <!-- System Details -->
            <div class="result-card">
                <h4>📊 System Size</h4>
                <div class="result-value">${system.recommendedKW} kW</div>
                <p>Roof area needed: ${system.roofAreaSqFt} sq ft</p>
                <p>Monthly generation: ${system.monthlyGeneration} units</p>
                <small class="assumption-note" style="color:#7f8c8d; font-size:0.8rem;">(Assumes ~${currentConfig ? currentConfig.units_per_kw : '4'} units/kW/day based on location)</small>
            </div>

            <!-- Cost Analysis -->
            <div class="result-card">
                <h4>💰 Estimated Out-of-Pocket Cost</h4>
                <div class="result-value">₹${formatIndianNumber(cost.netRange.low)} - ₹${formatIndianNumber(cost.netRange.high)}</div>
                <p>After estimated ₹${formatIndianNumber(cost.subsidy)} subsidy* (up to)</p>
                <small style="color:#e67e22; font-style:italic;">*Subsidy disbursed post-installation, subject to approval.</small>
            </div>

            <!-- Savings -->
            <div class="result-card">
                <h4>💡 Monthly Savings</h4>
                <div class="result-value">₹${formatIndianNumber(financial.monthlySavings)}</div>
                <p>Annual savings: ₹${formatIndianNumber(financial.annualSavings)}</p>
            </div>

            <!-- Payback -->
            <div class="result-card">
                <h4>⏱️ Estimated Payback Period</h4>
                <div class="result-value">~${Math.max(2, Math.floor(financial.paybackYears.min))}-${Math.ceil(financial.paybackYears.max)} years</div>
                <p>Lifetime Savings (25y): ₹${formatIndianNumber(financial.totalSavings25Years || (financial.annualSavings * 25))}*</p>
                <small>(Indicative Savings)</small>
            </div>
        </div>

        <div class="results-details">
            <div class="detail-section">
                <h5>Cost Breakdown</h5>
                <ul>
                    <li>Gross system cost: ₹${formatIndianNumber(cost.grossRange.low)} - ₹${formatIndianNumber(cost.grossRange.high)}</li>
                    <li>Estimated central subsidy: ₹${formatIndianNumber(cost.subsidy)} (subject to governmental approval)</li>
                    <li><strong>Net Out-of-Pocket Cost: ₹${formatIndianNumber(cost.netRange.low)} - ₹${formatIndianNumber(cost.netRange.high)}</strong></li>
                    <li>Annual maintenance (approx): ₹${formatIndianNumber(info.maintenanceCost)}</li>
                </ul>
            </div>

            <div class="detail-section">
                <h5>Key Information</h5>
                <ul>
                    <li>Approval time: ${info.approvalTime} days</li>
                    <li>Provider: ${(info.discoms && info.discoms.length) ? info.discoms.join(', ') : 'Check with your local provider'}</li>
                    <li>${info.accuracyNote}</li>
                </ul>
            </div>
        </div>

        <div id="aiExplanation" style="display: none;">
            <!-- AI explanation will be inserted here -->
        </div>

        <div class="data-freshness-note" style="text-align: center; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;">
            <p><small>${info.dataFreshnessNote}</small></p>
            <p style="color: #666; font-size: 0.8rem; margin-top: 0.5rem;">
                <em>Disclaimer: Solar Cost India is an independent information platform. We explain regulations but do not replace official DISCOM site surveys. Final feasibility is subject to technical approval.</em>
            </p>
        </div>

        
    `;
}

/**
 * Handle state selection change
 */
function handleStateChange(e) {
    const state = e.target.value;

    // Update cities dropdown
    updateCitiesDropdown(state);

    // Reinitialize calculator with state configuration
    initializeCalculator(state);

    // Clear any previous results
    document.getElementById('calculatorResults').style.display = 'none';
}

/**
 * Handle city selection change
 */
function handleCityChange(e) {
    const state = document.getElementById('state').value;
    const city = e.target.value;

    // Reinitialize calculator with city configuration
    initializeCalculator(state, city);

    // Clear any previous results
    document.getElementById('calculatorResults').style.display = 'none';
}

/**
 * Update cities dropdown based on selected state
 */
function updateCitiesDropdown(state) {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;

    // Clear existing options
    citySelect.innerHTML = '<option value="">Select city (optional)</option>';

    // Get cities for state
    const cities = getCitiesForState(state);

    // Add city options
    for (const [key, name] of Object.entries(cities)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = name;
        citySelect.appendChild(option);
    }

    // Enable/disable city dropdown
    citySelect.disabled = Object.keys(cities).length === 0;
}

/**
 * Update DISCOM options in dropdown
 */
function updateDiscomOptions(discoms) {
    const discomSelect = document.getElementById('discom');
    if (!discomSelect || !discoms) return;

    // Clear existing options
    discomSelect.innerHTML = '<option value="">Select your provider</option>';

    // Add DISCOM options
    discoms.forEach(discom => {
        const option = document.createElement('option');
        option.value = discom;
        option.textContent = discom;
        discomSelect.appendChild(option);
    });

    // Enable dropdown
    discomSelect.disabled = false;
}

/**
 * Update location display
 */
function updateLocationDisplay(state, city) {
    // Update any UI elements showing current location
    const locationDisplay = document.getElementById('currentLocation');
    if (locationDisplay) {
        locationDisplay.textContent = getLocationDisplayName(state, city);
    }
}

/**
 * Get display name for location
 */
function getLocationDisplayName(state, city) {
    if (city) {
        const cities = getCitiesForState(state);
        return `${cities[city]}, ${getStatesList()[state]}`;
    }
    if (state) {
        return getStatesList()[state];
    }
    return 'India (National Average)';
}

/**
 * Update call-to-action based on location precision
 */
function updateCallToAction(state, city) {
    // Update CTA based on location precision
    // Development logging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('CTA updated for:', getLocationDisplayName(state, city));
    }
}

/**
 * Load location from URL parameters
 */
function loadLocationFromParams() {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');
    const city = params.get('city');

    if (state) {
        // Set state in dropdown
        const stateSelect = document.getElementById('state');
        if (stateSelect) {
            stateSelect.value = state;
            updateCitiesDropdown(state);
        }

        if (city) {
            // Set city in dropdown
            const citySelect = document.getElementById('city');
            if (citySelect) {
                citySelect.value = city;
            }
        }

        // Initialize calculator with location
        initializeCalculator(state, city);
    }
}

/**
 * Request quotes (placeholder function)
 */
function requestQuotes() {
    // This would typically open a lead capture form
    alert('Quote request feature coming soon! For now, please contact verified installers in your area.');
}

/**
 * Format numbers for Indian display
 */
function formatIndianNumber(num) {
    return Math.round(num).toLocaleString('en-IN');
}

/**
 * Input synchronization functions
 */
function updateBillValue(value) {
    document.getElementById('monthlyBill').value = value;
}

function updateSliderValue(value) {
    const slider = document.getElementById('billSlider');
    if (slider) {
        slider.value = Math.min(Math.max(value, slider.min), slider.max);
    }
}

/**
 * Update cities when state is selected
 * This function is called from the HTML onclick handlers
 */
function updateCities(stateValue) {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;

    // Clear and populate cities
    updateCitiesDropdown(stateValue);
}
/**
 * Handle Lead Capture Form Submission
 */
window.handleLeadSubmit = function (e) {
    e.preventDefault();
    const email = document.getElementById('leadEmail').value;
    const quotes = document.getElementById('installerQuotes').checked;

    // Simulate API call/Lead capture
    // Development logging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Lead Captured:', { email, quotes, date: new Date().toISOString() });
    }

    // UI Feedback
    document.getElementById('leadCaptureForm').style.display = 'none';
    const successMsg = document.getElementById('leadSuccessMsg');
    successMsg.style.display = 'block';

    // Optional: Save to localStorage to remember user
    localStorage.setItem('solar_user_email', email);
};

/**
 * Solar Quote Checker Logic
 * Dependencies: quote-data.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('check-quote-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', analyzeQuote);
    }
});

function analyzeQuote() {
    // 1. Get Inputs
    const systemSize = parseFloat(document.getElementById('system-size').value);
    const totalQuote = parseFloat(document.getElementById('total-quote').value);
    const city = document.getElementById('city-select').value;
    const resultSection = document.getElementById('quote-result');

    // Validation
    if (!systemSize || !totalQuote || systemSize <= 0 || totalQuote <= 0) {
        alert("Please enter valid system size and quote amount.");
        return;
    }

    // 2. Determine Base Rate (MNRE Floor)
    let baseRatePerKW = QUOTE_DATA.BENCHMARKS.above3kW;
    if (systemSize <= 2) baseRatePerKW = QUOTE_DATA.BENCHMARKS.upTo2kW;
    else if (systemSize <= 3) baseRatePerKW = QUOTE_DATA.BENCHMARKS.upTo3kW;

    // 3. Apply Multipliers (Fair Market Value)
    const multiplier = QUOTE_DATA.CITY_MULTIPLIERS[city] || QUOTE_DATA.CITY_MULTIPLIERS["default"];
    const fairPerKW = baseRatePerKW * multiplier;

    // 4. Calculate User's Quote Metrics
    const userPerKW = totalQuote / systemSize;

    // 5. Verdict Logic (The 4 Buckets)
    let verdict = "";

    // Suspicious: < 95% of Base Rate (Note: Comparing to BASE, not fair market. Usually implies cutting corners)
    if (userPerKW < (baseRatePerKW * 0.95)) {
        verdict = "suspicious";
    }
    // Fair: Between 90% and 115% of VALIDATED FAIR MARKET price
    else if (userPerKW >= (fairPerKW * 0.9) && userPerKW <= (fairPerKW * 1.15)) {
        verdict = "fair";
    }
    // Borderline: 115% - 125% of FMV
    else if (userPerKW > (fairPerKW * 1.15) && userPerKW <= (fairPerKW * 1.25)) {
        verdict = "borderline";
    }
    // High: > 125% of FMV
    else {
        verdict = "high";
    }

    // 6. Render Results
    renderResult(verdict, userPerKW, fairPerKW, systemSize, totalQuote);
}

function renderResult(verdictKey, userPerKW, fairPerKW, systemSize, totalQuote) {
    const config = QUOTE_DATA.STATUS_CONFIG[verdictKey];
    const resultContainer = document.getElementById('quote-result');
    const resultContent = document.getElementById('result-content');

    // Format Currency
    const formatCurrency = (amount) => {
        return "₹" + Math.round(amount).toLocaleString('en-IN');
    };

    // Calculate Typical Range (Total Price)
    const minFairTotal = (fairPerKW * 0.9) * systemSize;
    const maxFairTotal = (fairPerKW * 1.15) * systemSize;

    // Determine Bar Position (0% to 100%)
    // Scale: 0% = 0.5x Fair, 50% = Fair, 100% = 1.5x Fair
    const centerPoint = fairPerKW;
    const range = fairPerKW * 0.5; // Window of +/- 25k basically
    let percentage = ((userPerKW - (centerPoint - range)) / (range * 2)) * 100;
    percentage = Math.max(5, Math.min(95, percentage)); // Clamp between 5% and 95%

    const html = `
        <div class="verdict-card" style="border-top: 5px solid ${config.color}">
            <div class="verdict-header">
                <span class="verdict-icon">${config.icon}</span>
                <h3>${config.label}</h3>
            </div>
            <p class="verdict-message">${config.message}</p>
            
            <div class="range-visualizer">
                <p class="range-label">Market Price Spectrum</p>
                <div class="bar-container">
                    <div class="range-bar">
                        <div class="fair-zone" style="left: 40%; width: 25%;"></div> <!-- Visual representation of fair zone -->
                    </div>
                    <div class="user-marker" style="left: ${percentage}%; background-color: ${config.color}">
                        <div class="marker-label">Your Quote</div>
                        <div class="marker-pin">▼</div>
                    </div>
                </div>
                <div class="bar-legend">
                    <span style="opacity: ${verdictKey === 'high' ? '0.3' : '1'}">Suspiciously Low</span>
                    <span style="opacity: ${verdictKey === 'suspicious' ? '0.3' : '1'}">Typical Range</span>
                    <span style="opacity: ${verdictKey === 'suspicious' ? '0.3' : '1'}; font-weight: ${verdictKey === 'high' ? '700' : '400'}">Premium/High</span>
                </div>
            </div >

            <div class="comparison-table">
                <div class="comp-row">
                    <span>Typical Market Range:</span>
                    <span class="comp-value">${formatCurrency(minFairTotal)} - ${formatCurrency(maxFairTotal)}</span>
                </div>
                <div class="comp-row highlight">
                    <span>Your Quote:</span>
                    <span class="comp-value">${formatCurrency(totalQuote)}</span>
                </div>
                <div class="comp-row detail">
                    <span>Price per kW:</span>
                    <span class="comp-value">${formatCurrency(userPerKW)}/kW</span>
                </div>
            </div>

            <div class="disclaimer-small">
                * Based on MNRE 2024 benchmarks and typical pricing patterns observed in your city. 
                Actual costs vary based on roof complexity, inverter type, and installation conditions.
            </div>
        </div >
        `;

    resultContent.innerHTML = html;
    resultContainer.classList.remove('hidden');

    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

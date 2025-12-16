// National Solar Calculator - India Wide Implementation
// Data structure for all states and cities

const INDIA_SOLAR_DATA = {
    // MNRE Benchmark 2025
    benchmark: {
        costPerKW: 50000, // Reference only
    },

    // Central subsidy
    centralSubsidy: {
        upto2kW: 78000,
        twoTo3kW: 117000,
        maxCapKW: 3
    },

    // State-wise market data
    states: {
        maharashtra: {
            name: 'Maharashtra',
            avgCostPerKW: 65000,
            minCostPerKW: 55000,
            maxCostPerKW: 75000,
            avgTariff: 7.5,
            generationPerKW: 4.8, // units per day average
            cities: {
                pune: { name: 'Pune', discom: 'MSEDCL', costFactor: 1.0 },
                mumbai: { name: 'Mumbai', discoms: ['BEST', 'TATA Power', 'MSEDCL'], costFactor: 1.15 },
                nagpur: { name: 'Nagpur', discom: 'MSEDCL', costFactor: 0.9 },
                nashik: { name: 'Nashik', discom: 'MSEDCL', costFactor: 0.95 }
            },
            stateSubsidy: 0, // No additional state subsidy
            netMeteringAvailable: true,
            approvalDays: '30-60'
        },
        karnataka: {
            name: 'Karnataka',
            avgCostPerKW: 60000,
            minCostPerKW: 50000,
            maxCostPerKW: 70000,
            avgTariff: 7.0,
            generationPerKW: 4.7,
            cities: {
                bangalore: { name: 'Bangalore', discoms: ['BESCOM'], costFactor: 1.05 },
                mysore: { name: 'Mysore', discom: 'CESC', costFactor: 1.0 },
                hubli: { name: 'Hubli', discom: 'HESCOM', costFactor: 0.95 },
                mangalore: { name: 'Mangalore', discom: 'MESCOM', costFactor: 1.0 }
            },
            stateSubsidy: 0,
            netMeteringAvailable: true,
            approvalDays: '45-60'
        },
        gujarat: {
            name: 'Gujarat',
            avgCostPerKW: 55000,
            minCostPerKW: 45000,
            maxCostPerKW: 65000,
            avgTariff: 6.5,
            generationPerKW: 5.2, // Excellent irradiation
            cities: {
                ahmedabad: { name: 'Ahmedabad', discoms: ['PGVCL', 'MGVCL'], costFactor: 1.0 },
                surat: { name: 'Surat', discoms: ['UGVCL', 'DGVCL'], costFactor: 0.95 },
                vadodara: { name: 'Vadodara', discom: 'MGVCL', costFactor: 1.0 },
                rajkot: { name: 'Rajkot', discom: 'PGVCL', costFactor: 0.9 }
            },
            stateSubsidy: 0.4, // 40% additional state subsidy (example)
            netMeteringAvailable: true,
            approvalDays: '30-45'
        },
        'tamil-nadu': {
            name: 'Tamil Nadu',
            avgCostPerKW: 65000,
            minCostPerKW: 55000,
            maxCostPerKW: 75000,
            avgTariff: 6.0,
            generationPerKW: 4.5,
            cities: {
                chennai: { name: 'Chennai', discom: 'TANGEDCO', costFactor: 1.1 },
                coimbatore: { name: 'Coimbatore', discom: 'TANGEDCO', costFactor: 1.0 },
                madurai: { name: 'Madurai', discom: 'TANGEDCO', costFactor: 0.95 },
                trichy: { name: 'Trichy', discom: 'TANGEDCO', costFactor: 0.9 }
            },
            stateSubsidy: 0,
            netMeteringAvailable: true,
            approvalDays: '60-90'
        },
        delhi: {
            name: 'Delhi NCR',
            avgCostPerKW: 70000,
            minCostPerKW: 60000,
            maxCostPerKW: 80000,
            avgTariff: 8.5, // Highest tariff
            generationPerKW: 4.6,
            cities: {
                delhi: { name: 'Delhi', discoms: ['BRPL', 'BYPL', 'TPDDL', 'NDPL'], costFactor: 1.1 },
                gurgaon: { name: 'Gurgaon', discom: 'DHBVN', costFactor: 1.0 },
                noida: { name: 'Noida', discom: 'PVVNL', costFactor: 1.0 },
                faridabad: { name: 'Faridabad', discom: 'DHBVN', costFactor: 0.95 }
            },
            stateSubsidy: 0.2, // ₹2,000 per kW
            netMeteringAvailable: true,
            approvalDays: '30-45'
        }
        // Add more states as needed
    },

    // Home type factors
    homeTypeFactors: {
        independent: 1.0, // Standard
        apartment: 1.2,   // 20% higher due to installation complexity
        farmhouse: 0.9    // 10% lower (easier access)
    },

    // Roof area mapping
    roofAreaMapping: {
        'less-300': 250,
        '300-600': 450,
        '600-1000': 800,
        '1000-1500': 1250,
        'more-1500': 2000
    }
};

// City and DISCOM population functions
function updateCities(stateValue) {
    const citySelect = document.getElementById('city');
    const discomSelect = document.getElementById('discom');

    // Clear previous options
    citySelect.innerHTML = '<option value="">Select your city</option>';
    discomSelect.innerHTML = '<option value="">DISCOM will be auto-selected</option>';

    if (!stateValue || !INDIA_SOLAR_DATA.states[stateValue]) {
        citySelect.disabled = true;
        discomSelect.disabled = true;
        return;
    }

    const state = INDIA_SOLAR_DATA.states[stateValue];

    // Populate cities
    Object.entries(state.cities).forEach(([key, city]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = city.name;
        citySelect.appendChild(option);
    });

    citySelect.disabled = false;
    discomSelect.disabled = false;
}

function updateDiscoms(stateValue, cityValue) {
    const discomSelect = document.getElementById('discom');

    if (!stateValue || !cityValue || !INDIA_SOLAR_DATA.states[stateValue]) {
        return;
    }

    const city = INDIA_SOLAR_DATA.states[stateValue].cities[cityValue];
    discomSelect.innerHTML = '<option value="">Choose DISCOM</option>';

    if (city.discoms) {
        // Multiple DISCOMs
        city.discoms.forEach(discom => {
            const option = document.createElement('option');
            option.value = discom;
            option.textContent = discom;
            discomSelect.appendChild(option);
        });
    } else if (city.discom) {
        // Single DISCOM
        const option = document.createElement('option');
        option.value = city.discom;
        option.textContent = city.discom;
        option.selected = true;
        discomSelect.appendChild(option);
    }
}

// Enhanced national calculator class
class NationalSolarCalculator {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('solarCalculator');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateNationalResults();
            });
        }

        // Add city change listener
        document.getElementById('city')?.addEventListener('change', (e) => {
            const state = document.getElementById('state').value;
            updateDiscoms(state, e.target.value);
        });
    }

    calculateNationalResults() {
        // Get inputs
        const monthlyBill = parseInt(document.getElementById('monthlyBill').value);
        const state = document.getElementById('state').value;
        const city = document.getElementById('city').value;
        const homeType = document.getElementById('homeType').value;
        const roofOwnership = document.getElementById('roofOwnership').value;
        const roofArea = INDIA_SOLAR_DATA.roofAreaMapping[document.getElementById('roofArea').value];
        const discom = document.getElementById('discom').value;

        if (!state || !city) {
            alert('Please select your state and city');
            return;
        }

        // Get state-specific data
        const stateData = INDIA_SOLAR_DATA.states[state];
        const cityData = stateData.cities[city];

        // Adjust cost based on city and home type
        const baseCostPerKW = stateData.avgCostPerKW * cityData.costFactor * INDIA_SOLAR_DATA.homeTypeFactors[homeType];

        // Calculate system size
        const monthlyUnits = monthlyBill / stateData.avgTariff;
        let systemSize = monthlyUnits / (stateData.generationPerKW * 30); // per kW per day * 30 days
        systemSize = Math.ceil(systemSize * 2) / 2; // Round to nearest 0.5 kW
        systemSize = Math.max(systemSize, 1); // Min 1 kW

        // Roof check
        const maxSystemPossible = Math.floor(roofArea / 100); // 100 sq ft per kW
        const roofLimited = systemSize > maxSystemPossible;
        if (roofLimited) {
            systemSize = maxSystemPossible;
        }

        // Calculate costs
        const totalCost = systemSize * baseCostPerKW;
        const costRange = {
            min: systemSize * stateData.minCostPerKW * cityData.costFactor,
            max: systemSize * stateData.maxCostPerKW * cityData.costFactor
        };

        // Calculate subsidies
        const centralSubsidy = this.calculateCentralSubsidy(systemSize, homeType, roofOwnership);
        const stateSubsidy = this.calculateStateSubsidy(systemSize, state, homeType);
        const totalSubsidy = centralSubsidy.amount + stateSubsidy.amount;

        // Calculate savings
        const monthlyGeneration = systemSize * stateData.generationPerKW * 30;
        const monthlySavings = Math.min(monthlyGeneration * stateData.avgTariff, monthlyBill * 0.95);

        // Payback
        const netCost = totalCost - totalSubsidy;
        const paybackYears = netCost / (monthlySavings * 12);

        // Display results
        this.displayNationalResults({
            location: `${cityData.name}, ${stateData.name}`,
            discom: discom,
            monthlyBill,
            systemSize,
            roofLimited,
            cost: costRange,
            subsidy: {
                central: centralSubsidy,
                state: stateSubsidy,
                total: totalSubsidy
            },
            netCost,
            savings: {
                monthly: Math.round(monthlySavings),
                annual: Math.round(monthlySavings * 12),
                percentage: Math.round((monthlySavings / monthlyBill) * 100)
            },
            payback: Math.round(paybackYears * 10) / 10,
            stateData
        });
    }

    calculateCentralSubsidy(systemSize, homeType, roofOwnership) {
        if (homeType === 'apartment' || roofOwnership !== 'own') {
            return { eligible: false, amount: 0, reason: 'Not eligible for residential subsidy' };
        }

        const subsidy = INDIA_SOLAR_DATA.centralSubsidy;
        let amount = 0;

        if (systemSize <= 2) {
            amount = subsidy.upto2kW;
        } else if (systemSize <= 3) {
            amount = subsidy.twoTo3kW;
        } else {
            amount = subsidy.twoTo3kW; // Capped at 3 kW
        }

        return {
            eligible: true,
            amount: amount,
            reason: 'PM-Surya Ghar Yojana (subject to approval)'
        };
    }

    calculateStateSubsidy(systemSize, state, homeType) {
        const stateData = INDIA_SOLAR_DATA.states[state];

        if (!stateData.stateSubsidy || stateData.stateSubsidy === 0) {
            return { eligible: false, amount: 0, reason: 'No state subsidy available' };
        }

        // If it's a percentage
        if (stateData.stateSubsidy < 1) {
            const baseCost = systemSize * stateData.avgCostPerKW;
            return {
                eligible: true,
                amount: Math.round(baseCost * stateData.stateSubsidy),
                reason: `${Math.round(stateData.stateSubsidy * 100)}% state subsidy`
            };
        }

        // If it's a fixed amount per kW
        return {
            eligible: true,
            amount: Math.round(systemSize * stateData.stateSubsidy),
            reason: `₹${stateData.stateSubsidy}/kW state incentive`
        };
    }

    displayNationalResults(data) {
        const resultsContainer = document.getElementById('calculatorResults');

        resultsContainer.innerHTML = `
            <div class="results-header">
                <h3>Your Solar Estimates for ${data.location}</h3>
                <p>DISCOM: ${data.discom} | Approval Time: ${data.stateData.approvalDays} days</p>
            </div>

            ${data.roofLimited ? `
            <div class="roof-warning">
                ⚠️ <strong>Roof Space Limitation:</strong> System size limited to ${data.systemSize} kW based on available roof area.
            </div>
            ` : ''}

            <div class="results-grid">
                <div class="result-card">
                    <h4>📊 Recommended System</h4>
                    <div class="result-value">${data.systemSize} kW</div>
                    <p>Based on your ₹${data.monthlyBill.toLocaleString('en-IN')}/month electricity bill</p>
                </div>

                <div class="result-card">
                    <h4>💰 Installation Cost</h4>
                    <div class="result-value">₹${(data.cost.min / 100000).toFixed(2)}L - ₹${(data.cost.max / 100000).toFixed(2)}L</div>
                    <p>Local pricing for ${data.location}</p>
                </div>

                <div class="result-card">
                    <h4>🏛️ Total Subsidy</h4>
                    <div class="result-value highlight">₹${(data.subsidy.total / 1000).toFixed(0)}k</div>
                    <p>Central: ₹${(data.subsidy.central.amount / 1000).toFixed(0)}k${data.subsidy.state.amount > 0 ? ` + State: ₹${(data.subsidy.state.amount / 1000).toFixed(0)}k` : ''}</p>
                </div>

                <div class="result-card">
                    <h4>💵 Net Cost</h4>
                    <div class="result-value">₹${((data.netCost) / 100000).toFixed(2)}L</div>
                    <p>After all subsidies</p>
                </div>

                <div class="result-card">
                    <h4>📉 Monthly Savings</h4>
                    <div class="result-value highlight">₹${data.savings.monthly.toLocaleString('en-IN')}</div>
                    <p>₹${(data.savings.annual / 100000).toFixed(2)}L/year (${data.savings.percentage}% of current bill)</p>
                </div>

                <div class="result-card">
                    <h4>⏱️ Payback Period</h4>
                    <div class="result-value">${data.payback} years</div>
                    <p>Panels last 25 years with 80% efficiency</p>
                </div>
            </div>

            <div class="disclaimer">
                <p><strong>Important:</strong> These are estimates based on ${data.location} installer pricing.
                Final costs depend on site survey, component selection, and installer quotes.</p>
            </div>

            <div class="next-steps-cta">
                <h3>Ready to Explore Solar?</h3>
                <p>Get 2 verified installer quotes in ${data.location}</p>
                <div class="lead-form-mini">
                    <input type="text" placeholder="Your Name" class="lead-input">
                    <input type="tel" placeholder="Phone Number" class="lead-input">
                    <button class="quote-btn" onclick="submitNationalLead('${data.location}', ${data.systemSize})">
                        Get Free Quotes
                    </button>
                </div>
            </div>
        `;

        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Lead submission for national calculator
function submitNationalLead(location, systemSize) {
    console.log('NATIONAL LEAD:', {
        location,
        systemSize: `${systemSize} kW`,
        timestamp: new Date().toISOString()
    });

    alert(`Thank you! We'll connect you with verified solar installers in ${location} within 24 hours.`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new NationalSolarCalculator();
});

// Input synchronization (reuse from Pune calculator)
function updateBillValue(value) {
    document.getElementById('monthlyBill').value = value;
}

function updateSliderValue(value) {
    document.getElementById('billSlider').value = value;
}
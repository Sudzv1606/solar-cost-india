/**
 * Apartment Solar Feasibility Checker Logic
 * Dependencies: apartment-data.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('check-feasibility-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkFeasibility);
    }
});

function checkFeasibility() {
    // 1. Get Inputs
    const stateInput = document.getElementById('state-select').value;
    const rooftopAccess = document.getElementById('rooftop-access').value; // 'full', 'partial', 'none'
    const resultSection = document.getElementById('feasibility-result');
    const resultContent = document.getElementById('result-content');

    // 2. Validation
    if (!stateInput || stateInput === "") {
        alert("Please select your state.");
        return;
    }

    // 3. Lookup Policy
    const policy = APARTMENT_DATA.POLICIES[stateInput] || APARTMENT_DATA.POLICIES["default"];
    const statusConfig = APARTMENT_DATA.STATUS_CONFIG[policy.status];

    // 4. Determine Override based on Rooftop Access
    // If state supports it, but simple "no access" is selected, we must warn.
    let accessWarning = "";
    if (rooftopAccess === "none") {
        accessWarning = `
            <div class="alert-box warning-soft">
                <strong>⚠️ Rooftop Access Issue:</strong> 
                Even though your state might allow it, you need physical roof space. 
                Ask your society if "Offsite Solar" (Open Access) is an option, though it's rare for small capacities.
            </div>
        `;
    }

    // 5. Render HTML
    const html = `
        <div class="feasibility-card" style="border-top: 5px solid ${statusConfig.color}">
            <div class="verdict-header">
                <span class="verdict-icon">${statusConfig.icon}</span>
                <div>
                    <h3>${statusConfig.label}</h3>
                    <p class="verdict-sub">Policy Status for ${policy.stateName}</p>
                </div>
            </div>
            
            <p class="policy-desc">${policy.description}</p>
            
            ${accessWarning}

            <div class="policy-details">
                <div class="detail-block">
                    <h4>📜 Key Conditions</h4>
                    <ul>
                        ${policy.conditions.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>

                <div class="detail-block highlight-block">
                    <h4>💡 What Usually Works Here</h4>
                    <ul class="clean-list">
                         ${policy.what_works.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="action-footer">
                <p>Next Step: Check the guide below on <strong>"Talking to your society about solar"</strong>.</p>
            </div>
        </div>
    `;

    // 6. Inject and Scroll
    resultContent.innerHTML = html;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

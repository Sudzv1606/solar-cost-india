/**
 * =============================================
 * CALCULATOR RESULTS SHARING MODULE
 * =============================================
 *
 * URL GENERATION RULES (CRITICAL):
 *
 * FOR INTERNAL LINKS: Always use CLEAN_CALCULATOR_URL
 * FOR USER SHARING: Use generateShareURL() (with params)
 *
 * Never use window.location.href with params for internal navigation.
 * Never programmatically create links with params for internal use.
 *
 * Rationale: Parameter URLs must canonicalize to clean URL to avoid
 * duplicate content issues. Only users should share parameter URLs.
 */

// Clean base URL constant - use this for ALL internal links
const CLEAN_CALCULATOR_URL = 'https://solarcostindia.in/solar-calculator.html';

const shareResults = (function () {

    /**
     * Generate shareable URL from calculator inputs
     * NOTE: Only for USER sharing. Never use for internal navigation.
     *
     * @param {Object} inputs - Calculator input values
     * @returns {string} Shareable URL with parameters
     */
    function generateShareURL(inputs) {
        const params = new URLSearchParams();

        // Only add params that have values
        if (inputs.bill) params.set('bill', inputs.bill);
        if (inputs.state) params.set('state', inputs.state);
        if (inputs.city) params.set('city', inputs.city);
        if (inputs.homeType) params.set('ht', inputs.homeType);
        if (inputs.roofOwnership) params.set('ro', inputs.roofOwnership);
        if (inputs.roofArea) params.set('ra', inputs.roofArea);

        const queryString = params.toString();

        // WARN: This URL contains parameters - NEVER use for internal links
        return queryString ? `${CLEAN_CALCULATOR_URL}?${queryString}` : CLEAN_CALCULATOR_URL;
    }

    /**
     * Copy share URL to clipboard
     */
    async function copyLink() {
        // Get current form values
        const inputs = getCurrentInputs();
        const url = generateShareURL(inputs);

        try {
            await navigator.clipboard.writeText(url);
            showFeedback('Link copied! Share it with your family.');

            // Track event
            if (typeof gtag === 'function') {
                gtag('event', 'share', {
                    method: 'copy_link',
                    content_type: 'calculator_results'
                });
            }
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showFeedback('Link copied!');
        }
    }

    /**
     * Download results as PDF (uses browser print)
     */
    function downloadPDF() {
        // Track event
        if (typeof gtag === 'function') {
            gtag('event', 'download', {
                content_type: 'calculator_results_pdf'
            });
        }

        // Trigger browser print
        window.print();
    }

    /**
     * Share via WhatsApp with accurate, protective phrasing
     */
    function shareWhatsApp() {
        const inputs = getCurrentInputs();
        const results = window.calculationResults;

        if (!results) {
            alert('Please complete the calculation first.');
            return;
        }

        const system = results.system;
        const cost = results.cost;
        const financial = results.financial;

        // Build location display name
        const location = inputs.city
            ? `${inputs.city}, ${inputs.state || ''}`
            : inputs.state || 'India';

        // Build message with accurate, protective phrasing
        const message = `*Solar Estimate for ${location.toUpperCase()}*%0A%0A` +
            `💡 System Size: ${system.recommendedKW} kW%0A` +
            `💰 Estimated Cost Range (before site survey): ₹${formatIndianNumber(cost.netRange.low)} - ₹${formatIndianNumber(cost.netRange.high)}%0A` +
            `⚡ Monthly Savings: ₹${formatIndianNumber(financial.monthlySavings)} (estimated)%0A` +
            `⏱️ Payback: ~${Math.floor(financial.paybackYears.min)}-${Math.ceil(financial.paybackYears.max)} years%0A%0A` +
            `🔗 Get your detailed estimate: ${generateShareURL(inputs)}%0A%0A` +
            `_Calculated on Solar Cost India — Final costs depend on site survey_`;

        // Track event
        if (typeof gtag === 'function') {
            gtag('event', 'share', {
                method: 'whatsapp',
                content_type: 'calculator_results'
            });
        }

        // Open WhatsApp
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }

    /**
     * Get current calculator inputs from form
     */
    function getCurrentInputs() {
        return {
            bill: document.getElementById('monthlyBill')?.value,
            state: document.getElementById('state')?.value,
            city: document.getElementById('city')?.value,
            homeType: document.getElementById('homeType')?.value,
            roofOwnership: document.getElementById('roofOwnership')?.value,
            roofArea: document.getElementById('roofArea')?.value
        };
    }

    /**
     * Show feedback message to user
     */
    function showFeedback(message) {
        const feedback = document.getElementById('shareFeedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.display = 'block';
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 3000);
        }
    }

    /**
     * Format numbers for Indian display
     */
    function formatIndianNumber(num) {
        return Math.round(num).toLocaleString('en-IN');
    }

    // Public API
    return {
        copyLink,
        downloadPDF,
        shareWhatsApp,
        generateShareURL
    };

})();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = shareResults;
}

/**
 * Solar Quote Checker Data Module
 * Contains official benchmarks and market multipliers.
 */

const QUOTE_DATA = {
    // MNRE Benchmark Costs (Feb 2024 Notification)
    // Floor prices per kW.
    BENCHMARKS: {
        upTo2kW: 50000,
        upTo3kW: 45000,
        above3kW: 43000
    },

    // Market Multipliers to adjust for real-world installer margins, labor, and logistics.
    // Base standard markup is ~1.15x (15%) over benchmark to be viable.
    CITY_MULTIPLIERS: {
        "mumbai": 1.35,      // High labor cost, high logistics
        "pune": 1.25,        // Moderate high
        "bangalore": 1.25,   // Premium market
        "delhi": 1.25,       // Competitive but high structural costs
        "gujarat": 1.10,     // Very competitive, lower costs
        "default": 1.15      // National Average
    },

    // UI Status Config
    STATUS_CONFIG: {
        "suspicious": {
            label: "Suspiciously Low",
            color: "#dc2626", // Red
            icon: "⚠️",
            message: "This quote is significantly below typical benchmarks. Check for hidden costs, older panels, or refurbished inverters."
        },
        "fair": {
            label: "Fair Market Price",
            color: "#16a34a", // Green
            icon: "✅",
            message: "This generally falls within a fair market range for your city based on official benchmarks."
        },
        "borderline": {
            label: "On the Higher Side",
            color: "#d97706", // Orange
            icon: "🟠",
            message: "This is slightly higher than average. May be justified by premium components (e.g., Enphase micro-inverters) or complex installation structures."
        },
        "high": {
            label: "High Quote",
            color: "#dc2626", // Red
            icon: "🛑",
            message: "This quote is significantly higher than market standards. Ask for a detailed cost breakdown or get a second opinion."
        }
    }
};

window.QUOTE_DATA = QUOTE_DATA;

/**
 * Core Solar Calculator Engine
 * Location-agnostic logic that works with any configuration
 * This engine NEVER references specific locations - only configuration variables
 */

class SolarCalculatorEngine {
    constructor() {
        this.validKWSizes = [1, 2, 3, 4, 5, 6, 7, 8, 10]; // Valid system sizes in kW
    }

    /**
     * Main calculation function
     * @param {Object} inputs - User inputs
     * @param {Object} config - Configuration object for the location
     * @returns {Object} Complete calculation results
     */
    calculate(inputs, config) {
        // Validate inputs
        if (!inputs.monthlyBill || inputs.monthlyBill < 0) {
            throw new Error('Invalid monthly bill amount');
        }

        // Step 1: Calculate electricity consumption from bill
        const monthlyUnits = inputs.monthlyBill / config.avg_unit_cost;

        // Step 2: Calculate required system size
        const monthlyUnitsPerKW = config.units_per_kw;
        const rawKW = monthlyUnits / monthlyUnitsPerKW;

        // Step 3: Round to valid system size
        const recommendedKW = this.roundToValidKW(rawKW);

        // Step 4: Calculate system cost range
        const costRange = this.calculateCostRange(recommendedKW, config);

        // Step 5: Calculate subsidy
        const subsidy = this.calculateSubsidy(recommendedKW, config);

        // Step 6: Calculate net cost after subsidy
        const netCostRange = {
            low: costRange.low - subsidy,
            high: costRange.high - subsidy
        };

        // Step 7: Calculate savings
        const savings = this.calculateSavings(recommendedKW, monthlyUnitsPerKW, config);

        // Step 8: Calculate payback period
        const payback = this.calculatePayback(netCostRange, savings.annual);

        // Step 9: Calculate roof area requirement
        const roofArea = recommendedKW * config.area_per_kw;

        // Step 10: Generate comprehensive results
        const results = {
            // Input summary
            inputs: {
                monthlyBill: inputs.monthlyBill,
                monthlyUnits: Math.round(monthlyUnits),
                location: inputs.location || 'Not specified'
            },

            // System specifications
            system: {
                recommendedKW: recommendedKW,
                roofAreaSqFt: roofArea,
                monthlyGeneration: recommendedKW * monthlyUnitsPerKW,
                annualGeneration: recommendedKW * monthlyUnitsPerKW * 12
            },

            // Cost analysis
            cost: {
                grossRange: costRange,
                subsidy: subsidy,
                netRange: netCostRange,
                costPerKWRange: {
                    low: Math.round(costRange.low / recommendedKW),
                    high: Math.round(costRange.high / recommendedKW)
                }
            },

            // Financial analysis
            financial: {
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                paybackYears: payback,
                roi25Years: this.calculateROI(netCostRange.low, savings.annual, 25)
            },

            // Additional info
            info: {
                approvalTime: config.approval_time_days,
                maintenanceCost: Math.round(netCostRange.low * (config.maintenance_cost_percent / 100)),
                resultLabel: config.result_label,
                accuracyNote: config.accuracy_note,
                dataFreshnessNote: config.data_freshness_note,
                discoms: config.discoms || ['Check with your local provider']
            },

            // Configuration metadata
            metadata: {
                locationLevel: this.getLocationLevel(inputs.state, inputs.city),
                configSource: this.getConfigSource(inputs.state, inputs.city)
            }
        };

        return results;
    }

    /**
     * Round kW to nearest valid size
     */
    roundToValidKW(rawKW) {
        // If very close to a valid size, use it
        for (const size of this.validKWSizes) {
            if (Math.abs(rawKW - size) < 0.2) {
                return size;
            }
        }

        // Otherwise round to next highest valid size
        for (const size of this.validKWSizes) {
            if (rawKW <= size) {
                return size;
            }
        }

        // If larger than 10kW, round to nearest kW
        return Math.ceil(rawKW);
    }

    /**
     * Calculate system cost range
     */
    calculateCostRange(kw, config) {
        return {
            low: Math.round(kw * config.cost_per_kw_low),
            high: Math.round(kw * config.cost_per_kw_high)
        };
    }

    /**
     * Calculate subsidy amount
     */
    calculateSubsidy(kw, config) {
        if (kw > config.subsidy_cap_kw) {
            // Only eligible up to cap
            kw = config.subsidy_cap_kw;
        }

        if (kw <= 2) {
            return Math.round(config.subsidy_upto_2kw);
        } else if (kw <= 3) {
            return Math.round(config.subsidy_2to_3kw);
        }

        return 0; // No subsidy above 3kW
    }

    /**
     * Calculate savings based on generation and tariff
     */
    calculateSavings(kw, unitsPerKW, config) {
        const monthlyGeneration = kw * unitsPerKW;
        const monthlySavings = monthlyGeneration * config.avg_unit_cost;

        return {
            monthly: Math.round(monthlySavings),
            annual: Math.round(monthlySavings * 12)
        };
    }

    /**
     * Calculate payback period
     */
    calculatePayback(netCostRange, annualSavings) {
        if (annualSavings <= 0) return 'N/A';

        const lowPayback = netCostRange.low / annualSavings;
        const highPayback = netCostRange.high / annualSavings;

        return {
            min: Math.round(lowPayback * 10) / 10,
            max: Math.round(highPayback * 10) / 10,
            average: Math.round(((lowPayback + highPayback) / 2) * 10) / 10
        };
    }

    /**
     * Calculate Return on Investment over X years
     */
    calculateROI(netCost, annualSavings, years) {
        const totalSavings = annualSavings * years;
        const netProfit = totalSavings - netCost;
        const roi = (netProfit / netCost) * 100;
        return Math.round(roi);
    }

    /**
     * Determine location precision level
     */
    getLocationLevel(state, city) {
        if (city) return 'city';
        if (state) return 'state';
        return 'national';
    }

    /**
     * Get configuration source description
     */
    getConfigSource(state, city) {
        if (city) return `City: ${this.capitalizeFirst(city)}`;
        if (state) return `State: ${this.capitalizeFirst(state.replace('_', ' '))}`;
        return 'National averages';
    }

    /**
     * Utility: Capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Validate if a system size is eligible for subsidy
     */
    isSubsidyEligible(kw, config) {
        return kw <= config.subsidy_cap_kw;
    }

    /**
     * Get system size recommendation with explanation
     */
    getSystemSizeRecommendation(bill, config) {
        const monthlyUnits = bill / config.avg_unit_cost;
        const rawKW = monthlyUnits / config.units_per_kw;
        const recommended = this.roundToValidKW(rawKW);

        let explanation = `Based on your ₹${bill.toLocaleString('en-IN')} monthly bill, you use approximately ${Math.round(monthlyUnits)} units per month. `;

        if (recommended <= 3) {
            explanation += `A ${recommended}kW system will cover most of your electricity needs and is eligible for the maximum central subsidy.`;
        } else {
            explanation += `A ${recommended}kW system is recommended to cover your consumption. Note that systems above 3kW are not eligible for central subsidy.`;
        }

        return {
            size: recommended,
            explanation: explanation
        };
    }
}

// Create singleton instance
const calculatorEngine = new SolarCalculatorEngine();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolarCalculatorEngine;
} else {
    window.SolarCalculatorEngine = SolarCalculatorEngine;
    window.calculatorEngine = calculatorEngine;
}
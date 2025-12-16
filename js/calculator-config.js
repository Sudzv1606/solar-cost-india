/**
 * Location-aware configuration system for India solar calculator
 * Architecture: National defaults → State overrides → City overrides
 */

// National defaults (India)
const CONFIG_INDIA = {
    // Core assumptions
    avg_unit_cost: 8.0,           // Average electricity cost per unit
    units_per_kw: 120,            // Monthly generation per kW
    area_per_kw: 100,             // Roof area required per kW (sq ft)

    // Cost ranges (per kW)
    cost_per_kw_low: 45000,       // Lowest cost regions
    cost_per_kw_high: 85000,      // Highest cost regions

    // Subsidy (PM-Surya Ghar)
    subsidy_cap_kw: 3,            // Max system size for subsidy
    subsidy_upto_2kw: 78000,      // Central subsidy for up to 2kW
    subsidy_2to_3kw: 117000,      // Central subsidy for 2-3kW

    // Process
    approval_time_days: "30-60",  // Typical approval timeline
    maintenance_cost_percent: 0.5, // Annual maintenance as % of system cost

    // Labels for outputs
    result_label: "Broad national estimate",
    accuracy_note: "Select your state for location-adjusted estimates",

    // Data freshness (global disclaimer)
    data_freshness_note: "Data updated: March 2025. Figures are estimates for informational purposes only; final costs depend on site survey."
};

// State configurations (overrides national values where different)
const CONFIG_STATES = {
    maharashtra: {
        avg_unit_cost: 8.5,
        cost_per_kw_low: 50000,
        cost_per_kw_high: 75000,
        approval_time_days: "30-45",
        discoms: ["MSEDCL - Maharashtra State Electricity Distribution Co. Ltd."],
        result_label: "Location-adjusted estimate for Maharashtra",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    karnataka: {
        avg_unit_cost: 7.5,
        cost_per_kw_low: 48000,
        cost_per_kw_high: 70000,
        approval_time_days: "25-40",
        discoms: ["BESCOM", "CESCOM", "GESCOM", "HESCOM"],
        result_label: "Location-adjusted estimate for Karnataka",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    gujarat: {
        avg_unit_cost: 6.5,
        cost_per_kw_low: 45000,
        cost_per_kw_high: 68000,
        approval_time_days: "20-35",
        discoms: ["PGVCL", "DGVCL", "UGVCL", "MGVCL"],
        result_label: "Location-adjusted estimate for Gujarat",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    tamil_nadu: {
        avg_unit_cost: 8.0,
        cost_per_kw_low: 52000,
        cost_per_kw_high: 78000,
        approval_time_days: "35-50",
        discoms: ["TANGEDCO"],
        result_label: "Location-adjusted estimate for Tamil Nadu",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    delhi: {
        avg_unit_cost: 8.0,
        cost_per_kw_low: 55000,
        cost_per_kw_high: 80000,
        approval_time_days: "25-40",
        discoms: ["BSES Rajdhani", "BSES Yamuna", "TPDDL"],
        result_label: "Location-adjusted estimate for Delhi",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    rajasthan: {
        avg_unit_cost: 6.5,
        cost_per_kw_low: 44000,
        cost_per_kw_high: 65000,
        approval_time_days: "30-45",
        discoms: ["JVVNL", "AVVNL", "JDVVNL"],
        result_label: "Location-adjusted estimate for Rajasthan",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    madhya_pradesh: {
        avg_unit_cost: 7.0,
        cost_per_kw_low: 46000,
        cost_per_kw_high: 68000,
        approval_time_days: "30-50",
        discoms: ["MPPKVVCL", "MPMKVVCL"],
        result_label: "Location-adjusted estimate for Madhya Pradesh",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    west_bengal: {
        avg_unit_cost: 7.5,
        cost_per_kw_low: 50000,
        cost_per_kw_high: 72000,
        approval_time_days: "40-60",
        discoms: ["CESC", "WBSEDCL"],
        result_label: "Location-adjusted estimate for West Bengal",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    andhra_pradesh: {
        avg_unit_cost: 7.5,
        cost_per_kw_low: 48000,
        cost_per_kw_high: 70000,
        approval_time_days: "30-45",
        discoms: ["APSPDCL", "APEPDCL", "APNPDCL", "APSPDCL (South)"],
        result_label: "Location-adjusted estimate for Andhra Pradesh",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    telangana: {
        avg_unit_cost: 8.0,
        cost_per_kw_low: 50000,
        cost_per_kw_high: 75000,
        approval_time_days: "30-45",
        discoms: ["TSSPDCL", "TSNPDCL"],
        result_label: "Location-adjusted estimate for Telangana",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    },

    uttar_pradesh: {
        avg_unit_cost: 7.0,
        cost_per_kw_low: 48000,
        cost_per_kw_high: 70000,
        approval_time_days: "45-60",
        discoms: ["PVVNL", "MVVNL", "DVVNL", "KEVNL", "JEVNL"],
        result_label: "Location-adjusted estimate for Uttar Pradesh",
        accuracy_note: "Based on state electricity tariffs and local pricing"
    }
};

// City configurations (overrides where specific data available)
const CONFIG_CITIES = {
    // Maharashtra cities
    pune: {
        cost_per_kw_low: 55000,
        cost_per_kw_high: 75000,
        approval_time_days: "25-40",
        roof_constraints_note: "Society permissions may apply in some areas",
        result_label: "Locally refined estimate for Pune",
        accuracy_note: "Using local installer data and pricing"
    },

    mumbai: {
        cost_per_kw_low: 60000,
        cost_per_kw_high: 85000,
        approval_time_days: "30-50",
        roof_constraints_note: "High-rise buildings have specific regulations",
        result_label: "Locally refined estimate for Mumbai",
        accuracy_note: "Using local installer data and pricing"
    },

    nagpur: {
        cost_per_kw_low: 50000,
        cost_per_kw_high: 70000,
        approval_time_days: "25-35",
        result_label: "Locally refined estimate for Nagpur",
        accuracy_note: "Using local installer data and pricing"
    },

    // Karnataka cities
    bangalore: {
        cost_per_kw_low: 50000,
        cost_per_kw_high: 72000,
        approval_time_days: "25-40",
        roof_constraints_note: "BBMP regulations apply for certain zones",
        result_label: "Locally refined estimate for Bangalore",
        accuracy_note: "Using local installer data and pricing"
    },

    // Gujarat cities
    ahmedabad: {
        cost_per_kw_low: 45000,
        cost_per_kw_high: 65000,
        approval_time_days: "20-30",
        result_label: "Locally refined estimate for Ahmedabad",
        accuracy_note: "Using local installer data and pricing"
    },

    surat: {
        cost_per_kw_low: 44000,
        cost_per_kw_high: 64000,
        approval_time_days: "20-30",
        result_label: "Locally refined estimate for Surat",
        accuracy_note: "Using local installer data and pricing"
    },

    // Delhi NCR
    delhi_ncr: {
        cost_per_kw_low: 55000,
        cost_per_kw_high: 78000,
        approval_time_days: "25-40",
        result_label: "Locally refined estimate for Delhi NCR",
        accuracy_note: "Using local installer data and pricing"
    },

    gurgaon: {
        cost_per_kw_low: 54000,
        cost_per_kw_high: 76000,
        approval_time_days: "30-45",
        result_label: "Locally refined estimate for Gurgaon",
        accuracy_note: "Using local installer data and pricing"
    },

    noida: {
        cost_per_kw_low: 54000,
        cost_per_kw_high: 76000,
        approval_time_days: "30-45",
        result_label: "Locally refined estimate for Noida",
        accuracy_note: "Using local installer data and pricing"
    }
};

/**
 * Get configuration for a specific location
 * Priority: City > State > National
 * Includes fallback guardrails for missing configurations
 */
function getCalculatorConfig(state = null, city = null) {
    // Start with national defaults
    let config = { ...CONFIG_INDIA };
    let fallbackMessage = null;

    // Ensure data freshness note is always included
    config.data_freshness_note = CONFIG_INDIA.data_freshness_note;

    // Apply state overrides if available
    if (state) {
        if (CONFIG_STATES[state]) {
            config = { ...config, ...CONFIG_STATES[state] };
        } else {
            // State not found - fallback to national
            console.warn(`State configuration not found for: ${state}, using national defaults`);
            fallbackMessage = `Using national estimates as state data is not available for ${getStatesList()[state] || state}`;
        }
    }

    // Apply city overrides if available
    if (city) {
        if (CONFIG_CITIES[city]) {
            config = { ...config, ...CONFIG_CITIES[city] };
        } else {
            // City not found - fallback to state
            console.warn(`City configuration not found for: ${city}, using state-level data`);
            fallbackMessage = `Using state-level estimates due to limited city data for ${city}`;
        }
    }

    // Add fallback message to config if needed
    if (fallbackMessage) {
        config.fallback_message = fallbackMessage;
        config.result_label = `${config.result_label} (Limited data)`;
    }

    return config;
}

/**
 * Get list of states with their display names
 */
function getStatesList() {
    return {
        maharashtra: "Maharashtra",
        karnataka: "Karnataka",
        gujarat: "Gujarat",
        tamil_nadu: "Tamil Nadu",
        delhi: "Delhi",
        rajasthan: "Rajasthan",
        madhya_pradesh: "Madhya Pradesh",
        west_bengal: "West Bengal",
        andhra_pradesh: "Andhra Pradesh",
        telangana: "Telangana",
        uttar_pradesh: "Uttar Pradesh"
    };
}

/**
 * Get cities for a state
 */
function getCitiesForState(state) {
    const cities = {};

    switch (state) {
        case 'maharashtra':
            cities.pune = "Pune";
            cities.mumbai = "Mumbai";
            cities.nagpur = "Nagpur";
            break;
        case 'karnataka':
            cities.bangalore = "Bangalore";
            break;
        case 'gujarat':
            cities.ahmedabad = "Ahmedabad";
            cities.surat = "Surat";
            break;
        case 'delhi':
            cities.delhi_ncr = "Delhi NCR";
            cities.gurgaon = "Gurgaon";
            cities.noida = "Noida";
            break;
    }

    return cities;
}

// Export for use in calculator
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG_INDIA,
        CONFIG_STATES,
        CONFIG_CITIES,
        getCalculatorConfig,
        getStatesList,
        getCitiesForState
    };
}
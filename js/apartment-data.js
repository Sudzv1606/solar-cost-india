/**
 * Apartment Solar Data Module
 * Contains state policies, verdict configurations, and glossary terms.
 */

const APARTMENT_DATA = {
    // 3-State Verdict Configuration
    STATUS_CONFIG: {
        "supported": {
            label: "✅ Supported",
            color: "#27ae60", // Green
            icon: "✅",
            message: "State policy explicitly allows shared solar benefits."
        },
        "limited": {
            label: "⚠️ Limited Support",
            color: "#f39c12", // Orange
            icon: "⚠️",
            message: "Solar is allowed for common areas, but individual flat benefits are restricted."
        },
        "currently_not_supported": {
            label: "🚫 Currently Not Supported",
            color: "#c0392b", // Red
            icon: "🚫",
            message: "Policies for individual shared solar are not yet notified or clear."
        },
        "unknown": {
            label: "❓ Verify Locally",
            color: "#7f8c8d", // Grey
            icon: "❓",
            message: "Policy is unclear or pilot-based. Check with your local DISCOM."
        }
    },

    // State Policy Database
    POLICIES: {
        "maharashtra": {
            status: "supported",
            stateName: "Maharashtra",
            policyName: "Virtual Net Metering (VNM)",
            description: "Maharashtra MERC regulations allow Virtual Net Metering. This means a single solar plant on the society rooftop can credit energy to individual flat electricity bills.",
            conditions: [
                "Requires society-level consensus.",
                "Subject to technical feasibility approval by MSEDCL/Adani/Tata Power.",
                "Meters must be compatible (smart meters preferred)."
            ],
            what_works: [
                "✅ <strong>Solar for Common Areas:</strong> Lifts, pumps, & corridor lighting (High Savings).",
                "✅ <strong>Individual Flat Solar:</strong> Possible via VNM (Requires paperwork)."
            ]
        },
        "delhi": {
            status: "supported",
            stateName: "Delhi NCR",
            policyName: "Group Net Metering (GNM) / VNM",
            description: "Delhi's solar policy is one of the most progressive, allowing Group Net Metering and Virtual Net Metering for housing societies (CGHS/RWAs).",
            conditions: [
                "Applicable for BSES Rajdhani, BSES Yamuna, and TP-DDL consumers.",
                "Group Net Metering allows surplus energy adjustment across meters.",
                "Virtual Net Metering allows crediting generation to participating consumers."
            ],
            what_works: [
                "✅ <strong>Common Area Solar:</strong> 100% allowed and encouraged.",
                "✅ <strong>Group Metering:</strong> Surplus form common area can set off individual bills."
            ]
        },
        "karnataka": {
            status: "limited",
            stateName: "Karnataka",
            policyName: "Common Area Net Metering",
            description: "Current BESCOM/policy framework primarily supports Net Metering for the society's common meter only. Individual billing credits (VNM) are not widely implemented.",
            conditions: [
                "Solar plant connects to the Common Service Meter.",
                "Savings reduce the society's maintenance bill.",
                "Individual flat bill adjustment is generally NOT supported yet."
            ],
            what_works: [
                "✅ <strong>Solar for Common Areas:</strong> Highly recommended to reduce maintenance charges.",
                "❌ <strong>Individual Flat Solar:</strong> Currently difficult/not supported."
            ]
        },
        "gujarat": {
            status: "limited",
            stateName: "Gujarat",
            policyName: "Common Service Connection",
            description: "Gujarat's policy focuses on residential rooftop solar (Surya Gujarat) for individual houses. For societies, the focus is on powering common amenities.",
            conditions: [
                "Subsidy available for common facility connections (GJD/GEDA rules apply).",
                "Virtual Net Metering for individual flats is not standard practice."
            ],
            what_works: [
                "✅ <strong>Common Area Solar:</strong> Eligible for Central/State subsidy (check current limits).",
                "❌ <strong>Individual Flat Solar:</strong> Not standard."
            ]
        },
        "default": {
            status: "unknown",
            stateName: "Your State",
            policyName: "Consult Local DISCOM",
            description: "We don't have verified policy data for your specific state yet. Many states allow solar for common areas by default, but individual sharing rules vary.",
            conditions: [
                "Check if your state regulator (SERC) has notified 'Virtual Net Metering'.",
                "Ask your RWA if they allow rooftop access."
            ],
            what_works: [
                "✅ <strong>Common Area Solar:</strong> Usually allowed everywhere (reduces maintenance bill).",
                "❓ <strong>Individual Benefits:</strong> Requires specific VNM policy."
            ]
        }
    }
};

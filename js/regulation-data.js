/**
 * State Regulation Data Module (Shared Contextual Layer)
 * Contains "Insider Tips" and "Local Rules" for solar implementations.
 */

const REGULATION_DATA = {
    "maharashtra": {
        stateName: "Maharashtra",
        insider_notes: [
            {
                type: "fee",
                title: "Processing Fees",
                message: "MSEDCL typically charges a processing fee (approx. ₹500-₹2000) for net metering applications, which is often excluded from installer quotes."
            },
            {
                type: "tariff",
                title: "Sanctioned Load Check",
                message: "Solar capacity cannot exceed your sanctioned load. Upgrading your load may move you to a higher fixed-charge slab."
            }
        ]
    },
    "delhi": {
        stateName: "Delhi",
        insider_notes: [
            {
                type: "policy",
                title: "Virtual Net Metering",
                message: "Delhi is one of the few places where 'Virtual Net Metering' is active, allowing you to buy a share in a community plant if you lack roof space."
            },
            {
                type: "fee",
                title: "Meter Testing",
                message: "DISCOMs may charge a meter testing fee if you opt to procure your own bidirectional meter instead of theirs."
            }
        ]
    },
    "karnataka": {
        stateName: "Karnataka",
        insider_notes: [
            {
                type: "policy",
                title: "Gross vs Net Metering",
                message: "For commercial consumers, BESCOM often mandates Gross Metering (lower returns) over Net Metering. Check your tariff category carefully."
            },
            {
                type: "grid",
                title: "Grid Availability",
                message: "In rural areas with frequent power cuts, a Hybrid Inverter is strongly recommended as On-Grid systems shut down during outages."
            }
        ]
    },
    "gujarat": {
        stateName: "Gujarat",
        insider_notes: [
            {
                type: "subsidy",
                title: "Surya Gujarat Subsidy",
                message: "Gujarat has the simplified 'Surya Gujarat' portal. Subsidy is credited directly to the consumer, usually faster than the national average."
            },
            {
                type: "capacity",
                title: "Capacity Limit",
                message: "Residential installations are typically capped at 100% of the sanctioned load."
            }
        ]
    },
    "default": {
        stateName: "General",
        insider_notes: [
            {
                type: "general",
                title: "Sanctioned Load",
                message: "Ensure your solar system size does not exceed your sanctioned load. Increasing load takes 1-2 weeks."
            },
            {
                type: "general",
                title: "Shadow Analysis",
                message: "A 'shadow-free' area is critical. Even a small shadow from a tank or tree can reduce generation by 30%."
            }
        ]
    }
};

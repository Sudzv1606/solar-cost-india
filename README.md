# Solar Decision Maharashtra

A decision intelligence website for Maharashtra homeowners considering rooftop solar installation.

## Project Overview

Helps users answer: "How much will solar cost me, how much will I save, and should I do it?"

### Features

1. **Solar Calculator**
   - Instant pricing for Pune, Mumbai, Nagpur
   - Subsidy calculations
   - Payback period analysis
   - 25-year savings projection

2. **City-Specific Pages**
   - `/solar-installation-cost-pune.html`
   - `/solar-installation-cost-mumbai.html`
   - `/solar-installation-cost-nagpur.html`

3. **Comparison Analysis**
   - Solar vs Grid electricity
   - ROI calculations
   - Decision scenarios

## Data Sources

### MNRE Benchmark Data (2025)
- Benchmark cost: ₹50,000/kW (government reference)
- Subsidy: ₹78,000 for up to 2 kW, ₹39,000 additional for 2-3 kW
- Maximum subsidy: ₹1,17,000

### Market Pricing (Research-based)
- Pune: ₹55,000 - ₹75,000/kW
- Mumbai: ₹60,000 - ₹85,000/kW
- Nagpur: ₹50,000 - ₹65,000/kW

### Calculations
- Average generation: 4 units/kW/day
- Average tariff: ₹8/unit
- System size = Monthly bill / (4 × 8 × 30)

## Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript
- **Backend**: None (static site)
- **Server**: Python HTTP server (for development)
- **Production**: Can be hosted on any static hosting platform

## Running Locally

```bash
# Navigate to project directory
cd solar-decision-website

# Start development server
python -m http.server 8080

# Or use npm
npm run start
```

Visit http://localhost:8080

## File Structure

```
solar-decision-website/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── calculator.js
│   ├── index.html
│   ├── solar-installation-cost-pune.html
│   ├── solar-installation-cost-mumbai.html
│   ├── solar-installation-cost-nagpur.html
│   └── solar-vs-grid-electricity-maharashtra.html
└── README.md
```

## Next Steps

1. **Lead Generation**
   - Connect form to email service (SendGrid/Mailgun)
   - Build installer database
   - Create lead distribution system

2. **Content Enhancement**
   - Add more Maharashtra cities
   - Create blog content for SEO
   - Add customer testimonials

3. **Monetization**
   - Lead generation fees from installers
   - Sponsored content opportunities
   - API access for solar companies

## Accuracy Notes

- Prices based on installer research in Jan 2025
- All calculations use conservative estimates
- Users should get site survey for exact pricing
- Subsidy rules may change - verify with MNRE

## Contact

For inquiries or collaboration: [Your contact info]
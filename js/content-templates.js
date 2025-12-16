/**
 * Content Templates System
 * Plug-and-play templates for scalable content generation
 */

class ContentTemplateEngine {
    constructor() {
        this.templates = {
            statePage: this.getStatePageTemplate(),
            cityPage: this.getCityPageTemplate()
        };
    }

    /**
     * Template 1: State Page
     * /solar-cost/{state}
     */
    getStatePageTemplate() {
        return {
            required: [
                'stateName',
                'stateCode',
                'discoms',
                'costRange',
                'tariffInfo',
                'approvalTime',
                'cities'
            ],

            template: (data) => `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Solar Installation Cost in ${data.stateName} (2025) | Solar Cost India</title>
                    <meta name="description" content="Complete guide to solar installation costs, subsidies, and ROI in ${data.stateName}. Compare with national averages.">
                    <link rel="stylesheet" href="/public/css/styles.css">
                </head>
                <body>
                    <header>
                        <nav>
                            <div class="nav-container">
                                <div class="logo">
                                    <h1><a href="/" style="text-decoration: none; color: inherit;">Solar Cost India</a></h1>
                                    <p style="font-size: 0.8rem; color: #666; margin-top: -5px;">India's Solar Decision Platform</p>
                                </div>
                                <ul class="nav-links">
                                    <li><a href="/public/solar-calculator.html">Calculator</a></li>
                                    <li><a href="/public/solar-cost-india.html">Solar Costs</a></li>
                                    <li><a href="/public/solar-installation-guide.html">Process</a></li>
                                    <li><a href="/public/solar-vs-grid-electricity.html">Compare</a></li>
                                </ul>
                            </div>
                        </nav>
                    </header>

                    <main>
                        <section class="page-header">
                            <div class="container">
                                <div class="breadcrumb">
                                    <a href="/public/solar-cost-india.html">Solar Costs India</a> → ${data.stateName}
                                </div>
                                <h1>Solar Installation Cost in ${data.stateName} (2025)</h1>
                                <p class="page-intro">
                                    How rooftop solar costs and savings in ${data.stateName} compare to the national average
                                </p>
                            </div>
                        </section>

                        <section class="state-comparison">
                            <div class="container">
                                <h2>How solar pricing in ${data.stateName} compares to India</h2>
                                <div class="comparison-grid">
                                    <div class="comparison-item">
                                        <h3>Cost Range</h3>
                                        <div class="cost-display">${data.costRange}</div>
                                        <p>${data.costComparison}</p>
                                    </div>
                                    <div class="comparison-item">
                                        <h3>Electricity Provider</h3>
                                        <div class="discom-list">
                                            ${data.discoms.map(discom => `<span class="discom-tag">${discom}</span>`).join('')}
                                        </div>
                                    </div>
                                    <div class="comparison-item">
                                        <h3>Approval Timeline</h3>
                                        <div class="timeline">${data.approvalTime}</div>
                                        <p>${data.approvalNotes || 'Standard process with local variations'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="tariff-impact">
                            <div class="container">
                                <h2>Electricity tariffs & impact on savings</h2>
                                <div class="tariff-content">
                                    <p>${data.tariffInfo}</p>
                                    <div class="payback-info">
                                        <h3>Typical payback period in ${data.stateName}</h3>
                                        <p>${data.paybackInfo}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="subsidy-approvals">
                            <div class="container">
                                <h2>Subsidies & approvals in ${data.stateName}</h2>
                                <div class="process-flow">
                                    <div class="process-step">
                                        <h4>MNRE Central Subsidy</h4>
                                        <p>Up to ₹78,000 for systems ≤ 2kW, additional ₹39,000 for 2-3kW systems</p>
                                        <p class="note">Subject to eligibility and verification</p>
                                    </div>
                                    <div class="process-step">
                                        <h4>${data.discoms[0]} Approval</h4>
                                        <p>Net metering application and technical feasibility study</p>
                                        <p>Timeline: ${data.approvalTime}</p>
                                    </div>
                                    <div class="process-step">
                                        <h4>Local Installation</h4>
                                        <p>Empaneled vendor selection and installation as per state guidelines</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="cities-section">
                            <div class="container">
                                <h2>Cities within ${data.stateName}</h2>
                                <div class="cities-grid">
                                    ${data.cities.map(city => `
                                        <div class="city-card">
                                            <h3>${city.name}</h3>
                                            <p class="city-estimate">${city.estimate}</p>
                                            <a href="/solar-cost/${data.stateCode}/${city.code}" class="city-link">
                                                View ${city.name} Details →
                                            </a>
                                        </div>
                                    `).join('')}
                                </div>
                                ${data.hasMoreCities ? `
                                    <p class="more-cities">
                                        More cities coming soon. Use calculator for accurate estimates.
                                    </p>
                                ` : ''}
                            </div>
                        </section>

                        <section class="state-cta">
                            <div class="container">
                                <div class="cta-card">
                                    <h3>Check your exact solar cost in ${data.stateName}</h3>
                                    <p>Get personalized estimates based on your electricity bill and location</p>
                                    <a href="/public/solar-calculator.html?state=${data.stateCode}" class="cta-button">
                                        Calculate Solar Cost in ${data.stateName}
                                    </a>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer>
                        <div class="container">
                            <div class="footer-content">
                                <div class="footer-section">
                                    <h4>Solar Cost India</h4>
                                    <p>India's decision & pricing intelligence platform for home solar</p>
                                </div>
                                <div class="footer-section">
                                    <h4>Quick Links</h4>
                                    <ul>
                                        <li><a href="/public/solar-calculator.html">Solar Calculator</a></li>
                                        <li><a href="/public/solar-cost-india.html">Solar Costs</a></li>
                                        <li><a href="/public/solar-installation-guide.html">Installation Guide</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>&copy; 2025 Solar Cost India. All calculations are estimates. Final costs depend on site survey and installer quotes.</p>
                            </div>
                        </div>
                    </footer>
                </body>
                </html>
            `
        };
    }

    /**
     * Template 2: City Page
     * /solar-cost/{state}/{city}
     */
    getCityPageTemplate() {
        return {
            required: [
                'cityName',
                'stateName',
                'stateCode',
                'cityCode',
                'costRange',
                'discom',
                'approvalTime',
                'localFactors',
                'scenarios'
            ],

            template: (data) => `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Solar Installation Cost in ${data.cityName}, ${data.stateName} | Solar Cost India</title>
                    <meta name="description" content="Solar panel costs, subsidies, and ROI in ${data.cityName}. Compare with ${data.stateName} averages.">
                    <link rel="stylesheet" href="/public/css/styles.css">
                </head>
                <body>
                    <header>
                        <nav>
                            <div class="nav-container">
                                <div class="logo">
                                    <h1><a href="/" style="text-decoration: none; color: inherit;">Solar Cost India</a></h1>
                                    <p style="font-size: 0.8rem; color: #666; margin-top: -5px;">India's Solar Decision Platform</p>
                                </div>
                                <ul class="nav-links">
                                    <li><a href="/public/solar-calculator.html">Calculator</a></li>
                                    <li><a href="/public/solar-cost-india.html">Solar Costs</a></li>
                                    <li><a href="/public/solar-installation-guide.html">Process</a></li>
                                    <li><a href="/public/solar-vs-grid-electricity.html">Compare</a></li>
                                </ul>
                            </div>
                        </nav>
                    </header>

                    <main>
                        <section class="page-header">
                            <div class="container">
                                <div class="breadcrumb">
                                    <a href="/public/solar-cost-india.html">Solar Costs India</a> →
                                    <a href="/solar-cost/${data.stateCode}">${data.stateName}</a> →
                                    ${data.cityName}
                                </div>
                                <h1>Solar Installation Cost in ${data.cityName}</h1>
                                <p class="page-intro">
                                    How solar installation costs and approvals work specifically in ${data.cityName}, compared to other parts of ${data.stateName}
                                </p>
                            </div>
                        </section>

                        <section class="city-costs">
                            <div class="container">
                                <h2>Typical solar costs in ${data.cityName}</h2>
                                <div class="cost-analysis">
                                    <div class="cost-range-display">
                                        <h3>${data.costRange}</h3>
                                        <p>per kW installed (including panels, inverter, and installation)</p>
                                    </div>
                                    <div class="cost-drivers">
                                        <h4>What causes variation locally:</h4>
                                        <ul>
                                            ${data.localFactors.map(factor => `<li>${factor}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="city-approvals">
                            <div class="container">
                                <h2>Approvals & timelines</h2>
                                <div class="approval-details">
                                    <div class="provider-info">
                                        <h3>Electricity Provider</h3>
                                        <p>${data.discom}</p>
                                    </div>
                                    <div class="timeline-info">
                                        <h3>Typical Timeline</h3>
                                        <p>${data.approvalTime} from application to commissioning</p>
                                        ${data.timelineNotes ? `<p class="note">${data.timelineNotes}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="city-scenarios">
                            <div class="container">
                                <h2>Is solar worth it in ${data.cityName}?</h2>
                                <div class="scenarios-grid">
                                    ${data.scenarios.map(scenario => `
                                        <div class="scenario-card ${scenario.type}">
                                            <h3>${scenario.billRange}</h3>
                                            <div class="scenario-details">
                                                <p><strong>System Size:</strong> ${scenario.systemSize}</p>
                                                <p><strong>Estimated Cost:</strong> ${scenario.cost}</p>
                                                <p><strong>Monthly Savings:</strong> ${scenario.savings}</p>
                                                <p><strong>Payback:</strong> ${scenario.payback}</p>
                                            </div>
                                            <p class="scenario-note">${scenario.note}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </section>

                        <section class="city-limitations">
                            <div class="container">
                                <h2>Limitations & considerations</h2>
                                <div class="considerations-grid">
                                    <div class="consideration">
                                        <h3>🏠 Roof Types</h3>
                                        <p>${data.roofTypes || 'Most roof types suitable, structural verification required for concrete roofs'}</p>
                                    </div>
                                    <div class="consideration">
                                        <h3>🏢 Society Permissions</h3>
                                        <p>${data.societyRules || 'Required for apartments and gated communities'}</p>
                                    </div>
                                    <div class="consideration">
                                        <h3>🌤️ Weather Impact</h3>
                                        <p>${data.weatherImpact || 'Generation varies by season, monsoon may affect output'}</p>
                                    </div>
                                    <div class="consideration">
                                        <h3>📋 Documentation</h3>
                                        <p>${data.documentation || 'Electricity bill, address proof, and property documents required'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="city-cta">
                            <div class="container">
                                <div class="cta-card">
                                    <h3>Calculate your solar cost in ${data.cityName}</h3>
                                    <p>Get exact estimates based on your monthly electricity bill and roof area</p>
                                    <a href="/public/solar-calculator.html?state=${data.stateCode}&city=${data.cityCode}" class="cta-button">
                                        Get ${data.cityName} Solar Estimate
                                    </a>
                                    <p class="disclaimer">Free estimate. No personal information required.</p>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer>
                        <div class="container">
                            <div class="footer-content">
                                <div class="footer-section">
                                    <h4>Solar Cost India</h4>
                                    <p>India's decision & pricing intelligence platform for home solar</p>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>&copy; 2025 Solar Cost India. All calculations are estimates. Final costs depend on site survey and installer quotes.</p>
                            </div>
                        </div>
                    </footer>
                </body>
                </html>
            `
        };
    }

    /**
     * Generate content using template
     */
    generate(templateName, data) {
        const template = this.templates[templateName];
        if (!template) {
            throw new Error(`Template not found: ${templateName}`);
        }

        // Validate required data
        const missing = template.required.filter(req => !(req in data));
        if (missing.length > 0) {
            throw new Error(`Missing required data for ${templateName}: ${missing.join(', ')}`);
        }

        // Generate content
        return template.template(data);
    }

    /**
     * Get sample data for testing
     */
    getSampleData(templateName) {
        if (templateName === 'statePage') {
            return {
                stateName: 'Maharashtra',
                stateCode: 'maharashtra',
                discoms: ['MSEDCL - Maharashtra State Electricity Distribution Co. Ltd.'],
                costRange: '₹50,000 - ₹75,000 per kW',
                costComparison: 'Slightly above national average due to higher installation costs',
                approvalTime: '30-45 days',
                approvalNotes: 'Faster in urban areas, rural may take longer',
                tariffInfo: 'Residential tariffs range from ₹6-8 per unit, making solar attractive for higher consumption',
                paybackInfo: '4-6 years for typical 3kW system',
                cities: [
                    { name: 'Pune', code: 'pune', estimate: '₹55k-75k/kW' },
                    { name: 'Mumbai', code: 'mumbai', estimate: '₹60k-85k/kW' },
                    { name: 'Nagpur', code: 'nagpur', estimate: '₹50k-70k/kW' }
                ],
                hasMoreCities: true
            };
        }

        if (templateName === 'cityPage') {
            return {
                cityName: 'Pune',
                stateName: 'Maharashtra',
                stateCode: 'maharashtra',
                cityCode: 'pune',
                costRange: '₹55,000 - ₹75,000 per kW',
                discom: 'MSEDCL - Maharashtra State Electricity Distribution Co. Ltd.',
                approvalTime: '25-40 days',
                timelineNotes: 'Society approvals may add 2-3 weeks',
                localFactors: [
                    'Higher labor costs in urban areas',
                    'Variable transportation charges',
                    'Building height restrictions'
                ],
                scenarios: [
                    {
                        type: 'good',
                        billRange: '₹2,000-3,000/month',
                        systemSize: '2-3 kW',
                        cost: '₹1.4-2.2 Lakhs',
                        savings: '₹1,500-2,200/month',
                        payback: '5-6 years',
                        note: 'Ideal for subsidy eligibility'
                    },
                    {
                        type: 'better',
                        billRange: '₹4,000-6,000/month',
                        systemSize: '4-5 kW',
                        cost: '₹2.5-3.8 Lakhs',
                        savings: '₹3,000-4,500/month',
                        payback: '4-5 years',
                        note: 'Best value proposition'
                    }
                ],
                roofTypes: 'Mostly suitable, flat roofs common in apartments',
                societyRules: 'Required for most housing societies',
                weatherImpact: 'Good sun exposure, monsoon reduces generation',
                documentation: 'Recent electricity bill, property tax receipt, ID proof'
            };
        }

        return {};
    }
}

// Global instance
const contentTemplateEngine = new ContentTemplateEngine();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContentTemplateEngine,
        contentTemplateEngine
    };
} else {
    window.ContentTemplateEngine = ContentTemplateEngine;
    window.contentTemplateEngine = contentTemplateEngine;
}
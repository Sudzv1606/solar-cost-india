/**
 * Smart Insights System for Solar Content Generation
 * Rule-based logic engine for generating helpful context
 */

// Engine Registry and Configuration
const INSIGHT_ENGINES = {
    // Engine 1: National Content Strategist
    Solar_Pillar_Content_Engine: {
        name: 'National Content Strategist',
        code: 'Solar_Pillar_Content_Engine',
        logicRules: `You are a national-level content strategist for an Indian residential solar decision platform.

Your responsibility:
- Write pillar-level content
- Explain concepts, not prices
- Frame decisions, not sell solutions

You must:
- Think at India level
- Avoid city or installer-specific language
- Use ranges and conditional framing
- Link users toward calculator or state pages

You must NEVER:
- Invent prices or subsidies
- Mention specific cities unless instructed
- Provide quotes or guarantees
- Override calculator logic

Your output must:
- Be neutral and educational
- Emphasize trade-offs
- Include at least one limitation or caveat`,

        scope: [
            '/solar-cost-india',
            '/solar-installation-guide',
            'comparison pages'
        ],

        inputRequirements: [
            'topic',
            'targetAudience',
            'keyPoints'
        ],

        outputFormat: 'structured_html'
    },

    // Engine 2: Calculator Explainer
    Calculator_Insight_Engine: {
        name: 'Calculator Insight Engine',
        code: 'Calculator_Insight_Engine',
        logicRules: `You explain calculator results for a residential solar decision platform.

You are NOT a pricing engine.
You are NOT a sales agent.

You receive:
- Calculator outputs
- Location context
- Config-based assumptions

You must:
- Explain what the results mean
- Use cautious language
- Reinforce uncertainty and assumptions
- Encourage next steps (refine location, site survey)

You must NEVER:
- Change calculator numbers
- Invent alternative scenarios
- Promise savings or subsidies
- Use exact figures where ranges are given

Every explanation must include:
- One assumption
- One limitation
- One next action for the user`,

        scope: [
            '/solar-calculator',
            'result popups',
            'lead explanation text'
        ],

        inputRequirements: [
            'calculatorOutputs',
            'locationContext',
            'configSource'
        ],

        outputFormat: 'explanation_text'
    },

    // Engine 3: State & City Localizer
    Solar_Localization_Engine: {
        name: 'State & City Localizer',
        code: 'Solar_Localization_Engine',
        logicRules: `You localize solar content for Indian states and cities.

You are given:
- National explanation
- State or city config values
- DISCOM names and timelines

You must:
- Adjust framing for location
- Explain why this location differs
- Highlight local constraints or advantages

You must NEVER:
- Add new numbers
- Change calculator logic
- Override subsidy rules
- Mention installers or brands

City-level output must:
- Be narrower than state content
- Reference state context
- Push users back to the calculator`,

        scope: [
            '/solar-cost/{state}',
            '/solar-cost/{state}/{city}',
            'all state & city pages'
        ],

        inputRequirements: [
            'nationalContent',
            'locationConfig',
            'locationType' // 'state' or 'city'
        ],

        outputFormat: 'localized_content'
    },

    // Engine 4: QA & Compliance Guard
    Solar_QA_Guard: {
        name: 'QA & Compliance Guard',
        code: 'Solar_QA_Guard',
        logicRules: `You are a QA and compliance reviewer for an Indian solar decision platform.

Your job is to FLAG content, not rewrite it.

You must check for:
- Invented prices
- Guarantees or promises
- City-first framing
- Missing disclaimers
- Conflicts with calculator outputs

You must output:
- PASS or FAIL
- Bullet list of violations (if any)
- Exact sentence that caused the issue

If unsure, FAIL.

QA Checklist:
❌ Exact prices without ranges
❌ "Guaranteed", "will receive", "final cost"
❌ City treated as platform identity
❌ Subsidy certainty
❌ Numbers not traceable to config`,

        scope: [
            'All generated content'
        ],

        inputRequirements: [
            'content',
            'engineUsed',
            'context'
        ],

        outputFormat: 'qa_report'
    }
};

/**
 * Insight Manager Class
 * Handles engine selection, execution, and QA workflow
 */
class InsightManager {
    constructor() {
        this.currentSession = null;
        this.engineHistory = [];
        this.auditLog = [];

        // City-safe vocabulary
        this.safeVocabulary = [
            'typically', 'usually', 'generally', 'often', 'commonly',
            'may', 'might', 'could', 'subject to', 'depends on',
            'approximately', 'roughly', 'about', 'estimated', 'projected'
        ];

        // Banned vocabulary
        this.bannedVocabulary = [
            'best', 'cheapest', 'guaranteed', 'exact', 'final',
            'will', 'always', 'never', 'perfect', 'ideal'
        ];
    }

    /**
     * Start a new content generation session
     */
    startSession(context) {
        this.currentSession = {
            id: Date.now(),
            startTime: new Date(),
            context: context,
            steps: []
        };
    }

    /**
     * Select appropriate engine based on request type
     */
    selectEngine(requestType) {
        const engineMap = {
            'pillar_content': 'Solar_Pillar_Content_Engine',
            'calculator_explain': 'Calculator_Insight_Engine',
            'localization': 'Solar_Localization_Engine'
        };

        const engineCode = engineMap[requestType];
        if (!engineCode) {
            throw new Error(`No engine found for request type: ${requestType}`);
        }

        return INSIGHT_ENGINES[engineCode];
    }

    /**
     * Execute engine with inputs and QA validation
     */
    async executeEngine(engineCode, inputs) {
        const engine = INSIGHT_ENGINES[engineCode];
        if (!engine) {
            throw new Error(`Engine not found: ${engineCode}`);
        }

        // Validate inputs
        this.validateInputs(engine, inputs);

        // Generate content (logic-based simulation)
        const content = await this.generateContent(engine, inputs);

        // QA check
        const qaResult = await this.runQA(engine, content, inputs);

        // Record in session
        this.recordStep(engineCode, inputs, content, qaResult);

        return {
            content: content,
            qa: qaResult,
            engine: engine.name
        };
    }

    /**
     * Validate engine inputs
     */
    validateInputs(engine, inputs) {
        const missing = engine.inputRequirements.filter(req => !(req in inputs));
        if (missing.length > 0) {
            throw new Error(`Missing required inputs for ${engine.name}: ${missing.join(', ')}`);
        }
    }

    /**
     * Simulate content generation (replace with actual logic/API in production)
     */
    async generateContent(engine, inputs) {
        // This is a placeholder for the actual logic/API call
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`Executing ${engine.code} with inputs:`, inputs);
        }

        // Simulated response based on engine type
        return this.getSimulatedResponse(engine.code, inputs);
    }

    /**
     * Run QA check on generated content
     */
    async runQA(engine, content, inputs) {
        const qaEngine = INSIGHT_ENGINES.Solar_QA_Guard;

        // Enhanced QA check with config citation validation
        const violations = this.checkViolations(content);
        const citationCheck = this.validateConfigCitations(content, inputs);
        const vocabularyCheck = this.validateVocabulary(content);

        // Merge all violations
        const allViolations = [
            ...violations,
            ...citationCheck.violations,
            ...vocabularyCheck.violations
        ];

        // Build audit log entry
        const auditEntry = {
            contentId: this.generateContentId(),
            engine: engine.code,
            timestamp: new Date(),
            inputs: inputs,
            citations: citationCheck.citations,
            vocabularyUsed: vocabularyCheck.wordsUsed,
            violations: allViolations
        };

        // Store in session
        this.auditLog.push(auditEntry);

        return {
            status: allViolations.length === 0 ? 'PASS' : 'FAIL',
            violations: allViolations,
            citations: citationCheck.citations,
            auditId: auditEntry.contentId,
            engineUsed: engine.code,
            timestamp: new Date()
        };
    }

    /**
     * Check for compliance violations
     */
    checkViolations(content) {
        const violations = [];
        const lowerContent = content.toLowerCase();

        // Check for forbidden terms
        const forbiddenPatterns = [
            { pattern: /guaranteed/gi, message: 'Contains guarantee language' },
            { pattern: /will receive/gi, message: 'Promises specific outcomes' },
            { pattern: /final cost/gi, message: 'Presents costs as final' },
            { pattern: /exact price/gi, message: 'Gives exact prices without ranges' }
        ];

        // Check for exact numbers without ranges
        const numberPattern = /₹\d{1,3}(,\d{3})*(\.\d{2})?/g;
        const matches = content.match(numberPattern);
        if (matches && matches.length > 0) {
            // Check if these numbers are in range format
            const hasRange = matches.some(m => m.includes('-') || m.includes('to'));
            if (!hasRange) {
                violations.push('Contains exact prices without ranges');
            }
        }

        // Apply forbidden pattern checks
        forbiddenPatterns.forEach(({ pattern, message }) => {
            if (pattern.test(content)) {
                violations.push(message);
            }
        });

        return violations;
    }

    /**
     * Record step in session history
     */
    recordStep(engineCode, inputs, content, qaResult) {
        if (!this.currentSession) return;

        this.currentSession.steps.push({
            engine: engineCode,
            inputs: inputs,
            content: content,
            qa: qaResult,
            timestamp: new Date()
        });

        this.engineHistory.push({
            sessionId: this.currentSession.id,
            step: this.currentSession.steps.length
        });
    }

    /**
     * Get session report
     */
    getSessionReport() {
        return {
            session: this.currentSession,
            totalSteps: this.currentSession?.steps.length || 0,
            passedSteps: this.currentSession?.steps.filter(s => s.qa.status === 'PASS').length || 0,
            auditEntries: this.auditLog.length
        };
    }

    /**
     * Generate unique content ID for tracking
     */
    generateContentId() {
        return 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate that numeric claims have config citations
     */
    validateConfigCitations(content, inputs) {
        const citations = [];
        const violations = [];
        const numbers = content.match(/₹\d{1,3}(,\d{3})*(\.\d{2})?/g) || [];

        numbers.forEach(number => {
            // Find config source for this number
            let source = null;

            // Check if number matches calculator outputs
            if (inputs.calculatorOutputs) {
                const outputs = inputs.calculatorOutputs;
                if (outputs.cost && outputs.cost.netRange) {
                    if (number.includes('₹')) {
                        source = 'calculator.cost.netRange';
                    }
                }
            }

            // Check if number matches config values
            if (inputs.locationConfig) {
                if (inputs.locationConfig.cost_per_kw_low || inputs.locationConfig.cost_per_kw_high) {
                    source = source ? source + ', locationConfig.cost_per_kw' : 'locationConfig.cost_per_kw';
                }
            }

            // Default citation
            if (!source) {
                source = 'national_defaults';
                violations.push(`Number "${number}" lacks clear config source`);
            }

            citations.push({
                number: number,
                source: source,
                context: 'numeric_claim'
            });
        });

        return {
            citations: citations,
            violations: violations
        };
    }

    /**
     * Validate vocabulary usage
     */
    validateVocabulary(content) {
        const wordsUsed = [];
        const violations = [];
        const lowerContent = content.toLowerCase();

        // Check for safe vocabulary (optional - tracking only)
        this.safeVocabulary.forEach(word => {
            if (lowerContent.includes(word)) {
                wordsUsed.push({
                    word: word,
                    type: 'safe',
                    context: 'used'
                });
            }
        });

        // Check for banned vocabulary
        this.bannedVocabulary.forEach(word => {
            if (lowerContent.includes(word)) {
                violations.push(`Banned vocabulary detected: "${word}"`);
                wordsUsed.push({
                    word: word,
                    type: 'banned',
                    context: 'violation'
                });
            }
        });

        return {
            wordsUsed: wordsUsed,
            violations: violations
        };
    }

    /**
     * Get audit log for debugging
     */
    getAuditLog(contentId = null) {
        if (contentId) {
            return this.auditLog.filter(entry => entry.contentId === contentId);
        }
        return this.auditLog;
    }

    /**
     * Simulated responses for testing
     */
    getSimulatedResponse(engineCode, inputs) {
        const responses = {
            'Solar_Pillar_Content_Engine': `
                <div class="pillar-content">
                    <h2>Understanding Solar Costs in India</h2>
                    <p>Solar installation costs in India vary significantly based on multiple factors including location, system size, and installation complexity.</p>
                    <p><strong>Key considerations:</strong></p>
                    <ul>
                        <li>Cost ranges typically fall between ₹45,000-85,000 per kW</li>
                        <li>Central subsidies are available for systems up to 3kW</li>
                        <li>State policies can significantly impact final costs</li>
                    </ul>
                    <p class="limitation">These are broad estimates - actual costs depend on site-specific factors.</p>
                </div>
            `,
            'Calculator_Insight_Engine': `
                <div class="calculator-explanation">
                    <p>Based on your inputs, the system estimates a ${inputs.calculatorOutputs?.system?.recommendedKW || '3'} kW installation.</p>
                    <p><strong>Assumption:</strong> This calculation assumes average sunshine hours and standard installation conditions.</p>
                    <p><strong>Limitation:</strong> Actual generation may vary based on your roof orientation and local weather.</p>
                    <p><strong>Next step:</strong> Select your specific state for more accurate pricing.</p>
                </div>
            `,
            'Solar_Localization_Engine': `
                <div class="localized-content">
                    <h3>Solar Costs in ${inputs.locationConfig?.displayName || 'this location'}</h3>
                    <p>Compared to national averages, ${inputs.locationType === 'state' ? 'this state' : 'this city'} shows ${inputs.locationConfig?.costAboveNational ? 'higher' : 'lower'
                } installation costs.</p>
                    <p>This is primarily due to ${inputs.locationConfig?.costDrivers || 'local market conditions'}.</p>
                    <p>For precise calculations, use the calculator with your specific details.</p>
                </div>
            `
        };

        return responses[engineCode] || '<p>Content generated successfully.</p>';
    }
}

// Global instance
const insightManager = new InsightManager();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INSIGHT_ENGINES,
        InsightManager,
        insightManager
    };
} else {
    window.INSIGHT_ENGINES = INSIGHT_ENGINES;
    window.InsightManager = InsightManager;
    window.insightManager = insightManager;
}

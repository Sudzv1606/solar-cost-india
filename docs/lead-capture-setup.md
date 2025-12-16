# Lead Capture Setup Guide

## Current Implementation

The website currently captures leads through the calculator results form. When users submit their information:

1. Data is logged to browser console (for development)
2. User sees a confirmation message
3. In production, this should connect to your lead management system

## Next Steps for Production

### Option 1: Google Sheets (Free & Simple)
1. Create a Google Form at https://forms.google.com
2. Connect it to a Google Sheet
3. Use Google Apps Script to create a web app endpoint
4. Update the `submitPuneLead()` function to send data there

### Option 2: Email Service
1. Sign up for SendGrid, Mailgun, or AWS SES
2. Get API keys
3. Set up email templates
4. Update the JavaScript to send emails

### Option 3: CRM Integration
1. Choose a CRM (HubSpot, Salesforce, Zoho)
2. Get API access
3. Create lead objects
4. Set up automation for lead distribution

## Lead Data Structure

Each lead submission includes:
```javascript
{
  name: string,
  phone: string,
  email: string,
  systemSize: string, // e.g., "3 kW"
  timestamp: ISO string,
  source: "Pune Calculator"
}
```

## Lead Distribution Strategy

For Pune market:
1. Partner with 2-3 MNRE-empanelled installers
2. Verify their credentials and past work
3. Create a rotation system for lead distribution
4. Charge per lead or commission on successful installation

## Recommended Pricing for Leads

- Standard leads (1-3 kW): ₹500 per lead
- Premium leads (4+ kW): ₹1000 per lead
- Verified lead qualification fee: ₹2000 per month

## Compliance Requirements

1. GDPR/Privacy policy on website
2. Clear disclosure of data sharing
3. Easy opt-out mechanism
4. Secure data storage

## Testing the Current System

To test lead capture:
1. Run the calculator
2. Submit the form with test data
3. Check browser console (F12 > Console)
4. You'll see the lead data logged there

## Analytics Tracking

Consider adding:
1. Google Analytics 4
2. Facebook Pixel (for retargeting)
3. Hotjar or Clarity for user behavior
4. Conversion tracking for lead submissions
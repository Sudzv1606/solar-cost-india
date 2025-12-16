// Cookie Consent Banner
(function () {
    'use strict';

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
        // Show banner after 2 second delay
        setTimeout(showCookieBanner, 2000);
    }

    function showCookieBanner() {
        // Create banner HTML
        const banner = document.createElement('div');
        banner.className = 'cookie-consent show';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <p>
                        <strong>We use cookies to improve your experience.</strong> 
                        We use cookies and similar technologies to analyze traffic and improve our services. 
                        By continuing to use this site, you consent to our use of cookies. 
                        <a href="/privacy-policy.html">Learn more</a>
                    </p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn decline" onclick="handleCookieChoice('decline')">Decline</button>
                    <button class="cookie-btn accept" onclick="handleCookieChoice('accept')">Accept</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
    }

    // Global function for button clicks
    window.handleCookieChoice = function (choice) {
        localStorage.setItem('cookieConsent', choice);

        const banner = document.querySelector('.cookie-consent');
        if (banner) {
            banner.style.display = 'none';
        }

        if (choice === 'accept') {
            // Enable analytics
            if (typeof gtag === 'function') {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('Analytics enabled');
                }
            }
        } else {
            // Disable analytics
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Analytics disabled by user');
            }
        }
    };
})();

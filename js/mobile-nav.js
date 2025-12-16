/**
 * Mobile Navigation Handler
 * Handles hamburger menu toggle for mobile devices
 */

console.log('Mobile nav script loaded');

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    console.log('Hamburger element:', hamburger);
    console.log('Nav links element:', navLinks);

    if (!hamburger || !navLinks) {
        console.error('Hamburger or nav-links not found');
        return;
    }

    console.log('Both elements found, adding click listener');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function (e) {
        console.log('Hamburger clicked!');
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');

        console.log('Hamburger active:', hamburger.classList.contains('active'));
        console.log('Nav links active:', navLinks.classList.contains('active'));

        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Close menu on window resize to desktop size
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

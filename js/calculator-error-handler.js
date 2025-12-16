// Error handling utility functions
function showErrorMessage(message) {
    // Create or update error message element
    let errorDiv = document.getElementById('calculatorError');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'calculatorError';
        errorDiv.style.cssText = `
            background-color: #fee;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            padding: 15px 20px;
            margin: 20px 0;
            color: #c0392b;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideDown 0.3s ease-out;
        `;

        // Insert after the form
        const form = document.querySelector('form');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(errorDiv, form.nextSibling);
        }
    }

    errorDiv.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${message}</span>
    `;

    errorDiv.style.display = 'flex';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                if (errorDiv && errorDiv.parentNode) {
                    errorDiv.style.display = 'none';
                    errorDiv.style.opacity = '1';
                }
            }, 300);
        }
    }, 5000);
}

function hideErrorMessage() {
    const errorDiv = document.getElementById('calculatorError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Add CSS animation for error message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

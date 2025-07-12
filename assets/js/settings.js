// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            navTabs.forEach(t => t.classList.remove('active'));
            settingsPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Update URL hash
            window.location.hash = targetTab;
        });
    });

    // Load tab from URL hash on page load
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navTabs.forEach(t => t.classList.remove('active'));
        settingsPanels.forEach(p => p.classList.remove('active'));
        
        document.querySelector(`[data-tab="${hash}"]`).classList.add('active');
        document.getElementById(hash).classList.add('active');
    }

    // Password Strength Validation
    const newPasswordInput = document.getElementById('newPassword');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength);
        });
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.match(/[a-z]/)) score += 1;
        if (password.match(/[A-Z]/)) score += 1;
        if (password.match(/[0-9]/)) score += 1;
        if (password.match(/[^a-zA-Z0-9]/)) score += 1;
        
        if (score < 2) return { level: 'weak', percentage: 25, color: '#ef4444' };
        if (score < 3) return { level: 'fair', percentage: 50, color: '#f59e0b' };
        if (score < 4) return { level: 'good', percentage: 75, color: '#3b82f6' };
        return { level: 'strong', percentage: 100, color: '#22c55e' };
    }

    function updatePasswordStrength(strength) {
        strengthBar.style.width = strength.percentage + '%';
        strengthBar.style.background = strength.color;
        strengthBar.className = 'strength-fill ' + strength.level;
        strengthText.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1) + ' password';
    }

    // Profile Picture Upload
    const uploadPictureBtn = document.getElementById('uploadPicture');
    const pictureInput = document.getElementById('pictureInput');
    const currentPicture = document.getElementById('currentPicture');

    if (uploadPictureBtn && pictureInput) {
        uploadPictureBtn.addEventListener('click', function() {
            pictureInput.click();
        });

        pictureInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentPicture.src = e.target.result;
                    showNotification('Profile picture updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove Profile Picture
    const removePictureBtn = document.getElementById('removePicture');
    if (removePictureBtn) {
        removePictureBtn.addEventListener('click', function() {
            currentPicture.src = 'assets/images/default-avatar.jpg';
            showNotification('Profile picture removed', 'info');
        });
    }

    // Update Password
    const updatePasswordBtn = document.getElementById('updatePassword');
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener('click', function() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('Please fill in all password fields', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }

            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }

            // Simulate password update
            showNotification('Password updated successfully!', 'success');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            updatePasswordStrength({ level: 'weak', percentage: 0, color: '#ef4444' });
        });
    }

    // Enable 2FA
    const enable2FABtn = document.getElementById('enable2FA');
    if (enable2FABtn) {
        enable2FABtn.addEventListener('click', function() {
            // Show 2FA setup modal (simplified)
            showNotification('2FA setup initiated. Check your email for instructions.', 'info');
        });
    }

    // Revoke Sessions
    const revokeAllSessionsBtn = document.getElementById('revokeAllSessions');
    if (revokeAllSessionsBtn) {
        revokeAllSessionsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to revoke all other sessions? This will log you out from all other devices.')) {
                showNotification('All other sessions have been revoked', 'success');
            }
        });
    }

    // Export Settings
    const exportSettingsBtn = document.getElementById('exportSettings');
    if (exportSettingsBtn) {
        exportSettingsBtn.addEventListener('click', function() {
            const settings = {
                profile: {
                    firstName: document.getElementById('firstName')?.value,
                    lastName: document.getElementById('lastName')?.value,
                    email: document.getElementById('email')?.value,
                    phone: document.getElementById('phone')?.value
                },
                notifications: {
                    email: document.querySelectorAll('#notifications input[type="checkbox"]'),
                    push: document.getElementById('pushNotifications')?.checked,
                    sms: document.querySelector('#sms-notifications input[type="checkbox"]')?.checked
                },
                privacy: {
                    analytics: document.querySelector('#privacy input[type="checkbox"]')?.checked,
                    personalized: document.querySelectorAll('#privacy input[type="checkbox"]')[1]?.checked,
                    thirdParty: document.querySelectorAll('#privacy input[type="checkbox"]')[2]?.checked
                }
            };

            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'myeca-settings.json';
            a.click();
            URL.revokeObjectURL(url);
            
            showNotification('Settings exported successfully!', 'success');
        });
    }

    // Save All Settings
    const saveAllSettingsBtn = document.getElementById('saveAllSettings');
    if (saveAllSettingsBtn) {
        saveAllSettingsBtn.addEventListener('click', function() {
            // Collect all form data
            const formData = new FormData();
            
            // Profile data
            formData.append('firstName', document.getElementById('firstName')?.value || '');
            formData.append('lastName', document.getElementById('lastName')?.value || '');
            formData.append('email', document.getElementById('email')?.value || '');
            formData.append('phone', document.getElementById('phone')?.value || '');
            formData.append('address', document.getElementById('address')?.value || '');
            formData.append('panNumber', document.getElementById('panNumber')?.value || '');
            formData.append('aadharNumber', document.getElementById('aadharNumber')?.value || '');
            formData.append('occupation', document.getElementById('occupation')?.value || '');
            formData.append('company', document.getElementById('company')?.value || '');

            // Simulate saving
            this.disabled = true;
            this.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" fill="none"/></svg> Saving...';
            
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" fill="none"/></svg> Save All Changes';
                showNotification('All settings saved successfully!', 'success');
            }, 2000);
        });
    }

    // Export Data
    const exportDataBtn = document.getElementById('exportData');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            showNotification('Data export initiated. You will receive an email when it\'s ready.', 'info');
        });
    }

    // Delete Account
    const deleteAccountBtn = document.getElementById('deleteAccount');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.')) {
                if (confirm('This is your final warning. All your tax filings, documents, and account data will be permanently deleted. Are you absolutely sure?')) {
                    showNotification('Account deletion initiated. You will receive a confirmation email.', 'warning');
                }
            }
        });
    }

    // Copy API Key
    const copyApiKeyBtn = document.getElementById('copyApiKey');
    if (copyApiKeyBtn) {
        copyApiKeyBtn.addEventListener('click', function() {
            const apiKey = document.getElementById('apiKey');
            apiKey.select();
            document.execCommand('copy');
            showNotification('API key copied to clipboard!', 'success');
        });
    }

    // Regenerate API Key
    const regenerateApiKeyBtn = document.getElementById('regenerateApiKey');
    if (regenerateApiKeyBtn) {
        regenerateApiKeyBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to regenerate your API key? This will invalidate the current key.')) {
                const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                document.getElementById('apiKey').value = newKey;
                showNotification('API key regenerated successfully!', 'success');
            }
        });
    }

    // Save Webhook
    const saveWebhookBtn = document.getElementById('saveWebhook');
    if (saveWebhookBtn) {
        saveWebhookBtn.addEventListener('click', function() {
            const webhookUrl = document.getElementById('webhookUrl').value;
            if (webhookUrl && isValidUrl(webhookUrl)) {
                showNotification('Webhook URL saved successfully!', 'success');
            } else {
                showNotification('Please enter a valid webhook URL', 'error');
            }
        });
    }

    // Add Payment Method
    const addPaymentMethodBtn = document.getElementById('addPaymentMethod');
    if (addPaymentMethodBtn) {
        addPaymentMethodBtn.addEventListener('click', function() {
            showNotification('Payment method setup initiated', 'info');
        });
    }

    // Toggle Switch Functionality
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.notification-item, .privacy-item, .alert-item, .cookie-item')?.querySelector('h4')?.textContent;
            if (settingName) {
                showNotification(`${settingName} ${this.checked ? 'enabled' : 'disabled'}`, 'success');
            }
        });
    });

    // Form Validation
    const formInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error if invalid
        if (!isValid) {
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.25rem';
            errorElement.textContent = errorMessage;
            field.parentNode.appendChild(errorElement);
            field.style.borderColor = '#ef4444';
        } else {
            field.style.borderColor = '';
        }

        return isValid;
    }

    // Utility Functions
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        // Set background color based on type
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.background = colors[type] || colors.info;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Auto-save functionality
    let autoSaveTimeout;
    const autoSaveInputs = document.querySelectorAll('input, select, textarea');
    autoSaveInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                // Simulate auto-save
                console.log('Auto-saving...');
            }, 2000);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save all
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveAllSettingsBtn?.click();
        }
        
        // Escape to close modals (if any)
        if (e.key === 'Escape') {
            // Close any open modals
        }
    });

    // Performance monitoring
    const startTime = performance.now();
    window.addEventListener('load', function() {
        const loadTime = performance.now() - startTime;
        console.log(`Settings page loaded in ${loadTime.toFixed(2)}ms`);
    });
});
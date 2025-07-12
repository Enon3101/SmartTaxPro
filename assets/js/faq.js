// FAQ Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // FAQ data for search
    const faqData = [
        {
            question: 'What documents do I need for tax filing?',
            answer: 'You\'ll need Form 16 from your employer, bank statements, investment proofs (ELSS, PPF, etc.), rent receipts, medical bills, and any other income documents.',
            category: 'tax-filing',
            tags: ['documents', 'form 16', 'bank statements', 'investments']
        },
        {
            question: 'How long does tax filing take?',
            answer: 'With MyeCA.in, most users complete their tax filing in 15-30 minutes. The process includes document upload, automatic calculation, review, and e-filing.',
            category: 'tax-filing',
            tags: ['time', 'duration', 'process', 'filing']
        },
        {
            question: 'What if I miss the tax filing deadline?',
            answer: 'If you miss the deadline, you can still file a belated return. However, you may face penalties and interest charges.',
            category: 'tax-filing',
            tags: ['deadline', 'penalties', 'belated return', 'late filing']
        },
        {
            question: 'How do I track my tax refund?',
            answer: 'You can track your refund through our platform\'s dashboard, the Income Tax Department website, or the TDS CPC website.',
            category: 'tax-filing',
            tags: ['refund', 'tracking', 'dashboard', 'status']
        },
        {
            question: 'Who needs GST registration?',
            answer: 'GST registration is mandatory for businesses with annual turnover exceeding ₹20 lakhs (₹10 lakhs for special category states).',
            category: 'gst-services',
            tags: ['gst', 'registration', 'turnover', 'mandatory']
        },
        {
            question: 'How often do I need to file GST returns?',
            answer: 'Regular taxpayers file GSTR-1 (monthly/quarterly), GSTR-3B (monthly), and GSTR-9 (annually).',
            category: 'gst-services',
            tags: ['gst returns', 'frequency', 'gstr-1', 'gstr-3b']
        },
        {
            question: 'What are the penalties for late GST filing?',
            answer: 'Late filing attracts a penalty of ₹50 per day (₹20 for nil returns) and interest at 18% per annum on the tax amount.',
            category: 'gst-services',
            tags: ['penalties', 'late filing', 'interest', 'gst']
        },
        {
            question: 'Can I claim input tax credit?',
            answer: 'Yes, you can claim input tax credit on GST paid on purchases used for business purposes.',
            category: 'gst-services',
            tags: ['itc', 'input tax credit', 'gst', 'business']
        },
        {
            question: 'How do I change my subscription plan?',
            answer: 'You can upgrade or downgrade your plan anytime from your account dashboard. Changes take effect immediately.',
            category: 'account-billing',
            tags: ['subscription', 'plan', 'upgrade', 'downgrade']
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.',
            category: 'account-billing',
            tags: ['payment', 'cards', 'upi', 'digital wallets']
        },
        {
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes, you can cancel your subscription anytime from your account settings. We offer a 30-day money-back guarantee.',
            category: 'account-billing',
            tags: ['cancel', 'subscription', 'refund', 'money-back']
        },
        {
            question: 'How do I reset my password?',
            answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password.',
            category: 'account-billing',
            tags: ['password', 'reset', 'forgot password', 'security']
        },
        {
            question: 'What browsers are supported?',
            answer: 'We support Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. For the best experience, we recommend using the latest version of Chrome.',
            category: 'technical-support',
            tags: ['browsers', 'chrome', 'firefox', 'safari', 'edge']
        },
        {
            question: 'How do I upload documents?',
            answer: 'You can upload documents by dragging and dropping files or clicking the upload button. We support PDF, JPG, PNG, and DOC files up to 10MB each.',
            category: 'technical-support',
            tags: ['upload', 'documents', 'files', 'drag drop']
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes, we use bank-level 256-bit SSL encryption, ISO 27001 certified data centers, and regular security audits.',
            category: 'technical-support',
            tags: ['security', 'encryption', 'data protection', 'ssl']
        },
        {
            question: 'Can I use the platform on mobile?',
            answer: 'Yes, our platform is fully responsive and works perfectly on mobile devices. You can also download our mobile app.',
            category: 'technical-support',
            tags: ['mobile', 'responsive', 'app', 'smartphone']
        }
    ];

    // Search input functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length > 0) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });

        searchInput.addEventListener('focus', function() {
            if (this.value.length > 0) {
                showSearchSuggestions(this.value.toLowerCase());
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                hideSearchSuggestions();
            }
        });
    }

    // Search button functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }

    // Enter key to search
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }

    function showSearchSuggestions(query) {
        const filteredFAQs = faqData.filter(faq => 
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query) ||
            faq.tags.some(tag => tag.toLowerCase().includes(query))
        );

        if (filteredFAQs.length > 0) {
            const suggestionsHTML = filteredFAQs.slice(0, 5).map(faq => `
                <div class="suggestion-item" data-category="${faq.category}" data-question="${faq.question}">
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <path d="M8 4A4 4 0 1 0 8 12A4 4 0 1 0 8 4ZM8 6A2 2 0 1 1 8 10A2 2 0 1 1 8 6Z" fill="currentColor"/>
                    </svg>
                    <span>${highlightSearchTerm(faq.question, query)}</span>
                </div>
            `).join('');
            
            searchSuggestions.innerHTML = suggestionsHTML;
            searchSuggestions.style.display = 'block';
            
            // Add click handlers to suggestions
            const suggestionItems = searchSuggestions.querySelectorAll('.suggestion-item');
            suggestionItems.forEach(item => {
                item.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    const question = this.getAttribute('data-question');
                    searchInput.value = question;
                    hideSearchSuggestions();
                    scrollToFAQ(category, question);
                });
            });
        } else {
            searchSuggestions.innerHTML = `
                <div class="suggestion-item">
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <path d="M8 4A4 4 0 1 0 8 12A4 4 0 1 0 8 4ZM8 6A2 2 0 1 1 8 10A2 2 0 1 1 8 6Z" fill="currentColor"/>
                    </svg>
                    <span>No results found</span>
                </div>
            `;
            searchSuggestions.style.display = 'block';
        }
    }

    function highlightSearchTerm(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    function hideSearchSuggestions() {
        searchSuggestions.style.display = 'none';
    }

    function performSearch(query) {
        if (!query.trim()) return;
        
        const filteredFAQs = faqData.filter(faq => 
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase()) ||
            faq.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredFAQs.length > 0) {
            const firstResult = filteredFAQs[0];
            scrollToFAQ(firstResult.category, firstResult.question);
        } else {
            showNotification('No results found for your search query.', 'info');
        }
    }

    function scrollToFAQ(category, question) {
        const categoryElement = document.getElementById(category);
        if (categoryElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = categoryElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Highlight the specific question
            setTimeout(() => {
                const questionElements = categoryElement.querySelectorAll('.faq-question');
                questionElements.forEach(element => {
                    if (element.querySelector('span').textContent === question) {
                        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        element.setAttribute('aria-expanded', 'true');
                        setTimeout(() => {
                            element.style.backgroundColor = '';
                        }, 3000);
                    }
                });
            }, 500);
        }
    }

    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs in the same category
            const category = this.closest('.faq-category');
            const otherQuestions = category.querySelectorAll('.faq-question');
            otherQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // Support form functionality
    const supportForm = document.querySelector('.support-form');
    
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('supportName') || document.getElementById('supportName')?.value;
            const email = formData.get('supportEmail') || document.getElementById('supportEmail')?.value;
            const subject = formData.get('supportSubject') || document.getElementById('supportSubject')?.value;
            const message = formData.get('supportMessage') || document.getElementById('supportMessage')?.value;
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 2000);
        });
    }

    // Quick action card interactions
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact method interactions
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.querySelector('h3').textContent;
            
            if (methodType.includes('Email')) {
                window.location.href = 'mailto:support@myeca.in';
            } else if (methodType.includes('Phone')) {
                window.location.href = 'tel:+9118001234567';
            } else if (methodType.includes('Chat')) {
                showNotification('Live chat will open in a new window', 'info');
                // Simulate opening chat
                setTimeout(() => {
                    showNotification('Chat window opened', 'success');
                }, 1000);
            }
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
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
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Keyboard navigation for FAQ
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSearchSuggestions();
        }
    });

    // Performance monitoring
    const startTime = performance.now();
    window.addEventListener('load', function() {
        const loadTime = performance.now() - startTime;
        console.log(`FAQ page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Analytics tracking
    function trackEvent(eventName, eventData = {}) {
        console.log('Analytics Event:', eventName, eventData);
    }

    // Track search events
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                trackEvent('faq_search_input', { query: this.value });
            }
        });
    }

    // Track FAQ interactions
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const questionText = this.querySelector('span').textContent;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            trackEvent('faq_click', { 
                question: questionText, 
                action: isExpanded ? 'expand' : 'collapse' 
            });
        });
    });

    // Track category navigation
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            trackEvent('faq_category_click', { category });
        });
    });

    // Track form submissions
    if (supportForm) {
        supportForm.addEventListener('submit', function() {
            const subject = document.getElementById('supportSubject')?.value;
            trackEvent('support_form_submit', { subject });
        });
    }
});
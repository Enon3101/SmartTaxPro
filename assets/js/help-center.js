// Help Center JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionItems = document.querySelectorAll('.suggestion-item');

    // Sample help articles data
    const helpArticles = [
        {
            title: 'How to file income tax return',
            category: 'Filing Guides',
            content: 'Complete guide to filing your income tax return using MyeCA.in',
            tags: ['tax filing', 'income tax', 'return', 'guide']
        },
        {
            title: 'GST filing process',
            category: 'Filing Guides',
            content: 'Step-by-step process for GST filing and compliance',
            tags: ['gst', 'filing', 'compliance', 'process']
        },
        {
            title: 'Document upload guide',
            category: 'Getting Started',
            content: 'Learn how to upload and manage your documents securely',
            tags: ['documents', 'upload', 'security', 'guide']
        },
        {
            title: 'Creating your account',
            category: 'Getting Started',
            content: 'How to create and set up your MyeCA.in account',
            tags: ['account', 'setup', 'registration', 'create']
        },
        {
            title: 'Managing subscription',
            category: 'Account Management',
            content: 'How to manage your subscription and billing preferences',
            tags: ['subscription', 'billing', 'payment', 'manage']
        },
        {
            title: 'Security settings',
            category: 'Account Management',
            content: 'Configure your account security and privacy settings',
            tags: ['security', 'privacy', 'settings', 'configure']
        },
        {
            title: 'Login issues',
            category: 'Troubleshooting',
            content: 'Common login problems and their solutions',
            tags: ['login', 'problems', 'troubleshooting', 'issues']
        },
        {
            title: 'File upload problems',
            category: 'Troubleshooting',
            content: 'Resolve common file upload issues and errors',
            tags: ['upload', 'files', 'errors', 'problems']
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

    // Search suggestions functionality
    suggestionItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            searchInput.value = text;
            hideSearchSuggestions();
            performSearch(text);
        });
    });

    // Enter key to search
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }

    function showSearchSuggestions(query) {
        const filteredArticles = helpArticles.filter(article => 
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query) ||
            article.tags.some(tag => tag.toLowerCase().includes(query))
        );

        if (filteredArticles.length > 0) {
            const suggestionsHTML = filteredArticles.slice(0, 5).map(article => `
                <div class="suggestion-item">
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <path d="M8 4A4 4 0 1 0 8 12A4 4 0 1 0 8 4ZM8 6A2 2 0 1 1 8 10A2 2 0 1 1 8 6Z" fill="currentColor"/>
                    </svg>
                    <span>${article.title}</span>
                </div>
            `).join('');
            
            searchSuggestions.innerHTML = suggestionsHTML;
            searchSuggestions.style.display = 'block';
            
            // Reattach event listeners
            const newSuggestionItems = searchSuggestions.querySelectorAll('.suggestion-item');
            newSuggestionItems.forEach(item => {
                item.addEventListener('click', function() {
                    const text = this.querySelector('span').textContent;
                    searchInput.value = text;
                    hideSearchSuggestions();
                    performSearch(text);
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

    function hideSearchSuggestions() {
        searchSuggestions.style.display = 'none';
    }

    function performSearch(query) {
        if (!query.trim()) return;
        
        // Store search query in session storage for results page
        sessionStorage.setItem('searchQuery', query);
        
        // Redirect to search results page (or show results in modal)
        showSearchResults(query);
    }

    function showSearchResults(query) {
        const filteredArticles = helpArticles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        // Create and show results modal
        const modal = document.createElement('div');
        modal.className = 'search-results-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Search Results for "${query}"</h3>
                        <button class="modal-close" aria-label="Close modal">×</button>
                    </div>
                    <div class="modal-body">
                        ${filteredArticles.length > 0 ? `
                            <div class="search-results">
                                ${filteredArticles.map(article => `
                                    <div class="result-item">
                                        <div class="result-meta">
                                            <span class="result-category">${article.category}</span>
                                        </div>
                                        <h4>${article.title}</h4>
                                        <p>${article.content}</p>
                                        <div class="result-tags">
                                            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="no-results">
                                <svg width="64" height="64" viewBox="0 0 64 64">
                                    <path d="M32 4L36.472 22.472L56 24L40.5 38.528L44.944 58L32 48.472L19.056 58L23.5 38.528L8 24L27.528 22.472L32 4Z" fill="currentColor"/>
                                </svg>
                                <h4>No results found</h4>
                                <p>Try different keywords or browse our help categories.</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .search-results-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            .modal-content {
                background: var(--bg-white);
                border-radius: 12px;
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                z-index: 1;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
            }
            .modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-muted);
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            }
            .modal-close:hover {
                background: var(--bg-light);
            }
            .modal-body {
                padding: 1.5rem;
            }
            .search-results {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            .result-item {
                padding: 1.5rem;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                transition: all 0.3s ease;
            }
            .result-item:hover {
                border-color: var(--primary-color);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
            }
            .result-meta {
                margin-bottom: 0.75rem;
            }
            .result-category {
                background: rgba(59, 130, 246, 0.1);
                color: var(--primary-color);
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .result-item h4 {
                font-size: 1.1rem;
                font-weight: 600;
                margin: 0 0 0.5rem 0;
                color: var(--text-primary);
            }
            .result-item p {
                color: var(--text-secondary);
                line-height: 1.6;
                margin: 0 0 1rem 0;
            }
            .result-tags {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            .tag {
                background: var(--bg-light);
                color: var(--text-secondary);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
            }
            .no-results {
                text-align: center;
                padding: 3rem 1rem;
            }
            .no-results svg {
                color: var(--text-muted);
                margin-bottom: 1rem;
            }
            .no-results h4 {
                font-size: 1.25rem;
                font-weight: 600;
                margin: 0 0 0.5rem 0;
                color: var(--text-primary);
            }
            .no-results p {
                color: var(--text-secondary);
                margin: 0;
            }
            @media (max-width: 768px) {
                .modal-content {
                    margin: 1rem;
                }
            }
        `;
        document.head.appendChild(modalStyles);

        document.body.appendChild(modal);

        // Modal interactions
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
        });

        modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyles);
            }
        });

        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyles);
            }
        });
    }

    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
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

    // Category card interactions
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        const viewAllLink = card.querySelector('.view-all');
        const articleLinks = card.querySelectorAll('.article-link');
        
        if (viewAllLink) {
            viewAllLink.addEventListener('click', function(e) {
                e.preventDefault();
                const category = card.querySelector('h3').textContent;
                showCategoryArticles(category);
            });
        }
        
        articleLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const articleTitle = this.textContent;
                showArticleContent(articleTitle);
            });
        });
    });

    function showCategoryArticles(category) {
        const categoryArticles = helpArticles.filter(article => 
            article.category === category
        );
        
        const modal = document.createElement('div');
        modal.className = 'category-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${category} Articles</h3>
                        <button class="modal-close" aria-label="Close modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="category-articles-list">
                            ${categoryArticles.map(article => `
                                <div class="article-item">
                                    <h4>${article.title}</h4>
                                    <p>${article.content}</p>
                                    <div class="article-tags">
                                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                document.body.removeChild(modal);
            }
        });
    }

    function showArticleContent(articleTitle) {
        const article = helpArticles.find(a => a.title === articleTitle);
        
        if (!article) return;
        
        const modal = document.createElement('div');
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${article.title}</h3>
                        <button class="modal-close" aria-label="Close modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="article-category">${article.category}</span>
                            </div>
                            <p>${article.content}</p>
                            <div class="article-tags">
                                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                document.body.removeChild(modal);
            }
        });
    }

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

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // Performance monitoring
    const startTime = performance.now();
    window.addEventListener('load', function() {
        const loadTime = performance.now() - startTime;
        console.log(`Help center page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Analytics tracking
    function trackEvent(eventName, eventData = {}) {
        // Simulate analytics tracking
        console.log('Analytics Event:', eventName, eventData);
    }

    // Track search events
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                trackEvent('search_input', { query: this.value });
            }
        });
    }

    // Track FAQ interactions
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const questionText = this.querySelector('span').textContent;
            trackEvent('faq_click', { question: questionText });
        });
    });

    // Track article clicks
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.addEventListener('click', function() {
            const articleTitle = this.querySelector('h3 a').textContent;
            trackEvent('article_click', { title: articleTitle });
        });
    });
});
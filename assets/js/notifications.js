// Notifications JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize notifications components
    initFilters();
    initSearch();
    initActions();
    initModal();
    initNotificationItems();
    updateNotificationCounts();
    
    // Simulate real-time updates
    simulateNotifications();
});

// Filter Functionality
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const notificationItems = document.querySelectorAll('.notification-item');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter notifications
            filterNotifications(filter);
            
            // Update counts
            updateNotificationCounts();
        });
    });
}

function filterNotifications(filter) {
    const notificationItems = document.querySelectorAll('.notification-item');
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    let visibleCount = 0;
    
    notificationItems.forEach(item => {
        let shouldShow = false;
        
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'unread':
                shouldShow = item.classList.contains('unread');
                break;
            case 'filing':
                shouldShow = item.dataset.category === 'filing';
                break;
            case 'deadline':
                shouldShow = item.dataset.category === 'deadline';
                break;
            case 'system':
                shouldShow = item.dataset.category === 'system';
                break;
        }
        
        if (shouldShow) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        notificationsList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        notificationsList.style.display = 'block';
        emptyState.style.display = 'none';
    }
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('notificationSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            searchNotifications(query);
        });
        
        // Clear search on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                searchNotifications('');
            }
        });
    }
}

function searchNotifications(query) {
    const notificationItems = document.querySelectorAll('.notification-item');
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    let visibleCount = 0;
    
    notificationItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const content = item.querySelector('p').textContent.toLowerCase();
        const matches = title.includes(query) || content.includes(query);
        
        if (matches || query === '') {
            item.style.display = 'flex';
            visibleCount++;
            
            // Highlight search terms
            if (query !== '') {
                highlightSearchTerms(item, query);
            } else {
                removeHighlights(item);
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        notificationsList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        notificationsList.style.display = 'block';
        emptyState.style.display = 'none';
    }
}

function highlightSearchTerms(item, query) {
    const title = item.querySelector('h3');
    const content = item.querySelector('p');
    
    // Remove existing highlights
    removeHighlights(item);
    
    // Add highlights
    title.innerHTML = title.textContent.replace(
        new RegExp(query, 'gi'),
        match => `<mark style="background: rgba(59, 130, 246, 0.2); padding: 0.1rem 0.2rem; border-radius: 3px;">${match}</mark>`
    );
    
    content.innerHTML = content.textContent.replace(
        new RegExp(query, 'gi'),
        match => `<mark style="background: rgba(59, 130, 246, 0.2); padding: 0.1rem 0.2rem; border-radius: 3px;">${match}</mark>`
    );
}

function removeHighlights(item) {
    const title = item.querySelector('h3');
    const content = item.querySelector('p');
    
    title.innerHTML = title.textContent;
    content.innerHTML = content.textContent;
}

// Action Buttons
function initActions() {
    // Mark all as read
    const markAllReadBtn = document.getElementById('markAllRead');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllAsRead();
        });
    }
    
    // Clear all
    const clearAllBtn = document.getElementById('clearAll');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
                clearAllNotifications();
            }
        });
    }
    
    // Load more
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreNotifications();
        });
    }
}

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    
    unreadItems.forEach(item => {
        item.classList.remove('unread');
        
        // Add animation
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Update counts
    updateNotificationCounts();
    
    // Show success message
    showToast('All notifications marked as read', 'success');
}

function clearAllNotifications() {
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateX(100%)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.remove();
            }, 300);
        }, index * 50);
    });
    
    // Show empty state
    setTimeout(() => {
        const notificationsList = document.getElementById('notificationsList');
        const emptyState = document.getElementById('emptyState');
        
        notificationsList.style.display = 'none';
        emptyState.style.display = 'block';
        
        updateNotificationCounts();
        showToast('All notifications cleared', 'success');
    }, notificationItems.length * 50 + 300);
}

function loadMoreNotifications() {
    const loadMoreBtn = document.getElementById('loadMore');
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" fill="none"/></svg> Loading...';
    
    // Simulate loading
    setTimeout(() => {
        // Add more notifications
        addSampleNotifications();
        
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" fill="none"/></svg> Load More';
        
        updateNotificationCounts();
    }, 1000);
}

// Modal Management
function initModal() {
    const settingsBtn = document.getElementById('notificationSettings');
    const modal = document.getElementById('settingsModal');
    const closeBtn = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelSettings');
    const saveBtn = document.getElementById('saveSettings');
    
    // Open modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Save settings
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveNotificationSettings();
            closeModal();
            showToast('Settings saved successfully', 'success');
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function saveNotificationSettings() {
    const settings = {
        emailFiling: document.querySelector('input[type="checkbox"]').checked,
        emailDeadlines: document.querySelectorAll('input[type="checkbox"]')[1].checked,
        emailSystem: document.querySelectorAll('input[type="checkbox"]')[2].checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        digestFrequency: document.querySelector('.setting-select').value
    };
    
    // Save to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Request push notification permission if enabled
    if (settings.pushNotifications && 'Notification' in window) {
        Notification.requestPermission();
    }
}

// Notification Items
function initNotificationItems() {
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        // Mark as read on click
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.action-btn')) {
                markAsRead(this);
            }
        });
        
        // Action buttons
        const actionBtns = item.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const action = this.title.toLowerCase();
                if (action.includes('read')) {
                    markAsRead(item);
                } else if (action.includes('delete')) {
                    deleteNotification(item);
                }
            });
        });
    });
}

function markAsRead(item) {
    if (item.classList.contains('unread')) {
        item.classList.remove('unread');
        
        // Add animation
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 150);
        
        updateNotificationCounts();
    }
}

function deleteNotification(item) {
    item.style.transform = 'translateX(100%)';
    item.style.opacity = '0';
    
    setTimeout(() => {
        item.remove();
        updateNotificationCounts();
        
        // Check if list is empty
        const remainingItems = document.querySelectorAll('.notification-item');
        if (remainingItems.length === 0) {
            const notificationsList = document.getElementById('notificationsList');
            const emptyState = document.getElementById('emptyState');
            
            notificationsList.style.display = 'none';
            emptyState.style.display = 'block';
        }
    }, 300);
}

// Update Counts
function updateNotificationCounts() {
    const totalCount = document.querySelectorAll('.notification-item').length;
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const filingCount = document.querySelectorAll('.notification-item[data-category="filing"]').length;
    const deadlineCount = document.querySelectorAll('.notification-item[data-category="deadline"]').length;
    const systemCount = document.querySelectorAll('.notification-item[data-category="system"]').length;
    
    // Update tab counts
    const tabCounts = document.querySelectorAll('.tab-count');
    tabCounts[0].textContent = totalCount; // All
    tabCounts[1].textContent = unreadCount; // Unread
    tabCounts[2].textContent = filingCount; // Filing
    tabCounts[3].textContent = deadlineCount; // Deadlines
    tabCounts[4].textContent = systemCount; // System
}

// Simulate Real-time Notifications
function simulateNotifications() {
    setInterval(() => {
        // Random chance to add new notification
        if (Math.random() < 0.3) {
            addRandomNotification();
        }
    }, 30000); // Every 30 seconds
}

function addRandomNotification() {
    const notifications = [
        {
            category: 'filing',
            title: 'Document processed',
            message: 'Your Form 16 has been processed successfully',
            priority: 'medium',
            time: 'Just now'
        },
        {
            category: 'deadline',
            title: 'Deadline reminder',
            message: 'Don\'t forget to file your GST return by tomorrow',
            priority: 'high',
            time: '2 minutes ago'
        },
        {
            category: 'system',
            title: 'System update',
            message: 'New features have been added to your dashboard',
            priority: 'low',
            time: '5 minutes ago'
        }
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    addNotification(randomNotification);
}

function addNotification(notification) {
    const notificationsList = document.getElementById('notificationsList');
    
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item unread ${notification.category}`;
    notificationItem.dataset.category = notification.category;
    
    notificationItem.innerHTML = `
        <div class="notification-icon ${notification.category}">
            <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
        </div>
        <div class="notification-content">
            <div class="notification-header">
                <h3>${notification.title}</h3>
                <div class="notification-actions">
                    <button class="action-btn" title="Mark as read">
                        <svg width="14" height="14" viewBox="0 0 14 14">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                    <button class="action-btn" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 14 14">
                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                </div>
            </div>
            <p>${notification.message}</p>
            <div class="notification-meta">
                <span class="notification-time">${notification.time}</span>
                <span class="notification-priority ${notification.priority}">${notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority</span>
            </div>
        </div>
    `;
    
    // Add to top of list
    notificationsList.insertBefore(notificationItem, notificationsList.firstChild);
    
    // Add animation
    notificationItem.style.opacity = '0';
    notificationItem.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        notificationItem.style.transition = 'all 0.3s ease';
        notificationItem.style.opacity = '1';
        notificationItem.style.transform = 'translateY(0)';
    }, 100);
    
    // Initialize actions for new item
    initNotificationItems();
    updateNotificationCounts();
    
    // Show browser notification if enabled
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
            body: notification.message,
            icon: '/assets/images/logo.png'
        });
    }
}

function addSampleNotifications() {
    const sampleNotifications = [
        {
            category: 'filing',
            title: 'Tax calculation completed',
            message: 'Your tax liability has been calculated. Review and proceed with filing.',
            priority: 'medium',
            time: '1 hour ago'
        },
        {
            category: 'system',
            title: 'Profile verification',
            message: 'Your profile has been verified successfully.',
            priority: 'low',
            time: '2 hours ago'
        }
    ];
    
    sampleNotifications.forEach(notification => {
        addNotification(notification);
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.querySelector('div').style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.querySelector('div').style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Export Functions
window.notificationUtils = {
    filterNotifications,
    searchNotifications,
    markAllAsRead,
    clearAllNotifications,
    addNotification,
    showToast
};

// Performance Monitoring
function monitorNotificationPerformance() {
    // Monitor filter performance
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const startTime = performance.now();
            
            setTimeout(() => {
                const endTime = performance.now();
                console.log('Filter operation took:', endTime - startTime, 'ms');
            }, 0);
        });
    });
    
    // Monitor search performance
    const searchInput = document.getElementById('notificationSearch');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const startTime = performance.now();
                searchNotifications(this.value);
                const endTime = performance.now();
                console.log('Search operation took:', endTime - startTime, 'ms');
            }, 300);
        });
    }
}

// Initialize performance monitoring
monitorNotificationPerformance();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Notification error:', e.error);
    showToast('Something went wrong. Please refresh the page.', 'error');
});

// Accessibility Enhancements
function enhanceNotificationAccessibility() {
    // Add keyboard navigation for notification items
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Notification: ${item.querySelector('h3').textContent}`);
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add ARIA labels for action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.setAttribute('aria-label', btn.title);
    });
    
    // Add live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
    
    // Store reference for announcements
    window.notificationLiveRegion = liveRegion;
}

// Initialize accessibility enhancements
enhanceNotificationAccessibility();
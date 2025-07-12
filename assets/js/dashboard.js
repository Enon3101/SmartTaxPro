// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initUserMenu();
    initCharts();
    initChartControls();
    initNotifications();
    initQuickActions();
    updateDeadlineCountdowns();
    
    // Update countdowns every minute
    setInterval(updateDeadlineCountdowns, 60000);
});

// User Menu Toggle
function initUserMenu() {
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenuToggle && userMenu) {
        userMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target)) {
                userMenu.classList.remove('active');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                userMenu.classList.remove('active');
            }
        });
    }
}

// Initialize Charts
function initCharts() {
    const chartCanvas = document.getElementById('taxSavingsChart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    
    // Sample data for tax savings trend
    const chartData = {
        year: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000]
        },
        quarter: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            data: [45000, 85000, 120000, 165000]
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [8000, 12000, 15000, 18000]
        }
    };
    
    // Create chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.year.labels,
            datasets: [{
                label: 'Tax Savings (₹)',
                data: chartData.year.data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Tax Savings: ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '₹' + (value / 1000) + 'k';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
    // Store chart reference for period switching
    window.taxSavingsChart = chart;
    window.chartData = chartData;
}

// Chart Period Controls
function initChartControls() {
    const periodButtons = document.querySelectorAll('.chart-period');
    
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.dataset.period;
            
            // Update active button
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data
            updateChartPeriod(period);
        });
    });
}

// Update Chart Period
function updateChartPeriod(period) {
    const chart = window.taxSavingsChart;
    const chartData = window.chartData;
    
    if (!chart || !chartData) return;
    
    chart.data.labels = chartData[period].labels;
    chart.data.datasets[0].data = chartData[period].data;
    chart.update('active');
}

// Initialize Notifications
function initNotifications() {
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Mark as read
            this.classList.remove('unread');
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize Quick Actions
function initQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action');
    
    quickActions.forEach(action => {
        action.addEventListener('click', function(e) {
            // Add click feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Update Deadline Countdowns
function updateDeadlineCountdowns() {
    const deadlineItems = document.querySelectorAll('.deadline-item');
    
    deadlineItems.forEach(item => {
        const countdownElement = item.querySelector('.deadline-countdown span');
        if (!countdownElement) return;
        
        // Parse deadline date from data attribute or calculate from text
        const deadlineText = countdownElement.textContent;
        const daysMatch = deadlineText.match(/(\d+)\s*days?/);
        
        if (daysMatch) {
            let days = parseInt(daysMatch[1]);
            
            // Update countdown
            if (days > 0) {
                days--;
                countdownElement.textContent = days === 1 ? '1 day' : days + ' days';
                
                // Update urgency styling
                if (days <= 7) {
                    item.classList.add('urgent');
                } else {
                    item.classList.remove('urgent');
                }
            } else {
                countdownElement.textContent = 'Due today';
                item.classList.add('urgent');
            }
        }
    });
}

// Real-time Updates Simulation
function simulateRealTimeUpdates() {
    // Simulate new notifications
    setInterval(() => {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;
        
        const notifications = [
            {
                title: 'Document processed',
                message: 'Your Form 16 has been processed successfully',
                time: 'Just now'
            },
            {
                title: 'Tax calculation updated',
                message: 'Your estimated tax liability has been recalculated',
                time: '2 minutes ago'
            },
            {
                title: 'Deadline reminder',
                message: 'Don\'t forget to file your GST return by tomorrow',
                time: '5 minutes ago'
            }
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        
        // Create new notification element
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item unread';
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </div>
            <div class="notification-content">
                <h4>${randomNotification.title}</h4>
                <p>${randomNotification.message}</p>
                <span class="notification-time">${randomNotification.time}</span>
            </div>
        `;
        
        // Add to top of list
        notificationList.insertBefore(notificationItem, notificationList.firstChild);
        
        // Remove old notifications if too many
        const allNotifications = notificationList.querySelectorAll('.notification-item');
        if (allNotifications.length > 5) {
            allNotifications[allNotifications.length - 1].remove();
        }
        
        // Add animation
        notificationItem.style.opacity = '0';
        notificationItem.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            notificationItem.style.transition = 'all 0.3s ease';
            notificationItem.style.opacity = '1';
            notificationItem.style.transform = 'translateY(0)';
        }, 100);
        
    }, 30000); // Every 30 seconds
}

// Export Functions
window.dashboardUtils = {
    updateChartPeriod,
    updateDeadlineCountdowns,
    simulateRealTimeUpdates
};

// Performance Monitoring
function monitorDashboardPerformance() {
    // Monitor chart rendering performance
    const chartCanvas = document.getElementById('taxSavingsChart');
    if (chartCanvas) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('chart')) {
                    console.log('Chart render time:', entry.duration);
                }
            }
        });
        observer.observe({ entryTypes: ['measure'] });
    }
    
    // Monitor scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Debounced scroll handling
        }, 16); // ~60fps
    });
}

// Initialize performance monitoring
monitorDashboardPerformance();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Dashboard error:', e.error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <div style="background: #fee; border: 1px solid #fcc; padding: 1rem; margin: 1rem 0; border-radius: 8px; color: #c33;">
            <strong>Something went wrong</strong><br>
            Please refresh the page or contact support if the problem persists.
        </div>
    `;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(errorMessage, mainContent.firstChild);
    }
});

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add keyboard navigation for quick actions
    const quickActions = document.querySelectorAll('.quick-action');
    quickActions.forEach((action, index) => {
        action.setAttribute('tabindex', '0');
        action.setAttribute('role', 'button');
        action.setAttribute('aria-label', action.querySelector('span').textContent);
        
        action.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add ARIA labels for chart controls
    const chartPeriods = document.querySelectorAll('.chart-period');
    chartPeriods.forEach(period => {
        period.setAttribute('aria-label', `View ${period.textContent} data`);
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
    window.liveRegion = liveRegion;
}

// Initialize accessibility enhancements
enhanceAccessibility();

// Service Worker Registration (if available)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

// Offline Detection
window.addEventListener('online', function() {
    // Show online status
    showStatusMessage('You are back online', 'success');
});

window.addEventListener('offline', function() {
    // Show offline status
    showStatusMessage('You are currently offline', 'warning');
});

function showStatusMessage(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message ${type}`;
    statusDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            background: ${type === 'success' ? '#22c55e' : '#f59e0b'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        statusDiv.remove();
    }, 3000);
}
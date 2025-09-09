// Information Hub JavaScript
class InformationHub {
    constructor() {
        this.savedResources = [];
        this.userInterests = ['anxiety', 'depression', 'sleep'];
        this.quotes = [];
        this.tips = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMockData();
        this.loadUserGoals();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-tab')) {
                const section = e.target.dataset.section;
                if (section === 'home') {
                    window.location.href = 'index.html';
                } else if (section === 'challenger') {
                    window.location.href = 'challenge.html';
                } else if (section === 'support') {
                    window.location.href = 'support.html';
                } else if (section === 'rewards') {
                    window.location.href = 'rewards.html';
                } else if (section === 'information') {
                    window.location.href = 'information.html';
                }
            }
        });

        // Quote actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('#newQuoteBtn')) {
                this.getNewQuote();
            }
            if (e.target.matches('#saveQuoteBtn')) {
                this.saveCurrentQuote();
            }
        });

        // Learning tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.learning-tab')) {
                this.switchLearningTab(e.target.dataset.category);
            }
        });

        // Resource actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.resource-btn.primary')) {
                this.openResource(e.target);
            }
            if (e.target.matches('.resource-btn.secondary')) {
                this.saveResource(e.target);
            }
        });

        // Interest tags
        document.addEventListener('change', (e) => {
            if (e.target.matches('.interest-tag input[type="checkbox"]')) {
                this.updateInterests();
            }
        });

        // Settings
        document.addEventListener('click', (e) => {
            if (e.target.matches('.save-settings-btn')) {
                this.saveSettings();
            }
        });
    }

    loadMockData() {
        this.quotes = [
            {
                text: "Progress, not perfection, is the key to lasting change. Every small step you take today brings you closer to your goals.",
                author: "MindLink AI"
            },
            {
                text: "You are stronger than you know, more resilient than you believe, and more capable than you imagine.",
                author: "MindLink AI"
            },
            {
                text: "Self-care is not selfish. It's essential for your wellbeing and your ability to care for others.",
                author: "MindLink AI"
            },
            {
                text: "Every challenge you face is an opportunity to grow stronger and wiser.",
                author: "MindLink AI"
            },
            {
                text: "Your mental health is just as important as your physical health. Treat it with the same care and attention.",
                author: "MindLink AI"
            },
            {
                text: "Small daily improvements lead to remarkable long-term results.",
                author: "MindLink AI"
            }
        ];

        this.tips = {
            'sleep': [
                {
                    icon: '🌱',
                    title: 'Sleep Better',
                    content: 'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. Repeat 4 times before bed.'
                },
                {
                    icon: '🌙',
                    title: 'Sleep Better',
                    content: 'Keep your bedroom cool (65-68°F) and completely dark for optimal sleep quality.'
                },
                {
                    icon: '📱',
                    title: 'Sleep Better',
                    content: 'Avoid screens 1 hour before bed. The blue light disrupts your natural sleep cycle.'
                }
            ],
            'screen': [
                {
                    icon: '📱',
                    title: 'Reduce Screen Time',
                    content: 'Set a phone-free hour before bed. Use this time for reading, journaling, or gentle stretching.'
                },
                {
                    icon: '⏰',
                    title: 'Reduce Screen Time',
                    content: 'Use app timers to limit social media usage. Start with 30 minutes per day.'
                },
                {
                    icon: '🚶',
                    title: 'Reduce Screen Time',
                    content: 'Replace screen time with physical activities like walking, reading, or hobbies.'
                }
            ],
            'walk': [
                {
                    icon: '🚶',
                    title: 'Walk Daily',
                    content: 'Start with just 5 minutes. Even a short walk can boost your mood and energy levels.'
                },
                {
                    icon: '🌅',
                    title: 'Walk Daily',
                    content: 'Try a morning walk to get natural sunlight and set a positive tone for your day.'
                },
                {
                    icon: '👥',
                    title: 'Walk Daily',
                    content: 'Invite a friend or family member to join you. Social walking is more enjoyable and motivating.'
                }
            ]
        };
    }

    loadUserGoals() {
        // Load user goals from localStorage or use defaults
        const savedGoals = localStorage.getItem('userGoals');
        if (savedGoals) {
            this.userGoals = JSON.parse(savedGoals);
        } else {
            this.userGoals = ['Sleep better', 'Reduce screen time', 'Walk daily'];
        }
        
        this.updateTips();
    }

    updateTips() {
        const tipsList = document.getElementById('tipsList');
        if (!tipsList) return;

        const tipsToShow = [];
        
        // Get tips based on user goals
        this.userGoals.forEach(goal => {
            const goalKey = goal.toLowerCase().replace(' ', '');
            if (this.tips[goalKey]) {
                tipsToShow.push(...this.tips[goalKey].slice(0, 1)); // Take first tip for each goal
            }
        });

        // Fill with default tips if not enough
        if (tipsToShow.length < 3) {
            const defaultTips = [
                { icon: '💡', title: 'General Tip', content: 'Take three deep breaths whenever you feel stressed or overwhelmed.' },
                { icon: '🤗', title: 'Self-Compassion', content: 'Be kind to yourself. You\'re doing the best you can with what you have.' },
                { icon: '🎯', title: 'Goal Setting', content: 'Break large goals into smaller, manageable steps you can accomplish daily.' }
            ];
            tipsToShow.push(...defaultTips.slice(0, 3 - tipsToShow.length));
        }

        tipsList.innerHTML = tipsToShow.slice(0, 3).map(tip => `
            <div class="tip-item">
                <div class="tip-icon">${tip.icon}</div>
                <div class="tip-content">
                    <h4>${tip.title}</h4>
                    <p>${tip.content}</p>
                </div>
            </div>
        `).join('');
    }

    getNewQuote() {
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        document.getElementById('dailyQuote').textContent = `"${randomQuote.text}"`;
        document.getElementById('quoteAuthor').textContent = `- ${randomQuote.author}`;
        
        // Add animation
        const quoteElement = document.getElementById('dailyQuote');
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.style.opacity = '1';
        }, 100);
    }

    saveCurrentQuote() {
        const quoteText = document.getElementById('dailyQuote').textContent;
        const quoteAuthor = document.getElementById('quoteAuthor').textContent;
        
        // Save to localStorage
        const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');
        savedQuotes.push({
            text: quoteText,
            author: quoteAuthor,
            date: new Date().toISOString()
        });
        localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
        
        // Show confirmation
        const btn = document.getElementById('saveQuoteBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Saved!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }

    switchLearningTab(category) {
        // Update tab buttons
        document.querySelectorAll('.learning-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Show/hide content
        document.querySelectorAll('.resources-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${category}Tab`).classList.add('active');
    }

    openResource(button) {
        const resourceCard = button.closest('.resource-card');
        const title = resourceCard.querySelector('h3').textContent;
        
        // Simulate opening resource
        alert(`Opening: ${title}\n\nThis would open the full article, video, or study in a new tab or modal.`);
    }

    saveResource(button) {
        const resourceCard = button.closest('.resource-card');
        const title = resourceCard.querySelector('h3').textContent;
        const type = resourceCard.querySelector('.resource-type').textContent;
        
        // Add to saved resources
        this.savedResources.push({
            title: title,
            type: type,
            date: new Date().toISOString()
        });
        
        // Update display
        this.updateSavedResources();
        
        // Show confirmation
        const originalText = button.textContent;
        button.textContent = 'Saved!';
        button.style.background = 'var(--success)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }

    updateSavedResources() {
        const container = document.getElementById('savedResources');
        
        if (this.savedResources.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No saved resources yet</h3>
                    <p>Start exploring and save resources that interest you!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.savedResources.map(resource => `
            <div class="saved-resource-card">
                <div class="saved-resource-info">
                    <h4>${resource.title}</h4>
                    <span class="saved-resource-type">${resource.type}</span>
                </div>
                <div class="saved-resource-actions">
                    <button class="saved-resource-btn">Open</button>
                    <button class="saved-resource-btn remove" onclick="this.removeResource('${resource.title}')">Remove</button>
                </div>
            </div>
        `).join('');
    }

    updateInterests() {
        const checkboxes = document.querySelectorAll('.interest-tag input[type="checkbox"]:checked');
        this.userInterests = Array.from(checkboxes).map(cb => cb.value);
        
        // Update content based on new interests
        this.updateTips();
    }

    saveSettings() {
        const settings = {
            interests: this.userInterests,
            dailyQuoteNotif: document.getElementById('dailyQuoteNotif').checked,
            weeklyDigest: document.getElementById('weeklyDigest').checked,
            newContent: document.getElementById('newContent').checked
        };
        
        localStorage.setItem('informationSettings', JSON.stringify(settings));
        
        // Show confirmation
        const btn = document.querySelector('.save-settings-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Settings Saved!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }

    updateDisplay() {
        // Load saved resources
        const saved = localStorage.getItem('savedResources');
        if (saved) {
            this.savedResources = JSON.parse(saved);
        }
        this.updateSavedResources();
        
        // Load settings
        const settings = localStorage.getItem('informationSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.userInterests = parsed.interests || this.userInterests;
            
            // Update checkboxes
            document.querySelectorAll('.interest-tag input[type="checkbox"]').forEach(cb => {
                cb.checked = this.userInterests.includes(cb.value);
            });
            
            document.getElementById('dailyQuoteNotif').checked = parsed.dailyQuoteNotif;
            document.getElementById('weeklyDigest').checked = parsed.weeklyDigest;
            document.getElementById('newContent').checked = parsed.newContent;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new InformationHub();
});

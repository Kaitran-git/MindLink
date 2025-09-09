// Mental Health Challenge App
// State management, day libraries, and interactive components

class MentalHealthChallenge {
    constructor() {
        this.state = this.loadState();
        this.isDemoMode = this.checkDemoMode();
        this.currentTimer = null;
        this.timerInterval = null;
        this.init();
    }

    // Initialize the app
    init() {
        this.setupEventListeners();
        this.handlePageLoad();
    }

    // Check if demo mode is enabled (force demo for this project)
    checkDemoMode() {
        return true;
    }

    // Load state from localStorage
    loadState() {
        const defaultState = {
            programLength: null,
            startDate: null,
            completedDays: 0,
            lastCompletionDate: null,
            days: [],
            affirmations: []
        };

        try {
            const saved = localStorage.getItem('mentalHealthChallenge');
            return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
        } catch (error) {
            console.warn('Could not load state from localStorage:', error);
            return defaultState;
        }
    }

    // Save state to localStorage
    saveState() {
        try {
            localStorage.setItem('mentalHealthChallenge', JSON.stringify(this.state));
        } catch (error) {
            console.warn('Could not save state to localStorage:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Program selection buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.start-button[data-program]') || e.target.matches('.cta-button[data-program]')) {
                const programLength = parseInt(e.target.dataset.program);
                this.startProgram(programLength);
            }
        });

        // Skip challenge button (demo only)
        document.addEventListener('click', (e) => {
            if (e.target.matches('#skipChallengeBtn')) {
                this.skipToChallenge();
            }
        });

        // Navigation tabs
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

        // Back button (legacy support)
        document.addEventListener('click', (e) => {
            if (e.target.matches('#backButton') || e.target.closest('#backButton')) {
                window.location.href = 'index.html';
            }
        });

        // Fast forward button (demo mode)
        document.addEventListener('click', (e) => {
            if (e.target.matches('#fastForwardBtn')) {
                this.fastForwardDay();
            }
        });

        // Complete day button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#completeDayBtn')) {
                this.completeDay();
            }
        });

        // Timer controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('.timer-btn')) {
                const action = e.target.dataset.action;
                this.handleTimerAction(action);
            }
        });

        // Journal input
        document.addEventListener('input', (e) => {
            if (e.target.matches('.journal-textarea')) {
                this.updateJournalCounter();
                this.checkCompletionStatus();
            }
        });

        // Checklist items
        document.addEventListener('change', (e) => {
            if (e.target.matches('.checklist-checkbox')) {
                this.updateChecklistItem(e.target);
                this.checkCompletionStatus();
            }
        });

        // Resource buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.resource-btn')) {
                const resource = e.target.dataset.resource;
                this.showResource(resource);
            }
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.matches('#modalClose') || e.target.matches('.modal')) {
                this.closeModal();
            }
        });

        // Restart and share buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('#restartBtn')) {
                this.restartChallenge();
            }
            if (e.target.matches('#shareBtn')) {
                this.shareBadge();
            }
        });
    }

    // Handle page load
    handlePageLoad() {
        if (window.location.pathname.includes('challenge.html')) {
            // Ensure a default demo state exists when landing directly
            if (!this.state.programLength) {
                this.state = {
                    programLength: 7,
                    startDate: new Date().toISOString().split('T')[0],
                    completedDays: 0,
                    lastCompletionDate: null,
                    days: this.initializeDays(7),
                    affirmations: []
                };
                this.saveState();
            }
            this.loadChallengePage();
        } else {
            this.loadHomePage();
        }
    }

    // Load home page
    loadHomePage() {
        // Show demo mode indicator since demo is always on
        if (this.isDemoMode) {
            const demoIndicator = document.createElement('div');
            demoIndicator.className = 'demo-indicator';
            demoIndicator.innerHTML = '<span class="demo-pill">Demo Mode Active</span>';
            document.querySelector('.hero') && document.querySelector('.hero').appendChild(demoIndicator);
        }
        this.updateSkipButton();
    }

    // Load challenge page
    loadChallengePage() {
        this.updateProgressDisplay();
        this.loadCurrentDay();
        this.setupDemoMode();
        this.updateSkipButton();
    }

    // Start a new program
    startProgram(programLength) {
        if (this.state.programLength && this.state.completedDays > 0) {
            if (!confirm('Starting a new program will reset your current progress. Are you sure?')) {
                return;
            }
        }

        this.state = {
            programLength,
            startDate: new Date().toISOString().split('T')[0],
            completedDays: 0,
            lastCompletionDate: null,
            days: this.initializeDays(programLength),
            affirmations: []
        };

        this.saveState();
        
        // Show challenge interface and hide program selection
        const programSelection = document.getElementById('programSelection');
        const challengeInterface = document.getElementById('challengeInterface');
        
        if (programSelection && challengeInterface) {
            programSelection.style.display = 'none';
            challengeInterface.style.display = 'block';
            this.loadChallengePage();
        } else {
            // Fallback: redirect to challenge page
            window.location.href = 'challenge.html';
        }
    }

    // Initialize days for a program
    initializeDays(programLength) {
        const allDays = this.getDayLibrary();
        const days = [];
        
        for (let i = 0; i < programLength; i++) {
            const dayData = allDays[i];
            days.push({
                id: i + 1,
                status: i === 0 ? 'available' : 'locked',
                responses: {},
                ...dayData
            });
        }
        
        return days;
    }

    // Get day library
    getDayLibrary() {
        return [
            // 7-Day Program
            {
                title: "Breathe & Reset",
                goal: "Take 5 minutes to focus on your breathing",
                type: "timer",
                min: 5,
                why: "Calm your nervous system and reduce stress",
                description: "Find a comfortable position and focus on slow, deep breathing for 5 minutes."
            },
            {
                title: "Gratitude x3",
                goal: "Write down 3 things you're grateful for",
                type: "journal",
                min: 1,
                why: "Shift your attention to positive aspects of life",
                description: "Take a moment to reflect and write about three things you're grateful for today."
            },
            {
                title: "30-Min Unplug",
                goal: "Take a 30-minute break from all devices",
                type: "timer",
                min: 30,
                why: "Reduce digital overload and mental fatigue",
                description: "Put away all devices and spend 30 minutes doing something offline."
            },
            {
                title: "Mindful Walk",
                goal: "Take a walk and notice your surroundings",
                type: "checklist",
                min: 1,
                why: "Ground yourself in the present moment",
                description: "Go for a walk and use the checklist to notice what's around you.",
                checklistItems: [
                    "I noticed something I can see",
                    "I noticed something I can hear", 
                    "I noticed something I can smell",
                    "I noticed a thought that came up"
                ]
            },
            {
                title: "Reach Out",
                goal: "Connect with someone important to you",
                type: "journal",
                min: 1,
                why: "Build social support and connection",
                description: "Reach out to someone you care about and reflect on the experience.",
                placeholder: "Who did you contact? How did you feel after connecting with them?"
            },
            {
                title: "5-4-3-2-1 Grounding",
                goal: "Use the 5-4-3-2-1 technique to ground yourself",
                type: "checklist",
                min: 1,
                why: "Powerful tool for managing anxiety and overwhelm",
                description: "Use this technique to ground yourself in the present moment.",
                checklistItems: [
                    "Name 5 things you can see",
                    "Name 4 things you can touch",
                    "Name 3 things you can hear",
                    "Name 2 things you can smell",
                    "Name 1 thing you can taste"
                ]
            },
            {
                title: "Weekly Reflection",
                goal: "Reflect on your week and what you've learned",
                type: "journal",
                min: 1,
                why: "Consolidate new habits and insights",
                description: "Take time to reflect on your week and what you've learned about yourself.",
                placeholder: "What helped you most this week? What would you like to keep doing?"
            },

            // 15-Day Program (days 8-15)
            {
                title: "Sleep Wind-Down",
                goal: "Choose 2 activities to prepare for better sleep",
                type: "checklist",
                min: 1,
                why: "Improve sleep quality and mental recovery",
                description: "Select two activities to help you wind down before bed.",
                checklistItems: [
                    "Dim the lights 1 hour before bed",
                    "No screens 30 minutes before bed",
                    "Light stretching or gentle movement",
                    "Write 3 lines in a journal"
                ]
            },
            {
                title: "Move 10 Minutes",
                goal: "Get your body moving for at least 10 minutes",
                type: "timer",
                min: 10,
                why: "Boost mood and energy through movement",
                description: "Do any form of movement that feels good to you for 10 minutes."
            },
            {
                title: "Kindness Note",
                goal: "Send a kind message to someone",
                type: "journal",
                min: 1,
                why: "Spread positivity and strengthen relationships",
                description: "Send a kind message to someone and reflect on the experience.",
                placeholder: "Who did you send a kind message to? How did it make you feel?"
            },
            {
                title: "Curate Home Screen",
                goal: "Remove 3 notifications or distracting apps",
                type: "checklist",
                min: 1,
                why: "Reduce digital distractions and improve focus",
                description: "Clean up your phone's home screen to reduce distractions.",
                checklistItems: [
                    "Remove 1 notification",
                    "Remove 1 distracting app",
                    "Remove 1 social media app",
                    "Organize remaining apps"
                ]
            },
            {
                title: "Solo Hobby 15m",
                goal: "Spend 15 minutes on a hobby you enjoy",
                type: "journal",
                min: 1,
                why: "Nurture personal interests and creativity",
                description: "Dedicate 15 minutes to a hobby or activity you enjoy doing alone.",
                placeholder: "What hobby did you engage with? How did it make you feel?"
            },
            {
                title: "Values Mini-List",
                goal: "Identify 3 core values and plan one action",
                type: "journal",
                min: 1,
                why: "Connect with what matters most to you",
                description: "Reflect on your core values and plan a small action aligned with them.",
                placeholder: "List 3 values that are important to you. What's one small action you can take this week that aligns with these values?"
            },
            {
                title: "Nature Glance",
                goal: "Spend 5 minutes connecting with nature",
                type: "timer",
                min: 5,
                why: "Reduce stress and improve mental clarity",
                description: "Spend 5 minutes outside or by a window, simply observing nature.",
                placeholder: "What did you notice in nature today?"
            },
            {
                title: "Two-Week Reflection",
                goal: "Reflect on your progress and choose one habit to continue",
                type: "journal",
                min: 1,
                why: "Consolidate learning and plan for the future",
                description: "Look back on your two weeks and decide what to carry forward.",
                placeholder: "What have you learned about yourself? Which habit would you like to continue?"
            },

            // 30-Day Program (days 16-30)
            {
                title: "Focus Block (20m)",
                goal: "Work on one task for 20 minutes without interruption",
                type: "timer",
                min: 20,
                why: "Improve concentration and reduce multitasking",
                description: "Choose one important task and focus on it for 20 minutes without any distractions."
            },
            {
                title: "News Diet",
                goal: "Set one specific time window for news consumption",
                type: "checklist",
                min: 1,
                why: "Reduce information overload and anxiety",
                description: "Create boundaries around when and how you consume news.",
                checklistItems: [
                    "Choose one 30-minute window for news",
                    "Turn off news notifications",
                    "Avoid news outside this window",
                    "Stick to this schedule for the day"
                ]
            },
            {
                title: "Body Scan (8m)",
                goal: "Do an 8-minute body scan meditation",
                type: "timer",
                min: 8,
                why: "Increase body awareness and reduce tension",
                description: "Spend 8 minutes doing a body scan meditation, noticing sensations throughout your body.",
                placeholder: "How relaxed do you feel now? (1-10)"
            },
            {
                title: "Creative Prompt",
                goal: "Create something small using a creative prompt",
                type: "journal",
                min: 1,
                why: "Express yourself and boost creativity",
                description: "Use a creative prompt to make something small - draw, write, or record.",
                placeholder: "What did you create? How did the creative process make you feel?"
            },
            {
                title: "Digital Boundaries (24h)",
                goal: "Choose one app to avoid for 24 hours",
                type: "checklist",
                min: 1,
                why: "Practice healthy digital habits",
                description: "Select one app to avoid for 24 hours and reflect on the experience.",
                checklistItems: [
                    "Choose one app to avoid",
                    "Delete the app temporarily",
                    "Notice how you feel without it",
                    "Reflect on the experience"
                ]
            },
            {
                title: "Connection Challenge",
                goal: "Make a meaningful connection with someone",
                type: "checklist",
                min: 1,
                why: "Strengthen relationships and social support",
                description: "Reach out to someone in a meaningful way - invite them to something, join a group, or call a relative.",
                checklistItems: [
                    "Invite someone to do something",
                    "Join a club or event",
                    "Call a family member",
                    "Make a new acquaintance"
                ]
            },
            {
                title: "Breathing Upgrade (Box 4×4×4×4)",
                goal: "Practice box breathing for 4 minutes",
                type: "timer",
                min: 4,
                why: "Advanced breathing technique for stress management",
                description: "Practice box breathing: 4 seconds in, 4 seconds hold, 4 seconds out, 4 seconds hold. Repeat for 4 minutes."
            },
            {
                title: "Affirmations",
                goal: "Write 3 personal affirmations and save them",
                type: "journal",
                min: 1,
                why: "Build positive self-talk and confidence",
                description: "Write three personal affirmations that resonate with you. These will be saved and displayed randomly.",
                placeholder: "Write 3 affirmations that feel true and empowering to you:"
            },
            {
                title: "Gratitude Remix",
                goal: "Find gratitude in a difficult situation",
                type: "journal",
                min: 1,
                why: "Build resilience and perspective",
                description: "Think of something difficult from today and find one thing to be grateful for about it.",
                placeholder: "What was difficult today? What did it teach you or how did it help you grow?"
            },
            {
                title: "Mindful Meal",
                goal: "Eat one meal without your phone",
                type: "checklist",
                min: 1,
                why: "Practice mindful eating and presence",
                description: "Choose one meal to eat without any devices, focusing on taste and texture.",
                checklistItems: [
                    "Put phone away during meal",
                    "Notice the taste of each bite",
                    "Pay attention to texture",
                    "Eat slowly and mindfully"
                ]
            },
            {
                title: "Room Reset (10m)",
                goal: "Spend 10 minutes organizing your space",
                type: "timer",
                min: 10,
                why: "Create a calm, organized environment",
                description: "Spend 10 minutes tidying up your desk, bed, or floor area.",
                checklistItems: [
                    "Clear desk surface",
                    "Make bed",
                    "Pick up items from floor",
                    "Organize one drawer or shelf"
                ]
            },
            {
                title: "Learning Bite (15m)",
                goal: "Learn something new for 15 minutes",
                type: "timer",
                min: 15,
                why: "Stimulate your mind and build curiosity",
                description: "Spend 15 minutes learning something new - read, watch, or practice.",
                placeholder: "What did you learn today? How did it make you feel?"
            },
            {
                title: "Kindness IRL",
                goal: "Do something kind for someone in person",
                type: "journal",
                min: 1,
                why: "Spread kindness and build community",
                description: "Do something kind for someone you encounter in person today.",
                placeholder: "What kind act did you do? How did the person react? How did it make you feel?"
            },
            {
                title: "Plan Ahead (Next Week)",
                goal: "Plan self-care, connection, and boundaries for next week",
                type: "checklist",
                min: 1,
                why: "Proactively plan for your wellbeing",
                description: "Plan specific actions for next week to maintain your mental health.",
                checklistItems: [
                    "Schedule 1 self-care block",
                    "Plan 1 social connection",
                    "Set 1 digital boundary",
                    "Choose 1 habit to continue"
                ]
            },
            {
                title: "Month Reflection & Badge",
                goal: "Reflect on your month and celebrate your achievement",
                type: "journal",
                min: 1,
                why: "Celebrate progress and plan for the future",
                description: "Reflect on your 30-day journey and celebrate your commitment to mental health.",
                placeholder: "What was your biggest insight this month? What habits will you continue? How do you feel about completing this challenge?"
            }
        ];
    }

    // Update progress display
    updateProgressDisplay() {
        const programBadge = document.getElementById('programBadge');
        const progressFill = document.getElementById('progressFill');
        const progressCircles = document.getElementById('progressCircles');

        if (programBadge) {
            programBadge.textContent = `Day ${this.state.completedDays + 1} of ${this.state.programLength}`;
        }

        if (progressFill) {
            const progress = (this.state.completedDays / this.state.programLength) * 100;
            progressFill.style.width = `${progress}%`;
        }

        if (progressCircles) {
            progressCircles.innerHTML = '';
            for (let i = 1; i <= this.state.programLength; i++) {
                const circle = document.createElement('div');
                circle.className = 'progress-circle';
                circle.textContent = i;
                
                if (i <= this.state.completedDays) {
                    circle.classList.add('completed');
                } else if (i === this.state.completedDays + 1) {
                    circle.classList.add('current');
                }
                
                progressCircles.appendChild(circle);
            }
        }
    }

    // Load current day
    loadCurrentDay() {
        const currentDay = this.getCurrentDay();
        
        if (!currentDay) {
            this.showCompletionScreen();
            return;
        }

        if (currentDay.status === 'locked') {
            this.showLockedDay();
            return;
        }

        this.showTask(currentDay);
    }

    // Get current day
    getCurrentDay() {
        const today = new Date().toISOString().split('T')[0];
        const startDate = new Date(this.state.startDate);
        const daysSinceStart = Math.floor((new Date(today) - startDate) / (1000 * 60 * 60 * 24));
        
        // Check if we can unlock a new day
        if (this.state.completedDays < this.state.programLength) {
            const nextDayIndex = this.state.completedDays;
            const day = this.state.days[nextDayIndex];
            
            if (this.isDemoMode || daysSinceStart >= this.state.completedDays) {
                day.status = 'available';
            } else {
                day.status = 'locked';
            }
        }

        return this.state.days[this.state.completedDays] || null;
    }

    // Show task
    showTask(day) {
        const taskContainer = document.getElementById('taskContainer');
        const lockedDay = document.getElementById('lockedDay');
        const completionScreen = document.getElementById('completionScreen');

        taskContainer.style.display = 'block';
        lockedDay.style.display = 'none';
        completionScreen.style.display = 'none';

        taskContainer.innerHTML = this.renderTask(day);
        this.checkCompletionStatus();
    }

    // Render task
    renderTask(day) {
        const timeText = day.type === 'timer' ? `${day.min} minutes` : 
                        day.type === 'journal' ? '5-10 minutes' : '5-15 minutes';
        
        return `
            <div class="task-header">
                <h2 class="task-title">${day.title}</h2>
                <p class="task-why">${day.why}</p>
                <div class="task-meta">
                    <span class="task-time">${timeText}</span>
                    <span class="task-type">${day.type}</span>
                </div>
            </div>
            
            <div class="interactive-container">
                ${this.renderInteractiveComponent(day)}
            </div>
            
            <button class="complete-day-btn" id="completeDayBtn" disabled>
                Complete Day
            </button>
        `;
    }

    // Render interactive component
    renderInteractiveComponent(day) {
        switch (day.type) {
            case 'timer':
                return this.renderTimerComponent(day);
            case 'journal':
                return this.renderJournalComponent(day);
            case 'checklist':
                return this.renderChecklistComponent(day);
            default:
                return '<p>Unknown task type</p>';
        }
    }

    // Render timer component
    renderTimerComponent(day) {
        return `
            <div class="timer-component">
                <div class="timer-display" id="timerDisplay">00:00</div>
                <div class="timer-controls">
                    <button class="timer-btn" data-action="start">Start</button>
                    <button class="timer-btn secondary" data-action="pause" disabled>Pause</button>
                    <button class="timer-btn secondary" data-action="reset" disabled>Reset</button>
                </div>
                <p style="margin-top: 1rem; color: var(--text-medium);">${day.description}</p>
            </div>
        `;
    }

    // Render journal component
    renderJournalComponent(day) {
        return `
            <div class="journal-component">
                <p style="margin-bottom: 1rem; color: var(--text-medium);">${day.description}</p>
                <textarea 
                    class="journal-textarea" 
                    placeholder="${day.placeholder || 'Share your thoughts...'}"
                    rows="6"
                ></textarea>
                <div class="journal-counter">
                    <span id="charCount">0</span> characters
                </div>
            </div>
        `;
    }

    // Render checklist component
    renderChecklistComponent(day) {
        const items = day.checklistItems || [];
        const itemsHtml = items.map((item, index) => `
            <div class="checklist-item">
                <input type="checkbox" class="checklist-checkbox" id="item-${index}" data-index="${index}">
                <label for="item-${index}" class="checklist-label">${item}</label>
                ${item.includes('Name') ? `<input type="text" class="checklist-input" placeholder="Your answer..." style="display: none;">` : ''}
            </div>
        `).join('');

        return `
            <div class="checklist-component">
                <p style="margin-bottom: 1rem; color: var(--text-medium);">${day.description}</p>
                ${itemsHtml}
            </div>
        `;
    }

    // Show locked day
    showLockedDay() {
        const taskContainer = document.getElementById('taskContainer');
        const lockedDay = document.getElementById('lockedDay');
        const lockedMessage = document.getElementById('lockedMessage');

        taskContainer.style.display = 'none';
        lockedDay.style.display = 'block';

        const nextDay = this.state.completedDays + 1;
        lockedMessage.textContent = `Come back tomorrow to unlock Day ${nextDay}.`;
    }

    // Show completion screen
    showCompletionScreen() {
        const taskContainer = document.getElementById('taskContainer');
        const lockedDay = document.getElementById('lockedDay');
        const completionScreen = document.getElementById('completionScreen');
        const completionMessage = document.getElementById('completionMessage');
        const badgeDisplay = document.getElementById('badgeDisplay');

        taskContainer.style.display = 'none';
        lockedDay.style.display = 'none';
        completionScreen.style.display = 'block';

        completionMessage.textContent = `You finished ${this.state.programLength} days!`;
        badgeDisplay.innerHTML = this.generateBadge();
        
        this.showConfetti();
    }

    // Generate completion badge
    generateBadge() {
        return `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                <h3 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Challenge Complete!</h3>
                <p style="color: var(--text-medium);">${this.state.programLength}-Day Mental Health Challenge</p>
                <p style="color: var(--text-medium); font-size: 0.9rem;">Completed on ${new Date().toLocaleDateString()}</p>
            </div>
        `;
    }

    // Show confetti animation
    showConfetti() {
        const confetti = document.getElementById('confetti');
        confetti.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${['#4A90E2', '#66BB6A', '#B39DDB'][Math.floor(Math.random() * 3)]};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
                border-radius: 50%;
            `;
            confetti.appendChild(particle);
        }

        // Add confetti animation CSS
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confetti-fall {
                    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup demo mode
    setupDemoMode() {
        const demoMode = document.getElementById('demoMode');
        if (this.isDemoMode && demoMode) {
            demoMode.style.display = 'flex';
        }
    }

    // Fast forward day (demo mode)
    fastForwardDay() {
        if (!this.isDemoMode) return;
        
        // Simulate completing the current day
        this.state.completedDays++;
        this.state.lastCompletionDate = new Date().toISOString().split('T')[0];
        
        // Unlock next day
        if (this.state.completedDays < this.state.programLength) {
            this.state.days[this.state.completedDays].status = 'available';
        }
        
        this.saveState();
        this.updateProgressDisplay();
        this.loadCurrentDay();
    }

    // Handle timer actions
    handleTimerAction(action) {
        const timerDisplay = document.getElementById('timerDisplay');
        const startBtn = document.querySelector('[data-action="start"]');
        const pauseBtn = document.querySelector('[data-action="pause"]');
        const resetBtn = document.querySelector('[data-action="reset"]');

        switch (action) {
            case 'start':
                this.startTimer();
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                resetBtn.disabled = false;
                break;
            case 'pause':
                this.pauseTimer();
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                break;
            case 'reset':
                this.resetTimer();
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                resetBtn.disabled = true;
                break;
        }
    }

    // Start timer
    startTimer() {
        if (this.timerInterval) return;
        
        this.timerInterval = setInterval(() => {
            this.currentTimer++;
            this.updateTimerDisplay();
            this.checkTimerCompletion();
        }, 1000);
    }

    // Pause timer
    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Reset timer
    resetTimer() {
        this.pauseTimer();
        this.currentTimer = 0;
        this.updateTimerDisplay();
    }

    // Update timer display
    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            const minutes = Math.floor(this.currentTimer / 60);
            const seconds = this.currentTimer % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Check timer completion
    checkTimerCompletion() {
        const currentDay = this.getCurrentDay();
        if (currentDay && currentDay.type === 'timer' && this.currentTimer >= currentDay.min * 60) {
            this.checkCompletionStatus();
        }
    }

    // Update journal counter
    updateJournalCounter() {
        const textarea = document.querySelector('.journal-textarea');
        const counter = document.getElementById('charCount');
        
        if (textarea && counter) {
            const charCount = textarea.value.length;
            counter.textContent = charCount;
        }
    }

    // Update checklist item
    updateChecklistItem(checkbox) {
        const item = checkbox.closest('.checklist-item');
        const input = item.querySelector('.checklist-input');
        
        if (checkbox.checked) {
            item.classList.add('completed');
            if (input) {
                input.style.display = 'block';
                input.required = true;
            }
        } else {
            item.classList.remove('completed');
            if (input) {
                input.style.display = 'none';
                input.required = false;
                input.value = '';
            }
        }
    }

    // Check completion status
    checkCompletionStatus() {
        const currentDay = this.getCurrentDay();
        if (!currentDay) return;

        let isComplete = false;

        switch (currentDay.type) {
            case 'timer':
                isComplete = this.currentTimer >= currentDay.min * 60;
                break;
            case 'journal':
                const textarea = document.querySelector('.journal-textarea');
                isComplete = textarea && textarea.value.trim().length > 0;
                break;
            case 'checklist':
                const checkboxes = document.querySelectorAll('.checklist-checkbox');
                isComplete = Array.from(checkboxes).some(cb => cb.checked);
                break;
        }

        const completeBtn = document.getElementById('completeDayBtn');
        if (completeBtn) {
            completeBtn.disabled = !isComplete;
        }
    }

    // Complete day
    completeDay() {
        const currentDay = this.getCurrentDay();
        if (!currentDay) return;

        // Save responses
        this.saveDayResponses(currentDay);

        // Mark day as completed
        currentDay.status = 'done';
        this.state.completedDays++;
        this.state.lastCompletionDate = new Date().toISOString().split('T')[0];

        // Save affirmations if this is the affirmations day
        if (currentDay.title === 'Affirmations') {
            this.saveAffirmations();
        }

        this.saveState();
        this.updateProgressDisplay();

        // Show completion animation
        this.showDayCompletion();

        // Load next day or completion screen
        setTimeout(() => {
            this.loadCurrentDay();
        }, 2000);
    }

    // Save day responses
    saveDayResponses(day) {
        const responses = {};

        switch (day.type) {
            case 'journal':
                const textarea = document.querySelector('.journal-textarea');
                if (textarea) {
                    responses.content = textarea.value;
                }
                break;
            case 'checklist':
                const checkboxes = document.querySelectorAll('.checklist-checkbox');
                const inputs = document.querySelectorAll('.checklist-input');
                
                checkboxes.forEach((cb, index) => {
                    if (cb.checked) {
                        responses[`item_${index}`] = true;
                        const input = inputs[index];
                        if (input && input.value) {
                            responses[`item_${index}_response`] = input.value;
                        }
                    }
                });
                break;
            case 'timer':
                responses.duration = this.currentTimer;
                responses.completed = true;
                break;
        }

        day.responses = responses;
    }

    // Save affirmations
    saveAffirmations() {
        const textarea = document.querySelector('.journal-textarea');
        if (textarea) {
            const content = textarea.value;
            const affirmations = content.split('\n').filter(line => line.trim().length > 0);
            this.state.affirmations = affirmations;
        }
    }

    // Show day completion animation
    showDayCompletion() {
        const completeBtn = document.getElementById('completeDayBtn');
        if (completeBtn) {
            completeBtn.textContent = '✓ Completed!';
            completeBtn.style.background = 'var(--success)';
        }
    }

    // Show resource modal
    showResource(resource) {
        const modal = document.getElementById('resourceModal');
        const modalBody = document.getElementById('modalBody');

        let content = '';
        switch (resource) {
            case 'breathing':
                content = `
                    <h3>Breathing Exercise</h3>
                    <p>Try the 4-7-8 breathing technique:</p>
                    <ol>
                        <li>Breathe in for 4 counts</li>
                        <li>Hold for 7 counts</li>
                        <li>Breathe out for 8 counts</li>
                        <li>Repeat 3-4 times</li>
                    </ol>
                `;
                break;
            case 'grounding':
                content = `
                    <h3>5-4-3-2-1 Grounding Technique</h3>
                    <p>When feeling overwhelmed, use your senses to ground yourself:</p>
                    <ol>
                        <li><strong>5 things you can see</strong> - Look around and name 5 things you can see</li>
                        <li><strong>4 things you can touch</strong> - Name 4 things you can feel with your hands</li>
                        <li><strong>3 things you can hear</strong> - Listen and identify 3 sounds around you</li>
                        <li><strong>2 things you can smell</strong> - Notice 2 different scents</li>
                        <li><strong>1 thing you can taste</strong> - Focus on 1 taste in your mouth</li>
                    </ol>
                `;
                break;
            case 'affirmation':
                content = `
                    <h3>Positive Affirmations</h3>
                    <p>Repeat these affirmations to yourself:</p>
                    <ul>
                        <li>"I am worthy of love and happiness"</li>
                        <li>"I have the strength to handle whatever comes my way"</li>
                        <li>"I am growing and learning every day"</li>
                        <li>"I deserve to take care of myself"</li>
                        <li>"I am enough, just as I am"</li>
                    </ul>
                `;
                break;
        }

        modalBody.innerHTML = content;
        modal.classList.add('show');
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('resourceModal');
        modal.classList.remove('show');
    }

    // Restart challenge
    restartChallenge() {
        if (confirm('Are you sure you want to start a new challenge? This will reset your current progress.')) {
            this.state = {
                programLength: null,
                startDate: null,
                completedDays: 0,
                lastCompletionDate: null,
                days: [],
                affirmations: []
            };
            this.saveState();
            window.location.href = 'index.html';
        }
    }

    // Share badge
    shareBadge() {
        const badgeText = `I just completed the ${this.state.programLength}-Day Mental Health Challenge! 🏆 #MentalHealthChallenge`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mental Health Challenge Complete!',
                text: badgeText,
                url: window.location.origin
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(badgeText).then(() => {
                alert('Badge text copied to clipboard!');
            });
        }
    }

    // Update skip button text and tooltip based on current page
    updateSkipButton() {
        const skipBtn = document.getElementById('skipChallengeBtn');
        if (skipBtn) {
            if (window.location.pathname.includes('challenge.html')) {
                skipBtn.textContent = 'Back to Home';
                skipBtn.title = 'Demo: Go back to homepage';
            } else {
                skipBtn.textContent = 'Skip Challenge';
                skipBtn.title = 'Demo: Skip to challenge page';
            }
        }
    }

    // Skip to challenge (demo only)
    skipToChallenge() {
        // On challenge page - go back to homepage
        if (window.location.pathname.includes('challenge.html')) {
            window.location.href = 'index.html';
            return;
        }
        // On homepage - start a 7-day program and go to challenge page
        if (confirm('Skip to challenge page? (This will start a demo 7-day program)')) {
            this.state = {
                programLength: 7,
                startDate: new Date().toISOString().split('T')[0],
                completedDays: 0,
                lastCompletionDate: null,
                days: this.initializeDays(7),
                affirmations: []
            };
            this.saveState();
            window.location.href = 'challenge.html';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MentalHealthChallenge();
});

// Add some additional CSS for animations
const additionalStyles = `
    .demo-indicator {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
    }
    
    .task-container {
        animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .progress-circle {
        transition: all 0.3s ease;
    }
    
    .progress-circle.completed {
        animation: pulse 0.6s ease-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Rewards System JavaScript
class RewardsSystem {
    constructor() {
        this.currentStreaks = {
            daily: 7,
            weekly: 2,
            monthly: 1
        };
        this.hearts = 3;
        this.avatar = {
            name: "My Avatar",
            clothes: [],
            accessories: [],
            background: null,
            expression: "😊"
        };
        this.missions = [];
        this.achievements = [];
        this.completedMissions = new Set();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMockData();
        this.loadMissions();
        this.loadAvatarItems();
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
                }
            }
        });

        // Mission completion
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mission-btn')) {
                this.completeMission(e.target.dataset.missionId);
            }
        });

        // Avatar customization
        document.addEventListener('click', (e) => {
            if (e.target.matches('.customization-tab')) {
                this.switchCustomizationTab(e.target.dataset.category);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.avatar-item')) {
                this.selectAvatarItem(e.target.dataset.itemId, e.target.dataset.category);
            }
        });

        // Heart usage
        document.addEventListener('click', (e) => {
            if (e.target.matches('.use-heart-btn')) {
                this.useHeart();
            }
        });

        // Avatar name change
        document.addEventListener('input', (e) => {
            if (e.target.matches('#avatarNameInput')) {
                this.updateAvatarName(e.target.value);
            }
        });
    }

    loadMockData() {
        this.missions = [
            {
                id: 1,
                title: "Breathe Deeply",
                description: "Take 3 minutes to breathe deeply and relax",
                duration: "3 minutes",
                points: 10,
                type: "breathing",
                completed: false
            },
            {
                id: 2,
                title: "Meditation",
                description: "Do a 5 minute meditation session",
                duration: "5 minutes",
                points: 15,
                type: "meditation",
                completed: false
            },
            {
                id: 3,
                title: "Give Compliments",
                description: "Give 2 genuine compliments today",
                duration: "Throughout day",
                points: 20,
                type: "social",
                completed: false
            },
            {
                id: 4,
                title: "Gratitude Journal",
                description: "Write down 1 thing you're grateful for",
                duration: "2 minutes",
                points: 10,
                type: "journaling",
                completed: true
            },
            {
                id: 5,
                title: "Listen to Music",
                description: "Listen to 1 of your favorite upbeat songs",
                duration: "3-4 minutes",
                points: 5,
                type: "music",
                completed: false
            },
            {
                id: 6,
                title: "Take a Walk",
                description: "Go for a 10 minute walk outside",
                duration: "10 minutes",
                points: 25,
                type: "exercise",
                completed: false
            }
        ];

        this.avatarItems = {
            clothes: [
                { id: 'shirt1', name: 'Blue T-Shirt', emoji: '👕', unlocked: true, points: 0 },
                { id: 'shirt2', name: 'Purple Hoodie', emoji: '👚', unlocked: false, points: 50 },
                { id: 'dress1', name: 'Sunny Dress', emoji: '👗', unlocked: false, points: 75 },
                { id: 'jacket1', name: 'Denim Jacket', emoji: '🧥', unlocked: false, points: 100 }
            ],
            accessories: [
                { id: 'glasses1', name: 'Cool Glasses', emoji: '🕶️', unlocked: true, points: 0 },
                { id: 'hat1', name: 'Baseball Cap', emoji: '🧢', unlocked: false, points: 30 },
                { id: 'watch1', name: 'Smart Watch', emoji: '⌚', unlocked: false, points: 60 },
                { id: 'necklace1', name: 'Peace Necklace', emoji: '📿', unlocked: false, points: 40 }
            ],
            backgrounds: [
                { id: 'bg1', name: 'Sunny Day', emoji: '☀️', unlocked: true, points: 0 },
                { id: 'bg2', name: 'Mountain View', emoji: '🏔️', unlocked: false, points: 80 },
                { id: 'bg3', name: 'Ocean Waves', emoji: '🌊', unlocked: false, points: 90 },
                { id: 'bg4', name: 'Forest Path', emoji: '🌲', unlocked: false, points: 70 }
            ],
            expressions: [
                { id: 'happy', name: 'Happy', emoji: '😊', unlocked: true, points: 0 },
                { id: 'excited', name: 'Excited', emoji: '🤩', unlocked: false, points: 25 },
                { id: 'peaceful', name: 'Peaceful', emoji: '😌', unlocked: false, points: 35 },
                { id: 'confident', name: 'Confident', emoji: '😎', unlocked: false, points: 45 }
            ]
        };

        this.achievements = [
            {
                id: 1,
                title: "First Week",
                description: "Complete 7 days in a row",
                icon: "🔥",
                unlocked: true,
                progress: 7,
                target: 7
            },
            {
                id: 2,
                title: "Heart Saver",
                description: "Use a heart to protect your streak",
                icon: "💖",
                unlocked: true,
                progress: 1,
                target: 1
            },
            {
                id: 3,
                title: "Mission Master",
                description: "Complete 50 missions total",
                icon: "🎯",
                unlocked: false,
                progress: 45,
                target: 50
            },
            {
                id: 4,
                title: "Streak King",
                description: "Maintain a 30-day streak",
                icon: "👑",
                unlocked: false,
                progress: 7,
                target: 30
            }
        ];
    }

    loadMissions() {
        const container = document.getElementById('missionsGrid');
        container.innerHTML = this.missions.map(mission => `
            <div class="mission-card ${mission.completed ? 'completed' : ''}" data-mission-id="${mission.id}">
                <div class="mission-header">
                    <h4>${mission.title}</h4>
                    <span class="mission-points">+${mission.points} pts</span>
                </div>
                <p class="mission-description">${mission.description}</p>
                <div class="mission-meta">
                    <span class="mission-duration">⏱️ ${mission.duration}</span>
                    <span class="mission-type">${this.getMissionTypeIcon(mission.type)} ${mission.type}</span>
                </div>
                <button class="mission-btn ${mission.completed ? 'completed' : ''}" 
                        data-mission-id="${mission.id}"
                        ${mission.completed ? 'disabled' : ''}>
                    ${mission.completed ? '✓ Completed' : 'Complete Mission'}
                </button>
            </div>
        `).join('');
    }

    getMissionTypeIcon(type) {
        const icons = {
            breathing: '🫁',
            meditation: '🧘',
            social: '👥',
            journaling: '📝',
            music: '🎵',
            exercise: '🚶'
        };
        return icons[type] || '⭐';
    }

    completeMission(missionId) {
        const mission = this.missions.find(m => m.id == missionId);
        if (mission && !mission.completed) {
            mission.completed = true;
            this.completedMissions.add(missionId);
            
            // Update display
            this.loadMissions();
            this.updateStreaks();
            this.checkAchievements();
            this.updateDisplay();
            
            // Show completion animation
            this.showCompletionAnimation(mission);
        }
    }

    showCompletionAnimation(mission) {
        // Create floating points animation
        const pointsElement = document.createElement('div');
        pointsElement.className = 'floating-points';
        pointsElement.textContent = `+${mission.points} pts`;
        pointsElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-purple);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 1000;
            animation: floatUp 2s ease-out forwards;
        `;
        
        document.body.appendChild(pointsElement);
        
        setTimeout(() => {
            document.body.removeChild(pointsElement);
        }, 2000);
    }

    updateStreaks() {
        // Simulate streak updates based on completed missions
        const todayMissions = this.missions.filter(m => m.completed).length;
        if (todayMissions >= 3) {
            this.currentStreaks.daily++;
        }
        
        // Update weekly and monthly streaks based on daily
        if (this.currentStreaks.daily % 7 === 0) {
            this.currentStreaks.weekly++;
        }
        if (this.currentStreaks.daily % 30 === 0) {
            this.currentStreaks.monthly++;
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.progress >= achievement.target) {
                achievement.unlocked = true;
                this.showAchievementUnlocked(achievement);
            }
        });
    }

    showAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-icon">${achievement.icon}</div>
                <h3>Achievement Unlocked!</h3>
                <p>${achievement.title}</p>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-purple);
            color: white;
            padding: 20px;
            border-radius: 15px;
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    loadAvatarItems() {
        this.switchCustomizationTab('clothes');
    }

    switchCustomizationTab(category) {
        // Update tab buttons
        document.querySelectorAll('.customization-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Load items for category
        const container = document.getElementById('itemsGrid');
        const items = this.avatarItems[category] || [];
        
        container.innerHTML = items.map(item => `
            <div class="avatar-item ${item.unlocked ? 'unlocked' : 'locked'}" 
                 data-item-id="${item.id}" 
                 data-category="${category}">
                <div class="item-emoji">${item.emoji}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-cost">${item.unlocked ? 'Owned' : `${item.points} pts`}</div>
            </div>
        `).join('');
    }

    selectAvatarItem(itemId, category) {
        const item = this.avatarItems[category].find(i => i.id === itemId);
        if (item && item.unlocked) {
            if (category === 'backgrounds') {
                this.avatar.background = item;
            } else if (category === 'expressions') {
                this.avatar.expression = item.emoji;
            } else {
                if (!this.avatar[category]) {
                    this.avatar[category] = [];
                }
                if (!this.avatar[category].includes(item)) {
                    this.avatar[category].push(item);
                }
            }
            this.updateAvatarDisplay();
        }
    }

    updateAvatarDisplay() {
        const preview = document.getElementById('avatarPreview');
        const accessories = document.getElementById('avatarAccessories');
        
        // Update avatar base
        const base = preview.querySelector('.avatar-base');
        base.textContent = this.avatar.expression;
        
        // Update accessories
        accessories.innerHTML = '';
        if (this.avatar.clothes.length > 0) {
            this.avatar.clothes.forEach(item => {
                const accessory = document.createElement('div');
                accessory.className = 'avatar-accessory';
                accessory.textContent = item.emoji;
                accessories.appendChild(accessory);
            });
        }
        if (this.avatar.accessories.length > 0) {
            this.avatar.accessories.forEach(item => {
                const accessory = document.createElement('div');
                accessory.className = 'avatar-accessory';
                accessory.textContent = item.emoji;
                accessories.appendChild(accessory);
            });
        }
    }

    updateAvatarName(name) {
        this.avatar.name = name;
    }

    useHeart() {
        if (this.hearts > 0) {
            this.hearts--;
            this.updateHeartsDisplay();
            alert('Heart used! Your streak is protected for today.');
        } else {
            alert('No hearts available! Complete missions to earn more hearts.');
        }
    }

    updateHeartsDisplay() {
        const container = document.getElementById('heartsContainer');
        container.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.className = `heart ${i < this.hearts ? '' : 'used'}`;
            heart.textContent = i < this.hearts ? '💖' : '💔';
            container.appendChild(heart);
        }
    }

    updateDisplay() {
        // Update streak displays
        document.getElementById('dailyStreak').textContent = `${this.currentStreaks.daily} days`;
        document.getElementById('weeklyStreak').textContent = `${this.currentStreaks.weekly} weeks`;
        document.getElementById('monthlyStreak').textContent = `${this.currentStreaks.monthly} month${this.currentStreaks.monthly > 1 ? 's' : ''}`;
        
        // Update hearts
        this.updateHeartsDisplay();
        
        // Update avatar
        this.updateAvatarDisplay();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(1.2);
        }
    }
    
    @keyframes slideIn {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .floating-points {
        pointer-events: none;
    }
    
    .achievement-notification {
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RewardsSystem();
});

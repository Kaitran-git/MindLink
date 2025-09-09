// Support System JavaScript
class SupportSystem {
    constructor() {
        this.currentLocation = null;
        this.events = [];
        this.therapists = [];
        this.supporters = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMockData();
        this.updateSkipButton();
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
                }
            }
        });

        // Location services
        document.addEventListener('click', (e) => {
            if (e.target.matches('#getLocationBtn')) {
                this.getCurrentLocation();
            }
        });

        // Event search
        document.addEventListener('click', (e) => {
            if (e.target.matches('#searchEventsBtn')) {
                this.searchEvents();
            }
        });

        // Therapy search
        document.addEventListener('click', (e) => {
            if (e.target.matches('#searchTherapyBtn')) {
                this.searchTherapy();
            }
        });

        // Invite supporters
        document.addEventListener('click', (e) => {
            if (e.target.matches('#sendInviteBtn')) {
                this.sendInvitation();
            }
        });

        // Guide buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.guide-btn')) {
                this.openGuide(e.target);
            }
        });

        // Event cards
        document.addEventListener('click', (e) => {
            if (e.target.matches('.event-card') || e.target.closest('.event-card')) {
                this.showEventDetails(e.target.closest('.event-card'));
            }
        });

        // Therapist cards
        document.addEventListener('click', (e) => {
            if (e.target.matches('.therapist-card') || e.target.closest('.therapist-card')) {
                this.showTherapistDetails(e.target.closest('.therapist-card'));
            }
        });
    }

    // Location Services
    getCurrentLocation() {
        const btn = document.getElementById('getLocationBtn');
        btn.textContent = '📍 Getting Location...';
        btn.disabled = true;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    document.getElementById('locationInput').value = 'Current Location';
                    btn.textContent = '📍 Location Found';
                    setTimeout(() => {
                        btn.textContent = '📍 Use Current Location';
                        btn.disabled = false;
                    }, 2000);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    btn.textContent = '📍 Location Error';
                    setTimeout(() => {
                        btn.textContent = '📍 Use Current Location';
                        btn.disabled = false;
                    }, 2000);
                }
            );
        } else {
            btn.textContent = '📍 Not Supported';
            setTimeout(() => {
                btn.textContent = '📍 Use Current Location';
                btn.disabled = false;
            }, 2000);
        }
    }

    // Event Search
    searchEvents() {
        const loading = document.getElementById('eventsLoading');
        const results = document.getElementById('eventsList');
        
        loading.style.display = 'block';
        results.innerHTML = '';

        // Simulate API call
        setTimeout(() => {
            const filters = this.getEventFilters();
            const filteredEvents = this.filterEvents(filters);
            this.displayEvents(filteredEvents);
            loading.style.display = 'none';
        }, 1500);
    }

    getEventFilters() {
        return {
            location: document.getElementById('locationInput').value,
            radius: document.getElementById('radiusSelect').value,
            ageRange: document.getElementById('ageRange').value,
            gender: document.getElementById('genderFilter').value,
            cost: document.getElementById('costFilter').value,
            interests: Array.from(document.querySelectorAll('.interest-tags input:checked')).map(cb => cb.value)
        };
    }

    filterEvents(filters) {
        return this.events.filter(event => {
            // Location filter (simplified)
            if (filters.location !== 'Current Location' && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            // Age range filter
            if (filters.ageRange !== 'all') {
                const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
                if (event.ageRange && (event.ageRange.min < minAge || event.ageRange.max > maxAge)) {
                    return false;
                }
            }

            // Gender filter
            if (filters.gender !== 'all' && event.gender !== filters.gender && event.gender !== 'mixed') {
                return false;
            }

            // Cost filter
            if (filters.cost !== 'all') {
                if (filters.cost === 'free' && event.cost > 0) return false;
                if (filters.cost === 'low' && event.cost > 20) return false;
                if (filters.cost === 'medium' && (event.cost < 20 || event.cost > 50)) return false;
                if (filters.cost === 'high' && event.cost < 50) return false;
            }

            // Interests filter
            if (filters.interests.length > 0) {
                const hasMatchingInterest = filters.interests.some(interest => 
                    event.interests.includes(interest)
                );
                if (!hasMatchingInterest) return false;
            }

            return true;
        });
    }

    displayEvents(events) {
        const container = document.getElementById('eventsList');
        
        if (events.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No events found</h3>
                    <p>Try adjusting your filters or expanding your search radius.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-header">
                    <h3>${event.title}</h3>
                    <span class="event-date">${event.date}</span>
                </div>
                <div class="event-details">
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span class="event-location">📍 ${event.location}</span>
                        <span class="event-cost">${event.cost === 0 ? 'Free' : `$${event.cost}`}</span>
                        <span class="event-attendees">👥 ${event.attendees} attending</span>
                    </div>
                    <div class="event-tags">
                        ${event.interests.map(interest => `<span class="tag">${interest}</span>`).join('')}
                    </div>
                </div>
                <div class="event-actions">
                    <button class="join-btn">Join Event</button>
                    <button class="info-btn">More Info</button>
                </div>
            </div>
        `).join('');
    }

    // Therapy Search
    searchTherapy() {
        const loading = document.getElementById('therapyLoading');
        const results = document.getElementById('therapistsList');
        
        loading.style.display = 'block';
        results.innerHTML = '';

        setTimeout(() => {
            const filters = this.getTherapyFilters();
            const filteredTherapists = this.filterTherapists(filters);
            this.displayTherapists(filteredTherapists);
            loading.style.display = 'none';
        }, 1500);
    }

    getTherapyFilters() {
        return {
            type: document.getElementById('therapyType').value,
            location: document.getElementById('therapyLocation').value,
            priceRange: document.getElementById('priceRange').value,
            specialties: Array.from(document.querySelectorAll('.specialty-tags input:checked')).map(cb => cb.value),
            availability: document.getElementById('availability').value,
            language: document.getElementById('language').value
        };
    }

    filterTherapists(filters) {
        return this.therapists.filter(therapist => {
            // Type filter
            if (filters.type !== 'all' && therapist.type !== filters.type) {
                return false;
            }

            // Location filter
            if (filters.location && !therapist.location.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }

            // Price filter
            if (filters.priceRange !== 'all') {
                if (filters.priceRange === 'sliding' && !therapist.slidingScale) return false;
                if (filters.priceRange === 'low' && therapist.pricePerSession > 50) return false;
                if (filters.priceRange === 'medium' && (therapist.pricePerSession < 50 || therapist.pricePerSession > 100)) return false;
                if (filters.priceRange === 'high' && therapist.pricePerSession < 100) return false;
                if (filters.priceRange === 'insurance' && !therapist.acceptsInsurance) return false;
            }

            // Specialties filter
            if (filters.specialties.length > 0) {
                const hasMatchingSpecialty = filters.specialties.some(specialty => 
                    therapist.specialties.includes(specialty)
                );
                if (!hasMatchingSpecialty) return false;
            }

            // Availability filter
            if (filters.availability !== 'all' && !therapist.availability.includes(filters.availability)) {
                return false;
            }

            // Language filter
            if (filters.language !== 'english' && !therapist.languages.includes(filters.language)) {
                return false;
            }

            return true;
        });
    }

    displayTherapists(therapists) {
        const container = document.getElementById('therapistsList');
        
        if (therapists.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No therapists found</h3>
                    <p>Try adjusting your filters or expanding your search area.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = therapists.map(therapist => `
            <div class="therapist-card" data-therapist-id="${therapist.id}">
                <div class="therapist-header">
                    <div class="therapist-avatar">${therapist.avatar}</div>
                    <div class="therapist-info">
                        <h3>${therapist.name}</h3>
                        <p class="therapist-title">${therapist.title}</p>
                        <div class="therapist-rating">
                            ${'★'.repeat(Math.floor(therapist.rating))}${'☆'.repeat(5 - Math.floor(therapist.rating))}
                            <span>${therapist.rating}/5 (${therapist.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <div class="therapist-details">
                    <p class="therapist-specialties">
                        <strong>Specialties:</strong> ${therapist.specialties.join(', ')}
                    </p>
                    <p class="therapist-location">📍 ${therapist.location}</p>
                    <p class="therapist-availability">⏰ ${therapist.availability.join(', ')}</p>
                    <div class="therapist-pricing">
                        <span class="price">$${therapist.pricePerSession}/session</span>
                        ${therapist.slidingScale ? '<span class="sliding-scale">Sliding scale available</span>' : ''}
                        ${therapist.acceptsInsurance ? '<span class="insurance">Insurance accepted</span>' : ''}
                    </div>
                </div>
                <div class="therapist-actions">
                    <button class="contact-btn">Contact</button>
                    <button class="book-btn">Book Session</button>
                </div>
            </div>
        `).join('');
    }

    // Invite Supporters
    sendInvitation() {
        const email = document.getElementById('inviteEmail').value;
        const relationship = document.getElementById('relationshipType').value;
        
        if (!email) {
            alert('Please enter an email address');
            return;
        }

        if (!this.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Simulate sending invitation
        const btn = document.getElementById('sendInviteBtn');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            alert(`Invitation sent to ${email}! They'll receive a guide on how to support you.`);
            document.getElementById('inviteEmail').value = '';
            btn.textContent = 'Send Invitation';
            btn.disabled = false;
            
            // Add to supporters list
            this.addSupporter(email, relationship);
        }, 1500);
    }

    addSupporter(email, relationship) {
        const supporter = {
            id: Date.now(),
            email: email,
            relationship: relationship,
            status: 'pending',
            joinedDate: new Date().toISOString()
        };
        
        this.supporters.push(supporter);
        this.updateSupportersList();
    }

    updateSupportersList() {
        const container = document.getElementById('supportersGrid');
        // This would update the supporters display
        // For now, we'll keep the static display
    }

    // Guide System
    openGuide(button) {
        const guideTitle = button.closest('.guide-card').querySelector('h4').textContent;
        alert(`Opening guide: ${guideTitle}\n\nThis would open a detailed guide with practical tips and resources.`);
    }

    // Event Details
    showEventDetails(eventCard) {
        const eventId = eventCard.dataset.eventId;
        const event = this.events.find(e => e.id == eventId);
        if (event) {
            alert(`Event Details:\n\n${event.title}\n\n${event.description}\n\nDate: ${event.date}\nLocation: ${event.location}\nCost: ${event.cost === 0 ? 'Free' : `$${event.cost}`}\n\nThis would open a detailed event page.`);
        }
    }

    // Therapist Details
    showTherapistDetails(therapistCard) {
        const therapistId = therapistCard.dataset.therapistId;
        const therapist = this.therapists.find(t => t.id == therapistId);
        if (therapist) {
            alert(`Therapist Profile:\n\n${therapist.name}\n${therapist.title}\n\nSpecialties: ${therapist.specialties.join(', ')}\nLocation: ${therapist.location}\nPrice: $${therapist.pricePerSession}/session\n\nThis would open a detailed therapist profile.`);
        }
    }

    // Utility Functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    updateSkipButton() {
        const skipBtn = document.getElementById('skipChallengeBtn');
        if (skipBtn) {
            skipBtn.textContent = 'Back to Home';
            skipBtn.title = 'Go back to homepage';
        }
    }

    // Mock Data
    loadMockData() {
        this.events = [
            {
                id: 1,
                title: "Mindfulness Meditation Group",
                description: "Join us for a weekly meditation session focused on stress reduction and mental clarity.",
                date: "Tomorrow, 7:00 PM",
                location: "Community Center, Downtown",
                cost: 0,
                attendees: 12,
                ageRange: { min: 18, max: 65 },
                gender: "mixed",
                interests: ["mental-health", "meditation"]
            },
            {
                id: 2,
                title: "Art Therapy Workshop",
                description: "Express yourself through creative art activities in a supportive group setting.",
                date: "Saturday, 2:00 PM",
                location: "Art Studio, Midtown",
                cost: 25,
                attendees: 8,
                ageRange: { min: 16, max: 50 },
                gender: "mixed",
                interests: ["art", "mental-health", "creativity"]
            },
            {
                id: 3,
                title: "Walking Group for Mental Health",
                description: "Gentle walking group that combines physical activity with peer support.",
                date: "Sunday, 9:00 AM",
                location: "Central Park",
                cost: 0,
                attendees: 15,
                ageRange: { min: 25, max: 70 },
                gender: "mixed",
                interests: ["fitness", "outdoor", "mental-health"]
            },
            {
                id: 4,
                title: "LGBTQ+ Support Circle",
                description: "Safe space for LGBTQ+ individuals to share experiences and build community.",
                date: "Friday, 6:30 PM",
                location: "Pride Center",
                cost: 0,
                attendees: 20,
                ageRange: { min: 18, max: 40 },
                gender: "mixed",
                interests: ["mental-health", "lgbtq", "support"]
            }
        ];

        this.therapists = [
            {
                id: 1,
                name: "Dr. Sarah Johnson",
                title: "Licensed Clinical Psychologist",
                avatar: "👩‍⚕️",
                rating: 4.8,
                reviews: 127,
                location: "Downtown Therapy Center",
                type: "individual",
                pricePerSession: 120,
                slidingScale: true,
                acceptsInsurance: true,
                specialties: ["anxiety", "depression", "trauma"],
                availability: ["morning", "afternoon"],
                languages: ["english", "spanish"]
            },
            {
                id: 2,
                name: "Michael Chen",
                title: "Licensed Marriage & Family Therapist",
                avatar: "👨‍⚕️",
                rating: 4.6,
                reviews: 89,
                location: "Family Wellness Center",
                type: "couples",
                pricePerSession: 150,
                slidingScale: false,
                acceptsInsurance: true,
                specialties: ["relationships", "couples", "family"],
                availability: ["evening", "weekend"],
                languages: ["english", "mandarin"]
            },
            {
                id: 3,
                name: "Dr. Maria Rodriguez",
                title: "Clinical Social Worker",
                avatar: "👩‍⚕️",
                rating: 4.9,
                reviews: 203,
                location: "Community Mental Health Center",
                type: "group",
                pricePerSession: 40,
                slidingScale: true,
                acceptsInsurance: true,
                specialties: ["anxiety", "depression", "grief", "lgbtq"],
                availability: ["morning", "afternoon", "evening"],
                languages: ["english", "spanish"]
            },
            {
                id: 4,
                name: "James Wilson",
                title: "Licensed Professional Counselor",
                avatar: "👨‍⚕️",
                rating: 4.7,
                reviews: 156,
                location: "Online Only",
                type: "online",
                pricePerSession: 80,
                slidingScale: true,
                acceptsInsurance: false,
                specialties: ["anxiety", "work", "addiction"],
                availability: ["morning", "afternoon", "evening", "weekend"],
                languages: ["english"]
            }
        ];
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SupportSystem();
});

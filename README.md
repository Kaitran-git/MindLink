# MindLink - Mental Health Companion

A comprehensive mobile-first mental health companion app featuring guided daily challenges, AI-powered support, community connections, gamification, and personalized learning resources. Users can choose 7, 15, or 30-day programs and complete one task per day, with each day unlocking only after a daily check-in, progressing from easy → moderate → harder tasks.

## 🌟 Features

### 🏠 Home Dashboard
- **Quick Stats Overview**: Track streaks, missions completed, hearts available, and achievements
- **Wellness Toolkit**: Interactive feature cards showcasing all app capabilities
- **Goals & Notifications**: Set personal goals and receive daily motivational reminders
- **Quick Actions**: One-click access to key features
- **AI Mental Health Coach**: 24/7 chat-based support with personalized guidance

### 🎯 Daily Challenges
- **Program Selection**: Choose between 7, 15, or 30-day challenges
- **Daily Locking**: Only one new day unlocks per calendar day (unless in demo mode)
- **Progress Tracking**: Visual progress bar and completion circles
- **Interactive Tasks**: Timer, journal, and checklist components
- **Task Types**:
  - **Timer Tasks**: Breathing exercises, digital detox, focus blocks
  - **Journal Tasks**: Gratitude practice, reflections, affirmations
  - **Checklist Tasks**: Grounding exercises, habit building, planning

### 👥 Support System
- **Local Clubs & Event Finder**: GPS-based discovery of nearby mental health events
  - Filter by age, gender, interest, location, and cost
  - Combat loneliness through in-person connections
- **Friends & Family Circle**: Invite loved ones to support your journey
  - Send support guides to family and friends
  - Build a personal support network
- **Therapy Access Directory**: Find professional mental health resources
  - Filter by price, location, and availability
  - Both one-on-one and group therapy options

### 🏆 Challenge & Rewards
- **Streak Tracking**: Daily, weekly, and monthly progress counters
- **Daily Missions**: Small, achievable tasks like:
  - 3 minutes of deep breathing
  - 5-minute meditation
  - Give 2 compliments today
  - Write down 1 thing you're grateful for
  - Listen to upbeat music
  - 10-minute walk
- **Avatar Building Mini Game**: Customize your character with unlocked items
  - Earn clothes, backgrounds, and accessories
  - Visual representation of your progress
- **Heart System**: Use hearts to protect your streak when you miss a day
- **Progress Analytics**: Detailed charts and visualizations
- **Achievements**: Unlock special badges for reaching milestones

### 📚 Information Hub
- **Daily Motivation**: Personalized quotes and tips based on your goals
- **AI-Personalized Learning**: Curated resources including:
  - 📄 **Articles**: Evidence-based mental health articles
  - 🔬 **Studies**: Latest research and scientific studies
  - 🎥 **Videos**: Educational videos and guided content
  - 🎧 **Podcasts**: Mental health podcasts and audio content
- **Personalization Settings**: Customize interests and notification preferences
- **Saved Resources**: Bookmark and organize your favorite content

### 🤖 AI Features
- **Mental Health Coach**: Chat-based support with:
  - Nabius API integration for intelligent responses
  - Mock fallback for offline functionality
  - CBT-style guidance and safety awareness
- **Goal-Based Notifications**: Daily motivational quotes tailored to your goals
- **Personalized Learning**: AI-curated content based on your interests

## 🎨 Design & User Experience

### Visual Design
- **Light Purple Theme**: Calming, professional color scheme
- **Custom Logo**: Integrated logo across all pages
- **Card-Based Layout**: Clean, organized interface
- **Interactive Elements**: Hover effects, animations, visual feedback
- **Mobile-First**: Responsive design for all screen sizes

### Accessibility Features
- Mobile-first responsive design
- Keyboard navigation support
- High contrast mode support
- Reduced motion support
- ARIA labels and focus states
- Touch targets ≥44px
- Screen reader compatibility

## 📁 File Structure

```
mental-health-challenge/
├── index.html              # Homepage with dashboard and quick actions
├── challenge.html          # Daily task screen with program selection
├── support.html            # Support System page
├── rewards.html            # Challenge & Rewards page
├── information.html        # Information Hub page
├── styles.css              # Complete styling with mobile-first design
├── app.js                  # Main application logic and state management
├── coach.js                # AI Mental Health Coach functionality
├── notifications.js        # Daily notification system
├── support.js              # Support System functionality
├── rewards.js              # Rewards and gamification system
├── information.js          # Information Hub functionality
├── sw.js                   # Service Worker for notifications
├── config.example.js       # API configuration template
├── logo2.png              # MindLink logo
└── README.md              # This file
```

## 🚀 Getting Started

1. Open `index.html` in a web browser
2. Explore the dashboard to understand all features
3. Choose your challenge length (7, 15, or 30 days) from the Challenger tab
4. Complete daily tasks to unlock the next day
5. Use the Support System to find community and professional help
6. Track your progress and earn rewards in the Rewards tab
7. Access personalized learning resources in the Information Hub

## 🎮 Demo Mode

To test the full functionality without waiting:
1. Add `?demo=1` to the URL (e.g., `index.html?demo=1`)
2. Use the "Fast-forward 1 day" button to skip ahead
3. Complete tasks and see the full progression
4. Test all features without time restrictions

## ⚙️ Technical Details

### State Management
The app uses localStorage to persist:
- Program length and start date
- Completed days count and progress
- User goals and notification preferences
- AI coach chat history
- Saved resources and bookmarks
- Avatar customization and achievements
- Streak data and heart system
- Personalization settings

### Navigation System
- **5 Main Tabs**: Home, Challenger, Support System, Rewards, Information Hub
- **Consistent Navigation**: Logo and tabs across all pages
- **Responsive Design**: Mobile-optimized navigation
- **Quick Actions**: Direct access to key features

### API Integration
- **Nabius API**: For AI coach responses and motivational quotes
- **Fallback System**: Mock responses when API is unavailable
- **Configuration**: Easy API key setup via config.js
- **Error Handling**: Graceful degradation when services are down

### Notification System
- **Web Notifications API**: Daily motivational quotes
- **Service Worker**: Background notification support
- **Goal-Based Content**: Personalized quotes based on user goals
- **Fallback Banner**: In-app notifications when browser notifications fail

### Gamification System
- **Streak Tracking**: Daily, weekly, monthly counters
- **Mission System**: Small, achievable daily tasks
- **Avatar Customization**: Visual progress representation
- **Heart System**: Streak protection mechanism
- **Achievement System**: Milestone recognition
- **Progress Analytics**: Visual data representation

## 🌐 Browser Support

- Modern browsers with localStorage support
- Mobile Safari, Chrome, Firefox, Edge
- Responsive design works on all screen sizes
- Service Worker support for notifications
- Web Notifications API support

## 🔧 Configuration

### API Setup (Optional)
1. Copy `config.example.js` to `config.js`
2. Add your Nabius API URL and key
3. The app will use AI features when configured
4. Without configuration, mock responses are used

### Customization
- Modify CSS variables in `styles.css` for theme changes
- Update day libraries in `app.js` for custom challenges
- Add new resource types in `information.js`
- Extend gamification features in `rewards.js`

## 🛡️ Safety Notice

This website is for self-management only and not medical advice. If you're in crisis, call/text 988 (US) or your local emergency number.

## 📱 Mobile Features

- **Touch-Optimized**: Large buttons and touch targets
- **Offline Support**: Core functionality works without internet
- **Responsive Design**: Adapts to all screen sizes
- **Fast Loading**: Optimized for mobile performance
- **Gesture Support**: Swipe and touch interactions

## 🎯 Target Audience

- Individuals seeking mental health support
- People looking to build healthy habits
- Users interested in gamified wellness
- Those wanting community connections
- Learners seeking mental health education

## 🔄 Future Enhancements

- Real-time community features
- Advanced analytics and insights
- Integration with wearable devices
- Group challenges and competitions
- Professional therapist matching
- Advanced AI personalization

## 📄 License

Built with care for your wellbeing. Feel free to use and modify for personal or educational purposes.

---

**MindLink** - Your comprehensive mental health companion for a better tomorrow. 🌟
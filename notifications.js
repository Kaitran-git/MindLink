// Notifications and scheduling (best-effort) for daily motivational quotes
// Persists settings in localStorage and uses SW when available, else in-app banner

(function () {
    const STORAGE_KEY = 'mhc_notification_settings_v1';
    const QUOTE_TEMPLATES = [
        goal => `Small steps add up. One action toward "${goal}" today.`,
        goal => `You're closer to "${goal}" than yesterday. Keep going.`,
        goal => `Gentle reminder: one mindful minute helps with "${goal}".`,
        goal => `Progress over perfection. A tiny move on "${goal}".`
    ];

    function loadSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : { goals: '', time: '09:00', enabled: false, lastShownYmd: null };
        } catch {
            return { goals: '', time: '09:00', enabled: false, lastShownYmd: null };
        }
    }

    function saveSettings(s) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }

    function getTodayYmd() {
        return new Date().toISOString().slice(0, 10);
    }

    function pickGoal(goalsCsv) {
        const list = goalsCsv.split(',').map(s => s.trim()).filter(Boolean);
        if (list.length === 0) return 'your wellbeing';
        return list[Math.floor(Math.random() * list.length)];
    }

    async function getQuote(goalsCsv) {
        const goal = pickGoal(goalsCsv);
        // Try Nabius API if configured
        try {
            // config.js may not exist; guard access
            const hasConfig = typeof window.NABIUS_API_URL === 'string' && typeof window.NABIUS_API_KEY === 'string' && window.NABIUS_API_KEY;
            if (hasConfig) {
                const res = await fetch(window.NABIUS_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + window.NABIUS_API_KEY
                    },
                    body: JSON.stringify({
                        type: 'quote',
                        prompt: `Write one short, kind motivational line that references the goal: "${goal}"`
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    const text = data.quote || data.text || data.message;
                    if (text) return text;
                }
            }
        } catch {}
        // Fallback mock
        const t = QUOTE_TEMPLATES[Math.floor(Math.random() * QUOTE_TEMPLATES.length)];
        return t(goal);
    }

    async function requestPermission() {
        if (!('Notification' in window)) return 'denied';
        if (Notification.permission === 'granted' || Notification.permission === 'denied') {
            return Notification.permission;
        }
        try {
            return await Notification.requestPermission();
        } catch {
            return 'denied';
        }
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    }

    async function showNotificationOrBanner(text) {
        if ('Notification' in window && Notification.permission === 'granted' && navigator.serviceWorker?.getRegistration) {
            try {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg) {
                    await reg.showNotification('Daily Motivation', {
                        body: text,
                        icon: 'assets/icon-192.png',
                        badge: 'assets/icon-192.png'
                    });
                    return;
                }
            } catch {}
        }
        // Fallback: in-app banner
        const banner = document.getElementById('inAppBanner');
        if (banner) {
            banner.textContent = text;
            banner.style.display = 'block';
            setTimeout(() => (banner.style.display = 'none'), 10000);
        }
    }

    function msUntil(timeHHMM) {
        const [h, m] = timeHHMM.split(':').map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(h, m, 0, 0);
        let delta = target.getTime() - now.getTime();
        if (delta < 0) delta += 24 * 60 * 60 * 1000; // next day
        return delta;
    }

    function scheduleTick() {
        const settings = loadSettings();
        if (!settings.enabled) return; // disabled

        const delay = msUntil(settings.time);
        setTimeout(async () => {
            // Once per day guard by Y-M-D
            const today = getTodayYmd();
            const fresh = loadSettings();
            if (fresh.lastShownYmd === today) {
                // already shown today; schedule next
                scheduleTick();
                return;
            }
            const text = await getQuote(fresh.goals);
            await showNotificationOrBanner(text);
            fresh.lastShownYmd = today;
            saveSettings(fresh);
            scheduleTick();
        }, delay);
    }

    function hydrateUI() {
        const s = loadSettings();
        const goals = document.getElementById('goalsInput');
        const time = document.getElementById('notifTime');
        const enabled = document.getElementById('notifEnabled');
        const status = document.getElementById('notifStatus');
        const saveBtn = document.getElementById('saveNotifSettings');

        if (!goals || !time || !enabled || !saveBtn) return;

        goals.value = s.goals;
        time.value = s.time || '09:00';
        enabled.checked = !!s.enabled;

        saveBtn.addEventListener('click', async () => {
            const newS = {
                goals: goals.value.trim(),
                time: time.value || '09:00',
                enabled: enabled.checked,
                lastShownYmd: s.lastShownYmd || null
            };
            saveSettings(newS);
            registerServiceWorker();
            if (newS.enabled) {
                const perm = await requestPermission();
                if (perm !== 'granted') {
                    status.textContent = 'Notifications not permitted. Will use in-app banner when open.';
                } else {
                    status.textContent = 'Notifications scheduled. You will get one daily at the chosen time.';
                }
                scheduleTick();
            } else {
                status.textContent = 'Notifications disabled.';
            }
        });
    }

    // Boot
    registerServiceWorker();
    hydrateUI();
    scheduleTick();
})();



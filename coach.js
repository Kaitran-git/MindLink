// Minimal mental health coach chat with Nabius API + mock fallback
(function () {
    const messagesEl = document.getElementById('coachMessages');
    const inputEl = document.getElementById('coachInput');
    const sendBtn = document.getElementById('coachSend');
    const clearBtn = document.getElementById('coachClear');
    const statusEl = document.getElementById('coachStatus');

    if (!messagesEl || !inputEl || !sendBtn) return;

    function appendMessage(role, text) {
        const wrap = document.createElement('div');
        wrap.style.marginBottom = '0.5rem';
        const bubble = document.createElement('div');
        bubble.style.padding = '0.5rem 0.75rem';
        bubble.style.borderRadius = '12px';
        bubble.style.whiteSpace = 'pre-wrap';
        bubble.style.lineHeight = '1.5';
        bubble.style.maxWidth = '90%';
        if (role === 'user') {
            bubble.style.background = 'var(--light-blue)';
            bubble.style.color = 'var(--primary-blue)';
            bubble.style.marginLeft = 'auto';
        } else {
            bubble.style.background = 'var(--gray-100)';
            bubble.style.color = 'var(--text-dark)';
            bubble.style.marginRight = 'auto';
        }
        bubble.textContent = text;
        wrap.appendChild(bubble);
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function setLoading(loading) {
        if (loading) {
            statusEl.textContent = 'Coach is typing...';
        } else {
            statusEl.textContent = '';
        }
    }

    async function getCoachResponse(message) {
        // Try Nabius API first
        try {
            const hasConfig = typeof window.NABIUS_API_URL === 'string' && typeof window.NABIUS_API_KEY === 'string' && window.NABIUS_API_KEY;
            if (hasConfig) {
                const res = await fetch(window.NABIUS_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + window.NABIUS_API_KEY
                    },
                    body: JSON.stringify({ type: 'coach', prompt: message })
                });
                if (res.ok) {
                    const data = await res.json();
                    return data.reply || data.text || data.message || 'I hear you. Can you share a little more?';
                }
            }
        } catch {}
        // Mock fallback (CBT-style, supportive, safety-aware)
        const templates = [
            'Thanks for sharing. What emotion are you noticing right now, and where do you feel it in your body?',
            'That sounds tough. What’s one small, kind step you could take in the next hour?',
            'Try a grounding moment: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
            'Consider a reframe: If a friend felt this way, what would you say to them?',
            'If you’re in crisis or thinking about harming yourself, please reach out to local emergency services or call/text 988 (US). You’re not alone.'
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    async function onSend() {
        const text = (inputEl.value || '').trim();
        if (!text) return;
        appendMessage('user', text);
        inputEl.value = '';
        setLoading(true);
        try {
            const reply = await getCoachResponse(text);
            appendMessage('assistant', reply);
        } catch (e) {
            appendMessage('assistant', 'I ran into an issue. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    sendBtn.addEventListener('click', onSend);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            onSend();
        }
    });
    clearBtn && clearBtn.addEventListener('click', () => {
        messagesEl.innerHTML = '';
        statusEl.textContent = '';
        inputEl.value = '';
    });
})();



// TCS NQT Coach - Main Application State and Logic

// State management
let state = {
    user: {
        streak: 0,
        lastActiveDate: null,
        solvedQuestions: [], // array of { id, correct, timestamp }
        mockHistory: [],     // array of { id, score, date, type }
        errorNotebook: [],   // array of { id, topic, question, lesson, category, timestamp }
        plannerProgress: {}, // day -> array of task indices completed
        totalStudyTime: 0,   // in seconds
        examDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 10 days from now
    },
    activeQuiz: {
        category: null,
        topic: null,
        questions: [],
        currentIndex: 0,
        userAnswers: {}, // index -> optionIndex
        checked: {},     // index -> boolean
        startTime: null,
        timerInterval: null,
        timeTaken: 0,
        isMock: false,
        mockType: null
    }
};

// Tips Database
const AI_TIPS = [
    "Prioritize Numerical Ability! Simple & Compound Interest and Averages appear in almost every NQT slot.",
    "TCS NQT has NO negative marking. If you're running out of time, make sure you guess all remaining questions!",
    "Elementary Statistics is low-hanging fruit. Master mean, median, mode, and standard deviation calculations today.",
    "For the Advanced Coding section, brute force is better than no code. Ensure your code compiles and passes basic test cases.",
    "In Seating Arrangement questions, draw the circle/line step-by-step. Don't try to solve it mentally.",
    "Practice reading comprehensions with a timer. Try to scan the questions first, then skim the passage.",
    "Keep your Error Notebook updated. Reviewing your past mistakes is 3x more effective than solving new random questions.",
    "Strings and Arrays constitute 90% of the Coding section. Master sliding window and two-pointer patterns.",
    "For syllogism questions, draw Venn diagrams to avoid common logical fallacies.",
    "Manage your time! In Foundation, you have slightly over 1 minute per question. Don't spend more than 2 minutes on any single question."
];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupTheme();
    updateDashboard();
    renderTopicMastery();
    renderDailyTargets();
    renderPlanner();
    renderNotebook();
    renderFormulas();
    getNewTip();
    startStudyTimer();
    checkStreak();
});

// Theme setup
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>`;
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    const themeBtn = document.getElementById('themeToggle');
    if (isLight) {
        themeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>`;
    } else {
        themeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
    showToast("Theme switched!", "info");
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('mobile-active');
}

// Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    // Show selected page
    const activePage = document.getElementById(`page-${pageId}`);
    if (activePage) activePage.classList.add('active');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close mobile menu if open
    document.getElementById('navLinks').classList.remove('mobile-active');

    // Special page actions
    if (pageId === 'dashboard') {
        updateDashboard();
        renderTopicMastery();
        renderDailyTargets();
    } else if (pageId === 'practice') {
        exitQuiz();
        selectCategory('numerical');
    } else if (pageId === 'planner') {
        renderPlanner();
    } else if (pageId === 'notebook') {
        renderNotebook();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Local Storage Helper
function loadUserData() {
    const saved = localStorage.getItem('tcs_nqt_coach_user');
    if (saved) {
        try {
            state.user = JSON.parse(saved);
            // Ensure properties exist
            if (!state.user.solvedQuestions) state.user.solvedQuestions = [];
            if (!state.user.mockHistory) state.user.mockHistory = [];
            if (!state.user.errorNotebook) state.user.errorNotebook = [];
            if (!state.user.plannerProgress) state.user.plannerProgress = {};
        } catch(e) {
            console.error("Error parsing user data", e);
        }
    }
    
    // Set initial exam date format display
    const dateEl = document.getElementById('examDate');
    if (dateEl) {
        const d = new Date(state.user.examDate);
        dateEl.innerText = `Exam Date: ${d.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}`;
    }
}

function saveUserData() {
    localStorage.setItem('tcs_nqt_coach_user', JSON.stringify(state.user));
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Study Timer
function startStudyTimer() {
    let sessionSeconds = 0;
    setInterval(() => {
        sessionSeconds++;
        state.user.totalStudyTime++;
        if (sessionSeconds % 60 === 0) {
            saveUserData();
            updateDashboardStats();
        }
    }, 1000);
}

// Check and Update Streak
function checkStreak() {
    const today = new Date().toDateString();
    const lastActive = state.user.lastActiveDate;

    if (!lastActive) {
        state.user.streak = 1;
    } else {
        const diffTime = Math.abs(new Date(today) - new Date(lastActive));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            state.user.streak += 1;
        } else if (diffDays > 1) {
            state.user.streak = 1;
        }
    }
    
    state.user.lastActiveDate = today;
    saveUserData();
    
    const countEl = document.getElementById('streakCount');
    if (countEl) countEl.innerText = state.user.streak;
}

// Update Dashboard UI
function updateDashboard() {
    const todayEl = document.getElementById('todayDate');
    if (todayEl) {
        todayEl.innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    }

    // Days remaining count
    const examDate = new Date(state.user.examDate);
    const today = new Date();
    const timeDiff = examDate - today;
    const daysDiff = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    const daysLeftEl = document.getElementById('daysLeft');
    if (daysLeftEl) daysLeftEl.innerText = daysDiff;

    // Progress circle offset
    const circle = document.getElementById('countdownCircle');
    if (circle) {
        const percent = (10 - Math.min(10, daysDiff)) / 10;
        const offset = 339.292 * (1 - percent);
        circle.style.strokeDashoffset = offset;
    }

    updateDashboardStats();
}

function updateDashboardStats() {
    // Solved count
    const totalAttempted = state.user.solvedQuestions.length;
    const attemptedEl = document.getElementById('totalAttempted');
    if (attemptedEl) attemptedEl.innerText = totalAttempted;

    // Accuracy
    const correctCount = state.user.solvedQuestions.filter(q => q.correct).length;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const accuracyEl = document.getElementById('accuracy');
    if (accuracyEl) accuracyEl.innerText = `${accuracy}%`;

    const trendEl = document.getElementById('accuracyTrend');
    if (trendEl) {
        if (accuracy >= 85) {
            trendEl.innerText = "🎯 Elite! Ready for Prime";
            trendEl.className = "stat-trend up";
        } else if (accuracy >= 70) {
            trendEl.innerText = "👍 Good! Ready for Digital";
            trendEl.className = "stat-trend up";
        } else if (totalAttempted > 0) {
            trendEl.innerText = "📈 Focus on accuracy (Goal: 85%)";
            trendEl.className = "stat-trend down";
        } else {
            trendEl.innerText = "Target: 85%+ Accuracy";
        }
    }

    // Best mock score
    const bestMockEl = document.getElementById('mockScore');
    if (bestMockEl) {
        if (state.user.mockHistory.length > 0) {
            const maxScore = Math.max(...state.user.mockHistory.map(h => h.score));
            bestMockEl.innerText = `${maxScore}%`;
        } else {
            bestMockEl.innerText = '—';
        }
    }

    // Study Time
    const hours = Math.round((state.user.totalStudyTime / 3600) * 10) / 10;
    const timeEl = document.getElementById('studyTime');
    if (timeEl) timeEl.innerText = `${hours}h`;
}

// Render Topic Mastery
function renderTopicMastery() {
    const grid = document.getElementById('masteryGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const categories = [
        { key: 'numerical', name: 'Numerical Ability', icon: '🔢' },
        { key: 'reasoning', name: 'Reasoning Ability', icon: '🧩' },
        { key: 'verbal', name: 'Verbal Ability', icon: '📖' },
        { key: 'coding', name: 'Advanced Coding', icon: '💻' }
    ];

    categories.forEach(cat => {
        // Calculate mastery percent
        const catQuestions = QUESTION_BANK[cat.key] || [];
        const solvedInCat = state.user.solvedQuestions.filter(sq => {
            const q = catQuestions.find(cq => cq.id === sq.id);
            return q !== undefined;
        });
        
        const correctCount = solvedInCat.filter(q => q.correct).length;
        const mastery = solvedInCat.length > 0 ? Math.round((correctCount / solvedInCat.length) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'mastery-card';
        card.innerHTML = `
            <div class="mastery-info">
                <span class="mastery-title">${cat.icon} ${cat.name}</span>
                <span class="mastery-percent">${mastery}%</span>
            </div>
            <div class="mastery-progress-bar">
                <div class="mastery-progress-fill" style="width: ${mastery}%"></div>
            </div>
            <span class="target-sub">${solvedInCat.length} solved • ${correctCount} correct</span>
        `;
        grid.appendChild(card);
    });
}

// Daily Targets
const TARGET_ITEMS = [
    { text: "Solve 5 Statistics questions", tag: "quant", cat: "numerical" },
    { text: "Revise Seating Arrangement diagrams", tag: "reasoning", cat: "reasoning" },
    { text: "Take 1 Reading Comprehension drill", tag: "verbal", cat: "verbal" },
    { text: "Solve 1 Array / String Coding problem", tag: "coding", cat: "coding" }
];

function renderDailyTargets() {
    const container = document.getElementById('dailyTargets');
    if (!container) return;
    container.innerHTML = '';

    const todayDateStr = new Date().toDateString();
    if (!state.user.dailyChallenge || state.user.dailyChallenge.date !== todayDateStr) {
        state.user.dailyChallenge = {
            date: todayDateStr,
            completed: [false, false, false, false]
        };
        saveUserData();
    }

    TARGET_ITEMS.forEach((target, index) => {
        const completed = state.user.dailyChallenge.completed[index];
        const div = document.createElement('div');
        div.className = `target-item ${completed ? 'completed' : ''}`;
        div.onclick = () => toggleDailyTarget(index);
        div.innerHTML = `
            <div class="target-left">
                <div class="target-checkbox"></div>
                <div class="target-details">
                    <span class="target-title">${target.text}</span>
                    <span class="target-sub">Essential for TCS preparation</span>
                </div>
            </div>
            <span class="target-tag target-tag-${target.tag}">${target.tag}</span>
        `;
        container.appendChild(div);
    });
}

function toggleDailyTarget(index) {
    if (!state.user.dailyChallenge) return;
    state.user.dailyChallenge.completed[index] = !state.user.dailyChallenge.completed[index];
    saveUserData();
    renderDailyTargets();
    
    if (state.user.dailyChallenge.completed[index]) {
        showToast("Target completed! Keep pushing! 🚀", "success");
    }
}

// Get AI tip
function getNewTip() {
    const idx = Math.floor(Math.random() * AI_TIPS.length);
    const textEl = document.getElementById('aiTipText');
    if (textEl) textEl.innerText = AI_TIPS[idx];
}

// ========== PRACTICE ENGINE ==========

let activeCategory = 'numerical';

function selectCategory(category) {
    activeCategory = category;
    document.querySelectorAll('.cat-tab').forEach(tab => {
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    renderTopics();
}

function renderTopics() {
    const grid = document.getElementById('topicGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const questions = QUESTION_BANK[activeCategory] || [];
    
    // Group questions by topic
    const topicGroups = {};
    questions.forEach(q => {
        if (!topicGroups[q.topic]) {
            topicGroups[q.topic] = {
                topic: q.topic,
                count: 0,
                difficulty: q.difficulty,
                questions: []
            };
        }
        topicGroups[q.topic].count++;
        topicGroups[q.topic].questions.push(q);
    });

    Object.values(topicGroups).forEach(group => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        card.onclick = () => startTopicQuiz(activeCategory, group.topic, group.questions);
        card.innerHTML = `
            <div class="topic-meta">
                <span class="topic-questions-count">${group.count} Questions</span>
                <span class="topic-diff diff-${group.difficulty}">${group.difficulty}</span>
            </div>
            <div class="topic-card-body">
                <h3>${group.topic}</h3>
                <p>Master this topic to boost your TCS NQT ${activeCategory} score.</p>
            </div>
            <button class="btn btn-glass btn-block">Practice Now</button>
        `;
        grid.appendChild(card);
    });
}

function startTopicQuiz(category, topic, questions) {
    document.getElementById('topicGrid').style.display = 'none';
    document.getElementById('categoryTabs').style.display = 'none';
    
    const quizArea = document.getElementById('quizArea');
    quizArea.style.display = 'block';
    
    state.activeQuiz = {
        category: category,
        topic: topic,
        questions: [...questions],
        currentIndex: 0,
        userAnswers: {},
        checked: {},
        startTime: Date.now(),
        timeTaken: 0,
        isMock: false
    };

    renderQuestion();
    startQuizTimer();
}

function startQuizTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    let totalSeconds = 0;
    
    if (state.activeQuiz.timerInterval) clearInterval(state.activeQuiz.timerInterval);
    
    state.activeQuiz.timerInterval = setInterval(() => {
        totalSeconds++;
        state.activeQuiz.timeTaken = totalSeconds;
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${mins}:${secs}`;
    }, 1000);
}

function renderQuestion() {
    const q = state.activeQuiz.questions[state.activeQuiz.currentIndex];
    if (!q) return;

    // Quiz Header info
    document.getElementById('quizTopic').innerText = `${state.activeQuiz.topic}`;
    document.getElementById('quizProgress').innerText = `${state.activeQuiz.currentIndex + 1} / ${state.activeQuiz.questions.length}`;
    
    // Progress fill
    const percent = ((state.activeQuiz.currentIndex + 1) / state.activeQuiz.questions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${percent}%`;

    // Question body
    document.getElementById('questionNumber').innerText = `Question ${state.activeQuiz.currentIndex + 1}`;
    
    // Escape HTML to prevent injection and format code snippets in monospace
    let questionText = q.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    questionText = questionText.replace(/\n/g, '<br>');
    // Format bold/bold-italic Markdown if present
    questionText = questionText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    questionText = questionText.replace(/`(.*?)`/g, '<code class="formula-expression">$1</code>');
    
    document.getElementById('questionText').innerHTML = questionText;

    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';

    const alphabet = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
        const optionItem = document.createElement('div');
        
        let optionContent = opt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        optionContent = optionContent.replace(/\n/g, '<br>');
        
        // Setup classes
        let classes = 'option-item';
        const isSelected = state.activeQuiz.userAnswers[state.activeQuiz.currentIndex] === idx;
        const isChecked = state.activeQuiz.checked[state.activeQuiz.currentIndex];
        
        if (isSelected) classes += ' selected';
        if (isChecked) {
            if (idx === q.answer) classes += ' correct';
            else if (isSelected) classes += ' wrong';
        }

        optionItem.className = classes;
        optionItem.innerHTML = `
            <span class="option-prefix">${alphabet[idx]}</span>
            <span>${optionContent}</span>
        `;
        
        if (!isChecked) {
            optionItem.onclick = () => selectOption(idx);
        }
        optionsList.appendChild(optionItem);
    });

    // Control buttons
    document.getElementById('prevBtn').disabled = state.activeQuiz.currentIndex === 0;
    
    const checkBtn = document.getElementById('checkBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const explanationDiv = document.getElementById('questionExplanation');

    const isChecked = state.activeQuiz.checked[state.activeQuiz.currentIndex];
    const isAnswerSelected = state.activeQuiz.userAnswers[state.activeQuiz.currentIndex] !== undefined;

    explanationDiv.style.display = isChecked ? 'block' : 'none';
    if (isChecked) {
        document.getElementById('explanationText').innerText = q.explanation;
    }

    if (isChecked) {
        checkBtn.style.display = 'none';
        if (state.activeQuiz.currentIndex === state.activeQuiz.questions.length - 1) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            finishBtn.style.display = 'none';
        }
    } else {
        checkBtn.style.display = 'block';
        checkBtn.disabled = !isAnswerSelected;
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'none';
    }
}

function selectOption(optIdx) {
    state.activeQuiz.userAnswers[state.activeQuiz.currentIndex] = optIdx;
    renderQuestion();
}

function checkAnswer() {
    const currentIdx = state.activeQuiz.currentIndex;
    const q = state.activeQuiz.questions[currentIdx];
    const selectedOpt = state.activeQuiz.userAnswers[currentIdx];
    
    if (selectedOpt === undefined) return;
    
    state.activeQuiz.checked[currentIdx] = true;
    const isCorrect = selectedOpt === q.answer;
    
    // Record to user history
    state.user.solvedQuestions.push({
        id: q.id,
        correct: isCorrect,
        timestamp: Date.now()
    });

    // Add to Error Notebook if wrong
    if (!isCorrect) {
        addToErrorNotebook({
            id: q.id,
            topic: q.topic,
            question: q.text,
            lesson: `My answer: ${q.options[selectedOpt]}. Correct answer: ${q.options[q.answer]}.\nExplanation: ${q.explanation}`,
            category: state.activeQuiz.category
        });
    }

    saveUserData();
    renderQuestion();
}

function prevQuestion() {
    if (state.activeQuiz.currentIndex > 0) {
        state.activeQuiz.currentIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (state.activeQuiz.currentIndex < state.activeQuiz.questions.length - 1) {
        state.activeQuiz.currentIndex++;
        renderQuestion();
    }
}

function finishQuiz() {
    clearInterval(state.activeQuiz.timerInterval);
    
    const quizArea = document.getElementById('quizArea');
    quizArea.style.display = 'none';
    
    const resultArea = document.getElementById('quizResult');
    resultArea.style.display = 'block';

    // Calculate score
    let correct = 0;
    state.activeQuiz.questions.forEach((q, idx) => {
        if (state.activeQuiz.userAnswers[idx] === q.answer) {
            correct++;
        }
    });

    const total = state.activeQuiz.questions.length;
    const scorePct = Math.round((correct / total) * 100);

    document.getElementById('resultScore').innerText = `${correct} / ${total}`;
    document.getElementById('resultCorrect').innerText = correct;
    document.getElementById('resultWrong').innerText = total - correct;
    
    const mins = Math.floor(state.activeQuiz.timeTaken / 60).toString().padStart(2, '0');
    const secs = (state.activeQuiz.timeTaken % 60).toString().padStart(2, '0');
    document.getElementById('resultTime').innerText = `${mins}:${secs}`;

    const emojiEl = document.getElementById('resultEmoji');
    const titleEl = document.getElementById('resultTitle');

    if (scorePct >= 80) {
        emojiEl.innerText = '🏆';
        titleEl.innerText = 'Outstanding Practice!';
    } else if (scorePct >= 50) {
        emojiEl.innerText = '👍';
        titleEl.innerText = 'Good Effort!';
    } else {
        emojiEl.innerText = '✍️';
        titleEl.innerText = 'Need More Practice';
    }

    // Save mock history if it was a mock test
    if (state.activeQuiz.isMock) {
        state.user.mockHistory.push({
            score: scorePct,
            type: state.activeQuiz.mockType,
            date: new Date().toLocaleDateString()
        });
        saveUserData();
    }
}

function exitQuiz() {
    if (state.activeQuiz.timerInterval) clearInterval(state.activeQuiz.timerInterval);
    document.getElementById('quizArea').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('topicGrid').style.display = 'grid';
    document.getElementById('categoryTabs').style.display = 'flex';
}

function retryQuiz() {
    document.getElementById('quizResult').style.display = 'none';
    startTopicQuiz(state.activeQuiz.category, state.activeQuiz.topic, state.activeQuiz.questions);
}

// ========== MOCK TEST ENGINE ==========

function startMockTest(type) {
    let mockQuestions = [];
    let topicName = '';
    
    if (type === 'foundation') {
        topicName = 'Part A: Foundation Mock';
        // Combine numerical, reasoning, verbal questions
        mockQuestions = [
            ...(QUESTION_BANK.numerical || []).slice(0, 3),
            ...(QUESTION_BANK.reasoning || []).slice(0, 3),
            ...(QUESTION_BANK.verbal || []).slice(0, 3)
        ];
    } else if (type === 'advanced') {
        topicName = 'Part B: Advanced Mock';
        mockQuestions = [
            ...(QUESTION_BANK.numerical || []).filter(q => q.difficulty === 'hard'),
            ...(QUESTION_BANK.coding || [])
        ];
    } else {
        topicName = 'Full ITP Mock Test';
        mockQuestions = [
            ...(QUESTION_BANK.numerical || []),
            ...(QUESTION_BANK.reasoning || []),
            ...(QUESTION_BANK.verbal || []),
            ...(QUESTION_BANK.coding || [])
        ];
    }

    if (mockQuestions.length === 0) {
        showToast("No mock questions available!", "warning");
        return;
    }

    showPage('practice');
    document.getElementById('topicGrid').style.display = 'none';
    document.getElementById('categoryTabs').style.display = 'none';
    
    const quizArea = document.getElementById('quizArea');
    quizArea.style.display = 'block';
    
    state.activeQuiz = {
        category: 'mock',
        topic: topicName,
        questions: mockQuestions,
        currentIndex: 0,
        userAnswers: {},
        checked: {},
        startTime: Date.now(),
        timeTaken: 0,
        isMock: true,
        mockType: type
    };

    renderQuestion();
    startQuizTimer();
    showToast(`Started mock test: ${topicName}. Best of luck! 🎓`, "info");
}

// ========== 10-DAY PLANNER ENGINE ==========

const DAILY_PLAN = [
    {
        day: 1,
        title: "Day 1: Foundation Building",
        desc: "Kickstart your preparation with core Quantitative topics. Master Percentages, Ratios, and basic Word Problems.",
        tasks: [
            "Review Percentage formulas and shortcut tricks",
            "Solve 10 Practice Questions in Percentages",
            "Solve 5 Time and Work basic problems"
        ]
    },
    {
        day: 2,
        title: "Day 2: Data & Statistics",
        desc: "Elementary Statistics is a guaranteed topic in the Foundation section. Target statistics and data interpretation.",
        tasks: [
            "Revise Mean, Median, Mode, Variance, and Standard Deviation",
            "Complete the statistics sample formulas cheat sheet",
            "Practice 2 Data Interpretation tables/graphs"
        ]
    },
    {
        day: 3,
        title: "Day 3: Speed, Time & Distance",
        desc: "Learn shortcuts for trains, relative speed, and average velocity equations.",
        tasks: [
            "Memorize km/h to m/s conversion and relative speed rule",
            "Solve 8 Time, Speed & Distance practice questions",
            "Review circular tracks and races concept"
        ]
    },
    {
        day: 4,
        title: "Day 4: Verbal Skills",
        desc: "Prepare for reading comprehension and error identification grammar rules.",
        tasks: [
            "Read 2 Reading Comprehension passages and solve questions",
            "Study Subject-Verb agreement rules (e.g., neither/either singular rules)",
            "Practice 10 Sentence correction questions"
        ]
    },
    {
        day: 5,
        title: "Day 5: Logical Reasoning - Seating & Blood Relations",
        desc: "Solve circular and linear seating arrangements. Master family trees.",
        tasks: [
            "Solve 5 Blood Relation coding problems",
            "Practice 5 Linear and Circular Seating Arrangements",
            "Study visual reasoning patterns"
        ]
    },
    {
        day: 6,
        title: "Day 6: Syllogisms & Critical Logic",
        desc: "Learn to draw Venn diagrams for syllogisms and check data sufficiency constraints.",
        tasks: [
            "Solve 8 Syllogism questions using Venn diagrams",
            "Solve 5 Data Sufficiency questions",
            "Take a 15-minute quick logical reasoning drill"
        ]
    },
    {
        day: 7,
        title: "Day 7: Advanced Coding - Arrays",
        desc: "Master array operations, two-pointer techniques, and sliding window strategies.",
        tasks: [
            "Review second largest element logic (O(N) single pass)",
            "Code optimal solution for Subarray Sum / Sliding Window",
            "Solve 5 array-based coding MCQs"
        ]
    },
    {
        day: 8,
        title: "Day 8: Advanced Coding - Strings",
        desc: "Learn string searching algorithms, palindromes, and anagram validation techniques.",
        tasks: [
            "Solve Longest Substring Without Repeating Characters",
            "Implement optimal Anagram Check algorithm",
            "Revise basic sorting and searching structures"
        ]
    },
    {
        day: 9,
        title: "Day 9: Full Mock Simulation",
        desc: "Simulate the test environment. Complete a timed mock exam.",
        tasks: [
            "Attempt the Foundation Mock Test (75 mins)",
            "Review every incorrect response and write explanation in Error Notebook",
            "Revise key formula cheat sheet"
        ]
    },
    {
        day: 10,
        title: "Day 10: Final Prep & Review",
        desc: "Keep a calm mind. Revise all formulas and review your error log.",
        tasks: [
            "Read all entries in the Error Notebook",
            "Rapid review of DSA space/time complexities",
            "Get sufficient rest before the big day"
        ]
    }
];

function renderPlanner() {
    const timeline = document.getElementById('plannerTimeline');
    if (!timeline) return;
    timeline.innerHTML = '';

    let totalTasks = 0;
    let completedTasks = 0;

    DAILY_PLAN.forEach(dayPlan => {
        const completedList = state.user.plannerProgress[dayPlan.day] || [];
        const isDayCompleted = completedList.length === dayPlan.tasks.length;

        const dayCard = document.createElement('div');
        dayCard.className = `planner-day-card ${isDayCompleted ? 'completed' : ''}`;
        
        let taskHtml = '';
        dayPlan.tasks.forEach((task, idx) => {
            totalTasks++;
            const isTaskDone = completedList.includes(idx);
            if (isTaskDone) completedTasks++;

            taskHtml += `
                <div class="planner-task ${isTaskDone ? 'completed' : ''}" onclick="togglePlannerTask(${dayPlan.day}, ${idx})">
                    <span>${isTaskDone ? '✅' : '⬜'} ${task}</span>
                </div>
            `;
        });

        dayCard.innerHTML = `
            <div class="planner-day-header">
                <h3 class="planner-day-title">
                    <span>📅 Day ${dayPlan.day}</span>
                </h3>
                <span class="target-tag ${isDayCompleted ? 'target-tag-verbal' : 'target-tag-quant'}">
                    ${isDayCompleted ? 'Completed' : 'In Progress'}
                </span>
            </div>
            <p class="target-sub" style="margin-bottom:1rem;">${dayPlan.desc}</p>
            <div class="planner-day-tasks">
                ${taskHtml}
            </div>
        `;
        timeline.appendChild(dayCard);
    });

    // Update overall percent
    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const percentEl = document.getElementById('plannerPercent');
    if (percentEl) percentEl.innerText = `${percent}%`;
}

function togglePlannerTask(day, taskIdx) {
    if (!state.user.plannerProgress[day]) {
        state.user.plannerProgress[day] = [];
    }

    const idx = state.user.plannerProgress[day].indexOf(taskIdx);
    if (idx > -1) {
        state.user.plannerProgress[day].splice(idx, 1);
    } else {
        state.user.plannerProgress[day].push(taskIdx);
    }

    saveUserData();
    renderPlanner();
}

function resetPlanner() {
    if (confirm("Are you sure you want to reset all planner progress?")) {
        state.user.plannerProgress = {};
        saveUserData();
        renderPlanner();
        showToast("Planner progress reset.", "info");
    }
}

// ========== ERROR NOTEBOOK ENGINE ==========

function addToErrorNotebook(err) {
    // Check if already exists to avoid duplicates
    if (state.user.errorNotebook.some(x => x.id === err.id)) return;
    
    state.user.errorNotebook.push({
        id: err.id || 'manual_' + Date.now(),
        topic: err.topic,
        question: err.question,
        lesson: err.lesson,
        category: err.category,
        timestamp: Date.now()
    });
}

function renderNotebook() {
    const container = document.getElementById('notebookEntries');
    if (!container) return;
    container.innerHTML = '';

    const filterVal = document.getElementById('notebookFilter').value;
    const entries = state.user.errorNotebook.filter(e => filterVal === 'all' || e.category === filterVal);

    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📓</span>
                <p>No errors recorded for this filter. Solve practice questions to fill the notebook.</p>
            </div>
        `;
        return;
    }

    entries.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'notebook-entry';
        item.innerHTML = `
            <div class="notebook-entry-header">
                <span class="notebook-entry-tag target-tag-${entry.category === 'numerical' ? 'quant' : entry.category}">${entry.topic}</span>
                <button class="notebook-entry-delete" onclick="deleteNotebookEntry('${entry.id}')" title="Delete entry">🗑️</button>
            </div>
            <div class="notebook-entry-body">
                <h4>Q: ${entry.question}</h4>
                <p style="white-space: pre-line;"><strong>Correct logic / Lesson:</strong><br>${entry.lesson}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

function filterNotebook() {
    renderNotebook();
}

function deleteNotebookEntry(id) {
    state.user.errorNotebook = state.user.errorNotebook.filter(x => x.id !== id);
    saveUserData();
    renderNotebook();
    showToast("Entry removed from Error Notebook.", "info");
}

function clearNotebook() {
    if (confirm("Are you sure you want to clear your entire error notebook?")) {
        state.user.errorNotebook = [];
        saveUserData();
        renderNotebook();
        showToast("Error Notebook cleared.", "info");
    }
}

// Manual Add Note Modal Actions
function addManualNote() {
    document.getElementById('noteModal').style.display = 'flex';
}

function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
}

function saveManualNote() {
    const topic = document.getElementById('noteTopicSelect').value;
    const question = document.getElementById('noteQuestion').value.trim();
    const lesson = document.getElementById('noteLesson').value.trim();

    if (!question || !lesson) {
        alert("Please fill in both fields!");
        return;
    }

    addToErrorNotebook({
        topic: topic.charAt(0).toUpperCase() + topic.slice(1) + " (Manual Note)",
        question: question,
        lesson: lesson,
        category: topic
    });

    saveUserData();
    closeNoteModal();
    renderNotebook();
    
    // Clear inputs
    document.getElementById('noteQuestion').value = '';
    document.getElementById('noteLesson').value = '';
    
    showToast("Manual note added!", "success");
}

// ========== FORMULAS ENGINE ==========

function renderFormulas() {
    const container = document.getElementById('formulaCategories');
    if (!container) return;
    container.innerHTML = '';

    const searchVal = document.getElementById('formulaSearch').value.toLowerCase();

    FORMULA_DATABASE.forEach(cat => {
        const filteredItems = cat.items.filter(item => 
            item.name.toLowerCase().includes(searchVal) || 
            item.expression.toLowerCase().includes(searchVal) || 
            item.desc.toLowerCase().includes(searchVal)
        );

        if (filteredItems.length === 0) return;

        const catCard = document.createElement('div');
        catCard.className = 'formula-category-card';
        
        let itemsHtml = '';
        filteredItems.forEach(item => {
            itemsHtml += `
                <div class="formula-card">
                    <span class="formula-name">${item.name}</span>
                    <div class="formula-expression">${item.expression}</div>
                    <span class="formula-desc">${item.desc}</span>
                </div>
            `;
        });

        catCard.innerHTML = `
            <h3 class="formula-category-title">${cat.category}</h3>
            <div class="formula-list">
                ${itemsHtml}
            </div>
        `;
        container.appendChild(catCard);
    });
}

function searchFormulas() {
    renderFormulas();
}

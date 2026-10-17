// ============================================
// InterEdge - Live Test Bridge + Attempt Engine
// ============================================

const TEST_ADMIN_LSP = 'pe_admin_';

function _getDefaultTrialTests() {
  const now = Date.now();
  return [
    {
      id: 'trial_test_1',
      title: 'MTP Paper 1 — Business Economics & BCK',
      subject: 'Business Economics',
      timer: 30,
      penalty: 0.25,
      publish_at: new Date(now - 10 * 60000).toISOString(),
      questions: [
        { type: 'mcq', text: 'Which of the following is considered an assumption of the Law of Demand?', options: ['Income of consumer changes', 'Tastes and preferences remain constant', 'Price of substitute goods changes', 'Future expectations change'], correctIndex: 1, explanation: 'The Law of Demand assumes other things being equal (ceteris paribus), including consumer tastes, income, and prices of related goods.' },
        { type: 'mcq', text: 'Cross elasticity of demand between two complementary goods is:', options: ['Positive', 'Negative', 'Zero', 'Infinite'], correctIndex: 1, explanation: 'For complementary goods, an increase in the price of one leads to a decrease in demand for the other, making cross elasticity negative.' },
        { type: 'mcq', text: 'When Marginal Utility is zero, Total Utility is:', options: ['Minimum', 'Zero', 'Maximum', 'Negative'], correctIndex: 2, explanation: 'Total utility reaches its peak when marginal utility reaches zero (satiety point).' },
        { type: 'mcq', text: 'Kinked demand curve hypothesis is designed to explain:', options: ['Price rigidity in oligopoly', 'Collusion between firms', 'Monopoly price discrimination', 'Output maximization'], correctIndex: 0, explanation: 'Paul Sweezy introduced the kinked demand curve model to explain price rigidity in an oligopolistic market.' },
        { type: 'mcq', text: 'The opportunity cost of a factor of production is:', options: ['What it earns in its current use', 'What it can earn in the next best alternative use', 'The cost of producing the factor', 'Its historical purchase price'], correctIndex: 1, explanation: 'Opportunity cost refers to the value of the foregone next best alternative.' }
      ]
    },
    {
      id: 'trial_test_2',
      title: 'RTP Nov 2026 — Maths & Statistics',
      subject: 'Maths & Stats',
      timer: 45,
      penalty: 0.25,
      publish_at: new Date(now + 2 * 3600000).toISOString(),
      questions: [
        { type: 'mcq', text: 'If the ratio of two numbers is 3:4 and their sum is 84, what is the larger number?', options: ['36', '48', '42', '52'], correctIndex: 1, explanation: 'The larger number is 4/(3+4) * 84 = 48.' },
        { type: 'mcq', text: 'The value of log 1 to any base is:', options: ['0', '1', 'Infinity', 'Undefined'], correctIndex: 0, explanation: 'By definition, log_b(1) = 0 for any positive base b != 1.' }
      ]
    },
    {
      id: 'trial_test_3',
      title: 'Mock Test — Business Laws (Contract Act)',
      subject: 'Business Laws',
      timer: 30,
      penalty: 0,
      publish_at: new Date(now - 24 * 3600000).toISOString(),
      questions: [
        { type: 'mcq', text: 'An agreement enforceable by law is known as a:', options: ['Contract', 'Proposal', 'Acceptance', 'Void agreement'], correctIndex: 0, explanation: 'According to Section 2(h) of the Indian Contract Act, 1872, an agreement enforceable by law is a contract.' }
      ]
    }
  ];
}

async function fetchTestsData(force = false) {
  const email = (typeof AppState !== 'undefined' && AppState.user && AppState.user.email)
    || (JSON.parse(localStorage.getItem('pe_user') || '{}').email)
    || 'student';

  let tests = [];
  try {
    const raw = localStorage.getItem('pe_admin_tests_history');
    if (raw) tests = JSON.parse(raw);
  } catch(e) {}

  if (!tests || !tests.length) {
    tests = _getDefaultTrialTests();
    try { localStorage.setItem('pe_admin_tests_history', JSON.stringify(tests)); } catch(e) {}
  }

  tests.forEach(t => {
    if (typeof t.questions === 'string') {
      try { t.questions = JSON.parse(t.questions); } catch(e) {}
    }
  });

  const attemptsKey = 'pe_user_attempts_' + email.replace(/[^a-zA-Z0-9]/g, '_');
  let attempts = [];
  try {
    attempts = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
  } catch(e) {}

  return { tests, attempts };
}

function _invalidateCache() {
  // Deprecated: No caching used anymore
}

// ─── Phase derivation ───────────────────────────────────────────────────────
function deriveTestPhase(t) {
  if (!t.questions || !t.questions.length) return 'invalid';
  const start = new Date(t.publish_at).getTime();
  if (isNaN(start)) return 'invalid';
  const durMin = parseInt(t.timer, 10) || 30;
  const end = start + durMin * 60000;
  const now = Date.now();
  if (now < start) return 'upcoming';
  if (now <= end) return 'live';
  return 'ended';
}

function fmtCountdown(ms) {
  if (ms <= 0) return 'now';
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hrs = Math.floor((totalMin % 1440) / 60);
  const min = totalMin % 60;
  if (days > 0) return days + 'd ' + hrs + 'h';
  if (hrs > 0) return hrs + 'h ' + min + 'm';
  return min + 'm';
}

function fmtTestDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
    d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

// ─── Skeleton HTML ───────────────────────────────────────────────────────────
function _skeleton() {
  return `<div class="view-content">
    <div style="height:24px;width:140px;border-radius:8px;background:linear-gradient(90deg,var(--card) 25%,var(--card-light,#1b2648) 37%,var(--card) 63%);background-size:400% 100%;animation:shimmer 1.4s infinite;margin-bottom:8px;"></div>
    ${[1,2,3].map(()=>`<div style="height:72px;border-radius:14px;background:linear-gradient(90deg,var(--card) 25%,var(--card-light,#1b2648) 37%,var(--card) 63%);background-size:400% 100%;animation:shimmer 1.4s infinite;margin-bottom:10px;"></div>`).join('')}
  </div>`;
}

// ─── Main render (called by Router) ─────────────────────────────────────────
function renderTests() {
  // Start async render immediately
  renderTestsAsync();
  return _skeleton();
}

let lastTestsHash = null;
setInterval(() => {
  document.querySelectorAll('.live-timer-update').forEach(el => {
    const end = parseInt(el.getAttribute('data-end'), 10);
    if (!isNaN(end)) el.textContent = fmtCountdown(end - Date.now());
  });
}, 5000);

let _testsCache = null;

async function renderTestsAsync(forceUpdate = false) {
  if (_testsCache && !forceUpdate) {
    const mc = document.getElementById('main-content');
    if (mc) mc.innerHTML = '<div class="view-content">' + _buildTestsHtml(_testsCache) + '</div>';
    
    // Background fetch to update
    fetchTestsData().then(data => {
      _testsCache = data;
      if (typeof Router !== 'undefined' && Router.getCurrentRoute().route === 'tests') {
        const mc2 = document.getElementById('main-content');
        if (mc2) mc2.innerHTML = '<div class="view-content">' + _buildTestsHtml(data) + '</div>';
      }
    });
    return;
  }

  const data = await fetchTestsData();
  _testsCache = data;
  const html = _buildTestsHtml(data);
  const mc = document.getElementById('main-content');
  if (!mc) return;
  const onTests = typeof Router !== 'undefined' ? Router.getCurrentRoute().route === 'tests' : true;
  if (onTests) mc.innerHTML = '<div class="view-content">' + html + '</div>';
}

function _buildTestsHtml(data) {
  const all = data.tests || [];
  const attemptsArray = data.attempts || [];
  const attempts = {};
  attemptsArray.forEach(a => attempts[a.test_id] = a);

  const liveTests = all.filter(t => deriveTestPhase(t) === 'live');
  const upcoming = all.filter(t => deriveTestPhase(t) === 'upcoming')
    .sort((a, b) => new Date(a.publish_at) - new Date(b.publish_at));
  const ended = all.filter(t => deriveTestPhase(t) === 'ended')
    .sort((a, b) => new Date(b.publish_at) - new Date(a.publish_at));

  let html = `
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:4px;">Live Tests 🎯</h2>
    <div style="font-size:.82rem;color:var(--txt3);margin-bottom:16px;">Scheduled mock exams &amp; results</div>`;

  if (liveTests.length) {
    html += liveTests.map(t => {
      const end = new Date(t.publish_at).getTime() + (parseInt(t.timer, 10) || 30) * 60000;
      const left = fmtCountdown(end - Date.now());
      const already = attempts[t.id];
      return `<div class="test-live">
        <div class="test-live-header">
          <div class="live-dot"></div>
          <div class="test-live-title">${escapeHtml(t.title)}</div>
          <div class="test-badge">LIVE</div>
        </div>
        <div class="test-info">${escapeHtml(t.subject)} &bull; ${t.questions.length} Qs &bull; <span class="live-timer-update" data-end="${end}">${left}</span> left</div>
        <button class="test-btn" ${already ? 'disabled style="opacity:0.5;"' : ''} onclick="${already ? '' : `joinLiveTest('${t.id}')`}">${already ? 'Already Attempted' : 'Join Test'}</button>
      </div>`;
    }).join('');
  } else {
    html += `<div class="test-live" style="opacity:.55;">
      <div class="test-live-header"><div class="live-dot" style="background:var(--txt4);box-shadow:none;"></div><div class="test-live-title">No live test right now</div></div>
      <div class="test-info">Check Upcoming below — your next test will appear here the moment it goes live.</div>
    </div>`;
  }

  html += `<div class="sec-label">Upcoming</div><div class="recent-list">`;
  if (upcoming.length) {
    upcoming.forEach(t => {
      html += `<div class="recent-item">
        <div class="ri-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <div class="ri-text"><div class="ri-title">${escapeHtml(t.title)}</div><div class="ri-sub">${escapeHtml(t.subject)} &bull; ${fmtTestDateTime(t.publish_at)}</div></div>
        <div class="ri-prog" style="color:var(--txt3);font-size:.7rem;">in <span class="live-timer-update" data-end="${new Date(t.publish_at).getTime()}">${fmtCountdown(new Date(t.publish_at).getTime() - Date.now())}</span></div>
      </div>`;
    });
  } else {
    html += `<div style="font-size:.78rem;color:var(--txt3);padding:8px 2px;">Nothing scheduled yet.</div>`;
  }

  html += `</div><div class="sec-label">Past Results</div><div class="recent-list">`;
  if (ended.length) {
    ended.forEach(t => {
      const rec = attempts[t.id];
      const sub = rec
        ? `${escapeHtml(t.subject)} &bull; ${fmtTestDateTime(rec.end_time || rec.completed_at)}`
        : `${escapeHtml(t.subject)} &bull; Not attempted`;
      const pct = rec ? rec.score : null;
      const color = pct === null ? 'var(--txt3)' : pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
      const clickable = rec ? `onclick="viewPastTestResult('${t.id}')" style="cursor:pointer;"` : '';
      html += `<div class="recent-item" ${clickable}>
        <div class="ri-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <div class="ri-text"><div class="ri-title">${escapeHtml(t.title)}</div><div class="ri-sub">${sub}</div></div>
        <div class="ri-prog" style="color:${color};">${pct === null ? '—' : pct + '%'}</div>
      </div>`;
    });
  } else {
    html += `<div style="font-size:.78rem;color:var(--txt3);padding:8px 2px;">No past tests yet.</div>`;
  }
  html += '</div>';

  return '<div class="view-content">' + html + '</div>';
}

// ─── Home banner ─────────────────────────────────────────────────────────────
async function updateHomeLiveBanner() {
  const banner = document.querySelector('.live-banner');
  if (!banner) return;
  const data = await fetchTestsData();
  const all = data.tests || [];
  const live = all.find(t => deriveTestPhase(t) === 'live');
  const upNext = all.filter(t => deriveTestPhase(t) === 'upcoming')
    .sort((a, b) => new Date(a.publish_at) - new Date(b.publish_at))[0];

  const txtEl = banner.querySelector('.live-txt');
  const timeEl = banner.querySelector('.live-time');

  if (live) {
    banner.style.display = 'flex';
    if (txtEl) txtEl.textContent = live.title;
    if (timeEl) timeEl.textContent = 'Live now';
    banner.onclick = () => Router.navigate('tests');
  } else if (upNext) {
    banner.style.display = 'flex';
    if (txtEl) txtEl.textContent = upNext.title;
    if (timeEl) timeEl.textContent = 'Starts in ' + fmtCountdown(new Date(upNext.publish_at).getTime() - Date.now());
    banner.onclick = () => Router.navigate('tests');
  } else {
    banner.style.display = 'none';
  }
}

function initHome() { updateHomeLiveBanner(); }

function refreshTestsIfOpen() {
  const mcqOverlayOpen = document.getElementById('mcq-overlay')
    && document.getElementById('mcq-overlay').classList.contains('show');
  if (typeof Router !== 'undefined' && Router.getCurrentRoute().route === 'tests' && !mcqOverlayOpen) {
    _invalidateCache();
    renderTestsAsync();
  }
  if (!mcqOverlayOpen) updateHomeLiveBanner();
}

// ─── Live test attempt engine ────────────────────────────────────────────────
let testAttemptState = null;
let currentTestData = null;

async function joinLiveTest(testId) {
  // Optimistic UI — disable the button immediately
  const btn = document.querySelector(`.test-btn[onclick*="${testId}"]`);
  if (btn) { btn.disabled = true; btn.textContent = 'Joining…'; }

  const data = await fetchTestsData();
  const test = data.tests.find(t => String(t.id) === String(testId));
  if (!test || !test.questions || !test.questions.length) {
    showToast('Test not available');
    if (btn) { btn.disabled = false; btn.textContent = 'Join Test'; }
    return;
  }

  const email = (typeof AppState !== 'undefined' && AppState.user && AppState.user.email)
    || (JSON.parse(localStorage.getItem('pe_user') || '{}').email) || 'student';

  const attemptsKey = 'pe_user_attempts_' + email.replace(/[^a-zA-Z0-9]/g, '_');
  let userAttempts = [];
  try { userAttempts = JSON.parse(localStorage.getItem(attemptsKey) || '[]'); } catch(e) {}
  const alreadyAttempted = userAttempts.some(a => String(a.test_id) === String(test.id));
  if (alreadyAttempted) {
    showToast('You have already attempted this test.');
    if (btn) { btn.disabled = false; btn.textContent = 'Join Test'; }
    return;
  }

  currentTestData = test;
  const timerMin = parseInt(test.timer, 10) || 30;
  let secondsLeft = timerMin * 60;
  if (deriveTestPhase(test) === 'live') {
    const endMs = new Date(test.publish_at).getTime() + (timerMin * 60000);
    secondsLeft = Math.floor((endMs - Date.now()) / 1000);
    if (secondsLeft <= 0) { showToast('This test has already ended.'); return; }
  }

  testAttemptState = {
    testId: test.id, title: test.title, subject: test.subject,
    penalty: parseFloat(test.penalty) || 0,
    questions: test.questions, currentQ: 0,
    answers: new Array(test.questions.length).fill(null),
    locked: new Array(test.questions.length).fill(false),
    correctFlags: new Array(test.questions.length).fill(null),
    isFinished: false, secondsLeft, timerHandle: null
  };

  const overlay = document.getElementById('mcq-overlay');
  if (overlay) { overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
  if (AppState.settings.fullscreen && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  Router.hideBottomNav();
  Router.hideTopbar();
  startTestTimer();
  renderTestAttemptQuestion();
}

function startTestTimer() {
  stopTestTimer();
  testAttemptState.timerHandle = setInterval(() => {
    if (!testAttemptState) { clearInterval(testAttemptState.timerHandle); return; }
    testAttemptState.secondsLeft--;
    updateTestTimerDisplay();
    if (testAttemptState.secondsLeft <= 0) {
      stopTestTimer();
      showToast('Time up! Submitting your test');
      setTimeout(() => finishTestAttempt(), 600);
    }
  }, 1000);
}

function stopTestTimer() {
  if (testAttemptState && testAttemptState.timerHandle) {
    clearInterval(testAttemptState.timerHandle);
    testAttemptState.timerHandle = null;
  }
}

function updateTestTimerDisplay() {
  const el = document.getElementById('testAttemptTimer');
  if (!el || !testAttemptState) return;
  const t = Math.max(0, testAttemptState.secondsLeft);
  const m = Math.floor(t / 60), s = t % 60;
  const warn = t <= 60;
  el.className = 'quiz-timer per-q-timer' + (warn ? ' warning' : '');
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${m}:${String(s).padStart(2, '0')}`;
}

function renderTestAttemptQuestion() {
  const container = document.getElementById('mcq-overlay-inner');
  if (!container || !testAttemptState) return;
  const st = testAttemptState;
  const qIdx = st.currentQ;
  const q = st.questions[qIdx];
  const totalQ = st.questions.length;
  const progress = ((qIdx + 1) / totalQ) * 100;
  const locked = st.locked[qIdx];

  let bodyHtml = '';
  if (q.type === 'mcq') {
    let optionsHtml = '';
    q.options.forEach((opt, i) => {
      let extraClass = '';
      if (locked) {
        if (i === q.correctIndex) extraClass = 'correct';
        else if (i === st.answers[qIdx] && st.answers[qIdx] !== q.correctIndex) extraClass = 'wrong';
      }
      const noClick = locked ? 'pointer-events:none;' : '';
      optionsHtml += `<div class="quiz-option ${extraClass}" onclick="selectTestAnswer(${i})" style="${noClick}">
        <div class="quiz-option-letter">${String.fromCharCode(65 + i)}</div>
        <div class="quiz-option-text">${escapeHtml(opt)}</div>
      </div>`;
    });
    bodyHtml = `<div class="quiz-options">${optionsHtml}</div>`;
  } else {
    const val = st.answers[qIdx] || '';
    bodyHtml = `
      <textarea class="quiz-direct-input" id="testDirectInput" style="min-height:120px;transition:height .3s;" placeholder="Type your answer…" ${locked ? 'disabled' : ''} oninput="if(testAttemptState) testAttemptState.answers[${qIdx}]=this.value">${escapeHtml(val)}</textarea>
      ${locked ? `<div class="quiz-direct-correct"><strong>Answer submitted for review.</strong></div>` : ''}`;
  }

  let html = `
    <div class="quiz-header">
      <button class="quiz-close-btn" onclick="confirmQuitTestAttempt()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="quiz-progress-info">
        <div class="quiz-progress-text">Question ${qIdx + 1} of ${totalQ}</div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
      </div>
      <div class="quiz-timer per-q-timer" id="testAttemptTimer"></div>
    </div>
    ${window.liveXpBarHtml ? liveXpBarHtml() : ''}
    <div class="quiz-body">
      <div class="quiz-question-num-row"><div class="quiz-question-num">Question ${qIdx + 1} &bull; ${escapeHtml(st.subject)}</div></div>
      <div class="quiz-question">${escapeHtml(q.text)}</div>
      ${bodyHtml}
    </div>
    <div class="quiz-footer"><div class="quiz-footer-row">`;

  if (qIdx > 0) html += `<button class="btn-secondary" onclick="prevTestQuestion()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>Previous</button>`;

  if (q.type === 'direct' && !locked) {
    html += `<button class="btn-primary" onclick="submitTestDirectAnswer()">Submit Answer</button>`;
  } else if (qIdx < totalQ - 1) {
    html += `<button class="btn-primary" onclick="nextTestQuestion()">Next<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>`;
  } else {
    html += `<button class="btn-primary" onclick="finishTestAttempt()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Finish</button>`;
  }

  html += '</div></div>';
  container.innerHTML = html;

  const textarea = container.querySelector('#testDirectInput');
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    textarea.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; });
  }
  updateTestTimerDisplay();
}

function selectTestAnswer(optionIdx) {
  const st = testAttemptState;
  if (!st || st.locked[st.currentQ]) return;
  const qIdx = st.currentQ;
  st.answers[qIdx] = optionIdx;
  st.locked[qIdx] = true;
  st.correctFlags[qIdx] = optionIdx === st.questions[qIdx].correctIndex;
  if (st.correctFlags[qIdx] && window.awardXP) awardXP(5);
  renderTestAttemptQuestion();
}

function submitTestDirectAnswer() {
  const st = testAttemptState;
  if (!st) return;
  const qIdx = st.currentQ;
  const input = document.getElementById('testDirectInput');
  st.answers[qIdx] = ((input ? input.value : st.answers[qIdx]) || '').trim();
  st.locked[qIdx] = true;
  st.correctFlags[qIdx] = false;
  renderTestAttemptQuestion();
}

function nextTestQuestion() {
  if (!testAttemptState) return;
  if (testAttemptState.currentQ < testAttemptState.questions.length - 1) {
    testAttemptState.currentQ++;
    renderTestAttemptQuestion();
  }
}

function prevTestQuestion() {
  if (!testAttemptState) return;
  if (testAttemptState.currentQ > 0) {
    testAttemptState.currentQ--;
    renderTestAttemptQuestion();
  }
}

function confirmQuitTestAttempt() {
  if (confirm('Quit this test? Your progress will be lost.')) quitTestAttempt();
}

function quitTestAttempt() {
  stopTestTimer();
  closeTestOverlay();
  testAttemptState = null;
  refreshTestsIfOpen();
}

function closeTestOverlay() {
  const overlay = document.getElementById('mcq-overlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
  if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  Router.showBottomNav();
  Router.showTopbar();
}

function finishTestAttempt() {
  const st = testAttemptState;
  if (!st || st.isFinished) return;
  st.isFinished = true;
  stopTestTimer();

  let correctCount = 0, wrongCount = 0, skippedCount = 0;
  st.questions.forEach((q, i) => {
    if (!st.locked[i]) { skippedCount++; return; }
    if (st.correctFlags[i]) correctCount++; else wrongCount++;
  });
  const total = st.questions.length;
  const negDeduction = wrongCount * (st.penalty || 0);
  const netScore = Math.max(0, correctCount - negDeduction);
  const percentage = total ? Math.round((correctCount / total) * 100) : 0;

  const record = {
    testId: st.testId, title: st.title, subject: st.subject,
    total, correctCount, wrongCount, skippedCount, percentage, netScore,
    completedAt: new Date().toISOString(),
    questions: st.questions, answers: st.answers, correctFlags: st.correctFlags
  };

  // Invalidate cache so fresh data (including this attempt) is loaded next visit
  _invalidateCache();

  // LocalStorage submit
  const email = (typeof AppState !== 'undefined' && AppState.user && AppState.user.email)
    || (JSON.parse(localStorage.getItem('pe_user') || '{}').email) || 'student';
  const formattedAnswers = st.questions.map((q, i) => ({
    qIdx: i,
    answer_given: st.answers[i],
    is_correct: st.correctFlags[i],
    type: q.type,
    question: q.type === 'direct' ? q.text : undefined
  }));

  const attemptRecord = {
    test_id: st.testId,
    test_title: st.title,
    email: email,
    first_name: (typeof AppState !== 'undefined' && AppState.user && (AppState.user.firstName || AppState.user.username)) || 'Student',
    user_email: email,
    avatar: (typeof AppState !== 'undefined' && AppState.user && AppState.user.avatar) || null,
    score: percentage,
    correct_count: record.correct,
    total_questions: record.total,
    penalty_deductions: record.penaltyTotal,
    answers: JSON.stringify(formattedAnswers),
    created_at: new Date().toISOString()
  };

  try {
    const attemptsKey = 'pe_user_attempts_' + email.replace(/[^a-zA-Z0-9]/g, '_');
    const uAttempts = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
    uAttempts.push(attemptRecord);
    localStorage.setItem(attemptsKey, JSON.stringify(uAttempts));

    const testAttemptsKey = 'pe_test_attempts_' + st.testId;
    const tAttempts = JSON.parse(localStorage.getItem(testAttemptsKey) || '[]');
    tAttempts.push(attemptRecord);
    localStorage.setItem(testAttemptsKey, JSON.stringify(tAttempts));
  } catch(e) {}

  renderTestAttemptResults(record);
}

// ─── Student leaderboard ─────────────────────────────────────────────────────
async function fetchTestLeaderboard(testId) {
  try {
    const testAttemptsKey = 'pe_test_attempts_' + testId;
    const tAttempts = JSON.parse(localStorage.getItem(testAttemptsKey) || '[]');
    if (tAttempts && tAttempts.length > 0) {
      return tAttempts.sort((a,b) => (b.score||0) - (a.score||0));
    }
  } catch(e) {}
  return [
    { first_name: 'Priya Sharma', user_email: 'priya@test.com', score: 92, avatar: null },
    { first_name: 'Rahul Mehta', user_email: 'rahul@test.com', score: 85, avatar: null },
    { first_name: 'Ananya Kapoor', user_email: 'ananya@test.com', score: 76, avatar: null }
  ];
}

function _renderStudentLeaderboard(entries) {
  if (!entries || !entries.length) return '';
  const medals = ['🥇', '🥈', '🥉'];
  const rows = entries.slice(0, 10).map((e, i) => {
    const pfp = e.avatar && e.avatar !== 'img/default_avatar.svg'
      ? `<img src="${escapeHtml(e.avatar)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.outerHTML=window.getDefaultAvatarSVG()">`
      : window.getDefaultAvatarSVG();
    const rankLabel = i < 3 ? medals[i] : `#${i + 1}`;
    return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06);">
      <span style="width:28px;text-align:center;font-size:${i < 3 ? '1.1rem' : '.78rem'};font-weight:700;flex-shrink:0;color:${i < 3 ? '#fff' : 'var(--txt3)'};">${rankLabel}</span>
      <div style="width:32px;height:32px;border-radius:50%;flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,#8B5CF6,#4F46E5);">${pfp}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.84rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(e.first_name || e.username || e.user_email || '—')}</div>
      </div>
      <div style="font-family:var(--mono,monospace);font-size:.8rem;font-weight:800;color:${e.score >= 70 ? 'var(--green,#35d4a3)' : e.score >= 50 ? 'var(--amber,#ffb534)' : 'var(--red,#ff7c7c)'};">${e.score != null ? e.score + '%' : '—'}</div>
    </div>`;
  }).join('');
  return `<div style="margin-top:20px;">
    <div class="sec-label" style="margin-bottom:10px;">Leaderboard 🏆</div>
    <div style="background:var(--card,#11192f);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:0 14px;">${rows}</div>
  </div>`;
}

// ─── Results screen ──────────────────────────────────────────────────────────
function renderTestAttemptResults(record, lbEntries) {
  const container = document.getElementById('mcq-overlay-inner');
  if (!container) return;
  const scoreDeg = (record.percentage / 100) * 360;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const reviewHtml = record.questions.map((q, i) => {
    const locked = record.answers[i] !== null && record.answers[i] !== undefined && record.answers[i] !== '';
    const isCorrect = record.correctFlags[i];
    const statusClass = !locked ? 'skipped' : (isCorrect ? 'correct' : 'wrong');
    let ansText = '';
    if (q.type === 'mcq') {
      if (!locked) ansText = `<span class="correct-ans">Correct: ${letters[q.correctIndex]}. ${escapeHtml(q.options[q.correctIndex])}</span>`;
      else if (isCorrect) ansText = `<span class="correct-ans">Correct! ${letters[q.correctIndex]}. ${escapeHtml(q.options[q.correctIndex])}</span>`;
      else ansText = `<span class="your-ans">Your answer: ${letters[record.answers[i]]}. ${escapeHtml(q.options[record.answers[i]])}</span> &middot; <span class="correct-ans">Correct: ${letters[q.correctIndex]}. ${escapeHtml(q.options[q.correctIndex])}</span>`;
    } else {
      ansText = !locked
        ? `<span class="correct-ans">Answer will be manually reviewed.</span>`
        : `<span class="your-ans">You wrote: ${escapeHtml(record.answers[i] || '')}</span> &middot; <span class="correct-ans">Submitted for manual review.</span>`;
    }
    return `<div class="quiz-review-item ${statusClass}">
      <div class="qr-q">${i + 1}. ${escapeHtml(q.text)}</div>
      <div class="qr-ans">${ansText}</div>
    </div>`;
  }).join('');

  const lbHtml = lbEntries ? _renderStudentLeaderboard(lbEntries) : '';

  container.innerHTML = `
    <div class="quiz-header">
      <button class="quiz-close-btn" onclick="closeTestAttemptResults()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <h2 style="font-size:1rem;font-weight:700;">Test Results</h2>
      <div style="width:36px;"></div>
    </div>
    <div class="quiz-body">
      <div class="quiz-result-header">
        <div class="quiz-result-score" style="--score-deg:${scoreDeg}deg;"><div class="quiz-result-score-inner">${record.percentage}%</div></div>
        <div class="quiz-result-title">${record.percentage >= 70 ? 'Excellent!' : record.percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}</div>
        <div class="quiz-result-subtitle">Correct: ${record.correctCount} / ${record.total}${record.netScore !== record.correctCount ? ` &bull; Net: ${record.netScore.toFixed(2)}` : ''}</div>
      </div>
      <div class="quiz-result-stats">
        <div class="quiz-result-stat correct"><div class="qrs-val">${record.correctCount}</div><div class="qrs-lbl">Correct</div></div>
        <div class="quiz-result-stat wrong"><div class="qrs-val">${record.wrongCount}</div><div class="qrs-lbl">Wrong</div></div>
        <div class="quiz-result-stat skipped"><div class="qrs-val">${record.skippedCount}</div><div class="qrs-lbl">Skipped</div></div>
      </div>
      ${lbHtml}
      <div class="sec-label" style="margin-top:20px;">Review Answers</div>
      <div class="quiz-review-list">${reviewHtml}</div>
      <div style="height:20px;"></div>
    </div>
    <div class="quiz-footer">
      <button class="btn-primary" onclick="closeTestAttemptResults()">Done</button>
    </div>`;

  // Fetch leaderboard async and inject when ready (only if not already passed in)
  if (!lbEntries && record.testId) {
    fetchTestLeaderboard(record.testId).then(entries => {
      const lbSlot = container.querySelector('.quiz-result-stats');
      if (lbSlot && entries && entries.length) {
        const lbDiv = document.createElement('div');
        lbDiv.innerHTML = _renderStudentLeaderboard(entries);
        lbSlot.insertAdjacentElement('afterend', lbDiv.firstElementChild);
      }
    });
  }
}

function closeTestAttemptResults() {
  closeTestOverlay();
  testAttemptState = null;
  Router.navigate('tests');
}

// ─── View past result ──────────────────────────
async function viewPastTestResult(testId) {
  const data = await fetchTestsData();
  const attempt = (data.attempts || []).find(a => String(a.test_id) === String(testId));
  const test = (data.tests || []).find(t => String(t.id) === String(testId));
  if (!attempt || !test) { showToast('Result not available'); return; }

  const overlay = document.getElementById('mcq-overlay');
  if (overlay) { overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
  Router.hideBottomNav();
  Router.hideTopbar();

  // Parse saved answers to reconstruct partial review
  let savedAnswers = [];
  try { savedAnswers = JSON.parse(attempt.answers || '[]'); } catch(e) {}

  const answersArr = test.questions.map((q, i) => {
    const saved = savedAnswers.find(a => a.qIdx === i);
    return saved ? saved.answer_given : null;
  });
  const correctFlagsArr = test.questions.map((q, i) => {
    const saved = savedAnswers.find(a => a.qIdx === i);
    return saved ? (saved.is_correct === true) : false;
  });

  const total = test.questions.length;
  const correctCount = correctFlagsArr.filter(Boolean).length;
  const wrongCount = savedAnswers.filter(a => a.type === 'mcq' && a.is_correct === false).length;

  const record = {
    testId: test.id, title: test.title, subject: test.subject,
    percentage: attempt.score,
    correctCount,
    total,
    wrongCount,
    skippedCount: total - savedAnswers.length,
    netScore: attempt.score != null ? Math.round(total * attempt.score / 100) : correctCount,
    questions: test.questions,
    answers: answersArr,
    correctFlags: correctFlagsArr
  };

  // Fetch leaderboard in background then render both together
  const lbEntries = await fetchTestLeaderboard(testId);
  renderTestAttemptResults(record, lbEntries);
}

// ─── Exports ─────────────────────────────────────────────────────────────────
window.renderTests = renderTests;
window.initHome = initHome;
window.refreshTestsIfOpen = refreshTestsIfOpen;
window.joinLiveTest = joinLiveTest;
window.selectTestAnswer = selectTestAnswer;
window.submitTestDirectAnswer = submitTestDirectAnswer;
window.nextTestQuestion = nextTestQuestion;
window.prevTestQuestion = prevTestQuestion;
window.confirmQuitTestAttempt = confirmQuitTestAttempt;
window.finishTestAttempt = finishTestAttempt;
window.closeTestAttemptResults = closeTestAttemptResults;
window.viewPastTestResult = viewPastTestResult;

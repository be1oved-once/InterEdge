// ============================================
// InterEdge - Main Application Logic
// ============================================

window.formatXP = function(xp) {
  if (xp >= 1000) {
    return +(xp / 1000).toFixed(2) + 'k';
  }
  return xp.toString();
};

// ===== PAUSED PRACTICE BANNER =====
function getPausedPracticeBanner() {
  const saved = localStorage.getItem('pausedQuizState');
  if (!saved) return '';
  
  try {
    const state = JSON.parse(saved);
    if (!state || state.isFinished || !state.questions || state.questions.length === 0) return '';
    
    // We want a highly premium, aesthetic banner compatible with both light and dark themes
    const progress = Math.round((state.currentQ / state.questions.length) * 100);
    const score = state.score || 0;
    
    return `
      <div class="resume-banner" style="
        background: var(--card);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: -50px;
          right: -50px;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
          opacity: 0.15;
          border-radius: 50%;
          pointer-events: none;
        "></div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 1;">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="
              width: 44px; height: 44px;
              border-radius: 12px;
              background: var(--accent);
              opacity: 0.9;
              display: flex; align-items: center; justify-content: center;
              color: #fff;
            ">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><polygon points="5 3 19 12 5 21 5 3"/><line x1="19" y1="12" x2="19" y2="12" style="stroke-width: 4;"/></svg>
            </div>
            <div>
              <div style="color: var(--txt3); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 4px;">Paused Practice</div>
              <div style="color: var(--txt); font-size: 1.05rem; font-weight: 700;">${state._customTitle || 'Chapter Practice'}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="color: var(--green); font-weight: 700; font-size: 1.1rem;">${score} <span style="font-size:0.75rem; color:var(--txt3);">PTS</span></div>
            <div style="color: var(--txt2); font-size: 0.8rem;">Q${state.currentQ + 1} of ${state.questions.length}</div>
          </div>
        </div>
        
        <div style="width: 100%; height: 6px; background: var(--bg); border-radius: 3px; overflow: hidden; z-index: 1; border: 1px solid var(--border);">
          <div style="height: 100%; width: ${progress}%; background: var(--accent); border-radius: 3px;"></div>
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 4px; z-index: 1;">
          <button onclick="window.resumePausedQuiz()" style="
            flex: 1;
            padding: 12px;
            background: var(--accent);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            transition: transform 0.2s, filter 0.2s;
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.filter='brightness(1.1)';" onmouseout="this.style.transform='none'; this.style.filter='brightness(1)';">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width: 18px; height: 18px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Resume Now
          </button>
          <button onclick="window.discardPausedQuiz()" style="
            padding: 12px 16px;
            background: transparent;
            color: var(--txt2);
            border: 1px solid var(--border);
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
          " onmouseover="this.style.background='rgba(255,50,50,0.1)'; this.style.color='var(--red)'; this.style.borderColor='rgba(255,50,50,0.3)';" onmouseout="this.style.background='transparent'; this.style.color='var(--txt2)'; this.style.borderColor='var(--border)';">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </div>
    `;
  } catch(e) {
    return '';
  }
}

// ===== HOME =====
function renderHome() {
  const user = AppState.user;
  const firstName = user.firstName || 'User';
  
  let streakLevel = 'level-0';
  if (AppState.streak >= 1 && AppState.streak < 3) streakLevel = 'level-1';
  else if (AppState.streak >= 3 && AppState.streak < 7) streakLevel = 'level-2';
  else if (AppState.streak >= 7) streakLevel = 'level-max';
  return getPausedPracticeBanner() + `
    <div class="greet">
      <div class="greet-sub">Good ${getTimeOfDay()}</div>
      <div class="greet-name">${escapeHtml(firstName)}</div>
    </div>
    <div class="streak-banner">
      <div class="fire-wrap ${streakLevel}" onclick="openGoalModal()">
        <div class="frozen-tooltip">Streak frozen</div>
        <svg class="fire-svg-frozen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="width: 44px; height: 44px; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); z-index: 2; pointer-events: none;">
          <defs>
            <linearGradient id="f4outer" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#7c4dff"/>
              <stop offset="50%" stop-color="#2979ff"/>
              <stop offset="100%" stop-color="#00b0ff"/>
            </linearGradient>
            <linearGradient id="f4inner" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#e0f7fa"/>
              <stop offset="100%" stop-color="#80d8ff"/>
            </linearGradient>
            <radialGradient id="f4core" cx="50%" cy="65%" r="50%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="40%" stop-color="#e1f5fe"/>
              <stop offset="100%" stop-color="#40c4ff" stop-opacity="0"/>
            </radialGradient>
            <filter id="f4glow">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <ellipse cx="24" cy="43" rx="9" ry="3" fill="#2979ff" opacity="0.4">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2.2s" repeatCount="indefinite"/>
            <animate attributeName="rx" values="8;11;8" dur="2.2s" repeatCount="indefinite"/>
          </ellipse>
          <line x1="24" y1="2" x2="24" y2="8" stroke="#b3e5fc" stroke-width="1.2" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.5s" repeatCount="indefinite"/>
          </line>
          <line x1="21" y1="4" x2="27" y2="4" stroke="#b3e5fc" stroke-width="1" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.3;0.6" dur="1.5s" repeatCount="indefinite"/>
          </line>
          <path d="M24 6 C21 11,14 16,13 22 C12 28,16 31,14 36 C12 40,17 45,24 45 C31 45,36 40,34 36 C32 31,36 28,35 22 C34 16,27 11,24 6Z" fill="url(#f4outer)" filter="url(#f4glow)">
            <animateTransform attributeName="transform" type="skewX" values="0;1;-1.2;0.5;0" dur="1.6s" repeatCount="indefinite"/>
          </path>
          <path d="M24 18 C22 22,18 25,18 30 C18 36,21 40,24 40 C27 40,30 36,30 30 C30 25,26 22,24 18Z" fill="url(#f4inner)" filter="url(#f4glow)">
            <animateTransform attributeName="transform" type="scale" values="1 1;0.96 1.04;1.03 0.97;1 1" additive="sum" dur="1.1s" repeatCount="indefinite"/>
          </path>
          <ellipse cx="24" cy="31" rx="4.5" ry="6.5" fill="url(#f4core)">
            <animate attributeName="ry" values="6.5;8;6;6.5" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.85;1" dur="1s" repeatCount="indefinite"/>
          </ellipse>
        </svg>
        <svg class="fire-svg-hot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="width: 44px; height: 44px; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); z-index: 2; pointer-events: none;">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="70%" r="55%">
              <stop offset="0%" stop-color="#fff7a0" stop-opacity="1"/>
              <stop offset="35%" stop-color="#ffd040" stop-opacity="1"/>
              <stop offset="100%" stop-color="#ff6a00" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="outerFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#ff3d00" stop-opacity="0.9"/>
              <stop offset="50%" stop-color="#ff8c00" stop-opacity="1"/>
              <stop offset="100%" stop-color="#ffb700" stop-opacity="1"/>
            </linearGradient>
            <linearGradient id="innerFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#fff176" stop-opacity="0.95"/>
              <stop offset="60%" stop-color="#ffd740" stop-opacity="1"/>
              <stop offset="100%" stop-color="#ffab00" stop-opacity="1"/>
            </linearGradient>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="softglow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <ellipse cx="24" cy="42" rx="10" ry="4" fill="#ff6a00" opacity="0.35" filter="url(#softglow)">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="rx" values="9;12;9" dur="1.8s" repeatCount="indefinite"/>
          </ellipse>
          <path d="M24 4 C22 10, 14 14, 13 20 C12 26, 15 28, 13 32 C11 36, 14 44, 24 44 C34 44, 37 36, 35 32 C33 28, 36 26, 35 20 C34 14, 26 10, 24 4Z" fill="url(#outerFlame)" filter="url(#glow)">
            <animateTransform attributeName="transform" type="scale" values="1 1;1.03 0.98;0.97 1.02;1 1" additive="sum" dur="1.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"/>
          </path>
          <path d="M20 14 C17 18, 13 20, 14 27 C15 30, 17 28, 18 32" fill="none" stroke="#ff6a00" stroke-width="3" stroke-linecap="round" opacity="0.6">
            <animate attributeName="d" values="M20 14 C17 18, 13 20, 14 27 C15 30, 17 28, 18 32; M20 16 C16 19, 12 21, 13 27 C14 31, 17 29, 18 33; M20 14 C17 18, 13 20, 14 27 C15 30, 17 28, 18 32" dur="1.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.6s" repeatCount="indefinite"/>
          </path>
          <path d="M28 14 C31 18, 35 20, 34 27 C33 30, 31 28, 30 32" fill="none" stroke="#ff8c00" stroke-width="3" stroke-linecap="round" opacity="0.6">
            <animate attributeName="d" values="M28 14 C31 18, 35 20, 34 27 C33 30, 31 28, 30 32; M28 16 C32 19, 36 21, 35 27 C34 31, 31 29, 30 33; M28 14 C31 18, 35 20, 34 27 C33 30, 31 28, 30 32" dur="1.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0.6;0.25;0.6" dur="1.9s" repeatCount="indefinite"/>
          </path>
          <path d="M24 16 C22 20, 17 23, 17 29 C17 35, 20 38, 24 38 C28 38, 31 35, 31 29 C31 23, 26 20, 24 16Z" fill="url(#innerFlame)" filter="url(#glow)">
            <animateTransform attributeName="transform" type="scale" values="1 1;0.97 1.03;1.02 0.97;1 1" additive="sum" dur="1.1s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"/>
          </path>
          <ellipse cx="24" cy="30" rx="5" ry="7" fill="url(#coreGlow)" opacity="0.9">
            <animate attributeName="ry" values="7;8.5;6.5;7" dur="0.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0.9;1;0.85;0.9" dur="0.9s" repeatCount="indefinite"/>
          </ellipse>
          <path d="M24 4 C23 7, 21 9, 22 12 C23 9, 25 7, 24 4Z" fill="#fff7a0" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.9;0.5;0.8" dur="0.7s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0 0; -0.5 -1; 0.5 -0.5; 0 0" dur="0.7s" repeatCount="indefinite"/>
          </path>
        </svg>
        <div class="fire-particle"></div><div class="fire-particle"></div>
        <div class="fire-particle"></div><div class="fire-particle"></div><div class="fire-particle"></div>
      </div>
      <div>
        <div class="streak-num">${AppState.streak}</div>
        <div class="streak-label">Day streak</div>
      </div>
      <div class="streak-bar-wrap" onclick="openGoalModal()" style="cursor:pointer;">
        <div class="goal-info-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="11" height="11" style="color:var(--amber);flex-shrink:0;"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>
          <span class="goal-chip-text">Goal: <strong>${AppState.streak}</strong> / <strong>${AppState.streakGoal > 0 ? AppState.streakGoal : '?'}</strong> Days</span>
          ${AppState.streakGoal > 0 ? `<span class="goal-chip-pct">${Math.min(Math.round((AppState.streak/AppState.streakGoal)*100), 100)}%</span>` : ''}
        </div>
        <div class="streak-bar"><div class="streak-fill" style="width:${AppState.streakGoal > 0 ? Math.min((AppState.streak / AppState.streakGoal)*100, 100) : 0}%"></div></div>
      </div>
    </div>
    ${generateStreakWarningBox()}
    <div class="live-banner" onclick="Router.navigate('home', {panel: 'pdfLibrary'})" style="cursor:pointer;">
      <div class="live-dot" style="background:var(--accent);"></div>
      <div class="live-txt">PDF Library — PYQ, MTPs & RTPs Now Available</div>
      <div class="live-time">View →</div>
    </div>
    <div class="sec-label">Quick Access</div>
    <div class="quick-grid">
      <div class="q-card accent" onclick="Router.navigate('practice')">
        <div class="q-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <div class="q-title">Practice MCQ</div><div class="q-sub">Resume Chapter 4</div>
      </div>
      <div class="q-card" onclick="Router.navigate('home', {panel: 'pdfLibrary'})">
        <div class="q-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
        <div class="q-title">PDF Library</div><div class="q-sub">PYQ · MTPs · RTPs</div>
      </div>
      <div class="q-card" onclick="openFs('bookmarks')">
        <div class="q-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></div>
        <div class="q-title">Bookmarks</div><div class="q-sub">14 saved Qs</div>
      </div>
      <div class="q-card" onclick="Router.navigate('home', {panel: 'crux'})">
        <div class="q-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
        <div class="q-title">Crux</div><div class="q-sub">Insights & Strategy</div>
      </div>
    </div>
    <div class="q-card" style="margin-top:12px; background:linear-gradient(135deg, rgba(91,108,255,0.05), transparent); border-color:rgba(91,108,255,0.3); display:flex; flex-direction:row; align-items:center; gap:16px; padding:16px; justify-content:flex-start; width:100%; box-sizing:border-box;" onclick="openProfileOverlay('community')">
      <div class="q-icon" style="color:var(--accent); margin-bottom:0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
      <div>
        <div class="q-title" style="font-size:0.95rem;">Community Thoughts</div>
        <div class="q-sub" style="font-size:0.8rem; margin-top:2px;">Share & discuss with peers</div>
      </div>
    </div>
    <div class="sec-label">Continue where you left off</div>
    <div class="recent-list" style="position:relative;">
      <div class="glass-overlay-soon"><span>Coming Soon</span></div>
      <div class="recent-item">
        <div class="ri-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <div class="ri-text"><div class="ri-title">Accounts — Chapter 3: Partnership</div><div class="ri-sub">45 Qs · Last: 2h ago</div></div>
        <div class="ri-prog">68%</div>
      </div>
      <div class="recent-item">
        <div class="ri-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <div class="ri-text"><div class="ri-title">Business Laws — Chapter 6: Contract Act</div><div class="ri-sub">60 Qs · Last: Yesterday</div></div>
        <div class="ri-prog">42%</div>
      </div>
      <div class="recent-item">
        <div class="ri-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="7" r="1.5"/><line x1="8.5" y1="15.5" x2="10.5" y2="13.5"/><line x1="13.5" y1="10.5" x2="15.5" y2="8.5"/></svg></div>
        <div class="ri-text"><div class="ri-title">Maths — RTP Paper Nov 23</div><div class="ri-sub">80 Qs · Last: 3d ago</div></div>
        <div class="ri-prog">91%</div>
      </div>
    </div>
  `;
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function applyGuestRestrictions(html) {
  const urlParams = new URLSearchParams(window.location.search);
  const overrideGlass = urlParams.get('overrideGlass') === '1';

  if (AppState.isGuest && !overrideGlass) {
    return `
      <div class="restricted-by-guest">
        ${html}
        <div class="guest-glass-overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <h3>Login Required</h3>
          <p>Create a free account to unlock this feature and sync your progress.</p>
          <button class="guest-glass-btn" onclick="openAuthOverlay()">Log In or Sign Up</button>
        </div>
      </div>
    `;
  }
  return html;
}

function initHome() {
  if (localStorage.getItem('pe_pending_goal_choice') === 'true') {
    setTimeout(() => {
      if (window.openGoalModal) window.openGoalModal(false);
    }, 500);
  } else if (AppState.streakGoal === 0) {
    setTimeout(() => {
      if (window.openGoalModal) window.openGoalModal(false);
    }, 1000);
  } else {
    checkStreakGoal();
  }
}

function generateStreakWarningBox() {
  const today = new Date().toISOString().split('T')[0];
  if (AppState.last_xp_date === today && AppState.streak > 0) return '';
  
  const messages = [
    "Don't be a weakling. Practice now.",
    "Are you giving up already?",
    "Your streak is crying. Save it.",
    "Prove you are not a quitter.",
    "Success requires consistency. Don't stop.",
    "Excuses won't build your streak.",
    "Only losers break their streak."
  ];

  const msg = messages[Math.floor(Math.random() * messages.length)];

  const boxHtml = `
    <div class="xp-warning-banner" onclick="Router.navigate('practice')">
      <div class="xp-wb-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      </div>
      <div class="xp-wb-content">
        <div class="xp-wb-title">${msg}</div>
      </div>
      <svg class="xp-wb-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </div>
  `;

  return boxHtml;
}

// ============================================
// 5 CUSTOM 3D VECTOR TIER BADGES (NO EMOJIS)
// 1. Rookie (🌱 3D Seedling Crystal)
// 2. Grinder (⚡ 3D Lightning Prism)
// 3. Hustler (🔥 3D Flame Crest)
// 4. Focused (🎯 3D Bullseye Shield)
// 5. In The Zone (🧠 3D Neural Matrix Core)
// ============================================
function getTierSvg(tier, size = 18) {
  const t = (tier || '').toLowerCase();
  
  if (t.includes('zone')) {
    // 5. In The Zone — 3D Neural Brain Matrix Crystal
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="filter:drop-shadow(0 2px 6px rgba(168,85,247,0.5));">
      <defs>
        <linearGradient id="tz_base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="50%" stop-color="#9333ea"/>
          <stop offset="100%" stop-color="#581c87"/>
        </linearGradient>
        <linearGradient id="tz_glow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#f3e8ff"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#tz_base)" stroke="#e9d5ff" stroke-width="1.2"/>
      <path d="M16 6 C12 6 9 9 9 13 C9 15 10 17 11 18 C10 19 10 21 11 23 C12 25 14 26 16 26 C18 26 20 25 21 23 C22 21 22 19 21 18 C22 17 23 15 23 13 C23 9 20 6 16 6 Z" fill="url(#tz_glow)" opacity="0.95"/>
      <circle cx="16" cy="12" r="2.2" fill="#ffffff"/>
      <circle cx="13" cy="18" r="1.8" fill="#ffffff"/>
      <circle cx="19" cy="18" r="1.8" fill="#ffffff"/>
      <line x1="16" y1="12" x2="13" y2="18" stroke="#7e22ce" stroke-width="1.2"/>
      <line x1="16" y1="12" x2="19" y2="18" stroke="#7e22ce" stroke-width="1.2"/>
      <line x1="13" y1="18" x2="19" y2="18" stroke="#7e22ce" stroke-width="1.2"/>
      <circle cx="16" cy="22" r="1.5" fill="#fdf4ff"/>
      <line x1="13" y1="18" x2="16" y2="22" stroke="#7e22ce" stroke-width="1.2"/>
      <line x1="19" y1="18" x2="16" y2="22" stroke="#7e22ce" stroke-width="1.2"/>
    </svg>`;
  }
  
  if (t.includes('focus')) {
    // 4. Focused — 3D Concentric Bullseye Shield & Arrow Vector
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="filter:drop-shadow(0 2px 6px rgba(6,182,212,0.45));">
      <defs>
        <linearGradient id="fc_out" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="60%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
        <radialGradient id="fc_mid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="40%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#fc_out)" stroke="#bae6fd" stroke-width="1.2"/>
      <circle cx="16" cy="16" r="10" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1"/>
      <circle cx="16" cy="16" r="6.5" fill="url(#fc_mid)"/>
      <circle cx="16" cy="16" r="3" fill="#ffffff"/>
      <line x1="16" y1="4" x2="16" y2="8" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="16" y1="24" x2="16" y2="28" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="4" y1="16" x2="8" y2="16" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="24" y1="16" x2="28" y2="16" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`;
  }
  
  if (t.includes('hustle')) {
    // 3. Hustler — 3D Faceted Fire Flame Crest
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="filter:drop-shadow(0 2px 6px rgba(239,68,68,0.5));">
      <defs>
        <linearGradient id="hs_out" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#f87171"/>
          <stop offset="50%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
        <linearGradient id="hs_core" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#ef4444"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#450a0a" stroke="#fca5a5" stroke-width="1.2"/>
      <path d="M16 4 C14 8 10 11 10 16 C10 21 13 25 16 26 C19 25 22 21 22 16 C22 11 18 8 16 4 Z" fill="url(#hs_out)"/>
      <path d="M16 11 C14 14 12 16 12 19 C12 22 14 24 16 24 C18 24 20 22 20 19 C20 16 18 14 16 11 Z" fill="url(#hs_core)"/>
      <ellipse cx="16" cy="20" rx="2" ry="2.5" fill="#ffffff" opacity="0.9"/>
    </svg>`;
  }
  
  if (t.includes('grind')) {
    // 2. Grinder — 3D Lightning Thunderbolt Prism
    return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="filter:drop-shadow(0 2px 6px rgba(245,158,11,0.5));">
      <defs>
        <linearGradient id="gr_out" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="60%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="gr_facet" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#fde047"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#451a03" stroke="#fde68a" stroke-width="1.2"/>
      <polygon points="17 4 9 16 15 16 13 28 23 14 17 14" fill="url(#gr_out)"/>
      <polygon points="17 4 15 14 15 16 17 14 23 14" fill="url(#gr_facet)" opacity="0.8"/>
    </svg>`;
  }
  
  // 1. Rookie (Default) — 3D Emerald Sprout Seedling
  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" style="filter:drop-shadow(0 2px 6px rgba(16,185,129,0.45));">
    <defs>
      <linearGradient id="rk_out" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#34d399"/>
        <stop offset="50%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#065f46"/>
      </linearGradient>
      <linearGradient id="rk_leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a7f3d0"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="14" fill="#064e3b" stroke="#6ee7b7" stroke-width="1.2"/>
    <path d="M16 26 C16 18 16 14 16 12" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 14 C13 9 7 11 8 16 C9 20 15 17 16 14 Z" fill="url(#rk_leaf)"/>
    <path d="M16 12 C19 7 25 9 24 14 C23 18 17 15 16 12 Z" fill="url(#rk_out)"/>
    <ellipse cx="16" cy="25" rx="3.5" ry="1.2" fill="#a7f3d0" opacity="0.7"/>
  </svg>`;
}

// User level calculation (1 to 50 levels)
function calculateUserLevel(xp) {
  const lvl = Math.min(50, Math.max(1, Math.floor((xp || 0) / 150) + 1));
  const currentLvlBaseXP = (lvl - 1) * 150;
  const progressInLvl = Math.max(0, (xp || 0) - currentLvlBaseXP);
  const pct = lvl >= 50 ? 100 : Math.min(100, Math.round((progressInLvl / 150) * 100));
  const xpToNext = lvl >= 50 ? 0 : Math.max(0, 150 - progressInLvl);
  return {
    level: lvl,
    progressInLvl,
    pct,
    xpToNext
  };
}

// ===== PRACTICE SECTION (All 6 CA Intermediate Papers) =====
window.practiceMode = 'mcq'; // 'mcq' or 'flashcards'

function getSubjectOutlineSvg(subId) {
  switch (subId) {
    case 'adv_acc':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/></svg>`;
    case 'law':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    case 'tax':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/></svg>`;
    case 'cost':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`;
    case 'audit':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
    case 'fmsm':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
    default:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  }
}

function renderPractice() {
  const SUBJECT_KEYS = ['adv_acc', 'law', 'tax', 'cost', 'audit', 'fmsm'];
  const subjects = SUBJECT_KEYS.map(k => MCQ_DATA[k]).filter(Boolean);
  const grp1 = subjects.filter(s => s.group === 'Group 1');
  const grp2 = subjects.filter(s => s.group === 'Group 2');

  return getPausedPracticeBanner() + `
    <!-- Top Stats Strip (PathEdge Style) -->
    <div class="stat-row" style="margin-top: 4px; margin-bottom: 20px;">
      <div class="stat-card">
        <div class="stat-val indigo">${(AppState.questionsAttempted || 0).toLocaleString()}</div>
        <div class="stat-lbl">Qs Attempted</div>
      </div>
      <div class="stat-card">
        <div class="stat-val green">${AppState.accuracy || 0}%</div>
        <div class="stat-lbl">Accuracy</div>
      </div>
      <div class="stat-card">
        <div class="stat-val amber">${formatXP(AppState.xp || 0)}</div>
        <div class="stat-lbl">XP Earned</div>
      </div>
    </div>

    <!-- GROUP 1 SUBJECTS -->
    <div class="sec-label" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span>Group 1 &bull; Core Papers</span>
      <span style="font-size:0.72rem; color:var(--txt3); font-weight:500; text-transform:none; letter-spacing:normal;">Papers 1, 2, 3</span>
    </div>
    <div class="sub-grid">
      ${grp1.map((sub, i) => renderSubjectCard(sub, i === 2)).join('')}
    </div>

    <!-- GROUP 2 SUBJECTS -->
    <div class="sec-label" style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; margin-bottom:12px;">
      <span>Group 2 &bull; Applied Papers</span>
      <span style="font-size:0.72rem; color:var(--txt3); font-weight:500; text-transform:none; letter-spacing:normal;">Papers 4, 5, 6</span>
    </div>
    <div class="sub-grid">
      ${grp2.map((sub, i) => renderSubjectCard(sub, i === 2)).join('')}
    </div>

    <!-- PRACTICE MODES -->
    <div class="sec-label" style="margin-top:24px; margin-bottom:12px;">Practice Modes</div>
    <div class="recent-list">
      <div class="recent-item" onclick="openMtpRtp('mtp')">
        <div class="ri-icon" style="background:rgba(91,108,255,0.1); color:var(--accent);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
        <div class="ri-text"><div class="ri-title">ICAI MTP Simulator</div><div class="ri-sub">Full-length timed exam papers with AIR benchmark</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="recent-item" onclick="openMtpRtp('rtp')">
        <div class="ri-icon" style="background:rgba(16,185,129,0.1); color:var(--green);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <div class="ri-text"><div class="ri-title">Revision Test Papers (RTP)</div><div class="ri-sub">May 2027 amendments &amp; case studies</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="recent-item" onclick="openSubjectDrilldown('adv_acc')">
        <div class="ri-icon" style="background:rgba(139,92,246,0.1); color:var(--accent2);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
        <div class="ri-text"><div class="ri-title">Theory Flashcards &amp; Recall</div><div class="ri-sub">Active recall decks for Accounting Standards &amp; Laws</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="recent-item" onclick="openFs('bookmarks')">
        <div class="ri-icon" style="background:rgba(245,158,11,0.1); color:var(--amber);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></div>
        <div class="ri-text"><div class="ri-title">Bookmarked Case Scenarios</div><div class="ri-sub">${(window.BOOKMARKS_DATA||[]).length} saved questions for active revision</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  `;
}

function renderSubjectCard(sub, isSpan2 = false) {
  const chCount = (sub.chapters || []).length;
  let qCount = 0;
  (sub.chapters || []).forEach(c => {
    qCount += (c.questions || []).length;
    (c.caseScenarios || []).forEach(cs => {
      qCount += (cs.questions || []).length;
    });
  });

  const completed = (AppState.completedQuestions && AppState.completedQuestions[sub.id]) || 0;
  const progress = qCount > 0 ? Math.min(Math.round((completed / qCount) * 100), 100) : 0;
  const iconSvg = getSubjectOutlineSvg(sub.id);

  const displayName = sub.id === 'law' ? 'Corporate & Other Laws' : (sub.id === 'cost' ? 'Cost & Management Accounting' : (sub.id === 'tax' ? 'Taxation (Direct & Indirect)' : sub.name));

  return `
    <div class="sub-card ${isSpan2 ? 'span-2' : ''}" onclick="openSubjectDrilldown('${sub.id}')" style="border: 1.5px solid ${sub.color}35;">
      <div class="sub-icon" style="color: ${sub.color};">
        ${iconSvg}
      </div>
      <div>
        <div class="sub-name">${displayName}</div>
        <div class="sub-count">${chCount} chapters &bull; ${qCount} questions</div>
      </div>
      <div class="sub-bar">
        <div class="sub-fill" style="width: ${progress}%; background: ${sub.color};"></div>
      </div>
    </div>
  `;
}

function switchPracticeMode(mode) {
  window.practiceMode = mode;
  const main = document.getElementById('main-content');
  if (main) main.innerHTML = renderPractice();
}

// Subject Drilldown Overlay Controller
function openSubjectDrilldown(subjectId) {
  const sub = MCQ_DATA[subjectId];
  if (!sub) return;

  const modal = document.getElementById('subject-drilldown-modal');
  const container = document.getElementById('drilldown-content');
  if (!modal || !container) return;

  const isFlashcardMode = window.practiceMode === 'flashcards';

  container.innerHTML = `
    <!-- Top Nav -->
    <div style="position:sticky; top:0; z-index:10; background:var(--bg); border-bottom:1px solid var(--border); padding:12px 16px; display:flex; align-items:center; gap:12px;">
      <button onclick="closeSubjectDrilldown()" style="width:34px; height:34px; border-radius:8px; background:var(--card); border:1px solid var(--border); color:var(--txt); display:grid; place-items:center; cursor:pointer;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style="flex:1; min-width:0;">
        <div style="font-size:0.7rem; font-weight:700; color:${sub.color}; text-transform:uppercase;">${sub.paper} &bull; ${sub.group}</div>
        <h2 style="font-size:1.05rem; font-weight:700; color:var(--txt); margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sub.name}</h2>
      </div>
    </div>

    <!-- Chapter List -->
    <div style="padding:16px; max-width:640px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div style="font-size:0.78rem; font-weight:700; color:var(--txt3); text-transform:uppercase;">
          ${isFlashcardMode ? 'Theory Recall Chapters' : 'Select Chapter to Practice'}
        </div>
        <span style="font-size:0.75rem; color:var(--txt3);">${(sub.chapters||[]).length} Chapters</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${(sub.chapters || []).map((ch, idx) => {
          const qCount = (ch.questions || []).length;
          const hasCase = ch.caseScenarios && ch.caseScenarios.length > 0;
          const hasFlash = ch.flashcards && ch.flashcards.length > 0;

          return `
            <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px 14px;">
              <div style="display:flex; gap:10px; align-items:flex-start; margin-bottom:10px;">
                <div style="width:28px; height:28px; border-radius:8px; background:rgba(91,108,255,0.1); color:${sub.color}; font-weight:800; font-size:0.85rem; display:grid; place-items:center; flex-shrink:0;">
                  ${ch.num || (idx + 1)}
                </div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:0.92rem; font-weight:700; color:var(--txt); line-height:1.3;">${ch.title}</div>
                  <div style="font-size:0.72rem; color:var(--txt3); margin-top:2px;">${qCount} Questions &bull; ICAI Scheme</div>
                </div>
              </div>

              <div style="display:flex; gap:8px;">
                <button onclick="launchChapterMCQs('${subjectId}', '${ch.id}')" style="flex:1; padding:8px 12px; border-radius:8px; border:none; background:var(--accent); color:#fff; font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Practice MCQs
                </button>
                ${hasCase ? `
                  <button onclick="launchCaseScenario('${subjectId}', '${ch.id}', 0)" style="padding:8px 12px; border-radius:8px; border:1px solid var(--border); background:var(--bg2); color:var(--accent2); font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:4px;">
                    Case Set
                  </button>
                ` : ''}
                ${hasFlash ? `
                  <button onclick="launchFlashcardDeck('${subjectId}', '${ch.id}')" style="padding:8px 12px; border-radius:8px; border:1px solid var(--border); background:var(--bg2); color:var(--txt2); font-weight:600; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:4px;">
                    Recall
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  modal.style.display = 'block';
  modal.scrollTop = 0;
}

function closeSubjectDrilldown() {
  const modal = document.getElementById('subject-drilldown-modal');
  if (modal) modal.style.display = 'none';
}

function launchChapterMCQs(subjectId, chapterId) {
  closeSubjectDrilldown();
  if (typeof startQuiz === 'function') {
    startQuiz(subjectId, chapterId);
  } else {
    Router.navigate('chapter', { subject: subjectId, chapter: chapterId });
  }
}

function launchCaseScenario(subjectId, chapterId, caseIdx = 0) {
  const sub = MCQ_DATA[subjectId];
  if (!sub) return;
  const ch = (sub.chapters || []).find(c => c.id === chapterId);
  if (!ch || !ch.caseScenarios || !ch.caseScenarios[caseIdx]) return;

  const cs = ch.caseScenarios[caseIdx];
  closeSubjectDrilldown();

  const questionsWithNarrative = cs.questions.map((q) => ({
    ...q,
    caseNarrative: cs.narrative,
    caseTitle: cs.caseTitle,
    marks: 2,
    xp: 25
  }));

  if (typeof startQuizWithQuestions === 'function') {
    startQuizWithQuestions(questionsWithNarrative, {
      title: cs.caseTitle,
      subject: subjectId,
      chapterId: chapterId
    });
  } else if (typeof startQuiz === 'function') {
    startQuiz(subjectId, chapterId);
  }
}

function launchFlashcardDeck(subjectId, chapterId) {
  const sub = MCQ_DATA[subjectId];
  if (!sub) return;
  const ch = (sub.chapters || []).find(c => c.id === chapterId);
  if (!ch || !ch.flashcards || ch.flashcards.length === 0) return;

  const fc = ch.flashcards[0];
  alert(`ICAI Theory Recall:\n\n[Topic]: ${fc.topic}\n\n[Question]: ${fc.prompt}\n\n[Provision]: ${fc.provision}\n\n[Analysis]: ${fc.analysis}\n\n[Conclusion]: ${fc.conclusion}`);
}

function initPractice() {}

// ===== LEADERBOARD SECTION (20 Users, 5 Tiers with 3D Vectors) =====
window.selectedLeaderboardTier = 'all';

function renderRanks() {
  setTimeout(populateRanks, 0);
  return `
    <!-- Top Header -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #f59e0b, #fbbf24); display:grid; place-items:center; color:#fff; box-shadow: 0 4px 10px rgba(245,158,11,0.3);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"></path>
          </svg>
        </div>
        <div>
          <h2 style="font-size:1.4rem; font-weight:700; letter-spacing:-0.3px;">Leaderboard</h2>
          <div style="font-size:.82rem;color:var(--txt3);">All-India CA Intermediate Standings</div>
        </div>
      </div>

      <!-- User Active Rank Pill -->
      <div style="background:var(--card); border:1px solid var(--border); padding:6px 12px; border-radius:100px; font-size:0.75rem; font-weight:700; color:var(--accent2); display:flex; align-items:center; gap:6px;">
        <span>Your Rank:</span>
        <strong id="user-rank-val" style="color:var(--txt); font-size:0.85rem;">#${AppState.rank || 12}</strong>
      </div>
    </div>

    <!-- 5 Tiers Filter Strip (No Emojis, Pure 3D Badges) -->
    <div class="rank-tier-filters" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:16px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
      <button class="tier-filter-btn ${window.selectedLeaderboardTier==='all'?'active':''}" onclick="filterRanksTier('all', this)">All (20)</button>
      <button class="tier-filter-btn ${window.selectedLeaderboardTier==='zone'?'active':''}" onclick="filterRanksTier('zone', this)">${getTierSvg('In The Zone', 14)} In The Zone</button>
      <button class="tier-filter-btn ${window.selectedLeaderboardTier==='focus'?'active':''}" onclick="filterRanksTier('focus', this)">${getTierSvg('Focused', 14)} Focused</button>
      <button class="tier-filter-btn ${window.selectedLeaderboardTier==='hustle'?'active':''}" onclick="filterRanksTier('hustle', this)">${getTierSvg('Hustler', 14)} Hustler</button>
      <button class="tier-filter-btn ${window.selectedLeaderboardTier==='grind'?'active':''}" onclick="filterRanksTier('grind', this)">${getTierSvg('Grinder', 14)} Grinder</button>
      <button class="tier-filter-btn ${window.selectedLeaderboardTier==='rookie'?'active':''}" onclick="filterRanksTier('rookie', this)">${getTierSvg('Rookie', 14)} Rookie</button>
    </div>

    <!-- Container for dynamic ranks -->
    <div id="ranks-container" style="position:relative; min-height: 250px;">
      <div style="text-align:center; padding: 40px; color: var(--txt3);">Loading rankings...</div>
    </div>
  `;
}

function filterRanksTier(tierKey, el) {
  window.selectedLeaderboardTier = tierKey;
  document.querySelectorAll('.rank-tier-filters .tier-filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  populateRanks();
}

function populateRanks() {
  const container = document.getElementById('ranks-container');
  if (!container) return;

  // Clone 20 users and inject current user based on their current XP
  let board = (window.LEADERBOARD_DATA || []).map(u => ({ ...u }));

  // Ensure current user is in the list
  const userXp = AppState.xp || 50;
  const userName = AppState.user.firstName || AppState.user.username || 'You';
  const userTier = getTierFromXP(userXp);
  const userFrame = AppState.user.equippedFrame || 'frame_1';

  // Replace or update user's position
  const existingIdx = board.findIndex(u => u.isMe || u.email === AppState.user.email);
  if (existingIdx !== -1) {
    board[existingIdx].xp = userXp;
    board[existingIdx].tier = userTier;
    board[existingIdx].frame = userFrame;
  } else {
    // Slot into board at appropriate XP
    board.push({
      rank: 21,
      name: userName,
      initials: (userName[0] || 'U').toUpperCase(),
      xp: userXp,
      tier: userTier,
      frame: userFrame,
      isMe: true,
      streak: AppState.streak || 1
    });
  }

  // Sort descending by XP
  board.sort((a, b) => b.xp - a.xp);

  // Compute rank for all users
  board.forEach((u, i) => {
    u.rank = i + 1;
    if (u.isMe) AppState.rank = u.rank;
  });

  const rankBadge = document.getElementById('user-rank-val');
  if (rankBadge) {
    rankBadge.textContent = '#' + (AppState.rank || 12);
  }

  // Filter if tier filter active
  const tierFilter = window.selectedLeaderboardTier || 'all';
  let filteredBoard = board;
  if (tierFilter !== 'all') {
    filteredBoard = board.filter(u => (u.tier || '').toLowerCase().includes(tierFilter));
  }

  container.innerHTML = generateBoardHtml(filteredBoard, board);
}

function getFrameConfig(frameId) {
  const frames = window.AVATAR_FRAMES || [];
  return frames.find(f => f.id === frameId) || frames[0] || {
    id: 'frame_1',
    name: 'Bronze Cadet',
    styleTitle: 'Brushed Bronze Rim',
    color: '#cd7f32',
    badge: 'Lvl 1'
  };
}

function renderAvatarWithFrame(avatarData, frameId = 'frame_1', size = 52, showBadge = true) {
  const f = getFrameConfig(frameId);
  const frameNum = (f.id || 'frame_1').replace('frame_', '');

  // Exact concentric math: R_inner = R_outer - border_width - padding
  let outerR, borderW, padding;
  if (size >= 70) {
    outerR = 22; borderW = 3.5; padding = 2.5;
  } else if (size >= 60) {
    outerR = 19; borderW = 3; padding = 2.5;
  } else if (size >= 50) {
    outerR = 16; borderW = 2.5; padding = 2;
  } else {
    outerR = 13; borderW = 2; padding = 1.5;
  }
  const innerR = Math.max(Math.round(outerR - borderW - padding), 3);

  // Distinct frame ornaments
  let ornaments = '';
  if (frameNum === '2') {
    ornaments = `
      <span style="position:absolute;top:2px;left:2px;width:5px;height:5px;border-radius:50%;background:#34d399;border:1px solid #059669;pointer-events:none;z-index:2;"></span>
      <span style="position:absolute;bottom:2px;right:2px;width:5px;height:5px;border-radius:50%;background:#34d399;border:1px solid #059669;pointer-events:none;z-index:2;"></span>
    `;
  } else if (frameNum === '3') {
    ornaments = `
      <span class="cyber-bracket tl"></span>
      <span class="cyber-bracket tr"></span>
      <span class="cyber-bracket bl"></span>
      <span class="cyber-bracket br"></span>
    `;
  } else if (frameNum === '5') {
    ornaments = `
      <span class="ruby-crest tl"></span>
      <span class="ruby-crest tr"></span>
      <span class="ruby-crest bl"></span>
      <span class="ruby-crest br"></span>
    `;
  } else if (frameNum === '6') {
    ornaments = `
      <span class="archon-stud top"></span>
      <span class="archon-stud bottom"></span>
      <span class="archon-stud left"></span>
      <span class="archon-stud right"></span>
    `;
  } else if (frameNum === '7') {
    ornaments = `
      <span class="matrix-cross tl">+</span>
      <span class="matrix-cross tr">+</span>
      <span class="matrix-cross bl">+</span>
      <span class="matrix-cross br">+</span>
    `;
  } else if (frameNum === '8') {
    ornaments = `
      <span class="titanium-rivet tl"></span>
      <span class="titanium-rivet tr"></span>
      <span class="titanium-rivet bl"></span>
      <span class="titanium-rivet br"></span>
    `;
  } else if (frameNum === '9') {
    ornaments = `
      <span class="obsidian-wing left"></span>
      <span class="obsidian-wing right"></span>
    `;
  } else if (frameNum === '10') {
    ornaments = `
      <div class="celestial-crown">
        <svg viewBox="0 0 24 24" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" width="${size >= 70 ? 22 : 18}" height="${size >= 70 ? 22 : 18}">
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
        </svg>
      </div>
      <span class="celestial-star tl">&#10022;</span>
      <span class="celestial-star tr">&#10022;</span>
      <span class="celestial-star bl">&#10022;</span>
      <span class="celestial-star br">&#10022;</span>
    `;
  }

  const avInnerHtml = avatarData
    ? `<img src="${avatarData}" style="width:100%;height:100%;object-fit:cover;border-radius:${innerR}px;display:block;" alt="">`
    : window.getDefaultAvatarSVG();

  const badgeHtml = showBadge ? `
    <div style="position:absolute; bottom:-4px; right:-4px; background:${f.color}; color:#fff; font-size:0.55rem; font-weight:800; padding:1px 5px; border-radius:4px; line-height:1.2; box-shadow:0 2px 4px rgba(0,0,0,0.5); z-index:3;">
      ${f.badge}
    </div>
  ` : '';

  return `
    <div class="avatar-frame-wrap frame-style-${frameNum}" style="width:${size}px; height:${size}px; border-radius:${outerR}px; padding:${padding}px;">
      ${ornaments}
      <div class="avatar-frame-inner" style="border-radius:${innerR}px;">
        ${avInnerHtml}
      </div>
      ${badgeHtml}
    </div>
  `;
}

function generateBoardHtml(displayBoard, fullBoard = []) {
  if (!displayBoard || displayBoard.length === 0) {
    return `<div style="text-align:center; padding:40px; color:var(--txt3);">No students in this tier yet. Keep grinding!</div>`;
  }

  // Helper to format long names in podium so they never clip awkwardly with ellipsis
  const formatPodiumName = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1 && name.length > 11) {
      return `${parts[0]} ${parts[1][0]}.`;
    }
    return name;
  };

  // Check if viewing all ranks to render Top 3 Podium
  const showPodium = window.selectedLeaderboardTier === 'all' && displayBoard.length >= 3;
  const podium = showPodium ? displayBoard.slice(0, 3) : [];
  const listRows = showPodium ? displayBoard.slice(3) : displayBoard;

  const crownGold = `<svg viewBox="0 0 24 24" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" width="22" height="22"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
  const silverMedal = `<svg viewBox="0 0 24 24" fill="#94a3b8" stroke="#475569" stroke-width="1.5" width="20" height="20"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
  const bronzeMedal = `<svg viewBox="0 0 24 24" fill="#b45309" stroke="#78350f" stroke-width="1.5" width="20" height="20"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;

  let html = '';

  if (showPodium) {
    html += `
      <div class="podium-3d-wrap" style="display:flex; justify-content:center; align-items:flex-end; gap:10px; margin-bottom:28px; padding-top:20px;">
        <!-- Rank 2: Silver -->
        <div class="podium-3d-spot silver" style="flex:1; max-width:110px; display:flex; flex-direction:column; align-items:center;">
          <div style="margin-bottom:6px;">${silverMedal}</div>
          <div style="position:relative; display:inline-block;">
            ${renderAvatarWithFrame(podium[1].avatar, podium[1].frame || 'frame_8', 64, false)}
            <div style="position:absolute; bottom:-4px; right:-4px; width:22px; height:22px; border-radius:50%; background:var(--card); display:grid; place-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.5); z-index:4;">${getTierSvg(podium[1].tier, 15)}</div>
          </div>
          <div style="font-weight:700; font-size:0.85rem; color:var(--txt); margin-top:8px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:105px;">${escapeHtml(formatPodiumName(podium[1].name))}</div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--accent2);">${formatXP(podium[1].xp)} XP</div>
          <div style="margin-top:6px; width:100%; height:45px; background:linear-gradient(180deg, rgba(148,163,184,0.2), rgba(148,163,184,0.05)); border:1px solid rgba(148,163,184,0.3); border-radius:12px 12px 0 0; display:grid; place-items:center; font-weight:800; color:#94a3b8; font-size:1.1rem;">2</div>
        </div>

        <!-- Rank 1: Gold (Center Elevated) -->
        <div class="podium-3d-spot gold" style="flex:1; max-width:125px; display:flex; flex-direction:column; align-items:center;">
          <div style="margin-bottom:8px; transform:scale(1.2);">${crownGold}</div>
          <div style="position:relative; display:inline-block;">
            ${renderAvatarWithFrame(podium[0].avatar, podium[0].frame || 'frame_10', 74, false)}
            <div style="position:absolute; bottom:-4px; right:-4px; width:24px; height:24px; border-radius:50%; background:var(--card); display:grid; place-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.5); z-index:4;">${getTierSvg(podium[0].tier, 18)}</div>
          </div>
          <div style="font-weight:800; font-size:0.92rem; color:var(--txt); margin-top:8px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;">${escapeHtml(formatPodiumName(podium[0].name))}</div>
          <div style="font-size:0.8rem; font-weight:800; color:#fbbf24;">${formatXP(podium[0].xp)} XP</div>
          <div style="margin-top:6px; width:100%; height:65px; background:linear-gradient(180deg, rgba(251,191,36,0.25), rgba(251,191,36,0.05)); border:1.5px solid rgba(251,191,36,0.4); border-radius:14px 14px 0 0; display:grid; place-items:center; font-weight:900; color:#fbbf24; font-size:1.3rem;">1</div>
        </div>

        <!-- Rank 3: Bronze -->
        <div class="podium-3d-spot bronze" style="flex:1; max-width:110px; display:flex; flex-direction:column; align-items:center;">
          <div style="margin-bottom:6px;">${bronzeMedal}</div>
          <div style="position:relative; display:inline-block;">
            ${renderAvatarWithFrame(podium[2].avatar, podium[2].frame || 'frame_5', 64, false)}
            <div style="position:absolute; bottom:-4px; right:-4px; width:22px; height:22px; border-radius:50%; background:var(--card); display:grid; place-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.5); z-index:4;">${getTierSvg(podium[2].tier, 15)}</div>
          </div>
          <div style="font-weight:700; font-size:0.85rem; color:var(--txt); margin-top:8px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:105px;">${escapeHtml(formatPodiumName(podium[2].name))}</div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--accent2);">${formatXP(podium[2].xp)} XP</div>
          <div style="margin-top:6px; width:100%; height:35px; background:linear-gradient(180deg, rgba(180,83,9,0.2), rgba(180,83,9,0.05)); border:1px solid rgba(180,83,9,0.3); border-radius:12px 12px 0 0; display:grid; place-items:center; font-weight:800; color:#d97706; font-size:1.05rem;">3</div>
        </div>
      </div>
    `;
  }

  // List Rows for Ranks 4 to 20
  html += '<div class="rank-list" style="display:flex; flex-direction:column; gap:8px;">';
  listRows.forEach(u => {
    const isMe = u.isMe || (AppState.user && u.email === AppState.user.email);
    const meClass = isMe ? 'me-highlight' : '';

    html += `
      <div class="rank-row ${meClass}" style="background:var(--card); border:${isMe ? '1.5px solid var(--accent)' : '1px solid var(--border)'}; border-radius:14px; padding:12px 16px; display:flex; align-items:center; gap:12px; transition:transform 0.2s;">
        <div style="width:24px; font-weight:800; font-size:0.9rem; color:${isMe ? 'var(--accent2)' : 'var(--txt3)'}; text-align:center;">
          ${u.rank}
        </div>
        <div style="flex-shrink:0;">
          ${renderAvatarWithFrame(u.avatar, u.frame || 'frame_1', 40, false)}
        </div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-weight:700; font-size:0.9rem; color:var(--txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(u.name)}
            </span>
            ${isMe ? '<span style="font-size:0.65rem; font-weight:800; background:var(--accent); color:#fff; padding:2px 6px; border-radius:4px;">YOU</span>' : ''}
            ${u.isDev ? '<span style="font-size:0.65rem; font-weight:700; background:rgba(91,108,255,0.15); color:var(--accent2); padding:2px 6px; border-radius:4px;">CREATOR</span>' : ''}
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
            ${getTierSvg(u.tier, 13)}
            <span style="font-size:0.72rem; color:var(--txt3); font-weight:600;">${u.tier}</span>
            <span style="font-size:0.72rem; color:var(--txt4);">&bull;</span>
            <span style="font-size:0.72rem; color:var(--txt3);">${u.streak || 1}d streak</span>
          </div>
        </div>
        <div style="text-align:right; flex-shrink:0;">
          <div style="font-weight:800; font-size:0.95rem; color:${isMe ? 'var(--accent2)' : 'var(--txt)'};">${formatXP(u.xp)}</div>
          <div style="font-size:0.68rem; color:var(--txt3); text-transform:uppercase;">XP</div>
        </div>
      </div>
    `;
  });
  html += '</div>';

  return html;
}

// ===== PROFILE SECTION (Clean, Senior-Level Design) =====
function renderProfile() {
  const user = AppState.user;
  const levelInfo = calculateUserLevel(AppState.xp);
  
  // Find equipped frame or fallback to Frame 1
  const equippedFrameId = user.equippedFrame || 'frame_1';
  const frames = window.AVATAR_FRAMES || [];
  const equippedFrame = frames.find(f => f.id === equippedFrameId) || frames[0];
  const userTier = getTierFromXP(AppState.xp);

  return `
    <!-- Top Header -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <h2 style="font-size:1.25rem; font-weight:700; letter-spacing:-0.2px;">Profile</h2>
      <button onclick="openFrameModal()" style="background:var(--card); border:1px solid var(--border); color:var(--txt); font-weight:600; font-size:0.75rem; padding:6px 12px; border-radius:100px; cursor:pointer; display:flex; align-items:center; gap:6px;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${equippedFrame.color};"></span>
        ${equippedFrame.name}
      </button>
    </div>

    <!-- Clean Compact User Card -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:16px; padding:14px; margin-bottom:10px;">
      <div style="display:flex; gap:12px; align-items:center;">
        <div class="profile-pfp-wrap" onclick="openAvatarSheet()" style="cursor:pointer; flex-shrink:0;" title="Change photo">
          <div id="profAvatarFrameHost">
            ${renderAvatarWithFrame(user.avatar, equippedFrameId, 52, true)}
          </div>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:5px;">
            <h3 id="profDisplayName" style="font-size:0.98rem; font-weight:700; color:var(--txt); margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(user.firstName || user.username)}
            </h3>
            <svg viewBox="0 0 24 24" fill="#38bdf8" width="13" height="13" style="flex-shrink:0;"><path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z"/></svg>
          </div>
          <div id="profDisplayHandle" style="font-size:0.72rem; color:var(--txt3); margin-top:1px;">@${escapeHtml(user.username || 'student')} &bull; CA Inter (${user.attempt || 'May 2027'})</div>
          <div style="margin-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.68rem; margin-bottom:4px;">
              <span style="font-weight:700; color:var(--txt);">Level ${levelInfo.level}</span>
              <span style="color:var(--txt3);">${levelInfo.progressInLvl} / 150 XP &bull; ${levelInfo.pct}%</span>
            </div>
            <div style="width:100%; height:4px; background:var(--bg2); border-radius:2px; overflow:hidden;">
              <div style="height:100%; width:${levelInfo.pct}%; background:linear-gradient(90deg, var(--accent), ${equippedFrame.color}); border-radius:2px; transition:width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Unified Minimal Stat Bar -->
    <div style="display:flex; align-items:center; justify-content:space-around; background:var(--card); border:1px solid var(--border); border-radius:14px; padding:10px 8px; margin-bottom:16px;">
      <div style="flex:1; text-align:center; cursor:pointer;" onclick="if(window.openGoalModal) window.openGoalModal(true)">
        <div style="display:flex;align-items:center;justify-content:center;gap:5px;">
          <svg class="flame-svg" viewBox="0 0 24 28" width="18" height="21" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#f97316"/>
                <stop offset="50%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#fde68a"/>
              </linearGradient>
            </defs>
            <path d="M12 2 C12 2 7 8 7 13 C7 15.5 8.5 17 10 17.5 C9.5 16 10 14 11 13 C11 15 12.5 16.5 13 18 C14.5 17 15.5 15 15 12.5 C16.5 14 17 16.5 16.5 19 C18.5 17.5 19 15 18.5 12 C20 14 20.5 16 20 18.5 C21.5 16.5 22 14 21 11 C20 8 18 5.5 17 4.5 C17.5 6.5 17 8.5 15.5 9.5 C15.5 7 14.5 4.5 12 2Z" fill="url(#flameGrad)" opacity="0.95"/>
            <path d="M12 14 C12 14 10 16 10 18.5 C10 20.5 11 22 12 22 C13 22 14 20.5 14 18.5 C14 16 12 14 12 14Z" fill="#fde68a" opacity="0.85"/>
          </svg>
          <span style="font-size:1.1rem; font-weight:800; color:#f59e0b;">${AppState.streak}d</span>
        </div>
        <div style="font-size:0.7rem; color:var(--txt3); margin-top:2px;">Streak</div>
      </div>
      <div style="width:1px; height:24px; background:var(--border);"></div>
      <div style="flex:1; text-align:center;">
        <div style="font-size:1.15rem; font-weight:800; color:var(--accent2);">${formatXP(AppState.xp)}</div>
        <div style="font-size:0.7rem; color:var(--txt3); margin-top:2px;">Total XP</div>
      </div>
      <div style="width:1px; height:24px; background:var(--border);"></div>
      <div style="flex:1; text-align:center; cursor:pointer;" onclick="Router.navigate('ranks')">
        <div style="font-size:1.15rem; font-weight:800; color:#10b981;">#${AppState.rank || 12}</div>
        <div style="font-size:0.7rem; color:var(--txt3); margin-top:2px;">Rank</div>
      </div>
    </div>

    <!-- Account & Platform Actions -->
    <div class="sec-label">Account Controls</div>
    <div class="prof-menu-list">

      <div class="prof-menu-item" onclick="openFrameModal()">
        <div class="prof-menu-left">
          <div class="prof-menu-icon" style="background:rgba(250,204,21,0.12); color:#f59e0b;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="prof-menu-text">
            <span class="prof-menu-title">Avatar Frame</span>
            <span class="prof-menu-sub" id="profEquippedFrameName" style="color:${equippedFrame.color};">${equippedFrame.name}</span>
          </div>
        </div>
        <svg class="menu-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <div class="prof-menu-item" onclick="openProfileOverlay('editProfile')">
        <div class="prof-menu-left">
          <div class="prof-menu-icon" style="background:rgba(99,102,241,0.12); color:var(--accent);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="prof-menu-text">
            <span class="prof-menu-title">Edit Profile</span>
            <span class="prof-menu-sub">Name, photo, target attempt</span>
          </div>
        </div>
        <svg class="menu-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <div class="prof-menu-item" onclick="openProfileOverlay('performance')">
        <div class="prof-menu-left">
          <div class="prof-menu-icon" style="background:rgba(16,185,129,0.12); color:#10b981;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div class="prof-menu-text">
            <span class="prof-menu-title">Performance</span>
            <span class="prof-menu-sub">Analytics & progress</span>
          </div>
        </div>
        <svg class="menu-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <div class="prof-menu-item" onclick="openProfileOverlay('bookmarks')">
        <div class="prof-menu-left">
          <div class="prof-menu-icon" style="background:rgba(56,189,248,0.12); color:#38bdf8;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="prof-menu-text">
            <span class="prof-menu-title">Bookmarks</span>
            <span class="prof-menu-sub">Saved questions</span>
          </div>
        </div>
        <svg class="menu-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <div class="prof-menu-item" onclick="openProfileOverlay('settings')">
        <div class="prof-menu-left">
          <div class="prof-menu-icon" style="background:rgba(148,163,184,0.1); color:var(--txt2);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
          <div class="prof-menu-text">
            <span class="prof-menu-title">Settings</span>
            <span class="prof-menu-sub">App preferences</span>
          </div>
        </div>
        <svg class="menu-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <div class="prof-menu-item prof-menu-logout" onclick="handleSignout()">
        <div class="prof-menu-left">
          <div class="prof-menu-icon" style="background:rgba(239,68,68,0.1); color:#ef4444;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <div class="prof-menu-text">
            <span class="prof-menu-title" style="color:#ef4444;">Sign Out</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

function initProfile() {
  updateProfileAvatar();
}

// Avatar Frame Selector Overlay Functions
function renderFramesList() {
  const grid = document.getElementById('frame-modal-grid');
  if (!grid) return;

  const userLvl = calculateUserLevel(AppState.xp).level;
  const equippedId = AppState.user.equippedFrame || 'frame_1';
  const frames = window.AVATAR_FRAMES || [];
  const userAvatar = AppState.user.avatar;

  grid.innerHTML = frames.map(f => {
    const isUnlocked = userLvl >= f.minLevel;
    const isEquipped = equippedId === f.id;

    return `
      <div class="frame-item-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}">
        ${renderAvatarWithFrame(userAvatar, f.id, 42, false)}
        <div class="frame-item-info">
          <div class="frame-item-title-row">
            <span class="frame-item-name">${f.name}</span>
            <span class="frame-item-badge" style="background:${f.color}22; color:${f.color}; border:1px solid ${f.color}44;">${f.badge}</span>
          </div>
          <div class="frame-item-sub">
            ${f.styleTitle}
          </div>
          <div class="frame-item-status" style="color:${isUnlocked ? 'var(--green)' : 'var(--txt4)'};">
            ${isUnlocked ? '&#10003; Unlocked' : `Unlocks at Level ${f.minLevel}`}
          </div>
        </div>
        <div>
          ${isEquipped 
            ? `<span class="frame-tag-equipped">Equipped</span>`
            : isUnlocked 
              ? `<button class="frame-btn-equip" onclick="equipFrame('${f.id}')">Equip</button>`
              : `<span class="frame-tag-locked"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Lvl ${f.minLevel}</span>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function openFrameModal() {
  const modal = document.getElementById('frame-selector-modal');
  if (!modal) return;
  renderFramesList();

  if (window.location.pathname.includes('/profile') || window.location.hash.includes('profile')) {
    if (!window.location.search.includes('panel=frames')) {
      try {
        window.history.pushState({ route: 'profile', params: { panel: 'frames' }, isOverlay: true }, '', '/profile?panel=frames');
      } catch(e) {}
    }
  }

  modal.classList.add('open');
}

function closeFrameModal() {
  const modal = document.getElementById('frame-selector-modal');
  if (modal) modal.classList.remove('open');

  if (window.location.search.includes('panel=frames')) {
    if (window.history.length > 1 && window.history.state && window.history.state.isOverlay) {
      window.history.back();
      return;
    }
    try {
      window.history.replaceState({ route: 'profile', params: {}, isOverlay: false }, '', '/profile');
    } catch(e) {}
  }
}

function equipFrame(frameId) {
  AppState.user.equippedFrame = frameId;
  saveUser();
  closeFrameModal();
  
  // Update avatar frame and menu label in-place without destructive re-render
  updateProfileAvatar();
  const f = getFrameConfig(frameId);
  const frameNameEl = document.getElementById('profEquippedFrameName');
  if (frameNameEl && f) {
    frameNameEl.textContent = f.name;
    frameNameEl.style.color = f.color;
  }
  showToast('Avatar frame equipped successfully!');
}

function updateProfileIdentity() {
  const user = AppState.user;
  if (!user) return;
  const nameEl = document.getElementById('profDisplayName');
  if (nameEl) nameEl.textContent = user.firstName || user.username;
  const handleEl = document.getElementById('profDisplayHandle');
  if (handleEl) {
    handleEl.innerHTML = '@' + escapeHtml(user.username || 'student') + ' &bull; CA Inter (' + escapeHtml(user.attempt || 'May 2027') + ')';
  }
}
window.updateProfileIdentity = updateProfileIdentity;

window.renderAvatarWithFrame = renderAvatarWithFrame;

window.getTierSvg = getTierSvg;
window.calculateUserLevel = calculateUserLevel;
window.openSubjectDrilldown = openSubjectDrilldown;
window.closeSubjectDrilldown = closeSubjectDrilldown;
window.launchChapterMCQs = launchChapterMCQs;
window.launchCaseScenario = launchCaseScenario;
window.launchFlashcardDeck = launchFlashcardDeck;
window.switchPracticeMode = switchPracticeMode;
window.openFrameModal = openFrameModal;
window.closeFrameModal = closeFrameModal;
window.equipFrame = equipFrame;
window.populateRanks = populateRanks;
window.renderFrames = openFrameModal;

// ===== PROFILE OVERLAY URL SYSTEM =====
// All profile sub-screens use query params: /profile?panel=editProfile
const PROFILE_OVERLAYS = ['editProfile','performance','bookmarks','community','settings','privacyPolicy','disclaimer','contactUs', 'telegramLink', 'frames'];

function openProfileOverlay(name) {
  // Use router navigate
  Router.navigate('profile', { panel: name });
  // The router will call window.openFs(name) automatically
}

function closeProfileOverlay(name) {
  const el = (name === 'frames') ? document.getElementById('frame-selector-modal') : document.getElementById('fs-' + name);
  if (el) el.classList.remove('open');

  // If this overlay was pushed into history via query params, pop history back cleanly
  if (window.location.search.includes('panel=')) {
    if (window.history.length > 1 && window.history.state && window.history.state.isOverlay) {
      window.history.back();
      return;
    }
  }

  // Fallback: update URL cleanly to /profile without a destructive page rebuild
  try {
    window.history.replaceState({ route: 'profile', params: {}, isOverlay: false }, '', '/profile');
  } catch(e) {}
}

// Check on load if URL contains a panel param
function checkProfilePanelInUrl() {
  const hash = window.location.hash.replace('#', '');
  const [route, paramStr] = hash.split('?');
  if (route === 'profile' && paramStr) {
    const params = {};
    paramStr.split('&').forEach(p => {
      const [k, v] = p.split('=');
      if (k && v) params[decodeURIComponent(k)] = decodeURIComponent(v);
    });
    if (params.panel && PROFILE_OVERLAYS.includes(params.panel)) {
      setTimeout(() => openFs(params.panel), 300);
    }
  }
}

// ===== EDIT PROFILE OVERLAY =====
function renderEditProfile() {
  const user = AppState.user;
  const initials = user.initials || ((user.firstName||'?')[0]).toUpperCase();
  const nextAttempts = getNextThreeAttempts(user.attempt);

  let dropdownOptions = nextAttempts.map(a =>
    `<div class="custom-dropdown-item ${a === user.attempt ? 'selected' : ''}" data-val="${a}" onclick="selectAttempt(this.dataset.val)">
      ${a === user.attempt
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<span style="display:inline-block;width:16px;"></span>'}
      ${a}
    </div>`
  ).join('');

  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-editProfile">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('editProfile')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Edit Profile</h2>
      </div>
      <div class="fs-content">

        ${(function() {
          const fields = [
            { label: 'Name',     done: !!(user.firstName && user.firstName.trim()) },
            { label: 'Username', done: !!(user.username && user.username.trim()) },
            { label: 'Email',    done: !!(user.email && user.email.trim()) },
            { label: 'Phone',    done: !!(user.phone && user.phone.trim()) },
            { label: 'Avatar',   done: !!(user.avatar && user.avatar.trim()) },
            { label: 'Course',   done: !!(user.course && user.course.trim()) },
            { label: 'Attempt',  done: !!(user.attempt && user.attempt.trim()) },
          ];
          const doneCount = fields.filter(f => f.done).length;
          const pct = Math.round((doneCount / fields.length) * 100);
          const barColor = pct >= 71 ? '#22c55e' : pct >= 41 ? '#f59e0b' : '#ef4444';
          
          return `
            <div style="margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; gap:12px; padding-bottom:12px; border-bottom:1px solid var(--border);">
              <span style="font-size:0.85rem; font-weight:600; color:var(--txt2);">Profile Setup</span>
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="width:80px; height:4px; background:var(--bg3); border-radius:2px; overflow:hidden;">
                  <div style="width:${pct}%; height:100%; background:${barColor}; border-radius:2px;"></div>
                </div>
                <span style="font-size:0.75rem; font-weight:600; color:var(--txt3);">${pct}%</span>
              </div>
            </div>`;
        })()}

        <div class="edit-av-wrap">
          <div class="edit-av" id="editAv" onclick="openAvatarSheet()">
            <div id="editAvText" style="width:100%;height:100%;">${window.getDefaultAvatarSVG()}</div>
            <img id="editAvImg"
     style="display:none;width:100%;height:100%;object-fit:cover;transition:opacity 0.3s;"
     alt="" onerror="this.onerror=null; this.outerHTML=window.getDefaultAvatarSVG().replace(/\\\"/g, '&quot;');">
            <div class="edit-av-overlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <div class="edit-av-btn" onclick="openAvatarSheet()">Change Avatar</div>
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="inpFirst" value="${escapeHtml(user.firstName)}" placeholder="Enter name">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          ${user.provider === 'google' 
            ? `<input type="email" class="form-input" id="inpEmail" value="${escapeHtml(user.email)}" disabled style="opacity:0.5;">`
            : `<div style="position:relative;">
                 <input type="email" class="form-input" id="inpEmail" value="${escapeHtml(user.email)}" disabled style="opacity:0.8; padding-right:80px; color:var(--txt2);">
                 <button onclick="openChangeEmailOverlay()" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--accent); font-weight:600; font-size:0.9rem; cursor:pointer;">Change</button>
               </div>`
          }
        </div>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-input" id="inpUsername" value="${escapeHtml(user.username)}" placeholder="Enter username">
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input type="tel" class="form-input" id="inpPhone" value="${escapeHtml(user.phone)}" placeholder="Enter phone">
        </div>
        <div class="form-group">
          <label class="form-label">Course</label>
          <input type="text" class="form-input" value="${user.course}" disabled style="opacity:0.5;">
        </div>
        <div class="form-group">
          <label class="form-label">Attempt</label>
          <div class="custom-dropdown-wrap" id="attemptDropdownWrap">
            <div class="custom-dropdown-menu upward" id="attemptDropdownMenu">${dropdownOptions}</div>
            <button class="custom-dropdown-trigger" id="attemptDropdown" onclick="toggleAttemptDropdown(event)">
              <span id="attemptValue">${user.attempt}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"/></svg>
            </button>
          </div>
        </div>
        <button class="btn-save" id="btnSaveProfile" onclick="saveProfile()">Save Changes</button>
      </div>
    </div>`;

  setTimeout(() => {
    const el = document.getElementById('fs-editProfile');
    if (el) el.classList.add('open');
    updateProfileAvatar();
  }, 10);
}

// ===== ATTEMPT DROPDOWN =====
let attemptDropdownOpen = false;

function toggleAttemptDropdown(e) {
  if (e) e.stopPropagation();
  
  const menu = document.getElementById('attemptDropdownMenu');
  const trigger = document.getElementById('attemptDropdown');
  
  if (!menu) return;
  
  attemptDropdownOpen = !attemptDropdownOpen;
  
  if (attemptDropdownOpen) {
    trigger.classList.add('open');
    
    requestAnimationFrame(() => {
      menu.classList.add('open');
    });
    
    setTimeout(() => {
      document.addEventListener('click', _outsideDropdownClick);
    }, 0);
    
  } else {
    _closeAttemptDropdown();
  }
}

function _outsideDropdownClick(e) {
  const wrap = document.getElementById('attemptDropdownWrap');
  if (wrap && !wrap.contains(e.target)) {
    _closeAttemptDropdown();
  }
}

function _closeAttemptDropdown() {
  const menu = document.getElementById('attemptDropdownMenu');
  const trigger = document.getElementById('attemptDropdown');
  
  attemptDropdownOpen = false;
  
  menu?.classList.remove('open');
  trigger?.classList.remove('open');
  
  document.removeEventListener('click', _outsideDropdownClick);
}

// Keep old name as alias for index.html dropdown-overlay click
function closeDropdown() { _closeAttemptDropdown(); }

function selectAttempt(val) {
  // val comes from data-val attribute, not text parsing
  AppState.user.attempt = val;
  const valEl = document.getElementById('attemptValue');
  if (valEl) valEl.textContent = val;
  // Rebuild items with updated selected state
  document.querySelectorAll('#attemptDropdownMenu .custom-dropdown-item').forEach(item => {
    const itemVal = item.dataset.val;
    const isSel = itemVal === val;
    item.classList.toggle('selected', isSel);
    item.innerHTML = (isSel
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<span style="display:inline-block;width:16px;"></span>')
      + ' ' + itemVal;
  });
  _closeAttemptDropdown();
}

async function saveProfile() {
  const firstVal = document.getElementById('inpFirst')?.value.trim() || '';
  const lastVal = document.getElementById('inpLast')?.value.trim() || '';
  const emailVal = document.getElementById('inpEmail')?.value.trim() || '';
  const usernameVal = document.getElementById('inpUsername')?.value.trim() || AppState.user.username;
  const phoneVal = document.getElementById('inpPhone')?.value.trim() || '';

  if (!firstVal) { showToast('Please enter your first name'); return; }
  if (!usernameVal) { showToast('Please enter a username'); return; }

  const saveBtn = document.getElementById('btnSaveProfile');
  const oldText = saveBtn ? saveBtn.innerHTML : 'Save Changes';
  if (saveBtn) {
    saveBtn.innerHTML = '<div class="spinner" style="border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;width:20px;height:20px;animation:spin 0.8s linear infinite;margin:0 auto;"></div>';
    saveBtn.disabled = true;
  }

  try {
    if (!/^[a-zA-Z0-9._]+$/.test(usernameVal)) {
      throw new Error('Username can only contain letters, numbers, dots and underscores. No spaces allowed.');
    }
    if (usernameVal !== AppState.user.username) {
      const existing = await window.API.getUserByUsername(usernameVal);
      if (existing && existing.email !== AppState.user.email) {
        throw new Error('Username already exists. Please choose another.');
      }
    }

    let finalAvatarUrl = AppState.user.avatar;

    if (tempAvatarData) {
      finalAvatarUrl = tempAvatarData;
      tempAvatarData = null;
    }

    AppState.user.avatar = finalAvatarUrl;
    AppState.user.firstName = firstVal;
    AppState.user.email = emailVal;
    AppState.user.username = usernameVal;
    AppState.user.phone = phoneVal;
    AppState.user.initials = (firstVal[0] + (lastVal[0] || '')).toUpperCase();

    saveUser(); // This pushes to Cloudflare D1
    updateProfileAvatar();
    updateProfileIdentity();
    showToast('Profile saved successfully');
    closeProfileOverlay('editProfile');
  } catch (e) {
    console.error(e);
    showToast('Failed to save profile. ' + e.message);
  } finally {
    if (saveBtn) {
      saveBtn.innerHTML = oldText;
      saveBtn.disabled = false;
    }
  }
}

// ===== PERFORMANCE OVERLAY =====
function renderPerformance() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;
  
  let subjectHtml = '';
  let focusHtml = '';
  const colors = ['var(--accent)', 'var(--green)', 'var(--amber)', '#a78bfa', '#f43f5e'];
  
  if (AppState.settings && AppState.settings.subjectStats && Object.keys(AppState.settings.subjectStats).length > 0) {
    let colorIdx = 0;
    let lowestAcc = 101;
    let worstSubject = '';
    
    for (let subj in AppState.settings.subjectStats) {
      const stats = AppState.settings.subjectStats[subj];
      if (stats.attempted > 0) {
        const acc = Math.round((stats.correct / stats.attempted) * 100);
        if (acc < lowestAcc && stats.attempted >= 3) {
            lowestAcc = acc;
            worstSubject = subj;
        }
        subjectHtml += `<div class="sp-item"><div class="sp-top"><div class="sp-name" style="text-transform:capitalize;">${subj}</div><div class="sp-score">${acc}%</div></div><div class="sp-bar"><div class="sp-fill" style="width:${acc}%;background:${colors[colorIdx % colors.length]};"></div></div></div>`;
        colorIdx++;
      }
    }
    
    if(subjectHtml !== '') {
        subjectHtml = `<div class="sec-label">Subject-wise Performance</div><div class="sub-perf">${subjectHtml}</div>`;
    }
    
    if(worstSubject !== '' && lowestAcc < 70) {
        focusHtml = `
        <div class="weekly-consistency-card" style="border-left: 4px solid var(--amber);">
          <div class="weekly-title" style="margin-bottom:4px;color:var(--amber);">Suggested Focus</div>
          <p style="font-size:0.8rem;color:var(--txt2);line-height:1.4;">Your accuracy in <b style="text-transform:capitalize;">${worstSubject}</b> is currently at <b>${lowestAcc}%</b>. Try practicing more questions in this subject to boost your score.</p>
        </div>`;
    }
  } else {
    subjectHtml = `<div class="sec-label">Subject-wise Performance</div><div style="font-size:0.8rem;color:var(--txt3);padding:10px 0;">Complete some questions to see your subject stats here.</div>`;
  }

  // Dynamic Weekly Consistency
  let weekHtml = '';
  let chartHtml = '';
  const todayDay = new Date().getDay();
  const currentDayIdx = todayDay === 0 ? 6 : todayDay - 1;
  const streak = AppState.streak || 0;
  
  let activeStreak = streak;
  const todayStr = new Date().toISOString().split('T')[0];
  
  const dayLetters = ['M','T','W','T','F','S','S'];
  const chartDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dummyData = [62, 58, 71, 65, 80, 74, 69]; // Global accuracy doesn't have daily history in DB
  
  for(let i=0; i<7; i++) {
     let isActive = false;
     if (activeStreak > 0) {
         let daysAgo = currentDayIdx - i;
         if (AppState.last_xp_date !== todayStr) daysAgo -= 1; // shift streak backwards if not active today
         if (daysAgo >= 0 && daysAgo < activeStreak) {
             isActive = true;
         }
     }
     weekHtml += `<div class="w-day ${isActive ? 'active' : ''}"><span>${dayLetters[i]}</span></div>`;
     
     let isToday = (i === currentDayIdx);
     chartHtml += `<div class="c-bar-wrap"><div class="c-bar-val">${dummyData[i]}%</div><div class="c-bar" style="height:${dummyData[i]}%;${isToday ? 'background:var(--green);' : ''}"></div><div class="c-bar-label">${chartDays[i]}</div></div>`;
  }


  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-performance">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('performance')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Performance</h2>
      </div>
      <div class="fs-content">
        <div class="perf-summary">
          <div class="ps-card"><div class="ps-num">${(AppState.questionsAttempted || 0).toLocaleString()}</div><div class="ps-lbl">Total Qs</div></div>
          <div class="ps-card"><div class="ps-num">${AppState.accuracy || 0}%</div><div class="ps-lbl">Avg Accuracy</div></div>
          <div class="ps-card"><div class="ps-num" style="display:flex;align-items:center;justify-content:center;gap:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19c-1.5 1-3 1.5-5.5 1.5s-4-.5-5.5-1.5c-1.5-1-2.5-2.5-2.5-4 0-3 3-5 5.5-8.5C10.5 4 10 2 10 2c2 1.5 4 4 4 6 0 1.5-.5 3-1.5 4.5 1 .5 2 .5 3 0 1.5-1 2.5-2.5 2.5-4 1.5 1 2.5 2.5 2.5 4 0 1.5-1 3-2.5 4z"/></svg>${AppState.streak || 0}</div><div class="ps-lbl">Day Streak</div></div>
          <div class="ps-card"><div class="ps-num" style="display:flex;align-items:center;justify-content:center;gap:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${AppState.xp || 0}</div><div class="ps-lbl">XP Earned</div></div>
        </div>
        
        ${focusHtml}
        
        <div class="weekly-consistency-card">
          <div class="weekly-title">This Week's Consistency</div>
          <div class="weekly-days">
            ${weekHtml}
          </div>
        </div>
        
        <div class="perf-chart">
          <div class="chart-title">Weekly Accuracy Trend</div>
          <div class="chart-bars">
            ${chartHtml}
          </div>
        </div>
        
        ${subjectHtml}
        
      </div>
    </div>`;
  
  setTimeout(() => {
    const el = document.getElementById('fs-performance');
    if (el) { el.classList.add('open'); }
  }, 10);
}


function renderBookmarks() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  const bms = typeof getBookmarks === 'function' ? getBookmarks() : [];
  const customCats = (() => { try { return JSON.parse(localStorage.getItem('pe_bm_custom_cats') || '[]'); } catch(e) { return []; } })();
  const allCats = ['All', 'Save Question', 'Revision', 'Doubt', 'Important', 'Exam Favourite', 'LDR', 'Quick Review', ...customCats];

  // Subject filter options derived from actual bookmarks
  const subjects = ['All', ...new Set(bms.map(b => b.subject).filter(Boolean))];
  const subjectFilterHtml = subjects.map(s => `
    <button class="bm-filter-chip ${s === 'All' ? 'active subj' : 'subj'}" data-subj="${s}" onclick="bmFilterBySubject(this)">${s}</button>`
  ).join('');

  const filtersCatHtml = allCats.map(cat => `
    <button class="bm-filter-chip ${cat === 'All' ? 'active' : ''}" data-cat="${cat}" onclick="bmFilterByCat(this)">${cat}</button>`
  ).join('');

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-bookmarks">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('bookmarks')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Saved Questions</h2>
        <div style="display:flex;gap:8px;margin-left:auto;">
          <button class="bm-sort-btn" onclick="bmToggleFilterMenu()" title="Filter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </button>
          <button class="bm-sort-btn" onclick="bmToggleSortMenu()" id="bmSortBtn" title="Sort">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Sort Menu -->
      <div class="bm-sort-menu" id="bmSortMenu">
        <div class="bm-sort-item active" data-sort="newest" onclick="bmSetSort('newest',this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          Newest first
        </div>
        <div class="bm-sort-item" data-sort="oldest" onclick="bmSetSort('oldest',this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="7 1 3 5 7 9"/><path d="M21 11V9a4 4 0 0 0-4-4H3"/></svg>
          Oldest first
        </div>
        <div class="bm-sort-item" data-sort="subject" onclick="bmSetSort('subject',this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          By subject
        </div>
        <div class="bm-sort-item" data-sort="category" onclick="bmSetSort('category',this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          By tag
        </div>
      </div>

      <div class="fs-content">
        <!-- Bookmark Dynamic Content (Stats + Button + List) -->
        <div id="bmList">${_renderBmList(bms)}</div>
      </div>
    </div>
    
    <!-- Filter Overlay (Flipkart Style) -->
    <div class="bm-filter-panel-overlay" id="bmFilterPanel" style="display:none;" onclick="if(event.target===this) bmToggleFilterMenu()">
      <div class="bm-filter-panel">
        <div class="bm-filter-head">
          <h3>Filters</h3>
          <button class="bm-filter-close" onclick="bmToggleFilterMenu()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="bm-filter-body">
          
          <div class="bm-filter-section">
            <h4>Subjects</h4>
            <div class="bm-filter-options" id="bmFilterSubjects">
              ${subjects.map(s => `
                <label class="bm-checkbox">
                  <input type="checkbox" value="${s}" ${s === 'All' ? 'disabled' : ''} onchange="bmUpdateFilter(this, 'subjects')">
                  <span class="bm-check-mark"></span>
                  <span class="bm-check-label">${s}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="bm-filter-section">
            <h4>Tags</h4>
            <div class="bm-filter-options" id="bmFilterTags">
              ${[...new Set(bms.map(b => b.category).filter(Boolean))].map(c => `
                <label class="bm-checkbox">
                  <input type="checkbox" value="${c}" onchange="bmUpdateFilter(this, 'tags')">
                  <span class="bm-check-mark"></span>
                  <span class="bm-check-label">${c}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="bm-filter-section">
            <h4>Time</h4>
            <div class="bm-filter-options">
              <label class="bm-radio">
                <input type="radio" name="bmTimeFilter" value="All" checked onchange="bmUpdateFilterTime(this)">
                <span class="bm-radio-mark"></span>
                <span class="bm-radio-label">All Time</span>
              </label>
              <label class="bm-radio">
                <input type="radio" name="bmTimeFilter" value="Today" onchange="bmUpdateFilterTime(this)">
                <span class="bm-radio-mark"></span>
                <span class="bm-radio-label">Today</span>
              </label>
              <label class="bm-radio">
                <input type="radio" name="bmTimeFilter" value="Last7Days" onchange="bmUpdateFilterTime(this)">
                <span class="bm-radio-mark"></span>
                <span class="bm-radio-label">Last 7 Days</span>
              </label>
              <label class="bm-radio">
                <input type="radio" name="bmTimeFilter" value="Custom" onchange="bmUpdateFilterTime(this)">
                <span class="bm-radio-mark"></span>
                <span class="bm-radio-label">Custom Date</span>
              </label>
              <div id="bmFilterCustomDateWrap" style="display:none; margin-top:8px;">
                <input type="date" id="bmFilterCustomDate" class="bm-date-picker" onchange="bmApplyFilters()">
              </div>
            </div>
          </div>

        </div>
        <div class="bm-filter-footer">
          <button class="bm-filter-btn secondary" onclick="bmClearFilters()">Clear All</button>
          <button class="bm-filter-btn primary" onclick="bmApplyFilters()">Apply Filters</button>
        </div>
      </div>
    </div>
    `;

  setTimeout(() => { document.getElementById('fs-bookmarks')?.classList.add('open'); }, 10);
}

function _getFilteredSortedBookmarks() {
  const bms = typeof getBookmarks === 'function' ? getBookmarks() : [];
  let filtered = [...bms];

  if (_bmFilters.subjects.length > 0) {
    filtered = filtered.filter(b => _bmFilters.subjects.includes(b.subject));
  }
  
  if (_bmFilters.tags.length > 0) {
    filtered = filtered.filter(b => _bmFilters.tags.includes(b.category));
  }

  if (_bmFilters.time !== 'All') {
    const today = new Date();
    today.setHours(0,0,0,0);
    const last7 = new Date(today);
    last7.setDate(today.getDate() - 7);

    filtered = filtered.filter(b => {
      const d = new Date(b.savedAt);
      d.setHours(0,0,0,0);
      if (_bmFilters.time === 'Today') {
        return d.getTime() === today.getTime();
      } else if (_bmFilters.time === 'Last7Days') {
        return d.getTime() >= last7.getTime();
      } else if (_bmFilters.time === 'Custom') {
        if (!_bmFilters.customDate) return true;
        const cd = new Date(_bmFilters.customDate);
        cd.setHours(0,0,0,0);
        return d.getTime() === cd.getTime();
      }
      return true;
    });
  }

  const sort = _bmCurrentSort;
  if (sort === 'oldest') filtered.sort((a,b) => new Date(a.savedAt) - new Date(b.savedAt));
  else if (sort === 'newest') filtered.sort((a,b) => new Date(b.savedAt) - new Date(a.savedAt));
  else if (sort === 'subject') filtered.sort((a,b) => (a.subject||'').localeCompare(b.subject||''));
  else if (sort === 'category') filtered.sort((a,b) => (a.category||'').localeCompare(b.category||''));

  return filtered;
}

function _renderBmList(bms) {
  let filtered = _getFilteredSortedBookmarks();

  const statsHtml = `
    <!-- Stats Row -->
    <div class="bm-stats-row">
      <div class="bm-stat stat-saved">
        <svg class="bm-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <div class="bm-stat-val">${filtered.length}</div>
        <div class="bm-stat-lbl">Saved</div>
      </div>
      <div class="bm-stat stat-doubts">
        <svg class="bm-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div class="bm-stat-val">${filtered.filter(b=>b.category==='Doubt').length}</div>
        <div class="bm-stat-lbl">Doubts</div>
      </div>
      <div class="bm-stat stat-imp">
        <svg class="bm-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <div class="bm-stat-val">${filtered.filter(b=>b.category==='Important').length}</div>
        <div class="bm-stat-lbl">Important</div>
      </div>
      <div class="bm-stat stat-subj">
        <svg class="bm-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <div class="bm-stat-val">${[...new Set(filtered.map(b=>b.subject).filter(Boolean))].length}</div>
        <div class="bm-stat-lbl">Subjects</div>
      </div>
    </div>
    ${filtered.length > 0 ? `
    <button class="bm-practice-all-btn" onclick="bmPracticeAll()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Practice all saved questions
    </button>` : ''}
  `;

  if (!filtered.length) {
    return statsHtml + `<div class="bm-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40" style="color:var(--txt4);margin-bottom:12px;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      <div style="font-weight:600;margin-bottom:4px;">Nothing here yet</div>
      <div style="font-size:.8rem;color:var(--txt3);">Bookmark questions while practising to see them here</div>
    </div>`;
  }

  const catColors = {
    'Doubt': '#e85d5d',
    'Important': '#ffb534',
    'Exam Favourite': '#5b6cff',
    'Revision': '#4ade80',
    'LDR': '#a78bfa',
    'Save Question': 'var(--txt3)',
    'Quick Review': '#38bdf8'
  };

  const cardsHtml = filtered.map((b, idx) => {
    const color = catColors[b.category] || 'var(--accent)';
    const date = b.savedAt ? new Date(b.savedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : '';
    const srcLabel = b.source === 'law' ? 'Business Laws' : (b.subject === 'economics' ? 'Business Economics' : (b.subject || 'MCQ'));

    return `<div class="bm-card">
      <div class="bm-card-head">
        <div class="bm-card-cat" style="color:${color};background:${color}1a;">${b.category || 'Saved'}</div>
        <div class="bm-card-meta" style="font-size:.72rem;color:var(--txt3);">${srcLabel}</div>
      </div>
      <div class="bm-card-q">${b.question || ''}</div>
      ${b.options && b.options.length ? `
        <div class="bm-card-opts-toggle" onclick="bmToggleOptions(this)">
          <span>Show Options</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="bm-card-opts-container" style="display:none;">
          ${b.options.map((opt, i) => `
            <div class="bm-card-opt ${b.correct === i ? 'correct' : ''}">
              <div class="bm-opt-idx">${String.fromCharCode(65 + i)}</div>
              <div class="bm-opt-text">${opt}</div>
              ${b.correct === i ? `<svg class="bm-opt-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      <div class="bm-card-foot">
        <div class="bm-card-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${date}
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="bm-practice-btn" onclick="bmPracticeSingle(${idx})" title="Practice this question">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Practice
          </button>
          <button class="bm-del-btn" onclick="deleteBookmark('${b.key}')" title="Remove">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  return statsHtml + '<div class="bm-grid">' + cardsHtml + '</div>';
}

let _bmCurrentSort = 'newest';
let _bmFilters = {
  subjects: [],
  tags: [],
  time: 'All', // 'All', 'Today', 'Last7Days', 'Custom'
  customDate: '' // YYYY-MM-DD
};

function bmToggleFilterMenu() {
  const panel = document.getElementById('bmFilterPanel');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function bmUpdateFilter(el, type) {
  const val = el.value;
  if (el.checked) {
    if (!_bmFilters[type].includes(val)) _bmFilters[type].push(val);
  } else {
    _bmFilters[type] = _bmFilters[type].filter(v => v !== val);
  }
}

function bmUpdateFilterTime(el) {
  _bmFilters.time = el.value;
  const cdw = document.getElementById('bmFilterCustomDateWrap');
  if (cdw) cdw.style.display = (el.value === 'Custom') ? 'block' : 'none';
  bmApplyFilters();
}

function bmClearFilters() {
  _bmFilters = { subjects: [], tags: [], time: 'All', customDate: '' };
  
  // Reset checkboxes
  document.querySelectorAll('#bmFilterSubjects input').forEach(el => el.checked = false);
  document.querySelectorAll('#bmFilterTags input').forEach(el => el.checked = false);
  
  // Reset radios
  const radios = document.getElementsByName('bmTimeFilter');
  radios.forEach(r => r.checked = (r.value === 'All'));
  
  const cdw = document.getElementById('bmFilterCustomDateWrap');
  if (cdw) cdw.style.display = 'none';
  const cdInp = document.getElementById('bmFilterCustomDate');
  if (cdInp) cdInp.value = '';

  bmApplyFilters();
}

function bmApplyFilters() {
  const cdInp = document.getElementById('bmFilterCustomDate');
  if (cdInp) _bmFilters.customDate = cdInp.value;

  const bms = typeof getBookmarks === 'function' ? getBookmarks() : [];
  const list = document.getElementById('bmList');
  if (list) list.innerHTML = _renderBmList(bms);
  bmToggleFilterMenu();
}

function bmSetSort(sort, el) {
  document.querySelectorAll('.bm-sort-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  _bmCurrentSort = sort;
  const list = document.getElementById('bmList');
  const bms = typeof getBookmarks === 'function' ? getBookmarks() : [];
  if (list) list.innerHTML = _renderBmList(bms);
  bmToggleSortMenu();
}

function bmToggleSortMenu() {
  const menu = document.getElementById('bmSortMenu');
  if (menu) menu.classList.toggle('open');
}

function bmToggleOptions(btn) {
  const container = btn.nextElementSibling;
  const isHidden = container.style.display === 'none';
  container.style.display = isHidden ? 'flex' : 'none';
  btn.querySelector('span').textContent = isHidden ? 'Hide Options' : 'Show Options';
  btn.querySelector('svg').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

window.practiceState = {
  active: false,
  questions: [],
  currentQ: 0,
  opts: {},
  mcqAnswers: [],
  lawAnswers: [],
  lawEvaluated: []
};

window.startMixedPractice = function(questions, opts) {
  practiceState.active = true;
  practiceState.questions = questions;
  practiceState.currentQ = 0;
  practiceState.opts = opts || {};
  
  practiceState.mcqAnswers = new Array(questions.length).fill(-1);
  practiceState.lawAnswers = questions.map(() => ({
    provision:'', facts:'', conclusion:'', score:0, provisionScore:0, factsScore:0, conclusionScore:0, keywordsFound:[], keywordsMissed:[], factsWordCount:0, conclusionWordCount:0
  }));
  practiceState.lawEvaluated = new Array(questions.length).fill(false);

  const overlay = document.getElementById('mcq-overlay');
  if (overlay) {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  if (AppState.settings && AppState.settings.fullscreen && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  if (window.Router) {
    Router.hideBottomNav();
    Router.hideTopbar();
  }

  renderMixedQuestion();
};

window.renderMixedQuestion = function() {
  const qIdx = practiceState.currentQ;
  const q = practiceState.questions[qIdx];
  
  if (q.source === 'law') {
    window.lawState = window.lawState || {};
    window.lawState.subject = 'law';
    window.lawState.chapter = practiceState.opts.chapterId || 'custom';
    window.lawState.concept = 'mixed';
    window.lawState.questions = practiceState.questions;
    window.lawState.currentQ = qIdx;
    window.lawState.answers = practiceState.lawAnswers;
    window.lawState.evaluated = practiceState.lawEvaluated[qIdx];
    window.lawState.isFinished = false;
    window.lawState.totalScore = practiceState.lawAnswers.reduce((acc, a) => acc + (a.score || 0), 0);
    window.lawState.maxScore = practiceState.questions.filter(x => x.source === 'law').length * 3;
    window.lawState._isMixed = true;

    if (typeof renderLawQuestion === 'function') renderLawQuestion();
  } else {
    window.quizState = window.quizState || {};
    window.quizState.locked = practiceState.mcqAnswers[qIdx] !== -1;
    window.quizState.subject = practiceState.opts.subject || 'custom';
    window.quizState.chapter = practiceState.opts.chapterId || 'custom';
    window.quizState.questions = practiceState.questions;
    window.quizState.currentQ = qIdx;
    window.quizState.answers = practiceState.mcqAnswers;
    window.quizState.isFinished = false;
    window.quizState._customTitle = practiceState.opts.title || 'Practice';
    window.quizState._customBackFn = practiceState.opts.backFn || null;
    window.quizState._isMixed = true;

    if (typeof renderQuizQuestion === 'function') renderQuizQuestion();
    if (!window.quizState.locked && typeof startPerQTimer === 'function') startPerQTimer();
  }
};

function bmPracticeAll() {
  let filtered = _getFilteredSortedBookmarks();

  const questions = filtered
    .filter(b => b.question)
    .map(b => ({
      q: b.question,
      options: b.options || (b.source === 'law' ? [] : ['Option A', 'Option B', 'Option C', 'Option D']),
      correct: b.correct !== undefined ? b.correct : 0,
      source: b.source,
      keywords: b.keywords || [],
      explanation: b.explanation || ''
    }));

  if (!questions.length) { showToast('No questions to practice'); return; }
  closeProfileOverlay('bookmarks');
  setTimeout(() => {
    startMixedPractice(questions, { title: 'Bookmark Practice', subject: 'custom', chapterId: 'bookmarks' });
  }, 350);
}

function bmPracticeSingle(idx) {
  let filtered = _getFilteredSortedBookmarks();
  
  const b = filtered[idx];
  if (!b) return;

  const q = {
    q: b.question,
    options: b.options || (b.source === 'law' ? [] : ['Option A', 'Option B', 'Option C', 'Option D']),
    correct: b.correct !== undefined ? b.correct : 0,
    source: b.source,
    keywords: b.keywords || [],
    explanation: b.explanation || ''
  };

  closeProfileOverlay('bookmarks');
  setTimeout(() => {
    startMixedPractice([q], { title: 'Practice Question', subject: 'custom', chapterId: 'bookmarks' });
  }, 350);
}
async function deleteBookmark(key) {
  if (AppState.isGuest) {
    showToast('Login required');
    return;
  }
  const bms = (typeof getBookmarks === 'function' ? getBookmarks() : []).filter(b => b.key !== key);
  if (typeof saveBookmarksStore === 'function') {
    saveBookmarksStore(bms);
  } else {
    window._bookmarksCache = bms;
  }
  
  const list = document.getElementById('bmList');
  if (list) list.innerHTML = typeof _renderBmList === 'function' ? _renderBmList(bms) : '';
  
  // Update stat counts
  const statVals = document.querySelectorAll('.bm-stat-val');
  if (statVals[0]) statVals[0].textContent = bms.length;
  if (statVals[1]) statVals[1].textContent = bms.filter(b=>b.category==='Doubt').length;
  if (statVals[2]) statVals[2].textContent = bms.filter(b=>b.category==='Important').length;
  if (statVals[3]) statVals[3].textContent = [...new Set(bms.map(b=>b.subject).filter(Boolean))].length;
  
  showToast('Removed from saved');

  if (window.API && AppState.user && AppState.user.email) {
    window.API.deleteBookmark(AppState.user.email, key).catch(e => console.error(e));
  }
}

// ===== COMMUNITY =====
function renderCommunity() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  let thoughts = COMMUNITY_DATA.map(t => {
    const commentsHtml = t.comments.map(c => `
      <div class="th-comment">
        <div class="th-comment-av">${window.getDefaultAvatarSVG()}</div>
        <div class="th-comment-body">
          <div class="th-comment-user">${c.user}</div>
          <div class="th-comment-text">${c.text}</div>
        </div>
      </div>`).join('');

    return `
      <div class="thought" data-thought-id="${t.id}">
        <div class="th-head">
          <div class="th-av">${window.getDefaultAvatarSVG()}</div>
          <div>
            <div class="th-user">${t.user} ${t.isMe ? '<span style="font-size:.6rem;background:rgba(91,108,255,.1);padding:2px 6px;border-radius:4px;color:var(--accent2);">You</span>' : ''}</div>
            <div class="th-time">${t.time}</div>
          </div>
        </div>
        <div class="th-body">${t.body}</div>
        <div class="th-actions">
          <div class="th-action" onclick="likeThought(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg><span class="like-count">${t.likes}</span></div>
          <div class="th-action" onclick="dislikeThought(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg><span class="dislike-count">${t.dislikes}</span></div>
          <div class="th-action" onclick="toggleComments(${t.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span class="comment-count">${t.comments.length}</span></div>
        </div>
        <div class="th-comments" id="comments-${t.id}">
          ${commentsHtml}
          <div class="th-comment-input-wrap">
            <input type="text" class="th-comment-input" id="comment-input-${t.id}" placeholder="Write a comment..." onkeydown="if(event.key==='Enter')postComment(${t.id})">
            <button class="th-comment-send" onclick="postComment(${t.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
          </div>
        </div>
      </div>`;
  }).join('');

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-community">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('community'); document.getElementById('paigeFab').style.display = 'flex';">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Community Thoughts</h2>
      </div>
      <div class="fs-content" style="padding-bottom: 80px;">${thoughts}</div>
      <button class="dummy-plus-btn" onclick="showToast('Coming soon')" style="position:absolute; bottom:24px; right:24px; width:56px; height:56px; background:var(--accent); color:#fff; border-radius:50%; border:none; box-shadow:0 4px 12px rgba(91,108,255,0.4); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:100;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>`;

  const fab = document.getElementById('paigeFab');
  if (fab) fab.style.display = 'none';

  setTimeout(() => { document.getElementById('fs-community')?.classList.add('open'); }, 10);
}

// ===== PDF LIBRARY =====
function renderPdfLibrary() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  let items = PDF_LIBRARY_DATA.map(p => `
    <div class="pdf-item" onclick="showToast('Downloading ${p.name}...')">
      <div class="pdf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
      <div class="pdf-info"><div class="pdf-name">${p.name}</div><div class="pdf-size">${p.size} &bull; ${p.org}</div></div>
      <div class="pdf-dl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
    </div>`).join('');

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-pdfLibrary">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('pdfLibrary')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">PDF Library</h2>
      </div>
      <div class="fs-content" style="position:relative; min-height:300px;">
        <div class="glass-overlay-soon"><span>Coming Soon</span></div>
        ${items}
      </div>
    </div>`;

  setTimeout(() => { document.getElementById('fs-pdfLibrary')?.classList.add('open'); }, 10);
}

// ===== SETTINGS OVERLAY =====
function renderSettings() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  const s = AppState.settings;

  const labelStyles = [
    { val: 'ABCD', label: 'A B C D' },
    { val: 'ABCDdot', label: 'A. B. C. D.' },
    { val: 'abcddot', label: 'a. b. c. d.' },
    { val: '1234dot', label: '1. 2. 3. 4.' },
    { val: 'RomanUp', label: 'I. II. III. IV.' },
    { val: 'RomanLow', label: 'i. ii. iii. iv.' }
  ];

  const labelStyleOpts = labelStyles.map(ls =>
    `<option value="${ls.val}" ${s.optionLabelStyle === ls.val ? 'selected' : ''}>${ls.label}</option>`
  ).join('');

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-settings">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('settings')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Settings</h2>
      </div>
      <div class="fs-content">

        <!-- APPEARANCE -->
        <div class="set-card">
          <div class="set-title">Appearance</div>
          <div class="theme-options">
            <button class="theme-btn ${s.theme==='dark'?'active':''}" onclick="setTheme('dark', this)">Dark</button>
            <button class="theme-btn ${s.theme==='light'?'active':''}" onclick="setTheme('light', this)">Light</button>
            <button class="theme-btn ${s.theme==='system'?'active':''}" onclick="setTheme('system', this)">System</button>
          </div>
          <div class="set-row" style="margin-top:10px;">
            <div class="set-info">
              <div class="set-label">Fullscreen Mode</div>
              <div class="set-desc">Hides browser UI during quiz</div>
            </div>
            <div class="toggle ${s.fullscreen?'on':''}" id="toggle-fullscreen" onclick="toggleFullscreenSetting(this)"><div class="toggle-knob"></div></div>
          </div>
          <div class="set-row" onclick="openQuizStyleOverlay()" style="cursor:pointer;">
            <div class="set-info">
              <div class="set-label">Quiz Style</div>
              <div class="set-desc" id="quizStyleDesc">${s.quizStyle === 'dense' ? 'Dense Practice Mode' : s.quizStyle === 'compact' ? 'Compact Mode' : 'Standard Mode'}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--txt4);flex-shrink:0;"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- MCQ BEHAVIOUR -->
        <div class="set-card">
          <div class="set-title">MCQ Behaviour</div>
          <div class="set-row">
            <div class="set-info">
              <div class="set-label">Auto Next Question</div>
              <div class="set-desc">300ms correct / 2s wrong</div>
            </div>
            <div class="toggle ${s.autoNext?'on':''}" onclick="toggleSettingBool('autoNext', this)"><div class="toggle-knob"></div></div>
          </div>

          <div class="set-row">
            <div class="set-info">
              <div class="set-label">Per-Question Timer</div>
              <div class="set-desc">Expired = auto skipped</div>
            </div>
            <div class="toggle ${s.timerEnabled?'on':''}" id="toggle-timer" onclick="toggleTimerSetting(this)"><div class="toggle-knob"></div></div>
          </div>

          <div class="set-row" id="timer-duration-row" style="${!s.timerEnabled?'opacity:.4;pointer-events:none;':''}">
            <div class="set-info">
              <div class="set-label">Timer Duration</div>
              <div class="set-desc">15 - 300 seconds</div>
            </div>
            <div class="num-input-wrap">
              <button class="num-btn" onclick="stepTimerDuration(-5)">-</button>
              <input type="number" id="timerNumInput" min="15" max="300" step="5" value="${s.timerDuration}"
                oninput="updateTimerDuration(this.value)"
                onblur="clampTimerDuration(this)"
                class="num-input">
              <span class="num-unit">s</span>
              <button class="num-btn" onclick="stepTimerDuration(5)">+</button>
            </div>
          </div>

          <!-- OPTION LABELS -->
          <div class="set-row" style="margin-top:4px;">
            <div class="set-info">
              <div class="set-label">Option Labels</div>
              <div class="set-desc">Show A/B/C/D etc. on options</div>
            </div>
            <div class="toggle ${s.optionLabelEnabled?'on':''}" id="toggle-labels" onclick="toggleLabelSetting(this)"><div class="toggle-knob"></div></div>
          </div>

          <div class="set-row" id="label-style-row" style="${!s.optionLabelEnabled?'opacity:.4;pointer-events:none;':''}">
            <div class="set-info">
              <div class="set-label">Label Style</div>
              <div class="set-desc" id="labelStyleDesc">${labelStyles.find(l=>l.val===s.optionLabelStyle)?.label||'A B C D'}</div>
            </div>
            <div class="setting-dropdown-wrap" id="labelStyleWrap">
              <button class="setting-dropdown-trigger" id="labelStyleTrigger" onclick="toggleLabelDropdown(event)">
                <span id="labelStyleVal">${labelStyles.find(l=>l.val===s.optionLabelStyle)?.label||'A B C D'}</span>
              </button>
              <div class="setting-dropdown-menu upward" id="labelStyleMenu">
                ${labelStyles.map(ls => `
                  <div class="setting-dropdown-item ${s.optionLabelStyle===ls.val?'selected':''}"
                    data-val="${ls.val}" onclick="selectLabelStyle(this.dataset.val)">
                    ${s.optionLabelStyle===ls.val
                      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>'
                      : '<span style="display:inline-block;width:14px;"></span>'}
                    ${ls.label}
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- NEGATIVE MARKING -->
        <div class="set-card">
          <div class="set-title">Negative Marking (MCQ only)</div>
          <div class="set-row">
            <div class="set-info">
              <div class="set-label">Enable Negative Marking</div>
              <div class="set-desc">Deduct marks for wrong answers</div>
            </div>
            <div class="toggle ${s.negativeMarking?'on':''}" id="toggle-neg" onclick="toggleNegMarking(this)"><div class="toggle-knob"></div></div>
          </div>
          <div class="set-row" id="neg-mark-row" style="${!s.negativeMarking?'opacity:.4;pointer-events:none;':''}">
            <div class="set-info">
              <div class="set-label">Deduction per wrong</div>
              <div class="set-desc">0.25 - 1.00</div>
            </div>
            <div class="num-input-wrap">
              <button class="num-btn neg" onclick="stepNegMark(-0.25)">-</button>
              <input type="number" id="negNumInput" min="0.25" max="1" step="0.25" value="${s.negativeMark}"
                oninput="updateNegMark(this.value)"
                onblur="clampNegMark(this)"
                class="num-input">
              <span class="num-unit">m</span>
              <button class="num-btn neg" onclick="stepNegMark(0.25)">+</button>
            </div>
          </div>
        </div>

        <!-- PREFERENCES -->
        <div class="set-card">
          <div class="set-title">Preferences</div>
          <div class="set-row">
            <div class="set-info"><div class="set-label">Push Notifications</div><div class="set-desc">Get alerts for tests & streaks</div></div>
            <div class="toggle ${s.pushNotifications?'on':''}" onclick="toggleSettingBool('pushNotifications', this)"><div class="toggle-knob"></div></div>
          </div>
          <div class="set-row">
            <div class="set-info"><div class="set-label">Sound Effects</div><div class="set-desc">Play sounds on completion</div></div>
            <div class="toggle ${s.soundEffects?'on':''}" onclick="toggleSoundEffects(this)"><div class="toggle-knob"></div></div>
          </div>
          <div class="set-row">
            <div class="set-info"><div class="set-label">Auto-Sync</div><div class="set-desc">Sync progress automatically</div></div>
            <div class="toggle ${s.autoSync?'on':''}" onclick="toggleSettingBool('autoSync', this)"><div class="toggle-knob"></div></div>
          </div>
          <div class="set-row">
            <div class="set-info"><div class="set-label">Study Reminders</div><div class="set-desc">Daily reminder to practice</div></div>
            <div class="toggle ${s.studyReminders?'on':''}" onclick="toggleSettingBool('studyReminders', this)"><div class="toggle-knob"></div></div>
          </div>
          <div class="set-row">
            <div class="set-info"><div class="set-label">Paige AI Assistant</div><div class="set-desc">Show the floating AI button</div></div>
            <div class="toggle ${localStorage.getItem('paige_ai_hidden') === 'true' ? '' : 'on'}" id="toggle-paige-ai" onclick="togglePaigeAISetting(this)"><div class="toggle-knob"></div></div>
          </div>
        </div>

        <!-- ACCOUNT -->
        <div class="set-card">
          <div class="set-title">Account</div>
          <div class="set-row" onclick="openProfileOverlay('privacyPolicy')">
            <div class="set-info"><div class="set-label">Privacy Policy</div></div>
            <div style="font-size:.78rem;color:var(--txt3);">&rsaquo;</div>
          </div>
          <div class="set-row" onclick="openProfileOverlay('disclaimer')">
            <div class="set-info"><div class="set-label">Disclaimer</div></div>
            <div style="font-size:.78rem;color:var(--txt3);">&rsaquo;</div>
          </div>
          <div class="set-row" onclick="openProfileOverlay('contactUs')">
            <div class="set-info"><div class="set-label">Contact Us</div></div>
            <div style="font-size:.78rem;color:var(--txt3);">&rsaquo;</div>
          </div>
          <div class="set-row" onclick="showToast('Version 2.4.1')">
            <div class="set-info"><div class="set-label">App Version</div></div>
            <div style="font-size:.78rem;color:var(--txt3);">v2.4.1</div>
          </div>
        </div>

      </div>
    </div>`;

  setTimeout(() => { document.getElementById('fs-settings')?.classList.add('open'); }, 10);
}

// ===== CONTACT US =====
function renderContactUs() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-contactUs">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('contactUs')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Contact Us</h2>
      </div>
      <div class="fs-content">
        <div style="font-size:0.9rem; color:var(--txt3); margin-bottom:16px;">We would love to hear from you. Send us a message and we'll reply as soon as possible.</div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="cuName" placeholder="Your name" value="${escapeHtml(AppState.user.firstName)}">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="cuEmail" placeholder="Your email" value="${escapeHtml(AppState.user.email)}">
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-input" id="cuMessage" placeholder="How can we help?" style="height:120px;resize:none;"></textarea>
        </div>
        
        <div class="cf-turnstile" data-sitekey="0x4AAAAAADwjQBPxenLKPTPC" style="margin-top:16px; margin-bottom: 16px;"></div>

        <button class="btn-save" id="btnContactSubmit" onclick="submitContactUsForm()">Send Message</button>
      </div>
    </div>`;

  setTimeout(() => {
    document.getElementById('fs-contactUs')?.classList.add('open');
    renderContactTurnstile();
  }, 10);
}

let _turnstileWidgetId = null;
let _turnstileScriptLoading = false;

function renderContactTurnstile() {
  const el = document.querySelector('.cf-turnstile');
  if (!el) return;

  if (window.turnstile) {
    if (_turnstileWidgetId !== null) {
      try { window.turnstile.remove(_turnstileWidgetId); } catch (e) {}
    }
    _turnstileWidgetId = window.turnstile.render(el, {
      sitekey: '0x4AAAAAADwjQBPxenLKPTPC'
    });
    return;
  }

  if (_turnstileScriptLoading) return;
  _turnstileScriptLoading = true;

  window._onTurnstileLoad = function () {
    _turnstileWidgetId = window.turnstile.render(el, {
      sitekey: '0x4AAAAAADwjQBPxenLKPTPC'
    });
  };

  const script = document.createElement('script');
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_onTurnstileLoad";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

async function submitContactUsForm() {
  const name = document.getElementById('cuName').value.trim();
  const email = document.getElementById('cuEmail').value.trim();
  const message = document.getElementById('cuMessage').value.trim();
  
  if (!name || !email || !message) {
    showToast('Please fill all fields');
    return;
  }

  let token = null;
  if (window.turnstile) {
    token = window.turnstile.getResponse(_turnstileWidgetId);
    if (!token) {
      showToast('Please complete the captcha verification');
      return;
    }
  }

  const btn = document.getElementById('btnContactSubmit');
  const oldTxt = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.disabled = true;

  const res = await window.API.submitContactForm({ name, email, message, token });

  btn.innerHTML = oldTxt;
  btn.disabled = false;

  if (res.error) {
    showToast('Error sending message: ' + res.error);
    if (window.turnstile) window.turnstile.reset(_turnstileWidgetId);
  } else {
    showToast('Message sent successfully!');
    document.getElementById('cuMessage').value = '';
    closeProfileOverlay('contactUs');
  }
}


// ===== SETTINGS HELPERS =====
function toggleSettingBool(key, el) {
  el.classList.toggle('on');
  AppState.settings[key] = el.classList.contains('on');
  saveSettings();
}

function toggleSoundEffects(el) {
  el.classList.toggle('on');
  AppState.settings.soundEffects = el.classList.contains('on');
  saveSettings();
}

function togglePaigeAISetting(el) {
  const isOn = !el.classList.contains('on'); // will toggle
  if (isOn) {
    el.classList.add('on');
    localStorage.setItem('paige_ai_hidden', 'false');
    if (typeof showPaigeFab === 'function') showPaigeFab();
  } else {
    el.classList.remove('on');
    localStorage.setItem('paige_ai_hidden', 'true');
    if (typeof hidePaigeFab === 'function') hidePaigeFab();
  }
}

function toggleTimerSetting(el) {
  el.classList.toggle('on');
  AppState.settings.timerEnabled = el.classList.contains('on');
  saveSettings();
  const row = document.getElementById('timer-duration-row');
  if (row) row.style.cssText = AppState.settings.timerEnabled ? '' : 'opacity:.4;pointer-events:none;';
}

function updateTimerDuration(val) {
  const n = parseInt(val);
  if (isNaN(n)) return;
  AppState.settings.timerDuration = n;
  saveSettings();
}

function clampTimerDuration(inp) {
  let n = parseInt(inp.value) || 30;
  n = Math.max(15, Math.min(300, n));
  // Round to nearest 5
  n = Math.round(n / 5) * 5;
  inp.value = n;
  AppState.settings.timerDuration = n;
  saveSettings();
}

function stepTimerDuration(delta) {
  const inp = document.getElementById('timerNumInput');
  if (!inp) return;
  let n = parseInt(inp.value) || AppState.settings.timerDuration;
  n = Math.max(15, Math.min(300, n + delta));
  inp.value = n;
  AppState.settings.timerDuration = n;
  saveSettings();
}

function toggleLabelSetting(el) {
  el.classList.toggle('on');
  AppState.settings.optionLabelEnabled = el.classList.contains('on');
  saveSettings();
  const row = document.getElementById('label-style-row');
  if (row) row.style.cssText = AppState.settings.optionLabelEnabled ? '' : 'opacity:.4;pointer-events:none;';
}

// Label style custom dropdown
let labelDropdownOpen = false;
function toggleLabelDropdown(e) {
  if (e) e.stopPropagation();
  
  const menu = document.getElementById('labelStyleMenu');
  const trigger = document.getElementById('labelStyleTrigger');
  
  labelDropdownOpen = !labelDropdownOpen;
  
  if (labelDropdownOpen) {
    trigger.classList.add('open');
    
    requestAnimationFrame(() => {
      menu.classList.add('open');
    });
    
    setTimeout(() => {
      document.addEventListener('click', _outsideLabelDropdownClick);
    }, 0);
    
  } else {
    _closeLabelDropdown();
  }
}
function _outsideLabelDropdownClick(e) {
  const wrap = document.getElementById('labelStyleWrap');
  if (wrap && !wrap.contains(e.target)) _closeLabelDropdown();
}
function _closeLabelDropdown() {
  const menu = document.getElementById('labelStyleMenu');
  const trigger = document.getElementById('labelStyleTrigger');
  
  labelDropdownOpen = false;
  
  menu?.classList.remove('open');
  trigger?.classList.remove('open');
  
  document.removeEventListener('click', _outsideLabelDropdownClick);
}
function selectLabelStyle(val) {
  const labelStyles = [
    { val: 'ABCD', label: 'A B C D' },
    { val: 'ABCDdot', label: 'A. B. C. D.' },
    { val: 'abcddot', label: 'a. b. c. d.' },
    { val: '1234dot', label: '1. 2. 3. 4.' },
    { val: 'RomanUp', label: 'I. II. III. IV.' },
    { val: 'RomanLow', label: 'i. ii. iii. iv.' }
  ];
  AppState.settings.optionLabelStyle = val;
  saveSettings();
  const found = labelStyles.find(l => l.val === val);
  const label = found ? found.label : val;
  const triggerVal = document.getElementById('labelStyleVal');
  const desc = document.getElementById('labelStyleDesc');
  if (triggerVal) triggerVal.textContent = label;
  if (desc) desc.textContent = label;
  // Update checkmarks
  document.querySelectorAll('#labelStyleMenu .setting-dropdown-item').forEach(item => {
  const itemVal = item.dataset.val;
  
  const itemStyle = labelStyles.find(
    style => style.val === itemVal
  );
  
  const itemLabel = itemStyle ?
    itemStyle.label :
    itemVal;
  
  const isSel = itemVal === val;
  
  item.classList.toggle('selected', isSel);
  
  item.innerHTML =
    (isSel ?
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>' :
      '<span style="display:inline-block;width:14px;"></span>'
    ) +
    ' ' +
    itemLabel;
});
  _closeLabelDropdown();
}
// Keep old alias
function setLabelStyle(val) { selectLabelStyle(val); }

function toggleNegMarking(el) {
  el.classList.toggle('on');
  AppState.settings.negativeMarking = el.classList.contains('on');
  saveSettings();
  const row = document.getElementById('neg-mark-row');
  if (row) row.style.cssText = AppState.settings.negativeMarking ? '' : 'opacity:.4;pointer-events:none;';
}

function updateNegMark(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return;
  AppState.settings.negativeMark = n;
  saveSettings();
}

function clampNegMark(inp) {
  let n = parseFloat(inp.value);
  if (isNaN(n)) n = 0.25;
  n = Math.max(0.25, Math.min(1.0, Math.round(n / 0.25) * 0.25));
  inp.value = n.toFixed(2);
  AppState.settings.negativeMark = n;
  saveSettings();
}

function stepNegMark(delta) {
  const inp = document.getElementById('negNumInput');
  if (!inp) return;
  let n = parseFloat(inp.value) || AppState.settings.negativeMark;
  n = Math.max(0.25, Math.min(1.0, Math.round((n + delta) / 0.25) * 0.25));
  inp.value = n.toFixed(2);
  AppState.settings.negativeMark = n;
  saveSettings();
}

function toggleSwitch(el) {
  el.classList.toggle('on');
}

// ===== OVERLAY HELPERS =====
window.originalTopbarHtml = '';
function openFs(name, pushState = true) {
  // If invoked directly (not via router), push to router
  if (pushState) {
    if (name === 'pdfLibrary' || name === 'crux') {
      Router.navigate('home', { panel: name });
      return;
    }
  }

  const topbar = document.getElementById('topbar');
  if (topbar && !window.originalTopbarHtml) {
    window.originalTopbarHtml = topbar.innerHTML;
  }

  const renderFn = window['render' + name.charAt(0).toUpperCase() + name.slice(1)];
  if (renderFn) renderFn();

  if (name === 'pdfLibrary' || name === 'crux') {
    const titleText = name === 'pdfLibrary' ? 'PDF Library' : 'Crux';
    if (topbar) {
      topbar.innerHTML = `
        <button class="back-btn" onclick="closeFs('${name}')" style="background:none;border:none;color:var(--txt);padding:8px;margin-left:-8px;cursor:pointer;display:flex;align-items:center;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="brand" style="margin-right:auto;display:flex;align-items:center;gap:8px;">
          <div class="logo-box" style="background:transparent;padding:0;width:24px;height:24px;">
            <img src="img/logo.png" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:20%;">
          </div>
          <h1 style="font-size:1.05rem;font-weight:700;">InterEdge <span style="font-weight:500;color:var(--txt3);">| ${titleText}</span></h1>
        </div>
      `;
    }
  }
}

function closeFs(name) {
  const el = document.getElementById('fs-' + name);
  if (el) el.classList.remove('open');
  if (PROFILE_OVERLAYS.includes(name)) {
    closeProfileOverlay(name);
    return;
  }

  if (name === 'pdfLibrary' || name === 'crux') {
    const topbar = document.getElementById('topbar');
    if (topbar && window.originalTopbarHtml) {
      topbar.innerHTML = window.originalTopbarHtml;
      if (window.updateBellDot) window.updateBellDot();
    }
    if (window.location.search.includes('panel=')) {
      if (window.history.length > 1 && window.history.state && window.history.state.isOverlay) {
        window.history.back();
      } else {
        try { window.history.replaceState({ route: 'home', params: {}, isOverlay: false }, '', '/home'); } catch(e) {}
      }
    }
  }
}

// ===== NOTIFICATIONS — Smart Bell Dot =====
document.addEventListener('click', function(e) {
  const bell = e.target.closest('#bellBtn');
  if (bell) {
    const overlay = document.getElementById('notifOverlay');
    if (overlay) overlay.classList.add('show');
  }
});

function closeNotif() {
  const overlay = document.getElementById('notifOverlay');
  if (overlay) overlay.classList.remove('show');
}

function markAllRead() {
  document.querySelectorAll('.notif-dot').forEach(d => {
    d.classList.remove('blue');
    d.classList.add('gray');
  });
  // Hide bell dot — no more unread
  AppState.hasUnread = false;
  updateBellDot();
  showToast('All notifications marked as read');
}

function updateBellDot() {
  const dot = document.querySelector('.bell-dot');
  if (!dot) return;
  dot.style.display = AppState.hasUnread ? 'block' : 'none';
}

// Init bell dot on render
function initBellDot() {
  updateBellDot();
}

// ===== THEME =====
function applyTheme(theme) {
  const body = document.body;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (theme === 'light') body.classList.add('light-theme');
  else if (theme === 'dark') body.classList.remove('light-theme');
  else if (theme === 'system') body.classList.toggle('light-theme', prefersLight);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

function setTheme(theme, btn) {
  AppState.settings.theme = theme;
  saveSettings();
  applyTheme(theme);
  showToast(theme === 'system' ? 'Theme set to System' : theme.charAt(0).toUpperCase() + theme.slice(1) + ' mode enabled');
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// ===== HEATMAP =====
function generateHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid || grid.children.length > 0) return;

  const weeks = 16, daysPerWeek = 7;
  const levels = ['var(--heatmap-low)','var(--heatmap-mid)','var(--heatmap-high)','var(--heatmap-max)'];
  const activityData = [
    [0,2,3,4,2,1,0],[1,3,4,3,2,0,1],[2,4,3,4,3,1,0],[0,3,4,4,3,2,1],
    [1,2,3,3,2,1,0],[2,3,4,4,3,0,1],[0,4,4,3,4,2,0],[1,3,3,4,2,1,1],
    [2,4,3,3,4,0,0],[0,3,4,4,3,2,1],[1,2,3,4,2,1,0],[2,3,3,4,3,0,1],
    [0,4,4,3,4,2,0],[1,3,3,2,3,1,0],[2,4,4,3,4,0,1],[0,3,3,4,2,1,0]
  ];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  for (let w = 0; w < weeks; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-col';
    for (let d = 0; d < daysPerWeek; d++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      const intensity = activityData[w][d];
      cell.style.background = levels[intensity] || levels[0];
      cell.title = `${dayNames[d]} (Week ${weeks - w}): ${intensity * 25 + 10} questions`;
      col.appendChild(cell);
    }
    grid.appendChild(col);
  }
}
async function toggleFullscreenSetting(el) {
  const enable = !el.classList.contains('on');
  
  try {
    if (enable) {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      
      el.classList.add('on');
      AppState.settings.fullscreen = true;
      
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      
      el.classList.remove('on');
      AppState.settings.fullscreen = false;
    }
    
    saveSettings();
    
  } catch (err) {
    console.error(err);
    showToast('Fullscreen not supported');
  }
}
document.addEventListener('fullscreenchange', () => {
  const toggle = document.getElementById('toggle-fullscreen');

  const active = !!document.fullscreenElement;

  if (toggle) {
    toggle.classList.toggle('on', active);
  }

  AppState.settings.fullscreen = active;
  saveSettings();
});
// ===== AVATAR =====
let tempAvatarData = null;

function openAvatarSheet() {
  const existing = document.getElementById('avatar-change-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'avatar-change-overlay';
  overlay.className = 'avatar-change-overlay';
  overlay.innerHTML = `
    <div class="avatar-change-backdrop" onclick="closeAvatarSheet()"></div>
    <div class="avatar-change-panel">
      <div class="avatar-change-handle"></div>
      <div class="avatar-change-head">
        <div style="width:40px;height:40px;border-radius:12px;background:var(--accent);display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </div>
        <div>
          <div style="font-size:1rem;font-weight:700;color:var(--txt);">Profile Photo</div>
          <div style="font-size:0.73rem;color:var(--txt3);margin-top:1px;">JPG, PNG or WEBP · Max 5MB</div>
        </div>
        <button onclick="closeAvatarSheet()" style="margin-left:auto;background:var(--bg2);border:1px solid var(--border);color:var(--txt2);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="avatar-change-body">
        <button class="avatar-change-btn" onclick="chooseFromGallery()">
          <div style="width:36px;height:36px;border-radius:10px;background:rgba(99,102,241,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <div style="text-align:left;">
            <div style="font-size:0.88rem;font-weight:600;color:var(--txt);">Choose from Gallery</div>
            <div style="font-size:0.72rem;color:var(--txt3);margin-top:1px;">Select a photo from your device</div>
          </div>
        </button>
        <button class="avatar-change-btn avatar-change-danger" onclick="removeAvatar()">
          <div style="width:36px;height:36px;border-radius:10px;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" width="18" height="18"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </div>
          <div style="text-align:left;">
            <div style="font-size:0.88rem;font-weight:600;color:#ef4444;">Remove Photo</div>
            <div style="font-size:0.72rem;color:var(--txt3);margin-top:1px;">Revert to default avatar</div>
          </div>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
}

function closeAvatarSheet() {
  const overlay = document.getElementById('avatar-change-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  setTimeout(() => overlay.remove(), 300);
  // Also close legacy sheet if present
  const sheet = document.getElementById('avatarSheet');
  if (sheet) sheet.classList.remove('show');
}

function chooseFromGallery() {
  const input = document.getElementById('avatarInput');
  if (input) input.click();
  closeAvatarSheet();
}

function removeAvatar() {
  tempAvatarData = null;
  AppState.user.avatar = null;
  saveUser();
  updateProfileAvatar();
  showToast('Profile photo removed');
  closeAvatarSheet();
}

function handleAvatarSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    showToast('Please select a JPG, PNG, or WEBP image');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      _openAvatarCropPreview(img);
    };
    img.onerror = function() { showToast('Could not load image. Try another file.'); };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

// ===== INTERACTIVE AVATAR CROPPER (pan + zoom, crop computed on confirm) =====
let _avCrop = null; // holds live cropper state while the sheet is open

function _openAvatarCropPreview(img) {
  const old = document.getElementById('avatar-crop-preview');
  if (old) old.remove();

  const panel = document.createElement('div');
  panel.id = 'avatar-crop-preview';
  panel.className = 'avatar-crop-overlay';
  panel.innerHTML = `
    <div class="avatar-crop-backdrop"></div>
    <div class="avatar-crop-panel">
      <div class="avatar-crop-head">
        <button class="back-btn" onclick="closeAvatarCropPreview()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1rem;font-weight:700;">Adjust Photo</h2>
        <button class="bm-popup-close" onclick="closeAvatarCropPreview()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="avatar-crop-body">
        <p class="avatar-crop-hint">Drag to reposition &middot; pinch or scroll to zoom</p>
        <div class="avatar-crop-stage" id="avCropStage">
          <img id="avCropImg" class="avatar-crop-img" src="${img.src}" draggable="false" alt="Your photo">
          <div class="avatar-crop-ring"></div>
        </div>
        <div class="avatar-crop-zoom-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="color:var(--txt3);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          <input type="range" id="avZoomSlider" class="avatar-crop-slider" min="100" max="300" value="100" oninput="avCropSetZoomFromSlider(this.value)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="color:var(--txt3);flex-shrink:0;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
      </div>
      <div class="avatar-crop-actions">
        <button class="btn-secondary" onclick="closeAvatarCropPreview()">Choose different</button>
        <button class="btn-primary" onclick="applyAvatarCrop()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Use this photo
        </button>
      </div>
    </div>`;

  document.body.appendChild(panel);
  requestAnimationFrame(() => panel.classList.add('open'));

  // Initialise cropper state once image is laid out
  const stage = panel.querySelector('#avCropStage');
  const imgEl = panel.querySelector('#avCropImg');

  const init = () => {
    const stageRect = stage.getBoundingClientRect();
    const stageSize = stageRect.width; // square stage
    const natW = img.naturalWidth, natH = img.naturalHeight;
    // Base scale so the image's shorter side exactly fills the stage (cover)
    const baseScale = stageSize / Math.min(natW, natH);

    _avCrop = {
      img, imgEl, stage,
      natW, natH, stageSize, baseScale,
      scale: 1,        // multiplier on top of baseScale, via slider (1x - 3x)
      offsetX: 0, offsetY: 0,  // pan offset in screen px, relative to centred position
      dragging: false, lastX: 0, lastY: 0,
      pinchStartDist: 0, pinchStartScale: 1
    };
    _avCropRender();
    _avCropBindEvents();
  };

  if (img.complete) requestAnimationFrame(init);
  else img.onload = () => requestAnimationFrame(init);
}

function _avCropRender() {
  if (!_avCrop) return;
  const { imgEl, baseScale, scale, offsetX, offsetY, natW, natH } = _avCrop;
  const totalScale = baseScale * scale;
  imgEl.style.width = `${natW * totalScale}px`;
  imgEl.style.height = `${natH * totalScale}px`;
  imgEl.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
}

function _avCropClamp() {
  if (!_avCrop) return;
  const { stageSize, baseScale, scale, natW, natH } = _avCrop;
  const totalScale = baseScale * scale;
  const dispW = natW * totalScale, dispH = natH * totalScale;
  // Max pan so the stage (centered) never reveals empty space
  const maxX = Math.max(0, (dispW - stageSize) / 2);
  const maxY = Math.max(0, (dispH - stageSize) / 2);
  _avCrop.offsetX = Math.max(-maxX, Math.min(maxX, _avCrop.offsetX));
  _avCrop.offsetY = Math.max(-maxY, Math.min(maxY, _avCrop.offsetY));
}

function avCropSetZoomFromSlider(val) {
  if (!_avCrop) return;
  _avCrop.scale = parseInt(val, 10) / 100;
  _avCropClamp();
  _avCropRender();
}

function _avCropBindEvents() {
  const stage = _avCrop.stage;

  // --- Pointer drag (mouse + touch via Pointer Events) ---
  const onDown = (e) => {
    if (!_avCrop) return;
    _avCrop.dragging = true;
    const p = _avCropPoint(e);
    _avCrop.lastX = p.x;
    _avCrop.lastY = p.y;
  };
  const onMove = (e) => {
    if (!_avCrop || !_avCrop.dragging) return;
    e.preventDefault();
    const p = _avCropPoint(e);
    _avCrop.offsetX += (p.x - _avCrop.lastX);
    _avCrop.offsetY += (p.y - _avCrop.lastY);
    _avCrop.lastX = p.x;
    _avCrop.lastY = p.y;
    _avCropClamp();
    _avCropRender();
  };
  const onUp = () => { if (_avCrop) _avCrop.dragging = false; };

  stage.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  // --- Scroll wheel zoom (desktop) ---
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!_avCrop) return;
    const slider = document.getElementById('avZoomSlider');
    let val = parseInt(slider.value, 10) - Math.sign(e.deltaY) * 8;
    val = Math.max(100, Math.min(300, val));
    slider.value = val;
    avCropSetZoomFromSlider(val);
  }, { passive: false });

  // --- Pinch to zoom (touch) ---
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2 && _avCrop) {
      _avCrop.pinchStartDist = _avCropTouchDist(e.touches);
      _avCrop.pinchStartScale = _avCrop.scale;
    }
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && _avCrop) {
      e.preventDefault();
      const dist = _avCropTouchDist(e.touches);
      const ratio = dist / (_avCrop.pinchStartDist || dist);
      let newScale = _avCrop.pinchStartScale * ratio;
      newScale = Math.max(1, Math.min(3, newScale));
      _avCrop.scale = newScale;
      const slider = document.getElementById('avZoomSlider');
      if (slider) slider.value = Math.round(newScale * 100);
      _avCropClamp();
      _avCropRender();
    }
  }, { passive: false });

  // Cleanup handlers are removed when the panel is closed via closeAvatarCropPreview
  _avCrop._cleanup = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };
}

function _avCropPoint(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function _avCropTouchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function closeAvatarCropPreview() {
  const panel = document.getElementById('avatar-crop-preview');
  if (_avCrop && _avCrop._cleanup) _avCrop._cleanup();
  _avCrop = null;
  if (panel) {
    panel.classList.remove('open');
    setTimeout(() => panel.remove(), 300);
  }
}

function applyAvatarCrop() {
  if (!_avCrop) return;
  const { img, stageSize, baseScale, scale, offsetX, offsetY, natW, natH } = _avCrop;
  const totalScale = baseScale * scale;

  // Work out which region of the ORIGINAL image is currently visible
  // inside the square stage, accounting for pan + zoom.
  const dispW = natW * totalScale, dispH = natH * totalScale;
  // Top-left of the displayed image relative to the stage's top-left
  const imgLeft = (stageSize - dispW) / 2 + offsetX;
  const imgTop = (stageSize - dispH) / 2 + offsetY;
  // The visible crop region in DISPLAY px is simply the stage itself: (0,0)-(stageSize,stageSize)
  // Convert that back into NATURAL image px:
  const srcX = (0 - imgLeft) / totalScale;
  const srcY = (0 - imgTop) / totalScale;
  const srcSize = stageSize / totalScale;

  const outputSize = 480;
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    img,
    Math.max(0, srcX), Math.max(0, srcY), srcSize, srcSize,
    0, 0, outputSize, outputSize
  );

  const croppedData = canvas.toDataURL('image/jpeg', 0.9);

  tempAvatarData = croppedData;
  const editImg = document.getElementById('editAvImg');
  const editText = document.getElementById('editAvText');
  if (editImg) { editImg.src = croppedData; editImg.style.display = 'block'; }
  if (editText) editText.style.display = 'none';
  closeAvatarCropPreview();
  showToast('Looking great! Tap Save to apply.');
}

function updateProfileAvatar() {
  const user = AppState.user;
  const avatarData = user.avatar || tempAvatarData;

  // Update profile page avatar frame host
  const profHost = document.getElementById('profAvatarFrameHost');
  if (profHost) {
    profHost.innerHTML = renderAvatarWithFrame(avatarData, user.equippedFrame || 'frame_1', 56, true);
  }

  // Update profile page avatar fallback
  const profText = document.getElementById('profAvText');
  const profImg = document.getElementById('profAvImg');
  if (profText) { profText.innerHTML = window.getDefaultAvatarSVG(); profText.style.display = avatarData ? 'none' : 'block'; }
  if (profImg) { 
    if (avatarData) {
      profImg.style.opacity = '0';
      profImg.src = avatarData;
      profImg.onerror = function() { this.onerror = null; this.outerHTML = window.getDefaultAvatarSVG(); };
      profImg.onload = function() { this.style.opacity = '1'; };
      profImg.style.display = 'block';
    } else {
      profImg.style.display = 'none';
    }
  }

  // Update edit profile avatar
  const editText = document.getElementById('editAvText');
  const editImg = document.getElementById('editAvImg');
  if (editText) { editText.innerHTML = window.getDefaultAvatarSVG(); editText.style.display = (avatarData || tempAvatarData) ? 'none' : 'block'; }
  if (editImg) { 
    if (tempAvatarData || avatarData) {
      editImg.style.opacity = '0';
      editImg.src = tempAvatarData || avatarData;
      editImg.onerror = function() { this.onerror = null; this.outerHTML = window.getDefaultAvatarSVG(); };
      editImg.onload = function() { this.style.opacity = '1'; };
      editImg.style.display = 'block';
    } else {
      editImg.style.display = 'none';
    }
  }
}

// ===== COMMUNITY =====
function likeThought(el) {
  el.classList.toggle('liked');
  const countEl = el.querySelector('.like-count');
  if (countEl) {
    let count = parseInt(countEl.textContent);
    countEl.textContent = el.classList.contains('liked') ? count + 1 : count - 1;
  }
}

function dislikeThought(el) {
  el.classList.toggle('disliked');
  const countEl = el.querySelector('.dislike-count');
  if (countEl) {
    let count = parseInt(countEl.textContent);
    countEl.textContent = el.classList.contains('disliked') ? count + 1 : count - 1;
  }
}

function toggleComments(thoughtId) {
  const commentsDiv = document.getElementById(`comments-${thoughtId}`);
  if (!commentsDiv) return;
  const isOpen = commentsDiv.classList.contains('open');
  document.querySelectorAll('.th-comments.open').forEach(el => {
    if (el !== commentsDiv) {
      el.style.setProperty('--target-height', `${el.scrollHeight}px`);
      requestAnimationFrame(() => { el.style.setProperty('--target-height', '0px'); el.classList.remove('open'); });
    }
  });
  if (isOpen) {
    commentsDiv.style.setProperty('--target-height', `${commentsDiv.scrollHeight}px`);
    requestAnimationFrame(() => { commentsDiv.style.setProperty('--target-height', '0px'); commentsDiv.classList.remove('open'); });
    return;
  }
  commentsDiv.classList.add('open');
  requestAnimationFrame(() => { commentsDiv.style.setProperty('--target-height', `${commentsDiv.scrollHeight}px`); });
}

function postComment(thoughtId) {
  const input = document.getElementById('comment-input-' + thoughtId);
  if (!input) return;
  const text = input.value.trim();
  if (!text) { showToast('Please enter a comment'); return; }

  const commentsDiv = document.getElementById('comments-' + thoughtId);
  if (!commentsDiv) return;

  const newComment = document.createElement('div');
  newComment.className = 'th-comment';
  newComment.innerHTML = `
    <div class="th-comment-av">${window.getDefaultAvatarSVG()}</div>
    <div class="th-comment-body">
      <div class="th-comment-user">${escapeHtml(AppState.user.firstName)}.</div>
      <div class="th-comment-text">${escapeHtml(text)}</div>
    </div>`;

  const inputWrap = commentsDiv.querySelector('.th-comment-input-wrap');
  if (inputWrap) commentsDiv.insertBefore(newComment, inputWrap);
  input.value = '';
  showToast('Comment posted');
  requestAnimationFrame(() => { commentsDiv.style.setProperty('--target-height', `${commentsDiv.scrollHeight}px`); });
}

// ===== BOTTOM NAV =====
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.nav-btn');
  if (btn) {
    const route = btn.dataset.route;
    if (route) { e.preventDefault(); Router.navigate(route); }
  }
});

window.addEventListener('resize', () => {
  const currentRoute = Router.getCurrentRoute().route;
  
  const navMap = {
    home: 0,
    practice: 1,
    tests: 2,
    ranks: 3,
    profile: 4
  };
  
  if (navMap[currentRoute] !== undefined) {
    Router.movePill(navMap[currentRoute]);
  }
});

// ===== AFTER APP INIT =====
// Listen for DOMContentLoaded to set up bell dot and URL-based panel
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initBellDot();
    checkProfilePanelInUrl();
  }, 1000);
});

// ===== QUIZ STYLE OVERLAY =====
function openQuizStyleOverlay() {
  const old = document.getElementById('quiz-style-overlay');
  if (old) old.remove();

  const s = AppState.settings;
  const currentStyle = s.quizStyle || 'standard';
  const denseCount = s.denseCount || 5;

  const panel = document.createElement('div');
  panel.id = 'quiz-style-overlay';
  panel.className = 'qs-overlay';
  panel.innerHTML = `
    <div class="qs-backdrop" onclick="closeQuizStyleOverlay()"></div>
<div class="qs-panel">
   <div class="qs-drag-handle"></div>

   <div class="qs-head">
        <button class="back-btn" onclick="closeQuizStyleOverlay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.05rem;font-weight:700;">Quiz Style</h2>
      </div>
      <div class="qs-content">
        <div class="qs-desc">Choose how questions are displayed during practice</div>

        <!-- Standard -->
        <div class="qs-option ${currentStyle==='standard'?'selected':''}" onclick="selectQuizStyle('standard')">
          <div class="qs-opt-head">
            <div class="qs-opt-radio ${currentStyle==='standard'?'on':''}">
              ${currentStyle==='standard' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <div class="qs-opt-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <div>
              <div class="qs-opt-title">Standard Mode</div>
              <div class="qs-opt-sub">Default — one question per screen</div>
            </div>
          </div>
        </div>

        <!-- Dense Practice -->
        <div class="qs-option ${currentStyle==='dense'?'selected':''}" onclick="selectQuizStyle('dense')" id="qsDenseOpt">
          <div class="qs-opt-head">
            <div class="qs-opt-radio ${currentStyle==='dense'?'on':''}">
              ${currentStyle==='dense' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <div class="qs-opt-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>
            <div>
              <div class="qs-opt-title">Dense Practice Mode</div>
              <div class="qs-opt-sub">Multiple questions per screen, submit together</div>
            </div>
          </div>
          <div class="qs-dense-config" id="qsDenseConfig" style="${currentStyle==='dense'?'':'display:none;'}">
            <div class="qs-dense-label">Questions per screen</div>
            <div class="num-input-wrap" style="margin-top:8px;">
              <button class="num-btn" onclick="event.stopPropagation();stepDenseCount(-1)">-</button>
              <input type="number" id="denseCountInput" min="3" max="10" step="1" value="${denseCount}"
                oninput="updateDenseCount(this.value)"
                onblur="clampDenseCount(this)"
                onclick="event.stopPropagation()"
                class="num-input">
              <span class="num-unit">Q</span>
              <button class="num-btn" onclick="event.stopPropagation();stepDenseCount(1)">+</button>
            </div>
            <div class="qs-dense-hint">Min 3 · Max 10</div>
          </div>
        </div>

        <!-- Compact -->
        <div class="qs-option ${currentStyle==='compact'?'selected':''}" onclick="selectQuizStyle('compact')">
          <div class="qs-opt-head">
            <div class="qs-opt-radio ${currentStyle==='compact'?'on':''}">
              ${currentStyle==='compact' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <div class="qs-opt-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <div class="qs-opt-title">Compact Mode</div>
              <div class="qs-opt-sub">Minimal UI · fast-paced · no prefixes</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

document.body.appendChild(panel);

requestAnimationFrame(() => {
    panel.classList.add('open');
    initQuizSheetDrag();
});

window.addEventListener('hashchange', closeQuizStyleOverlay, {
    once: true
});
}
function initQuizSheetDrag() {
  
  const panel = document.querySelector('.qs-panel');
  const handle = document.querySelector('.qs-drag-handle');
  
  if (!panel || !handle) return;
  
  let startY = 0;
  let startHeight = 0;
  
  handle.addEventListener('pointerdown', e => {
    
    startY = e.clientY;
    startHeight = panel.offsetHeight;
    
    function move(ev) {
      
      const diff = startY - ev.clientY;
      
      let newHeight = startHeight + diff;
      
      const min = window.innerHeight * 0.35;
      const max = window.innerHeight;
      
      newHeight = Math.max(min, Math.min(max, newHeight));
      
      panel.style.height = newHeight + 'px';
    }
    
    function up() {
      
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      
      const h = panel.offsetHeight;
      const vh = window.innerHeight;
      
      if (h > vh * .85) {
        panel.style.height = '100vh';
        panel.style.borderRadius = '0';
      }
      else if (h < vh * .45) {
        panel.style.height = '40vh';
      }
      else {
        panel.style.height = '70vh';
      }
    }
    
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });
}
function closeQuizStyleOverlay() {
  const panel = document.getElementById('quiz-style-overlay');
  if (panel) {
    panel.classList.remove('open');
    setTimeout(() => panel.remove(), 300);
  }
}

function selectQuizStyle(style) {
  AppState.settings.quizStyle = style;
  saveSettings();

  // Update all radio buttons
  document.querySelectorAll('.qs-option').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.qs-opt-radio').forEach(el => {
    el.classList.remove('on');
    el.innerHTML = '';
  });

  const opts = document.querySelectorAll('.qs-option');
  const styleMap = ['standard', 'dense', 'compact'];
  const idx = styleMap.indexOf(style);
  if (opts[idx]) {
    opts[idx].classList.add('selected');
    const radio = opts[idx].querySelector('.qs-opt-radio');
    if (radio) {
      radio.classList.add('on');
      radio.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>';
    }
  }

  // Show/hide dense config
  const denseConfig = document.getElementById('qsDenseConfig');
  if (denseConfig) denseConfig.style.display = style === 'dense' ? '' : 'none';

  // Update settings desc
  const desc = document.getElementById('quizStyleDesc');
  if (desc) desc.textContent = style === 'dense' ? 'Dense Practice Mode' : style === 'compact' ? 'Compact Mode' : 'Standard Mode';

  showToast(style === 'dense' ? 'Dense Practice Mode enabled' : style === 'compact' ? 'Compact Mode enabled' : 'Standard Mode enabled');
}

function updateDenseCount(val) {
  const n = parseInt(val);
  if (!isNaN(n)) { AppState.settings.denseCount = n; saveSettings(); }
}

function clampDenseCount(inp) {
  let n = parseInt(inp.value) || 5;
  n = Math.max(3, Math.min(10, n));
  inp.value = n;
  AppState.settings.denseCount = n;
  saveSettings();
}

function stepDenseCount(delta) {
  const inp = document.getElementById('denseCountInput');
  if (!inp) return;
  let n = parseInt(inp.value) || AppState.settings.denseCount || 5;
  n = Math.max(3, Math.min(10, n + delta));
  inp.value = n;
  AppState.settings.denseCount = n;
  saveSettings();
}

// ===== MTP / RTP MODULE =====
const MTP_RTP_SAMPLE_QS = {
  maths: [
    { q: 'If the mean of 5 observations is 12 and mean of 3 of them is 10, what is the mean of the remaining 2?', options: ['15', '14', '16', '13'], correct: 0 },
    { q: 'A frequency distribution has class intervals of width 10 each. The mode of the distribution is 25. The modal class is:', options: ['20-30', '15-25', '25-35', '10-20'], correct: 0 },
    { q: 'The correlation coefficient r always satisfies:', options: ['-1 ≤ r ≤ 1', '0 ≤ r ≤ 1', '-1 < r < 1', 'r > 0'], correct: 0 },
    { q: 'If regression line of Y on X is Y = 2 + 0.5X, and mean of X is 4, the mean of Y is:', options: ['4', '3', '5', '6'], correct: 0 },
    { q: 'The index number for base year is always taken as:', options: ['100', '0', '1', '200'], correct: 0 }
  ],
  economics: [
    { q: 'Which of the following is NOT a feature of a perfectly competitive market?', options: ['Product differentiation', 'Large number of buyers', 'Free entry and exit', 'Price taker firms'], correct: 0 },
    { q: 'When supply increases with no change in demand, the equilibrium price will:', options: ['Fall', 'Rise', 'Remain unchanged', 'Cannot say'], correct: 0 },
    { q: 'The price elasticity of demand for a perfectly inelastic good is:', options: ['Zero', 'One', 'Infinite', 'Greater than one'], correct: 0 },
    { q: 'GDP at market price minus Net Indirect Taxes equals:', options: ['GDP at factor cost', 'GNP', 'NNP', 'NDP'], correct: 0 },
    { q: 'Which institution regulates the money supply in India?', options: ['RBI', 'SEBI', 'IRDA', 'Ministry of Finance'], correct: 0 }
  ],
  law: [
    { q: 'A contract is void ab initio when:', options: ['Object is unlawful', 'One party is a minor', 'There is misrepresentation', 'There is mistake of fact by one party'], correct: 0 },
    { q: 'Consideration in a valid contract must be:', options: ['Real and not illusory', 'Always monetary', 'Past only', 'Provided by a third party'], correct: 0 },
    { q: 'A negotiable instrument payable to the bearer is transferred by:', options: ['Mere delivery', 'Endorsement only', 'Endorsement and delivery', 'Written assignment'], correct: 0 },
    { q: 'Under the Companies Act 2013, the minimum number of members to form a private company is:', options: ['2', '7', '5', '1'], correct: 0 },
    { q: 'A guarantee is said to be "continuing" when it:', options: ['Extends to a series of transactions', 'Covers one single transaction', 'Is revocable at will', 'Is limited to time'], correct: 0 }
  ],
  accounts: [
    { q: 'Under AS-1, the going concern concept assumes that the enterprise will continue for a period of at least:', options: ['12 months', '6 months', '24 months', 'Indefinitely'], correct: 0 },
    { q: 'Goodwill in a partnership firm is credited to the capital accounts of partners in:', options: ['Old profit sharing ratio', 'New profit sharing ratio', 'Equal ratio', 'Capital ratio'], correct: 0 },
    { q: 'Under the straight-line method, depreciation is charged on:', options: ['Original cost', 'Written down value', 'Market value', 'Replacement cost'], correct: 0 },
    { q: 'A Bill of Exchange is drawn by the:', options: ['Creditor', 'Debtor', 'Bank', 'Government'], correct: 0 },
    { q: 'Non-profit organizations prepare a statement called:', options: ['Income and Expenditure Account', 'Profit and Loss Account', 'Trading Account', 'Cash Flow Statement'], correct: 0 }
  ]
};

const MTP_RTP_DATA = {
  attempts: [
    {
      id: 'jan26', label: 'January 2026', type: 'both',
      mtp: [
        { id: 'mtp1_jan26', label: 'MTP 1', subjects: ['maths','economics','law','accounts'] },
        { id: 'mtp2_jan26', label: 'MTP 2', subjects: ['maths','economics','law','accounts'] }
      ],
      rtp: { id: 'rtp_jan26', label: 'RTP', subjects: ['maths','economics','law','accounts'] }
    },
    {
      id: 'may25', label: 'May 2025', type: 'both',
      mtp: [
        { id: 'mtp1_may25', label: 'MTP 1', subjects: ['maths','economics','law','accounts'] },
        { id: 'mtp2_may25', label: 'MTP 2', subjects: ['maths','economics','law','accounts'] }
      ],
      rtp: { id: 'rtp_may25', label: 'RTP', subjects: ['maths','economics','law','accounts'] }
    },
    {
      id: 'sep24', label: 'September 2024', type: 'both',
      mtp: [
        { id: 'mtp1_sep24', label: 'MTP 1', subjects: ['maths','economics','law','accounts'] },
        { id: 'mtp2_sep24', label: 'MTP 2', subjects: ['maths','economics','law','accounts'] }
      ],
      rtp: { id: 'rtp_sep24', label: 'RTP', subjects: ['maths','economics','law','accounts'] }
    }
  ]
};

const SUBJECT_META = {
  maths:     { name: 'Maths & Stats',   color: '#ffb534', type: 'mcq', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="7" r="1.5"/><line x1="8.5" y1="15.5" x2="10.5" y2="13.5"/><line x1="13.5" y1="10.5" x2="15.5" y2="8.5"/></svg>' },
  economics: { name: 'Business Economics',       color: '#a78bfa', type: 'mcq', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
  law:       { name: 'Business Laws',             color: '#e85d5d', type: 'mcq', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  accounts:  { name: 'Accounts',        color: '#4ade80', type: 'mcq', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' }
};

function openMtpRtp(mode) {
  const old = document.getElementById('mtprtp-overlay');
  if (old) old.remove();

  const attempts = MTP_RTP_DATA.attempts;
  const attemptsHtml = attempts.map(a => `
    <div class="mtprtp-attempt-card" onclick="mtprtpSelectAttempt('${a.id}', '${mode}')">
      <div>
        <div class="mtprtp-attempt-label">${a.label}</div>
        <div class="mtprtp-attempt-meta">${mode === 'mtp' ? `${a.mtp.length} Papers` : '1 RTP'} · 4 Subjects</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="color:var(--txt4);flex-shrink:0;"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`).join('');

  const panel = document.createElement('div');
  panel.id = 'mtprtp-overlay';
  panel.className = 'mtprtp-overlay fullpage';
  panel.innerHTML = `
    <div class="mtprtp-panel">
      <div class="mtprtp-head">
        <button class="back-btn" onclick="closeMtpRtp()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style="font-size:1.05rem;font-weight:700;">${mode === 'mtp' ? 'Mock Test Papers' : 'Revision Test Papers'}</h2>
          <div style="font-size:.72rem;color:var(--txt3);">ICAI CA Intermediate</div>
        </div>
        <div style="margin-left:auto;">
          <div class="mtprtp-mode-badge">${mode.toUpperCase()}</div>
        </div>
      </div>
      <div class="mtprtp-content" id="mtprtpContent">
        <div class="mtprtp-intro-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" style="color:var(--accent2);flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>Pick an attempt to start practising</span>
        </div>
        <div class="sec-label" style="margin-top:12px;">Attempt Cycles</div>
        <div class="mtprtp-attempts">${attemptsHtml}</div>
      </div>
    </div>`;

  document.body.appendChild(panel);
  requestAnimationFrame(() => panel.classList.add('open'));
}

function closeMtpRtp() {
  const panel = document.getElementById('mtprtp-overlay');
  if (panel) { panel.classList.remove('open'); setTimeout(() => panel.remove(), 300); }
}

function mtprtpSelectAttempt(attemptId, mode) {
  const attempt = MTP_RTP_DATA.attempts.find(a => a.id === attemptId);
  if (!attempt) return;

  const content = document.getElementById('mtprtpContent');
  if (!content) return;

  let papersHtml = '';
  if (mode === 'mtp') {
    papersHtml = attempt.mtp.map(p => `
      <div class="mtprtp-paper-card" onclick="mtprtpSelectPaper('${attemptId}', '${p.id}', '${mode}')">
        <div class="mtprtp-paper-icon" style="background:rgba(91,108,255,.12);color:var(--accent2);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
        <div style="flex:1;">
          <div class="mtprtp-paper-title">${p.label}</div>
          <div class="mtprtp-paper-meta">4 Subjects · 20 Questions</div>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" style="color:var(--txt4);"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`).join('');
  } else {
    const rtp = attempt.rtp;
    papersHtml = `
      <div class="mtprtp-paper-card" onclick="mtprtpSelectPaper('${attemptId}', '${rtp.id}', '${mode}')">
        <div class="mtprtp-paper-icon" style="background:rgba(74,222,128,.1);color:#4ade80;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div style="flex:1;">
          <div class="mtprtp-paper-title">${rtp.label} · ${attempt.label}</div>
          <div class="mtprtp-paper-meta">4 Subjects · 20 Questions</div>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" style="color:var(--txt4);"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`;
  }

  content.innerHTML = `
    <button class="mtprtp-back-btn" onclick="openMtpRtp('${mode}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
      All Attempts
    </button>
    <div class="sec-label" style="margin-top:8px;">${attempt.label}</div>
    <div class="mtprtp-papers">${papersHtml}`;
}

function mtprtpSelectPaper(attemptId, paperId, mode) {
  const attempt = MTP_RTP_DATA.attempts.find(a => a.id === attemptId);
  if (!attempt) return;
  const content = document.getElementById('mtprtpContent');
  if (!content) return;

  const subjects = ['maths','economics','law','accounts'];
  const subjectsHtml = subjects.map(sid => {
    const meta = SUBJECT_META[sid];
    const qCount = MTP_RTP_SAMPLE_QS[sid] ? MTP_RTP_SAMPLE_QS[sid].length : 5;
    return `
      <div class="mtprtp-subj-card" onclick="mtprtpStartPractice('${paperId}','${sid}','${attemptId}','${mode}')">
        <div class="mtprtp-subj-icon" style="color:${meta.color};background:${meta.color}18;">${meta.icon}</div>
        <div class="mtprtp-subj-info">
          <div class="mtprtp-subj-name">${meta.name}</div>
          <div class="mtprtp-subj-type">${qCount} MCQs</div>
        </div>
        <button class="mtprtp-start-btn" style="background:${meta.color}18;color:${meta.color};">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Practice
        </button>
      </div>`;
  }).join('');

  const paperLabel = mode === 'mtp'
    ? (attempt.mtp.find(p => p.id === paperId)?.label || paperId)
    : attempt.rtp.label;

  content.innerHTML = `
    <button class="mtprtp-back-btn" onclick="mtprtpSelectAttempt('${attemptId}','${mode}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
      Back
    </button>
    <div class="sec-label" style="margin-top:8px;">${attempt.label} · ${paperLabel}</div>
    <div class="mtprtp-subjects">${subjectsHtml}</div>
    <div style="margin-top:12px;">
      <button class="btn-primary" style="width:100%;" onclick="mtprtpStartPractice('${paperId}','all','${attemptId}','${mode}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Practice Full Paper
      </button>
    </div>`;
}

function openChangeEmailOverlay() {
  renderChangeEmail();
  setTimeout(() => {
    document.getElementById('fs-changeEmail')?.classList.add('open');
  }, 10);
}

function renderChangeEmail() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;
  
  const existing = document.getElementById('fs-changeEmail');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'fs-overlay';
  el.id = 'fs-changeEmail';
  el.style.zIndex = "1000";
  
  el.innerHTML = `
      <div class="fs-head">
        <button class="back-btn" onclick="document.getElementById('fs-changeEmail').classList.remove('open');">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Change Email</h2>
      </div>
      <div class="fs-content">
        <div class="form-group">
          <label class="form-label">New Email Address</label>
          <input type="email" class="form-input" id="inpNewEmail" placeholder="Enter new email">
        </div>
        
        <div class="form-group" id="ceOtpGroup" style="display:none; margin-top:20px;">
          <label class="form-label">Verification Code (OTP)</label>
          <input type="text" class="form-input" id="inpCeOtp" placeholder="6-digit code">
          <div style="font-size:0.85rem; color:var(--txt3); margin-top:8px;">Check your new email inbox for the verification code.</div>
        </div>

        <button class="btn-save" id="btnChangeEmail" onclick="submitChangeEmail()" style="margin-top:20px;">Send Verification Email</button>
      </div>
  `;
  
  overlay.appendChild(el);
}

async function submitChangeEmail() {
  const btn = document.getElementById('btnChangeEmail');
  const otpGroup = document.getElementById('ceOtpGroup');
  
  if (otpGroup.style.display === 'none') {
    const newEmail = document.getElementById('inpNewEmail').value.trim();
    if (!newEmail) { showToast('Enter new email'); return; }
    if (newEmail === AppState.user.email) { showToast('This is your current email'); return; }
    
    const origTxt = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;
    
    const res = await window.handleSendEmailChangeOtp(newEmail);
    
    btn.innerHTML = origTxt;
    btn.disabled = false;
    
    if (res.error) {
      showToast(res.error);
    } else {
      showToast('OTP sent to new email!');
      document.getElementById('inpNewEmail').disabled = true;
      document.getElementById('inpNewEmail').style.opacity = '0.7';
      otpGroup.style.display = 'block';
      btn.innerHTML = 'Submit OTP';
    }
  } else {
    const newEmail = document.getElementById('inpNewEmail').value.trim();
    const otp = document.getElementById('inpCeOtp').value.trim();
    if (!otp) { showToast('Enter OTP'); return; }
    
    const origTxt = btn.innerHTML;
    btn.innerHTML = 'Verifying...';
    btn.disabled = true;
    
    const res = await window.handleVerifyEmailChangeOtp(newEmail, otp);
    
    btn.innerHTML = 'Submit OTP';
    btn.disabled = false;
    
    if (res.error) {
      showToast(res.error);
    } else {
      showToast('Email updated successfully!');
      document.getElementById('fs-changeEmail').classList.remove('open');
      renderEditProfile();
      setTimeout(() => document.getElementById('fs-editProfile')?.classList.add('open'), 50);
    }
  }
}

function mtprtpStartPractice(paperId, subjectId, attemptId, mode) {
  let questions = [];
  const attempt = MTP_RTP_DATA.attempts.find(a => a.id === attemptId);
  const paperLabel = mode === 'mtp'
    ? (attempt?.mtp.find(p => p.id === paperId)?.label || paperId)
    : (attempt?.rtp?.label || 'RTP');
  const attemptLabel = attempt?.label || attemptId;

  if (subjectId === 'all') {
    Object.keys(MTP_RTP_SAMPLE_QS).forEach(sid => {
      (MTP_RTP_SAMPLE_QS[sid] || []).forEach(q => questions.push({...q, _subjectId: sid}));
    });
  } else {
    questions = [...(MTP_RTP_SAMPLE_QS[subjectId] || [])];
  }

  if (!questions.length) { showToast('No questions yet for this section'); return; }

  const subName = subjectId === 'all' ? 'Full Paper' : (SUBJECT_META[subjectId]?.name || subjectId);
  const title = `${mode.toUpperCase()} · ${attemptLabel} · ${subName}`;

  // Close overlay first, then launch MCQ
  closeMtpRtp();
  setTimeout(() => {
    if (typeof startQuizWithQuestions === 'function') {
      startQuizWithQuestions(questions, {
        title,
        subject: subjectId === 'all' ? 'maths' : subjectId,
        chapterId: paperId
      });
    } else {
      showToast('Quiz engine not ready');
    }
  }, 320);
}

window.openMtpRtp = openMtpRtp;
window.closeMtpRtp = closeMtpRtp;
window.mtprtpSelectAttempt = mtprtpSelectAttempt;
window.mtprtpSelectPaper = mtprtpSelectPaper;
window.mtprtpStartPractice = mtprtpStartPractice;
window.openQuizStyleOverlay = openQuizStyleOverlay;
window.closeQuizStyleOverlay = closeQuizStyleOverlay;
window.selectQuizStyle = selectQuizStyle;
window.updateDenseCount = updateDenseCount;
window.clampDenseCount = clampDenseCount;
window.stepDenseCount = stepDenseCount;

window.bmSetSort = bmSetSort;
window.bmToggleSortMenu = bmToggleSortMenu;
window.bmPracticeAll = bmPracticeAll;
window.bmPracticeSingle = bmPracticeSingle;
window.bmToggleOptions = bmToggleOptions;
window.deleteBookmark = deleteBookmark;
// ==========================================
// STREAK GOAL LOGIC
// ==========================================
let pendingStreakGoal = 7;
let claimRewardAmount = 0;

function setGoalSlider(val) {
  document.getElementById('goal-range').value = val;
  updateGoalSlider(val);
}

function updateGoalSlider(val) {
  let snapVal = parseInt(val, 10);
  if (snapVal % 7 !== 0 && snapVal % 10 !== 0) {
    // find nearest multiple of 7 or 10
    let diff7 = snapVal % 7;
    let diff10 = snapVal % 10;
    if (diff7 < diff10) snapVal = snapVal - diff7;
    else snapVal = snapVal - diff10;
    
    // snap to nearest upper if > half
    if (val - snapVal > 3.5) snapVal += 7;
    
    // final clamp
    if (snapVal < 7) snapVal = 7;
    if (snapVal > 120) snapVal = 120;
  }
  
  const isPendingGoal = localStorage.getItem('pe_pending_goal_choice') === 'true';
  const lastCompleted = parseInt(localStorage.getItem('pe_last_completed_goal') || '0', 10);
  
  if (isPendingGoal && snapVal <= lastCompleted) {
    let nextSnap = lastCompleted + 1;
    while (nextSnap % 7 !== 0 && nextSnap % 10 !== 0) {
      nextSnap++;
    }
    snapVal = nextSnap;
    if (snapVal > 120) snapVal = 120;
  }
  
  document.getElementById('goal-range').value = snapVal;
  pendingStreakGoal = snapVal;
  document.getElementById('goal-slider-val').innerText = snapVal + ' Days';
}

window.openGoalModal = function(fromProfile = false) {
  if (AppState.streakGoal > 0 && AppState.streak >= AppState.streakGoal) {
    checkStreakGoal();
    return;
  }

  const modal = document.getElementById('goal-modal-overlay');
  if (!modal) return;
  
  const range = document.getElementById('goal-range');
  const confirmBtn = modal.querySelector('.goal-modal-content button[onclick="confirmGoal()"]');
  const quickOpts = modal.querySelectorAll('.goal-quick-btn');
  const title = modal.querySelector('h2');
  const closeBtn = document.getElementById('goal-modal-close-btn');
  
  const defaultQuickOpts = [7, 14, 30, 120];
  if (quickOpts) {
    quickOpts.forEach((b, i) => {
      const lbl = b.querySelector('.gqb-lbl');
      const num = b.querySelector('.gqb-num');
      if (num) num.innerHTML = defaultQuickOpts[i];
      if (lbl) lbl.innerText = 'Days';
      b.setAttribute('onclick', `setGoalSlider(${defaultQuickOpts[i]})`);
      b.style.opacity = '1';
      b.style.pointerEvents = 'auto';
      b.style.background = '';
      b.style.border = '';
      b.style.color = '';
    });
  }

  const isPendingGoal = localStorage.getItem('pe_pending_goal_choice') === 'true';
  const lastCompleted = parseInt(localStorage.getItem('pe_last_completed_goal') || '0', 10);
  
  if (AppState.streakGoal > 0) {
    // Read only mode
    if (range) {
      range.disabled = true;
      range.value = AppState.streakGoal;
    }
    if (confirmBtn) confirmBtn.style.display = 'none';
    if (quickOpts) quickOpts.forEach(b => b.style.display = 'inline-block');
    setTimeout(() => { if (quickOpts) quickOpts.forEach(b => b.style.display = 'none'); }, 0); // Hide quick opts
    if (title) title.innerText = 'Your Streak Goal';
    document.getElementById('goal-slider-val').innerText = AppState.streakGoal + ' Days';
    if (closeBtn) closeBtn.style.display = 'flex';
  } else {
    // Edit mode
    if (closeBtn) closeBtn.style.display = isPendingGoal ? 'none' : 'flex';

    if (range) {
      range.disabled = false;
      const initialVal = isPendingGoal ? Math.max(lastCompleted + 7, 7) : 7;
      setGoalSlider(initialVal);
    }
    if (confirmBtn) confirmBtn.style.display = 'block';
    if (quickOpts) quickOpts.forEach(b => b.style.display = 'inline-block');
    if (title) title.innerText = isPendingGoal ? 'Set Next Milestone' : 'Set Your Streak Goal';

    if (isPendingGoal && quickOpts) {
      quickOpts.forEach((b, i) => {
        if (defaultQuickOpts[i] <= lastCompleted) {
          if (defaultQuickOpts[i] === lastCompleted) {
            b.querySelector('.gqb-num').innerHTML = '✓';
            b.querySelector('.gqb-lbl').innerText = 'Finished';
          }
          b.style.opacity = '0.5';
          b.style.pointerEvents = 'none';
          b.style.background = 'var(--bg2)';
          b.style.border = '1px solid var(--green)';
          b.style.color = 'var(--green)';
        }
      });
    }
  }
  
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('open'), 10);
};

async function confirmGoal() {
  const modal = document.getElementById('goal-modal-overlay');
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 400);

  AppState.streakGoal = pendingStreakGoal;
  showToast(`Goal set to ${AppState.streakGoal} Days!`);
  
  localStorage.removeItem('pe_pending_goal_choice');
  localStorage.removeItem('pe_last_completed_goal');
  
  const closeBtn = document.getElementById('goal-modal-close-btn');
  if (closeBtn) closeBtn.style.display = 'flex';
  
  if (window.saveUser) saveUser();
  
  // Re-render home to update the streak box
  if (Router.getCurrentRoute().route === 'home') {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.innerHTML = '<div class="view-content">' + window.renderHome() + '</div>';
    if (window.initHome) window.initHome();
  }
}

function checkStreakGoal() {
  if (AppState.streakGoal > 0 && AppState.streak >= AppState.streakGoal) {
    if (window.confetti) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 10000 });
    }

    localStorage.setItem('pe_pending_goal_choice', 'true');
    localStorage.setItem('pe_last_completed_goal', AppState.streakGoal);

    // Show celebration
    claimRewardAmount = 25; // Bonus XP
    const overlay = document.getElementById('goal-celebration-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => {
        const content = overlay.querySelector('.celebration-content');
        if (content) {
          content.style.transform = 'scale(1)';
          content.style.opacity = '1';
        }
      }, 10);
    }
    
    // Reset goal so we don't trigger it again on every page load
    AppState.streakGoal = 0; 
  }
}

async function claimGoalReward() {
  AppState.xp += claimRewardAmount;
  
  const overlay = document.getElementById('goal-celebration-overlay');
  if (overlay) {
    const content = overlay.querySelector('.celebration-content');
    if (content) {
      content.style.transform = 'scale(0.8)';
      content.style.opacity = '0';
    }
    setTimeout(() => { overlay.style.display = 'none'; }, 500);
  }
  
  showToast(`+${claimRewardAmount} XP Claimed!`);
  
  // Now show the goal setter again
  setTimeout(() => {
    if (window.openGoalModal) window.openGoalModal(false);
  }, 600);
}

function renderTests() {
  if (typeof renderTestsAsync === 'function') {
    renderTestsAsync();
    return typeof _skeleton === 'function' ? _skeleton() : '<div class="loading-state">Loading tests...</div>';
  }
  return '<div class="loading-state">Loading tests...</div>';
}

window.renderHome = renderHome;
window.initHome = initHome;
window.renderPractice = renderPractice;
window.initPractice = initPractice;
window.renderTests = renderTests;
window.renderRanks = renderRanks;
window.renderProfile = renderProfile;
window.initProfile = initProfile;
window.renderEditProfile = renderEditProfile;
window.renderPerformance = renderPerformance;
window.renderBookmarks = renderBookmarks;
window.renderCommunity = renderCommunity;
window.renderPdfLibrary = renderPdfLibrary;
window.renderSettings = renderSettings;
window.openFs = openFs;
window.closeFs = closeFs;
window.openProfileOverlay = openProfileOverlay;
window.closeProfileOverlay = closeProfileOverlay;
window.closeNotif = closeNotif;
window.markAllRead = markAllRead;
window.updateBellDot = updateBellDot;
window.toggleSwitch = toggleSwitch;
window.toggleSettingBool = toggleSettingBool;
window.toggleSoundEffects = toggleSoundEffects;
window.toggleTimerSetting = toggleTimerSetting;
window.updateTimerDuration = updateTimerDuration;
window.toggleLabelSetting = toggleLabelSetting;
window.setLabelStyle = setLabelStyle;
window.toggleNegMarking = toggleNegMarking;
window.updateNegMark = updateNegMark;
window.applyTheme = applyTheme;
window.setTheme = setTheme;
window.generateHeatmap = generateHeatmap;
window.openAvatarSheet = openAvatarSheet;
window.closeAvatarSheet = closeAvatarSheet;
window.chooseFromGallery = chooseFromGallery;
window.removeAvatar = removeAvatar;
window.handleAvatarSelect = handleAvatarSelect;
window.closeAvatarCropPreview = closeAvatarCropPreview;
window.applyAvatarCrop = applyAvatarCrop;
window.avCropSetZoomFromSlider = avCropSetZoomFromSlider;
window.saveProfile = saveProfile;
window.toggleLabelDropdown = toggleLabelDropdown;
window.selectLabelStyle = selectLabelStyle;
window.stepTimerDuration = stepTimerDuration;
window.clampTimerDuration = clampTimerDuration;
window.stepNegMark = stepNegMark;
window.clampNegMark = clampNegMark;
window.toggleAttemptDropdown = toggleAttemptDropdown;
window.closeDropdown = closeDropdown;
window.selectAttempt = selectAttempt;
window.likeThought = likeThought;
window.dislikeThought = dislikeThought;
window.toggleComments = toggleComments;
window.postComment = postComment;
window.toggleFullscreenSetting = toggleFullscreenSetting;
window.setGoalSlider = setGoalSlider;
window.updateGoalSlider = updateGoalSlider;
window.confirmGoal = confirmGoal;
window.claimGoalReward = claimGoalReward;
window.checkStreakGoal = checkStreakGoal;
window.openChangeEmailOverlay = openChangeEmailOverlay;
window.submitChangeEmail = submitChangeEmail;

// ===== TELEGRAM LINKING =====
window.renderTelegramLink = function() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-telegramLink">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('telegramLink')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Link Telegram</h2>
      </div>
      <div class="fs-content" style="padding-top:20px;">
        <div style="text-align:center; margin-bottom:20px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0088cc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="48" height="48" style="margin-bottom:12px;"><path d="M21.5 2L2.5 10L9.5 13L12.5 21L16 15.5L21.5 2Z"/></svg>
          <p style="color:var(--txt2); font-size:0.9rem; line-height:1.5;">Enter the unique code provided by <b>InterEdgeBot</b> on Telegram to link your account.</p>
        </div>
        <div class="form-group">
          <label class="form-label">Link Code</label>
          <input type="text" class="form-input" id="inpTelegramCode" placeholder="IE-A1B2C3" style="text-transform:uppercase; text-align:center; letter-spacing:2px; font-weight:600; font-size:1.1rem;">
        </div>
        <button class="btn-save" id="btnLinkTelegram" onclick="linkTelegram()">Link Account</button>
      </div>
    </div>`;

  setTimeout(() => {
    const el = document.getElementById('fs-telegramLink');
    if (el) el.classList.add('open');
  }, 10);
};

window.linkTelegram = async function() {
  const code = document.getElementById('inpTelegramCode')?.value.trim();
  if (!code) { showToast('Please enter the code'); return; }

  const btn = document.getElementById('btnLinkTelegram');
  if(btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner" style="border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;width:20px;height:20px;animation:spin 0.8s linear infinite;margin:0 auto;"></div>'; }

  AppState.user.telegram_chat_id = 'tg_' + code;
  saveUser();
  showToast('Telegram linked successfully (Trial Mode)!');
  closeProfileOverlay('telegramLink');
};

window.toggleTelegramMenu = function() {
  const expand = document.getElementById('tgExpand');
  const arrow = document.querySelector('.tg-arrow');
  if (!expand) return;
  if (expand.style.maxHeight === '0px' || !expand.style.maxHeight) {
    expand.style.maxHeight = '100px';
    if(arrow) arrow.style.transform = 'rotate(180deg)';
  } else {
    expand.style.maxHeight = '0px';
    if(arrow) arrow.style.transform = 'rotate(0deg)';
  }
};

window.unlinkTelegram = async function(e) {
  if (e) e.stopPropagation();
  const confirmed = confirm("Are you sure you want to unlink Telegram?");
  if (!confirmed) return;
  
  AppState.user.telegram_chat_id = null;
  saveUser();
  showToast('Telegram unlinked');
};

// ============================================
// PDF LIBRARY OVERLAY
// ============================================
window.pdfLibraryData = null;

window.fetchPdfLibraryData = async function() {
  if (window.pdfLibraryData) return window.pdfLibraryData;
  
  const FOLDER_ID = '1Ci6dlsCVqkg9P15q6DBaJZMQOJZ8V5NL';
  const API_KEY = 'AIzaSyA34Rt2GPDG1A3egH4e0OePlaTOq7dm8Vk';
  
  // Try Cache
  const cached = localStorage.getItem('pdfDriveCache');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 3600000) { // 1 hour cache
        window.pdfLibraryData = parsed.data;
        return parsed.data;
      }
    } catch(e) {}
  }
  
  try {
    async function fetchFolder(id) {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q='${id}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,size,webViewLink,webContentLink)&key=${API_KEY}`);
      const data = await res.json();
      if (!data.files) return [];
      
      let all = data.files.filter(f => f.mimeType === 'application/pdf');
      const folders = data.files.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
      
      if (folders.length > 0) {
        const subResults = await Promise.all(folders.map(f => fetchFolder(f.id)));
        subResults.forEach(r => all.push(...r));
      }
      return all;
    }
    
    const files = await fetchFolder(FOLDER_ID);
    if (files && files.length > 0) {
      window.pdfLibraryData = files;
      localStorage.setItem('pdfDriveCache', JSON.stringify({ timestamp: Date.now(), data: files }));
      return files;
    }
  } catch(e) {}

  const dummyFiles = [
    { id: 'pdf1', name: 'MTP Series 1 - Business Laws 2026.pdf', mimeType: 'application/pdf', size: 1048576, webViewLink: '#' },
    { id: 'pdf2', name: 'MTP Series 1 - Maths & Statistics 2026.pdf', mimeType: 'application/pdf', size: 1258291, webViewLink: '#' },
    { id: 'pdf3', name: 'MTP Series 1 - Business Economics 2026.pdf', mimeType: 'application/pdf', size: 984576, webViewLink: '#' },
    { id: 'pdf4', name: 'RTP Nov 2026 - Comprehensive Review.pdf', mimeType: 'application/pdf', size: 2097152, webViewLink: '#' },
    { id: 'pdf5', name: 'PYQ May 2025 - Solved Question Paper.pdf', mimeType: 'application/pdf', size: 1572864, webViewLink: '#' }
  ];
  window.pdfLibraryData = dummyFiles;
  return dummyFiles;
};

window.renderPdfLibrary = function() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="fs-overlay open" id="fs-pdfLibrary">
      <div class="search-wrap">
        <div class="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" id="pdfSearchInput" type="search" placeholder="Search PDFs by name, year, subject…" oninput="window.filterPdfs()" />
        </div>
      </div>
      <div class="tabs-wrap">
        <button class="tab-btn active" id="tab-mtp" onclick="window.pdfSwitchTab('mtp')">MTP</button>
        <button class="tab-btn" id="tab-rtp" onclick="window.pdfSwitchTab('rtp')">RTP</button>
        <button class="tab-btn" id="tab-pyq" onclick="window.pdfSwitchTab('pyq')">PYQ</button>
      </div>
      <div class="fs-content" style="flex:1; overflow-y:auto; padding: 16px 16px 30px;">
        <div class="tab-panel active" id="panel-mtp">
          <div style="text-align:center; padding: 40px; color:var(--txt4);">
            <div class="spinner" style="border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
            Fetching PDFs from Google Drive...
          </div>
        </div>
        <div class="tab-panel" id="panel-rtp" style="display:none;"></div>
        <div class="tab-panel" id="panel-pyq" style="display:none;"></div>
      </div>
    </div>
  `;
  
  window.fetchPdfLibraryData().then(files => {
    window.buildPdfLibraryUI(files);
  });
};

function formatBytes(bytes, decimals = 1) {
    if (!+bytes) return '0 Bytes';
    const k = 1024, dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

window.buildPdfLibraryUI = function(files) {
  let mtps = files.filter(f => f.name.toLowerCase().includes('mtp'));
  let rtps = files.filter(f => f.name.toLowerCase().includes('rtp'));
  let pyqs = files.filter(f => !f.name.toLowerCase().includes('mtp') && !f.name.toLowerCase().includes('rtp'));
  
  function renderGroup(groupFiles, badge) {
    if (groupFiles.length === 0) return '<div style="padding:20px; text-align:center; color:var(--txt4);">No PDFs found here.</div>';
    
    // Group files by Attempt Date
    const groups = {};
    groupFiles.forEach(f => {
      const match = f.name.match(/(Jan|Feb|Mar|Apr|May|Jun|June|Jul|July|Aug|Sep|Sept|Oct|Nov|Dec)\s*20\d{2}/i);
      const groupKey = match ? match[0].trim() : 'Other';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(f);
    });
    
    // Sort groups descending by year then roughly by month
    const monthVal = m => ({'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'jun':6,'june':6,'jul':7,'july':7,'aug':8,'sep':9,'sept':9,'oct':10,'nov':11,'dec':12}[m.toLowerCase().substring(0,3)] || 0);
    const sortedKeys = Object.keys(groups).sort((a,b) => {
      if(a==='Other') return 1; if(b==='Other') return -1;
      const [mA, yA] = a.split(' ');
      const [mB, yB] = b.split(' ');
      if (yA !== yB) return parseInt(yB) - parseInt(yA);
      return monthVal(mB) - monthVal(mA);
    });

    let html = '';
    sortedKeys.forEach(k => {
      html += `<div class="cat-header" style="margin-top:20px; margin-bottom:12px;">
                 <div class="cat-dot" style="background:var(--accent);"></div>
                 <div class="cat-title">${k}</div>
                 <div class="cat-count">${groups[k].length} Papers</div>
               </div>`;
               
      groups[k].forEach(f => {
        let color = 'var(--accent)';
        let subj = 'General';
        const nameLower = f.name.toLowerCase();
        if (nameLower.includes('account')) { color = 'var(--blue)'; subj = 'Accounts'; }
        if (nameLower.includes('law')) { color = 'var(--red)'; subj = 'Business Laws'; }
        if (nameLower.includes('maths') || nameLower.includes('quantitative')) { color = 'var(--amber)'; subj = 'Maths & Stats'; }
        if (nameLower.includes('eco')) { color = 'var(--green)'; subj = 'Business Eco'; }
        
        const sizeStr = formatBytes(f.size || 0);
        
        // Clean name (remove MTP, RTP, month, etc)
        let cleanName = f.name.replace('.pdf','').replace(/^(MTP|RTP)\s*-\s*/i, '').replace(/-\s*(Jan|Feb|Mar|Apr|May|Jun|June|Jul|July|Aug|Sep|Sept|Oct|Nov|Dec)\s*20\d{2}\s*/i, '').trim();
        if (cleanName.endsWith('-')) cleanName = cleanName.slice(0, -1).trim();
        
        const dlLink = f.webContentLink || f.webViewLink;
        
        html += `
          <div class="pdf-card" onclick="window.open('${f.webViewLink || dlLink}', '_blank')">
            <div class="pdf-icon" style="background:linear-gradient(135deg,${color}33,${color}11);border:1px solid ${color}40;color:${color};">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div class="pdf-meta">
              <div class="pdf-name">${cleanName}</div>
              <div class="pdf-sub">
                <span>${subj}</span><div class="pdf-sub-dot"></div><span>${sizeStr}</span>
              </div>
              <div class="pdf-badges">
                <span class="pdf-badge">${badge}</span>
              </div>
            </div>
            <a href="${dlLink}" target="_blank" class="pdf-dl" onclick="event.stopPropagation()">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
          </div>
        `;
      });
    });
    return html;
  }
  
  const panelPyq = document.getElementById('panel-pyq');
  const panelMtp = document.getElementById('panel-mtp');
  const panelRtp = document.getElementById('panel-rtp');
  
  if (panelPyq) panelPyq.innerHTML = renderGroup(pyqs, 'PYQ');
  if (panelMtp) panelMtp.innerHTML = renderGroup(mtps, 'MTP');
  if (panelRtp) panelRtp.innerHTML = renderGroup(rtps, 'RTP');
};

window.pdfSwitchTab = function(tab) {
  ['pyq', 'mtp', 'rtp'].forEach(t => {
    document.getElementById('tab-' + t).classList.remove('active');
    document.getElementById('panel-' + t).style.display = 'none';
  });
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('panel-' + tab).style.display = 'block';
};

window.pdfSetFilter = function(tab, val, el) {
  const chips = el.closest('.filter-chips').querySelectorAll('.filter-chip');
  chips.forEach(c => {
    c.classList.remove('active');
    c.style.background = '';
    c.style.borderColor = '';
    c.style.color = '';
  });
  el.classList.add('active');
  const colors = { pyq: 'var(--accent)', mtp: 'var(--amber)', rtp: 'var(--green)' };
  const color = colors[tab] || 'var(--accent)';
  el.style.background = color;
  el.style.borderColor = color;
  el.style.color = '#fff';

  const panel = document.getElementById('panel-' + tab);
  panel.querySelectorAll('.pdf-card').forEach(card => {
    if (val === 'all') {
      card.style.display = '';
    } else {
      card.style.display = (card.dataset.subject === val) ? '' : 'none';
    }
  });
};

window.filterPdfs = function() {
  const query = document.getElementById('pdfSearchInput').value.toLowerCase().trim();
  document.querySelectorAll('.pdf-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
};


// ============================================
// CRUX (Insights & Strategy) OVERLAY
// ============================================
window.CRUX_ARTICLES = {
  article1: {
    title: 'Screen Time & Your Brain: The Perfect CA Intermediate Management Routine',
    category: 'Focus',
    categoryColor: '#a78bfa',
    author: 'InterEdge Team',
    date: 'July 15, 2026',
    readTime: '6 min read',
    tags: ['Productivity', 'Screen Time', 'Routine', 'Focus'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>',
    heroBg: 'linear-gradient(135deg, #1a0a3e 0%, #2d1b69 50%, #4c2a9e 100%)',
    body: `
      <div class="article-body">
        <p>In the digital age, screen time isn't just an eye strain issue—it's a massive drain on your cognitive load. When preparing for CA Intermediate, how you manage your devices is just as important as how you manage your textbooks.</p>
        
        <h2>The "Context Switching" Tax</h2>
        <p>Every time you switch from solving a Partnership Account problem to checking a WhatsApp notification, your brain pays a "switching tax." It takes an average of 23 minutes to fully regain deep focus. If you check your phone every 15 minutes, you are theoretically <strong>never</strong> in a state of deep work.</p>
        
        <div class="tip-box">
          <div class="tip-box-label">Focus Rule</div>
          <p>Implement the <strong>90-15 Rule</strong>: 90 minutes of absolute offline focus, followed by a 15-minute complete break (which can include screen time).</p>
        </div>
        
        <h2>Designing Your Daily Routine</h2>
        <p>A proper management routine minimizes decision fatigue. Your brain shouldn't wake up wondering, <em>"What should I study today?"</em></p>
        <ul>
          <li><strong>The Night Before:</strong> Plan exactly what chapters you will tackle. Place those specific books on your desk.</li>
          <li><strong>Morning (The Golden Hours):</strong> Tackle your hardest subject (usually Maths or Accounts). No social media until 12 PM.</li>
          <li><strong>Afternoon (The Slump):</strong> Do lighter tasks—reviewing Business Laws sections, or solving easier PYQs.</li>
          <li><strong>Evening:</strong> Active recall sessions and mock tests.</li>
        </ul>
        
        <div class="highlight">
          <p>Remove the friction to start studying, and increase the friction to access distractions. Put your phone in another room while doing the 90-minute sprints.</p>
        </div>
      </div>
    `
  },
  article2: {
    title: 'The Science of Active Recall: Stop Passive Reading',
    category: 'Strategy',
    categoryColor: '#ef4444',
    author: 'InterEdge Team',
    date: 'July 12, 2026',
    readTime: '5 min read',
    tags: ['Active Recall', 'Study Tactics', 'Memory'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    heroBg: 'linear-gradient(135deg, #3b0a0a 0%, #7f1d1d 50%, #991b1b 100%)',
    body: `
      <div class="article-body">
        <p>Highlighting textbook pages and reading them 5 times is what we call <em>passive learning</em>. It creates an "illusion of competence"—you feel like you know it because the text is familiar, but the moment the book is closed, you blank out in the exam hall.</p>
        
        <h2>What is Active Recall?</h2>
        <p>Active recall involves intentionally retrieving information from your brain without looking at the material. It forces your neural pathways to strengthen the connection to that memory.</p>
        
        <div class="tip-box">
          <div class="tip-box-label">Application in Law</div>
          <p>Don't just read the Indian Contract Act. Read a section, close the book, and explain it out loud as if you're teaching a 5-year-old. If you stumble, you don't know it yet.</p>
        </div>
        
        <h2>The Feynman Technique</h2>
        <p>Write down a concept on a blank sheet of paper. Try to explain it completely using simple language. Wherever you get stuck, that is exactly where your knowledge gap is. Go back to the book <em>only</em> to fix that gap, then try again.</p>
      </div>
    `
  },
  article3: {
    title: 'Mastering the 15-Minute Reading Time Strategy',
    category: 'Strategy',
    categoryColor: '#f59e0b',
    author: 'InterEdge Team',
    date: 'July 10, 2026',
    readTime: '4 min read',
    tags: ['Exam Hall', 'Reading Time', 'Strategy'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    heroBg: 'linear-gradient(135deg, #3f2005 0%, #78350f 50%, #b45309 100%)',
    body: `
      <div class="article-body">
        <p>For subjective papers like Accounts and Law, ICAI provides a 15-minute reading time before you can start writing. How you utilize these 15 minutes often dictates whether you finish the paper on time.</p>
        
        <h2>Do Not Read the First Compulsory Question First</h2>
        <p>The compulsory question (Question 1) is often lengthy and designed to consume time. If you read it first, you will waste 10 minutes just decoding it, leaving you panicked for the rest of the paper.</p>
        
        <div class="tip-box">
          <div class="tip-box-label">The Selection Strategy</div>
          <p>Spend the first 5 minutes selecting which optional question you will <strong>leave</strong>. Once that decision is made, your mental load is reduced.</p>
        </div>
        
        <h2>Mental Framing</h2>
        <p>In the remaining 10 minutes, decide the exact order in which you will attempt the questions. Always start with the question you know 100%. A strong start builds momentum and confidence, which carries you through the tougher questions later.</p>
      </div>
    `
  }
};

window.renderCrux = function() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  let listHtml = '';
  Object.keys(window.CRUX_ARTICLES).forEach(key => {
    const a = window.CRUX_ARTICLES[key];
    listHtml += `
      <div class="article-card" onclick="window.openCruxArticle('${key}')">
        <div class="article-thumb" style="background:linear-gradient(135deg, ${a.categoryColor}33, ${a.categoryColor}11); color:${a.categoryColor};">
          ${a.icon}
        </div>
        <div class="article-meta">
          <div class="article-category" style="color:${a.categoryColor};">${a.category}</div>
          <div class="article-title">${a.title}</div>
          <div class="article-row">
            <span>${a.author}</span><div class="article-row-dot"></div><span>${a.date}</span><div class="article-row-dot"></div><span>${a.readTime}</span>
          </div>
        </div>
      </div>
    `;
  });

  overlay.innerHTML = `
    <div class="fs-overlay open" id="fs-crux">
      <!-- List View -->
      <div id="crux-list-view" style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
        <div class="cats-wrap" style="flex-shrink:0;">
          <span class="cat-pill active">All Insights</span>
          <span class="cat-pill">Strategy</span>
          <span class="cat-pill">Focus</span>
          <span class="cat-pill">Productivity</span>
        </div>

        <div class="fs-content" style="flex:1; overflow-y:auto; padding: 16px 16px 30px;">
          <div class="sec-label">Featured Insights</div>
          ${listHtml}
        </div>
      </div>

      <!-- Article View -->
      <div id="crux-article-view" style="display:none; height:100%; flex-direction:column; overflow:hidden;">
        <div class="article-content" id="crux-article-body" style="flex:1; overflow-y:auto; padding-bottom:80px;" onscroll="window.updateCruxProgress()">
        </div>


      </div>
    </div>
  `;
};

window.openCruxArticle = function(id) {
  const article = window.CRUX_ARTICLES[id];
  if (!article) return;
  
  const topbar = document.getElementById('topbar');
  if (topbar) {
    topbar.innerHTML = `
      <button class="back-btn" onclick="window.closeCruxArticle()" style="background:none;border:none;color:var(--txt);padding:8px;margin-left:-8px;cursor:pointer;display:flex;align-items:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style="flex:1;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 10px;">${article.title}</div>
      <button class="share-btn" onclick="showToast('Link copied!')" style="background:var(--bg2);border:1px solid var(--border);color:var(--txt);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      </button>
      <div style="position:absolute; bottom:0; left:0; width:100%; height:3px; background:rgba(0,0,0,0.1);">
        <div id="crux-progress" style="height:100%; background:var(--accent); width:0%; transition:width 0.2s;"></div>
      </div>
    `;
  }
  
  const bodyWrap = document.getElementById('crux-article-body');
  bodyWrap.innerHTML = `
    <div class="article-hero" style="background:${article.heroBg}; background-size: 200% 200%; animation: cruxGradAnim 8s ease infinite; height:220px; display:flex; align-items:flex-end; padding:20px; position:relative;">
      <div class="article-hero-title" style="font-size:1.4rem; font-weight:800; color:#fff; line-height:1.3; text-shadow:0 2px 12px rgba(0,0,0,0.5);">${article.title}</div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;padding:16px 16px 0;">
      <div class="author-dot" style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;color:#fff;font-weight:700;font-size:0.75rem;">P</div>
      <div>
        <div style="font-size:0.85rem;font-weight:600;color:var(--txt2);">${article.author}</div>
        <div style="font-size:0.72rem;color:var(--txt4);">${article.date} · ${article.readTime}</div>
      </div>
      <span style="margin-left:auto;font-size:0.68rem;font-weight:700;color:${article.categoryColor};background:${article.categoryColor}20;border:1px solid ${article.categoryColor}40;padding:3px 10px;border-radius:20px;">${article.category}</span>
    </div>
    <div style="padding: 16px;">
      ${article.body}
    </div>
  `;
  
  document.getElementById('crux-progress').style.width = '0%';
  
  document.getElementById('crux-list-view').style.display = 'none';
  const av = document.getElementById('crux-article-view');
  av.style.display = 'flex';
  
  // Reset scroll
  bodyWrap.scrollTop = 0;
};

window.closeCruxArticle = function() {
  document.getElementById('crux-article-view').style.display = 'none';
  document.getElementById('crux-list-view').style.display = 'flex';

  const topbar = document.getElementById('topbar');
  if (topbar) {
    topbar.innerHTML = `
      <button class="back-btn" onclick="closeFs('crux')" style="background:none;border:none;color:var(--txt);padding:8px;margin-left:-8px;cursor:pointer;display:flex;align-items:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="brand" style="margin-right:auto;display:flex;align-items:center;gap:8px;">
        <div class="logo-box" style="background:transparent;padding:0;width:24px;height:24px;">
          <img src="img/logo.png" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:20%;">
        </div>
        <h1 style="font-size:1.05rem;font-weight:700;">InterEdge <span style="font-weight:500;color:var(--txt3);">| Crux</span></h1>
      </div>
    `;
  }
};

window.updateCruxProgress = function() {
  const wrap = document.getElementById('crux-article-body');
  const scrollable = wrap.scrollHeight - wrap.clientHeight;
  if (scrollable <= 0) return;
  const pct = Math.round((wrap.scrollTop / scrollable) * 100);
  document.getElementById('crux-progress').style.width = pct + '%';
};

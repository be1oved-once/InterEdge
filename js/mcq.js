// ============================================
// PathEdge - MCQ Quiz System
// Per-question timer · Option labels · Negative marking · Auto-next
// ============================================

var quizState = {
  subject: null,
  chapter: null,
  questions: [],
  currentQ: 0,
  answers: [],     // -1 = skipped, index = answer chosen
  score: 0,
  negativeScore: 0,
  perQTimer: null,
  perQTimeLeft: 0,
  isFinished: false,
  locked: false,
  denseScreen: 0,      // current screen index in dense mode
  denseSubmitted: []   // which screens have been submitted
};

let audioCtx = null;

// ===== OPTION LABEL HELPERS =====
function getOptionLabel(index, style) {
  if (!AppState.settings.optionLabelEnabled) return '';
  switch (style) {
    case 'ABCDdot': return String.fromCharCode(65 + index) + '.';
    case 'abcddot': return String.fromCharCode(97 + index) + '.';
    case '1234dot': return (index + 1) + '.';
    case 'RomanUp': { const r = ['I.','II.','III.','IV.']; return r[index] || (index+1)+'.'; }
    case 'RomanLow': { const r = ['i.','ii.','iii.','iv.']; return r[index] || (index+1)+'.'; }
    case 'ABCD':
    default: return String.fromCharCode(65 + index);
  }
}

// ===== SOUND =====
function playQuizSound(type) {
  if (!AppState.settings?.soundEffects) return;
  
  try {
    if (!audioCtx) {
      audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    }
    
    const now = audioCtx.currentTime;
    
    if (type === 'correct') {
      // Success chime
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'triangle';
      osc2.type = 'sine';
      
      osc1.frequency.setValueAtTime(523, now); // C5
      osc1.frequency.setValueAtTime(784, now + 0.12); // G5
      
      osc2.frequency.setValueAtTime(659, now); // E5
      osc2.frequency.setValueAtTime(1046, now + 0.12); // C6
      
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
      
    } else {
      // Better error buzz
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'square';
      osc2.type = 'sawtooth';
      
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.18);
      
      osc2.frequency.setValueAtTime(140, now);
      osc2.frequency.exponentialRampToValueAtTime(90, now + 0.18);
      
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.18);
      osc2.stop(now + 0.18);
    }
    
  } catch (e) {
    console.error(e);
  }
}

// ===== SHARED TABLE RENDERER =====
function buildTableHtml(tableData, wrapClass) {
  if (!tableData || !tableData.rows || tableData.rows.length === 0) return '';
  const rows = tableData.rows;
  const outerClass = wrapClass || 'qt-wrap';

  // First row → <thead> with <th>
  const headerCells = rows[0].cells.map(c => `<th class="qt-cell qt-head-cell">${c}</th>`).join('');
  const theadHtml = `<thead><tr class="qt-header-row">${headerCells}</tr></thead>`;

  // Remaining rows → <tbody> with zebra striping
  const tbodyRows = rows.slice(1).map((r, rIdx) => {
    const cells = r.cells.map(c => `<td class="qt-cell ${rIdx % 2 === 0 ? 'qt-even' : 'qt-odd'}">${c}</td>`).join('');
    return `<tr class="qt-body-row">${cells}</tr>`;
  }).join('');
  const tbodyHtml = `<tbody>${tbodyRows}</tbody>`;

  return `<div class="${outerClass}"><div class="qt-scroll"><table class="qt-table">${theadHtml}${tbodyHtml}</table></div></div>`;
}

// ===== CHAPTERS =====
function renderChapters(params) {
  const subjectId = params && params.subject;
  const subject = MCQ_DATA[subjectId];
  if (!subject) return '<div class="view-content"><h2>Subject not found</h2></div>';

  let html = `
    <div class="view-content">
      <div class="settings-head" style="margin-bottom:16px;">
        <button class="back-btn" onclick="Router.navigate('practice')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style="font-size:1.2rem;font-weight:700;">${subject.name}</h2>
          <div style="font-size:.75rem;color:var(--txt3);margin-top:2px;">${subject.chapters.length} Chapters &bull; CA Foundation</div>
        </div>
      </div>
      <div class="chapter-list">`;

  subject.chapters.forEach((ch, idx) => {
    const totalQ = ch.questions ? ch.questions.length : (ch.units ? ch.units.reduce((ua,uc)=>ua+(uc.questions?uc.questions.length:0),0) : 0);
    const chapterNumDisplay = ch.num || (idx + 1);
    html += `
      <div class="chapter-card" onclick="Router.navigate('chapter', {subject:'${subjectId}',chapter:'${ch.id}'})">
        <div class="chapter-num" style="background:linear-gradient(135deg,${subject.color},var(--accent2));">${chapterNumDisplay}</div>
        <div class="chapter-info">
          <div class="chapter-title">${ch.title}</div>
          <div class="chapter-meta">${totalQ} MCQs &bull; ${Math.ceil(totalQ * 2)} min</div>
        </div>
        <svg class="chapter-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`;
  });

  html += '</div></div>';
  return html;
}

// ===== CHAPTER DETAIL =====
function renderChapterDetail(params) {
  const subjectId = params && params.subject;
  const chapterId = params && params.chapter;
  const subject = MCQ_DATA[subjectId];
  if (!subject) return '<div class="view-content"><h2>Subject not found</h2></div>';
  const chapter = subject.chapters.find(c => c.id === chapterId);
  if (!chapter) return '<div class="view-content"><h2>Chapter not found</h2></div>';

  const hasUnits = chapter.units && chapter.units.length > 0;
  
  if (hasUnits) {
    // Show list of units
    let html = `
      <div class="view-content">
        <div class="settings-head" style="margin-bottom:16px;">
          <button class="back-btn" onclick="Router.navigate('chapters', {subject:'${subjectId}'})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <h2 style="font-size:1.1rem;font-weight:700;">Chapter ${chapter.num || chapter.title.split(' ')[0]}</h2>
            <div style="font-size:.75rem;color:var(--txt3);margin-top:2px;">${chapter.title}</div>
          </div>
        </div>
        <div class="chapter-list">`;
        
    chapter.units.forEach((u, idx) => {
      const totalQ = u.questions ? u.questions.length : 0;
      html += `
        <div class="chapter-card" onclick="Router.navigate('unit', {subject:'${subjectId}',chapter:'${chapterId}',unit:'${u.id}'})">
          <div class="chapter-num" style="background:linear-gradient(135deg,${subject.color},var(--accent2));">${idx + 1}</div>
          <div class="chapter-info">
            <div class="chapter-title">${u.title}</div>
            <div class="chapter-meta">${totalQ} MCQs</div>
          </div>
          <svg class="chapter-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>`;
    });
    
    html += '</div></div>';
    return html;
  }

  // Normal chapter detail (without units)
  const totalQ = chapter.questions ? chapter.questions.length : 0;
  const s = AppState.settings;
  const timerLabel = s.timerEnabled ? `${s.timerDuration}s per Q` : 'No timer';
  const negLabel = s.negativeMarking ? `-${s.negativeMark}/wrong` : 'No penalty';

  return `
    <div class="view-content">
      <div class="settings-head" style="margin-bottom:16px;">
        <button class="back-btn" onclick="Router.navigate('chapters', {subject:'${subjectId}'})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">Chapter ${chapter.num || '1'}</h2>
      </div>

      <div class="chapter-detail-header">
        <div class="chapter-detail-num" style="background:linear-gradient(135deg,${subject.color},var(--accent2));">${chapter.num || '1'}</div>
        <div class="chapter-detail-title">${chapter.title}</div>
        <div class="chapter-detail-meta">${subject.name} &bull; CA Foundation</div>
      </div>

      <div class="chapter-stats-row">
        <div class="chapter-stat"><div class="chapter-stat-val">${totalQ}</div><div class="chapter-stat-lbl">Questions</div></div>
        <div class="chapter-stat"><div class="chapter-stat-val">${timerLabel}</div><div class="chapter-stat-lbl">Timer</div></div>
        <div class="chapter-stat"><div class="chapter-stat-val">MCQ</div><div class="chapter-stat-lbl">Format</div></div>
      </div>

      <div class="sec-label">Instructions</div>
      <div class="card" style="margin-bottom:14px;">
        <div style="font-size:.82rem;color:var(--txt3);line-height:1.6;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Each question carries 1 mark</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${s.negativeMarking ? 'var(--red)' : 'var(--accent2)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>${negLabel}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${s.timerEnabled ? `${s.timerDuration}s per question — expired = skipped` : 'No time limit'}</span>
          </div>
        </div>
      </div>

      <div class="chapter-actions">
        <button class="btn-primary" onclick="startQuiz('${subjectId}', '${chapterId}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Start Quiz
        </button>
      </div>
    </div>`;
}

// ===== UNIT DETAIL =====
function renderUnitDetail(params) {
  const subjectId = params && params.subject;
  const chapterId = params && params.chapter;
  const unitId = params && params.unit;
  const subject = MCQ_DATA[subjectId];
  if (!subject) return '<div class="view-content"><h2>Subject not found</h2></div>';
  const chapter = subject.chapters.find(c => c.id === chapterId);
  if (!chapter) return '<div class="view-content"><h2>Chapter not found</h2></div>';
  const unit = chapter.units.find(u => u.id === unitId);
  if (!unit) return '<div class="view-content"><h2>Unit not found</h2></div>';

  const totalQ = unit.questions ? unit.questions.length : 0;
  const s = AppState.settings;
  const timerLabel = s.timerEnabled ? `${s.timerDuration}s per Q` : 'No timer';
  const negLabel = s.negativeMarking ? `-${s.negativeMark}/wrong` : 'No penalty';

  return `
    <div class="view-content">
      <div class="settings-head" style="margin-bottom:16px;">
        <button class="back-btn" onclick="Router.navigate('chapter', {subject:'${subjectId}',chapter:'${chapterId}'})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">${unit.title}</h2>
      </div>

      <div class="chapter-detail-header">
        <div class="chapter-detail-num" style="background:linear-gradient(135deg,${subject.color},var(--accent2));">U</div>
        <div class="chapter-detail-title">${unit.title}</div>
        <div class="chapter-detail-meta">${chapter.title}</div>
      </div>

      <div class="chapter-stats-row">
        <div class="chapter-stat"><div class="chapter-stat-val">${totalQ}</div><div class="chapter-stat-lbl">Questions</div></div>
        <div class="chapter-stat"><div class="chapter-stat-val">${timerLabel}</div><div class="chapter-stat-lbl">Timer</div></div>
        <div class="chapter-stat"><div class="chapter-stat-val">MCQ</div><div class="chapter-stat-lbl">Format</div></div>
      </div>

      <div class="sec-label">Instructions</div>
      <div class="card" style="margin-bottom:14px;">
        <div style="font-size:.82rem;color:var(--txt3);line-height:1.6;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Each question carries 1 mark</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${s.negativeMarking ? 'var(--red)' : 'var(--accent2)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>${negLabel}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${s.timerEnabled ? `${s.timerDuration}s per question — expired = skipped` : 'No time limit'}</span>
          </div>
        </div>
      </div>

      <div class="chapter-actions">
        <button class="btn-primary" onclick="startQuiz('${subjectId}', '${chapterId}', '${unitId}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Start Quiz
        </button>
      </div>
    </div>`;
}

// ===== START QUIZ =====
function startQuiz(subjectId, chapterId, unitId = null) {
  const subject = MCQ_DATA[subjectId];
  if (!subject) return;
  const chapter = subject.chapters.find(c => c.id === chapterId);
  if (!chapter) return;
  
  let qList = [];
  if (unitId) {
    const unit = chapter.units.find(u => u.id === unitId);
    if (!unit) return;
    qList = [...unit.questions];
  } else {
    qList = [...chapter.questions];
  }

  if (window.practiceState) window.practiceState.active = false;

  // Pre-calculate dense pages so we never split a tableGroup
  const perScreen = Math.min(10, Math.max(3, AppState.settings.denseCount || 5));
  let densePages = [];
  let currentPage = [];
  for (let i = 0; i < qList.length; i++) {
    const q = qList[i];
    if (q.tableGroup) {
      // If adding this group exceeds perScreen and we already have items, push current page
      if (currentPage.length > 0 && currentPage.length + q.tableGroupSize > perScreen) {
        densePages.push(currentPage);
        currentPage = [];
      }
      for (let j = 0; j < q.tableGroupSize; j++) {
        currentPage.push(i + j);
      }
      i += q.tableGroupSize - 1; // skip the rest of the group
      densePages.push(currentPage); // A group always gets its own page or fills a page
      currentPage = [];
    } else {
      currentPage.push(i);
      if (currentPage.length >= perScreen) {
        densePages.push(currentPage);
        currentPage = [];
      }
    }
  }
  if (currentPage.length > 0) densePages.push(currentPage);

  quizState = {
    locked: false,
    subject: subjectId,
    chapter: chapterId,
    unit: unitId,
    questions: qList,
    currentQ: 0,
    answers: new Array(qList.length).fill(-1),
    score: 0,
    negativeScore: 0,
    perQTimer: null,
    perQTimeLeft: 0,
    isFinished: false,
    autoNextToken: 0,
    denseScreen: 0,
    denseSubmitted: [],
    densePages: densePages
  };
  const overlay = document.getElementById('mcq-overlay');
  if (overlay) {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  if (AppState.settings.fullscreen && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }

  Router.hideBottomNav();
  Router.hideTopbar();

  const style = AppState.settings.quizStyle || 'standard';
  if (style === 'dense') {
    renderDenseScreen();
  } else if (style === 'compact') {
    renderCompactQuestion();
  } else {
    if (quizState.questions[quizState.currentQ].tableGroup) {
      while (quizState.currentQ > 0 && quizState.questions[quizState.currentQ - 1].tableGroup === quizState.questions[quizState.currentQ].tableGroup) {
        quizState.currentQ--;
      }
      window.renderTableGroupScreen();
    }
    else renderQuizQuestion();
    startPerQTimer();
  }
}

// ===== RENDER QUIZ QUESTION (Standard Mode) =====
function renderQuizQuestion() {
  const container = document.getElementById('mcq-overlay-inner');
  if (!container) return;

  const qIdx = quizState.currentQ;
  const question = quizState.questions[qIdx];
  const totalQ = quizState.questions.length;
  const progress = ((qIdx + 1) / totalQ) * 100;
  const s = AppState.settings;
  const alreadyAnswered = quizState.answers[qIdx] !== -1;
  const userAns = quizState.answers[qIdx];
  const correctIdx = question.correct;

  // Timer display
  let timerHtml = '';
  if (s.timerEnabled) {
    const tLeft = quizState.perQTimeLeft;
    const isWarn = tLeft <= 10;
    timerHtml = `<div class="quiz-timer per-q-timer ${isWarn ? 'warning' : ''}" id="perQTimer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ${tLeft}s
    </div>`;
  } else {
    timerHtml = `<div class="quiz-timer" id="perQTimer" style="font-size:1.1rem;letter-spacing:0;">&#8734;</div>`;
  }

  // Build options — if already answered, show locked state with highlights
  let optionsHtml = '';
  question.options.forEach((opt, i) => {
    const label = getOptionLabel(i, s.optionLabelStyle);
    const labelHtml = s.optionLabelEnabled
      ? `<div class="quiz-option-letter">${label}</div>`
      : '';

    let extraClass = '';
    if (alreadyAnswered) {
      if (i === correctIdx) extraClass = 'correct';
      else if (i === userAns && userAns !== correctIdx) extraClass = 'wrong';
    }

    const noClick = alreadyAnswered ? 'pointer-events:none;' : '';
    optionsHtml += `
      <div class="quiz-option ${!s.optionLabelEnabled ? 'no-label' : ''} ${extraClass}" 
           onclick="selectAnswer(${i})" data-idx="${i}" style="${noClick}">
        ${labelHtml}
        <div class="quiz-option-text">${opt}</div>
      </div>`;
  });

  // Bookmark key
  const bmKey = `mcq_${quizState.subject}_${quizState.chapter}_${qIdx}`;
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.some(b => b.key === bmKey);

  let html = `
    <div class="quiz-header">
      <button class="quiz-close-btn" onclick="confirmQuitQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="quiz-progress-info">
        <div class="quiz-progress-text">Question ${qIdx + 1} of ${totalQ}</div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
      </div>
      ${timerHtml}
    </div>
    ${window.liveXpBarHtml ? liveXpBarHtml() : ''}

    <div class="quiz-body">
      <div class="quiz-question-num-row">
        <div class="quiz-question-num">Question ${qIdx + 1}</div>
        <button class="bm-btn ${isBookmarked ? 'bm-active' : ''}" onclick="openBookmarkPopup('mcq', ${qIdx})" title="Bookmark">
          <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      ${question.context ? `<div class="quiz-context-box" style="margin-bottom:12px;padding:12px;background:var(--bg3);border-radius:8px;font-size:0.9rem;border-left:3px solid var(--accent2);">${question.context}</div>` : ''}
      <div class="quiz-question">${question.q}</div>
      ${question.table ? buildTableHtml(question.table, 'qt-wrap qt-solo') : ''}
      <div class="quiz-options">${optionsHtml}</div>
    </div>

    <div class="quiz-footer"><div class="quiz-footer-row">`;

  if (qIdx > 0) {
    html += `<button class="btn-secondary" onclick="prevQuestion()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      Previous
    </button>`;
  }

  if (alreadyAnswered) {
    // Show Next / Finish for already-answered questions
    if (qIdx < totalQ - 1) {
      html += `<button class="btn-primary" onclick="goToNextQuestion()">Next
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>`;
    } else {
      html += `<button class="btn-primary" onclick="finishQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Finish
      </button>`;
    }
  } else {
    if (qIdx < totalQ - 1) {
      html += `<button class="btn-primary" onclick="skipAndNext()">
        Skip
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>`;
    } else {
      html += `<button class="btn-primary" onclick="finishQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Finish
      </button>`;
    }
  }

  html += '</div></div>';
  container.innerHTML = html;
  if (window.MathJax) { MathJax.typesetPromise().catch(err => console.log('MathJax err:', err)); }
}

// ===== PER-QUESTION TIMER =====
function startPerQTimer() {
  if (quizState.perQTimer) clearInterval(quizState.perQTimer);
  if (!AppState.settings.timerEnabled) return;

  const q = quizState.questions[quizState.currentQ];
  const mult = (q && q.tableGroupSize) ? q.tableGroupSize : 1;
  quizState.perQTimeLeft = AppState.settings.timerDuration * mult;
  updateTimerDisplay();

  quizState.perQTimer = setInterval(() => {
    quizState.perQTimeLeft--;
    updateTimerDisplay();

    if (quizState.perQTimeLeft <= 0) {
      clearInterval(quizState.perQTimer);
      // Mark as skipped and move on
      quizState.answers[quizState.currentQ] = -1;
      showToast('Time up! Moving to next question');
      setTimeout(() => goToNextQuestion(), 600);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const t = quizState.perQTimeLeft;
  const isWarn = t <= 10;

  // Standard/compact timer
  const el = document.getElementById('perQTimer');
  if (el) {
    el.className = `quiz-timer per-q-timer ${isWarn ? 'warning' : ''}`;
    el.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ${t}s`;
  }

  // Compact mode timer
  const cEl = document.getElementById('compactTimer');
  if (cEl) {
    cEl.className = `compact-timer ${isWarn ? 'warn' : ''}`;
    cEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${t}s`;
  }
}

function stopPerQTimer() {
  if (quizState.perQTimer) {
    clearInterval(quizState.perQTimer);
    quizState.perQTimer = null;
  }
}

// ===== SELECT ANSWER =====
function selectAnswer(optionIdx) {
  if (quizState.isFinished || quizState.locked) return;
  // Permanently lock if already answered
  if (quizState.answers[quizState.currentQ] !== -1) return;
  quizState.locked = true;
  stopPerQTimer();

  const question = quizState.questions[quizState.currentQ];
  const correctIdx = question.correct;
  const isCorrect = optionIdx === correctIdx;

  quizState.answers[quizState.currentQ] = optionIdx;

  // Visual feedback on options
  document.querySelectorAll('.quiz-option').forEach((el, idx) => {
    el.style.pointerEvents = 'none';
    if (idx === correctIdx) el.classList.add('correct');
    if (!isCorrect && idx === optionIdx) el.classList.add('wrong');
  });

  if (isCorrect) {
    playQuizSound('correct');
    quizState.score++;
    if (window.awardXP) awardXP(3);
  } else {
    playQuizSound('wrong');
    if (AppState.settings.negativeMarking) {
      quizState.negativeScore += AppState.settings.negativeMark;
    }
  }

  // Real-time stats update
  if (window.AppState && AppState.user) {
    AppState.questionsAttempted = (AppState.questionsAttempted || 0) + 1;
    if (isCorrect) {
      AppState.correctAnswers = (AppState.correctAnswers || 0) + 1;
    }
    AppState.accuracy = AppState.questionsAttempted > 0 ? Math.round((AppState.correctAnswers / AppState.questionsAttempted) * 100) : 0;
    
    // Subject stats
    if(!AppState.settings) AppState.settings = {};
    if(!AppState.settings.subjectStats) AppState.settings.subjectStats = {};
    if(!AppState.settings.subjectStats[quizState.subject]) AppState.settings.subjectStats[quizState.subject] = { attempted: 0, correct: 0 };
    AppState.settings.subjectStats[quizState.subject].attempted += 1;
    if(isCorrect) AppState.settings.subjectStats[quizState.subject].correct += 1;
    if (window.saveSettings) saveSettings();
    
    if (window.saveUser) saveUser();
  }

  // Replace Skip→Next in footer
  const style = AppState.settings.quizStyle || 'standard';
  if (style === 'compact') {
    // Update compact stats row
    _updateCompactStats();
  }
  _showNextBtn();

  const s = AppState.settings;
  if (s.autoNext && style !== 'compact') {
    const delay = isCorrect ? 300 : 2000;
    const token = ++quizState.autoNextToken;
    setTimeout(() => {
      if (quizState.autoNextToken === token) {
        goToNextQuestion();
      }
    }, delay);
  }
}

function _showNextBtn() {
  const footer = document.querySelector('.quiz-footer');
  if (!footer) return;
  const qIdx = quizState.currentQ;
  const totalQ = quizState.questions.length;
  if (qIdx < totalQ - 1) {
    footer.innerHTML = `<div class="quiz-footer-row">
      <button class="btn-primary" onclick="goToNextQuestion()">Next
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button></div>`;
  } else {
    footer.innerHTML = `<div class="quiz-footer-row">
      <button class="btn-primary" onclick="finishQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Finish
      </button></div>`;
  }
}

function skipAndNext() {
  if (quizState.locked) return;
  stopPerQTimer();
  quizState.answers[quizState.currentQ] = -1;
  goToNextQuestion();
}

function goToNextQuestion() {
  quizState.autoNextToken++;
  quizState.locked = false;
  stopPerQTimer();

  if (window.practiceState && window.practiceState.active) {
    if (window.practiceState.currentQ < window.practiceState.questions.length - 1) {
      window.practiceState.currentQ++;
      window.renderMixedQuestion();
    } else {
      finishQuiz();
    }
    return;
  }

  const curQ = quizState.questions[quizState.currentQ];
  const skip = (curQ && curQ.tableGroup && curQ.tableGroupSize) ? curQ.tableGroupSize : 1;
  const nextIdx = quizState.currentQ + skip;

  if (nextIdx < quizState.questions.length) {
    quizState.currentQ = nextIdx;
    const style = AppState.settings.quizStyle || 'standard';
    if (style === 'compact') {
      renderCompactQuestion();
    } else if (quizState.questions[quizState.currentQ].tableGroup) {
      window.renderTableGroupScreen();
      startPerQTimer();
    } else {
      renderQuizQuestion();
      startPerQTimer();
    }
  } else {
    finishQuiz();
  }
}

function nextQuestion() {
  if (window.practiceState && window.practiceState.active) {
    if (typeof stopPerQTimer === 'function') stopPerQTimer();
    if (window.practiceState.currentQ < window.practiceState.questions.length - 1) {
      window.practiceState.currentQ++;
      window.renderMixedQuestion();
    }
    return;
  }
  const curQ = quizState.questions[quizState.currentQ];
  const skip = (curQ && curQ.tableGroup && curQ.tableGroupSize) ? curQ.tableGroupSize : 1;
  const nextIdx = quizState.currentQ + skip;
  if (nextIdx < quizState.questions.length) {
    stopPerQTimer();
    quizState.currentQ = nextIdx;
    const style = AppState.settings.quizStyle || 'standard';
    if (style === 'compact') renderCompactQuestion();
    else if (quizState.questions[quizState.currentQ].tableGroup) { window.renderTableGroupScreen(); startPerQTimer(); }
    else { renderQuizQuestion(); startPerQTimer(); }
  }
}

function prevQuestion() {
  if (window.practiceState && window.practiceState.active) {
    if (typeof stopPerQTimer === 'function') stopPerQTimer();
    if (window.practiceState.currentQ > 0) {
      window.practiceState.currentQ--;
      window.renderMixedQuestion();
    }
    return;
  }
  if (quizState.currentQ > 0) {
    stopPerQTimer();
    quizState.autoNextToken++;
    // If current question is part of a tableGroup, go back to start of that group
    let prevIdx = quizState.currentQ - 1;
    // Walk back to the start of a tableGroup if we land inside one
    if (quizState.questions[prevIdx] && quizState.questions[prevIdx].tableGroup) {
      const grp = quizState.questions[prevIdx].tableGroup;
      while (prevIdx > 0 && quizState.questions[prevIdx - 1].tableGroup === grp) prevIdx--;
    }
    quizState.currentQ = prevIdx;
    const style = AppState.settings.quizStyle || 'standard';
    if (style === 'compact') {
      renderCompactQuestion();
    } else if (quizState.questions[quizState.currentQ].tableGroup) {
      window.renderTableGroupScreen();
      startPerQTimer();
    } else {
      quizState.locked = quizState.answers[quizState.currentQ] !== -1;
      renderQuizQuestion();
      if (!quizState.locked) startPerQTimer();
    }
  }
}

// ===== QUIT =====
function confirmQuitQuiz() {
  if (confirm('Are you sure you want to quit the quiz? Your progress will be lost.')) {
    quitQuiz();
  }
}

function quitQuiz() {
  stopPerQTimer();
  if (window.practiceState && window.practiceState.active) {
    window.practiceState.active = false;
  }
  const overlay = document.getElementById('mcq-overlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
  if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  Router.showBottomNav();
  Router.showTopbar();
  _exitQuizToOrigin();
}

// Decide where to navigate back to after a quiz ends — normal chapter quizzes
// go back to their chapter screen; bookmark/MTP-RTP practice (which use a
// synthetic subject/chapter id) just go back to whichever screen launched them.
function _exitQuizToOrigin() {
  if (quizState._customBackFn && typeof quizState._customBackFn === 'function') {
    quizState._customBackFn();
    return;
  }
  if (quizState.subject === 'custom' || !MCQ_DATA[quizState.subject]) {
    Router.navigate('practice');
    return;
  }
  Router.navigate('chapter', { subject: quizState.subject, chapter: quizState.chapter });
}

// ===== FINISH =====
function finishQuiz() {
  if (quizState.isFinished) return;
  quizState.isFinished = true;
  stopPerQTimer();

  let correct = 0, wrong = 0, skipped = 0;
  quizState.answers.forEach((ans, i) => {
    if (ans === -1) skipped++;
    else if (ans === quizState.questions[i].correct) correct++;
    else wrong++;
  });
  quizState.score = correct;
  
  if (AppState && AppState.user) {
    // Note: questionsAttempted, correctAnswers, and accuracy are now updated in real-time in selectAnswer()
    
    // Bonus XP for RTP/MTP
    if (quizState.subject === 'custom' && window.awardXP) {
       awardXP(20);
       setTimeout(() => showToast('🎉 +20 Bonus XP for completing practice!'), 1000);
    }
    
    if (window.saveUser) saveUser();
  }

  renderQuizResults(correct, wrong, skipped);
}

// ===== RESULTS =====
function renderQuizResults(correct, wrong, skipped) {
  const container = document.getElementById('mcq-overlay-inner');
  if (!container) return;

  const totalQ = quizState.questions.length;
  const negDeduction = AppState.settings.negativeMarking ? quizState.negativeScore : 0;
  const netScore = Math.max(0, correct - negDeduction);
  const percentage = Math.round((correct / totalQ) * 100);
  const scoreDeg = (percentage / 100) * 360;
  const letters = ['A','B','C','D'];

  let html = `
    <div class="quiz-header">
      <button class="quiz-close-btn" onclick="closeQuizResults()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <h2 style="font-size:1rem;font-weight:700;">Quiz Results</h2>
      <div style="width:36px;"></div>
    </div>

    <div class="quiz-body">
      <div class="quiz-result-header">
        <div class="quiz-result-score" style="--score-deg:${scoreDeg}deg;">
          <div class="quiz-result-score-inner">${percentage}%</div>
        </div>
        <div class="quiz-result-title">${percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}</div>
        <div class="quiz-result-subtitle">Correct: ${correct} / ${totalQ}${negDeduction > 0 ? ` &bull; Deducted: ${negDeduction.toFixed(2)} &bull; Net: ${netScore.toFixed(2)}` : ''}</div>
      </div>

      <div class="quiz-result-stats">
        <div class="quiz-result-stat correct"><div class="qrs-val">${correct}</div><div class="qrs-lbl">Correct</div></div>
        <div class="quiz-result-stat wrong"><div class="qrs-val">${wrong}</div><div class="qrs-lbl">Wrong</div></div>
        <div class="quiz-result-stat skipped"><div class="qrs-val">${skipped}</div><div class="qrs-lbl">Skipped</div></div>
      </div>
      ${negDeduction > 0 ? `<div style="text-align:center;font-size:.78rem;color:var(--red);margin-bottom:12px;">Negative marking: &minus;${negDeduction.toFixed(2)} marks deducted</div>` : ''}

      <div class="sec-label">Review Answers</div>
      <div class="quiz-review-list">`;

  quizState.questions.forEach((q, i) => {
    const userAns = quizState.answers[i];
    const isCorrect = userAns === q.correct;
    const isSkipped = userAns === -1;
    const statusClass = isCorrect ? 'correct' : isSkipped ? 'skipped' : 'wrong';
    let ansText = '';
    if (isSkipped) ansText = `<span class="correct-ans">Correct: ${letters[q.correct]}. ${q.options[q.correct]}</span>`;
    else if (isCorrect) ansText = `<span class="correct-ans">Correct! ${letters[q.correct]}. ${q.options[q.correct]}</span>`;
    else ansText = `<span class="your-ans">Your answer: ${letters[userAns]}. ${q.options[userAns]}</span> &middot; <span class="correct-ans">Correct: ${letters[q.correct]}. ${q.options[q.correct]}</span>`;

    html += `<div class="quiz-review-item ${statusClass}">
      <div class="qr-q">${i+1}. ${q.q}</div>
      <div class="qr-ans">${ansText}</div>
    </div>`;
  });

  html += `</div><div style="height:20px;"></div></div>
    <div class="quiz-footer">
      <button class="btn-primary" onclick="retakeQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        Retake Quiz
      </button>
    </div>`;

  container.innerHTML = html;
  if (window.MathJax) { MathJax.typesetPromise().catch(err => console.log('MathJax err:', err)); }
}

function closeQuizResults() {
  stopPerQTimer();
  const overlay = document.getElementById('mcq-overlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
  if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  Router.showBottomNav();
  Router.showTopbar();
  _exitQuizToOrigin();
}

function retakeQuiz() {
  const wrongQuestions = quizState.questions.filter((q, i) => {
    return quizState.answers[i] !== q.correct;
  });

  if (wrongQuestions.length === 0) {
    if (window.showToast) window.showToast('100% correct! No wrong questions to retake.', 'success');
    else alert('100% correct! No wrong questions to retake.');
    return;
  }

  const opts = { 
    title: quizState._customTitle || (quizState.subject + ' - Mistakes'), 
    subject: quizState.subject, 
    chapterId: quizState.chapter, 
    backFn: quizState._customBackFn 
  };
  startQuizWithQuestions(wrongQuestions, opts);
}

// ===== COMPACT MODE =====
function renderCompactQuestion() {
  const container = document.getElementById('mcq-overlay-inner');
  if (!container) return;

  const qIdx = quizState.currentQ;
  const question = quizState.questions[qIdx];
  const totalQ = quizState.questions.length;
  const s = AppState.settings;
  const alreadyAnswered = quizState.answers[qIdx] !== -1;
  const userAns = quizState.answers[qIdx];
  const correctIdx = question.correct;

  // Count correct/wrong so far
  let correctCount = 0, wrongCount = 0;
  quizState.answers.forEach((a, i) => {
    if (a === -1) return;
    if (a === quizState.questions[i].correct) correctCount++;
    else wrongCount++;
  });

  const tLeft = s.timerEnabled ? quizState.perQTimeLeft : null;
  const isWarn = tLeft !== null && tLeft <= 10;

  const bmKey = `mcq_${quizState.subject}_${quizState.chapter}_${qIdx}`;
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.some(b => b.key === bmKey);

  let optionsHtml = '';
  question.options.forEach((opt, i) => {
    let extraClass = '';
    if (alreadyAnswered) {
      if (i === correctIdx) extraClass = 'correct';
      else if (i === userAns && userAns !== correctIdx) extraClass = 'wrong';
    }
    const noClick = alreadyAnswered ? 'pointer-events:none;' : '';
    optionsHtml += `
      <div class="quiz-option compact-option no-label ${extraClass}" onclick="selectAnswer(${i})" data-idx="${i}" style="${noClick}">
        <div class="quiz-option-text">${opt}</div>
      </div>`;
  });

  let html = `
    <div class="compact-header" id="compactHeader">
      <button class="compact-close" onclick="confirmQuitQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="compact-meta">
        <span class="compact-pos">${qIdx + 1}/${totalQ}</span>
        ${tLeft !== null
          ? `<span class="compact-timer ${isWarn ? 'warn' : ''}" id="compactTimer">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               ${tLeft}s
             </span>`
          : `<span class="compact-timer" id="compactTimer">&#8734;</span>`
        }
        <span class="compact-correct" id="compactCorrect">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
          ${correctCount}
        </span>
        <span class="compact-wrong" id="compactWrong">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ${wrongCount}
        </span>
      </div>
      <button class="bm-btn ${isBookmarked ? 'bm-active' : ''}" onclick="openBookmarkPopup('mcq', ${qIdx})" title="Bookmark">
        <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
    ${window.liveXpBarHtml ? liveXpBarHtml() : ''}
    <div class="quiz-body compact-body">
      <div class="compact-qnum">Q${qIdx + 1}</div>
      ${question.context ? `<div class="quiz-context-box" style="margin-bottom:12px;padding:12px;background:var(--bg3);border-radius:8px;font-size:0.85rem;border-left:3px solid var(--accent2);">${question.context}</div>` : ''}
      <div class="quiz-question compact-question">${question.q}</div>
      ${question.table ? buildTableHtml(question.table, 'qt-wrap qt-solo') : ''}
      <div class="quiz-options compact-options">${optionsHtml}</div>
    </div>
    <div class="quiz-footer"><div class="quiz-footer-row">`;

  if (qIdx > 0) {
    html += `<button class="btn-secondary" onclick="prevQuestion()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      Prev
    </button>`;
  }

  if (alreadyAnswered) {
    if (qIdx < totalQ - 1) {
      html += `<button class="btn-primary" onclick="goToNextQuestion()">Next
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>`;
    } else {
      html += `<button class="btn-primary" onclick="finishQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Finish
      </button>`;
    }
  } else {
    if (qIdx < totalQ - 1) {
      html += `<button class="btn-primary" onclick="skipAndNext()">
        Skip
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>`;
    } else {
      html += `<button class="btn-primary" onclick="finishQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Finish
      </button>`;
    }
  }

  html += '</div></div>';
  container.innerHTML = html;
  if (window.MathJax) { MathJax.typesetPromise().catch(err => console.log('MathJax err:', err)); }

  // Start timer for compact mode if not already answered
  if (!alreadyAnswered) startPerQTimer();
}

function _updateCompactStats() {
  let correctCount = 0, wrongCount = 0;
  quizState.answers.forEach((a, i) => {
    if (a === -1) return;
    if (a === quizState.questions[i].correct) correctCount++;
    else wrongCount++;
  });
  const cc = document.getElementById('compactCorrect');
  const cw = document.getElementById('compactWrong');
  if (cc) cc.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg> ${correctCount}`;
  if (cw) cw.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${wrongCount}`;
}

// ===== DENSE PRACTICE MODE =====
function renderDenseScreen() {
  const container = document.getElementById('mcq-overlay-inner');
  if (!container) return;

  const totalQ = quizState.questions.length;
  const screenIdx = quizState.denseScreen;
  const pageItems = quizState.densePages[screenIdx] || [];
  if (pageItems.length === 0) return;
  const startQ = pageItems[0];
  const endQ = pageItems[pageItems.length - 1] + 1;
  const totalScreens = quizState.densePages.length;
  const isSubmitted = quizState.denseSubmitted.includes(screenIdx);

  const bmList = getBookmarks();

  let cardsHtml = '';
  for (let qi = startQ; qi < endQ; qi++) {
    const question = quizState.questions[qi];
    const userAns = quizState.answers[qi];
    const correctIdx = question.correct;
    const answered = userAns !== -1;
    const bmKey = `mcq_${quizState.subject}_${quizState.chapter}_${qi}`;
    const isBookmarked = bmList.some(b => b.key === bmKey);

    let optsHtml = '';
    question.options.forEach((opt, i) => {
      const lbl = AppState.settings.optionLabelEnabled
        ? `<span class="dense-opt-lbl">${getOptionLabel(i, AppState.settings.optionLabelStyle)}</span>` : '';
      let cls = '';
      if (isSubmitted) {
        if (i === correctIdx) cls = 'correct';
        else if (answered && i === userAns && userAns !== correctIdx) cls = 'wrong';
      } else if (answered && i === userAns) cls = 'dense-selected';
      const noClick = isSubmitted ? 'pointer-events:none;' : '';
      optsHtml += `<div class="quiz-option dense-opt ${cls}" onclick="denseSelectAnswer(${qi},${i})" style="${noClick}">${lbl}<div class="quiz-option-text">${opt}</div></div>`;
    });

    cardsHtml += `
      <div class="dense-card" id="dense-card-${qi}">
        <div class="dense-card-head">
          <div class="dense-qnum">Q${qi + 1}</div>
          <button class="bm-btn ${isBookmarked ? 'bm-active' : ''}" onclick="openBookmarkPopup('mcq', ${qi})" title="Bookmark">
            <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
        <div class="quiz-question dense-question">${question.q}</div>
      ${question.table ? buildTableHtml(question.table, 'qt-wrap qt-solo') : ''}
        <div class="quiz-options dense-opts">${optsHtml}</div>
      </div>`;
  }

  let html = `
    <div class="quiz-header dense-header">
      <button class="quiz-close-btn" onclick="confirmQuitQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="quiz-progress-info">
        <div class="quiz-progress-text">Screen ${screenIdx + 1} of ${totalScreens} &bull; Q${startQ + 1}–${endQ}</div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${((screenIdx + 1) / totalScreens) * 100}%"></div></div>
      </div>
      <div class="quiz-timer" style="font-size:.7rem;letter-spacing:0;color:var(--txt3);">${perScreen}/screen</div>
    </div>
    ${window.liveXpBarHtml ? liveXpBarHtml() : ''}
    <div class="quiz-body dense-body">${cardsHtml}</div>
    <div class="quiz-footer"><div class="quiz-footer-row">`;

  if (screenIdx > 0) {
    html += `<button class="btn-secondary" onclick="densePrev()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      Previous
    </button>`;
  }

  if (!isSubmitted) {
    html += `<button class="btn-primary" onclick="denseSubmitScreen()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Submit
    </button>`;
  } else if (screenIdx < totalScreens - 1) {
    html += `<button class="btn-primary" onclick="denseNext()">
      Next Screen
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`;
  } else {
    html += `<button class="btn-primary" onclick="finishQuiz()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      Finish
    </button>`;
  }

  html += '</div></div>';
  container.innerHTML = html;
  if (window.MathJax) { MathJax.typesetPromise().catch(err => console.log('MathJax err:', err)); }
}

function denseSelectAnswer(qIdx, optionIdx) {
  const screenIdx = quizState.denseScreen;
  if (quizState.denseSubmitted.includes(screenIdx)) return;
  quizState.answers[qIdx] = optionIdx;

  // Update UI for this card's options
  const card = document.getElementById(`dense-card-${qIdx}`);
  if (!card) return;
  card.querySelectorAll('.quiz-option').forEach((el, i) => {
    el.classList.remove('dense-selected');
    if (i === optionIdx) el.classList.add('dense-selected');
  });
}

function denseSubmitScreen() {
  const screenIdx = quizState.denseScreen;
  const pageItems = quizState.densePages[screenIdx] || [];
  if (pageItems.length === 0) return;
  const startQ = pageItems[0];
  const endQ = pageItems[pageItems.length - 1] + 1;

  // Score this screen
  let correctOnScreen = 0;
  for (let qi = startQ; qi < endQ; qi++) {
    const ans = quizState.answers[qi];
    if (ans === -1) continue;
    if (ans === quizState.questions[qi].correct) { quizState.score++; correctOnScreen++; }
    else if (AppState.settings.negativeMarking) quizState.negativeScore += AppState.settings.negativeMark;
  }
  if (correctOnScreen > 0 && window.awardXP) awardXP(correctOnScreen * 3);

  quizState.denseSubmitted.push(screenIdx);
  playQuizSound('correct');
  renderDenseScreen();
}

function denseNext() {
  quizState.denseScreen++;
  renderDenseScreen();
}

function densePrev() {
  if (quizState.denseScreen > 0) {
    quizState.denseScreen--;
    renderDenseScreen();
  }
}

// ===== BOOKMARK SYSTEM =====
const BM_CATEGORIES = ['Revision', 'Doubt', 'Important', 'Exam Favourite', 'Save Question'];

function getBookmarks() {
  return window._bookmarksCache || [];
}

function saveBookmarksStore(bms) {
  window._bookmarksCache = bms;
}

function openBookmarkPopup(source, qIdx) {
  // source: 'mcq' | 'law'
  const bmKey = source === 'law'
    ? `law_${lawState.chapter}_${qIdx}`
    : `mcq_${quizState.subject}_${quizState.chapter}_${qIdx}`;

  const existing = getBookmarks().find(b => b.key === bmKey);
  if (existing) {
    if (window.deleteBookmark) {
      window.deleteBookmark(bmKey);
      // Optional: re-render question to update the filled state
      const style = AppState.settings.quizStyle || 'standard';
      if (source === 'mcq') {
        if (style === 'compact') renderCompactQuestion();
        else if (style === 'dense') renderDenseScreen();
        else renderQuizQuestion();
      } else {
        if (window.renderLawQuestion) renderLawQuestion();
      }
    }
    return;
  }

  const old = document.getElementById('bm-popup');
  if (old) old.remove();

  const savedCats = _getCustomCategories();
  const allCats = [...BM_CATEGORIES, ...savedCats];

  // Emoji + label pairs for visual richness
  const catEmoji = {
    'Save Question': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6"/></svg>',
    'Revision': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
    'Doubt': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'Important': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'Exam Favourite': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>',
    'LDR': '',
    'Quick Review': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  };

  const catsHtml = allCats.map(cat => `
    <div class="bm-cat-chip ${existing && existing.category === cat ? 'selected' : ''}"
         onclick="bmSelectChip(this)" data-cat="${cat}">
      <span class="bm-chip-emoji">${catEmoji[cat] || ''}</span>
      <span>${cat}</span>
    </div>`).join('');

  const popup = document.createElement('div');
  popup.id = 'bm-popup';
  popup.className = 'bm-popup-overlay';
  popup.innerHTML = `
    <div class="bm-popup-backdrop" onclick="closeBookmarkPopup()"></div>
    <div class="bm-popup-panel">
      <div class="bm-popup-head">
        <div class="bm-popup-title">
          <svg viewBox="0 0 24 24" fill="${existing ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="color:var(--accent2);flex-shrink:0;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          ${existing ? 'Change tag' : 'Why are you saving this?'}
        </div>
        <button class="bm-popup-close" onclick="closeBookmarkPopup()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="bm-cat-grid" id="bmCatGrid">${catsHtml}</div>
      <div class="bm-popup-footer">
        <button class="bm-popup-cancel" onclick="closeBookmarkPopup()">Cancel</button>
        <button class="bm-popup-submit" onclick="submitBookmark('${bmKey}','${source}',${qIdx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          Save Bookmark
        </button>
      </div>
    </div>`;

  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.classList.add('open'));
}

function bmSelectChip(el) {
  document.querySelectorAll('#bmCatGrid .bm-cat-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// Kept for legacy callers but now only selects (doesn't auto-save)
function bmSelectCat(el) {
  bmSelectChip(el);
}

// Kept for compatibility; now just selects the chip (save is via footer button)
function bmTapSave(el, bmKey, source, qIdx) {
  bmSelectChip(el);
}

function bmAddCustomCat() {
}

function _getCustomCategories() {
  try { return JSON.parse(localStorage.getItem('pe_bm_custom_cats') || '[]'); } catch(e) { return []; }
}

function bmAddCustomToGrid(bmKey, source, qIdx) {
}

async function submitBookmark(bmKey, source, qIdx) {
  if (AppState.isGuest) {
    showToast('Login required to save bookmarks');
    closeBookmarkPopup();
    return;
  }

  const selected = document.querySelector('#bmCatGrid .bm-cat-chip.selected');
  const category = selected ? selected.dataset.cat : BM_CATEGORIES[0];
  
  const questionObj = source === 'law' ?
    (lawState && lawState.questions[qIdx] ? lawState.questions[qIdx] : null) :
    (quizState.questions[qIdx] ? quizState.questions[qIdx] : null);
  
  if (!questionObj) {
    showToast('Question not found');
    return;
  }
  
  const subject = source === 'law' ?
    'Business Laws' :
    (MCQ_DATA[quizState.subject] ? MCQ_DATA[quizState.subject].name : quizState.subject);
  
  const bookmarkObj = {
    key: bmKey,
    source,
    qIdx,
    question: questionObj.q,
    options: [...(questionObj.options || [])],
    correct: questionObj.correct,
    keywords: [...(questionObj.keywords || [])],
    explanation: questionObj.explanation || '',
    category,
    subject,
    chapter: source === 'law' ? (lawState.chapter || '') : quizState.chapter,
    savedAt: new Date().toISOString()
  };

  // Optimistic update locally
  const bms = getBookmarks().filter(b => b.key !== bmKey);
  bms.unshift(bookmarkObj);
  saveBookmarksStore(bms);
  
  closeBookmarkPopup();
  showToast(`Saving to "${category}"...`);

  // UI updates instantly
  const style = AppState.settings.quizStyle || 'standard';
  if (source === 'mcq') {
    if (style === 'compact') {
      renderCompactQuestion();
    } else if (style === 'dense') {
      renderDenseScreen();
    } else {
      renderQuizQuestion();
    }
  } else {
    if (window.renderLawQuestion) {
      renderLawQuestion();
    }
  }

  // Sync with cloud DB in background
  if (window.API && AppState.user && AppState.user.email) {
    window.API.saveBookmark(AppState.user.email, bookmarkObj)
      .then(() => showToast('Bookmark saved'))
      .catch(e => {
         console.error('Bookmark sync failed', e);
         showToast('Failed to sync bookmark');
      });
  }
}

function closeBookmarkPopup() {
  const popup = document.getElementById('bm-popup');
  if (popup) {
    popup.classList.remove('open');
    setTimeout(() => popup.remove(), 300);
  }
}

// ===== START QUIZ WITH ARBITRARY QUESTIONS (Bookmarks / MTP / RTP) =====
function startQuizWithQuestions(questions, opts) {
  // opts: { title, backFn }
  if (!questions || !questions.length) { showToast('No questions to practice'); return; }
  quizState = {
    locked: false,
    subject: opts.subject || 'custom',
    chapter: opts.chapterId || 'custom',
    questions: [...questions],
    currentQ: 0,
    answers: new Array(questions.length).fill(-1),
    score: 0,
    negativeScore: 0,
    perQTimer: null,
    perQTimeLeft: 0,
    isFinished: false,
    autoNextToken: 0,
    denseScreen: 0,
    denseSubmitted: [],
    _customTitle: opts.title || 'Practice',
    _customBackFn: opts.backFn || null
  };

  const overlay = document.getElementById('mcq-overlay');
  if (overlay) {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  if (AppState.settings.fullscreen && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }

  Router.hideBottomNav();
  Router.hideTopbar();

  const style = AppState.settings.quizStyle || 'standard';
  if (style === 'dense') {
    renderDenseScreen();
  } else if (style === 'compact') {
    renderCompactQuestion();
  } else {
    if (quizState.questions[quizState.currentQ].tableGroup) window.renderTableGroupScreen();
    else renderQuizQuestion();
    startPerQTimer();
  }
}

window.startQuizWithQuestions = startQuizWithQuestions;
window.renderChapters = renderChapters;
window.renderChapterDetail = renderChapterDetail;
window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.skipAndNext = skipAndNext;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.goToNextQuestion = goToNextQuestion;
window.confirmQuitQuiz = confirmQuitQuiz;
window.quitQuiz = quitQuiz;
window.finishQuiz = finishQuiz;
window.closeQuizResults = closeQuizResults;
window.retakeQuiz = retakeQuiz;
window.renderCompactQuestion = renderCompactQuestion;
window.renderDenseScreen = renderDenseScreen;
window.denseSelectAnswer = denseSelectAnswer;
window.denseSubmitScreen = denseSubmitScreen;
window.denseNext = denseNext;
window.densePrev = densePrev;
window.openBookmarkPopup = openBookmarkPopup;
window.closeBookmarkPopup = closeBookmarkPopup;
window.bmSelectCat = bmSelectCat;
window.bmSelectChip = bmSelectChip;
window.bmTapSave = bmTapSave;
window.bmAddCustomCat = bmAddCustomCat;

window.submitBookmark = submitBookmark;
window.getBookmarks = getBookmarks;



// ===== TABLE GROUP RENDERER =====
window.renderTableGroupScreen = function() {
  const container = document.getElementById('mcq-overlay-inner');
  if (!container) return;

  const startQ = quizState.currentQ;
  const leadQ = quizState.questions[startQ];
  const groupSize = leadQ.tableGroupSize || 1;
  const endQ = startQ + groupSize;
  const totalQ = quizState.questions.length;
  const progress = ((endQ) / totalQ) * 100;
  const s = AppState.settings;

  let timerHtml = '';
  if (s.timerEnabled) {
    const tLeft = quizState.perQTimeLeft;
    const isWarn = tLeft <= 10;
    timerHtml = `<div class="quiz-timer per-q-timer ${isWarn ? 'warning' : ''}" id="perQTimer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ${tLeft}s
    </div>`;
  } else {
    timerHtml = `<div class="quiz-timer" id="perQTimer" style="font-size:1.1rem;letter-spacing:0;">&#8734;</div>`;
  }

  // Shared table rendered once at top of the group — styled as a prominent header banner
  let sharedTableHtml = '';
  if (leadQ.table) {
    sharedTableHtml = buildTableHtml(leadQ.table, 'tg-table-wrap');
  }

  const bmList = getBookmarks();
  let cardsHtml = '';

  for (let qi = startQ; qi < endQ; qi++) {
    const question = quizState.questions[qi];
    const userAns = quizState.answers[qi];
    const correctIdx = question.correct;
    const answered = userAns !== -1;
    const bmKey = `mcq_${quizState.subject}_${quizState.chapter}_${qi}`;
    const isBookmarked = bmList.some(b => b.key === bmKey);

    let optsHtml = '';
    question.options.forEach((opt, i) => {
      const lbl = s.optionLabelEnabled ? `<span class="dense-opt-lbl">${getOptionLabel(i, s.optionLabelStyle)}</span>` : '';
      let cls = '';
      if (answered) {
        if (i === correctIdx) cls = 'correct';
        else if (i === userAns) cls = 'wrong';
      }
      const noClick = answered ? 'pointer-events:none;' : '';
      optsHtml += `<div class="quiz-option dense-opt ${cls}" onclick="window.tgSelectAnswer(${qi},${i})" style="${noClick}">${lbl}<div class="quiz-option-text">${opt}</div></div>`;
    });

    cardsHtml += `
      <div class="dense-card" id="tg-card-${qi}">
        <div class="dense-card-head">
          <div class="dense-qnum">Q${qi + 1}</div>
          <button class="bm-btn ${isBookmarked ? 'bm-active' : ''}" onclick="openBookmarkPopup('mcq', ${qi})" title="Bookmark">
             <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
        <div class="quiz-question dense-question">${question.q}</div>
        <div class="quiz-options dense-opts">${optsHtml}</div>
      </div>`;
  }

  let html = `
    <div class="quiz-header dense-header">
      <button class="quiz-close-btn" onclick="confirmQuitQuiz()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="quiz-progress-info">
        <div class="quiz-progress-text">Group Q${startQ + 1}–${endQ} of ${totalQ}</div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
      </div>
      ${timerHtml}
    </div>
    ${window.liveXpBarHtml ? liveXpBarHtml() : ''}
    ${sharedTableHtml}
    <div class="quiz-body dense-body">
      ${cardsHtml}
    </div>
    <div class="quiz-footer"><div class="quiz-footer-row">
  `;

  let allAns = true;
  for (let i = startQ; i < endQ; i++) {
     if (quizState.answers[i] === -1) allAns = false;
  }

  if (startQ > 0) {
    html += `<button class="btn-secondary" onclick="prevQuestion()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      Previous
    </button>`;
  }

  if (allAns) {
    if (endQ < totalQ) html += `<button class="btn-primary" onclick="goToNextQuestion()">Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>`;
    else html += `<button class="btn-primary" onclick="finishQuiz()">Finish <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></button>`;
  } else {
    if (endQ < totalQ) html += `<button class="btn-primary" onclick="window.skipAndNextTg()">Skip <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>`;
    else html += `<button class="btn-primary" onclick="finishQuiz()">Finish <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></button>`;
  }

  html += '</div></div>';
  container.innerHTML = html;
  if (window.MathJax) { MathJax.typesetPromise().catch(err => console.log('MathJax err:', err)); }
};

window.tgSelectAnswer = function(qi, optionIdx) {
  if (quizState.locked) return;
  const question = quizState.questions[qi];
  if (quizState.answers[qi] !== -1) return; 

  const correctIdx = question.correct;
  const isCorrect = optionIdx === correctIdx;
  quizState.answers[qi] = optionIdx;

  const card = document.getElementById(`tg-card-${qi}`);
  card.querySelectorAll('.quiz-option').forEach((el, idx) => {
    el.style.pointerEvents = 'none';
    if (idx === correctIdx) el.classList.add('correct');
    if (!isCorrect && idx === optionIdx) el.classList.add('wrong');
  });

  if (isCorrect) {
    playQuizSound('correct');
    quizState.score++;
    if (window.awardXP) awardXP(3);
  } else {
    playQuizSound('wrong');
    if (AppState.settings.negativeMarking) quizState.negativeScore += AppState.settings.negativeMark;
  }

  const startQ = quizState.currentQ;
  const groupSize = quizState.questions[startQ].tableGroupSize;
  let allAns = true;
  let allCorrect = true;
  for (let i = startQ; i < startQ + groupSize; i++) {
    if (quizState.answers[i] === -1) allAns = false;
    if (quizState.answers[i] !== quizState.questions[i].correct) allCorrect = false;
  }

  if (allAns) {
    const footer = document.querySelector('.quiz-footer');
    if (footer) {
      if (startQ + groupSize < quizState.questions.length) {
        footer.innerHTML = `<div class="quiz-footer-row"><button class="btn-primary" onclick="goToNextQuestion()">Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button></div>`;
      } else {
        footer.innerHTML = `<div class="quiz-footer-row"><button class="btn-primary" onclick="finishQuiz()">Finish <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></button></div>`;
      }
    }
    
    const s = AppState.settings;
    if (s.autoNext) {
      const delay = allCorrect ? 300 : 2000;
      const token = ++quizState.autoNextToken;
      setTimeout(() => {
        if (quizState.autoNextToken === token) goToNextQuestion();
      }, delay);
    }
  }
};

window.skipAndNextTg = function() {
  if (quizState.locked) return;
  stopPerQTimer();
  const startQ = quizState.currentQ;
  const groupSize = quizState.questions[startQ].tableGroupSize;
  for (let i = startQ; i < startQ + groupSize; i++) {
    if (quizState.answers[i] === -1) quizState.answers[i] = -1; // leaving as -1 is fine for skips
  }
  goToNextQuestion();
};

// ============================================
// Resume System Logic
// ============================================
window.savePausedQuizState = function() {
  if (!quizState || quizState.isFinished || !quizState.questions || quizState.questions.length === 0) return;
  
  const stateToSave = { ...quizState, perQTimer: null };
  localStorage.setItem('pausedQuizState', JSON.stringify(stateToSave));
};

window.clearPausedQuizState = function() {
  localStorage.removeItem('pausedQuizState');
};

window.resumePausedQuiz = function() {
  const saved = localStorage.getItem('pausedQuizState');
  if (!saved) return;
  
  try {
    const parsed = JSON.parse(saved);
    quizState = parsed;
    quizState.perQTimer = null;
    quizState.locked = false; // ensure not locked on resume

    const overlay = document.getElementById('mcq-overlay');
    if (overlay) {
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    if (AppState.settings.fullscreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    Router.hideBottomNav();
    Router.hideTopbar();

    const style = AppState.settings.quizStyle || 'standard';
    if (style === 'dense') {
      renderDenseScreen();
    } else if (style === 'compact') {
      renderCompactQuestion();
    } else {
      if (quizState.questions[quizState.currentQ].tableGroup) window.renderTableGroupScreen();
      else renderQuizQuestion();
      startPerQTimer();
    }
  } catch(e) {
    console.error("Failed to resume practice", e);
    window.clearPausedQuizState();
  }
};

window.discardPausedQuiz = function() {
  window.clearPausedQuizState();
  if (window.renderPractice && window.location.hash.includes('#practice')) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.innerHTML = '<div class="view-content">' + window.renderPractice() + '</div>';
  } else if (window.renderHome && (window.location.hash === '' || window.location.hash === '#home')) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.innerHTML = '<div class="view-content">' + window.renderHome() + '</div>';
  }
};

// Monkey-patch functions that mutate state to auto-save
(function() {
  const hooks = [
    'selectAnswer', 'skipAndNext', 'nextQuestion', 'prevQuestion', 'goToNextQuestion',
    'denseSelectAnswer', 'denseSubmitScreen', 'denseNext', 'densePrev',
    'tgSelectAnswer', 'skipAndNextTg'
  ];
  
  hooks.forEach(fnName => {
    if (typeof window[fnName] === 'function') {
      const orig = window[fnName];
      window[fnName] = function(...args) {
        orig.apply(this, args);
        window.savePausedQuizState();
      };
    }
  });

  const origStartQuiz = window.startQuiz;
  if (typeof origStartQuiz === 'function') {
    window.startQuiz = function(...args) {
      window.clearPausedQuizState();
      origStartQuiz.apply(this, args);
    };
  }

  const origStartQuizWithQuestions = window.startQuizWithQuestions;
  if (typeof origStartQuizWithQuestions === 'function') {
    window.startQuizWithQuestions = function(...args) {
      window.clearPausedQuizState();
      origStartQuizWithQuestions.apply(this, args);
    };
  }
  
  const origFinishQuiz = window.finishQuiz;
  if (typeof origFinishQuiz === 'function') {
    window.finishQuiz = function(...args) {
      origFinishQuiz.apply(this, args);
      window.clearPausedQuizState();
    };
  }
  
  const origQuitQuiz = window.quitQuiz;
  if (typeof origQuitQuiz === 'function') {
    window.quitQuiz = function(...args) {
      origQuitQuiz.apply(this, args);
      window.clearPausedQuizState();
    };
  }
})();

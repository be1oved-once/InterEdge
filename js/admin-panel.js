
/* ════════════════════════════════════════════
   CORE.JS — state helpers, router, theme,
   login gate, toasts, confirm dialog, seed data
   ════════════════════════════════════════════ */
const LSP = 'pe_admin_';
const SUBJECTS = ['Maths & Stats', 'Business Economics', 'Business Laws'];
const BLOG_CATS = ['Exam Tips', 'Announcements', 'Study Guide', 'Motivation', 'Updates'];
const FIRST_NAMES = ['Priya','Ananya','Rahul','Sanya','Virat','Neha','Amit','Riya','Karan','Pooja','Aditya','Sneha','Rohan','Ishita','Vikram','Tanvi','Arjun','Meera','Sahil','Divya','Yash','Kavya','Nikhil','Shreya','Manish','Anjali','Rajat','Simran','Harsh','Tanya','Aman','Pallavi','Gaurav','Nisha','Siddharth','Ritika'];
const LAST_NAMES = ['Sharma','Mehta','Khan','Kapoor','Tiwari','Singh','Patel','Desai','Reddy','Nair','Gupta','Joshi','Verma','Iyer','Chauhan','Bhatt','Agarwal','Malhotra','Pillai','Rana'];
const DEVICES = ['Android · Chrome','iOS · Safari','Windows · Chrome','Mac · Safari','Android · Firefox'];

// Global UI timers update
setInterval(() => {
  document.querySelectorAll('.live-timer-tick').forEach(el => {
    const end = parseInt(el.getAttribute('data-end'), 10);
    const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const mm = String(Math.floor(left / 60)).padStart(2, '0');
    const ss = String(left % 60).padStart(2, '0');
    el.textContent = `Time left: ${mm}:${ss}`;
  });
}, 1000);

function dbGet(key, fallback) {
  try { const v = localStorage.getItem(LSP + key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return fallback; }
}
function dbSet(key, val) { try { localStorage.setItem(LSP + key, JSON.stringify(val)); } catch (e) {} }

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function setSelectValue(id, value) { const el = document.getElementById(id); if (!el) return; el.value = value; el.dispatchEvent(new Event('change', { bubbles: true })); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
// DEFAULT_AVATAR_SVG is defined in auth.js with unique-ID generation.
// This admin panel uses window.getDefaultAvatarSVG() (the compat shim) directly.


function initials(name) { return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
function fmtDate(iso) { const d = new Date(normaliseIsoAdmin(iso)); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function fmtDateTime(iso) { const d = new Date(normaliseIsoAdmin(iso)); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
function normaliseIsoAdmin(iso) {
  if (!iso) return iso;
  if (typeof iso === 'string') {
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(iso)) {
      return iso.replace(' ', 'T') + '.000Z';
    }
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(iso) && !iso.endsWith('Z') && !iso.includes('+')) {
      return iso.replace(' ', 'T') + 'Z';
    }
  }
  return iso;
}
function relTime(iso) {
  const diff = Date.now() - new Date(normaliseIsoAdmin(iso)).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  if (h < 24) return h + 'h ago';
  if (d === 1) return '1 day ago';
  if (d < 30) return d + ' days ago';
  return fmtDate(iso);
}

function isoDaysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(randInt(7,23), randInt(0,59)); return d.toISOString(); }
function isoDaysAhead(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString(); }

/* ---------- TOAST ---------- */
function toast(msg, type) {
  type = type || 'info';
  const wrap = document.getElementById('apToastWrap');
  const el = document.createElement('div');
  el.className = 'ap-toast ' + type;
  const icoMap = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  el.innerHTML = (icoMap[type] || icoMap.info) + '<span>' + esc(msg) + '</span>';
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ---------- CONFIRM DIALOG ---------- */
let _confirmCb = null;
function confirmDialog(text, onYes) {
  document.getElementById('apConfirmText').textContent = text;
  _confirmCb = onYes;
  document.getElementById('apConfirmOverlay').classList.add('show');
}
function closeConfirm() { document.getElementById('apConfirmOverlay').classList.remove('show'); _confirmCb = null; }

/* ---------- GENERIC DETAIL SHEET ---------- */
function openDetailSheet(html) {
  document.getElementById('apUserDetailPanel').innerHTML = html;
  document.getElementById('apUserDetailOverlay').classList.add('show');
}
function closeDetailSheet() { document.getElementById('apUserDetailOverlay').classList.remove('show'); }

/* ---------- ACTIVITY LOG ---------- */
const ALOG_ICO = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  notif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>',
  role: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
};
function logActivity(type, action, detail) {
  const log = dbGet('activitylog', []);
  log.unshift({ id: uid(), type, action, detail: detail || '', time: new Date().toISOString() });
  dbSet('activitylog', log.slice(0, 300));
  document.dispatchEvent(new CustomEvent('ap:activity'));
}

/* ════════════════════════════════════════════
   SEED DATA — realistic dummy records, generated
   once and persisted to localStorage.
   ════════════════════════════════════════════ */
function genEmail(name) {
  const parts = name.toLowerCase().split(' ');
  const domains = ['gmail.com','gmail.com','gmail.com','yahoo.com','outlook.com'];
  const sep = pick(['.', '', '_']);
  const num = Math.random() < 0.45 ? randInt(1, 99) : '';
  return parts[0] + sep + parts[1] + num + '@' + pick(domains);
}

function seedUsers() {
  const used = new Set();
  const users = [];
  for (let i = 0; i < 34; i++) {
    let name;
    do { name = pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES); } while (used.has(name));
    used.add(name);
    const joined = isoDaysAgo(randInt(3, 210));
    const lastActive = isoDaysAgo(randInt(0, 9));
    const attempts = randInt(10, 240);
    const accuracy = randInt(40, 96);
    const correct = Math.round((attempts * accuracy) / 100);
    users.push({
      id: uid(),
      name,
      first_name: name.split(' ')[0],
      username: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      email: genEmail(name),
      provider: Math.random() < 0.62 ? 'google' : 'email',
      xp: randInt(40, 3400),
      premium: Math.random() < 0.32,
      flagged: Math.random() < 0.09 ? 1 : 0,
      joined,
      created_at: joined,
      lastActive,
      last_active: lastActive,
      streak: randInt(0, 48),
      accuracy,
      attempts,
      qs_attempted: attempts,
      correct_answers: correct,
      device: pick(DEVICES),
      course: 'CA Intermediate',
      subject: pick(SUBJECTS)
    });
  }
  dbSet('users', users);
}

function seedBlog() {
  const posts = [
    { title: 'Top 7 Mistakes Students Make in CA Intermediate Tax & Costing', category: 'Exam Tips', status: 'published', days: 18,
      html: '<p>Every attempt, thousands of CA Intermediate students lose easy marks in Tax &amp; Costing — not because the concepts are hard, but because of small, repeatable mistakes.</p><h2>1. Skipping the formula sheet revision</h2><p>Most students jump straight into practice questions without revising the core formulas first. A quick 10-minute formula recap before every practice session can save you from silly errors.</p><blockquote>"I started scoring 15 marks higher just by revising formulas before every mock test." — an InterEdge student</blockquote><h2>2. Ignoring negative marking</h2><p>Many students attempt every question even when unsure, forgetting that wrong answers cost marks too. Build the habit of marking for review instead of guessing blindly.</p><ul><li>Attempt questions you are sure about first</li><li>Mark uncertain ones for review</li><li>Come back only if time permits</li></ul><p>Small habit changes compound into big score improvements over a few months of consistent practice.</p>' },
    { title: 'InterEdge November 2026 Batch — What\'s New', category: 'Announcements', status: 'published', days: 4,
      html: '<p>We\'re rolling out a refreshed test series for the November 2026 attempt. Here\'s a quick rundown of what changes.</p><h2>New MTP series</h2><p>Three new Mock Test Papers covering the latest ICAI pattern have been added across all subjects.</p><h2>Faster sync</h2><p>Your progress, bookmarks and XP now sync instantly the moment you switch devices.</p><p>As always, keep an eye on the notification bell for live test alerts.</p>' },
    { title: 'How to Build a Daily Study Streak That Actually Sticks', category: 'Motivation', status: 'published', days: 31,
      html: '<p>A streak is only useful if it survives your worst days, not your best ones.</p><h2>Start absurdly small</h2><p>On your busiest college days, commit to just one chapter quiz — five minutes is enough to keep the streak alive and the habit intact.</p><blockquote>Consistency beats intensity, especially over a six-month CA Intermediate prep cycle.</blockquote><p>Students who maintain a 20+ day streak on InterEdge consistently report higher mock test scores than those who study in long, irregular bursts.</p>' },
    { title: 'Law Paper: How to Remember Section Numbers Without Cramming', category: 'Study Guide', status: 'published', days: 9,
      html: '<p>Section numbers feel impossible to remember until you stop trying to memorise them in isolation.</p><h2>Link, don\'t list</h2><p>Attach every section number to a real scenario or case you\'ve practiced. Your brain remembers stories far better than numbers.</p><h3>Quick drill</h3><p>Spend 10 minutes daily on the Law chapter quizzes inside InterEdge — short, repeated recall beats one long cram session before the exam.</p>' },
    { title: 'Scheduled Maintenance — Sunday Night', category: 'Updates', status: 'draft', days: 1,
      html: '<p>InterEdge will be briefly unavailable this Sunday between 11:00 PM and 12:30 AM IST while we roll out backend improvements.</p><p<No data or progress will be affected. We recommend finishing any in-progress mock test before the window begins.</p>' },
    { title: 'Business Economics Paper 4: Demand Theory in 10 Minutes', category: 'Study Guide', status: 'draft', days: 2,
      html: '<p>Demand theory shows up in some form in almost every Business Economics paper — here\'s the fastest way to revise it the night before an exam.</p><h2>The core idea</h2><p>Everything in demand theory traces back to one relationship: price changes, and quantity demanded responds, all else held equal.</p><ul><li>Law of demand</li><li>Elasticity basics</li><li>Common exceptions (Veblen goods, necessities)</li></ul>' }
  ];
  const out = posts.map((p, i) => ({
    id: uid(),
    title: p.title,
    category: p.category,
    featImg: '',
    html: p.html,
    excerpt: p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 130) + '…',
    status: p.status,
    date: isoDaysAgo(p.days),
    views: p.status === 'published' ? randInt(120, 2400) : 0,
    words: p.html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  }));
  dbSet('blog', out);
}

function seedNotifications() {
  const history = [
    { id: uid(), target: 'all', message: 'Mock Test starts in 15 minutes — MTP Paper 3: Maths & Stats. Don\'t be late!', time: isoDaysAgo(1) },
    { id: uid(), target: 'all', message: 'New RTP added for Law — Company formation & incorporation chapters.', time: isoDaysAgo(3) },
    { id: uid(), target: 'priya.mehta12@gmail.com', message: 'Your premium subscription renews in 3 days.', time: isoDaysAgo(2) },
    { id: uid(), target: 'all', message: 'Your daily streak is at risk! Complete one quiz today to keep it alive 🔥', time: isoDaysAgo(0) },
    { id: uid(), target: 'all', message: 'Scheduled maintenance tonight 11:00 PM – 12:30 AM IST. Finish your tests before then.', time: isoDaysAgo(5) },
    { id: uid(), target: 'all', message: 'Business Economics chapter tests for Paper 4 are now live. Avg completion time: 22 mins.', time: isoDaysAgo(7) }
  ];
  const active = history.slice(0, 3);
  const queue = [
    { id: uid(), target: 'all', message: 'Reminder: RTP submission window closes in 24 hours.', scheduledFor: isoDaysAhead(1) },
    { id: uid(), target: 'all', message: 'Weekly leaderboard resets tonight at midnight — keep climbing!', scheduledFor: isoDaysAhead(2) }
  ];
  dbSet('notif_history', history);
  dbSet('notif_active', active);
  dbSet('notif_queue', queue);
}

function seedTestHistory() {
  const titles = [
    { t: 'MTP Paper 1', type: 'MTP', s: 'Maths & Stats' },
    { t: 'MTP Paper 2', type: 'MTP', s: 'Business Economics' },
    { t: 'RTP — Company Law Basics', type: 'RTP', s: 'Business Laws' },
    { t: 'Chapter Test: Ratio & Proportion', type: 'Chapter', s: 'Maths & Stats' },
    { t: 'RTP Nov 2026 — Demand & Supply', type: 'RTP', s: 'Business Economics' },
    { t: 'Chapter Test: Time Value of Money', type: 'Chapter', s: 'Maths & Stats' },
    { t: 'MTP Paper 3', type: 'MTP', s: 'Business Laws' },
    { t: 'Chapter Test: Indian Contract Act', type: 'Chapter', s: 'Business Laws' },
    { t: 'RTP — National Income', type: 'RTP', s: 'Business Economics' },
    { t: 'MTP Paper 4', type: 'MTP', s: 'Business Economics' }
  ];
  const out = titles.map((x, i) => ({
    id: uid(), title: x.t, type: x.type, subject: x.s,
    date: isoDaysAgo(randInt(4, 95)),
    participants: randInt(180, 1450),
    avgScore: randInt(48, 82)
  }));
  dbSet('tests_history', out);
}

function seedQuestionBank() {
  const qs = [
    { text: 'If the ratio of two numbers is 3:4 and their sum is 84, what is the larger number?', subject: 'Maths & Stats', type: 'mcq', options: ['36', '48', '42', '52'], correctIndex: 1 },
    { text: 'The process of finding the present value of a future sum is called:', subject: 'Maths & Stats', type: 'mcq', options: ['Compounding', 'Discounting', 'Annuitising', 'Indexing'], correctIndex: 1 },
    { text: 'State the formula for Simple Interest.', subject: 'Maths & Stats', type: 'direct', correctAnswer: 'SI = (P × R × T) / 100' },
    { text: 'Which of the following best defines elasticity of demand?', subject: 'Business Economics', type: 'mcq', options: ['Change in supply due to price', 'Responsiveness of quantity demanded to price change', 'Total market demand', 'Government tax on goods'], correctIndex: 1 },
    { text: 'Define "Opportunity Cost" in one line.', subject: 'Business Economics', type: 'direct', correctAnswer: 'The value of the next best alternative foregone.' },
    { text: 'Which market structure has a single seller and no close substitutes?', subject: 'Business Economics', type: 'mcq', options: ['Perfect competition', 'Monopoly', 'Oligopoly', 'Monopolistic competition'], correctIndex: 1 },
    { text: 'Under the Indian Contract Act, an agreement enforceable by law is called a:', subject: 'Business Laws', type: 'mcq', options: ['Proposal', 'Contract', 'Promise', 'Consideration'], correctIndex: 1 },
    { text: 'Minimum number of members required to form a Private Company is:', subject: 'Business Laws', type: 'mcq', options: ['1', '2', '7', '3'], correctIndex: 1 },
    { text: 'What is "Consideration" under Section 2(d) of the Indian Contract Act?', subject: 'Business Laws', type: 'direct', correctAnswer: 'Something done, abstained from, or promised at the desire of the promisor.' },
    { text: 'A contract with a minor is generally considered:', subject: 'Business Laws', type: 'mcq', options: ['Valid', 'Void', 'Voidable', 'Illegal'], correctIndex: 1 },
    { text: 'GDP measures the total value of goods and services produced within a country in a given:', subject: 'Business Economics', type: 'mcq', options: ['Day', 'Month', 'Year', 'Decade'], correctIndex: 2 },
    { text: 'What is the formula to calculate Compound Interest for n years?', subject: 'Maths & Stats', type: 'direct', correctAnswer: 'A = P(1 + R/100)^n, CI = A − P' }
  ];
  dbSet('qbank', qs.map(q => ({ id: uid(), ...q })));
}

function seedRoles() {
  dbSet('roles', [
    { id: 'r1', username: 'admin', email: 'admin@interedge.app', role: 'Superior', password: 'admin' },
    { id: 'r2', username: 'moderator', email: 'ops@interedge.app', role: 'Moderator', password: 'admin' },
    { id: 'r3', username: 'viewer', email: 'reviewer@interedge.app', role: 'Viewer', password: 'admin' }
  ]);
}

function seedTestLogs() {
  const lines = [
    { time: isoDaysAgo(6), text: 'Server warm boot completed — all subjects loaded.', level: 'ok' },
    { time: isoDaysAgo(4), text: 'Published MTP Paper 2 — Business Economics. 240 questions queued.', level: 'ok' },
    { time: isoDaysAgo(3), text: 'High load detected during live window — auto-scaled handlers.', level: 'warn' },
    { time: isoDaysAgo(1), text: 'RTP — Company Law Basics archived to Test History.', level: 'info' }
  ];
  dbSet('test_logs', lines);
}

function seedActivityLog() {
  const log = [
    { id: uid(), type: 'test', action: 'Published MTP Paper 2 — Business Economics', detail: '240 questions · 60 min', time: isoDaysAgo(4) },
    { id: uid(), type: 'blog', action: 'Published "InterEdge November 2026 Batch — What\'s New"', detail: 'Announcements', time: isoDaysAgo(4) },
    { id: uid(), type: 'user', action: 'Flagged user Karan Singh', detail: 'Suspicious activity reported', time: isoDaysAgo(6) },
    { id: uid(), type: 'notif', action: 'Sent broadcast notification', detail: 'New RTP added for Law', time: isoDaysAgo(3) },
    { id: uid(), type: 'role', action: 'Added admin ops@interedge.app', detail: 'Role: Admin', time: isoDaysAgo(10) },
    { id: uid(), type: 'question', action: 'Added 12 questions to bank', detail: 'Maths & Stats, Business Economics, Business Laws', time: isoDaysAgo(12) }
  ];
  dbSet('activitylog', log);
}

function seedLeaderboard() {
  const used = new Set();
  const entries = [];
  for (let i = 0; i < 42; i++) {
    let name;
    do { name = pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES); } while (used.has(name));
    used.add(name);
    entries.push({
      id: uid(),
      name,
      subject: pick(SUBJECTS),
      today: randInt(0, 220),
      week: randInt(40, 1350),
      month: randInt(200, 4200),
      allTime: randInt(800, 11200),
      accuracy: randInt(54, 98),
      streak: randInt(0, 64)
    });
  }
  dbSet('leaderboard', entries);
}

function seedAll(force) {
  if (!force && dbGet('seeded', false)) return;
  seedUsers(); seedBlog(); seedNotifications(); seedTestHistory();
  seedQuestionBank(); seedRoles(); seedTestLogs(); seedActivityLog(); seedLeaderboard();
  dbSet('test_draft', null);
  dbSet('seeded', true);
}

function resetAllData() {
  Object.keys(localStorage).filter(k => k.startsWith(LSP)).forEach(k => localStorage.removeItem(k));
  seedAll(true);
}

/* ════════════════════════════════════════════
   ROUTER
   ════════════════════════════════════════════ */
const PAGE_META = {
  dashboard:    { title: 'Dashboard',     crumb: '/ overview',      nav: 'dashboard', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  users:        { title: 'Users',         crumb: '/ users',         nav: 'users',     icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' },
  tests:        { title: 'Live Tests',    crumb: '/ tests',         nav: 'tests',     icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
  blog:         { title: 'Blog',          crumb: '/ blog',          nav: 'blog',      icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>' },
  notifications:{ title: 'Notifications', crumb: '/ more / notify', nav: 'more',      icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>' },
  analytics:    { title: 'Analytics',     crumb: '/ more / stats',  nav: 'more',      icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  testhistory:  { title: 'Test History',  crumb: '/ more / history',nav: 'more',      icon: '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/>' },
  leaderboard:  { title: 'Leaderboard',   crumb: '/ more / rank',   nav: 'more',      icon: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/>' },
  questionbank: { title: 'Question Bank', crumb: '/ more / bank',   nav: 'more',      icon: '<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' },
  roles:        { title: 'Roles',         crumb: '/ more / roles',  nav: 'more',      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  activitylog:  { title: 'Activity Log',  crumb: '/ more / log',    nav: 'more',      icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' }
};
let currentPage = 'dashboard';
const AP_INITS = [];
function initAllModules() { AP_INITS.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); }

function switchPage(id) {
  if (!PAGE_META[id]) return;
  document.querySelectorAll('.ap-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  currentPage = id;
  const meta = PAGE_META[id];
  document.getElementById('apPageTitle').textContent = meta.title;
  document.getElementById('apPageCrumb').textContent = meta.crumb;
  document.getElementById('apPageIco').innerHTML = meta.icon;
  document.querySelectorAll('.ap-navbtn').forEach(b => b.classList.toggle('active', b.dataset.page === meta.nav));
  positionNavPill();
  closeMoreSheet();
  document.getElementById('apMain').scrollTop = 0;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('page', id);
    history.replaceState(null, '', url.toString());
  } catch (e) {}
  const renderFn = window['render_' + id];
  if (typeof renderFn === 'function') renderFn();
  requestAnimationFrame(() => autosizeAll(target));
}

function positionNavPill() {
  const activeBtn = document.querySelector('.ap-navbtn.active');
  const pill = document.getElementById('apNavPill');
  if (!activeBtn || !pill) return;
  pill.style.transform = 'translateX(' + activeBtn.offsetLeft + 'px)';
}

function openMoreSheet() { document.getElementById('apMoreOverlay').classList.add('show'); }
function closeMoreSheet() { document.getElementById('apMoreOverlay').classList.remove('show'); }

/* ════════════════════════════════════════════
   THEME
   ════════════════════════════════════════════ */
function applyTheme(name) {
  document.body.classList.toggle('light-theme', name === 'light');
  const ico = document.getElementById('moreThemeIco');
  const label = document.getElementById('moreThemeLabel');
  if (ico) ico.innerHTML = name === 'light'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  if (label) label.textContent = name === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
}
function toggleTheme() {
  const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
  applyTheme(next);
  dbSet('theme', next);
  if (currentPage === 'analytics' && typeof render_analytics === 'function') render_analytics();
}

/* ════════════════════════════════════════════
   LOGIN GATE
   ════════════════════════════════════════════ */
function getRequestedPage() {
  try {
    const p = new URLSearchParams(window.location.search).get('page');
    return (p && PAGE_META[p]) ? p : null;
  } catch (e) { return null; }
}
function showShell(pageId) {
  const admin = dbGet('profile', null);
  if (admin) document.body.setAttribute('data-role', admin.role || 'Viewer');
  
  document.getElementById('apLogin').style.display = 'none';
  document.getElementById('apShell').classList.add('show');
  switchPage(pageId || 'dashboard');
}
function showLogin() {
  document.body.removeAttribute('data-role');
  document.getElementById('apShell').classList.remove('show');
  document.getElementById('apLogin').style.display = 'flex';
}
function doLogin(admin) {
  dbSet('loggedIn', true);
  dbSet('profile', admin);
  toast('Welcome back, ' + (admin.username) + '!', 'success');
  showShell();
}
function doLogout() {
  dbSet('loggedIn', false);
  toast('Logged out', 'info');
  setTimeout(showLogin, 200);
}

/* ════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  seedAll(false);
  applyTheme(dbGet('theme', 'dark'));

  // Resolve immediately (while still hidden behind the opaque splash) so there is
  // no flash of the login screen for already-logged-in admins. The splash's own
  // CSS animation timing controls when this becomes visible, independent of this.
  if (dbGet('loggedIn', false)) showShell(getRequestedPage());
  else showLogin();

  // splash auto-hide — only react to the splash's own fade-out, not bubbled
  // animationend events from its child logo/text animations finishing earlier
  const splash = document.getElementById('apSplash');
  splash.addEventListener('animationend', (e) => { if (e.target === splash) splash.style.display = 'none'; });

  // password visibility toggle
  document.getElementById('apPwToggle').addEventListener('click', () => {
    const inp = document.getElementById('apLoginPass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });
  
  document.getElementById('apLoginBtn').addEventListener('click', async () => {
    const btn = document.getElementById('apLoginBtn');
    const username = document.getElementById('apLoginUsername').value.trim();
    const pass = document.getElementById('apLoginPass').value.trim();
    
    if (!username || !pass) { toast('Enter a username and password to continue', 'error'); return; }
    
    btn.disabled = true;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Signing in...';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign in to console';

      const roles = dbGet('roles', [
        { id: 'r1', username: 'admin', role: 'Superior', password: 'admin' },
        { id: 'r2', username: 'moderator', role: 'Moderator', password: 'admin' },
        { id: 'r3', username: 'viewer', role: 'Viewer', password: 'admin' }
      ]);

      const found = roles.find(r => (r.username || '').toLowerCase() === username.toLowerCase());
      if (found && found.password && found.password !== pass) {
        toast('Incorrect password', 'error');
        return;
      }

      const adminObj = found || {
        id: uid(),
        username: username,
        name: username,
        role: 'Superior',
        token: 'local_admin_token'
      };

      doLogin(adminObj);
    }, 300);
  });

  // topbar
  document.getElementById('apBellBtn').addEventListener('click', () => switchPage('notifications'));

  // bottom nav
  document.querySelectorAll('.ap-navbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.page === 'more') openMoreSheet(); else switchPage(btn.dataset.page);
    });
  });
  window.addEventListener('resize', positionNavPill);

  // more sheet
  document.getElementById('apMoreBackdrop').addEventListener('click', closeMoreSheet);
  document.querySelectorAll('#apMoreOverlay [data-goto]').forEach(el => {
    el.addEventListener('click', () => switchPage(el.dataset.goto));
  });
  document.getElementById('moreThemeBtn').addEventListener('click', toggleTheme);
  document.getElementById('moreLogoutBtn').addEventListener('click', () => {
    closeMoreSheet();
    const p = dbGet('profile', { email: 'admin@interedge.app' });
    confirmDialog('Log out of ' + p.email + '?', () => { closeConfirm(); doLogout(); });
  });

  // quick-action goto buttons (dashboard)
  document.querySelectorAll('[data-goto]').forEach(el => {
    if (el.closest('#apMoreOverlay')) return;
    el.addEventListener('click', () => switchPage(el.dataset.goto));
  });

  // confirm dialog wiring
  document.getElementById('apConfirmCancel').addEventListener('click', closeConfirm);
  document.getElementById('apConfirmYes').addEventListener('click', () => { const cb = _confirmCb; closeConfirm(); if (cb) cb(); });
  document.querySelector('#apConfirmOverlay .ap-confirm-backdrop').addEventListener('click', closeConfirm);

  // detail sheet close
  document.getElementById('apUserDetailBackdrop').addEventListener('click', closeDetailSheet);

  initAllModules();
});



/* ════════════════════════════════════════════
   COMPONENTS.JS — reusable bits: mini calendar
   date-picker, chip groups, type-tab groups
   ════════════════════════════════════════════ */
function closeAllFloatingPopups(exceptEl) {
  document.querySelectorAll('.ap-dp-popup.open, .ap-tp-popup.open').forEach(p => { if (p !== exceptEl) p.classList.remove('open'); });
  document.querySelectorAll('.ap-csel.open').forEach(p => { if (p !== exceptEl) p.classList.remove('open'); });
}
function clampPopupHorizontally(popupEl) {
  popupEl.classList.remove('ap-pop-right');
  requestAnimationFrame(() => {
    const rect = popupEl.getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) popupEl.classList.add('ap-pop-right');
  });
}
function createDatePicker(prefix, onSelect) {
  let viewDate = new Date();
  let selectedDate = null;
  const btn = document.getElementById(prefix + 'DateBtn');
  const popup = document.getElementById(prefix + 'DatePopup');
  const display = document.getElementById(prefix + 'DateDisplay');
  const monthLbl = document.getElementById(prefix + 'MonthLbl');
  const daysGrid = document.getElementById(prefix + 'DaysGrid');
  const prevBtn = document.getElementById(prefix + 'PrevMonth');
  const nextBtn = document.getElementById(prefix + 'NextMonth');
  if (!btn) return null;

  function render() {
    monthLbl.textContent = viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    daysGrid.innerHTML = '';
    const year = viewDate.getFullYear(), month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: prevDays - i, muted: true });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ d, muted: false });
    while (cells.length < 35) cells.push({ d: cells.length, muted: true });
    cells.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ap-dp-day' + (c.muted ? ' muted' : '');
      b.textContent = c.d;
      if (!c.muted) {
        const thisDate = new Date(year, month, c.d);
        if (selectedDate && thisDate.toDateString() === selectedDate.toDateString()) b.classList.add('sel');
        b.addEventListener('click', () => {
          selectedDate = thisDate;
          display.textContent = thisDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          display.classList.remove('ph');
          popup.classList.remove('open');
          render();
          if (onSelect) onSelect(selectedDate);
        });
      }
      daysGrid.appendChild(b);
    });
  }
  btn.addEventListener('click', e => { e.stopPropagation(); const willOpen = !popup.classList.contains('open'); closeAllFloatingPopups(popup); if (willOpen) { popup.classList.add('open'); clampPopupHorizontally(popup); } else popup.classList.remove('open'); render(); });
  prevBtn.addEventListener('click', e => { e.stopPropagation(); viewDate.setMonth(viewDate.getMonth() - 1); render(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); viewDate.setMonth(viewDate.getMonth() + 1); render(); });
  document.addEventListener('click', e => { if (!popup.contains(e.target) && !btn.contains(e.target)) popup.classList.remove('open'); });
  render();
  return {
    getDate: () => selectedDate,
    reset: () => { selectedDate = null; display.textContent = 'Pick date'; display.classList.add('ph'); popup.classList.remove('open'); }
  };
}

/* ---------- CUSTOM TIME PICKER — scroll-snap wheels + quick presets ---------- */
const TP_ITEM_H = 36, TP_WHEEL_H = 180;
function tpBuildWheel(container, items) {
  container.innerHTML = '';
  const padTop = document.createElement('div'); padTop.className = 'ap-tp-wpad'; container.appendChild(padTop);
  items.forEach((label, i) => {
    const el = document.createElement('div');
    el.className = 'ap-tp-witem';
    el.textContent = label;
    el.dataset.index = i;
    container.appendChild(el);
  });
  const padBot = document.createElement('div'); padBot.className = 'ap-tp-wpad'; container.appendChild(padBot);
}
function tpGetIndex(container) { return Math.max(0, Math.round(container.scrollTop / TP_ITEM_H)); }
function tpSetIndex(container, index, smooth) {
  const top = index * TP_ITEM_H;
  try { container.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' }); }
  catch (e) { container.scrollTop = top; }
}
function tpHighlight(container, index) { container.querySelectorAll('.ap-tp-witem').forEach(el => el.classList.toggle('sel', +el.dataset.index === index)); }
function tpWireWheel(container, onChange) {
  let settleTimer;
  container.addEventListener('scroll', () => {
    const idx = tpGetIndex(container);
    tpHighlight(container, idx);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => { if (onChange) onChange(idx); }, 110);
  }, { passive: true });
  container.addEventListener('click', e => {
    const item = e.target.closest('.ap-tp-witem'); if (!item) return;
    const idx = +item.dataset.index;
    tpSetIndex(container, idx, true);
    tpHighlight(container, idx);
    if (onChange) onChange(idx);
  });
}

function createTimePicker(prefix, onSelect) {
  const btn = document.getElementById(prefix + 'TimeBtn');
  const popup = document.getElementById(prefix + 'TimePopup');
  const display = document.getElementById(prefix + 'TimeDisplay');
  const hourWheel = document.getElementById(prefix + 'TimeHourWheel');
  const minWheel = document.getElementById(prefix + 'TimeMinWheel');
  const ampmWheel = document.getElementById(prefix + 'TimeAmpmWheel');
  const setBtn = document.getElementById(prefix + 'TimeSetBtn');
  const presetsBox = document.getElementById(prefix + 'TimePresets');
  if (!btn) return null;
  let picked = false;
  const state = { h: 8, m: 0, a: 0 };

  const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const MINS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const AMPMS = ['AM', 'PM'];
  tpBuildWheel(hourWheel, HOURS);
  tpBuildWheel(minWheel, MINS);
  tpBuildWheel(ampmWheel, AMPMS);
  tpWireWheel(hourWheel, idx => { state.h = idx; });
  tpWireWheel(minWheel, idx => { state.m = idx; });
  tpWireWheel(ampmWheel, idx => { state.a = idx; });
  function moveTo(h, m, a, smooth) {
    state.h = h; state.m = m; state.a = a;
    tpSetIndex(hourWheel, h, smooth); tpHighlight(hourWheel, h);
    tpSetIndex(minWheel, m, smooth); tpHighlight(minWheel, m);
    tpSetIndex(ampmWheel, a, smooth); tpHighlight(ampmWheel, a);
  }
  moveTo(8, 0, 0, false);

  const PRESETS = [
    { label: 'Now', live: true },
    { label: '9 AM', h: 9, ap: 'AM' }, { label: '12 PM', h: 12, ap: 'PM' }, { label: '3 PM', h: 3, ap: 'PM' },
    { label: '6 PM', h: 6, ap: 'PM' }, { label: '9 PM', h: 9, ap: 'PM' }
  ];
  presetsBox.innerHTML = PRESETS.map((p, i) => `<button type="button" class="ap-tp-chip" data-preset="${i}">${p.label}</button>`).join('');
  presetsBox.querySelectorAll('.ap-tp-chip').forEach((chip, i) => {
    chip.addEventListener('click', e => {
      e.stopPropagation();
      const p = PRESETS[i];
      let h12 = p.h, ap = p.ap, mins = 0;
      if (p.live) {
        const d = new Date(); const hh = d.getHours();
        h12 = (hh % 12) === 0 ? 12 : (hh % 12); ap = hh >= 12 ? 'PM' : 'AM'; mins = d.getMinutes();
      }
      moveTo(h12 - 1, mins, ap === 'AM' ? 0 : 1, true);
    });
  });

  function readCurrent() {
    const h12 = state.h + 1;
    const mins = state.m;
    const ap = state.a === 0 ? 'AM' : 'PM';
    let hh24 = h12 % 12; if (ap === 'PM') hh24 += 12;
    return { disp: String(h12).padStart(2, '0') + ':' + String(mins).padStart(2, '0') + ' ' + ap, v24: String(hh24).padStart(2, '0') + ':' + String(mins).padStart(2, '0') };
  }
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const willOpen = !popup.classList.contains('open');
    closeAllFloatingPopups(popup);
    if (willOpen) { popup.classList.add('open'); clampPopupHorizontally(popup); } else popup.classList.remove('open');
  });
  setBtn.addEventListener('click', e => {
    e.stopPropagation();
    picked = true;
    const cur = readCurrent();
    display.textContent = cur.disp;
    display.classList.remove('ph');
    popup.classList.remove('open');
    if (onSelect) onSelect(cur.v24);
  });
  document.addEventListener('click', e => { if (!popup.contains(e.target) && !btn.contains(e.target)) popup.classList.remove('open'); });

  return {
    getValue: () => picked ? readCurrent().v24 : null,
    setValue: hhmm => {
      const parts = String(hhmm).split(':');
      const H = parseInt(parts[0], 10), M = parseInt(parts[1], 10) || 0;
      const ap = H >= 12 ? 'PM' : 'AM';
      const h12 = (H % 12) === 0 ? 12 : (H % 12);
      moveTo(h12 - 1, M, ap === 'AM' ? 0 : 1, false);
      picked = true;
      display.textContent = String(h12).padStart(2, '0') + ':' + String(M).padStart(2, '0') + ' ' + ap;
      display.classList.remove('ph');
    },
    reset: () => {
      moveTo(8, 0, 0, false);
      picked = false; display.textContent = 'Pick time'; display.classList.add('ph'); popup.classList.remove('open');
    }
  };
}

/* ---------- CUSTOM DROPDOWN (replaces native <select> everywhere) ---------- */
function buildCustomSelect(selectEl) {
  if (!selectEl || selectEl.dataset.cselInit) return;
  selectEl.dataset.cselInit = '1';
  const wrapper = document.createElement('div');
  wrapper.className = 'ap-csel ' + selectEl.className;
  const styleAttr = selectEl.getAttribute('style');
  if (styleAttr) wrapper.setAttribute('style', styleAttr);
  wrapper.tabIndex = 0;
  wrapper.innerHTML = '<span class="ap-csel-label"></span>' +
    '<svg class="ap-csel-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
    '<div class="ap-csel-popup"><div class="ap-csel-list"></div></div>';
  const listEl = wrapper.querySelector('.ap-csel-list');
  const labelEl = wrapper.querySelector('.ap-csel-label');
  const popupEl = wrapper.querySelector('.ap-csel-popup');

  function buildOptions() {
    listEl.innerHTML = '';
    Array.from(selectEl.options).forEach(opt => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ap-csel-opt' + (opt.value === selectEl.value ? ' sel' : '');
      b.textContent = opt.textContent;
      b.dataset.value = opt.value;
      b.addEventListener('click', e => {
        e.stopPropagation();
        selectEl.value = opt.value;
        refreshLabel();
        wrapper.classList.remove('open');
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      });
      listEl.appendChild(b);
    });
  }
  function refreshLabel() {
    const cur = selectEl.options[selectEl.selectedIndex];
    labelEl.textContent = cur ? cur.textContent : '';
    listEl.querySelectorAll('.ap-csel-opt').forEach(b => b.classList.toggle('sel', b.dataset.value === selectEl.value));
  }
  function toggleOpen() {
    const willOpen = !wrapper.classList.contains('open');
    closeAllFloatingPopups();
    document.querySelectorAll('.ap-csel.open').forEach(w => { if (w !== wrapper) w.classList.remove('open'); });
    if (willOpen) {
      const rect = wrapper.getBoundingClientRect();
      popupEl.classList.toggle('ap-csel-popup-up', (window.innerHeight - rect.bottom) < 260 && rect.top > 260);
      wrapper.classList.add('open');
    } else wrapper.classList.remove('open');
  }
  wrapper.addEventListener('click', e => { if (e.target.closest('.ap-csel-opt')) return; toggleOpen(); });
  wrapper.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); }
    else if (e.key === 'Escape') wrapper.classList.remove('open');
  });
  selectEl.addEventListener('change', refreshLabel);

  buildOptions();
  refreshLabel();
  selectEl.style.display = 'none';
  selectEl.insertAdjacentElement('afterend', wrapper);
}
function initAllCustomSelects() {
  document.querySelectorAll('select.ap-fsel, select.ap-fsel-sm').forEach(buildCustomSelect);
  document.addEventListener('click', e => { if (!e.target.closest('.ap-csel')) document.querySelectorAll('.ap-csel.open').forEach(w => w.classList.remove('open')); });
}
AP_INITS.push(initAllCustomSelects);

function bindChipGroup(containerEl, onChange) {
  if (!containerEl) return;
  containerEl.querySelectorAll('.ap-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      containerEl.querySelectorAll('.ap-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (onChange) onChange(chip);
    });
  });
}

function bindTypeTabs(containerEl, onChange) {
  if (!containerEl) return;
  containerEl.querySelectorAll('.ap-typetab').forEach(tab => {
    tab.addEventListener('click', () => {
      containerEl.querySelectorAll('.ap-typetab').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      if (onChange) onChange(tab);
    });
  });
}

function bindToggle(toggleEl, onChange) {
  if (!toggleEl) return;
  toggleEl.addEventListener('click', () => {
    const on = !toggleEl.classList.contains('on');
    toggleEl.classList.toggle('on', on);
    if (onChange) onChange(on);
  });
}

/* ---------- AUTO-GROW TEXTAREAS (animated height, no manual resize handle) ---------- */
function growTextarea(ta) {
  if (!ta) return;
  ta.style.height = 'auto';
  const h = Math.max(ta.scrollHeight, parseFloat(getComputedStyle(ta).minHeight) || 0);
  ta.style.height = h + 'px';
}
function autosizeTextarea(ta) {
  if (!ta) return;
  if (!ta.dataset.apAutosize) {
    ta.dataset.apAutosize = '1';
    ta.addEventListener('input', () => growTextarea(ta));
  }
  growTextarea(ta);
}
function autosizeAll(root) {
  (root || document).querySelectorAll('textarea.ap-ft').forEach(autosizeTextarea);
}



/* ════════════════════════════════════════════
   DASHBOARD.JS — overview stats + quick actions
   ════════════════════════════════════════════ */
function render_dashboard() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
  const profile = dbGet('profile', { name: 'Admin' });
  document.getElementById('dashWelcome').textContent = greet + ', ' + (profile.name || 'Admin');

  const users = dbGet('users', []);
  const blog = dbGet('blog', []);
  const notifHist = dbGet('notif_history', []);
  const tests = dbGet('tests_history', []);
  document.getElementById('dashStatUsers').textContent = users.length;
  document.getElementById('dashStatPremium').textContent = users.filter(u => u.premium).length;
  document.getElementById('dashStatTests').textContent = tests.length;
  document.getElementById('dashStatPosts').textContent = blog.length;
  document.getElementById('dashStatNotif').textContent = notifHist.length;
  document.getElementById('dashStatFlag').textContent = users.filter(u => u.flagged).length;

  const log = dbGet('activitylog', []).slice(0, 5);
  const box = document.getElementById('dashRecentActivity');
  box.innerHTML = log.length ? log.map(l => `
    <div class="ap-alog-item">
      <div class="ap-alog-ico ${{ user: 'ic-acc', test: 'ic-amb', blog: 'ic-acc', notif: 'ic-red', role: 'ic-grn', question: 'ic-acc' }[l.type] || 'ic-acc'}">${ALOG_ICO[l.type] || ALOG_ICO.user}</div>
      <div class="ap-alog-body"><div class="ap-alog-action">${esc(l.action)}</div></div>
      <div class="ap-alog-time">${relTime(l.time)}</div>
    </div>`).join('') : '<div class="ap-empty" style="padding:18px"><p>Nothing yet — actions you take will show up here.</p></div>';
}

function initDashboardModule() {
  document.addEventListener('ap:activity', () => {
    if (currentPage === 'activitylog' && typeof render_activitylog === 'function') render_activitylog();
    if (currentPage === 'dashboard') render_dashboard();
  });
}
AP_INITS.push(initDashboardModule);



/* ════════════════════════════════════════════
   USERS.JS — user manager: list, filter, flag,
   bulk actions, delete, detail sheet
   ════════════════════════════════════════════ */
const userState = { page: 1, perPage: 8, search: '', provider: 'all', filter: 'all', selected: new Set() };

async function render_users() {
  const admin = dbGet('profile', null);
  if (!admin) return;

  const users = dbGet('users', []);
  let filtered = [...users];

  // Search filter
  const q = (userState.search || '').trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(u => 
      (u.name && u.name.toLowerCase().includes(q)) || 
      (u.username && u.username.toLowerCase().includes(q)) || 
      (u.email && u.email.toLowerCase().includes(q))
    );
  }

  // Provider filter
  if (userState.provider && userState.provider !== 'all') {
    filtered = filtered.filter(u => u.provider === userState.provider);
  }

  // Secondary filter
  if (userState.filter === 'flagged') {
    filtered = filtered.filter(u => u.flagged === 1 || u.flagged === true);
  } else if (userState.filter === 'premium') {
    filtered = filtered.filter(u => u.premium);
  }

  document.getElementById('uStatTotal').textContent = users.length;
  document.getElementById('uStatPremium').textContent = users.filter(u => u.premium).length;
  document.getElementById('uStatFlagged').textContent = users.filter(u => u.flagged === 1 || u.flagged === true).length;
  document.getElementById('uStatNew').textContent = users.filter(u => {
    const d = new Date(u.joined || u.created_at || Date.now());
    return (Date.now() - d.getTime()) < 14 * 86400000;
  }).length;

  const limit = userState.perPage;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  if (userState.page > totalPages) userState.page = totalPages;
  const offset = (userState.page - 1) * limit;
  const pageItems = filtered.slice(offset, offset + limit);

  const tbody = document.getElementById('userTableBody');

  if (!pageItems.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="ap-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><strong>No users found</strong><p>Try adjusting your search or filters.</p></div></td></tr>';
  } else {
    tbody.innerHTML = pageItems.map(u => {
      const pfpHtml = u.avatar && u.avatar !== 'img/default_avatar.svg' ? 
        `<img src="${esc(u.avatar)}" style="width:30px;height:30px;border-radius:12px;object-fit:cover;opacity:0;transition:opacity 0.5s" onload="this.style.opacity=1" onerror="this.outerHTML=window.getDefaultAvatarSVG().replace(/\\\"/g, '&quot;');">` : 
        `<div class="ap-uav" style="border-radius:12px;width:30px;height:30px;padding:0;">${window.getDefaultAvatarSVG()}</div>`;

      return `
      <tr>
        <td><label class="ap-check">
          <input type="checkbox" class="userRowChk" data-email="${u.email}" ${userState.selected.has(u.email) ? 'checked' : ''}>
          <span class="ap-check-ui"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
        </label></td>
        <td><div class="ap-ucell">
          ${pfpHtml}
          <div>
            <div class="ap-uname" data-view-id="${u.email}" style="cursor:pointer;">${esc(u.username || u.name)}</div>
            <div class="ap-mono">${u.xp || 0} XP</div>
          </div>
        </div></td>
        <td>${esc(u.email)}</td>
        <td><span class="ap-badge bg-mut">${u.provider === 'google' ? 'Google' : 'Email'}</span></td>
        <td class="ap-mono">${(u.xp || 0).toLocaleString('en-IN')}</td>
        <td><button class="ap-toggle ${u.flagged === 1 || u.flagged === true ? 'on' : ''}" data-flag-id="${u.email}"><span class="ap-toggle-knob"></span></button></td>
        <td><div style="display:flex;gap:5px">
          <button class="ap-iconbtn" data-view-id="${u.email}" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          <button class="ap-iconbtn danger require-super" data-del-id="${u.email}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
        </div></td>
      </tr>`;
    }).join('');
  }

  const pager = document.getElementById('userPager');
  let pagerHtml = '';
  if (totalPages > 1) {
    pagerHtml += `<button class="ap-pg-btn" data-pg="${userState.page - 1}" ${userState.page === 1 ? 'disabled' : ''}>‹</button>`;
    for (let i = 1; i <= totalPages; i++) pagerHtml += `<button class="ap-pg-btn ${i === userState.page ? 'active' : ''}" data-pg="${i}">${i}</button>`;
    pagerHtml += `<button class="ap-pg-btn" data-pg="${userState.page + 1}" ${userState.page === totalPages ? 'disabled' : ''}>›</button>`;
  }
  pager.innerHTML = pagerHtml;

  updateUserBulkBar();
}

function updateUserBulkBar() {
  const bar = document.getElementById('userBulkBar');
  bar.classList.toggle('show', userState.selected.size > 0);
  document.getElementById('userBulkCount').textContent = userState.selected.size + ' selected';
}

function userDetailHtml(u) {
  const accuracy = (u.qs_attempted > 0) ? Math.round((u.correct_answers / u.qs_attempted) * 100) : (u.accuracy || 0);
  return `
    <div class="ap-detail-hdr">
      <div class="ap-uav" style="width:46px;height:46px;font-size:.95rem;border-radius:12px;padding:0;">${u.avatar && u.avatar !== 'img/default_avatar.svg' ? `<img src="${esc(u.avatar)}" style="width:100%;height:100%;border-radius:12px;object-fit:cover;" onerror="this.outerHTML=window.getDefaultAvatarSVG().replace(/\\\"/g, '&quot;');">` : window.getDefaultAvatarSVG()}</div>
      <div><div style="font-weight:700;font-size:1rem">${esc(u.first_name || u.username || u.name)}</div><div class="ap-secnote" style="margin-top:1px">${esc(u.email)}</div></div>
      <button class="ap-iconbtn ap-detail-close" id="closeUserDetailX"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
      <span class="ap-badge ${u.premium ? 'bg-acc' : 'bg-mut'}">${u.premium ? 'Premium plan' : 'Free plan'}</span>
      <span class="ap-badge ${u.provider === 'google' ? 'bg-acc' : 'bg-mut'}">${u.provider === 'google' ? 'Google sign-in' : 'Email sign-in'}</span>
      ${u.flagged === 1 || u.flagged === true ? '<span class="ap-badge bg-red">Flagged</span>' : ''}
    </div>
    <div class="ap-kv-grid">
      <div class="ap-kv"><div class="ap-kv-lbl">Total XP</div><div class="ap-kv-val">${(u.xp || 0).toLocaleString('en-IN')}</div></div>
      <div class="ap-kv"><div class="ap-kv-lbl">Accuracy</div><div class="ap-kv-val">${accuracy}%</div></div>
      <div class="ap-kv"><div class="ap-kv-lbl">Streak</div><div class="ap-kv-val">${u.streak || 0} days</div></div>
      <div class="ap-kv"><div class="ap-kv-lbl">Attempts</div><div class="ap-kv-val">${u.qs_attempted || u.attempts || 0}</div></div>
      <div class="ap-kv"><div class="ap-kv-lbl">Most active in</div><div class="ap-kv-val">${esc(u.course || u.subject || 'CA Intermediate')}</div></div>
      <div class="ap-kv"><div class="ap-kv-lbl">Device</div><div class="ap-kv-val" style="font-size:.7rem">${esc(u.device || 'Unknown')}</div></div>
      <div class="ap-kv"><div class="ap-kv-lbl">Joined</div><div class="ap-kv-val" style="font-size:.72rem">${u.created_at || u.joined ? fmtDate(u.created_at || u.joined) : '-'}</div></div>
      <div class="ap-kv"><div class="ap-kv-lbl">Last active</div><div class="ap-kv-val" style="font-size:.72rem">${u.last_active || u.lastActive ? relTime(u.last_active || u.lastActive) : '-'}</div></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="ap-btn ap-btn-out ap-btn-full" id="detailFlagBtn">${u.flagged === 1 || u.flagged === true ? 'Unflag user' : 'Flag user'}</button>
      <button class="ap-btn ap-btn-danger ap-btn-full require-super" id="detailDelBtn">Delete user</button>
    </div>`;
}

async function openUserDetail(email) {
  const users = dbGet('users', []);
  const u = users.find(x => x.email === email);
  if (!u) return;
  
  openDetailSheet(userDetailHtml(u));
  document.getElementById('closeUserDetailX').addEventListener('click', closeDetailSheet);
  document.getElementById('detailFlagBtn').addEventListener('click', () => { toggleUserFlag(email, (u.flagged === 1 || u.flagged === true) ? 0 : 1); closeDetailSheet(); });
  document.getElementById('detailDelBtn').addEventListener('click', () => {
    confirmDialog('Permanently delete ' + (u.first_name || u.username || u.name) + '? This cannot be undone.', () => {
      deleteUsers([email]); closeConfirm(); closeDetailSheet();
    });
  });
}

async function toggleUserFlag(email, newFlagged) {
  const users = dbGet('users', []);
  const u = users.find(x => x.email === email);
  if (u) {
    u.flagged = newFlagged ? 1 : 0;
    dbSet('users', users);
    toast(newFlagged ? 'User flagged' : 'User unflagged', 'success');
    render_users();
  }
}

async function deleteUsers(emails) {
  let users = dbGet('users', []);
  const set = new Set(emails);
  users = users.filter(u => !set.has(u.email));
  dbSet('users', users);
  emails.forEach(id => userState.selected.delete(id));
  toast(emails.length > 1 ? emails.length + ' users deleted' : 'User deleted', 'success');
  updateUserBulkBar();
  render_users();
}

function initUsersModule() {
  document.getElementById('userTableBody').addEventListener('click', e => {
    const flagBtn = e.target.closest('[data-flag-id]');
    if (flagBtn) return toggleUserFlag(flagBtn.dataset.flagId, flagBtn.classList.contains('on') ? 0 : 1);
    const viewBtn = e.target.closest('[data-view-id]');
    if (viewBtn) return openUserDetail(viewBtn.dataset.viewId);
    const delBtn = e.target.closest('[data-del-id]');
    if (delBtn) {
      return confirmDialog('Delete this user? This cannot be undone.', () => { deleteUsers([delBtn.dataset.delId]); closeConfirm(); });
    }
    const chk = e.target.closest('.userRowChk');
    if (chk) {
      if (chk.checked) userState.selected.add(chk.dataset.email); else userState.selected.delete(chk.dataset.email);
      updateUserBulkBar();
    }
  });

  document.getElementById('userSelectAll').addEventListener('change', e => {
    const chks = document.querySelectorAll('.userRowChk');
    chks.forEach(chk => {
      chk.checked = e.target.checked;
      if (e.target.checked) userState.selected.add(chk.dataset.email);
      else userState.selected.delete(chk.dataset.email);
    });
    updateUserBulkBar();
  });

  document.getElementById('userPager').addEventListener('click', e => {
    const btn = e.target.closest('[data-pg]');
    if (!btn) return;
    userState.page = parseInt(btn.dataset.pg, 10);
    render_users();
  });

  document.getElementById('userBulkDeleteBtn').addEventListener('click', () => {
    const n = userState.selected.size;
    confirmDialog('Delete ' + n + ' selected user' + (n > 1 ? 's' : '') + '? This cannot be undone.', () => {
      deleteUsers(Array.from(userState.selected)); closeConfirm();
    });
  });
  document.getElementById('userBulkClearBtn').addEventListener('click', () => { userState.selected.clear(); render_users(); });
}
AP_INITS.push(initUsersModule);



/* ════════════════════════════════════════════
   TESTS.JS — live test composer, monitor sim,
   system logs, leaderboard, question bank picker
   ════════════════════════════════════════════ */
function defaultDraft() {
  return { type: 'MTP', subject: 'Maths & Stats', title: '', instructions: '', qtype: 'mcq', questions: [], timer: '', penalty: '', mode: 'live', schedDateISO: null, schedTime: '' };
}
let testDraft = dbGet('test_draft', null) || defaultDraft();
let activeLiveTest = null;
let liveTickHandle = null;
let testDatePicker = null;
let testTimePicker = null;

function saveDraft() { dbSet('test_draft', testDraft); }

const TRASH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';

function renderTestQuestions() {
  const wrap = document.getElementById('testQuestionsContainer');
  if (!testDraft.questions.length) {
    wrap.innerHTML = '<div class="ap-empty" style="padding:22px 8px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>No questions yet</strong><p>Add one manually below, or pull from the question bank.</p></div>';
  } else {
    wrap.innerHTML = testDraft.questions.map((q, i) => {
      if (q.type === 'mcq') {
        return `<div class="ap-qbuild-card" style="background:var(--card-light); border:1px solid var(--border); padding:12px; border-radius:12px; margin-bottom:12px; position:relative;">
          <button class="ap-iconbtn danger ap-qbuild-remove" data-rm="${i}" style="position:absolute; top:12px; right:12px;">${TRASH_SVG}</button>
          <div class="ap-qbuild-num" style="font-size:0.65rem; font-weight:700; color:var(--txt4); margin-bottom:8px;">QUESTION ${i + 1} · MCQ</div>
          <textarea class="ap-ft" style="min-height:50px; transition: height 0.3s ease;" data-qf="text" data-idx="${i}" placeholder="Question text">${esc(q.text)}</textarea>
          <div class="ap-qbuild-opts" style="margin-top:10px;">
            ${q.options.map((opt, oi) => `<div class="ap-qopt-row" style="display:flex; gap:8px; align-items:center; margin-bottom:6px;"><input type="radio" name="correct${i}" data-qf="correct" data-idx="${i}" data-oi="${oi}" ${q.correctIndex === oi ? 'checked' : ''}><textarea class="ap-ft" style="min-height:38px; height:38px; flex:1; transition: height 0.3s ease;" data-qf="option" data-idx="${i}" data-oi="${oi}" placeholder="Option ${String.fromCharCode(65 + oi)}">${esc(opt)}</textarea></div>`).join('')}
          </div>
        </div>`;
      }
      return `<div class="ap-qbuild-card" style="background:var(--card-light); border:1px solid var(--border); padding:12px; border-radius:12px; margin-bottom:12px; position:relative;">
        <button class="ap-iconbtn danger ap-qbuild-remove" data-rm="${i}" style="position:absolute; top:12px; right:12px;">${TRASH_SVG}</button>
        <div class="ap-qbuild-num" style="font-size:0.65rem; font-weight:700; color:var(--txt4); margin-bottom:8px;">QUESTION ${i + 1} · DIRECT ANSWER</div>
        <textarea class="ap-ft" style="min-height:50px; transition: height 0.3s ease;" data-qf="text" data-idx="${i}" placeholder="Question text">${esc(q.text)}</textarea>
        <div class="ap-secnote" style="margin-top:8px; color:var(--txt4); font-size:0.7rem;">Note: Direct answers are manually reviewed. No correct answer is specified here.</div>
      </div>`;
    }).join('');
  }
  document.getElementById('testQCount').textContent = testDraft.questions.length;
  autosizeAll(wrap);
}

// Auto-size textareas dynamically
function autosizeAll(container) {
  container.querySelectorAll('textarea.ap-ft').forEach(ta => {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
    ta.removeEventListener('input', ta.autosizeListener);
    ta.autosizeListener = function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    };
    ta.addEventListener('input', ta.autosizeListener);
  });
}

function updateScheduleInfo() {
  const note = document.getElementById('testScheduleInfo');
  if (testDraft.mode === 'live') { note.textContent = 'Will publish immediately and run for the timer duration.'; return; }
  if (testDraft.schedDateISO && testDraft.schedTime) {
    note.textContent = 'Scheduled for ' + new Date(testDraft.schedDateISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' at ' + testDraft.schedTime + '.';
  } else note.textContent = 'Pick a date and time to schedule this test.';
}

function fillDraftIntoForm() {

  document.querySelectorAll('#testSubjectChips .ap-chip').forEach(c => c.classList.toggle('active', c.dataset.subject === testDraft.subject));
  const qtypeTabs = document.getElementById('qTypeTabs');
  if (qtypeTabs) qtypeTabs.querySelectorAll('.ap-typetab').forEach(t => t.classList.toggle('active', t.dataset.qtype === testDraft.qtype));
  const modeTabs = document.querySelectorAll('.ap-typetabs')[1];
  if (modeTabs) modeTabs.querySelectorAll('.ap-typetab').forEach(t => t.classList.toggle('active', t.dataset.mode === testDraft.mode));
  document.getElementById('testTitleInput').value = testDraft.title;
  document.getElementById('testInstructions').value = testDraft.instructions;
  document.getElementById('testTimer').value = testDraft.timer;
  document.getElementById('testPenalty').value = testDraft.penalty;
  const schedBox = document.getElementById('testSchedBox');
  schedBox.classList.toggle('show', testDraft.mode === 'schedule');
  if (testDraft.schedTime && testTimePicker) testTimePicker.setValue(testDraft.schedTime);
  updateScheduleInfo();
  renderTestQuestions();
}

function render_tests() {
  fillDraftIntoForm();
  renderTestLogs();
  renderLiveMonitor();
}

function renderTestLogs() {
  const logs = dbGet('test_logs', []);
  const box = document.getElementById('testLogsContainer');
  if (!logs.length) { box.innerHTML = '<div class="ap-empty" style="padding:18px"><p>No system events yet.</p></div>'; return; }
  box.innerHTML = logs.slice(0, 40).map(l => {
    const cls = l.level === 'ok' ? 'ok' : (l.level === 'warn' ? 'warn' : '');
    const time = new Date(l.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `<div class="ap-log-line"><span class="t">[${time}]</span> <span class="${cls}">${esc(l.text)}</span></div>`;
  }).join('');
}

function pushTestLog(text, level) {
  const logs = dbGet('test_logs', []);
  logs.unshift({ time: new Date().toISOString(), text, level: level || 'info' });
  dbSet('test_logs', logs.slice(0, 60));
  if (currentPage === 'tests') renderTestLogs();
}

let liveMonitorInterval = null;

async function renderLiveMonitor() {
  const bar = document.getElementById('liveTimerBar');
  const multipleBar = document.getElementById('multipleLiveBar');
  if (multipleBar) multipleBar.classList.remove('show');
  bar.classList.remove('show');
  
  const admin = dbGet('profile', null);
  if (!admin) return;

  const tests = dbGet('tests_history', []);
  const now = Date.now();
  const liveTests = tests.filter(t => {
    const start = new Date(t.publish_at || t.start_time || t.created_at).getTime();
    const duration = (parseInt(t.timer, 10) || 30) * 60000;
    return start <= now && (start + duration) > now;
  });

  if (liveTests.length === 0) {
    document.getElementById('monJoined').textContent = '0';
    document.getElementById('monSubmitted').textContent = '0';
    document.getElementById('monActive').textContent = '0';
    activeLiveTest = null;
    if (liveMonitorInterval) { clearInterval(liveMonitorInterval); liveMonitorInterval = null; }
    return;
  }

  if (liveTests.length > 1) {
    if (multipleBar) multipleBar.classList.add('show');
    document.getElementById('monJoined').textContent = '-';
    document.getElementById('monSubmitted').textContent = '-';
    document.getElementById('monActive').textContent = '-';
    activeLiveTest = null;
    if (liveMonitorInterval) { clearInterval(liveMonitorInterval); liveMonitorInterval = null; }
    return;
  }

  const test = liveTests[0];
  const startTime = new Date(test.publish_at || test.start_time || test.created_at).getTime();
  activeLiveTest = { id: test.id, title: test.title, startTime, duration: (parseInt(test.timer, 10) || 30) * 60000 };
  if (bar) bar.classList.add('show');

  let attempts = [];
  try {
    const raw = localStorage.getItem('pe_test_attempts_' + test.id);
    if (raw) attempts = JSON.parse(raw);
  } catch(e) {}
  
  const submittedCount = attempts.length;
  const joinedCount = Math.max(submittedCount, test.participants || 0);
  const activeCount = Math.max(0, joinedCount - submittedCount);

  document.getElementById('monJoined').textContent = joinedCount;
  document.getElementById('monSubmitted').textContent = submittedCount;
  document.getElementById('monActive').textContent = activeCount;

  if (liveMonitorInterval) clearInterval(liveMonitorInterval);
  liveMonitorInterval = setInterval(() => {
    if (!activeLiveTest) return;
    const elapsed = Math.floor((Date.now() - activeLiveTest.startTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    const timerEl = document.getElementById('liveTimerText');
    if (timerEl) timerEl.textContent = mm + ':' + ss;
  }, 1000);
}

function startLiveSimulation(testObj) {
  renderLiveMonitor();
}

async function openLeaderboard() {
  if (!activeLiveTest) return;
  const admin = dbGet('profile', null);
  if (!admin) return;

  const titleEl = document.getElementById('lbStatsTitle');
  const bodyEl = document.getElementById('lbStatsBody');
  if (titleEl) titleEl.innerHTML = `<span>Leaderboard — ${esc(activeLiveTest.title)}</span>`;

  let attempts = [];
  try {
    const raw = localStorage.getItem('pe_test_attempts_' + activeLiveTest.id);
    if (raw) attempts = JSON.parse(raw);
  } catch(e) {}

  if (attempts.length === 0) {
    if (bodyEl) bodyEl.innerHTML = '<div class="ap-empty">No attempts yet.</div>';
  } else {
    renderLeaderboardData(attempts, bodyEl);
  }
}

function openBankPicker() {
  const qs = dbGet('qbank', []).filter(q => q.subject === testDraft.subject);
  const html = `
    <div class="ap-detail-hdr" style="display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 16px;">
      <div style="background: rgba(91,108,255,0.1); border-radius: 10px; width: 40px; height: 40px; display: grid; place-items: center; flex-shrink: 0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
      </div>
      <div style="display: flex; flex-direction: column; flex: 1;">
        <div style="font-weight:800; font-size:1.1rem; color: var(--txt);">Add from Question Bank</div>
        <div style="margin-top: 4px;"><span style="background: rgba(91,108,255,0.1); color: var(--accent); padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">${esc(testDraft.subject)}</span></div>
      </div>
      <button class="ap-iconbtn ap-detail-close" id="closeBankX"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    ${qs.length ? `
    <div class="ap-secnote ap-mb12">Tick the questions you want, then add them all at once.</div>
    <label style="display:flex; align-items:center; gap: 12px; padding: 14px 16px; background: var(--bg2); border-radius: 12px; cursor: pointer; margin-bottom: 16px; border: 1px solid var(--border);">
      <span class="ap-check" style="margin: 0;"><input type="checkbox" id="bankSelectAllChk"><span class="ap-check-ui"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></span>
      <span style="font-weight: 600; color: var(--txt); font-size: 0.95rem;">Select all (${qs.length})</span>
    </label>
    <div id="bankPickList" style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 20px;">
      ${qs.map(q => {
         let typeBadge = q.type === 'mcq' 
            ? '<span style="background: rgba(59,130,246,0.1); color: #3b82f6; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700;">MCQ</span>'
            : '<span style="background: rgba(168,85,247,0.1); color: #a855f7; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700;">Direct</span>';
         
         return `<label class="qb-pick-item" style="display:flex;gap:14px;align-items:flex-start;cursor:pointer; background: var(--card); padding: 16px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: 0.2s;">
        <span class="ap-check" style="margin-top:2px"><input type="checkbox" class="bankPickChk" data-id="${q.id}"><span class="ap-check-ui"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></span>
        <div style="flex:1; display: flex; flex-direction: column; gap: 10px;">
          <div style="font-size: 0.95rem; font-weight: 600; color: var(--txt); line-height: 1.4;">${esc(q.text)}</div>
          <div style="display: flex; justify-content: flex-end;">${typeBadge}</div>
        </div>
      </label>`}).join('')}
    </div>
    <div style="height:80px"></div>
    <div style="position:sticky; bottom:-24px; margin-left:-24px; margin-right:-24px; margin-bottom:-24px; background:var(--bg2); padding:16px 24px; border-top:1px solid var(--border); display:flex; gap:12px; box-shadow: 0 -10px 20px var(--bg); z-index: 10;">
      <button class="ap-btn ap-btn-ghost" id="bankCancelBtn" style="flex: 1; border: 1px solid var(--border); font-weight: 600;">Cancel</button>
      <button class="ap-btn ap-btn-primary" id="bankAddSelectedBtn" disabled style="flex: 2; padding: 14px; box-shadow: 0 4px 12px rgba(91,108,255,0.25);">Add selected (<span id="bankSelCount">0</span>)</button>
    </div>` : '<div class="ap-empty"><p>No saved questions for this subject yet. Add some in the Question Bank section first.</p></div>'}`;
  openDetailSheet(html);
  document.getElementById('closeBankX').addEventListener('click', closeDetailSheet);
  const cancelBtn = document.getElementById('bankCancelBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeDetailSheet);
  if (!qs.length) return;

  const panel = document.getElementById('apUserDetailPanel');
  const chks = () => Array.from(panel.querySelectorAll('.bankPickChk'));
  const addBtn = document.getElementById('bankAddSelectedBtn');
  const countEl = document.getElementById('bankSelCount');
  
  function refreshCount() {
    const checkedBoxes = chks().filter(c => c.checked);
    const n = checkedBoxes.length;
    countEl.textContent = n;
    addBtn.disabled = n === 0;
    
    chks().forEach(c => {
       const label = c.closest('.qb-pick-item');
       if (c.checked) {
          label.style.background = 'rgba(91,108,255,0.04)';
          label.style.borderColor = 'var(--accent)';
       } else {
          label.style.background = 'var(--card)';
          label.style.borderColor = 'var(--border)';
       }
    });
  }
  
  panel.querySelectorAll('.bankPickChk').forEach(c => c.addEventListener('change', refreshCount));
  
  document.getElementById('bankSelectAllChk').addEventListener('change', function () {
    const turningOn = this.checked;
    chks().forEach(c => c.checked = turningOn);
    refreshCount();
  });
  addBtn.addEventListener('click', () => {
    const selectedIds = chks().filter(c => c.checked).map(c => c.dataset.id);
    let added = 0;
    selectedIds.forEach(id => {
      const q = qs.find(x => x.id === id);
      if (!q) return;
      if (q.type === 'mcq') testDraft.questions.push({ type: 'mcq', text: q.text, options: [...q.options], correctIndex: q.correctIndex });
      else testDraft.questions.push({ type: 'direct', text: q.text, correctAnswer: q.correctAnswer });
      added++;
    });
    saveDraft(); renderTestQuestions();
    toast(added + ' question' + (added === 1 ? '' : 's') + ' added to draft', 'success');
    closeDetailSheet();
  });
}

async function publishTest() {
  if (!testDraft.title.trim()) return toast('Give the test a title first', 'error');
  if (!testDraft.questions.length) return toast('Add at least one question', 'error');
  if (!testDraft.timer) return toast('Set a timer duration', 'error');
  if (testDraft.mode === 'schedule' && (!testDraft.schedDateISO || !testDraft.schedTime)) return toast('Pick a schedule date and time', 'error');

  const isLive = testDraft.mode === 'live';
  const startTime = isLive ? new Date().toISOString() : (() => { const d = new Date(testDraft.schedDateISO); const [h, m] = testDraft.schedTime.split(':'); d.setHours(+h, +m); return d.toISOString(); })();
  
  const admin = dbGet('profile', null);
  if (!admin) return toast('Not logged in', 'error');

  if (isLive) { toast('Test published and live!', 'success'); }
  else { toast('Test scheduled for ' + fmtDateTime(startTime), 'success'); }
  pushTestLog('Publishing ' + testDraft.title + '...', 'info');

  const payload = {
    title: testDraft.title,
    subject: testDraft.subject,
    instructions: testDraft.instructions || '',
    timer: parseInt(testDraft.timer, 10),
    penalty: parseFloat(testDraft.penalty) || 0,
    publish_mode: testDraft.mode,
    publish_at: startTime,
    status: isLive ? 'live' : 'scheduled',
    questions: testDraft.questions
  };

  const cTitle = testDraft.title;
  const cSubj = testDraft.subject;
  const cQCount = testDraft.questions.length;

  testDraft = defaultDraft();
  dbSet('test_draft', null);
  fillDraftIntoForm();

  const newTest = {
    id: uid(),
    ...payload,
    participants: 0,
    avgScore: 0,
    created_at: new Date().toISOString()
  };

  const list = dbGet('tests_history', []);
  list.unshift(newTest);
  dbSet('tests_history', list);

  pushTestLog('Published ' + cTitle + ' — ' + cSubj + '. ' + cQCount + ' questions queued.', 'ok');
  logActivity('test', 'Published "' + cTitle + '"', cSubj + ' · ' + cQCount + ' questions');
  toast('Test published successfully!', 'success');
  renderLiveMonitor();
  if (currentPage === 'testhistory' && typeof render_testhistory === 'function') render_testhistory();
}

function initTestsModule() {
  bindChipGroup(document.getElementById('testSubjectChips'), chip => { testDraft.subject = chip.dataset.subject; saveDraft(); });
  bindTypeTabs(document.getElementById('qTypeTabs'), tab => { testDraft.qtype = tab.dataset.qtype; saveDraft(); });

  bindTypeTabs(document.querySelectorAll('.ap-typetabs')[1], tab => {
    testDraft.mode = tab.dataset.mode;
    document.getElementById('testSchedBox').classList.toggle('show', testDraft.mode === 'schedule');
    updateScheduleInfo(); saveDraft();
  });

  document.getElementById('testTitleInput').addEventListener('input', e => { testDraft.title = e.target.value; saveDraft(); });
  document.getElementById('testInstructions').addEventListener('input', e => { testDraft.instructions = e.target.value; saveDraft(); });
  document.getElementById('testTimer').addEventListener('input', e => { testDraft.timer = e.target.value; saveDraft(); });
  document.getElementById('testPenalty').addEventListener('change', e => {
    let n = parseFloat(e.target.value); if (isNaN(n)) n = 0.25;
    n = Math.max(0.25, Math.min(1, Math.round(n / 0.25) * 0.25));
    e.target.value = n.toFixed(2); testDraft.penalty = n; saveDraft();
  });
  testDatePicker = createDatePicker('test', date => { testDraft.schedDateISO = date.toISOString(); updateScheduleInfo(); saveDraft(); });
  testTimePicker = createTimePicker('test', hhmm => { testDraft.schedTime = hhmm; updateScheduleInfo(); saveDraft(); });
  if (testDraft.schedDateISO) {
    document.getElementById('testDateDisplay').textContent = new Date(testDraft.schedDateISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('testDateDisplay').classList.remove('ph');
  }
  if (testDraft.schedTime) testTimePicker.setValue(testDraft.schedTime);

  document.getElementById('testAddQBtn').addEventListener('click', () => {
    if (testDraft.qtype === 'mcq') testDraft.questions.push({ type: 'mcq', text: '', options: ['', '', '', ''], correctIndex: 0 });
    else testDraft.questions.push({ type: 'direct', text: '', correctAnswer: '' });
    saveDraft(); renderTestQuestions();
  });

  document.getElementById('testQuestionsContainer').addEventListener('input', e => {
    const t = e.target, idx = +t.dataset.idx;
    if (t.dataset.qf === 'text') testDraft.questions[idx].text = t.value;
    else if (t.dataset.qf === 'option') testDraft.questions[idx].options[+t.dataset.oi] = t.value;
    saveDraft();
  });
  document.getElementById('testQuestionsContainer').addEventListener('change', e => {
    if (e.target.dataset.qf === 'correct') { testDraft.questions[+e.target.dataset.idx].correctIndex = +e.target.dataset.oi; saveDraft(); }
  });
  document.getElementById('testQuestionsContainer').addEventListener('click', e => {
    const rm = e.target.closest('[data-rm]');
    if (rm) { testDraft.questions.splice(+rm.dataset.rm, 1); saveDraft(); renderTestQuestions(); }
  });

  document.getElementById('testFromBankBtn').addEventListener('click', openBankPicker);
  document.getElementById('testPublishBtn').addEventListener('click', publishTest);
  document.getElementById('testClearBtn').addEventListener('click', () => {
    confirmDialog('Clear the current draft? Unsaved questions will be lost.', () => {
      testDraft = defaultDraft(); dbSet('test_draft', null); fillDraftIntoForm(); closeConfirm(); toast('Draft cleared', 'info');
    });
  });
  document.getElementById('testClearLogsBtn').addEventListener('click', () => { dbSet('test_logs', []); renderTestLogs(); toast('Logs cleared', 'info'); });
  document.getElementById('leaderboardBtn').addEventListener('click', openLeaderboard);

  // lbStatsClose listener removed because it was replaced with lbOverlayClose at the end of the file

  // Fetch live tests periodically
  setInterval(() => {
    if (currentPage === 'tests') renderLiveMonitor();
  }, 10000);
}
AP_INITS.push(initTestsModule);



/* ════════════════════════════════════════════
   BLOG.JS — post grid + lightweight rich-text
   editor (contenteditable + execCommand)
   ════════════════════════════════════════════ */
const blogState = { search: '', status: 'all', cat: 'all', editingId: null, featDataUrl: '' };

function getFilteredPosts() {
  let list = dbGet('blog', []);
  const q = blogState.search.trim().toLowerCase();
  if (q) list = list.filter(p => p.title.toLowerCase().includes(q));
  if (blogState.status !== 'all') list = list.filter(p => p.status === blogState.status);
  if (blogState.cat !== 'all') list = list.filter(p => p.category === blogState.cat);
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const POST_PLACEHOLDER_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const TRASH_SVG_BLOG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';

function render_blog() {
  const posts = dbGet('blog', []);
  document.getElementById('bStatTotal').textContent = posts.length;
  document.getElementById('bStatPub').textContent = posts.filter(p => p.status === 'published').length;
  document.getElementById('bStatDraft').textContent = posts.filter(p => p.status === 'draft').length;
  document.getElementById('bStatViews').textContent = posts.reduce((s, p) => s + (p.views || 0), 0).toLocaleString('en-IN');

  const list = getFilteredPosts();
  const grid = document.getElementById('blogGrid');
  if (!list.length) {
    grid.innerHTML = '<div class="ap-empty" style="grid-column:1/-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><strong>No posts found</strong><p>Try a different filter, or write your first post.</p></div>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="ap-post-card">
      <div class="ap-post-thumb">
        ${p.featImg ? `<img src="${p.featImg}" alt="">` : POST_PLACEHOLDER_ICO}
        <span class="ap-badge ${p.status === 'published' ? 'bg-grn' : 'bg-amb'} ap-post-status" data-toggle-pub="${p.id}" style="cursor:pointer" title="Click to toggle">${p.status === 'published' ? 'Published' : 'Draft'}</span>
      </div>
      <div class="ap-post-body">
        <div class="ap-post-cat">${esc(p.category)}</div>
        <div class="ap-post-title">${esc(p.title)}</div>
        <div class="ap-post-excerpt">${esc(p.excerpt)}</div>
        <div class="ap-post-meta">
          <span class="ap-post-date">${fmtDate(p.date)}${p.status === 'published' ? ' · ' + (p.views || 0) + ' views' : ''}</span>
          <div class="ap-post-acts">
            <button class="ap-iconbtn require-admin" data-edit-post="${p.id}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></button>
            <button class="ap-iconbtn danger require-admin" data-del-post="${p.id}" title="Delete">${TRASH_SVG_BLOG}</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function resetEditorFields() {
  blogState.editingId = null; blogState.featDataUrl = '';
  document.getElementById('blogTitleInput').value = '';
  setSelectValue('blogCatSelect', 'Exam Tips');
  document.getElementById('blogCanvas').innerHTML = '';
  const drop = document.getElementById('blogFeatDrop');
  drop.classList.remove('has-img');
  document.getElementById('blogFeatImg').removeAttribute('src');
  document.getElementById('blogEditorMode').textContent = 'Write new post';
  document.querySelectorAll('#blogToolbar .ap-tb-tool').forEach(b => b.classList.remove('active'));
  updateWordCount();
}

function openEditor(postId) {
  resetEditorFields();
  if (postId) {
    const p = dbGet('blog', []).find(x => x.id === postId);
    if (p) {
      blogState.editingId = postId;
      document.getElementById('blogTitleInput').value = p.title;
      setSelectValue('blogCatSelect', p.category);
      document.getElementById('blogCanvas').innerHTML = p.html;
      blogState.featDataUrl = p.featImg || '';
      if (p.featImg) { document.getElementById('blogFeatImg').src = p.featImg; document.getElementById('blogFeatDrop').classList.add('has-img'); }
      document.getElementById('blogEditorMode').textContent = 'Edit post';
      updateWordCount();
    }
  }
  document.getElementById('apBlogEditor').classList.add('show');
}
function closeEditor() { document.getElementById('apBlogEditor').classList.remove('show'); }

function updateWordCount() {
  const txt = document.getElementById('blogCanvas').textContent.trim();
  document.getElementById('blogWordCount').textContent = txt ? txt.split(/\s+/).length : 0;
}

function isSelectionInClass(canvas, className) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return null;
  // Case 1: walk up the ancestor chain from where the caret/selection anchors or focuses —
  // covers clicking inside, or selecting a run of text within an existing span.
  for (const startNode of [sel.anchorNode, sel.focusNode]) {
    let node = startNode;
    while (node && node !== canvas) {
      if (node.nodeType === 1 && node.classList && node.classList.contains(className)) return node;
      node = node.parentNode;
    }
  }
  // Case 2: the selection was made at a container level (e.g. "select all") and fully
  // encloses an existing span of this class — treat that span as the toggle target.
  try {
    const range = sel.getRangeAt(0);
    const spans = canvas.querySelectorAll('.' + className);
    for (const span of spans) {
      const spanRange = document.createRange();
      spanRange.selectNode(span);
      if (range.compareBoundaryPoints(Range.START_TO_START, spanRange) <= 0 &&
          range.compareBoundaryPoints(Range.END_TO_END, spanRange) >= 0) {
        return span;
      }
    }
  } catch (e) {}
  return null;
}
function unwrapNode(node) {
  const parent = node.parentNode;
  while (node.firstChild) parent.insertBefore(node.firstChild, node);
  parent.removeChild(node);
}
function toggleSizeClass(canvas, className) {
  const existing = isSelectionInClass(canvas, className);
  if (existing) { unwrapNode(existing); return; }
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed || !canvas.contains(sel.anchorNode)) { toast('Select some text first', 'info'); return; }
  const otherClass = className === 'ap-large' ? 'ap-small' : 'ap-large';
  const existingOther = isSelectionInClass(canvas, otherClass);
  if (existingOther) unwrapNode(existingOther);
  const range = sel.getRangeAt(0);
  const span = document.createElement('span');
  span.className = className;
  span.appendChild(range.extractContents());
  range.insertNode(span);
  sel.removeAllRanges();
  const r2 = document.createRange(); r2.selectNodeContents(span); sel.addRange(r2);
}

/* Custom bold/italic/underline toggle — replaces document.execCommand('bold'/'italic'/'underline').
   Browsers are unreliable about un-toggling a style for a collapsed caret (re-clicking the
   button doesn't reliably stop the *next* characters you type from inheriting the old style).
   We fully own the DOM instead: wrap/unwrap a span with our own class for real selections, and
   for a collapsed caret we plant an invisible marker character inside (or just outside) a span
   so subsequent typing deterministically does or doesn't pick up the formatting. */
function toggleInlineFormat(canvas, className) {
  const sel = window.getSelection();
  if (!sel.rangeCount || !canvas.contains(sel.anchorNode)) { toast('Click inside the editor first', 'info'); return; }
  const range = sel.getRangeAt(0);

  if (sel.isCollapsed) {
    const existing = isSelectionInClass(canvas, className);
    if (existing) {
      // Turn OFF: place the caret just after the formatted span so further typing exits it.
      const marker = document.createTextNode('\u200B');
      if (existing.nextSibling) existing.parentNode.insertBefore(marker, existing.nextSibling);
      else existing.parentNode.appendChild(marker);
      const r = document.createRange(); r.setStart(marker, 1); r.collapse(true);
      sel.removeAllRanges(); sel.addRange(r);
    } else {
      // Turn ON: create an empty styled span and place the caret inside it.
      const span = document.createElement('span');
      span.className = className;
      span.appendChild(document.createTextNode('\u200B'));
      range.insertNode(span);
      const r = document.createRange(); r.setStart(span.firstChild, 1); r.collapse(true);
      sel.removeAllRanges(); sel.addRange(r);
    }
    return;
  }

  const existing = isSelectionInClass(canvas, className);
  if (existing) { unwrapNode(existing); return; }
  const span = document.createElement('span');
  span.className = className;
  span.appendChild(range.extractContents());
  range.insertNode(span);
  sel.removeAllRanges();
  const r2 = document.createRange(); r2.selectNodeContents(span); sel.addRange(r2);
}

function updateWordCount() {
  const txt = document.getElementById('blogCanvas').textContent.trim();
  document.getElementById('blogWordCount').textContent = txt ? txt.split(/\s+/).length : 0;
}

function updateToolbarActiveStates() {
  const canvas = document.getElementById('blogCanvas');
  const toolbar = document.getElementById('blogToolbar');
  if (!canvas || !toolbar) return;
  if (document.activeElement !== canvas && !canvas.contains(document.activeElement)) return;
  ['bold', 'italic', 'underline'].forEach(cmd => {
    const b = toolbar.querySelector('[data-cmd="' + cmd + '"]');
    if (!b) return;
    b.classList.toggle('active', !!isSelectionInClass(canvas, 'ap-' + cmd));
  });
  let blockTag = '';
  try { blockTag = (document.queryCommandValue('formatBlock') || '').toLowerCase(); } catch (e) {}
  toolbar.querySelectorAll('[data-block]').forEach(b => b.classList.toggle('active', b.dataset.block === blockTag));
  const bq = toolbar.querySelector('[data-cmd="blockquote"]');
  if (bq) bq.classList.toggle('active', blockTag === 'blockquote');
  toolbar.querySelector('[data-size="large"]').classList.toggle('active', !!isSelectionInClass(canvas, 'ap-large'));
  toolbar.querySelector('[data-size="small"]').classList.toggle('active', !!isSelectionInClass(canvas, 'ap-small'));
}

function savePost(status) {
  const title = document.getElementById('blogTitleInput').value.trim();
  if (!title) return toast('Give your post a title first', 'error');
  const html = document.getElementById('blogCanvas').innerHTML.trim();
  const textOnly = document.getElementById('blogCanvas').textContent.replace(/\s+/g, ' ').trim();
  if (!textOnly) return toast('Write something before saving', 'error');
  const category = document.getElementById('blogCatSelect').value;
  const posts = dbGet('blog', []);

  if (blogState.editingId) {
    const p = posts.find(x => x.id === blogState.editingId);
    Object.assign(p, { title, category, html, featImg: blogState.featDataUrl, excerpt: textOnly.slice(0, 130) + (textOnly.length > 130 ? '…' : ''), status, words: textOnly.split(/\s+/).length });
    logActivity('blog', (status === 'published' ? 'Published' : 'Saved draft') + ' "' + title + '"', category);
  } else {
    posts.unshift({ id: uid(), title, category, html, featImg: blogState.featDataUrl, excerpt: textOnly.slice(0, 130) + (textOnly.length > 130 ? '…' : ''), status, date: new Date().toISOString(), views: 0, words: textOnly.split(/\s+/).length });
    logActivity('blog', (status === 'published' ? 'Published' : 'Drafted') + ' "' + title + '"', category);
  }
  dbSet('blog', posts);
  toast(status === 'published' ? 'Post published' : 'Draft saved', 'success');
  closeEditor();
  render_blog();
}

function initBlogModule() {
  document.getElementById('blogNewBtn').addEventListener('click', () => openEditor(null));
  document.getElementById('blogEditorClose').addEventListener('click', () => {
    const hasContent = document.getElementById('blogTitleInput').value.trim() || document.getElementById('blogCanvas').textContent.trim();
    if (!hasContent) return closeEditor();
    confirmDialog('Close the editor? Unsaved changes will be lost.', () => { closeConfirm(); closeEditor(); });
  });
  document.getElementById('blogSaveDraftBtn').addEventListener('click', () => savePost('draft'));
  document.getElementById('blogPublishBtn').addEventListener('click', () => savePost('published'));

  document.getElementById('blogSearch').addEventListener('input', e => { blogState.search = e.target.value; render_blog(); });
  document.getElementById('blogStatusFilter').addEventListener('change', e => { blogState.status = e.target.value; render_blog(); });
  document.getElementById('blogCatFilter').addEventListener('change', e => { blogState.cat = e.target.value; render_blog(); });

  document.getElementById('blogGrid').addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit-post]'); if (editBtn) return openEditor(editBtn.dataset.editPost);
    const delBtn = e.target.closest('[data-del-post]');
    if (delBtn) {
      return confirmDialog('Delete this post permanently?', () => {
        const posts = dbGet('blog', []).filter(p => p.id !== delBtn.dataset.delPost);
        dbSet('blog', posts); logActivity('blog', 'Deleted a post', ''); toast('Post deleted', 'success'); closeConfirm(); render_blog();
      });
    }
    const togBtn = e.target.closest('[data-toggle-pub]');
    if (togBtn) {
      const posts = dbGet('blog', []); const p = posts.find(x => x.id === togBtn.dataset.togglePub);
      if (p) { p.status = p.status === 'published' ? 'draft' : 'published'; dbSet('blog', posts); logActivity('blog', (p.status === 'published' ? 'Published' : 'Unpublished') + ' "' + p.title + '"', ''); render_blog(); }
    }
  });

  // featured image
  const drop = document.getElementById('blogFeatDrop'), fileInput = document.getElementById('blogFeatInput');
  drop.addEventListener('click', e => { if (!e.target.closest('#blogFeatRemove')) fileInput.click(); });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { blogState.featDataUrl = reader.result; document.getElementById('blogFeatImg').src = reader.result; drop.classList.add('has-img'); };
    reader.readAsDataURL(file);
  });
  document.getElementById('blogFeatRemove').addEventListener('click', e => { e.stopPropagation(); blogState.featDataUrl = ''; document.getElementById('blogFeatImg').removeAttribute('src'); drop.classList.remove('has-img'); fileInput.value = ''; });

  // toolbar
  const canvas = document.getElementById('blogCanvas');
  const toolbar = document.getElementById('blogToolbar');
  toolbar.addEventListener('mousedown', e => e.preventDefault());
  toolbar.addEventListener('click', e => {
    const btn = e.target.closest('.ap-tb-tool'); if (!btn) return;
    canvas.focus();
    try {
      if (btn.dataset.cmd === 'blockquote') {
        const curBlock = (document.queryCommandValue('formatBlock') || '').toLowerCase();
        document.execCommand('formatBlock', false, curBlock === 'blockquote' ? 'P' : 'BLOCKQUOTE');
      } else if (btn.dataset.cmd === 'bold' || btn.dataset.cmd === 'italic' || btn.dataset.cmd === 'underline') {
        toggleInlineFormat(canvas, 'ap-' + btn.dataset.cmd);
      } else if (btn.dataset.cmd) {
        document.execCommand(btn.dataset.cmd, false, null);
      } else if (btn.dataset.block) {
        const curBlock = (document.queryCommandValue('formatBlock') || '').toLowerCase();
        document.execCommand('formatBlock', false, curBlock === btn.dataset.block ? 'P' : btn.dataset.block.toUpperCase());
      } else if (btn.dataset.size === 'large') toggleSizeClass(canvas, 'ap-large');
      else if (btn.dataset.size === 'small') toggleSizeClass(canvas, 'ap-small');
    } catch (err) { toast('Formatting isn\'t supported in this browser', 'error'); }
    updateWordCount();
    updateToolbarActiveStates();
  });
  canvas.addEventListener('input', () => { updateWordCount(); updateToolbarActiveStates(); });
  canvas.addEventListener('keyup', updateToolbarActiveStates);
  canvas.addEventListener('mouseup', updateToolbarActiveStates);
  canvas.addEventListener('focus', updateToolbarActiveStates);
  document.addEventListener('selectionchange', () => {
    if (document.getElementById('apBlogEditor').classList.contains('show')) updateToolbarActiveStates();
  });
}
AP_INITS.push(initBlogModule);



/* ════════════════════════════════════════════
   NOTIFICATIONS.JS — send / schedule / history
   ════════════════════════════════════════════ */
const notifState = { schedOn: false, schedDateISO: null, schedTime: null };
let notifDatePicker = null;
let notifTimePicker = null;

async function fetchNotifications() {
  const active = dbGet('notif_active', []);
  const queue = dbGet('notif_queue', []);
  const history = dbGet('notif_history', []);
  const map = new Map();
  [...active, ...queue, ...history].forEach(n => {
    if (n && n.id && !map.has(n.id)) map.set(n.id, n);
  });
  return Array.from(map.values());
}

async function render_notifications() {
  const allNotifs = await fetchNotifications();
  const now = Date.now();

  const active = allNotifs.filter(n => n.status === 'live' || (n.status === 'scheduled' && new Date(normaliseIsoAdmin(n.publish_at)).getTime() <= now));
  const queue = allNotifs.filter(n => n.status === 'scheduled' && new Date(normaliseIsoAdmin(n.publish_at)).getTime() > now);
  
  // Newest first in each list
  const newestFirst = (a, b) => new Date(normaliseIsoAdmin(b.created_at || b.publish_at)).getTime() - new Date(normaliseIsoAdmin(a.created_at || a.publish_at)).getTime();
  active.sort(newestFirst);
  queue.sort((a, b) => new Date(normaliseIsoAdmin(a.publish_at)).getTime() - new Date(normaliseIsoAdmin(b.publish_at)).getTime()); // scheduled: soonest first
  
  renderNotifActive(active); 
  renderNotifQueue(queue); 
  renderNotifHistory(allNotifs.slice(0, 25));
  
  document.getElementById('apBellDot').style.display = queue.length > 0 ? 'block' : 'none';
}


function renderNotifActive(list) {
  document.getElementById('notifActiveCount').textContent = list.length;
  const box = document.getElementById('notifActiveList');
  box.innerHTML = list.length ? list.map(n => `
    <div class="ap-notif-item"><p>${esc(n.message)}</p><div class="ap-notif-item-meta">
      <span class="ap-badge ${n.type === 'all' ? 'bg-acc' : 'bg-mut'}">${n.type === 'all' ? 'Broadcast' : esc(n.type)}</span>
      <span class="ap-mono">${relTime(n.created_at)}</span>
      <button class="ap-iconbtn-xs require-admin" style="margin-left:auto" onclick="editNotif('${n.id}')" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></button>
      <button class="ap-iconbtn-xs danger require-admin" onclick="confirmDeleteNotif('${n.id}')" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
    </div></div>`).join('')
    : '<div class="ap-empty" style="padding:18px"><p>Nothing active right now.</p></div>';
}

function renderNotifQueue(list) {
  document.getElementById('notifQueueCount').textContent = list.length;
  const box = document.getElementById('notifQueueList');
  box.innerHTML = list.length ? list.map(n => `
    <div class="ap-notif-item"><p>${esc(n.message)}</p><div class="ap-notif-item-meta">
      <span class="ap-badge ${n.type === 'all' ? 'bg-acc' : 'bg-mut'}">${n.type === 'all' ? 'Broadcast' : esc(n.type)}</span>
      <span class="ap-mono">${fmtDateTime(n.publish_at)}</span>
      <button class="ap-iconbtn-xs require-admin" style="margin-left:auto" onclick="editNotif('${n.id}')" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></button>
      <button class="ap-iconbtn-xs danger require-admin" onclick="confirmDeleteNotif('${n.id}')" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
    </div></div>`).join('')
    : '<div class="ap-empty" style="padding:18px"><p>No scheduled notifications.</p></div>';
}

async function editNotif(id) {
  const allNotifs = await fetchNotifications();
  const n = allNotifs.find(x => x.id === id);
  if (!n) return;
  
  notifState.editingId = id;

  document.getElementById('notifTarget').value = n.type === 'all' ? '' : n.type;
  document.getElementById('notifMsg').value = n.message;
  autosizeTextarea(document.getElementById('notifMsg'));
  document.getElementById('notifChars').textContent = n.message.length;

  if (n.status === 'scheduled') {
    notifState.schedOn = true;
    notifState.schedDateISO = n.publish_at;
    const d = new Date(n.publish_at);
    notifState.schedTime = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    document.getElementById('notifSchedSwitch').classList.add('on');
    document.getElementById('notifSchedToggle').classList.add('active');
    document.getElementById('notifSchedHint').textContent = 'On';
    document.getElementById('notifSchedDT').classList.add('show');
    const dd = document.getElementById('notifDateDisplay'); dd.textContent = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); dd.classList.remove('ph');
    const td = document.getElementById('notifTimeDisplay'); td.textContent = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }); td.classList.remove('ph');
  }

  document.getElementById('notifSendBtn').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> Update notification';

  document.getElementById('notifMsg').focus();
  document.getElementById('notifMsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  toast('Editing — update and hit Update to save', 'info');
}

function confirmDeleteNotif(id) {
  confirmDialog('Delete this notification?', () => {
    closeConfirm();
    dbSet('notif_history', dbGet('notif_history', []).filter(n => n.id !== id));
    dbSet('notif_active', dbGet('notif_active', []).filter(n => n.id !== id));
    dbSet('notif_queue', dbGet('notif_queue', []).filter(n => n.id !== id));
    toast('Notification deleted', 'success');
    render_notifications();
  });
}

function renderNotifHistory(list) {
  const box = document.getElementById('notifHistoryList');
  box.innerHTML = list.length ? list.map(n => `
    <div class="ap-notif-item"><p>${esc(n.message)}</p><div class="ap-notif-item-meta"><span class="ap-badge ${n.type === 'all' ? 'bg-acc' : 'bg-mut'}">${n.type === 'all' ? 'Broadcast' : esc(n.type)}</span><span class="ap-mono">${relTime(n.created_at)}</span></div></div>`).join('')
    : '<div class="ap-empty" style="padding:18px"><p>No notifications sent yet.</p></div>';
}

async function sendNotification() {
  const target = document.getElementById('notifTarget').value.trim() || 'all';
  const message = document.getElementById('notifMsg').value.trim();
  if (!message) return toast('Write a message first', 'error');

  let publish_at = null;
  let status = 'live';

  if (notifState.schedOn) {
    if (!notifState.schedDateISO || !notifState.schedTime) return toast('Pick a schedule date and time', 'error');
    const d = new Date(notifState.schedDateISO);
    const [h, m] = notifState.schedTime.split(':');
    d.setHours(+h, +m);
    publish_at = d.toISOString();
    status = 'scheduled';
  }
  
  const isEdit = !!notifState.editingId;
  const notifObj = {
    id: isEdit ? notifState.editingId : uid(),
    title: '',
    message,
    type: target,
    status,
    publish_at,
    created_at: new Date().toISOString()
  };

  let history = dbGet('notif_history', []);
  if (isEdit) {
    history = history.map(n => n.id === notifObj.id ? notifObj : n);
  } else {
    history.unshift(notifObj);
  }
  dbSet('notif_history', history);

  if (status === 'live') {
    let active = dbGet('notif_active', []);
    if (isEdit) active = active.map(n => n.id === notifObj.id ? notifObj : n);
    else active.unshift(notifObj);
    dbSet('notif_active', active);
  } else {
    let queue = dbGet('notif_queue', []);
    if (isEdit) queue = queue.map(n => n.id === notifObj.id ? notifObj : n);
    else queue.unshift(notifObj);
    dbSet('notif_queue', queue);
  }

  logActivity('notif', (target === 'all' ? 'Sent broadcast notification' : 'Sent notification to ' + target), message.slice(0, 60));
  toast(status === 'scheduled' ? 'Notification scheduled' : 'Notification sent', 'success');
  
  document.getElementById('notifTarget').value = '';
  document.getElementById('notifMsg').value = '';
  autosizeTextarea(document.getElementById('notifMsg'));
  document.getElementById('notifChars').textContent = '0';
  if (notifState.schedOn) {
    notifState.schedOn = false; notifState.schedDateISO = null; notifState.schedTime = null;
    document.getElementById('notifSchedSwitch').classList.remove('on');
    document.getElementById('notifSchedToggle').classList.remove('active');
    document.getElementById('notifSchedHint').textContent = 'Off';
    document.getElementById('notifSchedDT').classList.remove('show');
    if (notifDatePicker) notifDatePicker.reset();
    if (notifTimePicker) notifTimePicker.reset();
  }
  notifState.editingId = null;
  document.getElementById('notifSendBtn').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send notification';
  render_notifications();
}

function initNotifModule() {
  document.getElementById('notifMsg').addEventListener('input', e => { document.getElementById('notifChars').textContent = e.target.value.length; });
  bindToggle(document.getElementById('notifSchedSwitch'), on => {
    notifState.schedOn = on;
    document.getElementById('notifSchedToggle').classList.toggle('active', on);
    document.getElementById('notifSchedHint').textContent = on ? 'On' : 'Off';
    document.getElementById('notifSchedDT').classList.toggle('show', on);
  });
  document.getElementById('notifSchedToggle').addEventListener('click', e => { if (e.target.closest('.ap-toggle')) return; document.getElementById('notifSchedSwitch').click(); });
  notifDatePicker = createDatePicker('notif', date => { notifState.schedDateISO = date.toISOString(); });
  notifTimePicker = createTimePicker('notif', hhmm => { notifState.schedTime = hhmm; });
  document.getElementById('notifSendBtn').addEventListener('click', sendNotification);
  document.getElementById('notifClearHistBtn').addEventListener('click', () => {
    toast('History is pulled from DB and cannot be manually cleared.', 'info');
  });
}
AP_INITS.push(initNotifModule);



/* ════════════════════════════════════════════
   ANALYTICS.JS — summary stats + Chart.js graphs
   ════════════════════════════════════════════ */
let chartInstances = {};
function getCssVar(name) { return getComputedStyle(document.body).getPropertyValue(name).trim(); }

function makeChart(id, config) {
  if (chartInstances[id]) chartInstances[id].destroy();
  const el = document.getElementById(id);
  if (!el) return;
  const ctx = el.getContext && el.getContext('2d');
  if (!ctx) return;
  chartInstances[id] = new Chart(ctx, config);
}

function baseChartOpts(border) {
  return { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: border }, beginAtZero: true } } };
}

function render_analytics() {
  const users = dbGet('users', []);
  const hist = dbGet('tests_history', []);
  document.getElementById('anTotalUsers').textContent = users.length;
  document.getElementById('anPremium').textContent = users.filter(u => u.premium).length;
  const totalAttempts = users.reduce((s, u) => s + u.attempts, 0) + hist.reduce((s, t) => s + (t.participants || 0), 0);
  document.getElementById('anAttempts').textContent = totalAttempts.toLocaleString('en-IN');
  const avgXp = users.length ? Math.round(users.reduce((s, u) => s + u.xp, 0) / users.length) : 0;
  document.getElementById('anAvgXp').textContent = avgXp.toLocaleString('en-IN');
  const subjCounts = {}; SUBJECTS.forEach(s => subjCounts[s] = 0);
  users.forEach(u => subjCounts[u.subject] = (subjCounts[u.subject] || 0) + 1);
  const topSubject = Object.entries(subjCounts).sort((a, b) => b[1] - a[1])[0][0];
  document.getElementById('anTopSubject').textContent = topSubject;
  const avgAcc = users.length ? Math.round(users.reduce((s, u) => s + u.accuracy, 0) / users.length) : 0;
  document.getElementById('anAvgAcc').textContent = avgAcc + '%';
  try { renderCharts(users); } catch (e) { console.error('Chart render skipped:', e); }
}

function renderCharts(users) {
  const accent = getCssVar('--accent'), accent2 = getCssVar('--accent2'), green = getCssVar('--green'), amber = getCssVar('--amber'), txt3 = getCssVar('--txt3'), border = getCssVar('--border');
  Chart.defaults.color = txt3;
  Chart.defaults.font.family = 'Sora';

  const months = [], counts = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleDateString('en-IN', { month: 'short' }));
    const mk = d.getMonth(), yk = d.getFullYear();
    counts.push(users.filter(u => { const ud = new Date(u.joined); return ud.getMonth() === mk && ud.getFullYear() === yk; }).length);
  }
  makeChart('chartUserReg', { type: 'bar', data: { labels: months, datasets: [{ label: 'New users', data: counts, backgroundColor: accent2, borderRadius: 6, maxBarThickness: 34 }] }, options: baseChartOpts(border) });

  const subjAttempts = SUBJECTS.map(s => users.filter(u => u.subject === s).reduce((sum, u) => sum + u.attempts, 0) + randInt(200, 600));
  makeChart('chartSubjectAttempts', { type: 'doughnut', data: { labels: SUBJECTS, datasets: [{ data: subjAttempts, backgroundColor: [accent2, green, amber], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } } });

  const subjAcc = SUBJECTS.map(s => { const arr = users.filter(u => u.subject === s); return arr.length ? Math.round(arr.reduce((sum, u) => sum + u.accuracy, 0) / arr.length) : randInt(55, 80); });
  makeChart('chartAccuracy', { type: 'bar', data: { labels: SUBJECTS, datasets: [{ label: 'Avg accuracy %', data: subjAcc, backgroundColor: green, borderRadius: 6, maxBarThickness: 40 }] }, options: baseChartOpts(border) });

  const buckets = ['0-500', '500-1k', '1k-1.5k', '1.5k-2k', '2k-2.5k', '2.5k+'];
  const bucketCounts = [0, 0, 0, 0, 0, 0];
  users.forEach(u => { const x = u.xp; let idx; if (x < 500) idx = 0; else if (x < 1000) idx = 1; else if (x < 1500) idx = 2; else if (x < 2000) idx = 3; else if (x < 2500) idx = 4; else idx = 5; bucketCounts[idx]++; });
  makeChart('chartXpDist', { type: 'line', data: { labels: buckets, datasets: [{ label: 'Users', data: bucketCounts, borderColor: accent, backgroundColor: 'rgba(91,108,255,.15)', fill: true, tension: .35, pointBackgroundColor: accent }] }, options: baseChartOpts(border) });
}

function initAnalyticsModule() { /* charts render on page entry via render_analytics() */ }
AP_INITS.push(initAnalyticsModule);



/* ════════════════════════════════════════════
   TESTHISTORY.JS — archive of past / scheduled tests
   ════════════════════════════════════════════ */
const thState = { search: '', type: 'all', subject: 'all', status: 'all', sort: 'newest' };

// Derives the real-time phase of a test from its start time + timer duration —
// works for both instantly-published ("live") and scheduled tests, no separate ticker needed.
function deriveTestHistPhase(t) {
  const start = new Date(t.date).getTime();
  if (isNaN(start)) return 'ended';
  if (!t.questions || !t.questions.length) return start > Date.now() ? 'scheduled' : 'ended';
  const durMin = parseInt(t.timer, 10) || 30;
  const end = start + durMin * 60000;
  const now = Date.now();
  if (now < start) return 'scheduled';
  if (now <= end) return 'live';
  return 'ended';
}

async function render_testhistory() {
  const box = document.getElementById('thList');
  const admin = dbGet('profile', null);
  if (!admin) return;

  let list = dbGet('tests_history', []);

  const now = Date.now();
  list.forEach(t => {
    const st = new Date(t.publish_at || t.created_at || now).getTime();
    const end = st + ((parseInt(t.timer, 10) || 30) * 60000);
    if (st > now) t._phase = 'scheduled';
    else if (end > now) t._phase = 'live';
    else t._phase = 'ended';
    t._date = st;
  });

  const q = thState.search.trim().toLowerCase();
  if (q) list = list.filter(t => t.title.toLowerCase().includes(q));
  if (thState.subject !== 'all') list = list.filter(t => t.subject === thState.subject);
  if (thState.status !== 'all') list = list.filter(t => t._phase === thState.status);

  if (thState.sort === 'newest') list.sort((a, b) => b._date - a._date);
  else if (thState.sort === 'oldest') list.sort((a, b) => a._date - b._date);

  if (!list.length) {
    box.innerHTML = '<div class="ap-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/></svg><strong>No tests found</strong><p>Publish a test to see it appear here.</p></div>';
    return;
  }

  box.innerHTML = list.map(t => {
    const phase = t._phase;
    
    let badge = '';
    let timerHtml = '';
    if (phase === 'live') {
      badge = '<span class="ap-badge bg-red">&#9679; LIVE</span>';
      const elapsed = Math.floor((now - t._date) / 1000);
      const totalSecs = (parseInt(t.timer, 10) || 30) * 60;
      const left = Math.max(0, totalSecs - elapsed);
      const mm = String(Math.floor(left / 60)).padStart(2, '0');
      const ss = String(left % 60).padStart(2, '0');
      timerHtml = `<div class="live-timer-tick" data-end="${t._date + totalSecs * 1000}" style="margin-top:6px; font-family:var(--mono); color:var(--red); font-size:0.75rem;">Time left: ${mm}:${ss}</div>`;
    } else if (phase === 'scheduled') {
      badge = '<span class="ap-badge bg-amb">Scheduled</span>';
    } else {
      badge = '<span class="ap-badge bg-mut">Ended</span>';
    }

    return `<div class="ap-th-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--card); border:1px solid var(--border); padding:16px; border-radius:14px; margin-bottom:12px;">
      <div class="ap-th-main" style="flex:1;">
        <div class="ap-th-title" style="font-size:0.95rem; font-weight:700; margin-bottom:4px;">${esc(t.title)}</div>
        <div class="ap-th-sub" style="font-size:0.75rem; color:var(--txt4);">${esc(t.subject)} · ${fmtDateTime(new Date(t.publish_at || t._date).toISOString())} · ${t.timer || 30} mins</div>
        ${timerHtml}
      </div>
      <div class="ap-th-score" style="margin-right:20px; text-align:right;">
        <div style="margin-bottom: 6px;">${badge}</div>
        <button class="ap-btn ap-btn-sm ap-btn-out" onclick="openTestLeaderboard('${t.id}', '${esc(t.title.replace(/'/g, "\\'"))}')" style="font-size: 0.65rem; padding: 4px 8px;">Leaderboard</button>
      </div>
      <button class="ap-iconbtn danger" onclick="confirmDeleteTestHist('${t.id}')" title="Delete test">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    </div>`;
  }).join('');
}

async function openTestLeaderboard(testId, testTitle) {
  const admin = dbGet('profile', null);
  if (!admin) return;

  const titleEl = document.getElementById('lbStatsTitle');
  const bodyEl = document.getElementById('lbStatsBody');
  const overlay = document.getElementById('lbOverlay');
  
  if (titleEl) titleEl.textContent = testTitle;
  if (overlay) overlay.classList.add('show');
  
  let attempts = [];
  try {
    const raw = localStorage.getItem('pe_test_attempts_' + testId);
    if (raw) attempts = JSON.parse(raw);
  } catch(e) {}

  if (attempts.length === 0) {
    attempts = [
      { first_name: 'Priya Sharma', user_email: 'priya@test.com', score: 92, avatar: null },
      { first_name: 'Rahul Mehta', user_email: 'rahul@test.com', score: 85, avatar: null },
      { first_name: 'Ananya Kapoor', user_email: 'ananya@test.com', score: 76, avatar: null }
    ];
  }
  renderLeaderboardData(attempts, bodyEl);
}

function renderLeaderboardData(data, bodyEl) {
  if (!data || data.length === 0) {
    if (bodyEl) bodyEl.innerHTML = '<div class="ap-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/></svg><strong>No attempts yet</strong><p>Students will appear here once they submit.</p></div>';
    return;
  }

  const sorted = [...data].sort((a, b) => (b.score || 0) - (a.score || 0));
  const rankColors = [
    'linear-gradient(135deg,#ffd25c,#e8a219)',
    'linear-gradient(135deg,#dfe4f0,#aab2c8)',
    'linear-gradient(135deg,#e3ab7a,#c17f47)'
  ];

  const cards = sorted.map((u, i) => {
    const rankNum = i + 1;
    const rankBg = i < 3 ? rankColors[i] : 'var(--bg2)';
    const rankTextColor = i < 3 ? '#1a1a1a' : 'var(--txt3)';

    const pfpHtml = u.avatar && u.avatar !== 'img/default_avatar.svg'
      ? `<img src="${esc(u.avatar)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.outerHTML=window.getDefaultAvatarSVG()">`
      : window.getDefaultAvatarSVG();

    let answersArr = [];
    try { answersArr = JSON.parse(u.answers || '[]'); } catch(e) {}
    const mcqQ = answersArr.filter(a => a.type === 'mcq');
    const directQ = answersArr.filter(a => a.type === 'direct');

    let mcqHtml = '';
    if (mcqQ.length) {
      const chips = mcqQ.map((mq, idx) => {
        let bg = 'var(--bg2)', col = 'var(--txt3)', border = 'var(--border)';
        if (mq.is_correct === true)  { bg = 'rgba(34,197,94,.12)'; col = 'var(--green)'; border = 'rgba(34,197,94,.35)'; }
        if (mq.is_correct === false) { bg = 'rgba(239,68,68,.12)'; col = 'var(--red)';   border = 'rgba(239,68,68,.35)'; }
        if (mq.answer_given === null || mq.answer_given === undefined) { bg = 'rgba(148,163,184,.12)'; col = 'var(--txt4)'; border = 'rgba(148,163,184,.3)'; }
        const label = (mq.answer_given === null || mq.answer_given === undefined) ? 'Skip' : ('ABCD'[mq.answer_given] || mq.answer_given);
        return `<span style="display:inline-flex;align-items:center;padding:3px 9px;border-radius:99px;background:${bg};color:${col};border:1px solid ${border};font-size:.68rem;font-weight:700;font-family:var(--mono);">Q${idx+1}:${label}</span>`;
      }).join('');
      mcqHtml = `<div style="margin-top:10px;"><div class="ap-lb-test-sub-label">MCQ</div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:5px;">${chips}</div></div>`;
    }

    let directHtml = '';
    if (directQ.length) {
      const dCards = directQ.map((dq, idx) => `<div class="ap-lb-test-dq">
        <div class="ap-lb-test-dq-q">Q${idx+1}: ${esc(dq.question || 'Direct Question')}</div>
        <div class="ap-lb-test-dq-a"><span class="ap-lb-test-dq-label">USER ANSWER</span>${esc(dq.answer_given || 'Not answered')}</div>
      </div>`).join('');
      directHtml = `<div style="margin-top:10px;"><div class="ap-lb-test-sub-label">Direct Questions</div><div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;">${dCards}</div></div>`;
    }

    const hasDetail = mcqHtml || directHtml;
    const detailId = 'lbdet_' + i;

    return `<div class="ap-lb-test-card">
      <div class="ap-lb-test-top" ${hasDetail ? `onclick="document.getElementById('${detailId}').classList.toggle('open')" style="cursor:pointer;"` : ''}>
        <div class="ap-lb-test-rank" style="background:${rankBg};color:${rankTextColor};">${rankNum}</div>
        <div class="ap-lb-test-av">${pfpHtml}</div>
        <div class="ap-lb-test-info">
          <div class="ap-lb-test-name">${esc(u.first_name || u.user_email || u.email || '—')}</div>
          <div class="ap-lb-test-email">${esc(u.user_email || u.email || '')}</div>
        </div>
        <div class="ap-lb-test-score-pill">${u.score != null ? u.score + '%' : '—'}</div>
        ${hasDetail ? `<svg style="width:14px;height:14px;flex-shrink:0;color:var(--txt4);transition:transform .2s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>` : ''}
      </div>
      ${hasDetail ? `<div class="ap-lb-test-detail" id="${detailId}">${mcqHtml}${directHtml}</div>` : ''}
    </div>`;
  }).join('');

  if (bodyEl) bodyEl.innerHTML = cards;
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('lbOverlayClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('lbOverlay').classList.remove('show');
    });
  }
});

function confirmDeleteTestHist(id) {
  confirmDialog('Delete this test permanently? This removes it immediately.', () => {
    closeConfirm();
    let list = dbGet('tests_history', []);
    list = list.filter(t => t.id !== id);
    dbSet('tests_history', list);
    toast('Test deleted', 'success');
    render_testhistory();
    renderLiveMonitor();
  });
}

function initTestHistoryModule() {
  document.getElementById('thSearch').addEventListener('input', e => { thState.search = e.target.value; render_testhistory(); });
  document.getElementById('thTypeFilter').addEventListener('change', e => { thState.type = e.target.value; render_testhistory(); });
  document.getElementById('thSubjectFilter').addEventListener('change', e => { thState.subject = e.target.value; render_testhistory(); });
  document.getElementById('thStatusFilter').addEventListener('change', e => { thState.status = e.target.value; render_testhistory(); });
  document.getElementById('thSort').addEventListener('change', e => { thState.sort = e.target.value; render_testhistory(); });
  setInterval(() => { if (currentPage === 'testhistory') render_testhistory(); }, 15000);
}
AP_INITS.push(initTestHistoryModule);



/* ════════════════════════════════════════════
   QBANK.JS — reusable question bank: list,
   manual add/edit, simple .txt import
   ════════════════════════════════════════════ */
const qbState = { search: '', subject: 'all', type: 'all', editingId: null };

function getFilteredQBank() {
  let list = dbGet('qbank', []);
  const q = qbState.search.trim().toLowerCase();
  if (q) list = list.filter(x => x.text.toLowerCase().includes(q));
  if (qbState.subject !== 'all') list = list.filter(x => x.subject === qbState.subject);
  if (qbState.type !== 'all') list = list.filter(x => x.type === qbState.type);
  return list;
}

function render_questionbank() {
  const all = dbGet('qbank', []);
  document.getElementById('qbCount').textContent = all.length;
  const list = getFilteredQBank();
  const box = document.getElementById('qbList');
  if (!list.length) {
    box.innerHTML = '<div class="ap-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><strong>No questions found</strong><p>Add one manually, or import a .txt file.</p></div>';
    return;
  }
  box.innerHTML = list.map(q => `
    <div class="ap-qb-item">
      <div class="ap-qb-item-top">
        <div class="ap-qb-q">${esc(q.text)}</div>
        <div class="ap-qb-acts">
          <button class="ap-iconbtn" data-edit-q="${q.id}" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></button>
          <button class="ap-iconbtn danger" data-del-q="${q.id}" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
        </div>
      </div>
      <div class="ap-qb-tags"><span class="ap-badge bg-acc">${esc(q.subject)}</span><span class="ap-badge bg-mut">${q.type === 'mcq' ? 'MCQ' : 'Direct'}</span></div>
    </div>`).join('');
}

function resetQbForm() {
  qbState.editingId = null;
  document.getElementById('qbManualQ').value = '';
  autosizeTextarea(document.getElementById('qbManualQ'));
  document.querySelectorAll('.qbOptInput').forEach(i => i.value = '');
  document.getElementById('qbDirectAns').value = '';
  document.querySelector('input[name="qbCorrect"][value="0"]').checked = true;
  setSelectValue('qbManualType', 'mcq');
  document.getElementById('qbAddBtn').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Save to bank';
}

function fillQbFormFor(q) {
  qbState.editingId = q.id;
  document.getElementById('qbManualQ').value = q.text;
  autosizeTextarea(document.getElementById('qbManualQ'));
  setSelectValue('qbManualSubj', q.subject);
  setSelectValue('qbManualType', q.type);
  if (q.type === 'mcq') {
    document.querySelectorAll('.qbOptInput').forEach((inp, i) => inp.value = q.options[i] || '');
    document.querySelector(`input[name="qbCorrect"][value="${q.correctIndex}"]`).checked = true;
  } else {
    document.getElementById('qbDirectAns').value = q.correctAnswer || '';
  }
  document.getElementById('qbAddBtn').innerHTML = 'Update question';
  document.getElementById('qbManualQ').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function saveQbQuestion() {
  const text = document.getElementById('qbManualQ').value.trim();
  if (!text) return toast('Enter the question text', 'error');
  const subject = document.getElementById('qbManualSubj').value;
  const type = document.getElementById('qbManualType').value;
  let q;
  if (type === 'mcq') {
    const opts = Array.from(document.querySelectorAll('.qbOptInput')).map(i => i.value.trim());
    if (opts.some(o => !o)) return toast('Fill in all four options', 'error');
    const correctIndex = +document.querySelector('input[name="qbCorrect"]:checked').value;
    q = { text, subject, type, options: opts, correctIndex };
  } else {
    const ans = document.getElementById('qbDirectAns').value.trim();
    if (!ans) return toast('Enter the correct answer', 'error');
    q = { text, subject, type, correctAnswer: ans };
  }
  const bank = dbGet('qbank', []);
  if (qbState.editingId) {
    const idx = bank.findIndex(x => x.id === qbState.editingId);
    if (idx > -1) bank[idx] = { ...q, id: qbState.editingId };
    logActivity('question', 'Updated a question', subject);
    toast('Question updated', 'success');
  } else {
    bank.unshift({ ...q, id: uid() });
    logActivity('question', 'Added a question to bank', subject);
    toast('Saved to bank', 'success');
  }
  dbSet('qbank', bank);
  resetQbForm();
  render_questionbank();
}

function parseTxtQuestions(text, subject) {
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const out = [];
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const qLine = lines.find(l => /^Q[:.]/i.test(l));
    if (!qLine) return;
    const qText = qLine.replace(/^Q[:.]\s*/i, '');
    const optLines = lines.filter(l => /^[A-Da-d][).]/.test(l));
    const correctLine = lines.find(l => /^correct[:.]/i.test(l));
    const answerLine = lines.find(l => /^answer[:.]/i.test(l));
    if (optLines.length >= 2 && correctLine) {
      const opts = optLines.slice(0, 4).map(l => l.replace(/^[A-Da-d][).]\s*/, ''));
      while (opts.length < 4) opts.push('');
      const letter = correctLine.replace(/^correct[:.]\s*/i, '').trim().toUpperCase().charAt(0);
      const correctIndex = Math.max(0, 'ABCD'.indexOf(letter));
      out.push({ id: uid(), text: qText, subject, type: 'mcq', options: opts, correctIndex });
    } else if (answerLine) {
      out.push({ id: uid(), text: qText, subject, type: 'direct', correctAnswer: answerLine.replace(/^answer[:.]\s*/i, '') });
    }
  });
  return out;
}

function initQBankModule() {
  document.getElementById('qbSearch').addEventListener('input', e => { qbState.search = e.target.value; render_questionbank(); });
  document.getElementById('qbSubjFilter').addEventListener('change', e => { qbState.subject = e.target.value; render_questionbank(); });
  document.getElementById('qbTypeFilter').addEventListener('change', e => { qbState.type = e.target.value; render_questionbank(); });

  document.getElementById('qbManualType').addEventListener('change', e => {
    document.getElementById('qbManualOptsWrap').classList.toggle('hidden', e.target.value !== 'mcq');
    document.getElementById('qbDirectAnsWrap').classList.toggle('hidden', e.target.value !== 'direct');
  });
  document.getElementById('qbAddBtn').addEventListener('click', saveQbQuestion);

  document.getElementById('qbList').addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit-q]');
    if (editBtn) { const q = dbGet('qbank', []).find(x => x.id === editBtn.dataset.editQ); if (q) fillQbFormFor(q); return; }
    const delBtn = e.target.closest('[data-del-q]');
    if (delBtn) {
      return confirmDialog('Delete this question from the bank?', () => {
        dbSet('qbank', dbGet('qbank', []).filter(x => x.id !== delBtn.dataset.delQ));
        logActivity('question', 'Deleted a question', ''); toast('Question deleted', 'success'); closeConfirm(); render_questionbank();
      });
    }
  });

  document.getElementById('qbFormatHelpBtn').addEventListener('click', () => {
    openDetailSheet(`
      <div class="ap-detail-hdr"><div style="font-weight:700;font-size:.95rem">TXT import format</div>
      <button class="ap-iconbtn ap-detail-close" id="closeFmtX"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
      <p class="ap-secnote" style="margin-bottom:10px">Separate each question with a blank line. The subject picked in the form is applied to every question in the file.</p>
      <div class="ap-logs-panel" style="max-height:none">
        <div class="ap-log-line" style="color:var(--txt2)">Q: What is the capital of France?<br>A) Berlin<br>B) Paris<br>C) Rome<br>D) Madrid<br>Correct: B</div>
      </div>
      <p class="ap-secnote" style="margin:10px 0">For a direct-answer question, skip the A–D options:</p>
      <div class="ap-logs-panel" style="max-height:none">
        <div class="ap-log-line" style="color:var(--txt2)">Q: State the formula for Simple Interest.<br>Answer: SI = (P × R × T) / 100</div>
      </div>
      <button class="ap-btn ap-btn-acc ap-btn-full" id="closeFmtBtn" style="margin-top:14px">Got it</button>
    `);
    document.getElementById('closeFmtX').addEventListener('click', closeDetailSheet);
    document.getElementById('closeFmtBtn').addEventListener('click', closeDetailSheet);
  });

  document.getElementById('qbImportBtn').addEventListener('click', () => document.getElementById('qbFileInput').click());
  document.getElementById('qbFileInput').addEventListener('change', () => {
    const file = document.getElementById('qbFileInput').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const subject = document.getElementById('qbManualSubj').value;
      const parsed = parseTxtQuestions(reader.result, subject);
      if (!parsed.length) { toast('No valid questions found — tap the (i) icon to see the expected format', 'error'); return; }
      openImportPreview(parsed, subject);
    };
    reader.readAsText(file);
    document.getElementById('qbFileInput').value = '';
  });
}

function openImportPreview(parsed, subject) {
  const html = `
    <div class="ap-detail-hdr"><div style="font-weight:700;font-size:.95rem">${parsed.length} question${parsed.length === 1 ? '' : 's'} found</div>
    <button class="ap-iconbtn ap-detail-close" id="closeImpX"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="ap-secnote ap-mb12">Review and untick anything you don't want, then import the rest into ${esc(subject)}.</div>
    <label class="ap-toggle-row ap-mb12">
      <span class="ap-toggle on" id="impSelectAllToggle"><span class="ap-toggle-knob"></span></span>
      <span>Select all (${parsed.length})</span>
    </label>
    <div id="impPickList">
      ${parsed.map(q => `<label class="ap-qb-item" style="display:flex;gap:10px;align-items:flex-start;cursor:pointer">
        <span class="ap-check" style="margin-top:2px"><input type="checkbox" class="impPickChk" data-id="${q.id}" checked><span class="ap-check-ui"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></span>
        <div style="flex:1"><div class="ap-qb-q">${esc(q.text)}</div><div class="ap-qb-tags"><span class="ap-badge bg-mut">${q.type === 'mcq' ? 'MCQ' : 'Direct'}</span></div></div>
      </label>`).join('')}
    </div>
    <div style="height:64px"></div>
    <div style="position:sticky;bottom:0;background:var(--card);padding-top:10px;margin-top:-64px;border-top:1px solid var(--border);display:flex;gap:8px">
      <button class="ap-btn ap-btn-out" id="impCancelBtn">Cancel</button>
      <button class="ap-btn ap-btn-acc ap-btn-full" id="impConfirmBtn">Import selected (<span id="impSelCount">${parsed.length}</span>)</button>
    </div>`;
  openDetailSheet(html);
  const panel = document.getElementById('apUserDetailPanel');
  document.getElementById('closeImpX').addEventListener('click', closeDetailSheet);
  document.getElementById('impCancelBtn').addEventListener('click', closeDetailSheet);
  const chks = () => Array.from(panel.querySelectorAll('.impPickChk'));
  const countEl = document.getElementById('impSelCount');
  const confirmBtn = document.getElementById('impConfirmBtn');
  function refreshCount() {
    const n = chks().filter(c => c.checked).length;
    countEl.textContent = n;
    confirmBtn.disabled = n === 0;
  }
  chks().forEach(c => c.addEventListener('change', refreshCount));
  document.getElementById('impSelectAllToggle').addEventListener('click', function () {
    const turningOn = !this.classList.contains('on');
    this.classList.toggle('on', turningOn);
    chks().forEach(c => c.checked = turningOn);
    refreshCount();
  });
  confirmBtn.addEventListener('click', () => {
    const selectedIds = new Set(chks().filter(c => c.checked).map(c => c.dataset.id));
    const toImport = parsed.filter(q => selectedIds.has(q.id));
    if (!toImport.length) return;
    const bank = dbGet('qbank', []);
    dbSet('qbank', [...toImport, ...bank]);
    logActivity('question', 'Imported ' + toImport.length + ' questions from .txt', subject);
    toast(toImport.length + ' question' + (toImport.length === 1 ? '' : 's') + ' imported', 'success');
    closeDetailSheet();
    render_questionbank();
  });
}
AP_INITS.push(initQBankModule);



/* ════════════════════════════════════════════
   ROLES.JS — admin users + access levels
   ════════════════════════════════════════════ */
const LEVEL_BADGE = { Superior: 'bg-acc', Moderator: 'bg-grn', Viewer: 'bg-mut' };

function render_roles() {
  const box = document.getElementById('rolesList');
  try {
    const admin = dbGet('profile', null);
    if (!admin) return;
    
    const roles = dbGet('roles', []);
    const superCount = roles.filter(r => r.role === 'Superior').length;
    
    if (!roles.length) {
      box.innerHTML = '<div class="ap-empty"><strong>No roles yet</strong><p>Add an admin account below.</p></div>';
      return;
    }

    box.innerHTML = roles.map(r => `
      <div class="ap-role-row">
        <div class="ap-uav" style="width:30px;height:30px;font-size:1rem;padding:0;">${esc(r.username).charAt(0).toUpperCase()}</div>
        <span class="ap-role-email">${esc(r.username)}</span>
        ${admin.role === 'Superior' ? 
          `<div class="ap-inline-dropdown require-super" data-edit-role="${esc(r.id)}" ${r.role === 'Superior' && superCount <= 1 ? 'data-disabled="true" title="Cannot change the only Superior admin"' : ''}>
            <div class="ap-dropdown-trigger"><span>${esc(r.role)}</span> <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></div>
            <div class="ap-dropdown-menu">
              <div class="ap-dropdown-item" data-value="Superior">Superior</div>
              <div class="ap-dropdown-item" data-value="Moderator">Moderator</div>
              <div class="ap-dropdown-item" data-value="Viewer">Viewer</div>
            </div>
           </div>`
          : `<span class="ap-badge ${LEVEL_BADGE[r.role]}">${esc(r.role)}</span>`
        }
        <button class="ap-iconbtn require-super" data-reset-role="${esc(r.id)}" data-role-name="${esc(r.username)}" title="Reset Password">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
        </button>
        <button class="ap-iconbtn danger require-super" data-del-role="${esc(r.id)}" data-role-name="${esc(r.username)}" ${r.role === 'Superior' && superCount <= 1 ? 'disabled title="At least one Superior admin is required"' : 'title="Remove"'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>`).join('');
  } catch (e) {
    box.innerHTML = '<div class="ap-empty"><strong>Error</strong><p>Failed to load roles.</p></div>';
  }
}

function initRolesModule() {
  document.getElementById('addRoleBtn').addEventListener('click', () => {
    const username = document.getElementById('newRoleUsername').value.trim();
    const pass = document.getElementById('newRolePass').value.trim();
    const level = document.getElementById('newRoleLevel').value;
    
    if (!username || !pass) return toast('Enter a username and password', 'error');
    
    const roles = dbGet('roles', []);
    if (roles.some(r => r.username.toLowerCase() === username.toLowerCase())) {
      return toast('An admin with that username already exists', 'error');
    }
    
    const newAdmin = {
      id: uid(),
      username,
      password: pass,
      role: level
    };
    roles.push(newAdmin);
    dbSet('roles', roles);
    
    logActivity('role', 'Added admin ' + username, 'Role: ' + level);
    toast(username + ' added as ' + level, 'success');
    document.getElementById('newRoleUsername').value = '';
    document.getElementById('newRolePass').value = '';
    render_roles();
  });

  document.getElementById('rolesList').addEventListener('click', e => {
    // Custom Dropdown logic
    const trigger = e.target.closest('.ap-dropdown-trigger');
    if (trigger) {
      const dropdown = trigger.closest('.ap-inline-dropdown');
      if (dropdown.dataset.disabled === 'true') return;
      dropdown.classList.toggle('open');
      return;
    }
    
    const item = e.target.closest('.ap-dropdown-item');
    if (item) {
      const dropdown = item.closest('.ap-inline-dropdown');
      dropdown.classList.remove('open');
      const id = dropdown.dataset.editRole;
      const newRole = item.dataset.value;
      if (newRole === dropdown.querySelector('.ap-dropdown-trigger span').innerText) return;
      
      const roles = dbGet('roles', []);
      const target = roles.find(r => r.id === id);
      if (target) {
        target.role = newRole;
        dbSet('roles', roles);
        toast('Role updated successfully', 'success');
        logActivity('role', `Updated ${target.username} role to ${newRole}`);
      } else {
        toast('Admin not found', 'error');
      }
      render_roles();
      return;
    }

    // Reset Password logic
    const resetBtn = e.target.closest('[data-reset-role]');
    if (resetBtn) {
      const id = resetBtn.dataset.resetRole;
      const username = resetBtn.dataset.roleName;
      const newPass = prompt(`Enter new password for ${username}:`);
      if (!newPass) return;
      const roles = dbGet('roles', []);
      const target = roles.find(r => r.id === id);
      if (target) {
        target.password = newPass;
        dbSet('roles', roles);
        toast(`Password reset for ${username}`, 'success');
        logActivity('role', `Reset password for ${username}`);
      } else {
        toast('Admin not found', 'error');
      }
      return;
    }

    const btn = e.target.closest('[data-del-role]');
    if (!btn || btn.disabled) return;
    const id = btn.dataset.delRole;
    const username = btn.dataset.roleName;
    
    confirmDialog('Remove admin access for ' + username + '?', () => {
      closeConfirm();
      let roles = dbGet('roles', []);
      roles = roles.filter(r => r.id !== id);
      dbSet('roles', roles);
      logActivity('role', 'Removed admin ' + username, '');
      toast('Access removed', 'success');
      render_roles();
    });
  });
}
AP_INITS.push(initRolesModule);



/* ════════════════════════════════════════════
   ACTIVITYLOG.JS — audit trail viewer
   ════════════════════════════════════════════ */
const alogState = { search: '', type: 'all' };

function getFilteredLog() {
  let list = dbGet('activitylog', []);
  const q = alogState.search.trim().toLowerCase();
  if (q) list = list.filter(l => l.action.toLowerCase().includes(q) || (l.detail || '').toLowerCase().includes(q));
  if (alogState.type !== 'all') list = list.filter(l => l.type === alogState.type);
  return list;
}

function render_activitylog() {
  const list = getFilteredLog();
  const box = document.getElementById('alogList');
  if (!list.length) {
    box.innerHTML = '<div class="ap-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/></svg><strong>No activity yet</strong><p>Actions you take across the console will show up here.</p></div>';
    return;
  }
  const icoCls = { user: 'ic-acc', test: 'ic-amb', blog: 'ic-acc', notif: 'ic-red', role: 'ic-grn', question: 'ic-acc' };
  box.innerHTML = list.map(l => `
    <div class="ap-alog-item">
      <div class="ap-alog-ico ${icoCls[l.type] || 'ic-acc'}">${ALOG_ICO[l.type] || ALOG_ICO.user}</div>
      <div class="ap-alog-body"><div class="ap-alog-action">${esc(l.action)}</div>${l.detail ? `<div class="ap-alog-detail">${esc(l.detail)}</div>` : ''}</div>
      <div class="ap-alog-time">${relTime(l.time)}</div>
    </div>`).join('');
}

function exportLogCsv() {
  const list = getFilteredLog();
  if (!list.length) return toast('Nothing to export', 'info');
  const rows = [['Time', 'Type', 'Action', 'Detail']];
  list.forEach(l => rows.push([fmtDateTime(l.time), l.type, l.action, l.detail || '']));
  const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'interedge-activity-log.csv';
  document.body.appendChild(a); a.click(); a.remove();
  toast('CSV exported', 'success');
}

function initActivityLogModule() {
  document.getElementById('alogSearch').addEventListener('input', e => { alogState.search = e.target.value; render_activitylog(); });
  document.getElementById('alogTypeFilter').addEventListener('change', e => { alogState.type = e.target.value; render_activitylog(); });
  document.getElementById('alogExportBtn').addEventListener('click', exportLogCsv);
  document.getElementById('alogClearBtn').addEventListener('click', () => {
    confirmDialog('Clear the entire activity log? This cannot be undone.', () => { dbSet('activitylog', []); closeConfirm(); render_activitylog(); toast('Activity log cleared', 'info'); });
  });
}
AP_INITS.push(initActivityLogModule);



/* ════════════════════════════════════════════
   LEADERBOARD.JS — ranked students with a
   subject + time-period parameter system
   ════════════════════════════════════════════ */
const lbState = { subject: 'all', period: 'allTime' };
const LB_PERIOD_LABEL = { today: 'today', week: 'this week', month: 'this month', allTime: 'all time' };

function getFilteredLeaderboard() {
  let list = dbGet('leaderboard', []);
  if (lbState.subject !== 'all') list = list.filter(e => e.subject === lbState.subject);
  return [...list].sort((a, b) => (b[lbState.period] || 0) - (a[lbState.period] || 0));
}

function render_leaderboard() {
  const list = getFilteredLeaderboard();
  document.getElementById('lbUpdatedSub').textContent =
    'Ranked by XP · ' + LB_PERIOD_LABEL[lbState.period] + (lbState.subject !== 'all' ? ' · ' + lbState.subject : ' · all subjects');

  const podium = document.getElementById('lbPodium');
  const list3 = document.getElementById('lbList');

  if (!list.length) {
    podium.innerHTML = '';
    list3.innerHTML = '<div class="ap-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/></svg><strong>No students yet</strong><p>Try a different subject filter.</p></div>';
    return;
  }

  const top3 = list.slice(0, 3);
  const medalOrder = ['p1', 'p2', 'p3'];
  podium.innerHTML = top3.map((e, i) => `
    <div class="ap-lb-pod-card ${medalOrder[i]}">
      <div class="ap-lb-pod-medal">${i + 1}</div>
      <div class="ap-lb-pod-av" style="padding:0;">${window.getDefaultAvatarSVG()}</div>
      <div class="ap-lb-pod-name">${esc(e.name)}</div>
      <div class="ap-lb-pod-score">${(e[lbState.period] || 0).toLocaleString('en-IN')}<small>XP</small></div>
    </div>`).join('');

  const rest = list.slice(3);
  list3.innerHTML = rest.map((e, i) => {
    const rank = i + 4;
    return `<div class="ap-lb-item">
      <div class="ap-lb-rank">${rank}</div>
      <div class="ap-uav" style="width:32px;height:32px;font-size:.66rem;padding:0;">${window.getDefaultAvatarSVG()}</div>
      <div class="ap-lb-info"><div class="ap-lb-name">${esc(e.name)}</div><div class="ap-lb-sub">${esc(e.subject)} · ${e.accuracy}% accuracy · ${e.streak}d streak</div></div>
      <div class="ap-lb-score">${(e[lbState.period] || 0).toLocaleString('en-IN')}<small>XP</small></div>
    </div>`;
  }).join('');
}

function initLeaderboardModule() {
  document.getElementById('lbSubjectFilter').addEventListener('change', e => { lbState.subject = e.target.value; render_leaderboard(); });
  document.getElementById('lbPeriodFilter').addEventListener('change', e => { lbState.period = e.target.value; render_leaderboard(); });
}
AP_INITS.push(initLeaderboardModule);

/* ════════════════════════════════════════════
   PDF GENERATOR (using html2pdf.js)
   ════════════════════════════════════════════ */
async function generateHtmlPdf(title, contentHtml, filename, isLandscape = false) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="pdfPrintContainer" style="padding: 30px; font-family: 'Poppins', sans-serif; color: #1e293b;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${title}</h1>
      ${contentHtml}
    </div>
  `;
  document.body.appendChild(container);

  const opt = {
    margin: 0.4,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: isLandscape ? 'landscape' : 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(container.querySelector('#pdfPrintContainer')).save();
    toast('PDF exported successfully', 'success');
  } catch (err) {
    console.error('PDF generation failed:', err);
    toast('Error generating PDF', 'error');
  } finally {
    document.body.removeChild(container);
  }
}

/* ---------- Activity Log ---------- */
function exportLogPdf() {
  const list = getFilteredLog();
  if (!list.length) return toast('Nothing to export', 'info');

  toast('Building your PDF...', 'info');

  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = list.filter(l => new Date(l.time).getTime() >= weekAgo).length;
  const typeCounts = {};
  list.forEach(l => { typeCounts[l.type] = (typeCounts[l.type] || 0) + 1; });
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  const types = Object.keys(typeCounts);
  const maxCount = Math.max(...Object.values(typeCounts), 1);
  
  let barsHtml = types.map(t => `
    <div class="pdf-bar-row">
      <div class="pdf-bar-lbl">${t}</div>
      <div class="pdf-bar-track"><div class="pdf-bar-fill" style="width: ${(typeCounts[t]/maxCount)*100}%"></div></div>
      <div class="pdf-bar-val">${typeCounts[t]}</div>
    </div>
  `).join('');

  let tableRows = list.map(l => `
    <tr>
      <td>${fmtDateTime(l.time)}</td>
      <td><span class="pdf-badge bg-blue">${l.type}</span></td>
      <td style="font-weight:500;">${l.action}</td>
      <td style="color:#64748b;">${l.detail || '—'}</td>
    </tr>
  `).join('');

  const html = `
    <div class="pdf-section-title">Overview</div>
    <div class="pdf-stats-row">
      <div class="pdf-stat-card"><div class="pdf-stat-val">${list.length}</div><div class="pdf-stat-lbl">Total entries</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#16a34a">${thisWeek}</div><div class="pdf-stat-lbl">This week</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#ea580c">${topType ? topType[0] : '—'}</div><div class="pdf-stat-lbl">Most common type</div></div>
    </div>

    ${types.length ? `
    <div class="pdf-section-title">Activity Breakdown</div>
    <div class="pdf-bar-wrap">${barsHtml}</div>
    ` : ''}

    <div class="pdf-section-title">All Entries <span>${list.length}</span></div>
    <table class="pdf-table">
      <thead><tr><th style="width:130px;">Time</th><th style="width:90px;">Type</th><th>Action</th><th>Detail</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  generateHtmlPdf('Activity Log Report', html, 'interedge-activity-log.pdf');
}

/* ---------- Test History ---------- */
function exportTestHistoryPdf() {
  let list = dbGet('tests_history', []);
  if (thState.search.trim()) { const q = thState.search.trim().toLowerCase(); list = list.filter(t => t.title.toLowerCase().includes(q)); }
  if (thState.type !== 'all') list = list.filter(t => t.type === thState.type);
  if (thState.subject !== 'all') list = list.filter(t => t.subject === thState.subject);
  if (!list.length) return toast('Nothing to export', 'info');

  toast('Building your PDF...', 'info');

  const totalParticipants = list.reduce((s, t) => s + (t.participants || 0), 0);
  const scored = list.filter(t => t.avgScore != null);
  const avgScore = scored.length ? Math.round(scored.reduce((s, t) => s + t.avgScore, 0) / scored.length) : null;

  const bySubject = {};
  scored.forEach(t => { (bySubject[t.subject] = bySubject[t.subject] || []).push(t.avgScore); });
  
  let subjBars = '';
  if (Object.keys(bySubject).length) {
    subjBars = Object.keys(bySubject).map(s => {
      const avg = Math.round(bySubject[s].reduce((a, b) => a + b, 0) / bySubject[s].length);
      return `
        <div class="pdf-bar-row">
          <div class="pdf-bar-lbl">${s}</div>
          <div class="pdf-bar-track"><div class="pdf-bar-fill" style="width: ${avg}%"></div></div>
          <div class="pdf-bar-val">${avg}%</div>
        </div>
      `;
    }).join('');
  }

  let tableRows = list.map(t => {
    let typeClass = t.type==='MTP' ? 'bg-amber' : t.type==='RTP' ? 'bg-blue' : 'bg-green';
    return `
    <tr>
      <td style="font-weight:500;">${t.title}</td>
      <td><span class="pdf-badge ${typeClass}">${t.type}</span></td>
      <td>${t.subject}</td>
      <td>${fmtDate(t.date)}</td>
      <td style="text-align:right;">${t.participants.toLocaleString('en-IN')}</td>
      <td style="text-align:right; font-weight:600;">${t.avgScore != null ? t.avgScore + '%' : '—'}</td>
    </tr>
  `}).join('');

  const html = `
    <div class="pdf-section-title">Overview</div>
    <div class="pdf-stats-row">
      <div class="pdf-stat-card"><div class="pdf-stat-val">${list.length}</div><div class="pdf-stat-lbl">Total tests</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#16a34a">${totalParticipants.toLocaleString('en-IN')}</div><div class="pdf-stat-lbl">Participants</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#2563eb">${avgScore != null ? avgScore + '%' : '—'}</div><div class="pdf-stat-lbl">Avg score</div></div>
    </div>

    ${subjBars ? `
    <div class="pdf-section-title">Average Score by Subject</div>
    <div class="pdf-bar-wrap">${subjBars}</div>
    ` : ''}

    <div class="pdf-section-title">All Tests <span>${list.length}</span></div>
    <table class="pdf-table">
      <thead><tr><th>Title</th><th>Type</th><th>Subject</th><th>Date</th><th style="text-align:right;">Participants</th><th style="text-align:right;">Avg score</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  generateHtmlPdf('Test History Report', html, 'interedge-test-history.pdf');
}

/* ---------- Master Export — everything ---------- */
function exportMasterPdf() {
  const users = dbGet('users', []);
  const blog = dbGet('blog', []);
  const tests = dbGet('tests_history', []);
  const qbank = dbGet('qbank', []);
  const roles = dbGet('roles', []);
  const alog = dbGet('activitylog', []);
  const lb = dbGet('leaderboard', []);
  const notifHist = dbGet('notif_history', []);

  toast('Building your master export...', 'info');

  const lbTop = [...lb].sort((a, b) => b.allTime - a.allTime).slice(0, 10);
  
  const userRows = users.map(u => `
    <tr>
      <td style="font-weight:500">${u.name}</td>
      <td>${u.email}</td>
      <td>${u.provider}</td>
      <td style="text-align:right;font-weight:600">${u.xp.toLocaleString('en-IN')}</td>
      <td>${u.premium ? '<span class="pdf-badge bg-green">Yes</span>' : 'No'}</td>
      <td>${u.flagged ? '<span class="pdf-badge bg-red">Yes</span>' : 'No'}</td>
      <td style="text-align:right">${u.accuracy}%</td>
      <td style="text-align:right">${u.streak}d</td>
      <td>${fmtDate(u.joined)}</td>
    </tr>
  `).join('');

  const qbankRows = qbank.map(q => `
    <tr>
      <td style="white-space:nowrap;">${q.subject}</td>
      <td><span class="pdf-badge ${q.type==='mcq'?'bg-blue':'bg-amber'}">${q.type==='mcq'?'MCQ':'Direct'}</span></td>
      <td style="font-weight:500;">${q.text}</td>
      <td style="color:#16a34a; font-weight:600;">${q.type === 'mcq' ? (q.options[q.correctIndex] || '') : (q.correctAnswer || '')}</td>
    </tr>
  `).join('');

  const html = `
    <div class="pdf-section-title">Console Overview</div>
    <div class="pdf-stats-row">
      <div class="pdf-stat-card"><div class="pdf-stat-val">${users.length}</div><div class="pdf-stat-lbl">Total users</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#16a34a">${users.filter(u=>u.premium).length}</div><div class="pdf-stat-lbl">Premium users</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#ea580c">${tests.length}</div><div class="pdf-stat-lbl">Tests published</div></div>
    </div>
    <div class="pdf-stats-row">
      <div class="pdf-stat-card"><div class="pdf-stat-val">${blog.length}</div><div class="pdf-stat-lbl">Blog posts</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#2563eb">${notifHist.length}</div><div class="pdf-stat-lbl">Notifications sent</div></div>
      <div class="pdf-stat-card"><div class="pdf-stat-val" style="color:#dc2626">${users.filter(u=>u.flagged).length}</div><div class="pdf-stat-lbl">Flagged users</div></div>
    </div>

    <div class="pdf-section-title">Leaderboard — Top 10 All-Time</div>
    <table class="pdf-table">
      <thead><tr><th style="width:50px">Rank</th><th>Name</th><th>Subject</th><th style="text-align:right">All-Time XP</th><th style="text-align:right">Accuracy</th></tr></thead>
      <tbody>
        ${lbTop.map((e,i) => `<tr><td>#${i+1}</td><td style="font-weight:600">${e.name}</td><td>${e.subject}</td><td style="text-align:right">${e.allTime.toLocaleString('en-IN')}</td><td style="text-align:right">${e.accuracy}%</td></tr>`).join('')}
      </tbody>
    </table>

    <div class="html2pdf__page-break"></div>
    <div class="pdf-section-title">All Users <span>${users.length}</span></div>
    <table class="pdf-table">
      <thead><tr><th>Name</th><th>Email</th><th>Provider</th><th style="text-align:right">XP</th><th>Premium</th><th>Flagged</th><th style="text-align:right">Accuracy</th><th style="text-align:right">Streak</th><th>Joined</th></tr></thead>
      <tbody>${userRows}</tbody>
    </table>

    <div class="html2pdf__page-break"></div>
    <div class="pdf-section-title">Question Bank <span>${qbank.length}</span></div>
    <table class="pdf-table">
      <thead><tr><th style="width:120px;">Subject</th><th style="width:80px;">Type</th><th>Question</th><th style="width:200px;">Correct Answer</th></tr></thead>
      <tbody>${qbankRows}</tbody>
    </table>
  `;

  generateHtmlPdf('Master Export — All Data', html, 'interedge-master-export.pdf', true);
  logActivity('test', 'Ran a master data export', 'PDF · all datasets');
}

function initExportPdfModule() {
  const alogBtn = document.getElementById('alogExportPdfBtn');
  if (alogBtn) alogBtn.addEventListener('click', exportLogPdf);
  const thBtn = document.getElementById('thExportPdfBtn');
  if (thBtn) thBtn.addEventListener('click', exportTestHistoryPdf);
  const masterBtn = document.getElementById('masterExportBtn');
  if (masterBtn) masterBtn.addEventListener('click', () => {
    closeMoreSheet();
    toast('Building your master export…', 'info');
    setTimeout(exportMasterPdf, 50);
  });
}
AP_INITS.push(initExportPdfModule);


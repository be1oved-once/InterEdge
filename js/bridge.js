// ============================================
// PathEdge - Admin <-> Student Bridge
// Reads what the Admin Console writes to localStorage (pe_admin_*) and
// surfaces it live inside the student app: notifications + blog posts.
// Also adds the Privacy Policy / Disclaimer / Contact Us pages.
// Fully localStorage based — cross-tab sync via the native 'storage' event.
// ============================================

const ADMIN_LSP = 'pe_admin_';

function adminGet(key, fallback) {
  try {
    const raw = localStorage.getItem(ADMIN_LSP + key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}

function normaliseIso(iso) {
  if (!iso) return iso;
  if (typeof iso === 'string') {
    // If it's a SQLite timestamp like "YYYY-MM-DD HH:MM:SS" (which is UTC)
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(iso)) {
      return iso.replace(' ', 'T') + '.000Z';
    }
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(iso) && !iso.endsWith('Z') && !iso.includes('+')) {
      return iso.replace(' ', 'T') + 'Z';
    }
  }
  return iso;
}

function timeAgo(iso) {
  const then = new Date(normaliseIso(iso)).getTime();
  if (isNaN(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return min + 'm ago';
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + 'h ago';
  const day = Math.floor(hr / 24);
  if (day === 1) return '1 day ago';
  if (day < 30) return day + ' days ago';
  const mo = Math.floor(day / 30);
  if (mo === 1) return '1 month ago';
  if (mo < 12) return mo + ' months ago';
  return new Date(normaliseIso(iso)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ============================================
// NOTIFICATIONS — bridged from Admin Console
// ============================================
function getSeenNotifIds() {
  try { return JSON.parse(localStorage.getItem('pe_notif_seen') || '[]'); } catch (e) { return []; }
}
function saveSeenNotifIds(ids) {
  try { localStorage.setItem('pe_notif_seen', JSON.stringify(ids)); } catch (e) {}
}

async function getStudentNotifications() {
  let merged = [];
  const localActive = adminGet('notif_active', null);
  if (localActive && Array.isArray(localActive) && localActive.length > 0) {
    merged = localActive;
  } else if (window.API && window.API.getNotifications) {
    merged = await window.API.getNotifications();
  }

  const user = AppState.user || {};
  // Collect all identifiers the student can be addressed by
  const userEmail    = (user.email    || '').toLowerCase().trim();
  const userUsername = (user.username || '').toLowerCase().trim();

  const filtered = merged.filter(n => {
    const t = (n.type || 'all').toLowerCase().trim();
    if (t === 'all') return true;
    // Exact match against email or username (the admin types one of these into the "recipient" field)
    if (userEmail    && t === userEmail)    return true;
    if (userUsername && t === userUsername) return true;
    return false;
  });
  
  // Newest first — use publish_at for scheduled ones, created_at otherwise
  filtered.sort((a, b) => {
    const ta = new Date(normaliseIso(a.publish_at || a.created_at)).getTime();
    const tb = new Date(normaliseIso(b.publish_at || b.created_at)).getTime();
    return tb - ta;
  });
  return filtered;
}

async function renderNotifications() {
  const body = document.getElementById('notifBody');
  if (!body) return;
  const list = await getStudentNotifications();
  const seen = getSeenNotifIds();

  AppState.hasUnread = list.some(n => seen.indexOf(n.id) === -1);
  if (window.updateBellDot) updateBellDot();

  if (!list.length) {
    body.innerHTML = '<div class="notif-empty" style="padding:40px 20px;text-align:center;color:var(--txt3);font-size:.85rem;">No notifications yet</div>';
    return;
  }

  body.innerHTML = list.map(n => {
    const isUnread = seen.indexOf(n.id) === -1;
    const timeStr = n.publish_at || n.created_at;
    const titleStr = n.title ? `<strong>${escapeHtml(n.title)}</strong><br/>` : '';
    return `<div class="notif-item">
      <div class="notif-dot ${isUnread ? 'blue' : 'gray'}"></div>
      <div>
        <div class="notif-text">${titleStr}${escapeHtml(n.message || '')}</div>
        <div class="notif-time">${timeAgo(timeStr)}</div>
      </div>
    </div>`;
  }).join('');
}

// Override markAllRead (app.js defines a basic version) so read-state persists.
async function markAllRead() {
  const list = await getStudentNotifications();
  saveSeenNotifIds(list.map(n => n.id));
  AppState.hasUnread = false;
  if (window.updateBellDot) updateBellDot();
  renderNotifications();
  showToast('All notifications marked as read');
}

// Refresh the bell + list whenever the bell is opened
document.addEventListener('click', function(e) {
  const bell = e.target.closest('#bellBtn');
  if (bell) renderNotifications();
});

// ============================================
// BLOGS OVERLAY — list + read, sourced from Admin Console
// ============================================
let blogsView = { mode: 'list', activeId: null };

function formatBlogDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function blogCardHtml(p) {
  const media = p.featImg
    ? `<img src="${p.featImg}" alt="">`
    : `<div class="blog-card-ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>`;
  return `<div class="blog-card" onclick="openBlogPost('${p.id}')">
    <div class="blog-card-media">${media}</div>
    <div class="blog-card-body">
      <div class="blog-card-cat">${escapeHtml(p.category || 'General')}</div>
      <div class="blog-card-title">${escapeHtml(p.title || 'Untitled')}</div>
      <div class="blog-card-excerpt">${escapeHtml(p.excerpt || '')}</div>
      <div class="blog-card-meta">${formatBlogDate(p.date)}</div>
    </div>
  </div>`;
}

function renderBlogs() {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  const posts = adminGet('blog', [])
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let headTitle = 'Blogs';
  let backHandler = "closeProfileOverlay('blogs')";
  let bodyHtml;

  if (blogsView.mode === 'detail' && blogsView.activeId) {
    const post = posts.find(p => p.id === blogsView.activeId);
    if (!post) { blogsView.mode = 'list'; blogsView.activeId = null; }
  }

  if (blogsView.mode === 'detail' && blogsView.activeId) {
    const post = posts.find(p => p.id === blogsView.activeId);
    headTitle = '';
    backHandler = 'backFromBlogs()';
    bodyHtml = `
      <div class="blog-detail">
        ${post.featImg ? `<img src="${post.featImg}" class="blog-detail-img" alt="">` : ''}
        <div class="blog-detail-cat">${escapeHtml(post.category || 'General')}</div>
        <h1 class="blog-detail-title">${escapeHtml(post.title || 'Untitled')}</h1>
        <div class="blog-detail-meta">${formatBlogDate(post.date)}${post.words ? ' &bull; ' + post.words + ' words' : ''}</div>
        <div class="blog-detail-body">${post.html || ''}</div>
      </div>`;
  } else {
    bodyHtml = posts.length
      ? `<div class="blog-grid">${posts.map(blogCardHtml).join('')}</div>`
      : `<div class="bm-empty" style="padding:50px 20px;text-align:center;color:var(--txt3);">No blogs published yet — check back soon!</div>`;
  }

  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-blogs">
      <div class="fs-head">
        <button class="back-btn" onclick="${backHandler}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">${headTitle}</h2>
      </div>
      <div class="fs-content">${bodyHtml}</div>
    </div>`;

  setTimeout(() => { document.getElementById('fs-blogs')?.classList.add('open'); }, 10);
}

function openBlogPost(id) {
  blogsView.mode = 'detail';
  blogsView.activeId = id;
  renderBlogs();
  document.querySelector('#fs-blogs .fs-content')?.scrollTo(0, 0);
}

function backFromBlogs() {
  blogsView.mode = 'list';
  blogsView.activeId = null;
  renderBlogs();
}

// Reset to list view whenever Blogs is opened fresh from the Profile menu
(function() {
  const original = window.openProfileOverlay;
  window.openProfileOverlay = function(name) {
    if (name === 'blogs') { blogsView.mode = 'list'; blogsView.activeId = null; }
    if (original) original(name);
  };
})();

// ============================================
// PRIVACY POLICY / DISCLAIMER / CONTACT US
// ============================================
function legalOverlayShell(name, title, bodyHtml) {
  const overlay = document.getElementById('fs-overlays');
  if (!overlay) return;
  overlay.innerHTML = `
    <div class="fs-overlay" id="fs-${name}">
      <div class="fs-head">
        <button class="back-btn" onclick="closeProfileOverlay('${name}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 style="font-size:1.1rem;font-weight:700;">${title}</h2>
      </div>
      <div class="fs-content">${bodyHtml}</div>
    </div>`;
  setTimeout(() => { document.getElementById('fs-' + name)?.classList.add('open'); }, 10);
}

function renderPrivacyPolicy() {
  legalOverlayShell('privacyPolicy', 'Privacy Policy', `
    <div class="legal-content">
      <div class="legal-updated">Last updated: June 2026</div>

      <h3>1. Overview</h3>
      <p>PathEdge is built to run entirely on your device. There is no backend server for your exam-prep data — everything you see (your profile, XP, bookmarks, quiz history, settings) is stored locally in your browser's storage and never leaves your device unless you choose to export it.</p>

      <h3>2. Information We Collect</h3>
      <p>We don't collect or transmit personal data to any server. The only information PathEdge stores is what you enter yourself — name, course details, quiz answers, bookmarks and preferences — and it stays in your browser's local storage.</p>

      <h3>3. Notifications, Tests &amp; Blogs</h3>
      <p>Announcements, scheduled tests and blog posts you see inside the app are published by the PathEdge admin and read directly from local storage on the same device/browser — no network request is made to fetch them.</p>

      <h3>4. Cookies &amp; Local Storage</h3>
      <p>PathEdge uses your browser's local storage (not cookies) purely to remember your progress between visits. Clearing your browser data will reset the app.</p>

      <h3>5. Children's Privacy</h3>
      <p>PathEdge is an exam-prep tool for CA Foundation students and does not knowingly target or collect data from children under 13.</p>

      <h3>6. Changes to this Policy</h3>
      <p>If this policy changes, the updated version will be reflected here with a new "Last updated" date.</p>

      <h3>7. Contact</h3>
      <p>Questions about this policy? Reach out via the Contact Us page in Settings.</p>
    </div>
  `);
}

function renderDisclaimer() {
  legalOverlayShell('disclaimer', 'Disclaimer', `
    <div class="legal-content">
      <div class="legal-updated">Last updated: June 2026</div>

      <h3>Educational Use Only</h3>
      <p>PathEdge is an independent, self-built study companion for CA Foundation aspirants. It is <strong>not affiliated with, endorsed by, or connected to ICAI</strong> (The Institute of Chartered Accountants of India) in any official capacity.</p>

      <h3>Accuracy of Content</h3>
      <p>Questions, explanations, RTPs/MTPs and other material are prepared with care, but may contain errors or become outdated as syllabi change. Always cross-check important concepts against official ICAI study material before your exam.</p>

      <h3>No Guarantee of Results</h3>
      <p>Practicing on PathEdge does not guarantee any particular score or outcome in your CA Foundation exam. It's meant to supplement, not replace, structured study.</p>

      <h3>Live Tests &amp; Notifications</h3>
      <p>Mock tests, schedules and announcements are created by the PathEdge admin for practice purposes only and do not represent official exam dates, papers or results.</p>

      <h3>Use at Your Own Discretion</h3>
      <p>By using this app, you agree that PathEdge and its creator are not liable for any decisions made based on its content.</p>
    </div>
  `);
}


// ============================================
// CROSS-TAB SYNC — instant updates when the Admin Console
// (open in another tab/window of the same browser) writes to localStorage.
// ============================================
window.addEventListener('storage', function(e) {
  if (!e.key) return;
  if (e.key === ADMIN_LSP + 'notif_active' || e.key === ADMIN_LSP + 'notif_history') {
    renderNotifications();
  }
  if (e.key === ADMIN_LSP + 'blog') {
    if (document.getElementById('fs-blogs')) renderBlogs();
  }
  if (e.key === ADMIN_LSP + 'tests_history') {
    if (window.refreshTestsIfOpen) refreshTestsIfOpen();
  }
});

// Fallback poll (covers same-tab admin iframes, or browsers with flaky storage events)
setInterval(function() {
  renderNotifications();
  if (window.refreshTestsIfOpen) refreshTestsIfOpen();
}, 8000);

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    renderNotifications();
    if (window.refreshTestsIfOpen) refreshTestsIfOpen();
  }, 1000);
});

// ===== EXPORTS =====
window.adminGet = adminGet;
window.renderNotifications = renderNotifications;
window.markAllRead = markAllRead;
window.renderBlogs = renderBlogs;
window.openBlogPost = openBlogPost;
window.backFromBlogs = backFromBlogs;
window.renderPrivacyPolicy = renderPrivacyPolicy;
window.renderPrivacyPolicy = renderPrivacyPolicy;
window.renderDisclaimer = renderDisclaimer;

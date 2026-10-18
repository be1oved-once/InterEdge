// ============================================
// InterEdge - LocalStorage & Dummy API Layer
// Completely self-contained, no external servers
// ============================================

const API_BASE_URL = '';

let _avatarSvgCounter = 0;
window.getDefaultAvatarSVG = function() {
  const uid = 'av' + (++_avatarSvgCounter);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" style="border-radius:inherit;overflow:hidden;display:block;"><defs><linearGradient id="ag_${uid}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B5CF6"/><stop offset="100%" stop-color="#4F46E5"/></linearGradient><filter id="sh_${uid}" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/></filter></defs><rect width="100" height="100" fill="url(#ag_${uid})"/><g fill="#ffffff" filter="url(#sh_${uid})"><circle cx="50" cy="38" r="18"/><path d="M50 62 c -18 0 -30 12 -30 25 v 13 h 60 v -13 c 0 -13 -12 -25 -30 -25 z"/></g></svg>`;
};
Object.defineProperty(window, 'DEFAULT_AVATAR_SVG', { get: () => window.getDefaultAvatarSVG() });

// Helpers for localStorage user store
function _getLocalUsers() {
  try {
    const raw = localStorage.getItem('pe_local_users');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function _saveLocalUsers(users) {
  try {
    localStorage.setItem('pe_local_users', JSON.stringify(users));
  } catch (e) {}
}

const API = {
  async getUserByUsername(username) {
    if (!username) return null;
    const clean = username.trim().toLowerCase();
    
    // Check local storage users
    const users = _getLocalUsers();
    const found = users.find(u => (u.username || '').toLowerCase() === clean);
    if (found) return found;

    // Check active user
    try {
      const active = JSON.parse(localStorage.getItem('pe_user') || '{}');
      if ((active.username || '').toLowerCase() === clean) return active;
    } catch(e) {}

    // Check seeded admin users
    try {
      const adminUsers = JSON.parse(localStorage.getItem('pe_admin_users') || '[]');
      const inAdmin = adminUsers.find(u => ((u.username || u.name || '').toLowerCase() === clean));
      if (inAdmin) return inAdmin;
    } catch(e) {}

    return null;
  },

  async getUserByEmail(email) {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    
    // Check local storage users
    const users = _getLocalUsers();
    const found = users.find(u => (u.email || '').toLowerCase() === clean);
    if (found) return found;

    // Check active user
    try {
      const active = JSON.parse(localStorage.getItem('pe_user') || '{}');
      if ((active.email || '').toLowerCase() === clean) return active;
    } catch(e) {}

    // Check seeded admin users
    try {
      const adminUsers = JSON.parse(localStorage.getItem('pe_admin_users') || '[]');
      const inAdmin = adminUsers.find(u => ((u.email || '').toLowerCase() === clean));
      if (inAdmin) return inAdmin;
    } catch(e) {}

    return null;
  },

  async saveUser(userData) {
    if (!userData) return null;
    const users = _getLocalUsers();
    const email = (userData.email || '').trim().toLowerCase();
    const username = (userData.username || '').trim().toLowerCase();

    let idx = users.findIndex(u => 
      (email && (u.email || '').toLowerCase() === email) || 
      (username && (u.username || '').toLowerCase() === username) ||
      (userData.id && u.id === userData.id)
    );

    const merged = idx !== -1 ? Object.assign({}, users[idx], userData) : Object.assign({ id: 'u_' + Date.now() }, userData);
    
    if (idx !== -1) {
      users[idx] = merged;
    } else {
      users.push(merged);
    }
    _saveLocalUsers(users);

    // Also update pe_admin_users if present
    try {
      const adminUsers = JSON.parse(localStorage.getItem('pe_admin_users') || '[]');
      let aIdx = adminUsers.findIndex(u => (email && (u.email || '').toLowerCase() === email) || (u.id === merged.id));
      if (aIdx !== -1) {
        adminUsers[aIdx] = Object.assign({}, adminUsers[aIdx], merged);
        localStorage.setItem('pe_admin_users', JSON.stringify(adminUsers));
      }
    } catch(e) {}

    return merged;
  },

  async updateUserEmail(oldEmail, newEmail) {
    if (!oldEmail || !newEmail) return { success: false, error: 'Invalid emails' };
    const users = _getLocalUsers();
    const found = users.find(u => (u.email || '').toLowerCase() === oldEmail.toLowerCase());
    if (found) {
      found.email = newEmail;
      _saveLocalUsers(users);
    }
    return { success: true };
  },

  async getLeaderboard() {
    try {
      const saved = localStorage.getItem('pe_admin_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Return dummy leaderboard data
    return [
      { id: '1', name: 'Priya Sharma', today: 180, week: 920, month: 3100, allTime: 8400, accuracy: 94, streak: 28 },
      { id: '2', name: 'Rahul Mehta', today: 150, week: 860, month: 2950, allTime: 7850, accuracy: 91, streak: 21 },
      { id: '3', name: 'Ananya Kapoor', today: 140, week: 810, month: 2700, allTime: 7300, accuracy: 89, streak: 19 },
      { id: '4', name: 'Virat Singh', today: 120, week: 750, month: 2500, allTime: 6900, accuracy: 88, streak: 15 },
      { id: '5', name: 'Sneha Patel', today: 110, week: 700, month: 2350, allTime: 6400, accuracy: 86, streak: 14 }
    ];
  },

  async getNotifications() {
    try {
      const active = localStorage.getItem('pe_admin_notif_active');
      if (active) return JSON.parse(active);
    } catch (e) {}

    return [
      { id: 'n1', type: 'all', message: 'Welcome to InterEdge Trial Mode! Practice MCQs, test your skills, and track progress locally.', created_at: new Date().toISOString() },
      { id: 'n2', type: 'all', message: 'Daily Study Streak reminder: Complete at least one quiz today to keep your streak alive 🔥', created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 'n3', type: 'all', message: 'New Chapter Tests available for Business Economics and Maths.', created_at: new Date(Date.now() - 86400000).toISOString() }
    ];
  },

  async getCloudinarySignature(publicId, folder = null) {
    return {
      signature: 'local_trial_sig',
      api_key: 'local_trial_key',
      timestamp: Math.round(Date.now() / 1000),
      folder: folder || ''
    };
  },

  async submitContactForm(formData) {
    try {
      const submissions = JSON.parse(localStorage.getItem('pe_contact_submissions') || '[]');
      submissions.push(Object.assign({ id: 'c_' + Date.now(), time: new Date().toISOString() }, formData));
      localStorage.setItem('pe_contact_submissions', JSON.stringify(submissions));
    } catch (e) {}
    return { success: true };
  },

  async getBookmarks(email) {
    const key = 'pe_bookmarks_' + (email || 'guest').replace(/[^a-zA-Z0-9]/g, '_');
    try {
      const bms = localStorage.getItem(key);
      if (bms) return JSON.parse(bms);
    } catch (e) {}
    return [];
  },

  async saveBookmark(email, bookmarkData) {
    const key = 'pe_bookmarks_' + (email || 'guest').replace(/[^a-zA-Z0-9]/g, '_');
    try {
      let bms = JSON.parse(localStorage.getItem(key) || '[]');
      const bId = bookmarkData.key || bookmarkData.id;
      const existingIdx = bms.findIndex(b => (b.key || b.id) === bId);
      if (existingIdx !== -1) {
        bms[existingIdx] = bookmarkData;
      } else {
        bms.push(bookmarkData);
      }
      localStorage.setItem(key, JSON.stringify(bms));
      return bookmarkData;
    } catch (e) {
      return null;
    }
  },

  async deleteBookmark(email, bookmarkKey) {
    const key = 'pe_bookmarks_' + (email || 'guest').replace(/[^a-zA-Z0-9]/g, '_');
    try {
      let bms = JSON.parse(localStorage.getItem(key) || '[]');
      bms = bms.filter(b => (b.key || b.id) !== bookmarkKey);
      localStorage.setItem(key, JSON.stringify(bms));
      return { success: true };
    } catch (e) {
      return null;
    }
  }
};

window.API = API;

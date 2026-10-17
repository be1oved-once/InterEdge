// ============================================
// InterEdge - Authentication System (LocalStorage & Trial Mode)
// Completely local, no external servers
// ============================================

// ===== DEFAULT SETTINGS =====
const DEFAULT_SETTINGS = {
  soundEffects: true,
  theme: 'dark',
  autoNext: true,
  timerEnabled: true,
  timerDuration: 30,
  fullscreen: false,
  optionLabelEnabled: true,
  optionLabelStyle: 'ABCD',
  negativeMarking: true,
  negativeMark: 0.25,
  pushNotifications: true,
  autoSync: true,
  studyReminders: true,
  quizStyle: 'standard',
  denseCount: 5
};

function generateUpcomingAttempts() {
  const d = new Date();
  let y = d.getFullYear();
  let m = d.getMonth() + 1;
  let currentMonthIndex;
  
  if (m >= 9) {
    currentMonthIndex = 0; // Jan next year
    y++;
  } else if (m >= 5) {
    currentMonthIndex = 2; // Sept this year
  } else {
    currentMonthIndex = 1; // May this year
  }
  
  const attempts = [];
  const months = ['Jan', 'May', 'Sept'];
  for (let i = 0; i < 10; i++) {
    attempts.push(months[currentMonthIndex] + ' ' + y);
    currentMonthIndex++;
    if (currentMonthIndex > 2) { currentMonthIndex = 0; y++; }
  }
  return attempts;
}

function getNextThreeAttempts(current) {
  const allAttempts = generateUpcomingAttempts();
  const idx = allAttempts.indexOf(current);
  if (idx === -1) return [current, allAttempts[0], allAttempts[1]];
  return allAttempts.slice(Math.max(0, idx), Math.min(allAttempts.length, idx + 4));
}

function loadPersistedSettings() {
  try {
    const saved = localStorage.getItem('pe_settings');
    if (saved) return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved));
  } catch(e) {}
  return Object.assign({}, DEFAULT_SETTINGS);
}

function saveSettings() {
  try {
    localStorage.setItem('pe_settings', JSON.stringify(AppState.settings));
    if (AppState.isLoggedIn && !AppState.isGuest && window.API && AppState.user && AppState.user.email) {
      window.API.saveUser({
        id: AppState.user.id,
        email: AppState.user.email,
        settings: AppState.settings
      });
    }
  } catch(e) {}
}

const DEFAULT_USER = {
  id: 'usr_trial',
  firstName: 'Trial Student',
  username: 'student',
  email: 'student@interedge.app',
  phone: '',
  course: 'CA Intermediate',
  attempt: generateUpcomingAttempts()[0],
  avatar: null,
  initials: 'TS',
  provider: 'local'
};

function loadPersistedUser() {
  try {
    const saved = localStorage.getItem('pe_user');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return null;
}

function saveUser() {
  try {
    localStorage.setItem('pe_user', JSON.stringify(AppState.user));
    if (window.API && AppState.isLoggedIn && !AppState.isGuest) {
      window.API.saveUser({
        id: AppState.user.id,
        username: AppState.user.username,
        email: AppState.user.email,
        first_name: AppState.user.firstName,
        phone: AppState.user.phone,
        course: AppState.user.course,
        attempt: AppState.user.attempt,
        avatar: AppState.user.avatar,
        xp: AppState.xp,
        streak: AppState.streak,
        rank: AppState.rank,
        last_xp_date: AppState.last_xp_date,
        qs_attempted: AppState.questionsAttempted,
        correct_answers: AppState.correctAnswers,
        streak_goal: AppState.streakGoal,
        settings: AppState.settings
      });
    }
  } catch(e) {}
}

const AppState = {
  isLoggedIn: localStorage.getItem('pe_loggedIn') === 'true',
  isGuest: localStorage.getItem('pe_isGuest') === 'true',
  user: Object.assign({}, DEFAULT_USER, loadPersistedUser()),
  streak: 0,
  xp: 0,
  rank: 1,
  last_xp_date: '',
  questionsAttempted: 0,
  correctAnswers: 0,
  accuracy: 0,
  settings: loadPersistedSettings(),
  streakGoal: 7,
  hasUnread: true
};

window.AppState = AppState;

const SPLASH_DURATION = 1200;
const FADE_DURATION = 400;

async function initSplash() {
  window._splashStartTime = Date.now();

  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.style.display = 'flex';
    splash.style.opacity = '1';
    splash.style.visibility = 'visible';
  }

  if (window.applyTheme) {
    window.applyTheme(AppState.settings.theme || 'dark');
  }

  let path = window.location.pathname.replace(/^\/+/g, '').replace(/\/+$/g, '').trim();
  if (path.includes('/')) {
    const parts = path.split('/');
    path = parts[parts.length - 1];
  }

  // Check login state from localStorage
  const isLoggedInLocally = localStorage.getItem('pe_loggedIn') === 'true';
  const isGuest = localStorage.getItem('pe_isGuest') === 'true';

  if (isLoggedInLocally) {
    AppState.isLoggedIn = true;
    AppState.isGuest = isGuest;
    const persisted = loadPersistedUser();
    if (persisted) {
      AppState.user = Object.assign({}, DEFAULT_USER, persisted);
      AppState.xp = persisted.xp || 0;
      AppState.streak = persisted.streak || 0;
      AppState.rank = persisted.rank || 1;
      AppState.last_xp_date = persisted.last_xp_date || '';
      AppState.questionsAttempted = persisted.qs_attempted || 0;
      AppState.correctAnswers = persisted.correct_answers || 0;
      AppState.accuracy = AppState.questionsAttempted > 0 ? Math.round((AppState.correctAnswers / AppState.questionsAttempted) * 100) : 0;
      AppState.streakGoal = persisted.streak_goal || 7;
    }
  }

  const elapsed = Date.now() - (window._splashStartTime || Date.now());
  const remaining = Math.max(0, SPLASH_DURATION - elapsed);

  setTimeout(() => {
    if (!splash) return;
    splash.style.transition = `opacity ${FADE_DURATION}ms ease`;
    splash.style.opacity = '0';

    setTimeout(() => {
      splash.style.display = 'none';
      splash.style.visibility = 'hidden';

      if (isLoggedInLocally) {
        AppState.isLoggedIn = true;
        AppState.isGuest = isGuest;
        const appScreen = document.getElementById('app-screen');
        if (appScreen) appScreen.style.display = 'flex';

        const landing = document.getElementById('landing-screen');
        if (landing) landing.style.display = 'none';
        document.body.classList.remove('landing-open');

        let targetRoute = path;
        if (!targetRoute || targetRoute === 'verified' || targetRoute === 'index.html' || targetRoute.toLowerCase() === 'interedge') {
          targetRoute = 'home';
        }
        if (window.Router) {
          Router.navigate(targetRoute);
        }
      } else {
        if (typeof showLandingPage === 'function') {
          showLandingPage();
        } else {
          showAuthScreen();
        }
      }
    }, FADE_DURATION);
  }, remaining);
}

function showAuthScreen() {
  const landing = document.getElementById('landing-screen');
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  if (landing) landing.style.display = 'none';
  if (authScreen) {
    authScreen.style.display = 'flex';
    authScreen.style.animation = 'authSlideIn 0.4s cubic-bezier(.22,1,.36,1)';
  }
  if (appScreen) appScreen.style.display = 'none';
  resetForms();
}

function resetForms() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  if (loginForm) loginForm.style.display = 'block';
  if (signupForm) signupForm.style.display = 'none';
  ['login-email','login-password','signup-username','signup-email','signup-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function showSignup() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  if (loginForm) { loginForm.style.animation = 'none'; loginForm.style.display = 'none'; }
  if (signupForm) { signupForm.style.display = 'block'; signupForm.style.animation = 'authSlideIn 0.3s cubic-bezier(.22,1,.36,1)'; }
}

function showLogin() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  if (signupForm) { signupForm.style.animation = 'none'; signupForm.style.display = 'none'; }
  if (loginForm) { loginForm.style.display = 'block'; loginForm.style.animation = 'authSlideIn 0.3s cubic-bezier(.22,1,.36,1)'; }
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isVisible = input.type === 'text';
  input.type = isVisible ? 'password' : 'text';
  btn.innerHTML = isVisible
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
}

async function handleLogin() {
  const identifier = document.getElementById('login-email')?.value.trim() || '';
  const password = document.getElementById('login-password')?.value.trim() || '';
  
  if (!identifier) { showToast('Please enter your email or username'); return; }
  if (!password) { showToast('Please enter your password'); return; }
  
  const loginBtn = document.querySelector('#login-form .auth-btn-primary');
  const originalText = loginBtn ? loginBtn.innerHTML : 'Sign In';
  if (loginBtn) { loginBtn.innerHTML = 'Signing in...'; loginBtn.disabled = true; }

  try {
    // Check if user exists in local storage
    let existingUser = null;
    if (identifier.includes('@')) {
      existingUser = await window.API.getUserByEmail(identifier);
    } else {
      existingUser = await window.API.getUserByUsername(identifier);
    }

    // If existing user with saved password check
    if (existingUser && existingUser.password && existingUser.password !== password) {
      showToast('Incorrect password');
      if (loginBtn) { loginBtn.innerHTML = originalText; loginBtn.disabled = false; }
      return;
    }

    let finalUser = existingUser;
    if (!finalUser) {
      // First time trial user - auto register
      const isEmail = identifier.includes('@');
      const email = isEmail ? identifier : `${identifier}@interedge.app`;
      const username = isEmail ? identifier.split('@')[0] : identifier;
      const firstName = username.charAt(0).toUpperCase() + username.slice(1);

      finalUser = await window.API.saveUser({
        id: 'u_' + Date.now(),
        email: email,
        username: username,
        password: password,
        first_name: firstName,
        course: 'CA Intermediate',
        attempt: generateUpcomingAttempts()[0],
        avatar: null,
        xp: 0,
        streak: 1,
        rank: 1,
        last_xp_date: new Date().toISOString().split('T')[0],
        provider: 'local'
      });
    }

    // Set app state
    AppState.isLoggedIn = true;
    AppState.isGuest = false;
    AppState.user.id = finalUser.id;
    AppState.user.email = finalUser.email;
    AppState.user.username = finalUser.username;
    AppState.user.firstName = finalUser.first_name || finalUser.username;
    AppState.user.phone = finalUser.phone || '';
    AppState.user.course = finalUser.course || 'CA Intermediate';
    AppState.user.attempt = finalUser.attempt || generateUpcomingAttempts()[0];
    AppState.user.avatar = finalUser.avatar || null;
    AppState.user.initials = (finalUser.first_name?.[0] || finalUser.username?.[0] || 'U').toUpperCase();
    AppState.user.provider = finalUser.provider || 'local';
    AppState.xp = finalUser.xp || 0;
    AppState.streak = finalUser.streak || 1;
    AppState.rank = finalUser.rank || 1;
    AppState.last_xp_date = finalUser.last_xp_date || '';
    AppState.questionsAttempted = finalUser.qs_attempted || 0;
    AppState.correctAnswers = finalUser.correct_answers || 0;
    AppState.accuracy = AppState.questionsAttempted > 0 ? Math.round((AppState.correctAnswers / AppState.questionsAttempted) * 100) : 0;
    AppState.streakGoal = finalUser.streak_goal || 7;

    saveUser();
    completeLogin(false);
  } catch (error) {
    console.error('[Login error]:', error);
    showToast('Failed to sign in. Please try again.');
  } finally {
    if (loginBtn) { loginBtn.innerHTML = originalText; loginBtn.disabled = false; }
  }
}

async function handleSignup() {
  const username = document.getElementById('signup-username')?.value.trim() || '';
  const email = document.getElementById('signup-email')?.value.trim() || '';
  const password = document.getElementById('signup-password')?.value.trim() || '';
  
  if (!username) { showToast('Please enter a username'); return; }
  if (!email) { showToast('Please enter your email'); return; }
  if (!password) { showToast('Please enter a password'); return; }
  if (password.length < 4) { showToast('Password must be at least 4 characters'); return; }
  
  const signupBtn = document.querySelector('#signup-form .auth-btn-primary');
  const originalText = signupBtn ? signupBtn.innerHTML : 'Sign Up';
  if (signupBtn) { signupBtn.innerHTML = 'Creating account...'; signupBtn.disabled = true; }

  try {
    const existing = await window.API.getUserByUsername(username);
    if (existing) {
      showToast('Username already taken');
      if (signupBtn) { signupBtn.innerHTML = originalText; signupBtn.disabled = false; }
      return;
    }

    const newUser = await window.API.saveUser({
      id: 'u_' + Date.now(),
      email: email,
      username: username,
      password: password,
      first_name: username.charAt(0).toUpperCase() + username.slice(1),
      course: 'CA Intermediate',
      attempt: 'May 2027',
      avatar: null,
      xp: 50,
      streak: 1,
      rank: 12,
      last_xp_date: new Date().toISOString().split('T')[0],
      provider: 'local'
    });

    // Populate pending state for 4-digit OTP overlay
    window.pendingVerificationEmail = email;
    window.pendingVerificationUser = newUser;
    window.pendingVerificationType = 'signup';

    const titleEl = document.getElementById('verification-title');
    const subEl = document.getElementById('verification-subtitle');
    if (titleEl) titleEl.textContent = 'Account Verification';
    if (subEl) subEl.textContent = "Trial Mode: Enter any 4-digit code (e.g. 1234) to activate your InterEdge account.";

    // Pre-fill dummy OTP boxes (4 digits)
    const otpBoxes = document.querySelectorAll('.otp-box');
    const demoCode = '1234';
    otpBoxes.forEach((b, i) => { b.value = demoCode[i] || ''; });

    const verifOverlay = document.getElementById('verification-overlay');
    if (verifOverlay) {
      verifOverlay.style.display = 'flex';
      setTimeout(() => verifOverlay.classList.add('open'), 10);
    }
  } catch (error) {
    console.error('[Signup error]:', error);
    showToast('Failed to create account.');
  } finally {
    if (signupBtn) { signupBtn.innerHTML = originalText; signupBtn.disabled = false; }
  }
}

async function handleGoogleAuth() {
  // 1-Click Trial Google Auth simulation
  const googleUser = {
    id: 'u_google_' + Date.now(),
    email: 'google.student@interedge.app',
    username: 'GoogleStudent',
    first_name: 'Google User',
    course: 'CA Intermediate',
    attempt: 'May 2027',
    avatar: null,
    xp: 100,
    streak: 1,
    rank: 12,
    last_xp_date: new Date().toISOString().split('T')[0],
    provider: 'google'
  };

  await window.API.saveUser(googleUser);

  AppState.isLoggedIn = true;
  AppState.isGuest = false;
  AppState.user = Object.assign({}, DEFAULT_USER, googleUser);
  AppState.user.initials = 'GU';
  AppState.xp = 100;
  AppState.streak = 1;

  saveUser();
  const isNew = !localStorage.getItem('pe_onboarding_done');
  completeLogin(false, isNew);
  showToast('Signed in with Google');
}

function handleGuestLogin() {
  AppState.isGuest = true;
  AppState.user.firstName = 'Guest';
  AppState.user.username = 'guest';
  AppState.user.email = 'guest@interedge.app';
  AppState.user.initials = 'GU';
  AppState.user.provider = 'guest';
  AppState.xp = 0;
  AppState.streak = 0;
  saveUser();
  completeLogin(true, false);
}

function completeLogin(isGuest, isNewUser) {
  AppState.isLoggedIn = true;
  AppState.isGuest = isGuest;

  localStorage.setItem('pe_loggedIn', 'true');
  localStorage.setItem('pe_isGuest', isGuest ? 'true' : 'false');

  const landingScreen = document.getElementById('landing-screen');
  if (landingScreen) {
    landingScreen.style.display = 'none';
  }

  const splash = document.getElementById('splash-screen');
  if (splash && splash.style.display !== 'none') {
    splash.style.transition = `opacity ${FADE_DURATION}ms ease`;
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      splash.style.visibility = 'hidden';
    }, FADE_DURATION);
  }

  const authScreen = document.getElementById('auth-screen');
  if (authScreen) {
    authScreen.style.transition = 'opacity 0.3s ease';
    authScreen.style.opacity = '0';
    setTimeout(() => {
      authScreen.style.display = 'none';
      authScreen.style.opacity = '1';
      const appScreen = document.getElementById('app-screen');
      if (appScreen) appScreen.style.display = 'flex';
      
      const onboardingDone = localStorage.getItem('pe_onboarding_done') === 'true';
      if (!isGuest && (!onboardingDone || isNewUser)) {
        startOnboardingTour();
      } else {
        Router.navigate('home');
      }
    }, 300);
  } else {
    const appScreen = document.getElementById('app-screen');
    if (appScreen) appScreen.style.display = 'flex';
    const onboardingDone = localStorage.getItem('pe_onboarding_done') === 'true';
    if (!isGuest && (!onboardingDone || isNewUser)) {
      startOnboardingTour();
    } else {
      Router.navigate('home');
    }
  }
  showToast(isGuest ? 'Welcome, Guest!' : `Welcome, ${AppState.user.firstName || AppState.user.username}!`);
}

async function handleSignout() {
  AppState.isLoggedIn = false;
  AppState.isGuest = false;

  localStorage.removeItem('pe_loggedIn');
  localStorage.removeItem('pe_isGuest');

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }

  AppState.user = Object.assign({}, DEFAULT_USER);
  AppState.xp = 0;
  AppState.streak = 0;
  AppState.rank = 0;
  
  Router.closeAllOverlays();

  const appScreen = document.getElementById('app-screen');
  if (appScreen) appScreen.style.display = 'none';
  window.history.pushState({}, '', '/');
  if (typeof showLandingPage === 'function') {
    showLandingPage();
  } else {
    showAuthScreen();
  }
  showToast('Signed out successfully');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function liveXpBarHtml() {
  return `<div class="live-xp-bar">
    <img src="img/logo.png" alt="XP" style="width:16px; height:16px; border-radius:3px; object-fit:contain;">
    <span class="live-xp-label">Live XP</span>
    <span class="live-xp-val" data-xp-display>${AppState.xp.toLocaleString()}</span>
  </div>`;
}

function updateStreakLogic() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  if (!AppState.last_xp_date) {
    AppState.streak = Math.max(1, AppState.streak);
  } else {
    const lastDate = new Date(AppState.last_xp_date + "T00:00:00");
    const currDate = new Date(today + "T00:00:00");
    const diffTime = Math.abs(currDate - lastDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1 || diffDays === 2) {
      AppState.streak += 1;
    } else if (diffDays > 2) {
      AppState.streak = 1;
    }
  }
  AppState.last_xp_date = today;
}

function awardXP(amount) {
  if (!amount) return;
  AppState.xp = Math.max(0, AppState.xp + amount);
  updateStreakLogic();
  saveUser();
  bumpLiveXp(amount);
}

function bumpLiveXp(delta) {
  document.querySelectorAll('[data-xp-display]').forEach(el => {
    el.textContent = AppState.xp.toLocaleString();
  });
  if (delta > 0) {
    document.querySelectorAll('.live-xp-bar').forEach(badge => {
      badge.classList.remove('xp-pulse');
      void badge.offsetWidth;
      badge.classList.add('xp-pulse');
      const pop = document.createElement('span');
      pop.className = 'live-xp-pop';
      pop.textContent = '+' + delta;
      badge.appendChild(pop);
      setTimeout(() => pop.remove(), 900);
    });
  }
}

// OTP / Verification Logic
window.pendingVerificationEmail = null;
window.pendingVerificationUser = null;
window.pendingVerificationType = 'signup';

async function verifyOtpAction() {
  const inputs = Array.from(document.querySelectorAll('.otp-box'));
  const otpCode = inputs.map(input => input.value).join('');
  
  if (otpCode.length !== 4) {
    showToast('Please enter the 4-digit OTP');
    return;
  }
  
  const btn = document.getElementById('btn-verify-otp');
  const originalText = btn ? btn.innerHTML : 'Verify & Continue';
  if (btn) { btn.innerHTML = 'Verifying...'; btn.disabled = true; }

  setTimeout(() => {
    if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
    
    const verifOverlay = document.getElementById('verification-overlay');
    if (verifOverlay) {
      verifOverlay.classList.remove('open');
      setTimeout(() => { verifOverlay.style.display = 'none'; }, 300);
    }
    
    if (window.pendingVerificationType === 'recovery') {
      showToast('Code verified! Please set a new password.');
      const resetOverlay = document.getElementById('reset-password-overlay');
      if (resetOverlay) {
        resetOverlay.style.display = 'flex';
        setTimeout(() => resetOverlay.classList.add('open'), 100);
      }
    } else {
      // Signup success
      if (window.pendingVerificationUser) {
        const u = window.pendingVerificationUser;
        AppState.isLoggedIn = true;
        AppState.isGuest = false;
        AppState.user = Object.assign({}, DEFAULT_USER, u);
        AppState.xp = u.xp || 50;
        AppState.streak = 1;
        saveUser();
        completeLogin(false, true);
      } else {
        showToast('Account verified! Please sign in.');
        showLogin();
      }
    }
  }, 400);
}

async function resendOtpAction() {
  const otpBoxes = document.querySelectorAll('.otp-box');
  const demoCode = '1234';
  otpBoxes.forEach((b, i) => { b.value = demoCode[i] || ''; });
  showToast('Trial OTP: 1234 (auto-filled)');
}

function openForgotPassword() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.style.display = 'none';
  const overlay = document.getElementById('forgot-password-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('open'), 10);
  }
}

function closeForgotPassword() {
  const overlay = document.getElementById('forgot-password-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => overlay.style.display = 'none', 300);
  }
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.style.display = 'block';
}

async function handleSendResetLink() {
  const email = document.getElementById('forgot-email')?.value.trim();
  if (!email) { showToast('Please enter your email address'); return; }
  
  window.pendingVerificationEmail = email;
  window.pendingVerificationType = 'recovery';
  
  const titleEl = document.getElementById('verification-title');
  const subEl = document.getElementById('verification-subtitle');
  if (titleEl) titleEl.textContent = 'Password Reset Code';
  if (subEl) subEl.textContent = "Trial Mode: Enter any 4-digit code (e.g. 1234) to reset your password.";

  const otpBoxes = document.querySelectorAll('.otp-box');
  const demoCode = '1234';
  otpBoxes.forEach((b, i) => { b.value = demoCode[i] || ''; });

  showToast('Trial reset code: 1234');
  closeForgotPassword();
  
  const overlay = document.getElementById('verification-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('open'), 10);
  }
}

async function handleChangePassword() {
  const newPass = document.getElementById('reset-new-password')?.value.trim();
  const confirmPass = document.getElementById('reset-confirm-password')?.value.trim();

  if (!newPass || !confirmPass) { showToast('Please fill all fields'); return; }
  if (newPass.length < 4) { showToast('Password must be at least 4 characters'); return; }
  if (newPass !== confirmPass) { showToast('Passwords do not match'); return; }

  // Save new password to current user in localstorage
  const email = window.pendingVerificationEmail || AppState.user.email;
  const user = await window.API.getUserByEmail(email);
  if (user) {
    user.password = newPass;
    await window.API.saveUser(user);
  }

  showToast('Password changed successfully!');

  const resetOverlay = document.getElementById('reset-password-overlay');
  if (resetOverlay) {
    resetOverlay.classList.remove('open');
    setTimeout(() => { resetOverlay.style.display = 'none'; }, 300);
  }

  if (!AppState.isLoggedIn) {
    showLogin();
  }
}

// Setup 4-digit OTP Inputs behavior
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.otp-box');
  
  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value.replace(/\D/g,'');
      if (value.length > 1) {
        value.slice(0, 4).split('').forEach((digit, i) => {
          if (inputs[index + i]) inputs[index + i].value = digit;
        });
        inputs[Math.min(index + value.length, inputs.length - 1)].focus();
        return;
      }
      input.value = value;
      if (value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value === '' && index > 0) {
        inputs[index - 1].focus();
      }
    });
    
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const numbers = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, 4);
      numbers.split('').forEach((digit, i) => {
        if (inputs[i]) inputs[i].value = digit;
      });
      inputs[Math.min(numbers.length - 1, 3)].focus();
    });
  });
});

// ============================================
// ONBOARDING QUESTIONNAIRE TOUR CONTROLLER
// ============================================
window.onboardingState = {
  selectedAttempt: 'May 2027',
  discovery: {},
  challenges: {}
};

function startOnboardingTour() {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) {
    Router.navigate('home');
    return;
  }

  // Populate Step 1 options: Jan 27, May 27, Sept 27
  const attempts = [
    { id: 'Jan 27', label: 'Jan 27', sub: 'January 2027 Attempt • Fast Track' },
    { id: 'May 27', label: 'May 27', sub: 'May 2027 Attempt • Standard Track (Recommended)' },
    { id: 'Sept 27', label: 'Sept 27', sub: 'Sept 2027 Attempt • Extended Prep' }
  ];

  const attemptCont = document.getElementById('attempt-opts-container');
  if (attemptCont) {
    attemptCont.innerHTML = attempts.map(att => `
      <div class="onboard-opt-card ${att.id === 'May 27' ? 'selected' : ''}" onclick="selectOnboardingAttempt('${att.id}', this)">
        <div class="opt-card-radio">
          <div class="radio-inner"></div>
        </div>
        <div class="opt-card-body">
          <div class="opt-card-title">${att.label}</div>
          <div class="opt-card-sub">${att.sub}</div>
        </div>
        <div class="opt-card-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
    `).join('');
  }

  window.onboardingState.selectedAttempt = 'May 2027';
  const btn1 = document.getElementById('btn-onboard-next-1');
  if (btn1) btn1.disabled = false;

  // Populate Step 2: Discovery Channels
  const discoveryChannels = [
    { id: 'twitter', label: 'Twitter / X', sub: 'Posts & Updates' },
    { id: 'telegram', label: 'Telegram', sub: 'CA Student Groups' },
    { id: 'whatsapp', label: 'WhatsApp', sub: 'Study Communities' },
    { id: 'google', label: 'Google Search', sub: 'CA Intermediate Portal' },
    { id: 'senior', label: 'Peer / Senior CA', sub: 'Word of mouth' },
    { id: 'other', label: 'Other', sub: 'Other channels' }
  ];

  const discCont = document.getElementById('discovery-opts-container');
  if (discCont) {
    discCont.innerHTML = discoveryChannels.map(ch => `
      <div class="onboard-chip-card" onclick="toggleOnboardingDiscovery('${ch.id}', this)">
        <div class="chip-checkbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div class="chip-title">${ch.label}</div>
          <div class="chip-sub">${ch.sub}</div>
        </div>
      </div>
    `).join('');
  }

  // Populate Step 3: Challenges / Pain Points
  const challenges = [
    { id: 'distracted', label: 'Too Distracted', sub: 'Phone, notifications & short attention spans' },
    { id: 'lazy_book', label: 'Lazy to Open Bulky Books', sub: 'Hesitant to tackle massive ICAI modules directly' },
    { id: 'focus_time', label: "Can't Focus for Long Hours", sub: 'Mental fatigue and burnout during 8+ hr study days' },
    { id: 'procrastination', label: 'Chronic Procrastination', sub: 'Delaying difficult subjects like Law and Costing' },
    { id: 'lack_recall', label: 'Lack of Daily Active Recall', sub: 'Forgetting legal provisions & standards within weeks' },
    { id: 'law_drafting', label: 'Unsure of ICAI Answer Format', sub: 'Losing marks on presentation & legal analysis structure' }
  ];

  const chalCont = document.getElementById('challenges-opts-container');
  if (chalCont) {
    chalCont.innerHTML = challenges.map(ch => `
      <div class="onboard-opt-card" onclick="toggleOnboardingChallenge('${ch.id}', this)">
        <div class="opt-card-checkbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="opt-card-body">
          <div class="opt-card-title">${ch.label}</div>
          <div class="opt-card-sub">${ch.sub}</div>
        </div>
      </div>
    `).join('');
  }

  // Reset steps display
  showOnboardStep(1);
  overlay.style.display = 'block';
  setTimeout(() => overlay.classList.add('open'), 10);
}

function showOnboardStep(stepNum) {
  [1, 2, 3].forEach(s => {
    const p = document.getElementById(`onboard-step-${s}`);
    if (p) p.style.display = s === stepNum ? 'block' : 'none';
  });

  const lbl = document.getElementById('onboarding-step-lbl');
  if (lbl) lbl.textContent = `Step ${stepNum} of 3`;

  const bar = document.getElementById('onboarding-progress-fill');
  if (bar) bar.style.width = (stepNum * 33.33) + '%';
}

function selectOnboardingAttempt(attempt, el) {
  window.onboardingState.selectedAttempt = attempt;
  document.querySelectorAll('#attempt-opts-container .onboard-opt-card').forEach(c => c.classList.remove('selected'));
  if (el) el.classList.add('selected');
  const btn = document.getElementById('btn-onboard-next-1');
  if (btn) btn.disabled = false;
}

function toggleOnboardingDiscovery(channel, el) {
  window.onboardingState.discovery[channel] = !window.onboardingState.discovery[channel];
  if (el) el.classList.toggle('selected', !!window.onboardingState.discovery[channel]);
}

function toggleOnboardingChallenge(chId, el) {
  window.onboardingState.challenges[chId] = !window.onboardingState.challenges[chId];
  if (el) el.classList.toggle('selected', !!window.onboardingState.challenges[chId]);
}

function onboardingNext(currStep) {
  showOnboardStep(currStep + 1);
}

function onboardingPrev(currStep) {
  showOnboardStep(currStep - 1);
}

function finishOnboarding() {
  const chosenAttempt = window.onboardingState.selectedAttempt || 'May 2027';
  AppState.user.attempt = chosenAttempt;
  
  localStorage.setItem('pe_onboarding_done', 'true');
  localStorage.setItem('pe_onboarding_data', JSON.stringify({
    attempt: chosenAttempt,
    discovery: window.onboardingState.discovery,
    challenges: window.onboardingState.challenges,
    completedAt: new Date().toISOString()
  }));

  saveUser();

  // Celebration Confetti
  if (window.confetti) {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch(e) {}
  }

  const overlay = document.getElementById('onboarding-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.style.display = 'none';
      Router.navigate('home');
      showToast(`Setup complete! Target: ${chosenAttempt}`);
    }, 300);
  } else {
    Router.navigate('home');
  }
}

window.startOnboardingTour = startOnboardingTour;
window.selectOnboardingAttempt = selectOnboardingAttempt;
window.toggleOnboardingDiscovery = toggleOnboardingDiscovery;
window.toggleOnboardingChallenge = toggleOnboardingChallenge;
window.onboardingNext = onboardingNext;
window.onboardingPrev = onboardingPrev;
window.finishOnboarding = finishOnboarding;

// Email change logic (locally managed)
window.handleSendEmailChangeOtp = async function(newEmail) {
  showToast('Trial OTP sent: 123456');
  return { success: true };
};

window.handleVerifyEmailChangeOtp = async function(newEmail, otp) {
  if (!newEmail) return { error: 'Invalid email' };
  AppState.user.email = newEmail;
  saveUser();
  return { success: true };
};

// Window bindings
window.addEventListener('DOMContentLoaded', initSplash);

window.showToast = showToast;
window.escapeHtml = escapeHtml;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleGoogleAuth = handleGoogleAuth;
window.handleGuestLogin = handleGuestLogin;
window.handleSignout = handleSignout;
window.showSignup = showSignup;
window.showLogin = showLogin;
window.togglePassword = togglePassword;
window.getNextThreeAttempts = getNextThreeAttempts;
window.generateUpcomingAttempts = generateUpcomingAttempts;
window.saveSettings = saveSettings;
window.saveUser = saveUser;
window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
window.awardXP = awardXP;
window.bumpLiveXp = bumpLiveXp;
window.liveXpBarHtml = liveXpBarHtml;
window.verifyOtpAction = verifyOtpAction;
window.resendOtpAction = resendOtpAction;
window.openForgotPassword = openForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.handleSendResetLink = handleSendResetLink;
window.handleChangePassword = handleChangePassword;

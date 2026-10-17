// ============================================
// InterEdge - Pure JavaScript Router
// Hash-based routing · Law param support · Profile panel params
// ============================================

const Router = (function() {
  const routes = {
    'home':        { view: 'renderHome',          navIdx: 0 },
    'practice':    { view: 'renderPractice',      navIdx: 1 },
    'tests':       { view: 'renderTests',         navIdx: 2 },
    'ranks':       { view: 'renderRanks',         navIdx: 3 },
    'profile':     { view: 'renderProfile',       navIdx: 4 },
    'settings':    { view: 'renderSettings',      navIdx: 4, overlay: true },
    'editProfile': { view: 'renderEditProfile',   overlay: true },
    'performance': { view: 'renderPerformance',   overlay: true },
    'bookmarks':   { view: 'renderBookmarks',     overlay: true },
    'community':   { view: 'renderCommunity',     overlay: true },
    'pdfLibrary':  { view: 'renderPdfLibrary',    overlay: true },
    'chapters':    { view: 'renderChapters',      navIdx: 1 },
    'chapter':     { view: 'renderChapterDetail', navIdx: 1 },
    'unit':        { view: 'renderUnitDetail',    navIdx: 1 },
    'quiz':        { view: 'renderQuiz',          fullscreen: true },
    // Law routes with params
    'law':         { view: 'renderLawRoute',      navIdx: 1 },
    'law-concepts':{ view: 'renderLawConceptsRoute', navIdx: 1 },
    'law-start':   { view: 'renderLawStartRoute', navIdx: 1 }
  };

  let currentRoute = '';
  let currentParams = {};

  function parseUrl() {
    let path = window.location.pathname.replace(/^\/+/g, '').replace(/\/+$/g, '').trim();
    if (!path || path === 'index.html' || path === 'verified') return { route: 'home', params: {} };
    const route = path;
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return { route, params };
  }

  function buildUrl(route, params) {
    let url = '/' + route;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => searchParams.append(k, v));
      url += '?' + searchParams.toString();
    }
    return url;
  }

  function navigate(route, params) {
    if (!route) route = 'home';
    const newUrl = buildUrl(route, params || {});
    if (window.location.pathname + window.location.search === newUrl) {
      handleRoute();
    } else {
      window.history.pushState({}, '', newUrl);
      handleRoute();
    }
  }

  function goBack() { window.history.back(); }

  function isAuthenticated() {
    return window.AppState && AppState.isLoggedIn;
  }

  function handleRoute() {
    const { route, params } = parseUrl();
    const routeConfig = routes[route];

    if (!isAuthenticated() && route !== 'login') return;

    if (!routeConfig) { navigate('home'); return; }

    const previousRoute = currentRoute;
    currentRoute = route;
    currentParams = params;

    closeAllOverlays();

    // Handle home panel param
    if (route === 'home' && params.panel) {
      showMainApp();
      updateNav(0);
      if (previousRoute !== 'home') {
        const mainContent = document.getElementById('main-content');
        if (mainContent && window.renderHome) {
          mainContent.innerHTML = '<div class="view-content">' + window.renderHome(params) + '</div>';
        }
      }
      setTimeout(() => {
        if (previousRoute !== 'home' && window.initHome) window.initHome();
        if (window.openFs) window.openFs(params.panel, false);
      }, 100);
      currentRoute = route;
      return;
    }

    // Handle profile panel param
    if (route === 'profile' && params.panel) {
      showMainApp();
      updateNav(4);
      if (previousRoute !== 'profile') {
        const mainContent = document.getElementById('main-content');
        if (mainContent && window.renderProfile) {
          mainContent.innerHTML = '<div class="view-content">' + window.renderProfile(params) + '</div>';
        }
      }
      setTimeout(() => {
        if (previousRoute !== 'profile' && window.initProfile) window.initProfile();
        if (window.openFs) window.openFs(params.panel, false);
      }, 100);
      currentRoute = route;
      return;
    }

    if (routeConfig.fullscreen) {
      hideBottomNav(); hideTopbar();
      if (window[routeConfig.view]) window[routeConfig.view](params);
      return;
    }

    if (routeConfig.overlay) {
      showMainApp();
      if (routeConfig.navIdx !== undefined) updateNav(routeConfig.navIdx);
      setTimeout(() => { if (window[routeConfig.view]) window[routeConfig.view](params); }, 50);
      return;
    }

    showMainApp();
    updateNav(routeConfig.navIdx);

    if (previousRoute !== route) {
      const mainContent = document.getElementById('main-content');
      if (mainContent && window[routeConfig.view]) {
        mainContent.innerHTML = '<div class="view-content">' + window[routeConfig.view](params) + '</div>';
        if (route === 'home' && window.initHome) setTimeout(window.initHome, 10);
        if (route === 'practice' && window.initPractice) setTimeout(window.initPractice, 10);
        if (route === 'profile' && window.initProfile) setTimeout(window.initProfile, 10);
      }
    }
  }

  function showMainApp() {
    const appScreen = document.getElementById('app-screen');
    const authScreen = document.getElementById('auth-screen');
    if (appScreen) { appScreen.style.display = 'flex'; setTimeout(() => { showBottomNav(); showTopbar(); }, 10); }
    if (authScreen) authScreen.style.display = 'none';
  }

  function updateNav(index) {
    document.querySelectorAll('.nav-btn').forEach((btn, i) => btn.classList.toggle('active', i === index));
    movePill(index);
  }

  function movePill(index) {
    const pill = document.getElementById('pill');
    const nav = document.getElementById('bottom-nav');
    if (!pill || !nav) return;
    const navWidth = nav.clientWidth;
    const pillWidth = (navWidth - 20) / 5;
    pill.style.transform = 'translateX(' + (pillWidth * index) + 'px)';
  }

  function showBottomNav() {
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'grid';
  }
  function hideBottomNav() {
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'none';
  }
  function showTopbar() {
    const t = document.getElementById('topbar');
    if (t) t.style.display = 'flex';
  }
  function hideTopbar() {
    const t = document.getElementById('topbar');
    if (t) t.style.display = 'none';
  }

  function closeAllOverlays() {
    document.querySelectorAll('.fs-overlay').forEach(el => el.classList.remove('open'));
    if (window.closeNotif) closeNotif();
    if (window.closeAvatarSheet) closeAvatarSheet();
  }

  function getCurrentRoute() {
    return { route: currentRoute, params: currentParams };
  }

  function init() {
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('DOMContentLoaded', () => { setTimeout(handleRoute, 100); });
  }

  return {
    navigate, goBack, handleRoute, getCurrentRoute,
    movePill, showMainApp, showBottomNav, hideBottomNav,
    showTopbar, hideTopbar, closeAllOverlays, updateNav, init
  };
})();

// ===== LAW ROUTE HANDLERS =====
// These bridge hash-based navigation to law.js overlay system
// #law → show law chapters overlay
// #law?chapter=l1 → show concepts for chapter
// #law?chapter=l1&concept=c1 → show instructions for concept
function renderLawRoute(params) {
  // Render practice page first, then open law overlay
  const html = window.renderPractice ? window.renderPractice() : '';
  setTimeout(() => {
    if (params && params.chapter && params.concept) {
      if (window.openLawInstructions) openLawInstructions(params.chapter, params.concept);
    } else if (params && params.chapter) {
      if (window.renderLawChapters) renderLawChapters();
      setTimeout(() => { if (window.openLawConcepts) openLawConcepts(params.chapter); }, 400);
    } else {
      if (window.renderLawChapters) renderLawChapters();
    }
  }, 100);
  return html;
}

Router.init();

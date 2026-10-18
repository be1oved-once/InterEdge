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
    if (path.includes('/')) {
      const parts = path.split('/');
      path = parts[parts.length - 1];
    }
    if (!path || path === 'index.html' || path === 'verified' || path.toLowerCase() === 'interedge') {
      return { route: 'home', params: {} };
    }
    const route = routes[path] ? path : 'home';
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
    if (!route || route === 'index.html' || route.toLowerCase() === 'interedge') route = 'home';
    const newUrl = buildUrl(route, params || {});
    const isOverlay = !!(params && params.panel);
    if (window.location.pathname + window.location.search === newUrl) {
      handleRoute(false);
    } else {
      try {
        window.history.pushState({ route, params, isOverlay }, '', newUrl);
      } catch(e) {}
      handleRoute(false);
    }
  }

  function goBack() { window.history.back(); }

  function isAuthenticated() {
    return (window.AppState && AppState.isLoggedIn) || localStorage.getItem('pe_loggedIn') === 'true';
  }

  function handleRoute(forceRender) {
    const { route, params } = parseUrl();
    const routeConfig = routes[route];

    if (!isAuthenticated() && route !== 'login') return;

    if (!routeConfig) { navigate('home'); return; }

    const previousRoute = currentRoute;
    const previousParams = currentParams;
    currentRoute = route;
    currentParams = params;

    const mainContent = document.getElementById('main-content');
    const isContentEmpty = !mainContent || !mainContent.children.length || !mainContent.innerHTML.trim();

    // Handle home panel param (e.g. pdfLibrary, crux)
    if (route === 'home' && params.panel) {
      showMainApp();
      updateNav(0);
      const isHomeAlreadyRendered = (previousRoute === 'home' && !isContentEmpty);
      if (!isHomeAlreadyRendered || forceRender) {
        const renderFn = window.renderHome || (typeof renderHome === 'function' ? renderHome : null);
        if (mainContent && renderFn) {
          mainContent.scrollTop = 0;
          window.scrollTo(0, 0);
          mainContent.innerHTML = '<div class="view-content">' + renderFn(params) + '</div>';
        }
        if (window.initHome) window.initHome();
      }
      if (window.openFs) window.openFs(params.panel, false);
      return;
    }

    if (route === 'home' && !params.panel) {
      showMainApp();
      updateNav(0);
      closeAllOverlays();
      const isHomeAlreadyRendered = (previousRoute === 'home' && !isContentEmpty);
      if (!isHomeAlreadyRendered || forceRender) {
        const renderFn = window.renderHome || (typeof renderHome === 'function' ? renderHome : null);
        if (mainContent && renderFn) {
          mainContent.scrollTop = 0;
          window.scrollTo(0, 0);
          mainContent.innerHTML = '<div class="view-content">' + renderFn(params) + '</div>';
        }
        if (window.initHome) setTimeout(window.initHome, 10);
      }
      return;
    }

    // Handle profile panel param (e.g. editProfile, performance, bookmarks, settings, etc.)
    if (route === 'profile' && params.panel) {
      showMainApp();
      updateNav(4);
      const isProfileAlreadyRendered = (previousRoute === 'profile' && !isContentEmpty);
      if (!isProfileAlreadyRendered || forceRender) {
        const renderFn = window.renderProfile || (typeof renderProfile === 'function' ? renderProfile : null);
        if (mainContent && renderFn) {
          mainContent.scrollTop = 0;
          window.scrollTo(0, 0);
          mainContent.innerHTML = '<div class="view-content">' + renderFn(params) + '</div>';
        }
        if (window.initProfile) window.initProfile();
      }
      if (window.openFs) window.openFs(params.panel, false);
      return;
    }

    if (route === 'profile' && !params.panel) {
      showMainApp();
      updateNav(4);
      closeAllOverlays();
      const isProfileAlreadyRendered = (previousRoute === 'profile' && !isContentEmpty);
      if (!isProfileAlreadyRendered || forceRender) {
        const renderFn = window.renderProfile || (typeof renderProfile === 'function' ? renderProfile : null);
        if (mainContent && renderFn) {
          mainContent.scrollTop = 0;
          window.scrollTo(0, 0);
          mainContent.innerHTML = '<div class="view-content">' + renderFn(params) + '</div>';
        }
        if (window.initProfile) setTimeout(window.initProfile, 10);
      }
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
    closeAllOverlays();

    const isCurrentRouteAlreadyRendered = (previousRoute === route && !isContentEmpty);
    if (!isCurrentRouteAlreadyRendered || forceRender) {
      const renderFn = window[routeConfig.view] || (route === 'home' ? (window.renderHome || (typeof renderHome === 'function' ? renderHome : null)) : null);
      if (mainContent && typeof renderFn === 'function') {
        mainContent.scrollTop = 0;
        window.scrollTo(0, 0);
        mainContent.innerHTML = '<div class="view-content">' + renderFn(params) + '</div>';
        if (route === 'home' && window.initHome) setTimeout(window.initHome, 10);
        if (route === 'practice' && window.initPractice) setTimeout(window.initPractice, 10);
        if (route === 'profile' && window.initProfile) setTimeout(window.initProfile, 10);
      }
    }
  }

  function showMainApp() {
    const appScreen = document.getElementById('app-screen');
    const authScreen = document.getElementById('auth-screen');
    const landingScreen = document.getElementById('landing-screen');
    if (landingScreen) landingScreen.style.display = 'none';
    if (document.body) document.body.classList.remove('landing-open');
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
    setTimeout(() => {
      const anyOpen = document.querySelector('.fs-overlay.open');
      if (!anyOpen) {
        const host = document.getElementById('fs-overlays');
        if (host) host.innerHTML = '';
      }
    }, 380);
  }

  function getCurrentRoute() {
    return { route: currentRoute, params: currentParams };
  }

  function init() {
    window.addEventListener('popstate', () => handleRoute(false));
    window.addEventListener('DOMContentLoaded', () => { setTimeout(() => handleRoute(false), 100); });
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

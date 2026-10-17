/**
 * InterEdge — Landing Page Script & SVG Generators
 * Built for CA Intermediate Students
 * Developer: Kanhaiya Chaudhary (CA Inter Student - May 2027 Attempt)
 */

(function () {
  'use strict';

  /**
   * Returns a clean, high-resolution inline SVG logo for InterEdge.
   * Sharp geometric crystalline flame & path cutting through.
   */
  function getInterEdgeLogoSVG(width = 38, height = 38) {
    return `
      <svg class="interedge-svg-logo" width="${width}" height="${height}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ie_flame_left" x1="12" y1="88" x2="48" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ff1e56"/>
            <stop offset="50%" stop-color="#ff7b00"/>
            <stop offset="100%" stop-color="#ffd000"/>
          </linearGradient>
          <linearGradient id="ie_flame_right" x1="88" y1="88" x2="52" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#e11d48"/>
            <stop offset="60%" stop-color="#ff6b35"/>
            <stop offset="100%" stop-color="#ffba08"/>
          </linearGradient>
          <linearGradient id="ie_core_path" x1="30" y1="92" x2="70" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#3b82f6"/>
            <stop offset="45%" stop-color="#5b6cff"/>
            <stop offset="100%" stop-color="#00f2fe"/>
          </linearGradient>
          <linearGradient id="ie_glow_accent" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#5b6cff" stop-opacity="0"/>
          </linearGradient>
          <filter id="ie_soft_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#5b6cff" flood-opacity="0.35"/>
          </filter>
        </defs>

        <!-- Base Emblem Container -->
        <g filter="url(#ie_soft_shadow)">
          <!-- Left Faceted Flame Shard -->
          <path d="M 22 78 L 38 48 L 48 64 L 32 86 Z" fill="url(#ie_flame_left)" opacity="0.95" />
          <path d="M 16 62 L 34 32 L 38 48 L 22 78 Z" fill="#ff4d00" opacity="0.85" />
          <path d="M 34 32 L 48 14 L 46 36 L 38 48 Z" fill="#ffd000" />

          <!-- Right Faceted Wing / Edge -->
          <path d="M 78 78 L 62 48 L 52 64 L 68 86 Z" fill="url(#ie_flame_right)" opacity="0.95" />
          <path d="M 84 62 L 66 32 L 62 48 L 78 78 Z" fill="#e11d48" opacity="0.85" />
          <path d="M 66 32 L 52 14 L 54 36 L 62 48 Z" fill="#ffba08" />

          <!-- Central Dynamic Cutting Razor Path (InterEdge Core) -->
          <path d="M 46 88 L 36 60 L 58 38 L 50 10 L 64 36 L 42 62 L 54 88 Z" fill="url(#ie_core_path)" />
          <path d="M 50 10 L 58 38 L 48 42 Z" fill="#ffffff" opacity="0.8" />
          <path d="M 42 62 L 54 88 L 46 88 Z" fill="#1d4ed8" opacity="0.9" />

          <!-- Subtle Precision Edge Highlights -->
          <line x1="50" y1="10" x2="36" y2="60" stroke="#00f2fe" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/>
          <line x1="50" y1="10" x2="64" y2="36" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.85"/>
        </g>
      </svg>
    `;
  }

  /**
   * Returns a minimal, continuous rotating geometric SVG wheel.
   * Super lightweight: consists only of circles, ticks, and dashed lines.
   * Will never degrade performance or overheat mobile devices.
   */
  function getInterEdgeWheelSVG() {
    // Generate 24 tick lines around 360 deg
    let ticks = '';
    const cx = 350;
    const cy = 350;
    for (let i = 0; i < 24; i++) {
      const angle = (i * 15 * Math.PI) / 180;
      const r1 = 300;
      const r2 = i % 2 === 0 ? 320 : 312;
      const x1 = (cx + r1 * Math.cos(angle)).toFixed(1);
      const y1 = (cy + r1 * Math.sin(angle)).toFixed(1);
      const x2 = (cx + r2 * Math.cos(angle)).toFixed(1);
      const y2 = (cy + r2 * Math.sin(angle)).toFixed(1);
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${i % 2 === 0 ? 1.5 : 1}" stroke-opacity="${i % 2 === 0 ? 0.7 : 0.35}"/>`;
    }

    return `
      <svg class="landing-bg-wheel-svg" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #7f8cff;">
        <!-- Outermost Subtle Ring -->
        <circle cx="350" cy="350" r="340" stroke="currentColor" stroke-width="1" stroke-dasharray="8 8" opacity="0.25"/>

        <!-- Ticked Dial Ring -->
        <circle cx="350" cy="350" r="300" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
        <g>${ticks}</g>
        <circle cx="350" cy="350" r="320" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>

        <!-- Mid Orbit with Geometric Dots -->
        <circle cx="350" cy="350" r="240" stroke="currentColor" stroke-width="1" stroke-dasharray="3 12" opacity="0.5"/>
        <circle cx="590" cy="350" r="4" fill="currentColor" opacity="0.7"/>
        <circle cx="110" cy="350" r="4" fill="currentColor" opacity="0.7"/>
        <circle cx="350" cy="590" r="4" fill="currentColor" opacity="0.7"/>
        <circle cx="350" cy="110" r="4" fill="currentColor" opacity="0.7"/>

        <!-- Inner Segmented Rings -->
        <circle cx="350" cy="350" r="180" stroke="currentColor" stroke-width="1.5" stroke-dasharray="24 16" opacity="0.6"/>
        <circle cx="350" cy="350" r="140" stroke="currentColor" stroke-width="1" opacity="0.3"/>
        <circle cx="350" cy="350" r="100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="10 10" opacity="0.45"/>

        <!-- Core Astrolabe Nodes -->
        <circle cx="350" cy="350" r="45" stroke="currentColor" stroke-width="1" opacity="0.5"/>
        <circle cx="350" cy="350" r="6" fill="currentColor" opacity="0.8"/>
        
        <!-- Cross Axes -->
        <line x1="350" y1="50" x2="350" y2="650" stroke="currentColor" stroke-width="0.75" stroke-dasharray="6 6" opacity="0.2"/>
        <line x1="50" y1="350" x2="650" y2="350" stroke="currentColor" stroke-width="0.75" stroke-dasharray="6 6" opacity="0.2"/>
      </svg>
    `;
  }

  /**
   * Display the Landing Page and hide all other app containers.
   */
  function showLandingPage() {
    const landing = document.getElementById('landing-screen');
    const authScreen = document.getElementById('auth-screen');
    const appScreen = document.getElementById('app-screen');
    const splash = document.getElementById('splash-screen');

    if (splash) {
      splash.style.display = 'none';
      splash.style.visibility = 'hidden';
    }
    if (authScreen) authScreen.style.display = 'none';
    if (appScreen) appScreen.style.display = 'none';

    document.body.classList.add('landing-open');

    if (landing) {
      landing.style.display = 'block';
      landing.style.opacity = '1';
      landing.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }

  /**
   * Hide the Landing Page.
   */
  function hideLandingPage() {
    document.body.classList.remove('landing-open');
    const landing = document.getElementById('landing-screen');
    if (landing) {
      landing.style.display = 'none';
    }
  }

  /**
   * Open the Auth Screen from Landing Page with designated view ('login' | 'signup')
   */
  function openAuthFromLanding(mode = 'login') {
    hideLandingPage();
    const authScreen = document.getElementById('auth-screen');
    const appScreen = document.getElementById('app-screen');

    if (appScreen) appScreen.style.display = 'none';

    if (authScreen) {
      authScreen.style.display = 'flex';
      authScreen.style.opacity = '1';
      authScreen.style.animation = 'authSlideIn 0.35s cubic-bezier(.22,1,.36,1)';
    }

    if (mode === 'signup') {
      if (typeof window.showSignup === 'function') {
        window.showSignup();
      }
    } else {
      if (typeof window.showLogin === 'function') {
        window.showLogin();
      }
    }
  }

  /**
   * Scroll smoothly to a section on the landing page
   */
  function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    const landing = document.getElementById('landing-screen');
    if (el) {
      if (landing && landing.scrollHeight > landing.clientHeight) {
        const landingRect = landing.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const targetScrollTop = landing.scrollTop + (elRect.top - landingRect.top) - 64;
        landing.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /**
   * Global Theme Toggle for Landing Page & App
   */
  function toggleThemeGlobal() {
    const isLight = document.body.classList.contains('light-theme');
    const targetTheme = isLight ? 'dark' : 'light';
    if (typeof window.setTheme === 'function') {
      window.setTheme(targetTheme);
    } else if (typeof window.applyTheme === 'function') {
      window.applyTheme(targetTheme);
    } else {
      document.body.classList.toggle('light-theme', !isLight);
    }
  }

  // Expose landing controller to window
  window.LandingPage = {
    getLogoSVG: getInterEdgeLogoSVG,
    getWheelSVG: getInterEdgeWheelSVG,
    show: showLandingPage,
    hide: hideLandingPage,
    openAuth: openAuthFromLanding,
    scrollToSection: scrollToSection,
    toggleTheme: toggleThemeGlobal
  };

  // Global convenience bindings
  window.showLandingPage = showLandingPage;
  window.openAuthFromLanding = openAuthFromLanding;
  window.scrollToLandingSection = scrollToSection;
  window.toggleThemeGlobal = toggleThemeGlobal;

})();

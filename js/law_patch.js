// ============================================
// InterEdge - Law.js PATCH (URL param system)
// Replace the following functions in your law.js
// ============================================

// REPLACE: renderLawChapters
// Change the onclick for each chapter card from:
//   onclick="openLawConcepts('" + ch.id + "')"
// To:
//   onclick="Router.navigate('law', {chapter:'" + ch.id + "'})"
// AND change closeLawChapters to use #law:

function renderLawChapters() {
  var overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  var html = '<div class="fs-overlay" id="fs-law-chapters">' +
    '<div class="fs-head">' +
      '<button class="back-btn" onclick="closeLawChapters()">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<h2 style="font-size:1.1rem;font-weight:700;">Law</h2>' +
    '</div>' +
    '<div class="fs-content">' +
      '<div style="font-size:.82rem;color:var(--txt3);margin-bottom:16px;">Select a chapter to view concepts</div>' +
      '<div class="chapter-list">';

  for (var i = 0; i < LAW_DATA.chapters.length; i++) {
    var ch = LAW_DATA.chapters[i];
    // Push URL param so user can share/bookmark #law?chapter=l1
    html += '<div class="chapter-card" onclick="openLawConceptsWithNav(\'' + ch.id + '\')">' +
      '<div class="chapter-num" style="background:linear-gradient(135deg,' + LAW_DATA.color + ',var(--accent2));">' + ch.num + '</div>' +
      '<div class="chapter-info">' +
        '<div class="chapter-title">' + ch.title + '</div>' +
        '<div class="chapter-meta">' + ch.concepts.length + ' concepts</div>' +
      '</div>' +
      '<svg class="chapter-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
    '</div>';
  }

  html += '</div></div></div>';
  overlay.innerHTML = html;

  setTimeout(function() {
    var el = document.getElementById('fs-law-chapters');
    if (el) el.classList.add('open');
  }, 10);

  // Push URL param
  window.history.replaceState(null, null, '#law');
}

function closeLawChapters() {
  var el = document.getElementById('fs-law-chapters');
  if (el) el.classList.remove('open');
  setTimeout(function() {
    window.history.replaceState(null, null, '#practice');
  }, 350);
}

// Helper: navigate with URL param then open overlay
function openLawConceptsWithNav(chapterId) {
  window.history.replaceState(null, null, '#law?chapter=' + chapterId);
  openLawConcepts(chapterId);
}

// REPLACE: openLawConcepts
function openLawConcepts(chapterId) {
  var chapter = null;
  for (var i = 0; i < LAW_DATA.chapters.length; i++) {
    if (LAW_DATA.chapters[i].id === chapterId) { chapter = LAW_DATA.chapters[i]; break; }
  }
  if (!chapter) return;

  var overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  var html = '<div class="fs-overlay" id="fs-law-concepts" style="z-index:70;">' +
    '<div class="fs-head">' +
      '<button class="back-btn" onclick="closeLawConcepts()">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<h2 style="font-size:1.1rem;font-weight:700;">' + chapter.title + '</h2>' +
    '</div>' +
    '<div class="fs-content">' +
      '<div style="font-size:.82rem;color:var(--txt3);margin-bottom:16px;">Select a concept to practice</div>' +
      '<div class="chapter-list">';

  for (var i = 0; i < chapter.concepts.length; i++) {
    var concept = chapter.concepts[i];
    // Push URL param: #law?chapter=l1&concept=c1
    html += '<div class="chapter-card" onclick="openLawInstructionsWithNav(\'' + chapterId + '\', \'' + concept.id + '\')">' +
      '<div class="chapter-num" style="background:linear-gradient(135deg,' + LAW_DATA.color + ',var(--accent2));width:auto;padding:0 14px;">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>' +
      '</div>' +
      '<div class="chapter-info">' +
        '<div class="chapter-title">' + concept.title + '</div>' +
        '<div class="chapter-meta">' + concept.questions.length + ' questions</div>' +
      '</div>' +
      '<svg class="chapter-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
    '</div>';
  }

  html += '</div>' +
    '<div class="chapter-back-card" onclick="closeLawConcepts();setTimeout(renderLawChapters,400);" style="margin-top:14px;">' +
      '<div class="chapter-back-icon">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</div>' +
      '<div><div class="chapter-back-title">Back to Chapters</div><div class="chapter-back-sub">Choose another chapter</div></div>' +
    '</div>' +
    '</div></div>';

  overlay.innerHTML = html;
  setTimeout(function() {
    var el = document.getElementById('fs-law-concepts');
    if (el) el.classList.add('open');
  }, 10);
}

function closeLawConcepts() {
  var el = document.getElementById('fs-law-concepts');
  if (el) el.classList.remove('open');
}

// Helper: navigate with URL param then open instructions
function openLawInstructionsWithNav(chapterId, conceptId) {
  window.history.replaceState(null, null, '#law?chapter=' + chapterId + '&concept=' + conceptId);
  openLawInstructions(chapterId, conceptId);
}

// Expose new helpers
window.renderLawChapters = renderLawChapters;
window.closeLawChapters = closeLawChapters;
window.openLawConceptsWithNav = openLawConceptsWithNav;
window.openLawConcepts = openLawConcepts;
window.closeLawConcepts = closeLawConcepts;
window.openLawInstructionsWithNav = openLawInstructionsWithNav;

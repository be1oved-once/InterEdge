// ── Paige AI — Full Client Logic ────────────────────────────────

const PAIGE_STORAGE_KEY = 'paige_ai_messages';
const PAIGE_HIDDEN_KEY  = 'paige_ai_hidden';

let paigeMessages        = [];
let paigeAbortController = null;
let paigeIsGenerating    = false;
let paigeFileAttachment  = null;

/* ── INIT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initPaigeAI);

function initPaigeAI() {
  // Respect "never show" pref
  if (localStorage.getItem(PAIGE_HIDDEN_KEY) === 'true') {
    hidePaigeFab();
  }

  // Load saved history
  try {
    const raw = localStorage.getItem(PAIGE_STORAGE_KEY);
    paigeMessages = raw ? JSON.parse(raw) : [];
  } catch (_) {
    paigeMessages = [];
  }

  // Ensure welcome message exists
  if (!paigeMessages.length) {
    const welcomes = [
      "Hi! I'm **Paige AI** — your study companion for CA Intermediate. Ask me anything about your subjects or practice questions!",
      "Hello there! **Paige AI** here. Ready to crush your CA Intermediate prep? What can I help you with today?",
      "Welcome! I'm **Paige AI**. Whether it's Advanced Accounts, Law, Tax, Costing or FM, I'm here to help you study smarter.",
      "Hey! It's **Paige AI**. Got a tricky question or concept you're stuck on? Let's solve it together!"
    ];
    paigeMessages.push({
      role: 'assistant',
      content: welcomes[Math.floor(Math.random() * welcomes.length)]
    });
    savePaigeMessages();
  }

  renderPaigeMessages();

  // Close dropdown on outside click
  document.addEventListener('click', e => {
    const dd  = document.getElementById('paigeDropdown');
    const btn = document.getElementById('paigeMenuBtn');
    if (dd && dd.classList.contains('open') && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
      dd.classList.remove('open');
    }
  });
}

/* ── OPEN / CLOSE ─────────────────────────────────────────────── */
function togglePaigeModal() {
  const sheet    = document.getElementById('paigeSheet');
  const backdrop = document.getElementById('paigeBackdrop');
  const isOpen   = sheet.classList.contains('open');

  if (isOpen) {
    closePaigeModal();
  } else {
    sheet.classList.add('open');
    backdrop.classList.add('open');

    // Always refresh context from current question on every open (fixes stale question bug)
    const inputEl = document.getElementById('paigeInput');
    if (inputEl) {
      const qEl = document.querySelector('.quiz-question');
      if (qEl) {
        // Build question text
        let contextStr = 'I need help with this question:\n' + qEl.innerText.trim();

        // Scrape options using existing label + text (don't re-index — avoids phantom options)
        const optionEls = document.querySelectorAll('.quiz-option');
        if (optionEls.length > 0) {
          contextStr += '\nOptions:';
          optionEls.forEach(optEl => {
            const letterEl = optEl.querySelector('.quiz-option-letter');
            const textEl   = optEl.querySelector('.quiz-option-text');
            const letter   = letterEl ? letterEl.innerText.trim() : '';
            const text     = textEl   ? textEl.innerText.trim()   : optEl.innerText.trim();
            const optLine  = letter ? `${letter} ${text}` : text;
            if (optLine.trim()) contextStr += '\n' + optLine;
          });
        }

        // Always overwrite — never keep old question in input
        inputEl.value = contextStr;
        paigeAutoResize(inputEl);
      } else {
        // Not on a quiz screen — clear old context
        inputEl.value = '';
        inputEl.style.height = 'auto';
      }
    }

    setTimeout(() => {
      scrollToPaigeBottom();
      document.getElementById('paigeInput')?.focus();
    }, 350);
  }
}

function closePaigeModal() {
  document.getElementById('paigeSheet')?.classList.remove('open');
  document.getElementById('paigeBackdrop')?.classList.remove('open');
  document.getElementById('paigeDropdown')?.classList.remove('open');
}

/* ── 3-DOT MENU ───────────────────────────────────────────────── */
function togglePaigeMenu(e) {
  if (e) e.stopPropagation();
  document.getElementById('paigeDropdown')?.classList.toggle('open');
}

function clearPaigeChat() {
  paigeMessages = [{
    role: 'assistant',
    content: 'Chat cleared! How can I help you?'
  }];
  savePaigeMessages();
  renderPaigeMessages();
  document.getElementById('paigeDropdown')?.classList.remove('open');
}

function hidePaigePermanently() {
  localStorage.setItem(PAIGE_HIDDEN_KEY, 'true');
  closePaigeModal();
  hidePaigeFab();
  // Sync settings toggle
  const t = document.getElementById('toggle-paige-ai');
  if (t) t.classList.remove('on');
  if (typeof showToast === 'function') showToast('Paige AI hidden. Re-enable in Settings.');
}

/* ── FAB VISIBILITY ───────────────────────────────────────────── */
function hidePaigeFab() {
  const fab = document.getElementById('paigeFab');
  if (fab) fab.style.display = 'none';
}
function showPaigeFab() {
  const fab = document.getElementById('paigeFab');
  if (fab) fab.style.display = 'flex';
}

/* ── STORAGE ──────────────────────────────────────────────────── */
function savePaigeMessages() {
  // Keep last 60 messages to bound storage
  if (paigeMessages.length > 60) paigeMessages = paigeMessages.slice(-60);
  localStorage.setItem(PAIGE_STORAGE_KEY, JSON.stringify(paigeMessages));
}

function openPaigeImageModal(src) {
  const modal = document.getElementById('paigeImageModal');
  const img = document.getElementById('paigeImageModalImg');
  if (modal && img) {
    img.src = src;
    modal.style.display = 'flex';
  }
}

/* ── FILE HANDLING ────────────────────────────────────────────── */
async function handlePaigeFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const preview = document.getElementById('paigeFilePreview');
  const nameEl = document.getElementById('paigeFileName');
  const iconEl = document.getElementById('paigeFileIcon');
  nameEl.textContent = file.name + ' (Loading...)';
  iconEl.innerHTML = '';
  preview.style.display = 'flex';

  try {
    if (file.type.startsWith('image/')) {
      const b64 = await _readAsDataURL(file);
      paigeFileAttachment = { type: 'image_url', url: b64, name: file.name };
      iconEl.innerHTML = `<img src="${b64}" alt="preview">`;
    } else {
      let text = '';
      if (file.name.toLowerCase().endsWith('.pdf')) {
        text = await _readPdfText(file);
      } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
        text = await _readDocxText(file);
      } else {
        text = await _readAsText(file);
      }
      paigeFileAttachment = { type: 'text', content: text, name: file.name };
      iconEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
    }
    nameEl.textContent = file.name;
    document.getElementById('paigeInput')?.focus();
  } catch (err) {
    console.error('[Paige AI File]', err);
    alert('Failed to read file: ' + err.message);
    removePaigeFile();
  }
}

function removePaigeFile() {
  paigeFileAttachment = null;
  const input = document.getElementById('paigeFileInput');
  if (input) input.value = '';
  const preview = document.getElementById('paigeFilePreview');
  if (preview) preview.style.display = 'none';
}

function _readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function _readAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsText(file);
  });
}

async function _readPdfText(file) {
  if (typeof pdfjsLib === 'undefined') throw new Error('PDF.js not loaded. Cannot read PDF.');
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(it => it.str).join(' ') + '\n';
  }
  return text.trim() || '(PDF is empty or scanned)';
}

async function _readDocxText(file) {
  if (typeof mammoth === 'undefined') throw new Error('Mammoth.js not loaded. Cannot read DOCX.');
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value.trim();
}

/* ── RENDER ───────────────────────────────────────────────────── */
function renderPaigeMessages() {
  const area = document.getElementById('paigeChatArea');
  if (!area) return;
  area.innerHTML = '';
  paigeMessages.forEach(msg => {
    _createBubble(area, msg.role, msg.content, false);
  });
  scrollToPaigeBottom();
}

  function _createBubble(area, role, content, animate = true) {
  const el = document.createElement('div');
  el.className = `paige-bubble ${role === 'user' ? 'user' : 'ai'}`;
  if (!animate) el.style.animation = 'none';

  if (role === 'assistant') {
    el.innerHTML = parsePaigeMarkdown(content);
  } else {
    // For user, content might contain HTML if it has an attachment chip
    el.innerHTML = content;
  }

  area.appendChild(el);
  return el;
}

function scrollToPaigeBottom() {
  const area = document.getElementById('paigeChatArea');
  if (area) requestAnimationFrame(() => { area.scrollTop = area.scrollHeight; });
}

/* ── INPUT HANDLING ───────────────────────────────────────────── */
function handlePaigeInputKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendPaigeMessage();
  }
}

function paigeAutoResize(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 100) + 'px';
}

/* ── SEND / STOP ──────────────────────────────────────────────── */
function stopPaigeGeneration() {
  if (paigeAbortController) {
    paigeAbortController.abort();
    paigeAbortController = null;
  }
  _setPaigeLoading(false);
}

function _setPaigeLoading(on) {
  paigeIsGenerating = on;
  const send  = document.getElementById('paigeSendBtn');
  const stop  = document.getElementById('paigeStopBtn');
  const input = document.getElementById('paigeInput');
  if (!send || !stop || !input) return;

  if (on) {
    send.style.display = 'none';
    stop.style.display = 'flex';
    input.disabled = true;
  } else {
    send.style.display = 'flex';
    stop.style.display = 'none';
    input.disabled = false;
    setTimeout(() => input.focus(), 80);
  }
}

async function sendPaigeMessage() {
  if (paigeIsGenerating) return;

  const input = document.getElementById('paigeInput');
  const text  = input.value.trim();
  
  if (!text && !paigeFileAttachment) return;

  input.value = '';
  input.style.height = 'auto';

  const area = document.getElementById('paigeChatArea');
  if (!area) return;

  const apiMessage = { role: 'user' };
  let localMessageContent = text;

  // Handle Attachments
  if (paigeFileAttachment) {
    if (paigeFileAttachment.type === 'image_url') {
      apiMessage.content = [];
      if (text) apiMessage.content.push({ type: 'text', text: text });
      apiMessage.content.push({ type: 'image_url', image_url: { url: paigeFileAttachment.url } });
      
      const imgPreview = `<img src="${paigeFileAttachment.url}" onclick="openPaigeImageModal(this.src)" style="max-width:120px; max-height:120px; border-radius:8px; display:block; margin-bottom:8px; border:1px solid rgba(255,255,255,0.1); cursor:pointer;">`;
      localMessageContent = imgPreview + (text ? `<div>${text}</div>` : '');
    } else {
      const promptText = `Attached File Context (${paigeFileAttachment.name}):\n---\n${paigeFileAttachment.content}\n---\n\n${text || 'Please analyze this file.'}`;
      apiMessage.content = promptText;
      
      const filePreview = `<div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:6px; font-size:0.75rem; margin-bottom:8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        ${paigeFileAttachment.name}
      </div>`;
      localMessageContent = filePreview + (text ? `<div>${text}</div>` : '');
    }
    removePaigeFile();
  } else {
    apiMessage.content = text;
  }

  // Add user message to history
  paigeMessages.push({ role: 'user', content: localMessageContent });
  savePaigeMessages();
  _createBubble(area, 'user', localMessageContent);
  scrollToPaigeBottom();

  // Typing indicator
  _setPaigeLoading(true);
  const typingEl = document.createElement('div');
  typingEl.className = 'paige-typing';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  area.appendChild(typingEl);
  scrollToPaigeBottom();

  paigeAbortController = new AbortController();

  try {
    // Local Trial Assistant Response
    await new Promise(r => setTimeout(r, 500));
    typingEl.remove();

    let fullText = '';
    const userPrompt = typeof apiMessage.content === 'string' ? apiMessage.content : (apiMessage.content?.[0]?.text || '');
    
    if (userPrompt.toLowerCase().includes('option') || userPrompt.toLowerCase().includes('which') || userPrompt.toLowerCase().includes('question') || userPrompt.toLowerCase().includes('answer')) {
      fullText = `### Solution & Explanation\n\n1. **Key Concept:** In CA Intermediate examinations, precision is key. Pay attention to specific phrasing, statutory definitions, and calculation steps.\n2. **Why this answer is right:** It strictly adheres to the prescribed ICAI syllabus standards and established principles.\n3. **Common Pitfalls:** Watch out for standard exam traps like misinterpreting negative markings or overlooking qualifying words like *'except'*, *'always'*, or *'not'*.\n\n*Pro-tip:* Bookmark this question to review it during your revision cycle!`;
    } else {
      fullText = `Hello! I'm **Paige AI** (InterEdge Study Assistant - Trial Mode).\n\nRegarding your query about **"${userPrompt.slice(0, 50)}${userPrompt.length > 50 ? '...' : ''}"**:\n- Focus on the core ICAI study material concepts.\n- Work through practical illustrations and mock tests.\n- Maintain your daily practice streak for optimal recall.\n\nAsk me about any MCQ, definition, or formula!`;
    }

    const aiBubble = _createBubble(area, 'assistant', '');
    aiBubble.innerHTML = parsePaigeMarkdown(fullText);
    scrollToPaigeBottom();

    paigeMessages.push({ role: 'assistant', content: fullText });
    savePaigeMessages();

  } catch (err) {
    typingEl.remove();

    if (err.name === 'AbortError') {
      // User stopped — already handled visually
    } else {
      const errEl = document.createElement('div');
      errEl.className = 'paige-error-msg';
      errEl.textContent = '⚠ Could not reach AI. Check your connection and try again.';
      area.appendChild(errEl);
      console.error('[Paige AI]', err);
    }
  } finally {
    _setPaigeLoading(false);
    paigeAbortController = null;
  }
}

/* ── COPY CODE ────────────────────────────────────────────────── */
function copyPaigeCode(btn) {
  const codeBlock = btn.closest('.paige-code-block');
  if (!codeBlock) return;
  const code = codeBlock.querySelector('code')?.innerText || '';
  navigator.clipboard.writeText(code).then(() => {
    const originalText = btn.innerText;
    btn.innerText = 'Copied!';
    setTimeout(() => { btn.innerText = originalText; }, 2000);
  });
}

/* ── MARKDOWN PARSER ──────────────────────────────────────────── */
function parsePaigeMarkdown(raw) {
  if (!raw) return '';

  let t = raw;

  // Escape HTML first (prevent XSS from AI output)
  t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (``` ... ```) - Handle unclosed code blocks for live typing
  t = t.replace(/```([\w]*)\n?([\s\S]*?)(?:```|$)/g, (_, lang, code) => {
    return `<div class="paige-code-block">
              <div class="paige-code-header">
                <span class="paige-code-lang">${lang || 'code'}</span>
                <button class="paige-copy-btn" onclick="copyPaigeCode(this)">Copy</button>
              </div>
              <pre><code>${code.trim()}</code></pre>
            </div>`;
  });

  // Inline code (bounded to avoid matching math symbols improperly)
  t = t.replace(/(^|[^`])`([^`\n]+)`(?!`)/g, '$1<code>$2</code>');

  // Headings
  t = t.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  t = t.replace(/^## (.+)$/gm,  '<h2>$1</h2>');
  t = t.replace(/^# (.+)$/gm,   '<h1>$1</h1>');

  // Bold+Italic
  t = t.replace(/\*\*\*(.+?)(?:\*\*\*|$)/g, '<strong><em>$1</em></strong>');
  
  // Bold (handle unclosed bold for live typing)
  t = t.replace(/\*\*([^*]+?)(?:\*\*|$)/g, '<strong>$1</strong>');
  t = t.replace(/__([^_]+?)(?:__|$)/g, '<strong>$1</strong>');
  
  // Italic (Bounded to prevent math operators like 2 * 3 from getting italicized)
  t = t.replace(/(^|\s)\*([^\s*][^*]*?[^\s*]|[^\s*])\*(?=\s|[.,;?!]|$)/g, '$1<em>$2</em>');
  t = t.replace(/(^|\s)_([^\s_][^_]*?[^\s_]|[^\s_])_(?=\s|[.,;?!]|$)/g, '$1<em>$2</em>');

  // Horizontal rule
  t = t.replace(/^[-*]{3,}$/gm, '<hr>');

  // Blockquote
  t = t.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered lists
  t = t.replace(/^[*\-+] (.+)$/gm, '<li>$1</li>');
  
  // Ordered lists
  t = t.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Group contiguous lists into <ul>
  t = t.replace(/(?:<li>.*?<\/li>\n?)+/g, match => `<ul class="paige-list">${match}</ul>`);

  // Paragraphs — blank lines → <p> breaks
  t = t.replace(/\n\n+/g, '</p><p>');
  
  // Single newlines → <br> except inside block elements
  t = t.replace(/(?<!<\/(?:div|pre|ul|ol|li|h[123]|blockquote|hr)>)\n/g, '<br>');

  // Clean up any stray breaks immediately inside ul
  t = t.replace(/<ul class="paige-list"><br>/g, '<ul class="paige-list">');

  // Wrap in paragraph
  if (!t.startsWith('<') && !t.startsWith('</')) t = '<p>' + t + '</p>';

  return t;
}

// ============================================
// InterEdge - Law Answer Writing Module
// ============================================

var lawState = {
  subject: null,
  chapter: null,
  concept: null,
  questions: [],
  currentQ: 0,
  answers: [],
  isFinished: false,
  evaluated: false,
  totalScore: 0,
  maxScore: 0
};

// ===== LAW DATA =====
const LAW_DATA = {
  "id": "law",
  "name": "Business Laws",
  "color": "#e85d5d",
  "icon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/><path d=\"M12 8v4\"/><path d=\"M12 16h.01\"/></svg>",
  "chapters": [
    {
      "id": "l1",
      "num": 1,
      "title": "Indian Contract Act, 1872",
      "concepts": [
        {
          "id": "c1",
          "title": "Essential Elements of a Valid Contract",
          "questions": [
{
              "_no": 999,
              "q": "Mr. A, a prominent businessman dealing in the wholesale trade of electronics in Mumbai, entered into a complex contractual agreement with Mr. B, a logistics provider based in Pune, for the transportation of a large consignment of high-end smartphones. The contract, drafted on the 5th of September 2023, clearly stipulated that time was of the essence and that the goods absolutely must be delivered to A's warehouse in Delhi no later than the 15th of September 2023, failing which B would be liable to pay a liquidated damages sum of Rs. 5,00,000. Furthermore, the agreement explicitly contained a clause stating that any delays caused by 'Act of God' or unforeseen natural disasters would exempt B from this penalty. On the 12th of September, while the truck was en route via the national highway, unprecedented and extremely severe flash floods struck the region, completely washing away the primary bridge connecting the route and submerging the surrounding infrastructure. The driver was stranded for four days, and ultimately the smartphones were delivered on the 20th of September, well past the agreed deadline. Mr. A, having lost significant festive season sales due to the delay, immediately initiated legal proceedings to claim the stipulated Rs. 5,00,000 in liquidated damages, arguing that alternate longer routes were theoretically available and B should have anticipated monsoon risks. B invoked the Force Majeure clause. Discuss the validity of A's claim and B's defense in light of the relevant provisions of the Indian Contract Act, 1872 regarding supervening impossibility and frustration of contract.",
              "keywords": [
                "supervening impossibility",
                "frustration",
                "section 56",
                "force majeure",
                "act of god",
                "unforeseen",
                "liquidated damages",
                "exempt"
              ],
              "explanation": "Under Section 56 of the Indian Contract Act, an agreement to do an act impossible in itself is void. If an act becomes impossible after the contract is made due to an event the promisor could not prevent, the contract becomes void. Since the floods were unprecedented and washed away the bridge, it falls under supervening impossibility. B is protected by the force majeure clause."
            },
            
            {
              "_no": 1,
              "q": "Rahul, a 17-year-old student, entered into an agreement with a coaching institute to pay Rs. 50,000 for a CA Intermediate course. After attending classes for two months, Rahul stopped paying the remaining fees. The institute sued Rahul for breach of contract. Decide.",
              "keywords": [
                "minor",
                "void",
                "not competent",
                "age of majority",
                "18 years",
                "void ab initio",
                "no liability",
                "restitution",
                "not enforceable"
              ],
              "explanation": "A minor is not competent to contract under Section 11 of the Indian Contract Act. Any agreement with a minor is void ab initio (void from the beginning). The coaching institute cannot enforce the contract against Rahul. However, Rahul may be required to make restitution of any benefit received under Section 33 of the Specific Relief Act, 1963."
            },
            {
              "_no": 2,
              "q": "A agrees to sell his house to B for Rs. 10 lakhs. However, the agreement was made orally without any written document or registration. When B pays the advance, A refuses to transfer the property. Can B enforce the agreement?",
              "keywords": [
                "immovable property",
                "registration",
                "mandatory",
                "Section 54",
                "Transfer of Property Act",
                "unenforceable",
                "oral agreement",
                "void",
                "not valid"
              ],
              "explanation": "Under Section 54 of the Transfer of Property Act, 1882, a sale of immovable property of value exceeding Rs. 100 must be made through a registered instrument. An oral agreement for sale of immovable property is not valid and cannot be enforced. B cannot compel A to transfer the property."
            }
          ]
        },
        {
          "id": "c2",
          "title": "Offer and Acceptance",
          "questions": [
            {
              "_no": 1,
              "q": "A sends a letter to B offering to sell his car for Rs. 3 lakhs. The letter reaches B on Monday. On Tuesday, B posts a letter of acceptance. On Wednesday, before the letter reaches A, B sends a telegram revoking his acceptance. The telegram reaches A on Thursday, while the letter of acceptance reaches on Friday. Is there a valid contract between A and B?",
              "keywords": [
                "postal rule",
                "communication of acceptance",
                "complete",
                "posting",
                "revocation",
                "before communication",
                "Section 4",
                "binding",
                "valid contract",
                "mailbox rule"
              ],
              "explanation": "Under the postal rule (Section 4 of the Indian Contract Act), acceptance is complete as soon as the letter is posted. B's acceptance was complete on Tuesday. Revocation of acceptance must be communicated before the acceptance is complete. Since B's telegram of revocation reached A after the acceptance was already complete (by posting), the revocation is ineffective. There is a valid contract between A and B."
            }
          ]
        },
        {
          "id": "c3",
          "title": "Consideration and Capacity",
          "questions": [
            {
              "_no": 1,
              "q": "A promised to pay Rs. 10,000 to his son B as a gift on B's graduation. B completed his graduation but A refused to pay. Can B enforce the promise?",
              "keywords": [
                "past consideration",
                "voluntary",
                "no consideration",
                "nudum pactum",
                "not enforceable",
                "gratuitous promise",
                "Section 25",
                "love and affection",
                "not valid contract"
              ],
              "explanation": "A promise to make a gift is a gratuitous promise without consideration. Under Section 25 of the Indian Contract Act, an agreement without consideration is void unless it falls under the exceptions (love and affection, compensation for past voluntary service, promise to pay time-barred debt). Since this is a mere gift promise without consideration and does not fall under any exception, B cannot enforce the promise."
            }
          ]
        }
      ]
    },
    {
      "id": "l2",
      "num": 2,
      "title": "Sale of Goods Act, 1930",
      "concepts": [
        {
          "id": "c4",
          "title": "Conditions and Warranties",
          "questions": [
            {
              "_no": 1,
              "q": "A purchased a washing machine from B with an express warranty that it would work for at least 5 years. Within 6 months, the machine broke down due to a manufacturing defect. A wants to return the machine and claim a full refund. B argues that A can only claim damages. Advise.",
              "keywords": [
                "condition",
                "warranty",
                "breach of condition",
                "Section 12",
                "treat as breach of warranty",
                "repudiate",
                "reject goods",
                "full refund",
                "fundamental term",
                "goes to root"
              ],
              "explanation": "Under Section 12 of the Sale of Goods Act, a stipulation essential to the main purpose of the contract is a condition, while a stipulation collateral to the main purpose is a warranty. An express warranty regarding durability for 5 years, if it goes to the root of the contract, may be treated as a condition. However, under Section 13, the buyer may treat a breach of condition as a breach of warranty and claim damages instead of repudiating the contract. A can claim damages but may not be entitled to a full refund unless the breach is fundamental."
            }
          ]
        },
        {
          "id": "c5",
          "title": "Transfer of Property",
          "questions": [
            {
              "_no": 1,
              "q": "A sold 100 bags of rice to B. Before delivery, the rice was destroyed by a flood while stored in A's warehouse. B had already paid the full price. Who bears the loss?",
              "keywords": [
                "Section 26",
                "risk passes",
                "delivery",
                "unascertained goods",
                "specific goods",
                "seller bears",
                "before delivery",
                "not passed",
                "seller liable",
                "price refundable"
              ],
              "explanation": "Under Section 26 of the Sale of Goods Act, unless otherwise agreed, the goods remain at the seller's risk until the property therein is transferred to the buyer. Since the rice was not delivered and the property had not passed to B, the risk remained with A. A must bear the loss and refund the price to B, or deliver another 100 bags of rice of the same quality."
            }
          ]
        }
      ]
    },
    {
      "id": "l3",
      "num": 3,
      "title": "Partnership Act, 1932",
      "concepts": [
        {
          "id": "c6",
          "title": "Nature and Formation of Partnership",
          "questions": [
            {
              "_no": 1,
              "q": "A, B, and C agreed to share profits from a joint venture of buying and selling antiques. They did not agree to share losses. After six months, the venture incurred heavy losses. C refuses to bear any loss, claiming that there was no partnership as losses were not agreed to be shared. Decide.",
              "keywords": [
                "Section 4",
                "sharing profits",
                "sufficient",
                "not necessary",
                "share losses",
                "implied agreement",
                "partnership exists",
                "mutual agency",
                "business carried on",
                "principal and agent"
              ],
              "explanation": "Under Section 4 of the Partnership Act, partnership is the relation between persons who have agreed to share the profits of a business carried on by all or any of them acting for all. Sharing of profits is sufficient to constitute a partnership; an express agreement to share losses is not necessary. The sharing of losses is implied from the agreement to share profits. Therefore, a partnership exists between A, B, and C, and C is liable to bear losses in the profit-sharing ratio."
            }
          ]
        }
      ]
    },
    {
      "id": "l4",
      "num": 4,
      "title": "Limited Liability Partnership Act, 2008",
      "concepts": [
        {
          "id": "c7",
          "title": "Formation and Characteristics of LLP",
          "questions": [
            {
              "_no": 1,
              "q": "X, Y, and Z want to form a business entity that provides them with the flexibility of a partnership but limits their personal liability. They are confused between a traditional partnership and an LLP. Advise them on the key differences and recommend the most suitable structure.",
              "keywords": [
                "separate legal entity",
                "perpetual succession",
                "limited liability",
                "partners not personally liable",
                "LLP",
                "partnership firm",
                "unlimited liability",
                "jointly and severally",
                "distinct entity",
                "flexible structure"
              ],
              "explanation": "An LLP (Limited Liability Partnership) is a separate legal entity distinct from its partners (Section 3 of LLP Act). Partners have limited liability - their personal assets are not at risk for the LLP's debts. In a traditional partnership under the Partnership Act, partners have unlimited joint and several liability. The LLP offers flexibility in internal management like a partnership while providing corporate-style limited liability. For X, Y, and Z, an LLP is the most suitable structure as it combines the best of both worlds."
            }
          ]
        }
      ]
    },
    {
      "id": "l5",
      "num": 5,
      "title": "Companies Act, 2013",
      "concepts": [
        {
          "id": "c8",
          "title": "Incorporation and Types of Companies",
          "questions": [
            {
              "_no": 1,
              "q": "ABC Ltd. was incorporated with the object of manufacturing chemicals. The Memorandum of Association was properly drafted and registered. Later, the directors entered into a contract to purchase real estate for speculative purposes, which is outside the stated objects. The company now refuses to perform the contract. Can the other party enforce the contract against the company?",
              "keywords": [
                "ultra vires",
                "doctrine of ultra vires",
                "void",
                "not enforceable",
                "Memorandum of Association",
                "objects clause",
                "Section 4",
                "beyond powers",
                "nullity",
                "indoor management rule"
              ],
              "explanation": "Under the doctrine of ultra vires, any act beyond the powers conferred by the Memorandum of Association is void and cannot be ratified. Under Section 4 of the Companies Act, the objects clause defines the scope of the company's activities. Purchasing real estate for speculation is outside the stated object of manufacturing chemicals. The contract is ultra vires and void. The other party cannot enforce the contract against the company. However, the directors may be personally liable for breach of implied warranty of authority."
            }
          ]
        }
      ]
    },
    {
      "id": "l6",
      "num": 6,
      "title": "Negotiable Instruments Act, 1881",
      "concepts": [
        {
          "id": "c9",
          "title": "Bills of Exchange, Cheques, and Promissory Notes",
          "questions": [
            {
              "_no": 1,
              "q": "A issued a cheque to B dated January 15, 2025. B presented the cheque for payment on March 20, 2025. The bank refused payment stating that the cheque was stale. A claims that the cheque is valid for one year. Is the bank justified in refusing payment?",
              "keywords": [
                "Section 6",
                "cheque",
                "validity",
                "three months",
                "stale cheque",
                "reasonable time",
                "Section 22",
                "presentment",
                "bank justified",
                "not valid",
                "refusal proper"
              ],
              "explanation": "Under Section 22 of the Negotiable Instruments Act, a cheque must be presented for payment within a reasonable time. As per banking practice and RBI guidelines, a cheque is valid for three months from the date of issue. Since the cheque was issued on January 15 and presented on March 20 (more than 3 months later), it became a \"stale cheque.\" The bank is justified in refusing payment. A's claim that the cheque is valid for one year is incorrect."
            }
          ]
        }
      ]
    }
  ]
};

// ===== WORD COUNT HELPER (no regex) =====
function countWords(text) {
  if (!text || !text.trim()) return 0;
  var words = text.trim().split(' ');
  var count = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 0) count++;
  }
  return count;
}

// ===== RENDER LAW CHAPTERS =====
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
    html += '<div class="chapter-card" onclick="openLawConcepts(\'' + ch.id + '\')">' +
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
}

function closeLawChapters() {
  var el = document.getElementById('fs-law-chapters');
  if (el) el.classList.remove('open');
  setTimeout(function() {
    window.history.replaceState(null, null, '#practice');
  }, 350);
}

// ===== RENDER LAW CONCEPTS =====
function openLawConcepts(chapterId) {
  var chapter = null;
  for (var i = 0; i < LAW_DATA.chapters.length; i++) {
    if (LAW_DATA.chapters[i].id === chapterId) {
      chapter = LAW_DATA.chapters[i];
      break;
    }
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
    html += '<div class="chapter-card" onclick="openLawInstructions(\'' + chapterId + '\', \'' + concept.id + '\')">' +
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
      '<div>' +
        '<div class="chapter-back-title">Back to Chapters</div>' +
        '<div class="chapter-back-sub">Choose another chapter</div>' +
      '</div>' +
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

// ===== LAW INSTRUCTIONS =====
function openLawInstructions(chapterId, conceptId) {
  var chapter = null;
  for (var i = 0; i < LAW_DATA.chapters.length; i++) {
    if (LAW_DATA.chapters[i].id === chapterId) {
      chapter = LAW_DATA.chapters[i];
      break;
    }
  }
  if (!chapter) return;

  var concept = null;
  for (var i = 0; i < chapter.concepts.length; i++) {
    if (chapter.concepts[i].id === conceptId) {
      concept = chapter.concepts[i];
      break;
    }
  }
  if (!concept) return;

  var overlay = document.getElementById('fs-overlays');
  if (!overlay) return;

  var html = '<div class="fs-overlay" id="fs-law-instructions" style="z-index:80;">' +
    '<div class="fs-head">' +
      '<button class="back-btn" onclick="closeLawInstructions()">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<h2 style="font-size:1.1rem;font-weight:700;">Instructions</h2>' +
    '</div>' +
    '<div class="fs-content">' +
      '<div class="chapter-detail-header">' +
        '<div class="chapter-detail-num" style="background:linear-gradient(135deg,' + LAW_DATA.color + ',var(--accent2));">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>' +
        '</div>' +
        '<div class="chapter-detail-title">' + concept.title + '</div>' +
        '<div class="chapter-detail-meta">' + chapter.title + ' &bull; Law</div>' +
      '</div>' +
      '<div class="chapter-stats-row">' +
        '<div class="chapter-stat"><div class="chapter-stat-val">' + concept.questions.length + '</div><div class="chapter-stat-lbl">Questions</div></div>' +
        '<div class="chapter-stat"><div class="chapter-stat-val">3</div><div class="chapter-stat-lbl">Marks Each</div></div>' +
        '<div class="chapter-stat"><div class="chapter-stat-val">&infin;</div><div class="chapter-stat-lbl">Time Limit</div></div>' +
      '</div>' +
      '<div class="sec-label">Instructions</div>' +
      '<div class="card" style="margin-bottom:14px;">' +
        '<div style="font-size:.82rem;color:var(--txt3);line-height:1.6;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>' +
            '<span>Each question carries 3 marks total</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>' +
            '<span>Provision: 2 marks (keywords required)</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
            '<span>Facts: 0.5 marks (min 15 words)</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
            '<span>Conclusion: 0.5 marks (min 15 words)</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            '<span>Unlimited time &mdash; take your time to write</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="chapter-actions">' +
        '<button class="btn-primary" onclick="startLawQuiz(\'' + chapterId + '\', \'' + conceptId + '\')">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
          'Start Writing' +
        '</button>' +
        '<div class="chapter-back-card" onclick="closeLawInstructions();setTimeout(function(){openLawConcepts(\'' + chapterId + '\');},400);">' +
          '<div class="chapter-back-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
          '</div>' +
          '<div>' +
            '<div class="chapter-back-title">Back to Concepts</div>' +
            '<div class="chapter-back-sub">Choose another concept</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></div>';

  overlay.innerHTML = html;
  setTimeout(function() {
    var el = document.getElementById('fs-law-instructions');
    if (el) el.classList.add('open');
  }, 10);
}

function closeLawInstructions() {
  var el = document.getElementById('fs-law-instructions');
  if (el) el.classList.remove('open');
}

// ===== START LAW QUIZ =====
function startLawQuiz(chapterId, conceptId) {
  var chapter = null;
  for (var i = 0; i < LAW_DATA.chapters.length; i++) {
    if (LAW_DATA.chapters[i].id === chapterId) {
      chapter = LAW_DATA.chapters[i];
      break;
    }
  }
  if (!chapter) return;

  var concept = null;
  for (var i = 0; i < chapter.concepts.length; i++) {
    if (chapter.concepts[i].id === conceptId) {
      concept = chapter.concepts[i];
      break;
    }
  }
  if (!concept) return;

  lawState = {
    subject: 'law',
    chapter: chapterId,
    concept: conceptId,
    questions: [],
    currentQ: 0,
    answers: [],
    isFinished: false,
    evaluated: false,
    totalScore: 0,
    maxScore: concept.questions.length * 3
  };

  for (var i = 0; i < concept.questions.length; i++) {
    lawState.questions.push(concept.questions[i]);
  }

  lawState.answers = [];
  for (var i = 0; i < lawState.questions.length; i++) {
    lawState.answers.push({
      provision: '',
      facts: '',
      conclusion: '',
      score: 0,
      provisionScore: 0,
      factsScore: 0,
      conclusionScore: 0,
      keywordsFound: [],
      keywordsMissed: [],
      factsWordCount: 0,
      conclusionWordCount: 0
    });
  }

  var overlay = document.getElementById('mcq-overlay');
  if (overlay) {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  Router.hideBottomNav();
  Router.hideTopbar();

  renderLawQuestion();
}

// ===== RENDER LAW QUESTION =====
function renderLawQuestion() {
  var container = document.getElementById('mcq-overlay-inner');
  if (!container) return;

  var qIdx = lawState.currentQ;
  var question = lawState.questions[qIdx];
  var totalQ = lawState.questions.length;
  var progress = ((qIdx + 1) / totalQ) * 100;
  var userAnswer = lawState.answers[qIdx];

  var bmKey = 'law_' + lawState.chapter + '_' + qIdx;
  var bookmarksList = typeof getBookmarks === 'function' ? getBookmarks() : [];
  var isBookmarked = bookmarksList.some(function(b) { return b.key === bmKey; });


  var qWords = question.q.split(' ');
  var chunks = [];
  var wordsPerSlide = 100;
  for(var i=0; i<qWords.length; i+=wordsPerSlide) {
      chunks.push(qWords.slice(i, i+wordsPerSlide).join(' '));
  }
  
  var qHtml = '<div class="law-carousel-wrapper">' +
    '<div class="law-carousel-container" onscroll="window.updateLawDots(this)">';
  for(var i=0; i<chunks.length; i++){
      qHtml += '<div class="law-carousel-slide">' + chunks[i] + '</div>';
  }
  qHtml += '</div>';
  
  if(chunks.length > 1) {
      qHtml += '<div class="law-carousel-dots">';
      for(var i=0; i<chunks.length; i++){
          qHtml += '<div class="law-carousel-dot' + (i===0?' active':'') + '" onclick="window.scrollToLawSlide(this, ' + i + ')"></div>';
      }
      qHtml += '</div>';
  }
  qHtml += '</div>';

  var html = '<div class="law-header">' +

    '<button class="quiz-close-btn" onclick="confirmQuitLaw()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>' +
    '<div class="quiz-progress-info">' +
      '<div class="quiz-progress-text">Question ' + (qIdx + 1) + ' of ' + totalQ + '</div>' +
      '<div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' + progress + '%"></div></div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:6px;">' +
    '<button class="bm-btn ' + (isBookmarked ? 'bm-active' : '') + '" onclick="openBookmarkPopup(\'law\',' + qIdx + ')" title="Bookmark">' +
      '<svg viewBox="0 0 24 24" fill="' + (isBookmarked ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' +
    '</button>' +
    '<div class="quiz-timer law-timer">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
      '<span style="font-size:1.2rem;">&infin;</span>' +
    '</div>' +
    '</div>' +
  '</div>' +
  (window.liveXpBarHtml ? liveXpBarHtml() : '') +
  '<div class="law-body">' +
    '<div class="quiz-question-num">Question ' + (qIdx + 1) + '</div>' +
    qHtml +
    '<div class="law-marks-badge">3 Marks</div>' +
    '<div class="law-sections">' +
      '<div class="law-section">' +
        '<div class="law-section-header">' +
          '<div class="law-section-title">Provision</div>' +
          '<div class="law-section-marks">2 marks</div>' +
        '</div>' +
        '<div class="law-section-desc">State the relevant legal provision, section, and applicable law</div>' +
        '<textarea class="law-textarea" id="law-provision" placeholder="Write the legal provision here..." oninput="autoExpand(this)"' + (lawState.evaluated ? ' disabled' : '') + '>' + userAnswer.provision + '</textarea>' +
      '</div>' +
      '<div class="law-section">' +
        '<div class="law-section-header">' +
          '<div class="law-section-title">Facts</div>' +
          '<div class="law-section-marks">0.5 marks</div>' +
        '</div>' +
        '<div class="law-section-desc">Apply the facts of the case to the legal provision</div>' +
        '<textarea class="law-textarea" id="law-facts" placeholder="Apply the facts to the provision..." oninput="autoExpand(this)"' + (lawState.evaluated ? ' disabled' : '') + '>' + userAnswer.facts + '</textarea>' +
      '</div>' +
      '<div class="law-section">' +
        '<div class="law-section-header">' +
          '<div class="law-section-title">Conclusion</div>' +
          '<div class="law-section-marks">0.5 marks</div>' +
        '</div>' +
        '<div class="law-section-desc">Give your final conclusion and decision</div>' +
        '<textarea class="law-textarea" id="law-conclusion" placeholder="State your conclusion here..." oninput="autoExpand(this)"' + (lawState.evaluated ? ' disabled' : '') + '>' + userAnswer.conclusion + '</textarea>' +
      '</div>' +
    '</div>';

  if (lawState.evaluated) {
    html += renderLawEvaluationHTML(lawState.answers[qIdx], question);
  }

  html += '</div>';

  html += '<div class="quiz-footer"><div class="quiz-footer-row">';

  if (qIdx > 0) {
    html += '<button class="btn-secondary" onclick="prevLawQuestion()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      'Previous' +
    '</button>';
  }

  if (!lawState.evaluated) {
    html += '<button class="btn-primary" onclick="submitLawAnswer()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
      'Submit Answer' +
    '</button>';
  } else if (qIdx < totalQ - 1) {
    html += '<button class="btn-primary" onclick="nextLawQuestion()">' +
      'Next Question' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
    '</button>';
  } else {
    html += '<button class="btn-primary" onclick="finishLawQuiz()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
      'Finish' +
    '</button>';
  }

  html += '</div></div>';

  container.innerHTML = html;

  setTimeout(function() {
    var textareas = document.querySelectorAll('.law-textarea');
    for (var i = 0; i < textareas.length; i++) {
      autoExpand(textareas[i]);
    }
  }, 50);
}

// ===== AUTO EXPAND =====
function autoExpand(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// ===== RENDER EVALUATION HTML =====
function renderLawEvaluationHTML(ans, question) {
  
  var provisionColor =
    ans.provisionScore >= 2 ?
    'var(--green)' :
    ans.provisionScore >= 1.5 ?
    'var(--amber)' :
    'var(--red)';
  
  var factsColor =
    ans.factsScore >= 0.5 ?
    'var(--green)' :
    'var(--amber)';
  
  var conclusionColor =
    ans.conclusionScore >= 0.5 ?
    'var(--green)' :
    'var(--amber)';
  
  var scoreColor =
    ans.score >= 2.5 ?
    'var(--green)' :
    ans.score >= 1.5 ?
    'var(--amber)' :
    'var(--red)';
  
  var checkIcon =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="20 6 9 17 4 12"/>' +
    '</svg>';
  
  var crossIcon =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"/>' +
    '<line x1="6" y1="6" x2="18" y2="18"/>' +
    '</svg>';
  
  var html =
    '<div class="law-evaluation">' +
    
    '<div class="law-eval-header">' +
    '<div class="law-eval-title">Evaluation</div>' +
    '<div class="law-eval-score" style="color:' + scoreColor + ';">' +
    ans.score + '/3' +
    '</div>' +
    '</div>' +
    
    '<div class="law-eval-breakdown">';
  
  /* ---------- PROVISION ---------- */
  
  html +=
    '<div class="law-eval-item">' +
    
    '<div class="law-eval-item-header">' +
    '<span>Provision</span>' +
    '<span style="color:' + provisionColor + ';font-weight:700;">' +
    ans.provisionScore + '/2' +
    '</span>' +
    '</div>' +
    
    '<div class="law-eval-subtitle">' +
    'Keywords Analysis' +
    '</div>' +
    
    '<div class="law-keyword-list">';
  
  if (ans.keywordsFound.length > 0) {
    
    html +=
      '<div class="law-keyword-row found">' +
      '<span class="law-keyword-icon" style="color:var(--green);">' +
      checkIcon +
      '</span>' +
      '<span>' +
      '<strong>Found (' +
      ans.keywordsFound.length +
      ')</strong>: ' +
      ans.keywordsFound.join(', ') +
      '</span>' +
      '</div>';
    
  }
  
  if (ans.keywordsMissed.length > 0) {
    
    html +=
      '<div class="law-keyword-row missed">' +
      '<span class="law-keyword-icon" style="color:var(--red);">' +
      crossIcon +
      '</span>' +
      '<span>' +
      '<strong>Missed (' +
      ans.keywordsMissed.length +
      ')</strong>: ' +
      ans.keywordsMissed.join(', ') +
      '</span>' +
      '</div>';
    
  }
  
  var provisionNote = '';
  
  if (ans.provisionScore >= 2) {
    provisionNote =
      'All required keywords identified.';
  }
  else if (ans.provisionScore >= 1.5) {
    provisionNote =
      'Most important keywords identified.';
  }
  else {
    provisionNote =
      'Several legal keywords are missing.';
  }
  
  html +=
    '</div>' +
    
    '<div class="law-eval-note">' +
    provisionNote +
    '</div>' +
    
    '</div>';
  
  /* ---------- FACTS ---------- */
  
  html +=
    '<div class="law-eval-item">' +
    
    '<div class="law-eval-item-header">' +
    '<span>Facts</span>' +
    '<span style="color:' + factsColor + ';font-weight:700;">' +
    ans.factsScore + '/0.5' +
    '</span>' +
    '</div>' +
    
    '<div class="law-eval-detail">' +
    'Word count: <strong>' +
    ans.factsWordCount +
    '</strong>' +
    '</div>' +
    
    '<div class="law-eval-note">' +
    
    (ans.factsWordCount >= 15 ?
      '<span style="color:var(--green);display:flex;align-items:center;gap:6px;">' +
      checkIcon +
      ' Requirement met' +
      '</span>' :
      '<span style="color:var(--red);display:flex;align-items:center;gap:6px;">' +
      crossIcon +
      ' Minimum 15 words required' +
      '</span>') +
    
    '</div>' +
    
    '</div>';
  
  /* ---------- CONCLUSION ---------- */
  
  html +=
    '<div class="law-eval-item">' +
    
    '<div class="law-eval-item-header">' +
    '<span>Conclusion</span>' +
    '<span style="color:' + conclusionColor + ';font-weight:700;">' +
    ans.conclusionScore + '/0.5' +
    '</span>' +
    '</div>' +
    
    '<div class="law-eval-detail">' +
    'Word count: <strong>' +
    ans.conclusionWordCount +
    '</strong>' +
    '</div>' +
    
    '<div class="law-eval-note">' +
    
    (ans.conclusionWordCount >= 15 ?
      '<span style="color:var(--green);display:flex;align-items:center;gap:6px;">' +
      checkIcon +
      ' Requirement met' +
      '</span>' :
      '<span style="color:var(--red);display:flex;align-items:center;gap:6px;">' +
      crossIcon +
      ' Minimum 15 words required' +
      '</span>') +
    
    '</div>' +
    
    '</div>';
  
  html +=
    '</div>' +
    
    '<div class="law-explanation">' +
    '<div class="law-explanation-title">Model Explanation</div>' +
    '<div class="law-explanation-text">' +
    question.explanation +
    '</div>' +
    '</div>' +
    
    '</div>';
  
  return html;
}

// ===== SUBMIT =====
function submitLawAnswer() {
  var provision = document.getElementById('law-provision').value.trim();
  var facts = document.getElementById('law-facts').value.trim();
  var conclusion = document.getElementById('law-conclusion').value.trim();

  if (!provision && !facts && !conclusion) {
    showToast('Please write at least something before submitting');
    return;
  }

  var qIdx = lawState.currentQ;
  var question = lawState.questions[qIdx];

  var provisionLower = provision.toLowerCase();
  var keywordsFound = [];
  var keywordsMissed = [];

  for (var i = 0; i < question.keywords.length; i++) {
    if (provisionLower.indexOf(question.keywords[i].toLowerCase()) !== -1) {
      keywordsFound.push(question.keywords[i]);
    } else {
      keywordsMissed.push(question.keywords[i]);
    }
  }

  var provisionScore = 0;
  if (keywordsFound.length === question.keywords.length) {
    provisionScore = 2;
  } else if (keywordsFound.length >= Math.ceil(question.keywords.length * 0.6)) {
    provisionScore = 1.5;
  } else if (keywordsFound.length > 0) {
    provisionScore = 1;
  } else {
    provisionScore = 0;
  }

  var factsWordCount = countWords(facts);
  var factsScore = factsWordCount >= 15 ? 0.5 : factsWordCount > 0 ? 0.2 : 0;

  var conclusionWordCount = countWords(conclusion);
  var conclusionScore = conclusionWordCount >= 15 ? 0.5 : conclusionWordCount > 0 ? 0.2 : 0;

  var totalScore = provisionScore + factsScore + conclusionScore;

  lawState.answers[qIdx] = {
    provision: provision,
    facts: facts,
    conclusion: conclusion,
    score: totalScore,
    provisionScore: provisionScore,
    factsScore: factsScore,
    conclusionScore: conclusionScore,
    keywordsFound: keywordsFound,
    keywordsMissed: keywordsMissed,
    factsWordCount: factsWordCount,
    conclusionWordCount: conclusionWordCount
  };

  lawState.evaluated = true;
  lawState.totalScore += totalScore;

  var xpEarned = Math.min(3, Math.ceil(totalScore));
  if (xpEarned > 0 && window.awardXP) awardXP(xpEarned);

  if (window.practiceState && window.practiceState.active) {
    practiceState.lawAnswers[qIdx] = lawState.answers[qIdx];
    practiceState.lawEvaluated[qIdx] = true;
  }

  renderLawQuestion();
  showToast('Answer evaluated: ' + totalScore + '/3 marks');
}

// ===== NAVIGATION =====
function nextLawQuestion() {
  lawState.evaluated = false;
  if (window.practiceState && window.practiceState.active) {
    if (window.practiceState.currentQ < window.practiceState.questions.length - 1) {
      window.practiceState.currentQ++;
      window.renderMixedQuestion();
    }
    return;
  }
  if (lawState.currentQ < lawState.questions.length - 1) {
    lawState.currentQ++;
    renderLawQuestion();
  }
}

function prevLawQuestion() {
  lawState.evaluated = false;
  if (window.practiceState && window.practiceState.active) {
    if (window.practiceState.currentQ > 0) {
      window.practiceState.currentQ--;
      window.renderMixedQuestion();
    }
    return;
  }
  if (lawState.currentQ > 0) {
    lawState.currentQ--;
    renderLawQuestion();
  }
}

// ===== QUIT =====
function confirmQuitLaw() {
  if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
    quitLawQuiz();
  }
}

function quitLawQuiz() {
  if (window.practiceState && window.practiceState.active) {
    window.practiceState.active = false;
  }
  var overlay = document.getElementById('mcq-overlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
  Router.showBottomNav();
  Router.showTopbar();
  
  if (lawState.chapter === 'bookmark' || (window.practiceState && window.practiceState.active)) {
    // Return where we came from
  } else {
    setTimeout(function() { openLawInstructions(lawState.chapter, lawState.concept); }, 350);
  }
}

// ===== FINISH =====
function finishLawQuiz() {
  if (window.practiceState && window.practiceState.active) {
    if (window.practiceState.currentQ < window.practiceState.questions.length - 1) {
      window.practiceState.currentQ++;
      window.renderMixedQuestion();
      return;
    } else {
      window.practiceState.active = false;
    }
  }
  lawState.isFinished = true;
  
  if (AppState && AppState.user) {
    var passingAnswers = 0;
    for (var i = 0; i < lawState.answers.length; i++) {
      if (lawState.answers[i].score >= 1.5) passingAnswers++;
    }
    

    AppState.questionsAttempted = (AppState.questionsAttempted || 0) + lawState.questions.length;
    AppState.correctAnswers = (AppState.correctAnswers || 0) + passingAnswers;
    AppState.accuracy = AppState.questionsAttempted > 0 ? Math.round((AppState.correctAnswers / AppState.questionsAttempted) * 100) : 0;
    
    if(!AppState.settings) AppState.settings = {};
    if(!AppState.settings.subjectStats) AppState.settings.subjectStats = {};
    const subj = 'business laws'; // Make it match the default string
    if(!AppState.settings.subjectStats[subj]) AppState.settings.subjectStats[subj] = { attempted: 0, correct: 0 };
    AppState.settings.subjectStats[subj].attempted += lawState.questions.length;
    AppState.settings.subjectStats[subj].correct += passingAnswers;
    if(window.saveSettings) saveSettings();

    
    if (window.saveUser) saveUser();
  }
  
  renderLawResults();
}

// ===== RESULTS =====
function renderLawResults() {
  var container = document.getElementById('mcq-overlay-inner');
  if (!container) return;

  var totalQ = lawState.questions.length;
  var maxScore = lawState.maxScore;
  var obtainedScore = 0;
  for (var i = 0; i < lawState.answers.length; i++) {
    obtainedScore += lawState.answers[i].score;
  }
  var percentage = Math.round((obtainedScore / maxScore) * 100);
  var scoreDeg = (percentage / 100) * 360;

  var strongAreas = [];
  var weakAreas = [];
  for (var i = 0; i < lawState.answers.length; i++) {
    if (lawState.answers[i].score >= 2.5) strongAreas.push(i + 1);
    if (lawState.answers[i].score < 1.5) weakAreas.push(i + 1);
  }

  var html = '<div class="quiz-header">' +
    '<button class="quiz-close-btn" onclick="closeLawResults()">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>' +
    '<h2 style="font-size:1rem;font-weight:700;">Results</h2>' +
    '<div style="width:36px;"></div>' +
  '</div>' +
  '<div class="quiz-body">' +
    '<div class="quiz-result-header">' +
      '<div class="quiz-result-score" style="--score-deg:' + scoreDeg + 'deg;">' +
        '<div class="quiz-result-score-inner">' + percentage + '%</div>' +
      '</div>' +
      '<div class="quiz-result-title">' + (percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Practicing!') + '</div>' +
      '<div class="quiz-result-subtitle">You scored ' + obtainedScore + ' out of ' + maxScore + '</div>' +
    '</div>' +
    '<div class="quiz-result-stats">' +
      '<div class="quiz-result-stat correct"><div class="qrs-val">' + totalQ + '</div><div class="qrs-lbl">Questions</div></div>' +
      '<div class="quiz-result-stat" style="border-left:3px solid var(--accent);"><div class="qrs-val" style="color:var(--accent2);">' + obtainedScore + '</div><div class="qrs-lbl">Marks Obtained</div></div>' +
      '<div class="quiz-result-stat skipped"><div class="qrs-val">' + maxScore + '</div><div class="qrs-lbl">Max Marks</div></div>' +
    '</div>' +
    '<div class="sec-label">Performance Analysis</div>' +
    '<div class="card" style="margin-bottom:14px;">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:4px 0;">' +
        '<div>' +
          '<div style="font-size:.75rem;color:var(--green);font-weight:600;margin-bottom:4px;">&#10003; Strong Areas</div>' +
          '<div style="font-size:.82rem;color:var(--txt3);">' + (strongAreas.length > 0 ? 'Questions ' + strongAreas.join(', ') : 'No strong areas yet') + '</div>' +
        '</div>' +
        '<div>' +
          '<div style="font-size:.75rem;color:var(--red);font-weight:600;margin-bottom:4px;">&#10007; Weak Areas</div>' +
          '<div style="font-size:.82rem;color:var(--txt3);">' + (weakAreas.length > 0 ? 'Questions ' + weakAreas.join(', ') : 'No weak areas') + '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="sec-label">Question-wise Performance</div>' +
    '<div class="quiz-review-list">';

  for (var i = 0; i < lawState.questions.length; i++) {
    var q = lawState.questions[i];
    var ans = lawState.answers[i];
    var statusClass = ans.score >= 2.5 ? 'correct' : ans.score >= 1.5 ? 'skipped' : 'wrong';
    var statusColor = ans.score >= 2.5 ? 'var(--green)' : ans.score >= 1.5 ? 'var(--amber)' : 'var(--red)';

    html += '<div class="quiz-review-item ' + statusClass + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '<div class="qr-q" style="flex:1;">' + (i + 1) + '. ' + q.q.substring(0, 80) + '...</div>' +
        '<div style="font-size:.85rem;font-weight:700;color:' + statusColor + ';margin-left:8px;">' + ans.score + '/3</div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;font-size:.72rem;color:var(--txt3);">' +
        '<span>Provision: ' + ans.provisionScore + '/2</span>' +
        '<span>Facts: ' + ans.factsScore + '/0.5</span>' +
        '<span>Conclusion: ' + ans.conclusionScore + '/0.5</span>' +
      '</div>' +
      '<div style="margin-top:8px;font-size:.72rem;color:var(--txt3);">' +
        'Keywords: ' + ans.keywordsFound.length + '/' + q.keywords.length + ' found' +
      '</div>' +
    '</div>';
  }

  html += '</div><div style="height:20px;"></div></div>' +
    '<div class="quiz-footer"><div class="quiz-footer-row">' +
      '<button class="btn-secondary" onclick="retakeLawQuiz()">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>' +
        'Retake' +
      '</button>' +
      '<button class="btn-primary" onclick="closeLawResults()">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' +
        'Done' +
      '</button>' +
    '</div></div>';

  container.innerHTML = html;
}

function closeLawResults() {
  var overlay = document.getElementById('mcq-overlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
  Router.showBottomNav();
  Router.showTopbar();
  Router.navigate('practice');
}

function retakeLawQuiz() {
  startLawQuiz(lawState.chapter, lawState.concept);
}

// ===== EXPOSE =====
window.renderLawChapters = renderLawChapters;
window.closeLawChapters = closeLawChapters;
window.openLawConcepts = openLawConcepts;
window.closeLawConcepts = closeLawConcepts;
window.openLawInstructions = openLawInstructions;
window.closeLawInstructions = closeLawInstructions;
window.startLawQuiz = startLawQuiz;
window.autoExpand = autoExpand;
window.submitLawAnswer = submitLawAnswer;
window.nextLawQuestion = nextLawQuestion;
window.prevLawQuestion = prevLawQuestion;
window.confirmQuitLaw = confirmQuitLaw;
window.quitLawQuiz = quitLawQuiz;
window.finishLawQuiz = finishLawQuiz;
window.renderLawResults = renderLawResults;
window.closeLawResults = closeLawResults;
window.retakeLawQuiz = retakeLawQuiz;

// ===== CAROUSEL DOTS =====
window.updateLawDots = function(el) {
    var index = Math.round(el.scrollLeft / (el.clientWidth + 16 || 1));
    if(el.nextElementSibling && el.nextElementSibling.classList.contains('law-carousel-dots')) {
        var dots = el.nextElementSibling.querySelectorAll('.law-carousel-dot');
        for(var i=0; i<dots.length; i++){
            dots[i].className = 'law-carousel-dot' + (i===index?' active':'');
        }
    }
}
window.scrollToLawSlide = function(dot, index) {
    var container = dot.parentElement.previousElementSibling;
    container.scrollTo({ left: index * (container.clientWidth + 16), behavior: 'smooth' });
}


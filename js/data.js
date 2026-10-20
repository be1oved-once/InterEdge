// ============================================
// InterEdge - Core CA Intermediate Data Engine
// Aligned with ICAI New Scheme (May 2027 & Beyond)
// ============================================

// ===== 6 CA INTERMEDIATE PAPERS & QUESTION BANK =====
const MCQ_DATA = {
  // Paper 1: Advanced Accounting (MCQ Only - Pure Practical & AS)
  adv_acc: {
    id: 'adv_acc',
    paper: 'Paper 1',
    group: 'Group 1',
    name: 'Advanced Accounting',
    shortName: 'Accounts',
    color: '#3b82f6',
    practiceType: 'mcq_only',
    tag: 'MCQ Only',
    subTag: 'Practical AS & Numericals',
    weightage: 'Paper 1 • 100 Marks',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/></svg>`,
    chapters: [
      {
        id: 'acc_ch1',
        num: 1,
        title: 'Accounting Standards & Framework (AS 1, 2, 3, 10, 16)',
        weightage: '12-16 Marks',
        type: 'mcq_only',
        concepts: [
          {
            id: 'acc_c1_1',
            title: 'Disclosure of Accounting Policies (AS 1)',
            weightage: '2-4 Marks',
            difficulty: 'Core Foundation',
            rules: [
              'Fundamental assumptions (Going Concern, Consistency, Accrual) are presumed; disclosure is required only if NOT followed.',
              'Major changes in accounting policies with material financial impact must be quantified and disclosed in the notes.',
              'Prudence, Substance over Form, and Materiality govern selection of accounting policies.'
            ],
            qCount: 2
          },
          {
            id: 'acc_c1_2',
            title: 'Valuation of Inventories (AS 2)',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Inventories are valued at Lower of Cost or Net Realizable Value (NRV) on an item-by-item basis.',
              'Abnormal amounts of wasted material, storage costs, and administrative overheads must be excluded from cost.',
              'Materials held for use in production are NOT written down below cost if finished goods are expected to be sold at or above cost.'
            ],
            qCount: 3
          },
          {
            id: 'acc_c1_3',
            title: 'Cash Flow Statement (AS 3)',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Operating activities reflect principal revenue-producing operations; Direct and Indirect methods permitted.',
              'Financing activities involve changes in size/composition of owners capital and borrowings (interest/dividend paid).',
              'Cash and Cash Equivalents exclude shares and investments with maturities exceeding 90 days from acquisition.'
            ],
            qCount: 2
          },
          {
            id: 'acc_c1_4',
            title: 'Property, Plant and Equipment (AS 10)',
            weightage: '4-6 Marks',
            difficulty: 'Moderate',
            rules: [
              'Recognize PPE if future economic benefits will flow to enterprise and cost can be measured reliably.',
              'Initial cost comprises purchase price, import duties, and directly attributable costs of site preparation.',
              'Component accounting is mandatory for significant parts with differing useful lives.'
            ],
            qCount: 2
          },
          {
            id: 'acc_c1_5',
            title: 'Borrowing Costs (AS 16)',
            weightage: '2-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'Capitalize borrowing costs directly attributable to acquisition/construction of a qualifying asset (takes substantial period).',
              'Suspension of capitalization is mandatory during extended periods of interrupted active development.',
              'Cessation of capitalization occurs when substantially all activities necessary for intended use are complete.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'As per AS 2 (Revised), which of the following costs should NOT be included in the valuation of inventory?',
            options: ['Cost of purchase and freight inward', 'Abnormal amounts of wasted materials and labour', 'Direct labour costs', 'Fixed production overheads based on normal capacity'],
            correct: 1,
            explanation: 'Under AS 2, abnormal amounts of wasted material, labour, or other production costs, storage costs (unless necessary in production process), and administrative/selling overheads are excluded from inventory costs.',
            marks: 2,
            xp: 20
          },
          {
            q: 'Under AS 16 "Borrowing Costs", capitalization of borrowing costs should be suspended during:',
            options: ['Brief temporary delays', 'Extended periods in which active development of qualifying asset is interrupted', 'Periods when substantial technical and administrative work is underway', 'Normal seasonal delays'],
            correct: 1,
            explanation: 'Capitalization of borrowing costs shall be suspended during extended periods in which active development of a qualifying asset is interrupted, as mandated by AS 16.',
            marks: 2,
            xp: 20
          },
          {
            q: 'In Cash Flow Statement (AS 3), interest paid by a manufacturing enterprise is classified as:',
            options: ['Operating activity', 'Financing activity', 'Investing activity', 'Cash and Cash Equivalents'],
            correct: 1,
            explanation: 'For a non-financial enterprise, interest paid and dividend paid are cash flows from financing activities because they are costs of obtaining capital resources.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_acc_1',
            caseTitle: 'Apex Manufacturing Ltd — Inventory Valuation & PPE Capitalization',
            subject: 'adv_acc',
            chapterId: 'acc_ch1',
            totalMarks: 6,
            readingTime: 6,
            pages: [
              {
                pageNum: 1,
                tabTitle: 'Entity Background & Plant Work',
                title: '1. Plant Construction & Interrupted Development',
                content: 'Apex Manufacturing Ltd began constructing a captive power plant on 1st April 2024 with a sanctioned project loan of ₹50,00,000 bearing 10% annual interest. The project constitutes a qualifying asset under AS 16.\n\nDue to a localized environmental dispute, active physical construction was halted completely for 4 consecutive months between July and October 2024. No technical or administrative work was carried out during this interruption period. Construction resumed in November 2024.'
              },
              {
                pageNum: 2,
                tabTitle: 'Inventory Records & Raw Materials',
                title: '2. Raw Material Batches & Net Realizable Value',
                content: 'At financial year-end (31st March 2025), Apex held 10,000 units of raw material X purchased at ₹120 per unit (replacement cost ₹95 per unit).\n\nThe finished product Y, which incorporates raw material X, has a manufacturing cost of ₹250 per unit. Due to market competition, the finished product Y can now be sold at only ₹230 per unit, with estimated selling costs of ₹10 per unit.'
              }
            ],
            narrative: 'Apex Manufacturing Ltd began constructing a captive power plant on 1st April 2024 with a sanctioned project loan of ₹50,00,000 bearing 10% annual interest. The project constitutes a qualifying asset under AS 16. Due to a localized environmental dispute, active physical construction was halted completely for 4 consecutive months between July and October 2024. No technical or administrative work was carried out during this interruption period. Construction resumed in November 2024.\n\nAt financial year-end (31st March 2025), Apex held 10,000 units of raw material X purchased at ₹120 per unit (replacement cost ₹95 per unit). The finished product Y, which incorporates raw material X, has a manufacturing cost of ₹250 per unit. Due to market competition, the finished product Y can now be sold at only ₹230 per unit, with estimated selling costs of ₹10 per unit.',
            questions: [
              {
                q: 'What is the amount of borrowing costs that Apex Ltd must capitalize for the captive power plant in FY 2024-25?',
                options: ['₹5,00,000 (Full year)', '₹3,33,333 (8 active months)', '₹1,66,667 (4 idle months only)', 'Nil, because environmental disputes cancel capitalization'],
                correct: 1,
                explanation: 'AS 16 mandates that capitalization of borrowing costs must be suspended during extended interruptions in active development. 4 months of interest (₹1,66,667) must be expensed to P&L, leaving ₹3,33,333 to be capitalized.',
                pageRef: 'Page 1 • Section 1 (Plant Construction)',
                marks: 2,
                xp: 25
              },
              {
                q: 'At what value per unit should raw material X be recognized on the balance sheet as per AS 2?',
                options: ['₹120 per unit (Historical cost)', '₹95 per unit (Replacement cost)', '₹220 per unit (Finished goods NRV)', '₹107.50 per unit (Average cost)'],
                correct: 1,
                explanation: 'Under AS 2, materials held for use in production are written down to replacement cost if the finished product in which they are incorporated is expected to be sold below total cost. Finished product cost is ₹250 while NRV is ₹220, so raw materials must be written down to replacement cost of ₹95.',
                pageRef: 'Page 2 • Section 2 (Inventory Records)',
                marks: 2,
                xp: 25
              },
              {
                q: 'How should the interest expensed during the 4 months of halted construction appear in the Cash Flow Statement (AS 3)?',
                options: ['Operating Cash Outflow', 'Financing Cash Outflow', 'Investing Cash Outflow', 'Non-cash adjustment to profit before tax'],
                correct: 1,
                explanation: 'Under AS 3, interest paid is categorized as a Financing Cash Outflow regardless of whether it is capitalized to assets or expensed to the Profit & Loss statement.',
                pageRef: 'Page 1 & General AS 3 classification',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            id: 'fc_acc_1',
            topic: 'AS 2 — Net Realizable Value (NRV) Rule',
            examTag: 'ICAI Exam Standard • 4 Marks',
            marks: 4,
            prompt: 'Explain the circumstances under which raw materials and supplies held for production are written down below cost as per AS 2.',
            provision: 'Paragraph 24 of AS 2 mandates that materials and other supplies held for use in the production of inventories are NOT written down below cost if the finished products in which they are incorporated are expected to be sold at or above cost.',
            analysis: 'However, when there has been a decline in the price of materials and it is estimated that the cost of finished products will exceed net realizable value, the materials are written down to net realizable value, with replacement cost being the best available measure.',
            conclusion: 'Thus, write-down of raw materials is strictly contingent on the profitability and recoverable value of the ultimate finished product.',
            keywords: ['Lower of Cost or NRV', 'Materials held for production', 'Replacement Cost', 'Finished Goods Profitability'],
            rubric: [
              { step: 'General rule of cost preservation for materials', marks: 1.5 },
              { step: 'Exception when finished goods sell below cost', marks: 1.5 },
              { step: 'Use of replacement cost as best measure', marks: 1.0 }
            ]
          }
        ]
      },
      {
        id: 'acc_ch2',
        num: 2,
        title: 'Company Accounts: Buyback of Shares & Internal Reconstruction',
        weightage: '10-14 Marks',
        type: 'mcq_only',
        concepts: [
          {
            id: 'acc_c2_1',
            title: 'Sec 68 Buy Back Conditions & Sources',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Buyback sources: Free reserves, Securities Premium account, or proceeds of any shares/specified securities (not same kind).',
              'Quantum limit: Max 25% of aggregate paid-up capital and free reserves in any financial year.',
              'Post-buyback Debt-to-Equity ratio shall not exceed 2:1 for non-banking entities.'
            ],
            qCount: 2
          },
          {
            id: 'acc_c2_2',
            title: 'Solvency Declarations & CRR Creation',
            weightage: '2-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'Affidavit of Solvency (Form SH-9) must be filed with ROC and SEBI prior to executing buyback.',
              'Nominal value of shares bought back out of free reserves/securities premium must be transferred to Capital Redemption Reserve (CRR).',
              'CRR can only be utilized for issuing fully paid bonus shares.'
            ],
            qCount: 2
          },
          {
            id: 'acc_c2_3',
            title: 'Capital Reduction Account in Reconstruction',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Internal reconstruction requires confirmation of Tribunal under Section 66 of Companies Act 2013.',
              'Sacrifices by shareholders, debenture-holders, and creditors are credited to Capital Reduction Account.',
              'Any balance remaining in Capital Reduction after writing off fictitious assets and accumulated losses is transferred to Capital Reserve.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'Under Section 68 of the Companies Act 2013, the debt-equity ratio after buy-back of shares shall not exceed:',
            options: ['1 : 1', '2 : 1', '1.5 : 1', '3 : 1'],
            correct: 1,
            explanation: 'Under Section 68(2)(d), the ratio of the aggregate of secured and unsecured debts owed by the company after buy-back must not be more than twice the paid-up capital and its free reserves (2:1).',
            marks: 2,
            xp: 20
          },
          {
            q: 'In a scheme of internal reconstruction, the credit balance remaining in the Capital Reduction Account after writing off accumulated losses is transferred to:',
            options: ['General Reserve', 'Capital Reserve', 'Securities Premium', 'Profit and Loss Account'],
            correct: 1,
            explanation: 'Any surplus credit balance left in the Capital Reduction Account represents a capital gain and must be transferred to the Capital Reserve account.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_acc_2',
            caseTitle: 'Sterling Dynamics Ltd — Buyback Limits & CRR Accounting',
            subject: 'adv_acc',
            chapterId: 'acc_ch2',
            totalMarks: 6,
            readingTime: 6,
            pages: [
              {
                pageNum: 1,
                tabTitle: 'Balance Sheet & Capital Base',
                title: '1. Capital Structure & Reserve Balances',
                content: 'Sterling Dynamics Ltd has a paid-up equity capital of ₹80,00,000 (8,00,000 shares of ₹10 each), Securities Premium of ₹40,00,000, and General Reserve of ₹30,00,000. It has outstanding long-term debt of ₹1,60,00,000.\n\nThe company proposes to buy back 1,50,000 equity shares at an agreed offer price of ₹30 per share using available free reserves and securities premium.'
              },
              {
                pageNum: 2,
                tabTitle: 'Post-Buyback Ratios & Statutory Limits',
                title: '2. Debt-Equity Test & CRR Impact',
                content: 'The board of directors passed a resolution approving the buyback without convening an extraordinary general meeting. The finance controller pointed out that post-buyback capital and reserves must maintain the statutory 2:1 debt-equity ratio under Section 68(2)(d).\n\nFurthermore, the nominal value of equity shares extinguished must be transferred from free reserves to the Capital Redemption Reserve (CRR).'
              }
            ],
            narrative: 'Sterling Dynamics Ltd has a paid-up equity capital of ₹80,00,000 (8,00,000 shares of ₹10 each), Securities Premium of ₹40,00,000, and General Reserve of ₹30,00,000. It has outstanding long-term debt of ₹1,60,00,000. The company proposes to buy back 1,50,000 equity shares at an agreed offer price of ₹30 per share using available free reserves and securities premium. The board passed a resolution approving buyback without convening an EGM. The debt-equity test under Sec 68(2)(d) must be verified.',
            questions: [
              {
                q: 'What is the maximum number of equity shares that can be bought back under the 25% outstanding equity shares limit?',
                options: ['2,00,000 shares', '1,50,000 shares', '2,50,000 shares', '1,00,000 shares'],
                correct: 0,
                explanation: 'Under Section 68(2)(c), the buyback of equity shares in any financial year shall not exceed 25% of the total paid-up equity capital. 25% of 8,00,000 shares = 2,00,000 shares.',
                pageRef: 'Page 1 • Section 1 (Capital Structure)',
                marks: 2,
                xp: 25
              },
              {
                q: 'What amount must be transferred to the Capital Redemption Reserve (CRR) upon completion of the buyback of 1,50,000 shares?',
                options: ['₹45,00,000 (Total purchase price)', '₹15,00,000 (Nominal face value)', '₹30,00,000 (Premium amount)', 'Nil, because securities premium was used'],
                correct: 1,
                explanation: 'Under Section 69, an amount equal to the nominal value of the shares bought back out of free reserves or securities premium (1,50,000 shares × ₹10 = ₹15,00,000) must be transferred to CRR.',
                pageRef: 'Page 2 • Section 2 (CRR Impact)',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: []
      }
    ]
  },

  // Paper 2: Corporate and Other Laws (Hybrid: MCQ + Theory Active Recall)
  law: {
    id: 'law',
    paper: 'Paper 2',
    group: 'Group 1',
    name: 'Corporate & Other Laws',
    shortName: 'Law',
    color: '#8b5cf6',
    practiceType: 'hybrid',
    tag: 'MCQ + Theory',
    subTag: 'Company Law & Legal Drafting',
    weightage: 'Paper 2 • 100 Marks',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    chapters: [
      {
        id: 'law_ch1',
        num: 1,
        title: 'Company Incorporation & Incidental Matters (Sec 1-22)',
        weightage: '10-14 Marks',
        type: 'hybrid',
        concepts: [
          {
            id: 'law_c1_1',
            title: 'Doctrine of Ultra Vires',
            weightage: '3-5 Marks',
            difficulty: 'High Yield',
            rules: [
              'Any act outside the purpose of the Memorandum of Association is ultra vires and wholly void ab initio.',
              'An act ultra vires the company CANNOT be ratified even by the unanimous consent of all shareholders.',
              'Directors are personally liable to third parties for misrepresenting corporate capacity (Ashbury Railway Carriage case).'
            ],
            qCount: 2
          },
          {
            id: 'law_c1_2',
            title: 'Doctrine of Indoor Management & Turquand Rule',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Outsiders are entitled to assume that internal regulations specified in Articles have been duly complied with.',
              'Exceptions: Actual knowledge of irregularity, suspicious circumstances putting party on inquiry, or forgery.',
              'Forgery renders the document a complete nullity (Ruben v Great Fingall Consolidated).'
            ],
            qCount: 3
          },
          {
            id: 'law_c1_3',
            title: 'Alteration of MOA & Registered Office Shift (Sec 12 & 13)',
            weightage: '3-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'Shifting registered office outside state limits requires special resolution and Central Government (RD) approval.',
              'RD order must be filed with ROCs of both states within 60 days.',
              'Creditor consent or security for claim is mandatory prior to state shifting.'
            ],
            qCount: 2
          },
          {
            id: 'law_c1_4',
            title: 'Section 8 Companies (Non-Profit Organizations)',
            weightage: '3-5 Marks',
            difficulty: 'High Yield',
            rules: [
              'Formed for promotion of commerce, art, science, charity; application of profits strictly to objects.',
              'Payment of dividend to members is completely prohibited.',
              'Cannot alter MOA/AOA without prior written approval of Central Government (RD).'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'Under the Companies Act 2013, an act which is ultra vires the company:',
            options: ['Can be ratified by passing a special resolution', 'Can be ratified with the consent of all shareholders', 'Cannot be ratified at all and is void ab initio', 'Can be validated by the Central Government'],
            correct: 2,
            explanation: 'An act ultra vires the company is completely outside the Memorandum and void ab initio; it cannot be ratified even by unanimous consent of all shareholders (Ashbury Railway Carriage case).',
            marks: 2,
            xp: 20
          },
          {
            q: 'Which of the following is NOT an exception to the Doctrine of Indoor Management (Turquand Rule)?',
            options: ['Actual or constructive knowledge of irregularity', 'Suspicious circumstances putting on inquiry', 'Forgery in execution', 'Ignorance of the company Memorandum'],
            correct: 3,
            explanation: 'Ignorance of the Memorandum is governed by Constructive Notice, not an exception to Indoor Management. The recognized exceptions to Turquand Rule are Knowledge of irregularity, Suspicion, and Forgery.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_law_1',
            caseTitle: 'Zenith Logistics Ltd — Unauthorized Borrowing & Turquand Defense',
            subject: 'law',
            chapterId: 'law_ch1',
            totalMarks: 6,
            readingTime: 6,
            pages: [
              {
                pageNum: 1,
                tabTitle: 'Entity Background & AOA Limit',
                title: '1. Borrowing Authority & Board Actions',
                content: 'The Articles of Association of Zenith Logistics Ltd authorized the Board of Directors to borrow funds up to ₹1,00,00,000 on behalf of the company, with borrowing beyond that sum requiring prior approval by an Ordinary Resolution at a General Meeting.\n\nThe Directors, without convening a General Meeting or obtaining shareholder approval, approached Pioneer Finance Ltd and executed a mortgage bond for ₹1,80,00,000 under the common seal of the company.'
              },
              {
                pageNum: 2,
                tabTitle: 'Mortgage Deed & Legal Defense',
                title: '2. Lender Due Diligence & Turquand Defense',
                content: 'Pioneer Finance Ltd did not inspect the register of resolutions but verified that borrowing was within the general power of the company as per the MOA.\n\nWhen Zenith Logistics Ltd defaulted, the company denied liability for the excess ₹80,00,000, arguing the mortgage was ultra vires the directors. Pioneer Finance Ltd raised the defense of the Doctrine of Indoor Management.'
              }
            ],
            narrative: 'The Articles of Association of Zenith Logistics Ltd authorized the Board of Directors to borrow funds up to ₹1,00,00,000 on behalf of the company, with borrowing beyond that sum requiring prior approval by an Ordinary Resolution at a General Meeting. The Directors, without convening a General Meeting or obtaining shareholder approval, approached Pioneer Finance Ltd and executed a mortgage bond for ₹1,80,00,000 under the common seal of the company. Pioneer Finance Ltd did not inspect the register of resolutions but verified that borrowing was within the general power of the company as per the MOA. When Zenith Logistics Ltd defaulted, the company denied liability for the excess ₹80,00,000, arguing the mortgage was ultra vires the directors.',
            questions: [
              {
                q: 'Can Pioneer Finance Ltd enforce the mortgage against Zenith Logistics Ltd under the Doctrine of Indoor Management?',
                options: [
                  'Yes, fully enforceable because internal procedural compliance is presumed',
                  'No, unenforceable because external lenders have constructive notice of AOA borrowing limits',
                  'Only enforceable up to ₹1,00,00,000',
                  'Void ab initio against both parties'
                ],
                correct: 0,
                explanation: 'Under Royal British Bank v. Turquand, lenders who observe the public documents (AOA allows borrowing with a resolution) are entitled to assume the internal resolution was duly passed.',
                pageRef: 'Page 2 • Section 2 (Lender Due Diligence)',
                marks: 2,
                xp: 25
              },
              {
                q: 'Which exception to the Turquand Rule would have invalidated Pioneer Finance’s defense?',
                options: [
                  'Constructive notice of public documents',
                  'Actual knowledge of the irregularity or suspicious circumstances',
                  'Company seal was slightly faded',
                  'Absence of notary attestation'
                ],
                correct: 1,
                explanation: 'The protection of Indoor Management is lost if the outsider has actual knowledge of non-compliance or if circumstances put a prudent person on inquiry.',
                pageRef: 'Page 2 • Paragraph 2',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            id: 'fc_law_1',
            topic: 'Royal British Bank v. Turquand (Indoor Management)',
            examTag: 'ICAI May 2024 Exam • 5 Marks',
            marks: 5,
            prompt: 'Explain the 3-step ICAI presentation when an outsider deals with a company whose directors breached an internal limit.',
            provision: 'Section 399 of Companies Act 2013 deals with inspection of documents. While outsiders have constructive notice of MOA/AOA, the Doctrine of Indoor Management protects them regarding internal management regularity.',
            analysis: 'Outsiders are bound to read public documents to ensure transactions conform to the company constitution, but they are not bound to inquire whether internal secret resolutions have been satisfied.',
            conclusion: 'The transaction is valid and binding on the company unless the outsider acted with forgery, negligence, or actual knowledge.',
            keywords: ['Section 399', 'Constructive Notice', 'Indoor Management', 'Presumption of Regularity', 'Suspicious Circumstances'],
            rubric: [
              { step: 'Citation of Section 399 & Turquand Rule ratio', marks: 1.5 },
              { step: 'Analysis of internal approval vs public documents', marks: 2.0 },
              { step: 'Conclusion on enforceability & exceptions', marks: 1.5 }
            ]
          },
          {
            id: 'fc_law_2',
            topic: 'Section 8 Company — Alteration of Object Clause',
            examTag: 'ICAI RTP May 2024 • 5 Marks',
            marks: 5,
            prompt: 'Can a Section 8 Company alter its object clause by merely passing a special resolution? Outline the complete statutory procedure under the Companies Act 2013.',
            provision: 'Under Section 8(4)(i) of the Companies Act 2013, a company registered under Section 8 shall not alter the provisions of its memorandum or articles except with previous approval of the Central Government (delegated to Regional Director).',
            analysis: 'Unlike a regular commercial company which alters its object clause under Section 13 solely by passing a Special Resolution, a Section 8 company requires prior written sanction because the original incorporation was granted based on non-profit benevolent objects.',
            conclusion: 'Any unilateral alteration passed without Regional Director sanction is null and void, and risks revocation of license under Section 8(6).',
            keywords: ['Section 8(4)(i)', 'Prior Central Government Approval', 'Regional Director', 'License Revocation', 'Special Resolution'],
            rubric: [
              { step: 'Citation of Section 8(4)(i) restriction', marks: 1.5 },
              { step: 'Distinction from general Section 13 procedure', marks: 2.0 },
              { step: 'Consequences of unauthorized alteration', marks: 1.5 }
            ]
          }
        ]
      },
      {
        id: 'law_ch2',
        num: 2,
        title: 'Management & Administration (Sec 88-122: AGM, EGM, Resolutions)',
        weightage: '12-16 Marks',
        type: 'hybrid',
        concepts: [
          {
            id: 'law_c2_1',
            title: 'Annual General Meeting (Sec 96)',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'First AGM within 9 months from closing of first financial year; subsequent AGMs within 6 months of FY end.',
              'Maximum gap between two consecutive AGMs shall not exceed 15 months.',
              'Registrar can extend AGM time by up to 3 months for special reasons, but NOT for first AGM.'
            ],
            qCount: 2
          },
          {
            id: 'law_c2_2',
            title: 'Notice Period & Short Notice (Sec 101)',
            weightage: '3-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'General meeting requires clear 21 days notice in writing or electronic mode.',
              'Clear days excludes day of service and day of meeting (plus 48 hours if sent by post).',
              'Shorter notice valid if consented to by at least 95% of members entitled to vote at AGM.'
            ],
            qCount: 2
          },
          {
            id: 'law_c2_3',
            title: 'Quorum for Meetings (Sec 103)',
            weightage: '3-5 Marks',
            difficulty: 'High Yield',
            rules: [
              'Public company quorum: 5 members (if members <= 1000), 15 (if 1001-5000), 30 (if > 5000).',
              'Private company quorum: 2 members personally present.',
              'Quorum must be present within 30 minutes from appointed time, else meeting stands adjourned to next week.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'Under Section 103 of Companies Act 2013, what is the quorum required for a public company having 2,400 members?',
            options: ['5 members personally present', '15 members personally present', '30 members personally present', '2 members personally present'],
            correct: 1,
            explanation: 'Under Section 103(1)(a)(ii), if the number of members as on the date of meeting is more than 1,000 but up to 5,000, the quorum is 15 members personally present.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: [
          {
            id: 'fc_law_3',
            topic: 'Section 101 — Computation of Clear 21 Days Notice',
            examTag: 'ICAI Exam Standard • 4 Marks',
            marks: 4,
            prompt: 'Explain the legal rule for calculating "Clear 21 Days" notice for convening an AGM when notices are dispatched by post.',
            provision: 'Section 101(1) requires a general meeting to be called by giving not less than clear 21 days notice. Rule 35(6) of Companies (Incorporation) Rules provides that service by post is deemed effected 48 hours after dispatch.',
            analysis: 'To arrive at 21 clear days: Exclude the date of posting, add 48 hours for statutory transit, add 21 full intervening calendar days, and exclude the day of the meeting itself.',
            conclusion: 'Thus, total calendar gap required between posting and the meeting date is at least 24 days.',
            keywords: ['Clear 21 Days', 'Rule 35(6)', '48 hours post transit', 'Day of service', 'Day of meeting'],
            rubric: [
              { step: 'Citation of Section 101 and Rule 35(6)', marks: 1.5 },
              { step: 'Step-by-step arithmetic exclusion breakdown', marks: 1.5 },
              { step: 'Final conclusion on validity of notice', marks: 1.0 }
            ]
          }
        ]
      }
    ]
  },

  // Paper 3: Taxation (Hybrid: DT is MCQ Only, IDT/GST is Hybrid)
  tax: {
    id: 'tax',
    paper: 'Paper 3',
    group: 'Group 1',
    name: 'Taxation (Direct & Indirect)',
    shortName: 'Taxation',
    color: '#10b981',
    practiceType: 'hybrid',
    tag: 'MCQ + Theory',
    subTag: 'DT: MCQ • IDT: Hybrid',
    weightage: 'Paper 3 • 100 Marks',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg>`,
    chapters: [
      {
        id: 'tax_ch1',
        num: 1,
        title: 'Direct Tax: Basic Concepts & Residential Status (Sec 1-6)',
        weightage: '8-12 Marks',
        type: 'mcq_only',
        concepts: [
          {
            id: 'tax_c1_1',
            title: 'Sec 6(1) Basic Conditions for Individual',
            weightage: '3-4 Marks',
            difficulty: 'Core Foundation',
            rules: [
              'Resident if in India for >= 182 days in previous year, OR 60 days in PY + 365 days in 4 preceding PYs.',
              '60-day period replaced with 182 days for Indian citizen leaving India for employment abroad.',
              '120-day threshold applies to Indian citizens/PIO with total income (excl foreign) > ₹15 lakhs.'
            ],
            qCount: 2
          },
          {
            id: 'tax_c1_2',
            title: 'Deemed Resident Sec 6(1A)',
            weightage: '3-5 Marks',
            difficulty: 'High Yield',
            rules: [
              'Applies to Indian citizen having total income (other than foreign source) exceeding ₹15 lakhs during previous year.',
              'Deemed resident if not liable to tax in any other country by reason of domicile or residence.',
              'Deemed resident u/s 6(1A) is always treated as Resident but Not Ordinarily Resident (RNOR).'
            ],
            qCount: 2
          },
          {
            id: 'tax_c1_3',
            title: 'Scope of Total Income Sec 5 (ROR vs RNOR vs NR)',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'ROR is taxed on global income (accruing inside or outside India).',
              'RNOR is taxed on Indian income + income from business controlled in India or profession set up in India.',
              'NR is taxed ONLY on income received/accruing or deemed to be received/accrue in India.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'Under Section 6(1A), an Indian citizen deemed to be resident in India is ALWAYS categorized as:',
            options: ['Resident and Ordinarily Resident (ROR)', 'Resident but Not Ordinarily Resident (RNOR)', 'Non-Resident (NR)', 'Exempt Person'],
            correct: 1,
            explanation: 'Under Section 6(6)(d), an individual who is deemed to be a resident u/s 6(1A) is always classified as Resident but Not Ordinarily Resident (RNOR).',
            marks: 2,
            xp: 20
          },
          {
            q: 'Which of the following foreign incomes is taxable in the hands of a Resident but Not Ordinarily Resident (RNOR)?',
            options: ['Salary earned and received in London', 'Agricultural income in Sri Lanka', 'Business profits from a trade in Dubai controlled entirely from Mumbai', 'Rental income from property in Singapore credited directly to UK bank'],
            correct: 2,
            explanation: 'Under Section 5(1)(c), foreign income of an RNOR is taxable in India only if it is derived from a business controlled in or a profession set up in India.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_tax_1',
            caseTitle: 'Mr. Rohan Mehta — Cross-Border Consultancy & NRI Status',
            subject: 'tax',
            chapterId: 'tax_ch1',
            totalMarks: 4,
            readingTime: 5,
            pages: [
              {
                pageNum: 1,
                tabTitle: 'Travel Log & Employment',
                title: '1. International Movements & Days in India',
                content: 'Mr. Rohan Mehta, an Indian citizen, left India for the first time on 10th August 2024 to take up employment with an engineering firm in Dubai.\n\nDuring previous year 2024-25, he stayed in India for 132 days. In the four preceding previous years (2020-21 to 2023-24), he was in India for 400 days.'
              },
              {
                pageNum: 2,
                tabTitle: 'Income Streams & Tax Liability',
                title: '2. Indian vs Foreign Income Sources',
                content: 'His income profile for FY 2024-25 comprises: Dubai salary ₹22,00,000 (received in Dubai), Interest on Indian fixed deposits ₹3,50,000, and Rental income from a flat in Pune ₹2,80,000.\n\nHe claims Non-Resident status arguing he left India for employment.'
              }
            ],
            narrative: 'Mr. Rohan Mehta, an Indian citizen, left India for the first time on 10th August 2024 to take up employment with an engineering firm in Dubai. During previous year 2024-25, he stayed in India for 132 days. In the four preceding previous years (2020-21 to 2023-24), he was in India for 400 days. His income profile for FY 2024-25 comprises Dubai salary ₹22,00,000, Interest on Indian FDs ₹3,50,000, and Rental income in Pune ₹2,80,000.',
            questions: [
              {
                q: 'What is the residential status of Mr. Rohan Mehta for AY 2025-26?',
                options: ['Resident and Ordinarily Resident', 'Resident but Not Ordinarily Resident', 'Non-Resident', 'Deemed Resident u/s 6(1A)'],
                correct: 2,
                explanation: 'Since Mr. Rohan left India as an Indian citizen for employment abroad, only the 182-day rule applies under Explanation 1(a) to Sec 6(1). Having stayed only 132 days (< 182 days), he is a Non-Resident.',
                pageRef: 'Page 1 • Section 1 (Travel Log)',
                marks: 2,
                xp: 25
              },
              {
                q: 'Which incomes of Mr. Rohan Mehta are taxable in India for AY 2025-26?',
                options: ['All incomes including Dubai salary', 'Only Indian Interest (₹3.5L) and Pune Rental (₹2.8L)', 'Only Dubai salary', 'Nil, because Non-Residents are exempt under DTAA'],
                correct: 1,
                explanation: 'As a Non-Resident under Section 5(2), only income received or accruing in India is taxable. Dubai salary earned and received abroad is outside Indian tax net.',
                pageRef: 'Page 2 • Section 2 (Income Streams)',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: []
      },
      {
        id: 'tax_ch2',
        num: 2,
        title: 'Indirect Tax: GST Input Tax Credit (ITC) & Supply Concepts',
        weightage: '12-16 Marks',
        type: 'hybrid',
        concepts: [
          {
            id: 'tax_c2_1',
            title: 'Sec 16 Eligibility & Conditions for ITC',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Registered person must possess tax invoice/debit note issued by supplier.',
              'Goods or services must have been received by the taxable person.',
              'Tax charged must have been actually paid to Government and supplier must have filed GSTR-3B.'
            ],
            qCount: 2
          },
          {
            id: 'tax_c2_2',
            title: 'Sec 17(5) Blocked Credits',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Motor vehicles for passenger transport with seating capacity <= 13 persons are blocked, unless used for further supply, passenger transport training.',
              'Food and beverages, outdoor catering, health services, and club memberships are blocked unless obligatory by law.',
              'Works contract for construction of immovable property (except plant & machinery) is strictly blocked.'
            ],
            qCount: 3
          },
          {
            id: 'tax_c2_3',
            title: 'Time & Value of Supply (Sec 12, 13 & 15)',
            weightage: '3-5 Marks',
            difficulty: 'Moderate',
            rules: [
              'Time of supply of goods: Date of invoice or due date of invoice, whichever is earlier.',
              'Value of supply: Transaction value where price is sole consideration and parties are not related.',
              'Subsidies linked to price from Central/State Govts are excluded from transaction value.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'Under Section 17(5) of the CGST Act 2017, input tax credit is BLOCKED on which of the following?',
            options: [
              'Motor vehicle with seating capacity of 25 persons used for employee transit',
              'Outdoor catering services purchased to satisfy a mandatory statutory factory obligation',
              'Works contract services for constructing foundation of plant & machinery',
              'Membership of a health and fitness club provided voluntarily to senior executives'
            ],
            correct: 3,
            explanation: 'Under Sec 17(5)(b)(ii), club memberships and health services are blocked unless made obligatory for employers under any law in force.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: [
          {
            id: 'fc_tax_1',
            topic: 'GST Section 17(5) — Motor Vehicles ITC Exceptions',
            examTag: 'ICAI Exam Standard • 5 Marks',
            marks: 5,
            prompt: 'State the statutory provisions regarding availability of ITC on motor vehicles used for transportation of persons under Section 17(5) of the CGST Act.',
            provision: 'Under Section 17(5)(a), ITC is blocked on motor vehicles for transportation of persons having approved seating capacity of not more than 13 persons (including driver).',
            analysis: 'Exceptions where ITC is allowed: When motor vehicles are used for further supply of such vehicles, transportation of passengers, or imparting training on driving such vehicles. Also fully allowed if seating capacity exceeds 13 persons.',
            conclusion: 'Vehicles used for general executive transit having seating <= 13 persons are permanently blocked from claiming ITC.',
            keywords: ['Section 17(5)(a)', 'Seating capacity <= 13', 'Transportation of passengers', 'Driving training', 'Blocked Credit'],
            rubric: [
              { step: 'General blocking rule and seating capacity threshold', marks: 1.5 },
              { step: 'Enumeration of 3 statutory exception purposes', marks: 2.0 },
              { step: 'Analysis of corporate executive cars', marks: 1.5 }
            ]
          }
        ]
      }
    ]
  },

  // Paper 4: Cost and Management Accounting (MCQ Only - Quantitative & Costing)
  cost: {
    id: 'cost',
    paper: 'Paper 4',
    group: 'Group 2',
    name: 'Cost & Management Accounting',
    shortName: 'Costing',
    color: '#06b6d4',
    practiceType: 'mcq_only',
    tag: 'MCQ Only',
    subTag: 'Costing & Numerical Analysis',
    weightage: 'Paper 4 • 100 Marks',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    chapters: [
      {
        id: 'cost_ch1',
        num: 1,
        title: 'Material Cost & Inventory Optimization (EOQ, Stock Levels)',
        weightage: '8-12 Marks',
        type: 'mcq_only',
        concepts: [
          {
            id: 'cost_c1_1',
            title: 'Economic Order Quantity (EOQ)',
            weightage: '3-5 Marks',
            difficulty: 'Core Foundation',
            rules: [
              'EOQ = sqrt((2 * Annual Demand * Ordering Cost) / Carrying Cost per unit per year).',
              'At EOQ, Total Ordering Cost equals Total Carrying Cost.',
              'Quantity discount is acceptable only if purchase savings exceed incremental carrying cost.'
            ],
            qCount: 2
          },
          {
            id: 'cost_c1_2',
            title: 'Reorder Level & Safety Stock Calculations',
            weightage: '3-4 Marks',
            difficulty: 'High Yield',
            rules: [
              'Reorder Level (ROL) = Maximum Consumption × Maximum Lead Time.',
              'Minimum Stock Level = ROL - (Normal Consumption × Normal Lead Time).',
              'Maximum Stock Level = ROL + ROQ - (Minimum Consumption × Minimum Lead Time).'
            ],
            qCount: 2
          },
          {
            id: 'cost_c1_3',
            title: 'Inventory Valuation & ABC Analysis',
            weightage: '2-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'FIFO values closing inventory at latest prices; Weighted Average smooths price fluctuations.',
              'ABC analysis categorizes stock by annual consumption value: A (70% value, 10% qty), B (20% value, 20% qty), C (10% value, 70% qty).',
              'VED classifies items by operational criticality (Vital, Essential, Desirable).'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'At the Economic Order Quantity (EOQ), which of the following relationships holds true?',
            options: ['Total Ordering Cost > Total Carrying Cost', 'Total Ordering Cost < Total Carrying Cost', 'Total Ordering Cost = Total Carrying Cost', 'Carrying Cost equals Purchase Cost'],
            correct: 2,
            explanation: 'By mathematical formulation of the Wilson EOQ model, at optimal lot size, the annual total ordering cost exactly equals the annual total carrying cost.',
            marks: 2,
            xp: 20
          },
          {
            q: 'If Reorder Level is 6,000 units, Normal Consumption is 300 units/day, and Normal Lead Time is 10 days, what is the Minimum Stock Level?',
            options: ['3,000 units', '4,500 units', '2,000 units', '3,500 units'],
            correct: 0,
            explanation: 'Minimum Stock Level = Reorder Level - (Normal Consumption × Normal Lead Time) = 6,000 - (300 × 10) = 6,000 - 3,000 = 3,000 units.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_cost_1',
            caseTitle: 'Zenon Electronics — Discount Policy vs EOQ Evaluation',
            subject: 'cost',
            chapterId: 'cost_ch1',
            totalMarks: 4,
            readingTime: 5,
            pages: [
              {
                pageNum: 1,
                tabTitle: 'Operational Parameters & EOQ',
                title: '1. Consumption Parameters & Normal EOQ',
                content: 'Zenon Electronics Ltd consumes 20,000 microcontrollers annually at ₹100 per unit. The cost of placing an order is ₹500, and inventory carrying cost is 20% of unit cost per annum.\n\nThe calculated standard EOQ is 1,000 units per order (requiring 20 orders per year).'
              },
              {
                pageNum: 2,
                tabTitle: 'Supplier Bulk Discount Offer',
                title: '2. Bulk Discount Offer & Working Capital',
                content: 'The component supplier offers a 2% discount on the purchase price if orders are placed in lot sizes of 5,000 units.\n\nThe company must evaluate whether the total annual purchase savings of ₹40,000 offset the surge in holding and warehouse storage costs.'
              }
            ],
            narrative: 'Zenon Electronics consumes 20,000 microcontrollers annually at ₹100 per unit. Cost of placing order is ₹500, and inventory carrying cost is 20% per annum. EOQ is 1,000 units. The supplier offers 2% discount if orders are placed in lots of 5,000 units. The company evaluates whether to accept the bulk discount.',
            questions: [
              {
                q: 'What is the total annual inventory carrying cost at the standard EOQ of 1,000 units?',
                options: ['₹10,000', '₹20,000', '₹5,000', '₹15,000'],
                correct: 0,
                explanation: 'Carrying Cost = (Q / 2) × C × i = (1,000 / 2) × (₹100 × 20%) = 500 × ₹20 = ₹10,000.',
                pageRef: 'Page 1 • Section 1 (Operational Parameters)',
                marks: 2,
                xp: 25
              },
              {
                q: 'Should Zenon Electronics accept the supplier bulk discount offer of 2% for lot sizes of 5,000 units?',
                options: [
                  'Yes, because net annual benefit is ₹11,000',
                  'No, because total costs increase by ₹15,000',
                  'Yes, solely because purchase price falls',
                  'No, order lot size cannot exceed EOQ'
                ],
                correct: 0,
                explanation: 'Discount saving = ₹40,000. New carrying cost = (5,000/2) × (₹98 × 20%) = ₹49,000. Old carrying cost = ₹10,000 (increase ₹39,000). Ordering cost falls from ₹10,000 to ₹2,000 (saving ₹8,000). Net benefit = ₹40,000 + ₹8,000 - ₹39,000 = ₹9,000 to ₹11,000 favorable.',
                pageRef: 'Page 2 • Section 2 (Bulk Discount Offer)',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: []
      },
      {
        id: 'cost_ch2',
        num: 2,
        title: 'Marginal Costing & CVP Analysis',
        weightage: '10-14 Marks',
        type: 'mcq_only',
        concepts: [
          {
            id: 'cost_c2_1',
            title: 'Contribution & PV Ratio Formulae',
            weightage: '3-5 Marks',
            difficulty: 'Core Foundation',
            rules: [
              'Contribution = Sales - Variable Cost = Fixed Cost + Profit.',
              'Profit-Volume (PV) Ratio = (Contribution / Sales) × 100 = (Change in Profit / Change in Sales) × 100.',
              'PV ratio remains constant at all levels of activity within relevant range.'
            ],
            qCount: 2
          },
          {
            id: 'cost_c2_2',
            title: 'Break-even Point (BEP) & Margin of Safety',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Break-even Point (Value) = Total Fixed Cost / PV Ratio.',
              'Margin of Safety (MOS) = Actual Sales - Break-even Sales = Profit / PV Ratio.',
              'High MOS indicates greater operational buffer against demand drop.'
            ],
            qCount: 2
          },
          {
            id: 'cost_c2_3',
            title: 'Key Factor / Limiting Factor Decisions',
            weightage: '3-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'When raw material, machine hours, or labor is restricted, rank products by Contribution per unit of Key Factor.',
              'Allocate scarce resource first to highest profitability ranking product.',
              'Fixed costs are irrelevant for short-term key factor optimization.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'If Sales are ₹20,00,000, Fixed Costs are ₹5,00,000, and Profit is ₹3,00,000, what is the Margin of Safety ratio?',
            options: ['37.5%', '40.0%', '62.5%', '25.0%'],
            correct: 0,
            explanation: 'Contribution = Fixed Cost + Profit = ₹5L + ₹3L = ₹8L. PV Ratio = 8L / 20L = 40%. Break-even Sales = 5L / 0.40 = ₹12.5L. Margin of Safety = ₹20L - ₹12.5L = ₹7.5L. MOS Ratio = 7.5L / 20L = 37.5%.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: []
      }
    ]
  },

  // Paper 5: Auditing and Ethics (Hybrid: Standards & Ethics Recall)
  audit: {
    id: 'audit',
    paper: 'Paper 5',
    group: 'Group 2',
    name: 'Auditing & Ethics',
    shortName: 'Audit',
    color: '#ec4899',
    practiceType: 'hybrid',
    tag: 'MCQ + Theory',
    subTag: 'Standards (SAs) & Professional Ethics',
    weightage: 'Paper 5 • 100 Marks',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    chapters: [
      {
        id: 'audit_ch1',
        num: 1,
        title: 'Nature, Objective and Scope of Audit (SA 200, 210)',
        weightage: '8-12 Marks',
        type: 'hybrid',
        concepts: [
          {
            id: 'audit_c1_1',
            title: 'Professional Skepticism & SA 200',
            weightage: '3-4 Marks',
            difficulty: 'Core Foundation',
            rules: [
              'Professional skepticism: Questioning mind, alert to conditions indicating possible misstatement due to error or fraud.',
              'Auditor obtains reasonable assurance, which is high but not absolute assurance.',
              'Inherent limitations: Nature of financial reporting, nature of audit procedures, and timeliness vs cost.'
            ],
            qCount: 2
          },
          {
            id: 'audit_c1_2',
            title: 'Preconditions for Audit (SA 210)',
            weightage: '3-5 Marks',
            difficulty: 'High Yield',
            rules: [
              'Determine whether financial reporting framework to be applied is acceptable.',
              'Obtain agreement of management acknowledging its responsibility for preparation of FS and internal controls.',
              'Do not accept engagement if management imposes a scope limitation resulting in disclaimer.'
            ],
            qCount: 2
          },
          {
            id: 'audit_c1_3',
            title: 'Auditor Independence & Threats',
            weightage: '3-4 Marks',
            difficulty: 'High Yield',
            rules: [
              'Independence of mind and independence in appearance are mandatory.',
              'Five threats to independence: Self-interest, Self-review, Advocacy, Familiarity, and Intimidation.',
              'Safeguards must eliminate or reduce threats to an acceptable level.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'Under SA 200, which of the following is NOT an inherent limitation of an audit?',
            options: [
              'Nature of financial reporting involving management judgment',
              'Practical and legal limitations on the auditor’s ability to obtain evidence',
              'Auditor’s lack of competence or carelessness during field verification',
              'Need for the audit to be conducted within a reasonable period of time and at reasonable cost'
            ],
            correct: 2,
            explanation: 'Under SA 200, inherent limitations arise from the nature of financial reporting, nature of audit procedures, and timeliness/cost. Carelessness or lack of competence is professional negligence, not an inherent limitation.',
            marks: 2,
            xp: 20
          },
          {
            q: 'As per SA 210 "Agreeing the Terms of Audit Engagements", if management imposes a limitation on scope prior to audit acceptance such that auditor will disclaim opinion:',
            options: [
              'Auditor must accept and issue qualified opinion',
              'Auditor shall not accept such a limited engagement unless required by law',
              'Auditor may accept by charging double fees',
              'Auditor must inform the Central Government within 7 days'
            ],
            correct: 1,
            explanation: 'Under SA 210 paragraph 7, if management imposes a scope limitation that would result in a disclaimer of opinion, the auditor shall not accept such an engagement unless required by statute.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_audit_1',
            caseTitle: 'M/s Sharma & Associates — Appointment Conflict & Independence',
            subject: 'audit',
            chapterId: 'audit_ch1',
            totalMarks: 4,
            readingTime: 5,
            pages: [
              {
                pageNum: 1,
                tabTitle: 'Engagement Terms & Loan Facility',
                title: '1. Appointment Offer & Financial Nexus',
                content: 'M/s Sharma & Associates, a CA firm, was approached by Orion Infotech Ltd for statutory audit. A partner in the firm, CA Suresh, holds an active personal housing loan of ₹60,00,000 from Orion Housing Finance Ltd (a wholly-owned subsidiary of Orion Infotech Ltd) at normal commercial interest rates.'
              },
              {
                pageNum: 2,
                tabTitle: 'Management Preconditions',
                title: '2. Preconditions & Access Restrictions',
                content: 'Furthermore, the CFO of Orion Infotech stipulated that internal fraud investigation files related to an ongoing cybersecurity breach would not be accessible to the audit team to protect sensitive client trade secrets.'
              }
            ],
            narrative: 'M/s Sharma & Associates, a CA firm, was approached by Orion Infotech Ltd for statutory audit. A partner in the firm, CA Suresh, holds an active personal housing loan of ₹60,00,000 from Orion Housing Finance Ltd (subsidiary of Orion Infotech Ltd) at normal rates. Furthermore, the CFO stipulated that internal fraud investigation files related to cybersecurity breach would not be accessible to the audit team.',
            questions: [
              {
                q: 'Under Section 141(3)(d) of Companies Act 2013, does the housing loan disqualify CA Suresh from being appointed as statutory auditor?',
                options: [
                  'Disqualified because indebtedness exceeds ₹5,00,000 to the subsidiary company',
                  'Not disqualified because housing loans from commercial finance entities are exempt',
                  'Disqualified only if interest is defaulted for 90 days',
                  'Not disqualified because loan is in subsidiary, not holding company'
                ],
                correct: 0,
                explanation: 'Under Section 141(3)(d)(ii), a person is disqualified if he or his relative/partner is indebted to the company, or its subsidiary or holding company, in excess of ₹5,00,000.',
                pageRef: 'Page 1 • Section 1 (Engagement Terms)',
                marks: 2,
                xp: 25
              },
              {
                q: 'Under SA 210, how should M/s Sharma & Associates respond to the CFO’s condition restricting access to fraud investigation files?',
                options: [
                  'Accept the audit with a disclaimer of opinion',
                  'Refuse to accept the engagement due to improper limitation of scope before acceptance',
                  'Accept after obtaining an indemnity bond from the board',
                  'Report the restriction immediately to the National Financial Reporting Authority (NFRA)'
                ],
                correct: 1,
                explanation: 'Under SA 210, if management imposes a scope limitation that prevents the auditor from obtaining sufficient appropriate audit evidence, the auditor shall not accept the engagement.',
                pageRef: 'Page 2 • Section 2 (Preconditions)',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            id: 'fc_audit_1',
            topic: 'SA 210 — Agreement on Audit Terms',
            examTag: 'ICAI Exam Standard • 5 Marks',
            marks: 5,
            prompt: 'Draft the essential preconditions for an audit that must be established by the auditor prior to accepting an engagement under SA 210.',
            provision: 'SA 210 "Agreeing the Terms of Audit Engagements" mandates that the auditor must determine the acceptability of the financial reporting framework and obtain agreement of management.',
            analysis: 'Management must acknowledge and understand its responsibility for: (a) Preparation of financial statements in accordance with applicable framework, (b) Necessary internal controls, and (c) Providing auditor unrestricted access to all info, records, and personnel.',
            conclusion: 'If preconditions are absent, the auditor shall discuss with management and decline the audit engagement unless required by statute.',
            keywords: ['Preconditions for Audit', 'Acceptable FRF', 'Management Responsibility', 'Unrestricted Access', 'SA 210 Engagement Letter'],
            rubric: [
              { step: 'Acceptability of Financial Reporting Framework', marks: 1.5 },
              { step: 'Three-fold management responsibility agreement', marks: 2.0 },
              { step: 'Course of action when preconditions are lacking', marks: 1.5 }
            ]
          }
        ]
      },
      {
        id: 'audit_ch2',
        num: 2,
        title: 'Audit Evidence & Risk Assessment (SA 500, SA 315)',
        weightage: '12-16 Marks',
        type: 'hybrid',
        concepts: [
          {
            id: 'audit_c2_1',
            title: 'Sufficiency & Appropriateness of Evidence (SA 500)',
            weightage: '4-6 Marks',
            difficulty: 'Core Foundation',
            rules: [
              'Sufficiency is measure of quantity; Appropriateness is measure of quality (relevance and reliability).',
              'External evidence is more reliable than internal evidence.',
              'Direct evidence obtained by auditor is more reliable than indirect or inferential evidence.'
            ],
            qCount: 2
          },
          {
            id: 'audit_c2_2',
            title: 'External Confirmations (SA 505)',
            weightage: '3-5 Marks',
            difficulty: 'High Yield',
            rules: [
              'Positive confirmation request asks confirming party to respond directly indicating agreement or disagreement.',
              'Negative confirmation request asks confirming party to respond only in event of disagreement (less persuasive).',
              'Management refusal to allow confirmation requires investigation of validity and alternative procedures.'
            ],
            qCount: 2
          },
          {
            id: 'audit_c2_3',
            title: 'Risk of Material Misstatement (SA 315)',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Audit Risk = Risk of Material Misstatement (Inherent Risk × Control Risk) × Detection Risk.',
              'Auditor assesses risk at Financial Statement level and Assertion level (Classes of transactions, Balances, Disclosures).',
              'Significant risk requires special audit consideration (e.g. non-routine complex transactions, fraud risk).'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'Under SA 500 "Audit Evidence", which of the following forms of evidence is considered MOST reliable?',
            options: [
              'Carbon copy of sales invoice provided by the accountant',
              'Written confirmation received directly by the auditor from an independent bank',
              'Oral representation from the managing director',
              'Internal stock register prepared by storekeeper'
            ],
            correct: 1,
            explanation: 'Under SA 500, audit evidence obtained directly by the auditor from external independent sources is more reliable than evidence generated internally by the client.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: [
          {
            id: 'fc_audit_2',
            topic: 'SA 505 — Management Refusal to Send Confirmation',
            examTag: 'ICAI Exam Standard • 5 Marks',
            marks: 5,
            prompt: 'What audit steps must the statutory auditor take if management refuses to allow the auditor to send an external confirmation request under SA 505?',
            provision: 'Under SA 505 paragraph 8, if management refuses to allow the auditor to send confirmation requests, the auditor shall inquire about reasons and seek audit evidence as to validity and reasonableness.',
            analysis: 'Auditor must: 1. Inquire into management reasons, 2. Evaluate implications on risk of fraud and integrity of management, 3. Perform alternative audit procedures to obtain relevant and reliable evidence.',
            conclusion: 'If reasons are unreasonable or alternative evidence cannot be obtained, the auditor shall communicate with TCWG and consider impact on auditor report under SA 705.',
            keywords: ['SA 505', 'Management Refusal', 'Validity & Reasonableness', 'Alternative Audit Procedures', 'Impact on Audit Opinion'],
            rubric: [
              { step: 'Inquiry and evaluation of reasons', marks: 1.5 },
              { step: 'Performance of alternative procedures', marks: 1.5 },
              { step: 'Communication with TCWG and reporting effect', marks: 2.0 }
            ]
          }
        ]
      }
    ]
  },

  // Paper 6: FM & Strategic Management (Hybrid: FM is MCQ Only, SM is Hybrid)
  fmsm: {
    id: 'fmsm',
    paper: 'Paper 6',
    group: 'Group 2',
    name: 'FM & Strategic Management',
    shortName: 'FM-SM',
    color: '#f59e0b',
    practiceType: 'hybrid',
    tag: 'MCQ + Theory',
    subTag: 'FM: MCQ • SM: Hybrid',
    weightage: 'Paper 6 • 100 Marks',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    chapters: [
      {
        id: 'fmsm_ch1',
        num: 1,
        title: 'Financial Management: Capital Budgeting & Decisions (NPV, IRR)',
        weightage: '10-14 Marks',
        type: 'mcq_only',
        concepts: [
          {
            id: 'fmsm_c1_1',
            title: 'Net Present Value (NPV) & Decision Rule',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'NPV = Present Value of Cash Inflows - Initial Investment Outlay.',
              'Accept project if NPV > 0; in mutually exclusive projects, select highest positive NPV.',
              'NPV assumes reinvestment of intermediate cash flows at the cost of capital (hurdle rate).'
            ],
            qCount: 2
          },
          {
            id: 'fmsm_c1_2',
            title: 'Internal Rate of Return (IRR) & Conflict with NPV',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'IRR is the discount rate at which NPV equals zero.',
              'In mutually exclusive projects with differing sizes or timings, NPV takes precedence over IRR.',
              'IRR assumes reinvestment of cash flows at the IRR itself (unrealistic reinvestment assumption).'
            ],
            qCount: 2
          },
          {
            id: 'fmsm_c1_3',
            title: 'Profitability Index (PI) & Capital Rationing',
            weightage: '3-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'Profitability Index = Present Value of Inflows / Initial Outlay.',
              'Under divisible capital rationing, rank projects in descending order of PI.',
              'Accept project if PI > 1.0.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'In case of mutually exclusive capital projects with conflicting rankings between Net Present Value (NPV) and Internal Rate of Return (IRR), the firm should prefer:',
            options: ['The project with higher IRR', 'The project with higher NPV', 'The project with shorter Payback Period', 'The project with higher Accounting Rate of Return'],
            correct: 1,
            explanation: 'NPV directly measures absolute shareholder wealth maximization and assumes realistic reinvestment at the cost of capital, making it superior to IRR in conflicting mutually exclusive choices.',
            marks: 2,
            xp: 20
          },
          {
            q: 'If a project has an initial cash outflow of ₹10,00,000 and generates present value of future cash inflows of ₹12,50,000, its Profitability Index (PI) is:',
            options: ['0.80', '1.25', '1.50', '2.50'],
            correct: 1,
            explanation: 'Profitability Index = Present Value of Inflows / Initial Outlay = ₹12,50,000 / ₹10,00,000 = 1.25.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_fmsm_1',
            caseTitle: 'Solaris Energy Ltd — Solar Farm Expansion Decision',
            subject: 'fmsm',
            chapterId: 'fmsm_ch1',
            totalMarks: 4,
            readingTime: 5,
            pages: [
              {
                pageNum: 1,
                tabTitle: 'Capital Outlays & Cash Inflows',
                title: '1. Project Parameters & Cash Inflows',
                content: 'Solaris Energy Ltd is evaluating two mutually exclusive solar farm projects (Project A and Project B). Both projects require an immediate capital outlay of ₹50,00,000 and have a useful operating life of 5 years.\n\nThe company cost of capital (discount rate) is 12% per annum.'
              },
              {
                pageNum: 2,
                tabTitle: 'Discounted Metrics & Conflict',
                title: '2. NPV vs IRR Conflict Analysis',
                content: 'Financial projections reveal: Project A has an NPV of ₹8,40,000 and an IRR of 18%. Project B has an NPV of ₹11,20,000 and an IRR of 16% due to larger cash inflows occurring in later operational years.'
              }
            ],
            narrative: 'Solaris Energy Ltd evaluates two mutually exclusive solar projects A and B. Outlay is ₹50,00,000 each. Cost of capital is 12%. Project A has NPV ₹8.4L and IRR 18%. Project B has NPV ₹11.2L and IRR 16%. The board evaluates which project maximizes shareholder value.',
            questions: [
              {
                q: 'Which project should Solaris Energy Ltd select to maximize shareholder wealth?',
                options: ['Project A, because IRR is 18%', 'Project B, because NPV is ₹11,20,000', 'Both projects, because both have positive NPV', 'Neither, because reinvestment rates conflict'],
                correct: 1,
                explanation: 'For mutually exclusive projects, the project with the highest NPV (Project B with ₹11,20,000) must be chosen because NPV directly measures the incremental wealth created for shareholders.',
                pageRef: 'Page 2 • Section 2 (NPV vs IRR Conflict)',
                marks: 2,
                xp: 25
              },
              {
                q: 'What underlying cause explains why Project A has higher IRR but lower NPV than Project B?',
                options: [
                  'Project A has earlier cash inflow timing, favoring the compound discounting of IRR',
                  'Project B requires more working capital',
                  'Project A uses straight line depreciation',
                  'Cost of capital for Project B is higher'
                ],
                correct: 0,
                explanation: 'Timing differences in cash flows cause NPV and IRR profiles to intersect. Projects with front-loaded early cash flows yield higher IRRs, while back-loaded larger flows produce higher absolute NPV at low discount rates.',
                pageRef: 'Page 2 • Paragraph 1',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: []
      },
      {
        id: 'fmsm_ch2',
        num: 2,
        title: 'Strategic Management: Strategic Analysis & Competitive Advantage',
        weightage: '10-14 Marks',
        type: 'hybrid',
        concepts: [
          {
            id: 'fmsm_c2_1',
            title: 'Porter’s Five Competitive Forces',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Five forces: Threat of new entrants, Bargaining power of buyers, Bargaining power of suppliers, Threat of substitutes, Rivalry among existing competitors.',
              'Collective strength of forces determines industry profit potential.',
              'Strong forces drive down profitability to cost of capital.'
            ],
            qCount: 2
          },
          {
            id: 'fmsm_c2_2',
            title: 'Michael Porter’s Generic Strategies',
            weightage: '4-6 Marks',
            difficulty: 'High Yield',
            rules: [
              'Three generic strategies: Cost Leadership, Differentiation, and Focus (Cost or Differentiation).',
              'Firms failing to develop a distinct strategy risk becoming "Stuck in the Middle".',
              'Cost leadership requires aggressive construction of efficient facilities and tight cost control.'
            ],
            qCount: 2
          },
          {
            id: 'fmsm_c2_3',
            title: 'SWOT Analysis & TOWS Matrix',
            weightage: '3-4 Marks',
            difficulty: 'Moderate',
            rules: [
              'SWOT matches internal Strengths/Weaknesses with external Opportunities/Threats.',
              'TOWS matrix generates 4 distinct strategic choices: SO (Maxi-Maxi), ST (Maxi-Mini), WO (Mini-Maxi), WT (Mini-Mini).',
              'WT strategies represent defensive posture against threats.'
            ],
            qCount: 2
          }
        ],
        questions: [
          {
            q: 'According to Michael Porter, a firm that pursues both Cost Leadership and Differentiation simultaneously without excelling at either is referred to as:',
            options: ['Focused Competitor', 'Stuck in the Middle', 'Market Challenger', 'Defensive Nicher'],
            correct: 1,
            explanation: 'Porter warns that a firm attempting both low cost and differentiation simultaneously risks becoming "Stuck in the Middle", suffering from low profitability and blurry strategic identity.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: [
          {
            id: 'fc_fmsm_1',
            topic: 'Michael Porter’s 5 Competitive Forces (Strategic Management)',
            examTag: 'ICAI Exam Standard • 5 Marks',
            marks: 5,
            prompt: 'Enumerate and explain the Five Competitive Forces that shape industry attractiveness and profitability as formulated by Michael Porter.',
            provision: 'Michael Porter’s structural model posits that industry competition extends beyond established rivals to five fundamental forces.',
            analysis: '1. Threat of New Entrants (Barriers to entry), 2. Bargaining Power of Buyers (Price sensitivity and switching costs), 3. Bargaining Power of Suppliers (Input monopoly and unique components), 4. Threat of Substitute Products (Alternative value proposition), 5. Rivalry among Existing Competitors (Price wars and marketing aggression).',
            conclusion: 'Understanding the relative intensity of these forces allows an enterprise to identify strategic sweet spots and protect profitability.',
            keywords: ['Porter 5 Forces', 'Industry Attractiveness', 'Barriers to Entry', 'Switching Costs', 'Substitutes'],
            rubric: [
              { step: 'Identification of all five forces', marks: 2.0 },
              { step: 'Explanation of entry barriers and supplier/buyer power', marks: 2.0 },
              { step: 'Strategic application to industry profitability', marks: 1.0 }
            ]
          }
        ]
      }
    ]
  }
};

// Aliases for legacy router compatibility
MCQ_DATA.maths = MCQ_DATA.cost;
MCQ_DATA.economics = MCQ_DATA.fmsm;

// ===== DEDICATED 30-MARK COMPREHENSIVE CASE BOOKLET DATASET =====
const CASE_BOOKLETS_30M = [
  {
    bookletId: 'cb_30m_grand_1',
    title: 'ICAI Case Booklet #1 — Integrated Corporate & Tax Governance',
    totalMarks: 30,
    timeLimitMinutes: 45,
    scenarioCount: 3,
    cases: [
      {
        caseNum: 1,
        title: 'Case 1: Bharat Heavy Logistics Ltd — Ultra Vires Leases & AOA Powers',
        marks: 10,
        pages: [
          {
            pageNum: 1,
            tabTitle: 'Entity Profile & Commercial Leases',
            title: '1. Corporate Constitution & Heavy Asset Leases',
            content: 'Bharat Heavy Logistics Ltd (BHLL) was incorporated under the Companies Act 2013 with an authorized capital of ₹5,00,00,000. Clause 3(A) of its Memorandum authorizes the company to provide freight forwarding, warehousing, and logistics solutions.\n\nIn January 2024, the managing director, without consulting the board or general meeting, entered into a 10-year lease agreement to acquire a luxury resort in Goa for ₹2,50,00,000, intending to diversify into luxury tourism.'
          },
          {
            pageNum: 2,
            tabTitle: 'Disputed Covenants & Shareholder Revolt',
            title: '2. Ultra Vires Doctrine & Third-Party Claims',
            content: 'When minority shareholders discovered the transaction during review of quarterly disclosures, they filed an application challenging the lease agreement as ultra vires the company.\n\nThe lessor, Paradise Resorts LLP, argued that they acted in good faith, relied on the signature of the Managing Director, and claimed protection under the Doctrine of Indoor Management.'
          }
        ],
        questions: [
          {
            q: 'Is the lease agreement executed by the Managing Director binding on Bharat Heavy Logistics Ltd?',
            options: [
              'Yes, because the Managing Director has implied ostensible authority',
              'No, it is ultra vires the company and void ab initio',
              'Yes, provided the shareholders ratify it by special resolution',
              'Only binding for the first year of the lease'
            ],
            correct: 1,
            explanation: 'Entering into a luxury resort lease is completely outside the logistics objects of BHLL. Acts ultra vires the company are wholly void ab initio and cannot be validated even by unanimous shareholder approval.',
            marks: 2,
            xp: 25
          },
          {
            q: 'Can Paradise Resorts LLP successfully plead the defense of the Turquand Rule (Indoor Management)?',
            options: [
              'Yes, because third parties are not expected to read internal board minutes',
              'No, because the doctrine of Indoor Management cannot validate an act which is ultra vires the company itself',
              'Yes, if they produce a certified copy of the managing director resolution',
              'Only if damages are paid to shareholders'
            ],
            correct: 1,
            explanation: 'Indoor Management protects outsiders from internal procedural non-compliance, but it NEVER protects against acts that are fundamentally ultra vires the Memorandum.',
            marks: 2,
            xp: 25
          },
          {
            q: 'What is the personal liability of the Managing Director towards Paradise Resorts LLP for executing the unauthorized lease?',
            options: [
              'No liability because he signed as an agent of the company',
              'Personally liable for breach of warranty of authority',
              'Only liable up to the face value of his shareholding',
              'Liable only under the Consumer Protection Act'
            ],
            correct: 1,
            explanation: 'An agent who enters into a contract on behalf of a principal who has no legal capacity to contract is personally liable to the third party for breach of warranty of authority.',
            marks: 2,
            xp: 25
          },
          {
            q: 'Can the company ratify this luxury resort transaction by altering its object clause with prospective or retrospective effect?',
            options: [
              'Retrospective alteration can validate past ultra vires acts',
              'Alteration under Section 13 is strictly prospective and CANNOT validate a past void act',
              'Central Government can grant retrospective exemption',
              'Yes, by passing an Ordinary Resolution'
            ],
            correct: 1,
            explanation: 'An alteration of the Memorandum under Section 13 operates prospectively only; it cannot retrospectively breathe life into an act that was void when entered into.',
            marks: 2,
            xp: 25
          },
          {
            q: 'Under Section 166 of the Companies Act 2013, which statutory duty was breached by the Managing Director?',
            options: [
              'Duty to assign his office',
              'Duty to act in accordance with the articles of the company and promote its objects in good faith',
              'Duty to file Form AOC-4 within 30 days',
              'Duty to appoint an independent woman director'
            ],
            correct: 1,
            explanation: 'Section 166(1) and 166(2) mandate that a director shall act in accordance with the articles and promote the objects of the company in good faith.',
            marks: 2,
            xp: 25
          }
        ]
      },
      {
        caseNum: 2,
        title: 'Case 2: Delta Petrochem Ltd — Cross-Border Invoicing & GST ITC Block',
        marks: 10,
        pages: [
          {
            pageNum: 1,
            tabTitle: 'Procurement Transactions & Trucks',
            title: '1. Fleet Purchases & Corporate Catering',
            content: 'Delta Petrochem Ltd purchased 10 heavy transport tankers (capacity 25 metric tons) for ₹3,00,00,000 (GST ₹54,00,000) for transporting liquefied gas to customer refineries. It also bought 2 luxury passenger cars for ₹50,00,000 (GST ₹14,00,000) for managing directors.\n\nAdditionally, it contracted an outdoor catering company for ₹12,00,000 (GST ₹2,16,00,0) to provide daily subsidized lunch to factory workers as mandated under Section 46 of the Factories Act 1948.'
          },
          {
            pageNum: 2,
            tabTitle: 'Statutory Verification & Tax Filings',
            title: '2. Section 16 & 17(5) Evaluation',
            content: 'The supplier of the passenger cars did not file GSTR-1 for the relevant tax period, although Delta possessed the physical tax invoice and paid the full amount via RTGS.\n\nThe tax manager must compute the eligible Input Tax Credit (ITC) for the company and identify blocked categories.'
          }
        ],
        questions: [
          {
            q: 'Is Delta Petrochem Ltd entitled to claim ITC on the heavy transport tankers (GST ₹54,00,000)?',
            options: [
              'Yes, because vehicles used for transportation of goods are NOT blocked under Section 17(5)',
              'No, all motor vehicles are blocked under Section 17(5)(a)',
              'Only 50% ITC is allowed on commercial tankers',
              'Blocked unless licensed by the Ministry of Petroleum'
            ],
            correct: 0,
            explanation: 'Section 17(5)(a) only restricts motor vehicles for transportation of persons with seating capacity <= 13. Motor vehicles for transportation of goods are fully eligible for ITC.',
            marks: 2,
            xp: 25
          },
          {
            q: 'What is the ITC eligibility for the 2 luxury cars purchased for Managing Directors (GST ₹14,00,000)?',
            options: [
              'Fully eligible because used for official corporate executive travel',
              'Blocked under Section 17(5)(a) as passenger vehicle with seating capacity <= 13',
              'Allowed up to ₹1,00,000 only',
              'Eligible if capitalized in books of account'
            ],
            correct: 1,
            explanation: 'Under Section 17(5)(a), motor vehicles for transportation of persons having approved seating capacity of not more than 13 persons are blocked, regardless of executive use.',
            marks: 2,
            xp: 25
          },
          {
            q: 'Is ITC admissible on outdoor catering services (GST ₹2,16,000) provided to factory workers?',
            options: [
              'No, outdoor catering is permanently blocked under Section 17(5)(b)(i)',
              'Yes, because it is obligatory for the employer under the Factories Act 1948',
              'Only eligible if employees pay full market price',
              'Blocked because catering is a personal welfare expense'
            ],
            correct: 1,
            explanation: 'The proviso to Section 17(5)(b) explicitly provides that ITC on food, beverages, and catering is available if it is obligatory for an employer to provide the same to its employees under any law.',
            marks: 2,
            xp: 25
          },
          {
            q: 'Can Delta Petrochem claim ITC on the luxury cars if the supplier failed to upload invoice details in GSTR-1/IFF?',
            options: [
              'Yes, if physical invoice and payment proof exist',
              'No, under Section 16(2)(aa), details must be communicated to recipient in GSTR-2B',
              'Allowed conditionally subject to 20% provisional credit',
              'Allowed if supplier gives an indemnity affidavit'
            ],
            correct: 1,
            explanation: 'Section 16(2)(aa) mandates that ITC can only be availed if the details of the invoice have been furnished by the supplier in GSTR-1 and communicated to the recipient in Form GSTR-2B.',
            marks: 2,
            xp: 25
          },
          {
            q: 'What is the total admissible ITC for Delta Petrochem Ltd from these three transactions?',
            options: ['₹70,16,000', '₹56,16,000 (Tankers ₹54L + Catering ₹2.16L)', '₹54,00,000 only', '₹16,16,000'],
            correct: 1,
            explanation: 'Admissible ITC = Tankers (₹54,00,000) + Statutory Catering (₹2,16,000) = ₹56,16,000. Passenger cars are blocked under Section 17(5)(a).',
            marks: 2,
            xp: 25
          }
        ]
      },
      {
        caseNum: 3,
        title: 'Case 3: Apex Audits — SA 505 External Confirmations & Bank Balances',
        marks: 10,
        pages: [
          {
            pageNum: 1,
            tabTitle: 'Audit Sampling & Debtors',
            title: '1. Trade Receivables & Confirmation Strategy',
            content: 'During the statutory audit of Horizon Textiles Ltd for FY 2024-25, the audit team from CA Khandelwal & Co selected 15 high-value debtors comprising 70% of total receivables (₹14,00,00,000) to send direct external confirmation requests under SA 505.'
          },
          {
            pageNum: 2,
            tabTitle: 'Management Pushback & Alternatives',
            title: '2. Client Refusal & Alternative Procedures',
            content: 'The Managing Director requested the audit team NOT to send confirmation requests to 3 key international customers (owing ₹4,50,00,000), arguing that delicate contract renewal talks were underway and formal audit letters would offend the clients.\n\nThe audit team must evaluate the validity of management request and establish alternative substantive procedures.'
          }
        ],
        questions: [
          {
            q: 'Under SA 505, what is the auditor’s FIRST duty when management requests not to send confirmation requests?',
            options: [
              'Immediately disclaim the audit opinion',
              'Inquire as to management’s reasons and seek audit evidence as to their validity and reasonableness',
              'Send the confirmation letters covertly without informing management',
              'Issue a show cause notice to TCWG'
            ],
            correct: 1,
            explanation: 'Under SA 505 paragraph 8, when management asks the auditor not to send a confirmation request, the auditor shall inquire about reasons and seek audit evidence regarding their validity and reasonableness.',
            marks: 2,
            xp: 25
          },
          {
            q: 'If the auditor concludes management’s refusal is UNREASONABLE and is prevented from obtaining evidence, what should the auditor do?',
            options: [
              'Accept management word and close the audit file',
              'Communicate with TCWG and determine implications on audit opinion under SA 705',
              'Resign immediately without communicating with directors',
              'Write off the debtor balances in the balance sheet'
            ],
            correct: 1,
            explanation: 'Under SA 505 paragraph 9, if refusal is unreasonable or alternative evidence cannot be obtained, auditor shall communicate with Those Charged with Governance and consider audit report implications.',
            marks: 2,
            xp: 25
          },
          {
            q: 'Which alternative audit procedure provides the strongest evidence for the existence of trade receivables when confirmations are not returned?',
            options: [
              'Reviewing subsequent cash collections received from the customer in bank statements',
              'Asking the sales manager for oral confirmation',
              'Checking the client internal sales invoice register copy',
              'Verifying customer GST registration on the portal'
            ],
            correct: 0,
            explanation: 'Examination of specific subsequent cash receipts after the balance sheet date provides compelling substantive evidence regarding existence and valuation of receivables.',
            marks: 2,
            xp: 25
          },
          {
            q: 'What type of confirmation request asks the confirming party to respond ONLY in the event of disagreement?',
            options: ['Positive confirmation request', 'Negative confirmation request', 'Blank confirmation request', 'Indirect confirmation request'],
            correct: 1,
            explanation: 'Under SA 505, a negative confirmation request asks the respondent to reply only if they disagree with the information provided in the request.',
            marks: 2,
            xp: 25
          },
          {
            q: 'Under SA 240, could management’s unreasonable refusal to permit external confirmation be viewed as an indicator of:',
            options: [
              'High inherent risk only',
              'Fraud risk factor or attempt to conceal fictitious receivables',
              'Normal operational confidentiality',
              'Precondition compliance'
            ],
            correct: 1,
            explanation: 'Unreasonable management pushback on external confirmations is an alert for fraud risk (concealing circular transactions or fictitious sales) under SA 240.',
            marks: 2,
            xp: 25
          }
        ]
      }
    ]
  }
];

// ===== 20 REALISTIC CA INTERMEDIATE STUDENTS & 5 TIERS =====
const LEADERBOARD_DATA = [
  { rank: 1, name: 'Priya Malhotra', initials: 'PM', xp: 5640, tier: 'In The Zone', frame: 'frame_10', streak: 28, attempt: 'May 2027' },
  { rank: 2, name: 'Ananya Rao', initials: 'AR', xp: 5210, tier: 'In The Zone', frame: 'frame_9', streak: 24, attempt: 'May 2027' },
  { rank: 3, name: 'Rahul Khandelwal', initials: 'RK', xp: 4920, tier: 'In The Zone', frame: 'frame_8', streak: 21, attempt: 'Jan 2027' },
  { rank: 4, name: 'Sanya Kapoor', initials: 'SK', xp: 4680, tier: 'Focused', frame: 'frame_7', streak: 19, attempt: 'May 2027' },
  { rank: 5, name: 'Virat Tiwari', initials: 'VT', xp: 4450, tier: 'Focused', frame: 'frame_7', streak: 18, attempt: 'May 2027' },
  { rank: 6, name: 'Neha Singhania', initials: 'NS', xp: 4180, tier: 'Focused', frame: 'frame_6', streak: 15, attempt: 'Sept 2027' },
  { rank: 7, name: 'Aditya Sharma', initials: 'AS', xp: 3920, tier: 'Focused', frame: 'frame_6', streak: 14, attempt: 'May 2027' },
  { rank: 8, name: 'Ishaan Verma', initials: 'IV', xp: 3650, tier: 'Focused', frame: 'frame_5', streak: 12, attempt: 'Jan 2027' },
  { rank: 9, name: 'Tanvi Desai', initials: 'TD', xp: 3380, tier: 'Hustler', frame: 'frame_5', streak: 11, attempt: 'May 2027' },
  { rank: 10, name: 'Rohan Joshi', initials: 'RJ', xp: 3150, tier: 'Hustler', frame: 'frame_4', streak: 10, attempt: 'May 2027' },
  { rank: 11, name: 'Pooja Nair', initials: 'PN', xp: 2920, tier: 'Hustler', frame: 'frame_4', streak: 9, attempt: 'Sept 2027' },
  { rank: 12, name: 'Kanhaiya Chaudhary', initials: 'KC', xp: 2740, tier: 'Hustler', frame: 'frame_3', streak: 16, attempt: 'May 2027', isDev: true },
  { rank: 13, name: 'Devansh Gupta', initials: 'DG', xp: 2450, tier: 'Grinder', frame: 'frame_3', streak: 8, attempt: 'May 2027' },
  { rank: 14, name: 'Meera Iyer', initials: 'MI', xp: 2210, tier: 'Grinder', frame: 'frame_2', streak: 7, attempt: 'Jan 2027' },
  { rank: 15, name: 'Shreya Agarwal', initials: 'SA', xp: 1980, tier: 'Grinder', frame: 'frame_2', streak: 6, attempt: 'May 2027' },
  { rank: 16, name: 'Harshit Bansal', initials: 'HB', xp: 1750, tier: 'Grinder', frame: 'frame_2', streak: 5, attempt: 'May 2027' },
  { rank: 17, name: 'Varun Mehta', initials: 'VM', xp: 1480, tier: 'Rookie', frame: 'frame_1', streak: 4, attempt: 'Sept 2027' },
  { rank: 18, name: 'Riya Sen', initials: 'RS', xp: 1220, tier: 'Rookie', frame: 'frame_1', streak: 3, attempt: 'May 2027' },
  { rank: 19, name: 'Aman Patel', initials: 'AP', xp: 960, tier: 'Rookie', frame: 'frame_1', streak: 2, attempt: 'May 2027' },
  { rank: 20, name: 'Divya Shah', initials: 'DS', xp: 720, tier: 'Rookie', frame: 'frame_1', streak: 2, attempt: 'Jan 2027' }
];

// Helper to determine tier from XP
function getTierFromXP(xp) {
  if (xp >= 4800) return 'In The Zone';
  if (xp >= 3500) return 'Focused';
  if (xp >= 2500) return 'Hustler';
  if (xp >= 1600) return 'Grinder';
  return 'Rookie';
}

// 10 AVATAR FRAMES SPECIFICATION (Unlocked every 5 levels from 1 to 50)
const AVATAR_FRAMES = [
  { id: 'frame_1', name: 'Bronze Cadet', styleTitle: 'Brushed Bronze Rim', minLevel: 1, color: '#cd7f32', border: '2px solid #cd7f32', glow: 'none', badge: 'Lvl 1', desc: 'Warm metallic bronze edge with satin finish.' },
  { id: 'frame_2', name: 'Emerald Scholar', styleTitle: 'Double Emerald & Gems', minLevel: 5, color: '#10b981', border: '3px double #10b981', glow: 'none', badge: 'Lvl 5', desc: 'Dual neon emerald lines with luminous corner gemstones.' },
  { id: 'frame_3', name: 'Sapphire Sentinel', styleTitle: 'Cyber Shield Brackets', minLevel: 10, color: '#3b82f6', border: '2px solid #3b82f6', glow: 'none', badge: 'Lvl 10', desc: 'Tactical cobalt cyber shield with reinforced corner brackets.' },
  { id: 'frame_4', name: 'Amber Vanguard', styleTitle: 'Radiant Solar Halo', minLevel: 15, color: '#f59e0b', border: '2px solid #f59e0b', glow: 'none', badge: 'Lvl 15', desc: 'Concentric golden core enveloped in a dashed solar aura.' },
  { id: 'frame_5', name: 'Ruby Warlord', styleTitle: 'Dragon Chamfer Crests', minLevel: 20, color: '#ef4444', border: '2.5px solid #ef4444', glow: 'none', badge: 'Lvl 20', desc: 'Crimson dragonflame rim with diamond armor corner crests.' },
  { id: 'frame_6', name: 'Amethyst Archon', styleTitle: 'Arcane Cardinal Studs', minLevel: 25, color: '#8b5cf6', border: '2.5px solid #8b5cf6', glow: 'none', badge: 'Lvl 25', desc: 'Mystic violet resonant aura with 4 celestial star diamonds.' },
  { id: 'frame_7', name: 'Neon Matrix', styleTitle: 'Cyber Laser Crosshairs', minLevel: 30, color: '#06b6d4', border: '2.5px dashed #06b6d4', glow: 'none', badge: 'Lvl 30', desc: 'Cyberpunk dashed high-voltage circuit with laser corner tags.' },
  { id: 'frame_8', name: 'Titanium Elite', styleTitle: 'Aerospace Chrome Rivets', minLevel: 35, color: '#cbd5e1', border: '3.5px double #cbd5e1', glow: 'none', badge: 'Lvl 35', desc: 'Aerospace platinum double band with industrial corner rivets.' },
  { id: 'frame_9', name: 'Obsidian Sovereign', styleTitle: 'Void Plasma Wings', minLevel: 40, color: '#ec4899', border: '2.5px solid #ec4899', glow: 'none', badge: 'Lvl 40', desc: 'Stealth dark obsidian with hot-pink cyber edge & plasma wings.' },
  { id: 'frame_10', name: 'Grandmaster Celestial', styleTitle: 'Legendary Chroma Crown', minLevel: 50, color: '#fbbf24', border: '2.5px solid #fbbf24', glow: 'none', badge: 'Lvl 50 (MAX)', desc: 'Mythic chromatic rainbow gradient, golden crown & stellar stars.' }
];

const NOTIFICATIONS_DATA = [
  { text: '<strong>ICAI MTP Practice Active:</strong> Paper 1 Advanced Accounting Mock Test 1 is now available.', time: 'Just now', dot: 'blue' },
  { text: '<strong>Law Case Scenario Added:</strong> Section 135 CSR & Turquand Rule drafting drills.', time: '2 hours ago', dot: 'blue' },
  { text: 'You are currently in <strong>#12 Rank</strong> on the nationwide CA Inter leaderboard!', time: 'Yesterday', dot: 'gray' },
  { text: '<strong>Active Streak Flame:</strong> Consistent study momentum maintained.', time: '2 days ago', dot: 'gray' }
];

const TESTS_DATA = {
  live: { title: 'ICAI Full Mock 1 — Paper 1 (Adv Accounts)', info: '15 Case Scenario MCQs & 85 Descriptive Marks · 3 Hours', status: 'LIVE SOON' },
  upcoming: [
    { title: 'MTP 1 — Paper 2 (Corporate & Other Laws)', subtitle: 'Tomorrow · 2:00 PM · 100 Marks' },
    { title: 'Grand Mock Series — Group 1', subtitle: 'Sun, May 10 · 2:00 PM' }
  ],
  past: [
    { title: 'Taxation GST Mock 1', subtitle: 'Score: 78/100 · AIR #4', score: 78 },
    { title: 'Cost & Management Acct Mock', subtitle: 'Score: 84/100 · AIR #2', score: 84 }
  ]
};

const BOOKMARKS_DATA = [
  { q: 'What are the preconditions for an audit under SA 210?', tag: 'Audit', meta: 'SA 210 · Ch 1' },
  { q: 'Explain the Turquand Rule and its exceptions under Companies Act 2013.', tag: 'Law', meta: 'Sec 399 · Ch 1' },
  { q: 'Inventory valuation when finished goods are expected to sell below cost.', tag: 'Accounts', meta: 'AS 2 · Ch 1' },
  { q: 'Tax treatment of foreign income for a Deemed Resident u/s 6(1A).', tag: 'Taxation', meta: 'Sec 6(1A) · Ch 1' }
];

// Attach to window
window.MCQ_DATA = MCQ_DATA;
window.CASE_BOOKLETS_30M = CASE_BOOKLETS_30M;
window.LEADERBOARD_DATA = LEADERBOARD_DATA;
window.getTierFromXP = getTierFromXP;
window.AVATAR_FRAMES = AVATAR_FRAMES;
window.NOTIFICATIONS_DATA = NOTIFICATIONS_DATA;
window.TESTS_DATA = TESTS_DATA;
window.BOOKMARKS_DATA = BOOKMARKS_DATA;

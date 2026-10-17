// ============================================
// InterEdge - Core CA Intermediate Data Engine
// Aligned with ICAI New Scheme (May 2027 & Beyond)
// ============================================

// ===== 6 CA INTERMEDIATE PAPERS & QUESTION BANK =====
const MCQ_DATA = {
  // Paper 1: Advanced Accounting
  adv_acc: {
    id: 'adv_acc',
    paper: 'Paper 1',
    group: 'Group 1',
    name: 'Advanced Accounting',
    shortName: 'Accounts',
    color: '#3b82f6',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/></svg>`,
    chapters: [
      {
        id: 'acc_ch1',
        num: 1,
        title: 'Accounting Standards & Framework (AS 1, 2, 3, 10, 16)',
        concepts: ['Disclosure of Policies (AS 1)', 'Inventory Valuation (AS 2)', 'Cash Flow Statement (AS 3)', 'PPE (AS 10)', 'Borrowing Costs (AS 16)'],
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
            narrative: 'Apex Manufacturing Ltd is a leading chemical processor in Gujarat. During FY 2025-26, the company purchased raw materials for ₹50,00,000 (inclusive of recoverable GST of ₹6,00,000). Freight inward paid was ₹1,50,000, and non-refundable import duties paid were ₹2,50,000. Due to a boiler leakage, raw material worth ₹3,00,000 was damaged and written off as abnormal wastage. Storage costs of finished goods incurred were ₹1,20,000. Additionally, the company constructed a specialized warehouse (a qualifying asset) costing ₹80,00,000 using specific borrowed funds at 10% p.a. Construction took 14 months, but work was completely halted for 3 months due to local community protests unrelated to technical readiness.',
            questions: [
              {
                q: 'What is the correct cost of raw material inventory to be recognized under AS 2?',
                options: ['₹48,00,000', '₹45,00,000', '₹54,00,000', '₹51,00,000'],
                correct: 0,
                explanation: 'Purchase price (excl. recoverable GST): ₹44,00,000 + Freight inward: ₹1,50,000 + Import duty: ₹2,50,000 = ₹48,00,000. Abnormal waste is excluded.',
                marks: 2,
                xp: 25
              },
              {
                q: 'How should the storage cost of ₹1,20,000 of finished goods be treated in financial statements?',
                options: ['Added to inventory cost', 'Expensed in Profit & Loss Account', 'Capitalized under Property, Plant & Equipment', 'Deferred to next financial year'],
                correct: 1,
                explanation: 'Storage costs are expensed in Profit & Loss unless those costs are necessary in the production process prior to a further production stage.',
                marks: 2,
                xp: 25
              },
              {
                q: 'Under AS 16, should borrowing costs during the 3-month protest stoppage be capitalized?',
                options: ['Yes, fully capitalized into warehouse asset', 'No, capitalization must be suspended and interest expensed to P&L', '50% capitalized and 50% expensed', 'Capitalized only if approved by Board'],
                correct: 1,
                explanation: 'Active development was interrupted by protests (not a necessary temporary step). Hence capitalization must be suspended for 3 months and charged to P&L.',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            topic: 'AS 2 — Net Realizable Value (NRV) Rule',
            prompt: 'Explain the valuation principle for raw materials when finished goods are expected to be sold at or below cost.',
            provision: 'AS 2 (Revised) stipulates that materials and supplies held for use in the production of inventories are NOT written down below cost if the finished products in which they will be incorporated are expected to be sold at or above cost.',
            analysis: 'However, when there has been a decline in the price of materials and it is estimated that the cost of finished products will exceed net realizable value, the materials are written down to net realizable value. In such cases, replacement cost may be the best available measure of their NRV.',
            conclusion: 'Write down raw material to replacement cost ONLY if finished goods are sold below total cost.'
          }
        ]
      },
      {
        id: 'acc_ch2',
        num: 2,
        title: 'Company Accounts: Buyback of Shares & Internal Reconstruction',
        concepts: ['Sec 68 Buy Back Conditions', 'Solvency Declarations', 'Capital Reduction Account', 'Scheme of Reconstruction'],
        questions: [
          {
            q: 'Under Section 68 of the Companies Act 2013, the maximum buyback of equity shares in any financial year is capped at:',
            options: ['25% of total paid up equity capital and free reserves', '25% of total paid up equity capital only', '10% of total paid up capital without special resolution', '15% of net worth'],
            correct: 1,
            explanation: 'Under Sec 68(2)(c), the buyback of equity shares in any financial year cannot exceed 25% of its total paid-up equity capital in that financial year.',
            marks: 2,
            xp: 20
          },
          {
            q: 'In an internal reconstruction scheme, any balance remaining in Capital Reduction Account after writing off accumulated losses is transferred to:',
            options: ['General Reserve', 'Securities Premium Account', 'Capital Reserve', 'Profit & Loss Account'],
            correct: 2,
            explanation: 'Any surplus credit balance remaining in Capital Reduction Account represents a capital profit and must be transferred to Capital Reserve Account.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: []
      }
    ]
  },

  // Paper 2: Corporate and Other Laws
  law: {
    id: 'law',
    paper: 'Paper 2',
    group: 'Group 1',
    name: 'Corporate and Other Laws',
    shortName: 'Law',
    color: '#ef4444',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
    chapters: [
      {
        id: 'law_ch1',
        num: 1,
        title: 'Company Incorporation & Incidental Matters (Sec 1-22)',
        concepts: ['Doctrine of Ultra Vires', 'Doctrine of Indoor Management', 'Alteration of MOA/AOA', 'Section 8 Companies'],
        questions: [
          {
            q: 'Under Section 8 of the Companies Act 2013, a non-profit company is prohibited from:',
            options: ['Investing funds in government bonds', 'Paying any dividend to its members', 'Accepting donations from overseas', 'Amending its object clause with Central Government approval'],
            correct: 1,
            explanation: 'A Section 8 company must apply its profits solely in promoting its objectives and is strictly prohibited from paying any dividend to its members.',
            marks: 2,
            xp: 20
          },
          {
            q: 'The doctrine that protects outsiders against irregularities inside the internal management of a company is known as:',
            options: ['Doctrine of Constructive Notice', 'Doctrine of Ultra Vires', 'Doctrine of Indoor Management (Turquand Rule)', 'Doctrine of Subrogation'],
            correct: 2,
            explanation: 'The Rule in Royal British Bank v. Turquand protects third parties acting in good faith from irregularities in internal company approvals.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_law_1',
            caseTitle: 'Zenith Logistics Ltd — Unauthorized Borrowing & Turquand Defense',
            narrative: 'The Articles of Association of Zenith Logistics Ltd authorized the Board of Directors to borrow funds up to ₹1,00,00,000 on behalf of the company, with borrowing beyond that sum requiring prior approval by an Ordinary Resolution at a General Meeting. The Directors, without convening a General Meeting or obtaining shareholder approval, approached Pioneer Finance Ltd and executed a mortgage bond for ₹1,80,00,000 under the common seal of the company. Pioneer Finance Ltd did not inspect the register of resolutions but verified that borrowing was within the general power of the company as per the MOA. When Zenith Logistics Ltd defaulted, the company denied liability for the excess ₹80,00,000, arguing the mortgage was ultra vires the directors.',
            questions: [
              {
                q: 'Can Pioneer Finance Ltd enforce the mortgage against Zenith Logistics Ltd under the Doctrine of Indoor Management?',
                options: ['Yes, fully enforceable because internal procedural compliance is presumed', 'No, unenforceable because external lenders have constructive notice of AOA borrowing limits', 'Only enforceable up to ₹1,00,00,000', 'Void ab initio against both parties'],
                correct: 0,
                explanation: 'Under Royal British Bank v. Turquand, lenders who observe the public documents (AOA allows borrowing with a resolution) are entitled to assume the internal resolution was duly passed.',
                marks: 2,
                xp: 25
              },
              {
                q: 'Which exception to the Turquand Rule would have invalidated Pioneer Finance’s defense?',
                options: ['Constructive notice of public documents', 'Actual knowledge of the irregularity or suspicious circumstances', 'Company seal was slightly faded', 'Absence of notary attestation'],
                correct: 1,
                explanation: 'The protection of Indoor Management is lost if the outsider has actual knowledge of non-compliance or if circumstances put a prudent person on inquiry.',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            topic: 'Royal British Bank v. Turquand (Indoor Management)',
            prompt: 'Explain the 3-step ICAI presentation when an outsider deals with a company whose directors breached an internal limit.',
            provision: 'Section 399 of Companies Act 2013 deals with inspection of documents. While outsiders have constructive notice of MOA/AOA, the Doctrine of Indoor Management protects them regarding internal management regularity.',
            analysis: 'Outsiders are bound to read public documents to ensure transactions conform to the company constitution, but they are not bound to inquire whether internal secret resolutions have been satisfied.',
            conclusion: 'The transaction is valid and binding on the company unless the outsider acted with forgery, negligence, or actual knowledge.'
          }
        ]
      },
      {
        id: 'law_ch2',
        num: 2,
        title: 'Management & Administration (Sec 88-122: AGM, EGM, Resolutions)',
        concepts: ['Annual General Meeting (Sec 96)', 'Notice Period & Short Notice (Sec 101)', 'Quorum for Meetings (Sec 103)', 'Postal Ballot (Sec 110)'],
        questions: [
          {
            q: 'Under Section 96, the gap between two Annual General Meetings of a company shall not exceed:',
            options: ['12 months', '15 months', '18 months', '6 months'],
            correct: 1,
            explanation: 'Under Sec 96(1), not more than 15 months shall elapse between the date of one AGM of a company and that of the next.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: []
      }
    ]
  },

  // Paper 3: Taxation (Income Tax & GST)
  tax: {
    id: 'tax',
    paper: 'Paper 3',
    group: 'Group 1',
    name: 'Taxation (Income Tax & GST)',
    shortName: 'Taxation',
    color: '#10b981',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>`,
    chapters: [
      {
        id: 'tax_ch1',
        num: 1,
        title: 'Basic Concepts & Residential Status (Sec 1 to 6)',
        concepts: ['Sec 6(1) Basic Conditions', 'Sec 6(6) Additional Conditions', 'Deemed Resident Sec 6(1A)', 'Scope of Total Income Sec 5'],
        questions: [
          {
            q: 'An Indian citizen who leaves India during the previous year for the purpose of employment outside India is a resident if he stays in India for at least:',
            options: ['60 days', '120 days', '182 days', '90 days'],
            correct: 2,
            explanation: 'In the case of an Indian citizen leaving India for employment abroad, the 60-day condition in Sec 6(1)(c) is substituted by 182 days.',
            marks: 2,
            xp: 20
          },
          {
            q: 'Under Section 115BAC (Default Tax Regime), what is the basic exemption limit for FY 2025-26?',
            options: ['₹2,50,000', '₹3,00,000', '₹5,00,000', '₹7,00,000'],
            correct: 1,
            explanation: 'Under the default concessional tax regime u/s 115BAC, income up to ₹3,00,000 is taxed at Nil rate.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_tax_1',
            caseTitle: 'Mr. Rohan Mehta — Cross-Border Consultancy & NRI Status',
            narrative: 'Mr. Rohan Mehta, an Indian citizen and software consultant, resided continuously in India until 15th August 2025, when he left India to join an IT firm in Singapore. His total physical stay in India during FY 2025-26 was 137 days. In the preceding 4 financial years, his stay in India was 410 days. During FY 2025-26, he earned salary in Singapore equivalent to ₹28,00,000 (credited to his Singapore bank account). He also earned dividend of ₹80,000 from Indian companies and rental income of ₹3,60,000 from a commercial property in Bangalore.',
            questions: [
              {
                q: 'What is the residential status of Mr. Rohan Mehta for FY 2025-26?',
                options: ['Resident and Ordinarily Resident (ROR)', 'Resident but Not Ordinarily Resident (RNOR)', 'Non-Resident (NR)', 'Deemed Resident u/s 6(1A)'],
                correct: 2,
                explanation: 'Since he left India for employment, only the 182-day rule applies under Sec 6(1). His stay of 137 days is less than 182 days, so he is a Non-Resident.',
                marks: 2,
                xp: 25
              },
              {
                q: 'Is his Singapore salary of ₹28,00,000 taxable in India?',
                options: ['Yes, Indian citizens are taxed on worldwide income', 'No, income accrued and received outside India is not taxable for a Non-Resident', 'Taxable at flat 20%', 'Taxable only if remitted to India'],
                correct: 1,
                explanation: 'For a Non-Resident, income which accrues or arises outside India and is received outside India is NOT included in total income u/s 5.',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            topic: 'Deemed Resident u/s 6(1A)',
            prompt: 'When is an Indian citizen deemed to be resident in India under Section 6(1A)?',
            provision: 'Section 6(1A) provides that an Indian citizen having total income (other than foreign source income) exceeding ₹15 Lakhs during the previous year shall be deemed to be resident in India.',
            analysis: 'This applies if he is not liable to tax in any other country or territory by reason of his domicile, residence, or similar criteria. Such deemed resident is ALWAYS treated as Resident but Not Ordinarily Resident (RNOR).',
            conclusion: 'Condition: Citizen + Indian Income > ₹15L + Not liable to tax anywhere globally.'
          }
        ]
      },
      {
        id: 'tax_ch2',
        num: 2,
        title: 'GST: Input Tax Credit (ITC) & Supply Concepts',
        concepts: ['Sec 16 Eligibility for ITC', 'Sec 17(5) Blocked Credits', 'Time of Supply', 'Value of Supply'],
        questions: [
          {
            q: 'Under Section 17(5) of the CGST Act, Input Tax Credit is BLOCKED in respect of:',
            options: ['Motor vehicles for transportation of goods', 'Motor vehicles for transportation of persons having approved seating capacity up to 13 persons', 'Plant and machinery used in factory', 'Computers used in office'],
            correct: 1,
            explanation: 'Sec 17(5)(a) blocks ITC on motor vehicles for transportation of persons having approved seating capacity of not more than 13 persons (including driver), unless used for specific passenger transport/driving school purposes.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: []
      }
    ]
  },

  // Paper 4: Cost and Management Accounting
  cost: {
    id: 'cost',
    paper: 'Paper 4',
    group: 'Group 2',
    name: 'Cost and Management Accounting',
    shortName: 'Costing',
    color: '#f59e0b',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    chapters: [
      {
        id: 'cost_ch1',
        num: 1,
        title: 'Material Cost & Inventory Optimization (EOQ, Stock Levels)',
        concepts: ['Economic Order Quantity (EOQ)', 'Reorder Level & Safety Stock', 'Inventory Valuation (FIFO/WAC)', 'ABC & VED Analysis'],
        questions: [
          {
            q: 'Annual demand for raw material is 10,000 units. Ordering cost per order is ₹50, and carrying cost per unit p.a. is ₹4. The Economic Order Quantity (EOQ) is:',
            options: ['500 units', '400 units', '250 units', '600 units'],
            correct: 0,
            explanation: 'EOQ = √(2 × Annual Demand × Ordering Cost / Carrying Cost) = √(2 × 10,000 × 50 / 4) = √(250,000) = 500 units.',
            marks: 2,
            xp: 20
          },
          {
            q: 'At the Economic Order Quantity (EOQ), which relationship holds true?',
            options: ['Total Ordering Cost > Total Carrying Cost', 'Total Ordering Cost = Total Carrying Cost', 'Total Ordering Cost < Total Carrying Cost', 'Total Cost is at its maximum'],
            correct: 1,
            explanation: 'At EOQ, total annual ordering costs exactly equal total annual carrying costs, and total annual inventory cost is minimized.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_cost_1',
            caseTitle: 'Zenon Electronics — Discount Policy vs EOQ Evaluation',
            narrative: 'Zenon Electronics manufactures LED controllers. It purchases components at ₹200 per unit. Annual consumption is 18,000 units. Cost of placing each order is ₹300, and inventory holding cost is 12% per annum of purchase price. The supplier offers an order-size discount: if Zenon orders in lots of 3,000 units or more, a discount of 2% on the purchase price will be granted.',
            questions: [
              {
                q: 'What is the Economic Order Quantity (EOQ) without supplier discount?',
                options: ['671 units', '750 units', '600 units', '800 units'],
                correct: 0,
                explanation: 'Carrying cost = 12% of ₹200 = ₹24. EOQ = √(2 × 18,000 × 300 / 24) = √(450,000) ≈ 670.82 ≈ 671 units.',
                marks: 2,
                xp: 25
              },
              {
                q: 'Should Zenon accept the 2% discount offer for order quantity of 3,000 units?',
                options: ['Yes, net annual savings exceed additional holding costs', 'No, carrying cost drastically outweighs discount', 'Indifferent at both volumes', 'Data insufficient to compute'],
                correct: 0,
                explanation: '2% discount on ₹36,00,000 total purchase value is ₹72,000. Total annual cost with discount is lower, so the offer should be accepted.',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            topic: 'Reorder Level & Safety Stock',
            prompt: 'State the formulas for Reorder Level (ROL) and Maximum Stock Level in Cost Accounting.',
            provision: 'Re-order Level = Maximum Consumption Rate × Maximum Lead Time.',
            analysis: 'Maximum Level = Re-order Level + Re-order Quantity (EOQ) - (Minimum Consumption Rate × Minimum Lead Time).',
            conclusion: 'Safety stock buffers against unexpected production spikes and supplier shipping delays.'
          }
        ]
      },
      {
        id: 'cost_ch2',
        num: 2,
        title: 'Marginal Costing & CVP Analysis',
        concepts: ['Contribution & PV Ratio', 'Break-even Point (BEP)', 'Margin of Safety', 'Key Factor Analysis'],
        questions: [
          {
            q: 'If Selling Price is ₹20, Variable Cost is ₹12, and Fixed Costs are ₹80,000, what is the Break-even Point in units?',
            options: ['10,000 units', '8,000 units', '12,000 units', '6,667 units'],
            correct: 0,
            explanation: 'Contribution = SP - VC = ₹20 - ₹12 = ₹8. BEP (units) = Fixed Cost / Contribution per unit = 80,000 / 8 = 10,000 units.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: []
      }
    ]
  },

  // Paper 5: Auditing and Ethics
  audit: {
    id: 'audit',
    paper: 'Paper 5',
    group: 'Group 2',
    name: 'Auditing and Ethics',
    shortName: 'Audit',
    color: '#8b5cf6',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    chapters: [
      {
        id: 'audit_ch1',
        num: 1,
        title: 'Nature, Objective and Scope of Audit (SA 200, 210)',
        concepts: ['Professional Skepticism', 'Inherent Limitations of Audit', 'Preconditions for Audit (SA 210)', 'Auditor Independence'],
        questions: [
          {
            q: 'As per SA 200, "Professional Skepticism" requires the auditor to:',
            options: ['Assume management is always dishonest', 'Maintain a questioning mind and be alert to conditions indicating possible misstatement', 'Rely solely on oral management representations', 'Guarantee 100% fraud detection in financial statements'],
            correct: 1,
            explanation: 'SA 200 defines Professional Skepticism as an attitude that includes a questioning mind, being alert to conditions which may indicate possible misstatement due to error or fraud, and a critical assessment of audit evidence.',
            marks: 2,
            xp: 20
          },
          {
            q: 'Which of the following is NOT an inherent limitation of an audit according to SA 200?',
            options: ['Nature of financial reporting involving management judgment', 'Nature of audit procedures (sampling and non-cooperation)', 'Auditor negligence and failure to adhere to standards', 'Timeliness of financial reporting and balance between benefit and cost'],
            correct: 2,
            explanation: 'Auditor negligence is a personal breach of professional duty, NOT an inherent limitation of the audit process.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_audit_1',
            caseTitle: 'M/s Sharma & Associates — Appointment Conflict & Independence',
            narrative: 'M/s Sharma & Associates, Chartered Accountants, were approached for appointment as statutory auditors of Delta Steels Ltd for FY 2025-26. CA Rahul Sharma is the senior partner. During preliminary independence verification, it was discovered that CA Rahul’s brother-in-law holds shares in Delta Steels Ltd having a face value of ₹1,20,000 (market value ₹8,50,000). The firm also provides internal book-keeping and IT consulting services to a subsidiary of Delta Steels Ltd.',
            questions: [
              {
                q: 'Under Section 141(3)(d) of the Companies Act 2013, can CA Rahul’s relative hold shares in the company?',
                options: ['Relative can hold shares having face value up to ₹1,00,000', 'Relative cannot hold any shares whatsoever', 'Relative can hold shares up to market value ₹5,00,000', 'No restrictions on brother-in-law'],
                correct: 0,
                explanation: 'Under Sec 141(3)(d)(i) read with Rule 10, a relative of an auditor may hold securities in the company of face value not exceeding ₹1,00,000.',
                marks: 2,
                xp: 25
              },
              {
                q: 'Can the firm provide internal book-keeping services to the client subsidiary under Section 144?',
                options: ['Yes, because it is a separate legal entity', 'No, Section 144 strictly prohibits accounting and book-keeping services to the company and its subsidiaries', 'Permitted if audit committee approves', 'Permitted if fees are less than 10%'],
                correct: 1,
                explanation: 'Section 144 prohibits statutory auditors from providing accounting, internal audit, and IT consulting services to the company, its holding, or its subsidiary companies.',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            topic: 'SA 210 — Agreement on Audit Terms',
            prompt: 'What must an auditor establish to verify the preconditions for an audit?',
            provision: 'SA 210 mandates that to establish preconditions, the auditor shall determine whether the financial reporting framework is acceptable and obtain management acknowledgement of its responsibilities.',
            analysis: 'Management must acknowledge responsibility for preparation of FS in accordance with the framework, internal controls necessary to enable FS free from material misstatement, and providing unrestricted access to all information and personnel.',
            conclusion: 'If preconditions are not present, the auditor shall not accept the proposed audit engagement.'
          }
        ]
      },
      {
        id: 'audit_ch2',
        num: 2,
        title: 'Audit Evidence & Risk Assessment (SA 500, SA 315)',
        concepts: ['Sufficiency & Appropriateness (SA 500)', 'External Confirmations (SA 505)', 'Risk of Material Misstatement', 'Internal Control Evaluation'],
        questions: [
          {
            q: 'Under SA 500, which form of audit evidence is generally considered most reliable?',
            options: ['Oral statements by client management', 'Documentary evidence obtained directly from knowledgeable independent third parties', 'Photocopies of internal purchase orders', 'Self-prepared client spreadsheets'],
            correct: 1,
            explanation: 'Audit evidence is more reliable when it is obtained from independent sources outside the entity in documentary or electronic form directly by the auditor.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: []
      }
    ]
  },

  // Paper 6: Financial Management and Strategic Management (FM-SM)
  fmsm: {
    id: 'fmsm',
    paper: 'Paper 6',
    group: 'Group 2',
    name: 'FM & Strategic Management',
    shortName: 'FM-SM',
    color: '#06b6d4',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>`,
    chapters: [
      {
        id: 'fmsm_ch1',
        num: 1,
        title: 'Capital Budgeting & Investment Decisions (NPV, IRR)',
        concepts: ['Net Present Value (NPV)', 'Internal Rate of Return (IRR)', 'Profitability Index (PI)', 'Payback & Discounted Payback'],
        questions: [
          {
            q: 'When evaluating mutually exclusive projects with unequal initial outlays, the theoretically superior criterion is:',
            options: ['Highest Internal Rate of Return (IRR)', 'Highest Net Present Value (NPV)', 'Shortest Payback Period', 'Highest Accounting Rate of Return'],
            correct: 1,
            explanation: 'NPV directly measures absolute wealth addition to shareholders and is superior in mutually exclusive choices, avoiding IRR reinvestment rate conflicts.',
            marks: 2,
            xp: 20
          },
          {
            q: 'A project has an initial cost of ₹1,00,000 and generates cash inflows of ₹40,000 p.a. for 4 years. If discount rate is 10% (PVIFA @ 10%, 4 yrs = 3.170), the NPV is:',
            options: ['₹26,800', '₹32,400', '₹20,000', '₹28,500'],
            correct: 0,
            explanation: 'Present Value of Inflows = ₹40,000 × 3.170 = ₹1,26,800. NPV = PV of Inflows - Initial Outflow = ₹1,26,800 - ₹1,00,000 = ₹26,800.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [
          {
            caseId: 'cs_fm_1',
            caseTitle: 'Solaris Energy Ltd — Solar Farm Expansion Decision',
            narrative: 'Solaris Energy Ltd is considering installing an automated rooftop solar array costing ₹50,00,000. Useful life is 5 years with zero salvage value. The project is expected to generate operational cash savings (before tax and depreciation) of ₹18,00,000 each year. Straight-line depreciation is used for tax purposes. Corporate tax rate is 30%. Company’s cost of capital (WACC) is 12%. Present Value Factors at 12%: Y1=0.893, Y2=0.797, Y3=0.712, Y4=0.636, Y5=0.567 (Total PVIFA = 3.605).',
            questions: [
              {
                q: 'What is the annual operating cash flow after tax (CFAT) for the solar array?',
                options: ['₹15,60,000', '₹12,60,000', '₹18,00,000', '₹14,20,000'],
                correct: 0,
                explanation: 'Depreciation = 50L / 5 = 10L. Profit before tax = 18L - 10L = 8L. Tax @ 30% = 2.4L. Profit after tax = 5.6L. CFAT = PAT + Depreciation = 5.6L + 10L = ₹15,60,000.',
                marks: 2,
                xp: 25
              },
              {
                q: 'What is the Net Present Value (NPV) of this investment?',
                options: ['₹6,23,800', '₹8,45,200', '₹5,12,000', '₹7,15,000'],
                correct: 0,
                explanation: 'PV of Cash Inflows = ₹15,60,000 × 3.605 = ₹56,23,800. NPV = ₹56,23,800 - ₹50,00,000 = ₹6,23,800. Accept project.',
                marks: 2,
                xp: 25
              }
            ]
          }
        ],
        flashcards: [
          {
            topic: 'Michael Porter’s 5 Competitive Forces (Strategic Management)',
            prompt: 'Name Porter’s Five Forces that shape industry competition.',
            provision: 'Porter’s model identifies five structural forces determining industry attractiveness and long-term profitability.',
            analysis: '1. Threat of new entrants, 2. Bargaining power of buyers, 3. Bargaining power of suppliers, 4. Threat of substitute products/services, 5. Rivalry among existing competitors.',
            conclusion: 'Understanding these forces enables CA students to evaluate strategic business risk.'
          }
        ]
      },
      {
        id: 'fmsm_ch2',
        num: 2,
        title: 'Leverages: Operating, Financial and Combined',
        concepts: ['Operating Leverage (DOL)', 'Financial Leverage (DFL)', 'Combined Leverage (DCL)', 'EBIT-EPS Analysis'],
        questions: [
          {
            q: 'Degree of Combined Leverage (DCL) measures the sensitivity of:',
            options: ['EPS to changes in Sales', 'EBIT to changes in Sales', 'EPS to changes in EBIT', 'Sales to changes in Fixed Costs'],
            correct: 0,
            explanation: 'Combined Leverage (DOL × DFL) measures the percentage change in Earnings Per Share (EPS) resulting from a percentage change in Sales.',
            marks: 2,
            xp: 20
          }
        ],
        caseScenarios: [],
        flashcards: []
      }
    ]
  }
};

// Aliases for legacy router compatibility
MCQ_DATA.maths = MCQ_DATA.cost;
MCQ_DATA.economics = MCQ_DATA.fmsm;

// ===== 20 REALISTIC CA INTERMEDIATE STUDENTS & 5 TIERS =====
// Tiers:
// 1. In The Zone (Ranks 1-3, XP 4,800+)
// 2. Focused (Ranks 4-8, XP 3,500 - 4,799)
// 3. Hustler (Ranks 9-12, XP 2,500 - 3,499)
// 4. Grinder (Ranks 13-16, XP 1,600 - 2,499)
// 5. Rookie (Ranks 17-20, XP 600 - 1,599)
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
  { id: 'frame_1', name: 'Bronze Frame', minLevel: 1, color: '#cd7f32', border: '2px solid #cd7f32', glow: 'rgba(205,127,50,0.3)', badge: 'Lvl 1' },
  { id: 'frame_2', name: 'Emerald Frame', minLevel: 5, color: '#10b981', border: '2px solid #10b981', glow: 'rgba(16,185,129,0.4)', badge: 'Lvl 5' },
  { id: 'frame_3', name: 'Sapphire Frame', minLevel: 10, color: '#3b82f6', border: '2.5px solid #3b82f6', glow: 'rgba(59,130,246,0.45)', badge: 'Lvl 10' },
  { id: 'frame_4', name: 'Amber Frame', minLevel: 15, color: '#f59e0b', border: '2.5px solid #f59e0b', glow: 'rgba(245,158,11,0.5)', badge: 'Lvl 15' },
  { id: 'frame_5', name: 'Ruby Frame', minLevel: 20, color: '#ef4444', border: '3px solid #ef4444', glow: 'rgba(239,68,68,0.55)', badge: 'Lvl 20' },
  { id: 'frame_6', name: 'Amethyst Frame', minLevel: 25, color: '#8b5cf6', border: '3px solid #8b5cf6', glow: 'rgba(139,92,246,0.6)', badge: 'Lvl 25' },
  { id: 'frame_7', name: 'Neon Frame', minLevel: 30, color: '#06b6d4', border: '3px dashed #06b6d4', glow: 'rgba(6,182,212,0.65)', badge: 'Lvl 30' },
  { id: 'frame_8', name: 'Platinum Frame', minLevel: 35, color: '#94a3b8', border: '3px double #e2e8f0', glow: 'rgba(226,232,240,0.7)', badge: 'Lvl 35' },
  { id: 'frame_9', name: 'Obsidian Frame', minLevel: 40, color: '#ec4899', border: '3.5px solid #ec4899', glow: 'rgba(236,72,153,0.75)', badge: 'Lvl 40' },
  { id: 'frame_10', name: 'Gold Crown Frame', minLevel: 50, color: '#fbbf24', border: '4px solid #fbbf24', glow: 'rgba(251,191,36,0.85)', badge: 'Lvl 50 (MAX)' }
];

const NOTIFICATIONS_DATA = [
  { text: '<strong>ICAI MTP Practice Active:</strong> Paper 1 Advanced Accounting Mock Test 1 is now available.', time: 'Just now', dot: 'blue' },
  { text: '<strong>Law Case Scenario Added:</strong> Section 135 CSR & Turquand Rule drafting drills.', time: '2 hours ago', dot: 'blue' },
  { text: 'You are currently in <strong>#12 Rank</strong> on the nationwide CA Inter leaderboard!', time: 'Yesterday', dot: 'gray' },
  { text: '<strong>Active Streak Flame:</strong> Consistent study momentum maintained.', time: '2 days ago', dot: 'gray' }
];

const TESTS_DATA = {
  live: { title: 'ICAI Full Mock 1 — Paper 1 (Adv Accounts)', info: '15 Case Scenario MCQs & 85 Descriptive Marks \u00b7 3 Hours', status: 'LIVE SOON' },
  upcoming: [
    { title: 'MTP 1 — Paper 2 (Corporate & Other Laws)', subtitle: 'Tomorrow \u00b7 2:00 PM \u00b7 100 Marks' },
    { title: 'Grand Mock Series — Group 1', subtitle: 'Sun, May 10 \u00b7 2:00 PM' }
  ],
  past: [
    { title: 'Taxation GST Mock 1', subtitle: 'Score: 78/100 \u00b7 AIR #4', score: 78 },
    { title: 'Cost & Management Acct Mock', subtitle: 'Score: 84/100 \u00b7 AIR #2', score: 84 }
  ]
};

const BOOKMARKS_DATA = [
  { q: 'What are the preconditions for an audit under SA 210?', tag: 'Audit', meta: 'SA 210 \u00b7 Ch 1' },
  { q: 'Explain the Turquand Rule and its exceptions under Companies Act 2013.', tag: 'Law', meta: 'Sec 399 \u00b7 Ch 1' },
  { q: 'Inventory valuation when finished goods are expected to sell below cost.', tag: 'Accounts', meta: 'AS 2 \u00b7 Ch 1' },
  { q: 'Tax treatment of foreign income for a Deemed Resident u/s 6(1A).', tag: 'Taxation', meta: 'Sec 6(1A) \u00b7 Ch 1' }
];

// Attach to window
window.MCQ_DATA = MCQ_DATA;
window.LEADERBOARD_DATA = LEADERBOARD_DATA;
window.getTierFromXP = getTierFromXP;
window.AVATAR_FRAMES = AVATAR_FRAMES;
window.NOTIFICATIONS_DATA = NOTIFICATIONS_DATA;
window.TESTS_DATA = TESTS_DATA;
window.BOOKMARKS_DATA = BOOKMARKS_DATA;

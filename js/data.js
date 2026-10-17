// ============================================
// InterEdge - Dummy Data
// CA Intermediate MCQs & Questions
// ============================================

const MCQ_DATA = {
  maths: {
    id: 'maths',
    name: 'Maths & Stats',
    color: '#ffb534',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="7" r="1.5"/><line x1="8.5" y1="15.5" x2="10.5" y2="13.5"/><line x1="13.5" y1="10.5" x2="15.5" y2="8.5"/></svg>`,
    chapters: [
      {
        id: 'm1',
        num: 1,
        title: 'Ratio and Proportion',
        questionCount: 5,
        questions: [
          {
            q: 'If a:b = 2:3 and b:c = 4:5, then a:c is equal to:',
            options: ['8:15', '6:20', '5:8', '7:12'],
            correct: 0,
            explanation: 'a:b = 2:3 and b:c = 4:5. Making b common: a:b = 8:12 and b:c = 12:15. Therefore a:c = 8:15.'
          },
          {
            q: 'The ratio of incomes of A and B is 5:4 and the ratio of their expenditures is 3:2. If each saves Rs. 1600 at the end of the year, the income of A is:',
            options: ['Rs. 4000', 'Rs. 3600', 'Rs. 3200', 'Rs. 4800'],
            correct: 0,
            explanation: 'Let incomes be 5x and 4x. Expenditures be 3y and 2y. Savings: 5x-3y = 1600, 4x-2y = 1600. Solving: x = 800, so A\'s income = 5 × 800 = Rs. 4000.'
          },
          {
            q: 'If 20% of A = 30% of B, then A:B equals:',
            options: ['3:2', '2:3', '3:4', '4:3'],
            correct: 0,
            explanation: '0.20A = 0.30B → A/B = 0.30/0.20 = 3/2 → A:B = 3:2.'
          },
          {
            q: 'The third proportional to 9 and 12 is:',
            options: ['16', '15', '18', '20'],
            correct: 0,
            explanation: 'If x is the third proportional to 9 and 12: 9:12 = 12:x → 9x = 144 → x = 16.'
          },
          {
            q: 'In a mixture of 60 litres, the ratio of milk to water is 2:1. If this ratio is to be changed to 1:2, the quantity of water to be added is:',
            options: ['40 litres', '30 litres', '60 litres', '50 litres'],
            correct: 2,
            explanation: 'Milk = 40L, Water = 20L. For 1:2 ratio with 40L milk, water needed = 80L. Water to add = 80 - 20 = 60 litres.'
          }
        ]
      },
      {
        id: 'm2',
        num: 2,
        title: 'Indices and Logarithms',
        questionCount: 5,
        questions: [
          {
            q: 'If 2^x = 3^y = 6^z, then 1/x + 1/y equals:',
            options: ['1/z', '2/z', 'z', '3/z'],
            correct: 0,
            explanation: 'Let 2^x = 3^y = 6^z = k. Then x = logk/log2, y = logk/log3, z = logk/log6. 1/x + 1/y = log2/logk + log3/logk = (log2+log3)/logk = log6/logk = 1/z.'
          },
          {
            q: 'The value of log₂(log₃81) is:',
            options: ['2', '3', '4', '1'],
            correct: 0,
            explanation: 'log₃81 = log₃(3⁴) = 4. Then log₂(4) = log₂(2²) = 2.'
          },
          {
            q: 'If log₁₀2 = 0.3010 and log₁₀3 = 0.4771, then log₁₀12 equals:',
            options: ['1.0791', '1.1771', '1.2781', '0.9542'],
            correct: 0,
            explanation: 'log₁₀12 = log₁₀(4×3) = log₁₀4 + log₁₀3 = 2log₁₀2 + log₁₀3 = 2(0.3010) + 0.4771 = 0.6020 + 0.4771 = 1.0791.'
          },
          {
            q: 'The value of (27)^(2/3) is:',
            options: ['9', '6', '12', '18'],
            correct: 0,
            explanation: '(27)^(2/3) = (3³)^(2/3) = 3² = 9.'
          },
          {
            q: 'If a^x = b^y = c^z and abc = 1, then xy + yz + zx equals:',
            options: ['0', '1', 'xyz', '-1'],
            correct: 2,
            explanation: 'Let a^x = b^y = c^z = k. Then x = lnk/lna, y = lnk/lnb, z = lnk/lnc. Since abc=1, lna+lnb+lnc=0. After substitution, xy+yz+zx = (lnk)²(lna+lnb+lnc)/(lna·lnb·lnc) × appropriate factors = xyz(lna+lnb+lnc)/lnk = 0. Wait, correct approach gives xy + yz + zx = 0 when abc=1.'
          }
        ]
      },
      {
        id: 'm3',
        num: 3,
        title: 'Equations and Inequalities',
        questionCount: 5,
        questions: [
          {
            q: 'If the roots of x² - px + q = 0 are consecutive integers, then:',
            options: ['p² - 4q - 1 = 0', 'p² - 4q + 1 = 0', 'p² + 4q - 1 = 0', 'p² + 4q + 1 = 0'],
            correct: 0,
            explanation: 'Let roots be n and n+1. Sum = 2n+1 = p, Product = n(n+1) = q. From first, n = (p-1)/2. Substituting: q = (p-1)/2 × (p+1)/2 = (p²-1)/4. So 4q = p² - 1, thus p² - 4q - 1 = 0.'
          },
          {
            q: 'The solution of |2x - 3| < 5 is:',
            options: ['-1 < x < 4', '1 < x < 4', '-1 < x < 3', '0 < x < 4'],
            correct: 0,
            explanation: '|2x-3| < 5 → -5 < 2x-3 < 5 → -2 < 2x < 8 → -1 < x < 4.'
          },
          {
            q: 'If α and β are roots of 2x² + 5x - 3 = 0, then α² + β² equals:',
            options: ['37/4', '25/4', '31/4', '19/4'],
            correct: 0,
            explanation: 'α+β = -5/2, αβ = -3/2. α²+β² = (α+β)² - 2αβ = 25/4 + 3 = 25/4 + 12/4 = 37/4.'
          },
          {
            q: 'The number of real solutions of x² + |x| + 1 = 0 is:',
            options: ['0', '1', '2', 'Infinite'],
            correct: 0,
            explanation: 'For all real x, x² ≥ 0 and |x| ≥ 0. So x² + |x| + 1 ≥ 1 > 0. No real solutions exist.'
          },
          {
            q: 'If 2^(x+1) + 2^(x-1) = 320, then x equals:',
            options: ['7', '6', '8', '5'],
            correct: 0,
            explanation: '2^(x+1) + 2^(x-1) = 2^x(2 + 1/2) = 2^x × 5/2 = 320 → 2^x = 128 = 2^7 → x = 7.'
          }
        ]
      },
      {
        id: 'm4',
        num: 4,
        title: 'Time Value of Money',
        questionCount: 5,
        questions: [
          {
            q: 'The present value of Rs. 1000 due in 2 years at 10% p.a. compound interest is:',
            options: ['Rs. 826.45', 'Rs. 800', 'Rs. 833.33', 'Rs. 810'],
            correct: 0,
            explanation: 'PV = 1000/(1.10)² = 1000/1.21 = Rs. 826.45.'
          },
          {
            q: 'The compound interest on Rs. 5000 for 3 years at 8% p.a. compounded annually is:',
            options: ['Rs. 1298.56', 'Rs. 1200', 'Rs. 1300', 'Rs. 1250'],
            correct: 0,
            explanation: 'Amount = 5000(1.08)³ = 5000 × 1.259712 = 6298.56. CI = 6298.56 - 5000 = Rs. 1298.56.'
          },
          {
            q: 'An annuity of Rs. 5000 is received annually for 5 years. The future value at 10% p.a. is:',
            options: ['Rs. 30,525.50', 'Rs. 25,000', 'Rs. 27,500', 'Rs. 32,000'],
            correct: 0,
            explanation: 'FVA = 5000 × [(1.10)^5 - 1]/0.10 = 5000 × 0.61051/0.10 = 5000 × 6.1051 = Rs. 30,525.50.'
          },
          {
            q: 'The effective annual rate for 12% p.a. compounded quarterly is:',
            options: ['12.55%', '12.36%', '12.68%', '12%'],
            correct: 0,
            explanation: 'EAR = (1 + 0.12/4)^4 - 1 = (1.03)^4 - 1 = 1.1255 - 1 = 12.55%.'
          },
          {
            q: 'A sum doubles in 8 years at compound interest. The rate of interest is approximately:',
            options: ['9%', '10%', '8%', '12%'],
            correct: 0,
            explanation: '2P = P(1+r)^8 → (1+r)^8 = 2 → 1+r = 2^(1/8) ≈ 1.0905 → r ≈ 9%.'
          }
        ]
      },
      {
        id: 'm5',
        num: 5,
        title: 'Permutations and Combinations',
        questionCount: 5,
        questions: [
          {
            q: 'The number of ways to arrange 6 people in a row is:',
            options: ['720', '600', '120', '360'],
            correct: 0,
            explanation: '6! = 6 × 5 × 4 × 3 × 2 × 1 = 720 ways.'
          },
          {
            q: 'The number of diagonals in a decagon (10-sided polygon) is:',
            options: ['35', '45', '30', '40'],
            correct: 0,
            explanation: 'Number of diagonals = n(n-3)/2 = 10(7)/2 = 35.'
          },
          {
            q: 'If C(n,8) = C(n,6), then n equals:',
            options: ['14', '13', '12', '15'],
            correct: 0,
            explanation: 'C(n,8) = C(n,6) → n = 8+6 = 14 (since C(n,r) = C(n,n-r)).'
          },
          {
            q: 'The number of 3-letter words that can be formed from "MATHS" (no repetition) is:',
            options: ['60', '30', '120', '20'],
            correct: 0,
            explanation: 'P(5,3) = 5!/(5-3)! = 5 × 4 × 3 = 60.'
          },
          {
            q: 'In how many ways can 4 people be selected from 8 people?',
            options: ['70', '56', '1680', '35'],
            correct: 0,
            explanation: 'C(8,4) = 8!/(4!×4!) = (8×7×6×5)/(4×3×2×1) = 70.'
          }
        ]
      },
      {
        id: 'm6',
        num: 6,
        title: 'Measures of Central Tendency',
        questionCount: 5,
        questions: [
          {
            q: 'The mean of first n natural numbers is:',
            options: ['(n+1)/2', 'n/2', '(n-1)/2', 'n(n+1)/2'],
            correct: 0,
            explanation: 'Sum = n(n+1)/2, Count = n. Mean = [n(n+1)/2]/n = (n+1)/2.'
          },
          {
            q: 'If the mean of 5, 8, 12, x, 15 is 10, then x equals:',
            options: ['10', '12', '8', '15'],
            correct: 0,
            explanation: '(5+8+12+x+15)/5 = 10 → 40+x = 50 → x = 10.'
          },
          {
            q: 'The median of 12, 15, 10, 18, 8, 20, 14 is:',
            options: ['14', '12', '15', '10'],
            correct: 0,
            explanation: 'Sorted: 8, 10, 12, 14, 15, 18, 20. Median (4th value) = 14.'
          },
          {
            q: 'The mode of 2, 3, 4, 2, 5, 2, 6, 2, 7 is:',
            options: ['2', '3', '4', 'No mode'],
            correct: 0,
            explanation: '2 appears 4 times, more frequent than any other. Mode = 2.'
          },
          {
            q: 'The geometric mean of 4 and 9 is:',
            options: ['6', '5', '6.5', '7'],
            correct: 0,
            explanation: 'GM = √(4×9) = √36 = 6.'
          }
        ]
      }
    ]
  },
  economics: window.ECONOMICS_DATA,
  maths: window.MATHS_DATA
};

// CA Intermediate exam attempts (cyclical pattern)
const FOUNDATION_ATTEMPTS = [
  'Sept 2026',
  'Jan 2027',
  'May 2027',
  'Sept 2027',
  'Jan 2028',
  'May 2028',
  'Sept 2028',
  'Jan 2029',
  'May 2029',
  'Sept 2029',
  'Jan 2030',
  'May 2030'
];



// Static data for app
const LEADERBOARD_DATA = [
  { rank: 1, name: 'Priya M.', initials: 'PM', xp: 4080 },
  { rank: 2, name: 'Ananya R.', initials: 'AR', xp: 3210 },
  { rank: 3, name: 'Rahul K.', initials: 'RK', xp: 2990 },
  { rank: 4, name: 'Sanya K.', initials: 'SK', xp: 2740 },
  { rank: 5, name: 'Virat T.', initials: 'VT', xp: 2580 },
  { rank: 6, name: 'Neha S.', initials: 'NS', xp: 2340 },
  { rank: 7, name: 'You', initials: 'YO', xp: 2150, isMe: true },
  { rank: 8, name: 'Amit P.', initials: 'AP', xp: 1980 },
  { rank: 9, name: 'Riya D.', initials: 'RD', xp: 1750 },
  { rank: 10, name: 'Karan M.', initials: 'KM', xp: 1620 }
];

const NOTIFICATIONS_DATA = [
  { text: '<strong>Mock Test starts in 15 minutes</strong> — Paper 1: Accounts. Don\'t miss it!', time: 'Just now', dot: 'blue' },
  { text: '<strong>New RTP Questions Added</strong> for Nov 2025 batch — Maths & Stats.', time: '2 hours ago', dot: 'blue' },
  { text: 'You\'ve moved up to <strong>Rank #7</strong> on the leaderboard!', time: 'Yesterday', dot: 'gray' },
  { text: '<strong>5 Day Streak!</strong> Keep going — you\'re on a roll.', time: '2 days ago', dot: 'gray' }
];

const TESTS_DATA = {
  live: { title: 'Mock Test — Paper 1 (Accounts)', info: '100 MCQs \u00b7 2 hours \u00b7 Starts at 11:30 AM', status: 'LIVE SOON' },
  upcoming: [
    { title: 'Mock Test — Paper 2 (Law)', subtitle: 'Tomorrow \u00b7 10:00 AM \u00b7 100 Qs' },
    { title: 'Full Mock — All Papers', subtitle: 'Sun, Jun 15 \u00b7 9:00 AM' }
  ],
  past: [
    { title: 'Mock — Accounts \u00b7 Jun 8', subtitle: 'Score: 68/100 \u00b7 Rank #12', score: 68 },
    { title: 'Mock — Maths \u00b7 Jun 5', subtitle: 'Score: 81/100 \u00b7 Rank #4', score: 81 }
  ]
};

const BOOKMARKS_DATA = [
  { q: 'What is the treatment of goodwill in case of admission of a new partner?', tag: 'Accounts', meta: 'Ch 3 \u00b7 Partnership' },
  { q: 'Explain the doctrine of ultra vires with relevant case laws.', tag: 'Law', meta: 'Ch 6 \u00b7 Contract Act' },
  { q: 'Calculate the coefficient of variation for the given data set.', tag: 'Maths', meta: 'Ch 8 \u00b7 Statistics' },
  { q: 'Distinguish between micro and macro economics with examples.', tag: 'Economics', meta: 'Ch 2 \u00b7 Basics' },
  { q: 'Journal entries for dissolution of partnership firm.', tag: 'Accounts', meta: 'Ch 4 \u00b7 Dissolution' }
];

const COMMUNITY_DATA = [
  {
    id: 1, user: 'Priya M.', initials: 'PM', time: '2 hours ago',
    body: 'Just completed the Accounts mock test! The partnership questions were tricky but managed to score 85%. How did everyone else do?',
    likes: 24, dislikes: 2, comments: [
      { user: 'Ananya R.', initials: 'AR', text: 'Great score! I got 78% but struggled with the revaluation questions.' },
      { user: 'Rahul K.', initials: 'RK', text: 'Same here! Partnership admission was the toughest part for me.' }
    ]
  },
  {
    id: 2, user: 'Ananya R.', initials: 'AR', time: '5 hours ago',
    body: 'Can someone explain the difference between contingent and quasi-contracts? I\'m getting confused between the two concepts.',
    likes: 15, dislikes: 0, comments: [
      { user: 'Sanya K.', initials: 'SK', text: 'Contingent depends on a future event, quasi-contract is imposed by law to prevent unjust enrichment.' },
      { user: 'Virat T.', initials: 'VT', text: 'Think of quasi-contract as "as if" there was a contract. Contingent is real but conditional.' }
    ]
  },
  {
    id: 3, user: 'You', initials: 'YO', time: 'Yesterday',
    body: 'Sharing my notes on Time Value of Money. These formulas are crucial for the exam. Hope it helps everyone!',
    likes: 32, dislikes: 1, comments: [
      { user: 'Priya M.', initials: 'PM', text: 'Thanks for sharing! The annuity formulas were especially helpful.' }
    ],
    isMe: true
  }
];

const PDF_LIBRARY_DATA = [
  { name: 'RTP Nov 2025 - All Subjects', size: '4.2 MB', org: 'ICAI Official' },
  { name: 'MTP May 2025 - Paper 1 & 2', size: '2.8 MB', org: 'ICAI Official' },
  { name: 'Maths Formula Sheet', size: '856 KB', org: 'Compiled' },
  { name: 'CA Intermediate Syllabus 2025', size: '1.1 MB', org: 'ICAI' }
];

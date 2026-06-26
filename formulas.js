// Formulas and Cheat Sheets Database
const FORMULA_DATABASE = [
    {
        category: "Quantitative Aptitude (Numerical)",
        items: [
            {
                name: "Speed, Time, and Distance",
                expression: "Speed = Distance / Time | Average Speed = 2xy / (x + y) (for equal distances)",
                desc: "Useful for trains, boats & streams, and relative motion problems. Note: 1 km/hr = 5/18 m/s."
            },
            {
                name: "Simple & Compound Interest",
                expression: "SI = (P * R * T) / 100 | CI = P * (1 + R/100)^T - P",
                desc: "For difference between CI and SI for 2 years: Diff = P * (R/100)^2. For 3 years: Diff = P * (R/100)^2 * (3 + R/100)."
            },
            {
                name: "Time and Work",
                expression: "Work = Efficiency * Time | If A does work in x days & B in y days, together they take (x*y) / (x+y) days",
                desc: "Negative work applies to pipe & cistern leaks. Efficiency is inversely proportional to time taken."
            },
            {
                name: "Elementary Statistics",
                expression: "Mean = Σx/N | Median = Middle value (sorted) | Mode = 3*Median - 2*Mean | Std Dev = sqrt(Σ(x - mean)^2 / N)",
                desc: "Highly repeated topic in TCS NQT Foundation section. Variance is standard deviation squared."
            },
            {
                name: "Profit, Loss & Discount",
                expression: "Profit % = (Profit/CP) * 100 | Loss % = (Loss/CP) * 100 | SP = CP * (100 + Profit%)/100 | SP = MP * (100 - Discount%)/100",
                desc: "Successive discounts of d1% and d2% is equivalent to a single discount of: d1 + d2 - (d1 * d2)/100."
            },
            {
                name: "Permutations & Combinations",
                expression: "nPr = n! / (n-r)! | nCr = n! / [r! * (n-r)!]",
                desc: "Arrangement (Permutation) vs Selection (Combination). Circular permutation of n items is (n-1)!."
            }
        ]
    },
    {
        category: "Logical Reasoning",
        items: [
            {
                name: "Syllogisms",
                expression: "All A are B => Some A are B | No A is B => No B is A | Some A are B => Some B are A",
                desc: "Use Venn diagrams to verify validity. Watch out for 'Either-Or' conditions when subject and predicate are same."
            },
            {
                name: "Blood Relations",
                expression: "+ / - for Gender | = for Married Couples | | for Generation Gap",
                desc: "Draw family trees starting from the oldest generation. Always confirm if the gender is defined."
            },
            {
                name: "Clocks",
                expression: "Angle = |30H - (11/2)M| degrees",
                desc: "Where H is hours and M is minutes. Hands coincide 22 times in a day, and are opposite/right-angled 44 times."
            },
            {
                name: "Calendars",
                expression: "Normal Year = 1 odd day | Leap Year = 2 odd days",
                desc: "Century years must be divisible by 400 to be a leap year. Calendar repeats every 28 years (or 6/11 years depending on leap status)."
            }
        ]
    },
    {
        category: "Coding & DSA Cheat Sheet",
        items: [
            {
                name: "Array Time Complexities",
                expression: "Access: O(1) | Search: O(N) (O(log N) if sorted) | Insertion/Deletion: O(N)",
                desc: "Use two-pointer or sliding window techniques to optimize array problems from O(N^2) to O(N)."
            },
            {
                name: "String Manipulation",
                expression: "Reverse string, Check palindrome, Anagram validation, Substring search",
                desc: "Remember: Anagram check can be done by frequency counting (O(N) time) instead of sorting (O(N log N))."
            },
            {
                name: "Bitwise Operators",
                expression: "AND (&), OR (|), XOR (^), NOT (~), Left Shift (<<), Right Shift (>>)",
                desc: "XOR of same numbers is 0 (x ^ x = 0). XOR of a number with 0 is the number itself (x ^ 0 = x). Useful for finding single non-repeating element."
            }
        ]
    }
];

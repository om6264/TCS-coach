// TCS NQT Question Bank
const QUESTION_BANK = {
    numerical: [
        {
            id: 'n1',
            topic: 'Elementary Statistics',
            difficulty: 'medium',
            text: 'Find the standard deviation of the following data set: 10, 12, 18, 13, 9.',
            options: ['3.13', '3.41', '2.86', '4.02'],
            answer: 0, // 3.13
            explanation: 'Mean = (10+12+18+13+9)/5 = 62/5 = 12.4.\nDeviations: -2.4, -0.4, 5.6, 0.6, -3.4.\nSquared deviations: 5.76, 0.16, 31.36, 0.36, 11.56.\nSum of squared deviations = 49.2.\nVariance = 49.2 / 5 = 9.84.\nStandard Deviation = sqrt(9.84) ≈ 3.137... Let us calculate carefully: (10-12.4)^2 = 5.76. (12-12.4)^2 = 0.16. (18-12.4)^2 = 31.36. (13-12.4)^2 = 0.36. (9-12.4)^2 = 11.56. Sum = 49.2. Variance (population) = 9.84. S.D. = sqrt(9.84) = 3.13. Option A (3.13) is correct.'
        },
        {
            id: 'n2',
            topic: 'Percentages',
            difficulty: 'easy',
            text: 'In an exam, a student got 30% marks and failed by 45 marks. Another student got 42% marks and secured 45 marks more than the pass marks. Find the passing percentage.',
            options: ['33%', '35%', '36%', '40%'],
            answer: 2, // 36%
            explanation: 'Difference in percentage = 42% - 30% = 12%.\nDifference in marks = 45 - (-45) = 90 marks.\nThus, 12% of total marks = 90.\nTotal marks = 90 / 0.12 = 750.\nPassing marks = 30% of 750 + 45 = 225 + 45 = 270.\nPassing percentage = (270 / 750) * 100% = 36%.'
        },
        {
            id: 'n3',
            topic: 'Time and Work',
            difficulty: 'medium',
            text: 'A can do a piece of work in 12 days, and B can do it in 18 days. They work together for 4 days, and then A leaves. How long will B take to finish the remaining work?',
            options: ['6 days', '8 days', '10 days', '5 days'],
            answer: 1, // 8 days
            explanation: 'A\'s 1 day work = 1/12. B\'s 1 day work = 1/18.\nTogether 1 day work = 1/12 + 1/18 = 5/36.\nIn 4 days they complete = 4 * 5/36 = 5/9 of the work.\nRemaining work = 1 - 5/9 = 4/9.\nTime taken by B to finish 4/9 work = (4/9) / (1/18) = 8 days.'
        },
        {
            id: 'n4',
            topic: 'Time, Speed and Distance',
            difficulty: 'medium',
            text: 'A train 150m long passes a pole in 15 seconds and another train of same length travelling in opposite direction in 8 seconds. What is the speed of the second train?',
            options: ['27.5 m/s', '22.5 m/s', '18 m/s', '20 m/s'],
            answer: 0, // 27.5 m/s
            explanation: 'Speed of first train (v1) = Length / Time = 150 / 15 = 10 m/s.\nWhen crossing each other in opposite directions, relative speed = v1 + v2.\nTotal distance = 150 + 150 = 300m.\nTime taken = 8 seconds.\nRelative speed = 300 / 8 = 37.5 m/s.\nSince v1 + v2 = 37.5 and v1 = 10, v2 = 37.5 - 10 = 27.5 m/s.'
        },
        {
            id: 'n5',
            topic: 'Probability & Permutations',
            difficulty: 'hard',
            text: 'In how many different ways can the letters of the word "CORPORATION" be arranged so that the vowels always come together?',
            options: ['480', '50400', '120960', '360000'],
            answer: 1, // 50400
            explanation: 'Vowels in CORPORATION: O, O, A, I, O (5 vowels: 3 O\'s, 1 A, 1 I).\nConsonants: C, R, P, R, T, N (6 consonants: 2 R\'s, 1 C, 1 P, 1 T, 1 N).\nTreat the vowels as a single block: (O, O, A, I, O) + 6 consonants = 7 entities.\nArrangements of these 7 entities = 7! / 2! (since R repeats twice) = 5040 / 2 = 2520.\nArrangements of the 5 vowels within their block = 5! / 3! (since O repeats thrice) = 120 / 6 = 20.\nTotal arrangements = 2520 * 20 = 50400.'
        }
    ],
    reasoning: [
        {
            id: 'r1',
            topic: 'Syllogism',
            difficulty: 'easy',
            text: 'Statements:\n1. All cups are plates.\n2. Some plates are bottles.\nConclusions:\nI. Some bottles are cups.\nII. Some plates are cups.',
            options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
            answer: 1, // Only II follows
            explanation: 'Since "All cups are plates", the converse "Some plates are cups" is always true (Conclusion II follows).\nHowever, "Some plates are bottles" doesn\'t guarantee an intersection between bottles and cups (Conclusion I does not necessarily follow).'
        },
        {
            id: 'r2',
            topic: 'Seating Arrangement',
            difficulty: 'medium',
            text: 'Six persons A, B, C, D, E, and F are standing in a circle. B is between D and C. A is between E and C. F is at the right of D. Who is between A and F?',
            options: ['E', 'C', 'D', 'B'],
            answer: 0, // E
            explanation: 'Based on the conditions: B is between D and C (D-B-C or C-B-D). A is between E and C (E-A-C or C-A-E). F is to the right of D. Putting them in a circle: F - D - B - C - A - E (and F is next to E). The person between A and F is E.'
        },
        {
            id: 'r3',
            topic: 'Blood Relations',
            difficulty: 'easy',
            text: 'Pointing to a photograph, Vipul said, "She is the daughter of my grandfather\'s only son." How is Vipul related to the girl in the photograph?',
            options: ['Brother', 'Uncle', 'Cousin', 'Father'],
            answer: 0, // Brother
            explanation: 'Vipul\'s grandfather\'s only son is Vipul\'s father. The girl is the daughter of Vipul\'s father. Hence, Vipul is the brother of that girl.'
        },
        {
            id: 'r4',
            topic: 'Coding-Decoding',
            difficulty: 'medium',
            text: 'If in a certain language, SYSTEM is coded as SYSMET and NEARER is coded as AENRER, then how will FRACTION be coded?',
            options: ['CARFNOIT', 'CARFTION', 'ARFCNOIT', 'FRACNOIT'],
            answer: 0, // CARFNOIT
            explanation: 'The word is split into two halves: SYS and TEM. Each half is reversed: SYS -> SYS, TEM -> MET, combined = SYSMET.\nFor NEARER: NEA -> AEN, RER -> RER, combined = AENRER.\nFor FRACTION: FRAC -> CARF, TION -> NOIT, combined = CARFNOIT.'
        }
    ],
    verbal: [
        {
            id: 'v1',
            topic: 'Sentence Correction',
            difficulty: 'easy',
            text: 'Identify the error in the following sentence: "Neither of the two candidates have submitted their resume yet."',
            options: ['Neither of the', 'have submitted', 'their resume', 'No error'],
            answer: 1, // have submitted (should be 'has submitted')
            explanation: '"Neither" is a singular pronoun and takes a singular verb. Therefore, "have submitted" should be corrected to "has submitted".'
        },
        {
            id: 'v2',
            topic: 'Reading Comprehension',
            difficulty: 'medium',
            text: 'Choose the word closest in meaning to the bolded word: "The manager\'s **astute** decisions saved the company from bankruptcy."',
            options: ['Shrewd', 'Careless', 'Impulsive', 'Trivial'],
            answer: 0, // Shrewd
            explanation: 'Astute means having or showing an ability to accurately assess situations or people and turn this to one\'s advantage; shrewd or clever.'
        },
        {
            id: 'v3',
            topic: 'Sentence Arrangement',
            difficulty: 'medium',
            text: 'Rearrange the following parts (P, Q, R, S) to form a meaningful sentence:\nP: in the world today\nQ: of all the problems\nR: is the most serious\nS: environmental pollution',
            options: ['QPSR', 'QSPR', 'SPQR', 'QSRP'],
            answer: 3, // QSRP
            explanation: 'The logical flow starts with Q: "of all the problems", followed by S: "environmental pollution", R: "is the most serious", and P: "in the world today". Combined: "Of all the problems, environmental pollution is the most serious in the world today" (QSRP).'
        }
    ],
    coding: [
        {
            id: 'c1',
            topic: 'Array Manipulation',
            difficulty: 'medium',
            text: 'Write a program to find the second largest element in an array. Here is a description:\n\n**Input:** `arr = [12, 35, 1, 10, 34, 1]`\n**Output:** `34`\n\nChoose the correct snippet to achieve this in O(N) time with O(1) extra space.',
            options: [
                `int first = INT_MIN, second = INT_MIN;\nfor (int x : arr) {\n    if (x > first) {\n        second = first;\n        first = x;\n    } else if (x > second && x != first) {\n        second = x;\n    }\n}`,
                `sort(arr.begin(), arr.end());\nreturn arr[arr.size() - 2];`,
                `int maxVal = *max_element(arr.begin(), arr.end());\nremove(arr.begin(), arr.end(), maxVal);\nreturn *max_element(arr.begin(), arr.end());`,
                `int second = arr[0];\nfor (int x : arr) {\n    if (x > second) second = x;\n}`
            ],
            answer: 0,
            explanation: 'Option A keeps track of both the largest (`first`) and second-largest (`second`) elements in a single pass (O(N) time) without modifying the array. Option B takes O(N log N) due to sorting. Option C takes O(N) but uses multiple passes and mutates the array.'
        },
        {
            id: 'c2',
            topic: 'String Manipulation',
            difficulty: 'hard',
            text: 'Write a function to find the longest substring without repeating characters.\n\n**Input:** `"abcabcbb"`\n**Output:** `3` (The substring is `"abc"`)\n\nWhich of the following sliding window implementations in Javascript is correct and optimal?',
            options: [
                `function lengthOfLongestSubstring(s) {\n    let set = new Set();\n    let left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        while (set.has(s[right])) {\n            set.delete(s[left]);\n            left++;\n        }\n        set.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}`,
                `function lengthOfLongestSubstring(s) {\n    let maxLen = 0;\n    for(let i=0; i<s.length; i++) {\n        for(let j=i+1; j<=s.length; j++) {\n            let sub = s.substring(i, j);\n            if(new Set(sub).size === sub.length) {\n                maxLen = Math.max(maxLen, sub.length);\n            }\n        }\n    }\n    return maxLen;\n}`,
                `function lengthOfLongestSubstring(s) {\n    let map = {};\n    let maxLen = 0;\n    for(let i=0; i<s.length; i++) {\n        map[s[i]] = (map[s[i]] || 0) + 1;\n        if (Object.keys(map).length > maxLen) maxLen = Object.keys(map).length;\n    }\n    return maxLen;\n}`,
                `None of the above`
            ],
            answer: 0,
            explanation: 'Option A is the optimal sliding window approach. It maintains a set of characters in the current window. If a duplicate is encountered at `right`, it shrinks the window from the `left` until the duplicate is removed, resulting in O(N) time complexity.'
        }
    ]
};

/* Made-up data that shows how a filled Criterion 3 looks. C211 follows the
   worked example (Computer Graphics, CO attainment 2.48 of 3) count for count;
   the other courses and every student in them are invented. */

import { N_OUT, blankState, cloneCourse, defaultSurveys, emptyCounts, uid, type Assessment, type Course, type Kind, type NbaState, type Student, type Survey } from './model';

type ADef = [name: string, kind: Kind, max: number, counts?: [number, number, number, number, number]];
type CoDef = [text: string, map: string, uses: number[]];

// "3-32--------322": one character per PO1…PO12, PSO1…PSO3; "-" is not mapped.
const mapOf = (s: string) => [...s.padEnd(N_OUT, '-')].slice(0, N_OUT).map(ch => (ch === '-' ? null : +ch));

function rng(seed: number) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const FIRST = ['Aarav', 'Aditi', 'Aniket', 'Ananya', 'Arjun', 'Bhakti', 'Chinmay', 'Diya', 'Gaurav', 'Isha', 'Kunal', 'Meera', 'Nikhil', 'Pooja', 'Prathamesh', 'Riya', 'Rohan', 'Sakshi', 'Shreya', 'Siddharth', 'Tanvi', 'Varun', 'Vedant', 'Yash', 'Omkar', 'Neha', 'Harsh', 'Komal'];
const LAST = ['Patil', 'Deshmukh', 'Kulkarni', 'Joshi', 'Pawar', 'Shinde', 'Jadhav', 'Kale', 'More', 'Gaikwad', 'Bhosale', 'Chavan', 'Naik', 'Sawant', 'Mehta', 'Iyer', 'Wagh', 'Salunkhe'];

function students(as: Assessment[], n: number, seed: number, level: number): Student[] {
  const r = rng(seed), out: Student[] = [];
  const names = new Set<string>();
  for (let i = 0; i < n; i++) {
    let name = '';
    do name = `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`; while (names.has(name));
    names.add(name);
    const ability = level + (r() + r() + r() - 1.5) * .22;
    const marks: Student['marks'] = {};
    for (const a of as) {
      if (r() < .015) { marks[a.id] = 'AB'; continue; }
      const p = Math.max(.12, Math.min(1, ability + (r() - .5) * .2 + (a.kind === 'feedback' ? .08 : 0)));
      marks[a.id] = Math.round(a.max! * p);
    }
    out.push({ id: uid(), seat: `S19022${String(401 + i).padStart(4, '0')}`, name, marks });
  }
  return out.sort((a, b) => a.seat.localeCompare(b.seat));
}

function course(p: { code: string; name: string; type: 'theory' | 'lab'; faculty: string; year: string; sem: string; cls: string; target?: number },
  defs: ADef[], cos: CoDef[], roll?: { n: number; seed: number; level: number }): Course {
  const assessments: Assessment[] = defs.map(([name, kind, max, k]) => ({
    id: uid(), name, kind, max, counts: k ? { a: k[0], b: k[1], c: k[2], d: k[3], t: k[4] } : emptyCounts(),
  }));
  return {
    id: uid(), code: p.code, name: p.name, faculty: p.faculty, year: p.year, sem: p.sem, cls: p.cls, type: p.type, coTarget: p.target ?? null,
    assessments,
    cos: cos.map(([text, map, uses]) => ({ id: uid(), text, map: mapOf(map), uses: uses.map(i => assessments[i].id) })),
    students: roll ? students(assessments, roll.n, roll.seed, roll.level) : [],
  };
}

const ALL = (n: number) => Array.from({ length: n }, (_, i) => i);

export function sampleState(): NbaState {
  const s = blankState();
  s.program = { name: 'B.Tech Computer Engineering', dept: 'Computer Engineering', batch: '2017–21', year: '2020–21' };
  s.year = '2020–21';
  s.outcomes[12].text = 'Professional skills: understand and develop software systems using data structures, algorithms, system software, networking, multimedia, web design and data science.';
  s.outcomes[13].text = 'Problem-solving skills: apply standard practices and strategies in software project development using open-ended programming environments.';
  s.outcomes[14].text = 'Successful career and entrepreneurship: use modern languages, environments and platforms to build innovative careers and pursue higher studies.';
  s.outcomes[12].title = 'Professional skills'; s.outcomes[13].title = 'Problem-solving skills'; s.outcomes[14].title = 'Career and entrepreneurship';

  s.courses = [
    course({ code: 'C201', name: 'Discrete Mathematics (210241)', type: 'theory', faculty: 'Prof. A. Kulkarni', year: '2018–19', sem: 'I', cls: 'SE', target: 82 },
      [['Preliminary Examination', 'internal', 50, [150, 22, 20, 13, 204]], ['Class Test 1', 'internal', 30, [146, 28, 19, 12, 204]],
       ['Class Test 2', 'internal', 30, [152, 25, 17, 11, 204]], ['Progressive Assessment', 'internal', 25, [170, 21, 9, 5, 204]],
       ['Theory Exam', 'external', 100, [118, 41, 30, 16, 204]], ['Course Exit Feedback', 'feedback', 30, [160, 30, 10, 5, 204]]],
      [['Formulate problems precisely, solve them and relate them to other problems using logic.', '33-2-------3322', [0, 1, 3, 4, 5]],
       ['Analyse and synthesise set-theoretic and relational structures.', '332--------2322', [0, 1, 3, 4, 5]],
       ['Apply counting principles and probability to engineering problems.', '3232-------3322', [0, 2, 3, 4, 5]],
       ['Model problems with graphs and trees and solve them with standard algorithms.', '2333-------33-2', [0, 2, 3, 4, 5]],
       ['Use algebraic structures to reason about computation.', '23-3-------2232', [0, 3, 4, 5]]]),

    course({ code: 'C203', name: 'Data Structures and Algorithms (210243)', type: 'theory', faculty: 'Dr. P. Deshmukh', year: '2018–19', sem: 'I', cls: 'SE', target: 78 },
      [['Preliminary Examination', 'internal', 50, [168, 18, 12, 6, 204]], ['Class Test 1', 'internal', 30, [160, 24, 14, 7, 204]],
       ['Class Test 2', 'internal', 30, [158, 25, 15, 7, 204]], ['Progressive Assessment', 'internal', 25, [175, 18, 8, 4, 204]],
       ['Theory Exam', 'external', 100, [132, 36, 25, 12, 204]], ['Course Exit Feedback', 'feedback', 30, [172, 24, 6, 3, 204]]],
      [['Choose appropriate data structures for a given problem.', '3333-------3333', [0, 1, 3, 4, 5]],
       ['Analyse algorithms for time and space complexity.', '332--------2332', [0, 1, 3, 4, 5]],
       ['Implement linear and non-linear data structures.', '3332-------3333', [0, 2, 3, 4, 5]],
       ['Apply searching, sorting and hashing techniques.', '2333-------2322', [0, 2, 3, 4, 5]],
       ['Design solutions using greedy and divide-and-conquer strategies.', '3333-------3333', [0, 3, 4, 5]],
       ['Use file organisation techniques for persistent data.', '23-3-------2323', [0, 3, 4, 5]]]),

    course({ code: 'C209', name: 'Soft Skills (210249)', type: 'lab', faculty: 'Ms. V. Pawar', year: '2018–19', sem: 'I', cls: 'SE', target: 95 },
      [['Mock Practical / Oral', 'internal', 50, [190, 10, 3, 1, 204]], ['Progressive Assessment', 'internal', 20, [194, 8, 2, 0, 204]],
       ['Term Work', 'external', 25, [196, 6, 2, 0, 204]], ['Course Exit Feedback', 'feedback', 30, [185, 14, 4, 1, 204]]],
      [['Communicate effectively in written and spoken English.', '-----2-23332--2', [0, 1, 2, 3]],
       ['Work as a member and leader of diverse teams.', '-----3333-3---3', [0, 1, 2, 3]],
       ['Present ideas with confidence before an audience.', '-----2--33--2-2', [0, 1, 2, 3]],
       ['Apply ethics and etiquette in professional settings.', '-----333--33--3', [0, 1, 2, 3]]]),

    course({ code: 'C211', name: 'Computer Graphics (210251)', type: 'theory', faculty: 'Mrs. M. Kadam', year: '2018–19', sem: 'II', cls: 'SE', target: 81 },
      [['Preliminary Examination', 'internal', 50, [165, 14, 19, 7, 204]], ['Class Test 1', 'internal', 30, [158, 23, 18, 6, 204]],
       ['Class Test 2', 'internal', 30, [149, 31, 19, 6, 204]], ['Progressive Assessment', 'internal', 25, [161, 29, 14, 1, 204]],
       ['Theory Exam', 'external', 100, [123, 38, 31, 13, 204]], ['Course Exit Feedback', 'feedback', 30, [169, 28, 7, 1, 204]]],
      [['Apply mathematics and logic to develop computer programs for elementary graphic operations.', '3-32--------322', [0, 1, 3, 4, 5]],
       ['Develop a scientific and strategic approach to solve complex problems in computer graphics.', '3233--------333', [0, 1, 3, 4, 5]],
       ['Understand the concepts of computer vision and virtual reality.', '133---------333', [0, 2, 3, 4, 5]],
       ['Apply logic to develop animation and gaming programs.', '2232--------333', [0, 2, 3, 4, 5]],
       ['Apply colour models, lighting, shading and hidden surface elimination.', '3-23--------232', [0, 3, 4, 5]],
       ['Create effective programs using curves and fractals.', '333---------21-', [0, 3, 4, 5]]]),

    course({ code: 'C212', name: 'Advanced Data Structures (210252)', type: 'theory', faculty: 'Ms. A. Jadhav', year: '2018–19', sem: 'II', cls: 'SE', target: 81 },
      [['Preliminary Examination', 'internal', 50], ['Class Test 1', 'internal', 30], ['Class Test 2', 'internal', 30],
       ['Progressive Assessment', 'internal', 25], ['Theory Exam', 'external', 100], ['Course Exit Feedback', 'feedback', 30]],
      [['Apply non-linear data structures to solve problems.', '3332--------322', [0, 1, 3, 4, 5]],
       ['Analyse tree and graph algorithms for efficiency.', '33-3--------332', [0, 1, 3, 4, 5]],
       ['Use hashing and symbol tables for fast look-up.', '232---------322', [0, 2, 3, 4, 5]],
       ['Implement indexing and multiway trees for files.', '2333--------233', [0, 2, 3, 4, 5]],
       ['Choose efficient data structures for real applications.', '3332-------3333', [0, 3, 4, 5]]],
      { n: 64, seed: 212, level: .7 }),

    course({ code: 'C215', name: 'Computer Graphics Lab (210255)', type: 'lab', faculty: 'Mrs. M. Kadam', year: '2018–19', sem: 'II', cls: 'SE', target: 92 },
      [['Mock Practical / Oral', 'internal', 50], ['Progressive Assessment', 'internal', 25], ['Term Work', 'external', 25],
       ['Practical Exam', 'external', 50], ['Course Exit Feedback', 'feedback', 30]],
      [['Implement line, circle and polygon drawing algorithms.', '33333-------32-', ALL(5)],
       ['Apply 2D and 3D transformations in programs.', '33323-------233', ALL(5)],
       ['Build a small animation or game in a team.', '32333---333-333', ALL(5)],
       ['Use OpenGL and modern tools for rendering.', '32333-------323', ALL(5)]],
      { n: 64, seed: 215, level: .78 }),

    course({ code: 'C409', name: 'Project Stage I (410248)', type: 'lab', faculty: 'Project committee', year: '2020–21', sem: 'I', cls: 'BE', target: 90 },
      [['Review presentations', 'internal', 50, [176, 18, 6, 2, 202]], ['Progressive Assessment', 'internal', 25, [180, 15, 5, 2, 202]],
       ['Term Work', 'external', 50, [170, 20, 8, 4, 202]], ['Oral Exam', 'external', 50, [162, 24, 10, 6, 202]],
       ['Course Exit Feedback', 'feedback', 30, [174, 20, 6, 2, 202]]],
      [['Identify a real-world problem and survey the literature on it.', '333333-3-333333', ALL(5)],
       ['Plan a project with a schedule, budget and risks.', '-2-2-2---2333-3', ALL(5)],
       ['Design a solution with modern tools, considering society and environment.', '3332333-3--3332', ALL(5)],
       ['Work in a team and present the work in writing and orally.', '-----2-333333-3', ALL(5)]]),
  ];

  // Satisfactory response % per PO1…PO12, PSO1…PSO3; "-" means the survey doesn't ask about it.
  const surveys = defaultSurveys();
  const fill = (i: number, line: string, mf: number) => line.split(' ').forEach((v, o) => {
    surveys[i].rows[o] = { total: null, ex: null, good: null, sat: null, pct: v === '-' ? null : +v, mf: v === '-' ? null : mf };
  });
  fill(0, '82 - - - - 86 - 83 83 83 82 84 93 82 -', .5);
  fill(1, '89 80 86 88 86 88 92 91 91 91 88 91 90 91 85', 1);
  fill(2, '77 82 78 - 78 80 81 80 80 91 87 91 77 81 83', 1);
  fill(3, '90 80 86 86 87 86 85 88 90 80 91 92 91 90 86', .5);
  fill(4, '100 100 100 100 100 100 100 100 100 100 100 100 100 100 100', 1);
  // PO1 from response counts, as on the worked example: (Excellent + 0.8 Good + 0.6 Satisfactory) ÷ total.
  Object.assign(surveys[0].rows[0], { total: 270, ex: 108, good: 85, sat: 77, pct: null });
  Object.assign(surveys[1].rows[0], { total: 150, ex: 86, good: 49, sat: 15, pct: null });
  Object.assign(surveys[2].rows[0], { total: 66, ex: 14, good: 28, sat: 24, pct: null });
  s.surveys = surveys;
  s.sample = true;
  s.years = { '2019–20': earlier(s, '2019–20', .08), '2018–19': earlier(s, '2018–19', .16) };
  return s;
}

/** An earlier year worked out from the current one: results nudged down by `f` so attainment rises year on year. */
function earlier(s: NbaState, label: string, f: number) {
  const move = (n: number | null, share: number) => (n == null ? 0 : Math.round(n * share));
  const courses: Course[] = s.courses.map(c => {
    const k = cloneCourse(c, false);
    k.year = label;
    for (const a of k.assessments) {
      const { a: ca, b, c: cc, d, t } = a.counts;
      if (ca != null && b != null && cc != null && d != null) {
        const x = move(ca, f), y = move(b, f * .6), z = move(cc, f * .5);
        a.counts = { a: ca - x, b: b + x - y, c: cc + y - z, d: d + z, t };
      }
    }
    for (const st of k.students) for (const a of k.assessments) {
      const m = st.marks[a.id];
      if (typeof m === 'number' && a.max) st.marks[a.id] = Math.max(0, Math.round(m - a.max * f * .35 * (((m * 7 + a.max) % 5) / 4 + .5)));
    }
    return k;
  });
  const surveys: Survey[] = s.surveys.map(sv => ({
    ...sv, id: uid(),
    rows: sv.rows.map(r => {
      const row = { ...r };
      if (row.pct != null) row.pct = Math.max(0, Math.round((row.pct - f * 28) * 10) / 10);
      if (row.total != null && row.ex != null && row.good != null) { const x = Math.round(row.ex * f * 1.5); row.ex -= x; row.good += x; }
      return row;
    }),
  }));
  return { courses, surveys };
}

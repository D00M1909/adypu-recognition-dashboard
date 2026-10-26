/* Shared render helpers and the NAAC framework outline. */

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pill = (t, tone = 'mute') => `<span class="pill ${tone}">${esc(t)}</span>`;

// NAAC Binary Accreditation Framework (Metrics for Manual, Base, draft): university weights.
const NAAC_ATTRIBUTES = [
  {n: 1, title: 'Curriculum', group: 'Input', marks: 75, metrics: 8},
  {n: 2, title: 'Faculty Resources', group: 'Input', marks: 50, metrics: 3},
  {n: 3, title: 'Infrastructure', group: 'Input', marks: 50, metrics: 6},
  {n: 4, title: 'Financial Resources & Management', group: 'Input', marks: 50, metrics: 4, live: true},
  {n: 5, title: 'Learning & Teaching', group: 'Process', marks: 125, metrics: 7},
  {n: 6, title: 'Extended Curricular Engagements', group: 'Process', marks: 100, metrics: 6},
  {n: 7, title: 'Governance & Administration', group: 'Process', marks: 100, metrics: 10},
  {n: 8, title: 'Student Outcomes', group: 'Outcome', marks: 150, metrics: 4},
  {n: 9, title: 'Research & Innovation Outcomes', group: 'Outcome', marks: 125, metrics: 7},
  {n: 10, title: 'Sustainability Outcomes & Green Initiatives', group: 'Outcome', marks: 75, metrics: 4},
];
const NAAC_TOTAL = NAAC_ATTRIBUTES.reduce((s, a) => s + a.marks, 0);

// Frameworks planned after NAAC, shown on the home page.
const COMING = ['NAAC attributes 1–3, 5–10', 'NIRF', 'NBA', 'QS & THE rankings', 'IIC & GreenMetric ratings', 'Awards register'];

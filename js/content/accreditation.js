/* Accreditation: NAAC (ch. 1), NBA (ch. 2), International (ch. 7). */

group('accreditation', 'naac', 'NAAC', 'Basic (binary) accreditation and maturity-based graded levels', [
  {id:'status', title:'Our status', sample:true, render: naac},
  {id:'reform', title:'Why NAAC reformed', p:'4', blocks:[
    {t:'lead', x:'NAAC is moving from letter grades to a simpler, data-driven system, in line with NEP 2020’s goal that every institution be accredited.'},
    {t:'timeline', title:'The reform journey', items:[
      ['2020','NEP 2020 calls for a light-but-tight accreditation system'],
      ['2023','Radhakrishnan committee recommends binary and maturity-based accreditation'],
      ['2024','NAAC consults institutions on Basic Accreditation and MBGL'],
      ['2025','Rollout of Basic (binary) Accreditation announced; MBGL to follow'],
      ['2026','Transition under way: follow NAAC circulars for current status']]},
    {t:'table', title:'Old model vs new direction', head:['','Revised Accreditation Framework (RAF)','Reformed framework'], rows:[
      ['Structure','7 criteria, metric-based scoring','10 attributes: input, process, outcome'],
      ['Result','CGPA on a 4-point scale; grades A++ to C','Binary: accredited or not, then MBGL levels 1-5'],
      ['Evidence','Heavy documentation and SSR','Data-driven, verified digitally'],
      ['Validation','Peer team visit decisive','Stakeholder validation added']]},
    {t:'note', x:'Institutions keep their existing grade until it expires, then move to the new framework as NAAC notifies.'},
    {t:'cards', title:'Goals of the reform', cols:4, items:[['Inclusion','Bring every HEI into accreditation'],['Simplicity','Less paperwork, more data'],['Credibility','Verified, cross-checked data'],['Growth','A ladder, not a label']]},
  ]},
  {id:'basic', title:'Basic accreditation', p:'5', blocks:[
    {t:'lead', x:'Basic Accreditation answers one question: does the institution meet the national minimum standard of quality?'},
    {t:'cards', cols:2, items:[['Accredited','Meets the benchmark on all attributes','Outcome'],['Not accredited','Gaps to close before re-applying','Outcome']]},
    {t:'note', tone:'info', x:'An intermediate “awaiting accreditation” category was discussed in consultations; confirm the categories in NAAC’s final manual.'},
    {t:'list', title:'Key features', items:['Single threshold, no ranking among accredited HEIs','10 attributes covering input, process and outcome','Different weightage for universities and colleges','Digital data submission and verification','Stakeholder feedback used as validation','Gateway to the higher MBGL levels']},
    {t:'row', cols:[
      {t:'cards', title:'Who it is for', cols:1, items:[['First-time applicants','Institutions never accredited'],['Expiring grades','HEIs whose RAF grade lapses'],['All HEI types','Universities, autonomous and affiliated colleges']]},
      {t:'check', id:'naac-elig', title:'Typical eligibility conditions', items:['Recognised by UGC / regulator','Statutory approvals in place','Required batches passed out','AISHE data submitted','IQAC functional']},
    ]},
    {t:'note', x:'Regulators and funding schemes increasingly link eligibility, autonomy and approvals to accreditation status.'},
  ]},
  {id:'attributes', title:'The 10 attributes', p:'6', blocks:[
    {t:'lead', x:'Ten attributes replace the seven RAF criteria, grouped by what an institution has, what it does, and what it achieves. 900 marks, 58 metrics.'},
    {t:'table', title:'Attribute weights by institution type', head:['#','Attribute','Group','University','Autonomous','Affiliated','Metrics'], bold:false, rows:[
      ['1','Curriculum Design','Input','75','75','50','8'],['2','Faculty Resources','Input','50','50','100','2'],['3','Infrastructure','Input','50','50','75','6'],
      ['4','Financial Resources & Management','Input','50','50','50','4'],['5','Learning & Teaching','Process','125','150','150','7'],
      ['6','Extended Curricular Engagements','Process','100','125','125','6'],['7','Governance & Administration','Process','100','100','125','10'],
      ['8','Student Outcomes','Outcome','150','125','100','4-5'],['9','Research & Innovation Outcomes','Outcome','125','100','50','7'],
      ['10','Sustainability Outcomes & Green Initiatives','Outcome','75','75','75','4'],['','Total','','900','900','900','58']],
      foot:'Proposed weights from NAAC consultation material; use the final manual for submission.'},
    {t:'weights', title:'University weights', unit:' marks', items:[['Student Outcomes',150],['Learning & Teaching',125],['Research & Innovation Outcomes',125],['Extended Curricular Engagements',100],['Governance & Administration',100],['Curriculum Design',75],['Sustainability & Green',75],['Faculty Resources',50],['Infrastructure',50],['Financial Resources',50]]},
    {t:'stats', items:[['25-31%','Inputs share of marks'],['36-44%','Processes share'],['25-39%','Outcomes share']]},
    {t:'cards', cols:3, items:[['Universities','Weight leans to outcomes and research'],['Autonomous','Balanced, strong on teaching'],['Affiliated','Weight leans to faculty and teaching']]},
  ]},
  {id:'process', title:'Accreditation process', p:'7', blocks:[
    {t:'lead', x:'The new process relies on verified data rather than long reports. Every step is online, time-bound and traceable.'},
    {t:'steps', title:'Eight steps', items:[['Register','Institution profile on the NAAC portal'],['Eligibility check','Recognition, batches passed out, statutory approvals'],['Submit data','Attribute-wise data with evidence, uploaded online'],['Digital verification','Cross-check with AISHE, NIRF and other national databases'],['Stakeholder validation','Feedback from students, faculty, alumni and employers'],['Peer verification','Online or on-site review where required'],['Decision','Accredited or not accredited, with feedback'],['Sustain & progress','Update data yearly; apply for MBGL levels']]},
    {t:'cards', title:'Who does what', cols:3, items:[['IQAC','Leads the process, owns the data and evidence'],['Attribute teams','One team per attribute, with a named lead'],['Leadership','VC and Registrar approve and sign']]},
    {t:'timeline', title:'Indicative timeline', items:[['Months 1-2','Registration & eligibility'],['Months 2-4','Data & evidence upload'],['Months 4-6','Verification & validation'],['Months 6-8','Peer check & decision']]},
    {t:'note', tone:'warn', x:'Golden rule: submit only what you can prove; every figure must match what is already reported to national databases.'},
  ]},
  {id:'mbgl', title:'Maturity levels (MBGL)', p:'8-9', blocks:[
    {t:'lead', x:'Once accredited, an institution can climb a five-level ladder, from consolidating national standards to global excellence.'},
    {t:'html', title:'The maturity ladder', html:`<div class="ladder">${[[5,'Global excellence','Institutions of global excellence for multidisciplinary research and education'],[4,'National excellence','Leading institution in its category nationally'],[3,'Distinguished','Strong outcomes; benchmark among peers'],[2,'Performing well','Measured improvement across attributes'],[1,'Consolidating quality','Systems stable; all national standards met consistently']].map(([n,t,d])=>`<div class="rung"><b>Level ${n}</b><span><b>${t}</b> · ${d}</span></div>`).join('')}<div class="rung now"><b>Base</b><span>Basic (binary) Accreditation</span></div></div>`, foot:'Level 5 follows NAAC’s announced description; Levels 1-4 are indicative.'},
    {t:'cards', cols:3, items:[['Voluntary','Institutions choose to apply for higher levels'],['Progressive','Climb level by level as evidence grows'],['Outcome-heavy','Higher levels weigh research and impact more']]},
    {t:'table', title:'Basic accreditation vs MBGL', head:['Aspect','Basic (binary)','MBGL (levels 1-5)'], rows:[
      ['Question','Do we meet the national minimum?','How mature and distinctive are we?'],['Result','Accredited / not accredited','A level from 1 to 5'],
      ['Who applies','Every HEI','Accredited HEIs, by choice'],['Focus','Inputs and processes in place','Outcomes, research and impact'],
      ['Benchmark','Fixed national threshold','Rising bar at each level'],['Evidence','Verified data and documents','Deeper outcome and impact evidence'],
      ['Use','Licence to operate with quality','Differentiation, autonomy, reputation']]},
    {t:'cards', title:'Choosing the right path', cols:3, items:[['New or small HEI','Secure Basic Accreditation first, then build to Level 1'],['Established HEI','Basic plus a 3-year plan to Levels 2-3'],['Research university','Target Levels 4-5 with an outcome-led strategy']]},
    {t:'list', title:'How to prepare for a higher level', items:['Outcome data for 5 years','Research & innovation record','Benchmark against peers','Global partnerships','Documented best practices']},
    {t:'note', x:'Link the MBGL target to the university’s 10-year roadmap so accreditation, ranking and strategy move together.'},
  ]},
  {id:'data', title:'Data & validation', p:'10', blocks:[
    {t:'lead', x:'“One Nation, One Data”: data reported once should match across every national platform and be checked digitally.'},
    {t:'cards', title:'Platforms NAAC data may be cross-checked against', cols:4, items:[['AISHE'],['NIRF'],['UGC / AICTE portals'],['ABC / APAAR'],['NAD / DigiLocker'],['NAAC portal']]},
    {t:'cards', title:'Stakeholder validation', cols:4, items:[['Students','Teaching & support'],['Faculty','Systems & growth'],['Alumni','Outcomes & relevance'],['Employers','Graduate quality']]},
    {t:'table', title:'Risk and response', head:['Risk','Response'], bold:false, rows:[['Mismatched numbers across portals','One ERP master record'],['Unsupported claims','A data owner per metric'],['Weak response from stakeholders','IQAC sign-off before any submission']]},
    {t:'cards', title:'Data governance roles', cols:4, items:[['Data owner','Each metric has one'],['Data steward','IQAC validates'],['Approver','Registrar / VC signs'],['Auditor','Yearly data audit']]},
    {t:'note', tone:'warn', x:'Inflated or inconsistent data can lead to rejection or penalties. Accuracy is the best strategy.'},
  ]},
  {id:'evidence', title:'Evidence by attribute', p:'11', blocks:[
    {t:'lead', x:'Assign every attribute to a lead and build its evidence file year-round, not in the month before submission.'},
    {t:'table', head:['#','Attribute','Key evidence to keep ready','Lead'], bold:false, rows:[
      ['1','Curriculum Design','BoS minutes, CO-PO mapping, NEP alignment, revisions','Dean Academics'],
      ['2','Faculty Resources','Sanctioned vs filled posts, PhDs, FSR, FDPs','Registrar / HR'],
      ['3','Infrastructure','Classrooms, labs, ICT, library, accessibility audit','Estate & IT'],
      ['4','Financial Resources','Audited accounts, budget use, grants, fee transparency','CFO'],
      ['5','Learning & Teaching','Teaching plans, ICT use, mentoring, assessment reforms','Dean Academics'],
      ['6','Extended Curricular','Internships, outreach, NSS, clubs, community work','Dean Students'],
      ['7','Governance','Statutory minutes, e-governance, policies, IQAC ATRs','Registrar / IQAC'],
      ['8','Student Outcomes','Pass rates, placement, higher studies, exam qualifiers','CoE & SPCR'],
      ['9','Research & Innovation','Indexed papers, grants, patents, start-ups','Dean R&D / IIC'],
      ['10','Sustainability','Green, energy and environment audits; SDG activities','Estate & IQAC']]},
    {t:'cards', cols:3, items:[['Evidence rule','Every number has a document; every document has a date'],['Five-year view','Keep year-wise data for at least five years'],['Digital folder','Attribute → metric → year → proof']]},
  ]},
  {id:'plan', title:'12-month plan', p:'12', blocks:[
    {t:'lead', x:'A practical sequence for the IQAC to reach Basic Accreditation and set the base for MBGL.'},
    {t:'row', cols:[
      {t:'list', title:'Months 1-3 · Diagnose', items:['Constitute NAAC steering committee','Form 10 attribute teams','Gap analysis against each metric','Baseline data for five years','Fix data mismatches across portals','Approve action plan']},
      {t:'list', title:'Months 4-6 · Build', items:['Close policy and SOP gaps','Set up digital evidence repository','Run academic and admin audits','Complete green and energy audits','Launch stakeholder feedback','Train faculty on the framework']},
    ]},
    {t:'row', cols:[
      {t:'list', title:'Months 7-9 · Validate', items:['Internal mock assessment','External expert review','Verify every metric against proof','Strengthen weak attributes','Stakeholder awareness drive','Leadership review']},
      {t:'list', title:'Months 10-12 · Submit', items:['Register and confirm eligibility','Upload data and evidence','Respond to verification queries','Prepare for peer verification','Plan MBGL roadmap','Lessons-learned report']},
    ]},
    {t:'note', x:'The steering committee meets every fortnight; the IQAC reports progress to the VC every month.'},
    {t:'cards', cols:3, items:[['Budget','Audits, software, training, experts'],['People','Attribute leads and data coordinators'],['Tools','ERP, repository, dashboard']]},
  ]},
  {id:'checklist', title:'Readiness checklist', p:'13-14', blocks:[
    {t:'check', id:'naac-ready', title:'Readiness checklist (tick as you go)', score:true, items:['Eligibility confirmed','10 attribute teams in place','Data matches AISHE & NIRF','Statutory minutes complete','Feedback & ATRs published','Mock assessment completed','Steering committee notified','Five-year data compiled','All policies approved & online','Audits done (academic, green, energy)','Evidence repository live','MBGL roadmap drafted']},
    {t:'stats', items:[['10-12 ticks','Ready to submit'],['7-9 ticks','Close gaps in 3 months'],['Below 7','Restart the 12-month plan']]},
    {t:'dodont', title:'Pitfalls', do:['Start a year ahead','Keep one verified data source','Assign owners per attribute','Run an external mock review','Prepare stakeholders honestly','Document improvements, not just activities'], dont:['Inflate or round up numbers','Report data that differs across portals','Hire agencies to write evidence','Leave everything to the IQAC alone','Ignore weak outcome attributes','Treat accreditation as a one-time event']},
    {t:'list', title:'Common verification queries', items:['Missing proof for a claim','Numbers differ from AISHE','Unsigned or undated documents','Expired approvals','Activities without outcomes']},
    {t:'summary', items:['Binary first: Basic Accreditation decides whether you meet the national standard.','Ten attributes replace seven criteria, grouped as input, process and outcome.','Weights differ for universities, autonomous and affiliated colleges.','MBGL Levels 1-5 reward maturity, up to global excellence.','Data must match across every national platform: one source of truth.','Stakeholders validate what the institution claims.','Prepare year-round with a 12-month plan and a live evidence repository.']},
  ]},
]);

group('accreditation', 'nba', 'NBA', 'Programme accreditation for Engineering, Management, Pharmacy and MCA', [
  {id:'status', title:'Our programmes', sample:true, render: nba},
  {id:'glance', title:'NBA at a glance', p:'16', blocks:[
    {t:'lead', x:'NBA accredits programmes, not institutions, on the basis of outcomes: what graduates actually know and can do.'},
    {t:'stats', items:[['1994','Set up by AICTE'],['2010','Became independent'],['2014','Full Washington Accord signatory']]},
    {t:'table', title:'Two tiers', head:['','Tier I','Tier II'], rows:[['Who','Autonomous institutions & university departments','Affiliated (non-autonomous) colleges'],['Curriculum','Freedom to design curriculum','Set by the affiliating university'],['Grading','Y / C / W / D per criterion','Scored out of 1000 marks'],['Benefit','Washington Accord benefit for UG engineering','National recognition']]},
    {t:'cards', title:'Programmes NBA accredits', cols:3, items:[['Engineering','Diploma · UG · PG'],['Management','PG'],['Pharmacy','Diploma · UG · PG'],['Computer Applications','MCA'],['Architecture',''],['Hotel Management','']]},
    {t:'note', tone:'info', x:'NAAC assesses the institution as a whole; NBA assesses each programme separately. A university needs both.'},
    {t:'table', title:'Key terms', head:['Term','Meaning'], rows:[['SAR','Self-Assessment Report'],['PQ','Pre-qualifier: eligibility gate'],['PEO','Programme Educational Objective'],['PO / PSO','Programme (Specific) Outcomes'],['CO','Course Outcome'],['OBE','Outcome-Based Education'],['SFR','Student-Faculty Ratio'],['DAB','Department Advisory Board'],['GAPC','Graduate Attributes & Professional Competencies'],['PAQIC','Programme Assessment & Quality Improvement Committee']]},
  ]},
  {id:'process', title:'Accreditation process', p:'17', blocks:[
    {t:'steps', title:'Ten steps', items:[['Check eligibility','Required batches graduated; approvals valid for all years'],['Register on e-NBA','Institution and programme details online'],['Pre-Qualifier (PQ)','Submit PQ data with fee; NBA scrutinises compliance'],['Submit SAR','Part A (institution) + Part B (criteria)'],['Expert team named','Chairperson plus evaluators for each programme'],['Pre-visit review','Evaluators study the SAR before the visit'],['On-site visit','Usually about three days; documents, labs, interactions'],['Exit meeting','Strengths and concerns shared; no scores disclosed'],['Evaluation report','Criterion-wise grades / marks with justification'],['Decision','Reviewed by NBA committees; status communicated']]},
    {t:'cards', title:'Three phases, three owners', cols:3, items:[['Before','Department + IQAC prepare PQ and SAR'],['During','HoD leads; Principal / Director hosts the visit'],['After','Act on concerns; plan compliance or renewal']]},
    {t:'table', title:'Who does what inside the institution', head:['Role','Responsibility'], rows:[['NBA coordinator','Single point of contact with NBA; tracks every deadline'],['Programme coordinator','Owns the SAR for one programme'],['Criterion in-charges','One faculty member per criterion collects evidence'],['IQAC','Checks data consistency and runs mock audits']]},
  ]},
  {id:'outcomes', title:'Outcomes & validity', p:'18', blocks:[
    {t:'stats', items:[['6 years','Full accreditation'],['3 years','Accreditation'],['0','Not accredited']]},
    {t:'note', tone:'info', x:'Earlier cycles granted 5 years (full) or 2 years (provisional). Status is specific to the programme and the years in the NBA letter.'},
    {t:'cards', title:'Tier I criterion grades', cols:4, items:[['Y · Compliance','75% and above'],['C · Concern','60-75%'],['W · Weakness','40-60%'],['D · Deficiency','Below 40%']]},
    {t:'table', title:'How the decision is made (Tier II)', head:['','6 years','3 years'], rows:[['Grades','Mostly “Y”; no W or D','Fewer Y; no D'],['Score','High aggregate (commonly cited 750 / 1000)','Moderate (commonly cited 600 / 1000)']], foot:'Thresholds summarised from secondary guides; confirm in the current NBA manual.'},
    {t:'timeline', title:'Keeping accreditation alive', items:[['Year 1','Close all concerns raised in the report'],['Every year','Update attainment, faculty and placement data'],['Mid-cycle','Internal audit against the latest SAR format'],['18 months before expiry','Start renewal preparation'],['Any change','Report major changes in intake or faculty as NBA requires']]},
  ]},
  {id:'faculty', title:'Faculty requirement', p:'19', blocks:[
    {t:'lead', x:'Faculty carries the largest single weight in most NBA SARs. Get the numbers, cadre and qualifications right before anything else.'},
    {t:'stats', items:[['1 : 20','Benchmark SFR for required faculty'],['1 : 25','Typical PQ limit (3-yr avg)'],['1 : 2 : 6','Prof : Assoc : Asst'],['20%','PhD share of required faculty']]},
    {t:'html', title:'Faculty calculator (UG engineering, 4 years)', html: nbaCalcHtml()},
    {t:'table', title:'Planning table by intake', head:['Intake','Students (S)','Required faculty','Prof · Assoc · Asst','PhD (min)'], rows:[['60','180','9','1 · 2 · 6','2'],['120','360','18','2 · 4 · 12','4'],['180','540','27','3 · 6 · 18','6']], foot:'Before lateral entry. PhD minimum is 20% of required faculty, rounded up.'},
    {t:'table', title:'Counting rules that catch institutions out', head:['Type','Rule'], rows:[['Regular faculty','Full-time, appointed through a documented selection process'],['Contractual faculty','Count only if full-time, taught two consecutive semesters and meet norms'],['Part-time / visiting','Not counted'],['Qualifications','Must meet AICTE / PCI norms for the cadre'],['Retention','High turnover lowers scores; track it every year']]},
    {t:'note', x:'In the 2025 UG engineering SAR, the best SFR marks go to departments below 15 : 1.'},
  ], mount: nbaCalcMount},
  {id:'engineering', title:'Engineering UG', p:'20-22', blocks:[
    {t:'table', title:'Pre-qualifiers (Tier I)', head:['#','Condition','Requirement'], bold:false, rows:[['1','Vision, Mission, PEOs','Published in prospectus or on website'],['2','Approval','Valid approval (AICTE / UGC / BoG) for all years incl. current'],['3','Admissions','≥ 60% of sanctioned intake, 3-year average, incl. lateral entry'],['4','Student-faculty ratio','1 : 25 or better, average of last 3 years'],['5','Senior faculty','2 Professors, or 1 Professor + 1 Associate, with PhD, regular'],['6','PhD faculty','≥ 20% of required faculty (2-year average)'],['7','Batches passed out','At least two batches graduated'],['8','Head of Department','Holds a PhD']], foot:'NBA UG Engineering Tier I PQ pro-forma (June 2023).'},
    {t:'table', title:'Why PQs fail most often', head:['Area','Cause'], rows:[['Faculty count','Required faculty computed on the wrong student base'],['PhD share','Contract PhD faculty who do not meet the counting rules'],['Admissions','Average falls below the threshold in one weak year'],['Approvals','A missing approval letter for one academic year']]},
    {t:'weights', title:'SAR criteria (Tier II, Jan 2025)', unit:'', items:[['1 Outcome-Based Curriculum',120],['2 Outcome-Based Teaching-Learning',120],['3 Outcome-Based Assessment',120],['4 Students’ Performance',120],['5 Faculty Information',100],['6 Faculty Contributions',120],['7 Facilities & Technical Support',100],['8 Continuous Improvement',80],['9 Student Support & Governance',120]], foot:'Total 1000. Criteria 1-8 are programme-level; 9 is institution-level.'},
    {t:'cards', title:'Programme Outcomes (GAPC v4.0)', cols:4, items:[['PO1','Engineering knowledge'],['PO2','Problem analysis'],['PO3','Design / development'],['PO4','Investigations'],['PO5','Tool usage'],['PO6','Engineer & the world'],['PO7','Ethics'],['PO8','Teamwork'],['PO9','Communication'],['PO10','Project mgmt & finance'],['PO11','Life-long learning'],['+ PSOs','By programme']]},
    {t:'timeline', title:'Typical three-day visit', items:[['Day 1','Opening and programme presentations; labs and facilities; document review'],['Day 2','Faculty, student, alumni, employer and parent meetings; course files and attainment'],['Day 3','Clarifications; team finalises report; exit meeting']]},
    {t:'check', id:'nba-visit', title:'Getting ready for the visit', items:['Institution and programme presentations (20-30 min each)','Evidence room indexed by criterion and table number','Labs running, logbooks updated, safety signs','Students, alumni, employers and parents briefed']},
  ]},
  {id:'management', title:'Management PG', p:'23', blocks:[
    {t:'table', title:'MBA / PGDM pre-qualifiers', head:['Condition','Requirement'], rows:[['Graduated batches','At least 3'],['Admissions','≥ 60% of sanctioned intake'],['Student-faculty ratio','1 : 25 or better (3-year average)'],['Senior faculty','2 Professors, or 1 Prof + 1 Assoc, with PhD, regular'],['PhD faculty','≥ 20% of required faculty'],['Placement + higher studies + entrepreneurship','≥ 60% (3-year average)']]},
    {t:'weights', title:'SAR criteria (1000 marks)', unit:'', items:[['1 Vision, Mission & PEOs',50],['2 Governance, Leadership & Finance',100],['3 Programme & Course Outcomes',100],['4 Curriculum & Learning Process',125],['5 Student Quality & Performance',100],['6 Faculty Attributes & Contributions',250],['7 Industry & International Connect',100],['8 Infrastructure',75],['9 Alumni Performance & Connect',50],['10 Continuous Improvement',50]], foot:'NBA PG Management PQ and SAR format (April 2024).'},
    {t:'note', x:'Faculty (250) plus industry, international and alumni connect make up 40% of the score.'},
  ]},
  {id:'pharmacy-mca', title:'Pharmacy & MCA', p:'24-25', blocks:[
    {t:'row', cols:[
      {t:'table', title:'B.Pharm pre-qualifiers', head:['Condition','Requirement'], rows:[['Approval','Valid PCI and AICTE, all years'],['Admissions','≥ 50% of intake, 3-yr avg'],['SFR','1 : 20 or better'],['Senior faculty','1 Prof or Assoc, regular, 2 years'],['HoD','Holds a PhD'],['PhD faculty','≥ 20%'],['Batches','At least two'],['Placement + HS','More than 40%']]},
      {t:'table', title:'MCA pre-qualifiers (indicative)', head:['Condition','Requirement'], rows:[['Approval','Valid AICTE / UGC, all years'],['Batches','At least two'],['Admissions','≥ 60% of intake, 3-yr avg'],['SFR','1 : 25 or better'],['Senior faculty','2 Prof, or Prof + Assoc, PhD'],['PhD faculty','≥ 20%']]},
    ]},
    {t:'row', cols:[
      {t:'weights', title:'B.Pharm SAR (1000)', unit:'', items:[['Students’ Performance',180],['Faculty Info & Contributions',175],['Curriculum & Teaching-Learning',150],['Facilities & Technical Support',120],['CO & PO',100],['Governance & Finance',100],['Continuous Improvement',75],['Vision, Mission & PEOs',50],['Student Support',50]]},
      {t:'weights', title:'MCA SAR (1000)', unit:'', items:[['Faculty Info & Contributions',200],['Students’ Performance',180],['Curriculum & Teaching-Learning',130],['Governance & Finance',120],['CO & PO',100],['Facilities & Technical Support',80],['Student Support',80],['Vision, Mission & PEOs',60],['Continuous Improvement',50]]},
    ]},
    {t:'list', title:'What evaluators look for in MCA', items:['Industry-aligned electives','Live software projects','Cloud / AI / data labs','Certifications','Internships','Placement quality']},
  ]},
  {id:'compare', title:'Programme comparison', p:'26', blocks:[
    {t:'table', head:['Item','Engineering','Management','Pharmacy','MCA'], rows:[
      ['Level','UG','PG','UG','PG'],['Batches graduated','2','3','2','2*'],['Admissions','≥ 60%','≥ 60%','≥ 50%','≥ 60%*'],
      ['Student-faculty ratio','1 : 25','1 : 25','1 : 20','1 : 25*'],['PhD faculty','≥ 20%','≥ 20%','≥ 20%','≥ 20%*'],
      ['Outcome gate','—','60% placed / HS / entrepr.','> 40% placed / HS','—'],['SAR criteria','9','10','9','9'],['Format','Jan 2025 (Tier II)','Apr 2024','Current pro-forma','Dec 2023']], foot:'* Indicative PG pattern; confirm against the current MCA pro-forma.'},
    {t:'weights', title:'Faculty weight in the SAR (out of 1000)', unit:'', items:[['Management',250],['Engineering',220],['MCA',200],['Pharmacy',175]]},
    {t:'note', x:'Every SAR rewards the same three things: qualified, stable faculty; measured outcome attainment; and results that feed back into improvement.'},
    {t:'cards', title:'Applying for several programmes?', cols:3, items:[['Start strong','Begin with programmes that pass the PQ comfortably'],['Share the core','Institution-level criteria are common; write once, reuse'],['Stagger visits','Group programmes so one visit covers several']]},
  ]},
  {id:'obe', title:'OBE & attainment', p:'27', blocks:[
    {t:'flow', title:'The outcome chain', items:[['Vision & Mission','Institution and department'],['PEOs','Graduates 3-5 years after'],['POs & PSOs','At graduation'],['COs','In each course']]},
    {t:'steps', title:'Attainment cycle in six steps', items:[['Write COs','Action verbs (Bloom’s levels), usually 4-6 per course'],['Map CO → PO','1 / 2 / 3 scale (low, medium, high correlation)'],['Set targets','e.g. 60% of students scoring above 60% in CO-linked questions'],['Measure CO attainment','From internal and end-semester assessment'],['Compute PO attainment','From CO attainment and mapping, plus surveys'],['Close the loop','Record gaps and the actions taken in the next cycle']]},
    {t:'row', cols:[{t:'cards', cols:1, items:[['Direct (often ~80%)','Tests, assignments, end-semester exams, lab work, projects']]},{t:'cards', cols:1, items:[['Indirect (often ~20%)','Course-exit, exit, alumni and employer surveys']]}]},
    {t:'table', title:'Example CO-PO mapping', head:['','PO1','PO2','PO3','PO5','PO9','PO11'], rows:[['CO1','3','2','-','-','-','1'],['CO2','2','3','2','1','-','-'],['CO3','2','2','3','2','1','1']]},
    {t:'note', tone:'warn', x:'Evaluators ask: “Show me a PO that was not attained, and what you changed.” Keep that evidence ready.'},
  ]},
  {id:'readiness', title:'Readiness & checklist', p:'28-29', blocks:[
    {t:'timeline', title:'A 12-month path to the visit', items:[['Months 1-2','Form the NBA committee; run the PQ internally; fix faculty and admission gaps'],['Months 3-5','Review Vision, Mission, PEOs, POs and COs; finish CO-PO mapping; set targets'],['Months 6-8','Compute attainment for 3 years; course files; surveys; record actions'],['Months 9-10','Write the SAR; reconcile with NIRF, AISHE, AICTE; internal mock audit'],['Months 11-12','Submit SAR; respond to queries; prepare presentations, labs, evidence room']]},
    {t:'check', id:'nba-docs', title:'Document checklist', items:['Approval letters, all years','Faculty list with qualifications','Vision, Mission, PEOs, POs, PSOs','Course files with COs','Attainment sheets, 3 years','Results and pass percentages','Lab manuals and stock registers','Committee minutes (DAB, PAQIC)','Admission and intake records','Appointment and salary proof','Curriculum and gap analysis','CO-PO mapping matrices','Survey forms and analysis','Placement and higher-study proof','Faculty publications and projects','Budget and expenditure statements']},
    {t:'list', title:'Pitfalls to avoid', items:['Data mismatch between SAR and national portals','Attainment on paper with no actions recorded','Faculty turnover just before the visit']},
    {t:'summary', items:['Programmes, not institutions: NBA accredits each programme separately.','Pre-qualifier is the gate: admissions, SFR, senior and PhD faculty must pass first.','Faculty decide the score: plan cadre 1 : 2 : 6 and SFR at or below 1 : 20.','SAR = 1000 marks across 9 or 10 criteria, depending on the programme.','OBE is the core: PEO → PO → CO, with measured attainment and closed loops.','Validity: 6 years (accredited) or 3 years under current rules.','Start 12 months early and keep a live evidence file for every programme.']},
  ]},
]);

group('accreditation', 'intl', 'International', 'ABET, IET, AACSB, AMBA, EQUIS and other global accreditors', [
  {id:'status', title:'Our pipeline', sample:true, render: intl},
  {id:'why', title:'Why go international', p:'97', blocks:[
    {t:'lead', x:'International accreditation tests a programme or school against standards used worldwide. Voluntary, demanding and costly, but it signals global quality.'},
    {t:'table', title:'Main accreditors by discipline', head:['Field','Accreditor','Level'], rows:[['Engineering','ABET (USA); IET and other UK institutions; ASIIN (Germany)','Programme'],['Computing','ABET CAC; IET (software); Seoul Accord bodies','Programme'],['Business','AACSB (USA); EQUIS (Europe); AMBA (UK)','School / MBA'],['Business programmes','EFMD EPAS; EOCCS (online); ACBSP, IACBE','Programme'],['Pharmacy','ACPE international certification (USA)','Programme'],['Medicine','WFME recognises national regulators (NMC in 2023)','System'],['Architecture','RIBA validation (UK)','Programme']]},
    {t:'cards', title:'Benefits', cols:4, items:[['Mobility','Graduates recognised for jobs and study abroad'],['Partnerships','Foreign universities prefer accredited partners'],['Rankings','QS and THE reputation and employer links improve'],['Quality','External peer review sharpens OBE and governance']]},
    {t:'note', x:'Start at home: NBA Tier I already gives Washington Accord recognition for UG engineering.'},
  ]},
  {id:'accords', title:'Accords', p:'98', blocks:[
    {t:'table', title:'International accords', head:['Accord','Covers','India'], rows:[['Washington Accord','Professional engineering degrees (4-year UG)','NBA full signatory since 2014'],['Sydney Accord','Engineering technologist programmes','Check NBA status'],['Dublin Accord','Engineering technician programmes','Check NBA status'],['Seoul Accord','Computing and IT programmes','Check NBA status']]},
    {t:'table', title:'Three routes for an Indian engineering programme', head:['','NBA (India)','ABET (USA)','IET (UK)'], rows:[['Recognition','Washington Accord (Tier I)','Strong global brand; not covered by the accord outside the USA','UK Engineering Council registers'],['Cycle','Up to 6 years','Up to 6 years','Up to 5 years (typical)'],['Effort','Medium','High','High']]},
    {t:'note', tone:'info', x:'ABET or IET accreditation of an Indian programme is valued for its brand and standards, but NBA remains the route to Washington Accord recognition in India.'},
  ]},
  {id:'abet', title:'ABET', p:'99-101', blocks:[
    {t:'stats', items:[['4,674','Programmes (Oct 2023)'],['920','Institutions'],['42','Countries'],['6 yrs','Maximum cycle']]},
    {t:'cards', title:'Four commissions', cols:4, items:[['EAC','Engineering'],['CAC','Computing'],['ETAC','Engineering technology'],['ANSAC','Applied & natural sciences']]},
    {t:'table', title:'Possible outcomes', head:['Action','Meaning'], rows:[['Next General Review','Full term, up to six years'],['Interim Report / Visit','Shortcomings to fix within two years'],['Show Cause','Serious deficiencies; accreditation at risk'],['Not to Accredit','Standards not met']]},
    {t:'cards', title:'Eight general criteria (EAC 2026-27)', cols:4, items:[['1','Students'],['2','Programme Educational Objectives'],['3','Student Outcomes'],['4','Continuous Improvement'],['5','Curriculum'],['6','Faculty'],['7','Facilities'],['8','Institutional Support']]},
    {t:'table', title:'Student outcomes and NBA POs', head:['SO','Outcome (summary)','NBA PO'], rows:[['1','Solve complex engineering problems','PO1, PO2'],['2','Apply engineering design to meet needs','PO3'],['3','Communicate effectively','PO9'],['4','Ethical and professional responsibility','PO6, PO7'],['5','Function effectively on a team','PO8'],['6','Design and conduct experiments','PO4'],['7','Acquire and apply new knowledge','PO11']]},
    {t:'stats', items:[['30 credits','Maths & basic sciences'],['45 credits','Engineering topics'],['Capstone','Major design experience']]},
    {t:'timeline', title:'Process & timeline', items:[['By 1 Oct','Readiness Review (institutions new to ABET)'],['January','Request for Evaluation'],['~1 July','Self-Study Report'],['Sep - Dec','Campus visit'],['After visit','Exit meeting; 7 days to respond; 30 days on draft statement'],['July / Aug','Commission decision; result in August']]},
    {t:'table', title:'NBA systems you can reuse', head:['NBA practice','ABET use'], rows:[['PEOs and POs','Map NBA POs (GAPC) to ABET SOs 1-7'],['Attainment','CO and PO attainment and closing-the-loop records'],['SAR','Reuse evidence; restructure into ABET criteria'],['Advisory boards','Industry and alumni input for PEO review']]},
    {t:'note', tone:'warn', x:'Biggest gap for Indian programmes: continuous improvement with direct assessment of each student outcome, documented over several cycles.'},
  ]},
  {id:'iet', title:'IET & Europe', p:'102', blocks:[
    {t:'lead', x:'IET accredits programmes for the UK Engineering Council against the AHEP learning outcomes.'},
    {t:'stats', items:[['15','Countries with IET-accredited programmes'],['AHEP','UK learning-outcome standard'],['CEng / IEng','Registration pathways']]},
    {t:'table', title:'AHEP learning-outcome areas', head:['Area','What is assessed'], rows:[['Science & mathematics','Knowledge and its application'],['Engineering analysis','Problem analysis with appropriate tools'],['Design & innovation','Design to meet needs and constraints'],['Responsible engineering','Ethics, sustainability, risk, security'],['Practice','Lab skills, teamwork, communication']]},
    {t:'cards', cols:2, items:[['ASIIN & EUR-ACE','ASIIN (Germany) accredits engineering, informatics and science programmes and can award the European EUR-ACE label.'],['Plan visits together','One IET visit can cover several programmes; plan electrical, electronics and computing together.']]},
  ]},
  {id:'aacsb', title:'AACSB', p:'103-104', blocks:[
    {t:'table', title:'2020 standards', head:['Section','Std','Title'], bold:false, rows:[['Strategic Management & Innovation','1','Strategic planning'],['','2','Physical, virtual and financial resources'],['','3','Faculty and professional staff resources'],['Learner Success','4','Curriculum'],['','5','Assurance of learning'],['','6','Learner progression'],['','7','Teaching effectiveness and impact'],['Thought Leadership & Impact','8','Impact of scholarship'],['','9','Engagement and societal impact']]},
    {t:'table', title:'Faculty qualification categories', head:['Code','Meaning'], rows:[['SA','Scholarly Academic: terminal degree; current through research'],['PA','Practice Academic: terminal degree; current through professional engagement'],['SP','Scholarly Practitioner: master’s + experience; current through scholarship'],['IP','Instructional Practitioner: master’s + experience; current through practice'],['A','Additional: does not meet SA / PA / SP / IP criteria']]},
    {t:'flow', title:'Assurance of learning', items:[['Goals','Competency goals per degree'],['Measure','Direct and indirect'],['Analyse','Against targets'],['Improve','Curriculum changes, re-measure']]},
    {t:'list', title:'Initial eligibility', items:['Join AACSB; offer at least a bachelor’s in business','Normally at least 16 full-time faculty by the initial visit','At least one business degree; graduates for two consecutive years','Complete the annual Business School Questionnaire','CEO and chief academic officer support']},
    {t:'steps', title:'Pathway', items:[['Eligibility application','Accepted by AACSB; mentor assigned'],['Initial self-evaluation (iSER)','Gap analysis against all nine standards'],['Accreditation plan','Actions to close gaps, usually over several years'],['Self-evaluation report','Evidence of meeting the standards'],['Peer review visit','Team of deans; recommendation'],['Continuous Improvement Review','Typically every five years']]},
    {t:'note', tone:'warn', x:'Hardest parts for Indian schools: enough SA faculty with recent peer-reviewed research, and a working assurance-of-learning system with closed loops.'},
  ]},
  {id:'triple', title:'AMBA, EQUIS & India', p:'105-106', blocks:[
    {t:'table', title:'AMBA (UK) · about 277 schools in 54 countries', head:['Criterion','Typical requirement'], rows:[['Track record','At least three years of graduating MBA cohorts'],['Cohort','At least 20 students per programme'],['Faculty','At least 50% with doctorates'],['Contact hours','500+ full-time MBA; 120+ synchronous distance'],['Experience','Students with 3+ years’ work experience']]},
    {t:'cards', title:'EQUIS (EFMD) · ten areas · about 224 schools in 45 countries', cols:2, items:[['Context, governance and strategy'],['Programmes and students'],['Faculty and research'],['Executive education'],['Resources and administration'],['Internationalisation'],['Ethics, responsibility and sustainability'],['Connections with practice']]},
    {t:'stats', items:[['~1%','Schools worldwide with all three'],['4','Indian Triple Crown schools (Dec 2024)'],['31','Indian AACSB schools (2026)']]},
    {t:'note', x:'Most schools go AMBA or AACSB first, then EQUIS once international partnerships and research are strong.'},
    {t:'cards', title:'What the AACSB list shows', cols:3, items:[['Private schools','More than half are private or autonomous'],['IIMs','Six IIMs are on the list'],['Universities','Amrita, Jindal, VIT, NMIMS, ICFAI']]},
    {t:'cards', title:'Lessons from accredited Indian schools', cols:2, items:[['Start early','Mentoring and gap analysis'],['Research','Build peer-reviewed output steadily'],['Industry','Active advisory boards and practitioners'],['International','Exchange and faculty partnerships']]},
  ]},
  {id:'other', title:'Other disciplines', p:'107', blocks:[
    {t:'table', head:['Field','Body','Scope'], rows:[['Pharmacy','ACPE (USA)','International certification of pharmacy degrees'],['Medicine','WFME','Recognises national agencies; NMC recognised in 2023'],['Architecture','RIBA (UK)','Validation of architecture courses overseas'],['Computing','ABET CAC; Seoul Accord','Programme accreditation; mutual recognition'],['Business programmes','EFMD EPAS / EOCCS','Programme-level and online'],['Business (teaching)','ACBSP, IACBE (USA)','Outcomes-focused business accreditation'],['Hospitality','UNWTO TedQual and others','Tourism and hospitality education quality'],['Chemical / other engg','IChemE, IMechE (UK)','Licensed by the Engineering Council']]},
    {t:'cards', title:'Before choosing', cols:4, items:[['Recognition','Valued by target employers and countries?'],['Fit','Do curriculum and faculty match?'],['Cost','Fees, visits, travel, staff time'],['Payoff','Partnerships, admissions, rankings, mobility']]},
    {t:'note', tone:'info', x:'National bodies (NMC, PCI) remain the legal regulators; international recognition never replaces Indian approvals.'},
  ]},
  {id:'choose', title:'Choosing & roadmap', p:'108-109', blocks:[
    {t:'table', title:'Comparison', head:['Accreditor','Unit','Typical prep','Effort','Main value'], rows:[['ABET','Engineering / computing programmes','2-3 years','High','US-recognised quality; global brand'],['IET','Electrical, electronic, software','2-3 years','High','UK route to CEng / IEng'],['AACSB','Business school','4-7 years','Very high','Global business-school standard'],['AMBA','MBA portfolio','2-3 years','Medium','MBA quality signal'],['EQUIS','Business school','3-5 years','Very high','European, strongly international'],['EPAS','Single business programme','1-2 years','Medium','Programme-level EFMD route']]},
    {t:'check', id:'intl-ready', title:'Readiness test (two or more gaps → fix foundations first)', items:['NBA / NAAC systems running well for at least one cycle','Outcome attainment data for 3+ years','Faculty profile meets the standard','Leadership commitment and multi-year budget','A dedicated accreditation office or coordinator']},
    {t:'cards', title:'Typical first moves', cols:3, items:[['Engineering','NBA Tier I for core programmes, then ABET or IET for 2-3 flagships'],['Management','AMBA or EPAS for the MBA, building towards AACSB'],['Others','National regulators and NAAC; add international recognition where mobility matters']]},
    {t:'timeline', title:'Five-year roadmap', items:[['Year 1','Choose accreditor and programmes; gap analysis; membership; leadership approval'],['Year 2','Fix gaps: curriculum mapping, assessment, faculty hiring, advisory boards'],['Year 3','Two cycles of outcome data; external mock review'],['Year 4','Eligibility / readiness submission; self-study report'],['Year 5','Visit; respond to findings; decision']]},
    {t:'table', title:'Team', head:['Role','Who'], rows:[['Sponsor','Vice-Chancellor or Dean'],['Coordinator','Director IQAC or accreditation officer'],['Programme leads','HoD or programme director'],['Assessment lead','Owns outcome measurement and closing the loop'],['Mentor','External expert from an accredited institution']]},
    {t:'summary', items:['Foundations first: NBA and NAAC systems must be mature before going global.','NBA Tier I is India’s route to Washington Accord recognition.','ABET: eight criteria, seven student outcomes, cycles of up to six years.','IET: UK AHEP outcomes and a route to CEng / IEng.','AACSB: nine standards; faculty qualifications and assurance of learning are key.','AMBA and EQUIS complete the business-school Triple Crown.','Choose by value: recognition, fit, cost and payoff over the full cycle.']},
  ]},
]);

/* NBA faculty calculator: required faculty = S / 20, cadre 1:2:6, PhD = 20% rounded up. */
function nbaCalcHtml(){
  return `<div class="calc"><label>Sanctioned intake per year <input type="number" id="nba-intake" value="60" min="0" step="30"></label>
    <label>Lateral-entry students (2nd-4th yr) <input type="number" id="nba-lat" value="0" min="0"></label></div><div id="nba-out" class="stats"></div>`;
}
function nbaCalcMount(){
  const go = () => {
    const intake = +document.getElementById('nba-intake').value || 0, lat = +document.getElementById('nba-lat').value || 0;
    const S = intake * 3 + lat, F = Math.ceil(S / 20), u = F / 9;
    const prof = Math.round(u), assoc = Math.round(2*u), asst = Math.max(0, F - prof - assoc), phd = Math.ceil(F * 0.2);
    document.getElementById('nba-out').innerHTML = [[S,'Students counted (S)'],[F,'Required faculty (S ÷ 20)'],[`${prof} · ${assoc} · ${asst}`,'Prof · Assoc · Asst'],[phd,'PhD faculty (20%)']]
      .map(([v,l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('');
  };
  ['nba-intake','nba-lat'].forEach(id => document.getElementById(id).oninput = go); go();
}

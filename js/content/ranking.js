/* Ranking: NIRF (ch. 3), QS (ch. 4), THE (ch. 5). */

group('ranking', 'nirf', 'NIRF', 'India Rankings: parameters, data and strategy', [
  {id:'status', title:'Our status', sample:true, render: nirf},
  {id:'glance', title:'NIRF at a glance', p:'31', blocks:[
    {t:'lead', x:'The Ministry of Education’s annual ranking of Indian higher education institutions. Unlike accreditation, it compares institutions with each other every year.'},
    {t:'stats', items:[['2015','Framework approved'],['2016','First India Rankings'],['17','Categories (2025)'],['5','Parameters, 100 marks each']]},
    {t:'timeline', title:'Milestones', items:[['Sep 2015','Framework launched by MHRD'],['Apr 2016','First rankings: Universities, Engineering, Management, Pharmacy'],['2017 onward','Overall ranking added; more categories each year'],['2025','10th edition (4 Sep 2025): new SDG category; negative marks for retracted papers'],['2026','11th edition: release pending as of early Oct 2026']]},
    {t:'table', title:'Accreditation vs ranking', head:['','NAAC / NBA','NIRF'], rows:[['Question','Do you meet the standard?','Where do you stand among peers?'],['Frequency','Once in 5-6 years','Every year'],['Basis','Peer review + metrics','Mostly data + perception survey'],['Result','Status / grade / level','Score and rank (or band)']]},
    {t:'cards', title:'Why NIRF matters', cols:4, items:[['Students & parents','Use it to shortlist institutions'],['Regulators','NIRF rank is an eligibility condition in some UGC regulations'],['Funders & industry','Read it as a quality signal'],['Institutions','Benchmark and set targets']]},
  ]},
  {id:'categories', title:'Categories & weights', p:'32', blocks:[
    {t:'cards', title:'The 17 categories (India Rankings 2025)', cols:4, items:[['Overall','','Type'],['Universities','','Type'],['Colleges','','Type'],['Research Institutions','','Type'],['State Public Universities','','Type'],['Open Universities','','Type'],['Skill Universities','','Type'],['Engineering','','Subject'],['Management','','Subject'],['Pharmacy','','Subject'],['Medical','','Subject'],['Dental','','Subject'],['Law','','Subject'],['Architecture & Planning','','Subject'],['Agriculture & Allied','','Subject'],['Innovation','','Thematic'],['SDG (new 2025)','','Thematic']]},
    {t:'formula', x:'Score = 0.30 × TLR + 0.30 × RP + 0.20 × GO + 0.10 × OI + 0.10 × PR'},
    {t:'table', title:'Parameter weights', head:['Category','TLR','RP','GO','OI','PR'], rows:[['Overall, Universities, Engineering, Management, Pharmacy','0.30','0.30','0.20','0.10','0.10'],['Colleges','0.40','0.15','0.25','0.10','0.10']], foot:'NIRF 2025 framework documents. Other categories use their own variants.'},
    {t:'note', x:'A multidisciplinary university should apply in Overall and Universities, and in every subject category where it has eligible programmes. Each category is a separate chance to be ranked.'},
    {t:'cards', title:'Thematic categories need separate preparation', cols:2, items:[['Innovation','Its own framework (formerly ARIIA): start-ups, IPR, innovation ecosystem, pre-incubation'],['SDG','New in 2025: evidence of contribution to the UN Sustainable Development Goals']]},
  ]},
  {id:'cycle', title:'The annual cycle', p:'33', blocks:[
    {t:'steps', items:[['Register','On the NIRF portal; login credentials issued'],['Fill the DCS','Data Capturing System: students, faculty, finance, research, placement for 3 years'],['Publish data','Upload the submitted data on the institution’s own website'],['Third-party data','NIRF adds publication, citation and patent data'],['Perception survey','Employers and academic peers surveyed'],['Verification','NIRF checks outliers and may seek clarification'],['Results','Ranks on nirfindia.org, usually August-September']]},
    {t:'timeline', title:'Indicative timeline', items:[['Oct - Nov','Notice issued; DCS opens'],['Nov - Jan','Data entry and submission'],['Feb - Jun','Verification and perception'],['Aug - Sep','Rankings released']]},
    {t:'list', title:'Ground rules', items:['Three-year data: most metrics use the three preceding years','Faculty counted: only those who taught in both semesters of the reference year','Self-declared data: the head of the institution certifies it; false data can lead to exclusion']},
  ]},
  {id:'tlr', title:'TLR · Teaching & resources', p:'34', blocks:[
    {t:'stats', items:[['30%','Weight (Overall, Univ., Engg)'],['40%','Weight in Colleges'],['1 : 15','FSR for full marks'],['95%','PhD faculty for full FQ']]},
    {t:'table', title:'Sub-parameters (Engineering / Universities)', head:['Code','What it measures','Formula (summary)','Marks','Lever'], rows:[
      ['SS','Student strength','15 × f(NT, NE) + 5 × f(NP)','20','Fill sanctioned seats; grow PhD enrolment'],
      ['FSR','Faculty-student ratio','30 × [15 × F / N]; zero below 1 : 50','30','Recruit regular faculty who teach both semesters'],
      ['FQE','Faculty qualification & experience','FQ = 10 × (% PhD ÷ 95); FE rewards a 1:1:1 experience mix','20','Support faculty PhDs; balance hiring'],
      ['FRU','Financial resources & utilisation','7.5 × f(capital/student) + 22.5 × f(operational/student)','30','Exclude new buildings; classify spending correctly']]},
    {t:'note', x:'FSR and FRU together carry 60 of the 100 TLR marks.'},
    {t:'row', cols:[
      {t:'cards', title:'Who counts as faculty', cols:1, items:[['Counted','Regular and contractual faculty who taught both semesters'],['Not counted','Faculty with only a bachelor’s degree; visiting and guest faculty'],['Check','Same faculty list as AISHE and NAAC, with unique IDs']]},
      {t:'cards', title:'TLR data to keep ready', cols:1, items:[['Students','Sanctioned intake letters, enrolment lists, PhD register'],['Faculty','Appointment letters, PhD and experience certificates'],['Finance','Audited statements split into capital and operational']]},
    ]},
  ]},
  {id:'rp', title:'RP · Research', p:'35', blocks:[
    {t:'stats', items:[['30%','Weight (Overall, Univ., Engg)'],['15%','Weight in Colleges'],['3 yrs','Publication & citation window'],['- 5','Penalty marks for retractions']]},
    {t:'table', title:'Sub-parameters', head:['Code','What it measures','Formula (summary)','Marks'], rows:[
      ['PU','Publications','35 × f(P / FRQ) - 5 × f(retracted papers)','35'],
      ['QP','Quality of publications','20 × f(citations / FRQ) + 20 × f(top-25-percentile share) - 5 × f(retracted citations)','40'],
      ['IPR','Patents','10 × f(granted) + 5 × f(published), 3 years','15'],
      ['FPPP','Projects & professional practice','7.5 × f(research funding / faculty) + 2.5 × f(consultancy / faculty)','10']]},
    {t:'note', tone:'warn', x:'Since 2025, retracted papers and their citations reduce the score. Screen journals and track retractions.'},
    {t:'note', tone:'info', x:'Publications and citations are divided by FRQ (faculty required at 1 : 15, or actual if higher). Hiring faculty without research can lower PU and QP.'},
    {t:'table', title:'Research indicators to track every year', head:['Indicator','Owner'], rows:[['Indexed papers per faculty','Research cell'],['Citations per paper and per faculty','Research cell'],['Share of papers in Q1 / Q2 journals','Research cell'],['Patents published and granted','IPR cell'],['Research funding and consultancy per faculty','Finance + Research']]},
  ]},
  {id:'go', title:'GO · Graduation outcomes', p:'36', blocks:[
    {t:'stats', items:[['20%','Weight (Overall, Univ., Engg)'],['25%','Weight in Colleges'],['80%','On-time pass rate for full GUE'],['3 yrs','Graduating batches considered']]},
    {t:'table', title:'Sub-parameters', head:['Code','What it measures','Formula (summary)','Marks','Lever'], rows:[
      ['GPH','Placement & higher studies','40 × (% placed + % higher studies), 3 batches','40','Keep offer letters and admission proof'],
      ['GUE','University examinations','15 × min(% passing on time ÷ 80, 1)','15','Track at-risk students; timely results'],
      ['GMS','Median salary','25 × f(median salary), 3 years','25','Higher-paying recruiters; record CTC accurately'],
      ['GPHD','PhDs graduated','20 × f(average PhDs awarded / year)','20','Monitor PhD progress']]},
    {t:'note', tone:'info', x:'Management: GPH 40 + GUE 20 + Median Salary 40 (no PhD sub-parameter). Colleges: GPH 40 + GUE 40 + GMS 20.'},
    {t:'table', title:'Evidence for every outcome', head:['Outcome','Proof'], rows:[['Placed','Offer or appointment letter with CTC'],['Higher studies','Admission letter or university ID card'],['Median salary','Offer letters of all placed graduates'],['On-time graduation','Result records by admission batch'],['PhD awarded','University notification of award']]},
    {t:'note', x:'Median, not average: one very high package does not lift the median. Raise the salary band of the middle half of the batch.'},
  ]},
  {id:'oi-pr', title:'OI & PR · Outreach, perception', p:'37', blocks:[
    {t:'table', title:'Outreach & Inclusivity (10%)', head:['Code','What it measures','Formula (summary)','Marks'], rows:[
      ['RD','Region diversity','25 × share from other states + 5 × share from other countries','30'],
      ['WD','Women diversity','15 × (% women students ÷ 50) + 15 × (% women faculty ÷ 20)','30'],
      ['ESCS','Economically & socially challenged','20 × f(% UG with full fee reimbursement)','20'],
      ['PCS','Facilities for divyang students','Full marks when all facilities provided','20']]},
    {t:'stats', items:[['50%','Women students for full marks'],['20%','Women faculty for full marks']]},
    {t:'cards', title:'Perception (10%) · 100 marks', cols:1, items:[['Peer perception','Survey of employers, professionals and academic peers on their preference for the institution and its graduates. Build steady relationships with recruiters and peers; share achievements.']]},
    {t:'check', id:'nirf-pcs', title:'Divyang facilities checklist (PCS)', items:['Ramps in all buildings','Lifts','Accessible toilets','Wheelchairs available','Braille and tactile signage','Assistive software']},
  ]},
  {id:'by-category', title:'Sub-parameters by category', p:'38', blocks:[
    {t:'table', head:['Parameter','Engineering / University','Management','Pharmacy','Colleges'], rows:[
      ['TLR','SS 20 · FSR 30 · FQE 20 · FRU 30','Same','Same as Engg','Same'],
      ['RP','PU 35 · QP 40 · IPR 15 · FPPP 10','PU 40 · QP 40 · FPPP + Exec. Dev. 20','Same as Engg','PU 70 · QP 30'],
      ['GO','GPH 40 · GUE 15 · GMS 25 · GPHD 20','GPH 40 · GUE 20 · GMS 40','Same','GPH 40 · GUE 40 · GMS 20'],
      ['OI','RD 30 · WD 30 · ESCS 20 · PCS 20','Same','Same','Same'],
      ['PR','Peer perception 100','Same','Same','Same'],
      ['Weights','30 / 30 / 20 / 10 / 10','30 / 30 / 20 / 10 / 10','30 / 30 / 20 / 10 / 10','40 / 15 / 25 / 10 / 10']]},
    {t:'cards', title:'What this means for planning', cols:2, items:[['Engineering & Universities','Research quality (QP 40) and PhD output (GPHD 20) reward a research culture.'],['Management','Median salary carries 40 GO marks; recruiter quality matters most.'],['Pharmacy','Mirrors Engineering; patents and funded projects add up to 25 RP marks.'],['Colleges','Teaching (40%) and exam results (GUE 40) dominate; research is only 15%.']]},
    {t:'note', x:'Map each school to the category it can compete in, and set targets for that category’s sub-parameters.'},
  ]},
  {id:'estimator', title:'Score estimator', p:'39', blocks:[
    {t:'lead', x:'Plug in your numbers to see how data turns into marks, using the published formulas. Defaults are the handbook’s worked example.'},
    {t:'html', title:'Estimator', html: nirfCalcHtml(), foot:'Illustration only: sub-parameters marked f( ) are scaled against other institutions and cannot be computed alone.'},
    {t:'table', title:'What would it take to gain marks? (worked example)', head:['Lever','Action','Gain'], rows:[['FSR','Add 30 regular faculty (to 200 = 1 : 15)','+ 4.5 TLR'],['FQ','Raise PhD share from 60% to 80%','+ 2.1 TLR'],['GUE','Raise on-time pass rate to 80%','+ 1.9 GO'],['WD','Women faculty to 20%','+ 1.5 OI']]},
  ], mount: nirfCalcMount},
  {id:'data', title:'Data capture', p:'40', blocks:[
    {t:'table', title:'What the DCS asks for', head:['Section','Contents','Data owner'], rows:[['Sanctioned & enrolled students','Programme-wise intake and strength, gender, state, country','Admissions'],['Graduation data','Batch-wise graduates, placed, higher studies, median salary','SPCR / CoE'],['PhD students','Enrolled and awarded, full and part time','Research Dean'],['Faculty','Name, ID, qualification, experience, designation, dates','Registrar / HR'],['Finance','Capital and operational expenditure, 3 years','CFO'],['Research & IPR','Sponsored projects, consultancy, patents','Research / IPR cell'],['Facilities & inclusion','Divyang facilities, fee reimbursement','Estate / Welfare']]},
    {t:'cards', title:'One source of truth', cols:3, items:[['Single register','One verified master list each for students, faculty and finance'],['Evidence file','Proof for every figure: offer letters, salary slips, audited accounts'],['Cross-check','IQAC compares NIRF data with AISHE and NAAC before submitting']]},
    {t:'steps', title:'Four-level validation before submission', items:[['Data owner','Enters and signs off the section'],['School nodal officer','Checks school-wise figures'],['IQAC','Cross-checks with AISHE, NAAC and NBA'],['VC review','Final approval before certification']]},
    {t:'note', tone:'info', x:'NIRF asks institutions to publish submitted data on their website. Treat it as public and keep it consistent.'},
  ]},
  {id:'strategy', title:'Improvement strategy', p:'41-43', blocks:[
    {t:'table', title:'Quick wins vs structural moves', head:['','Quick wins (0-12 months)','Structural (2-5 years)'], rows:[['TLR','Count eligible faculty correctly; classify spending; fill seats','Recruit to 1 : 15; raise PhD share; expand PhD intake'],['RP','Clean author profiles and affiliation; capture every patent and project','Research clusters, seed grants, funded projects, patents granted'],['GO','Collect every offer letter and higher-studies proof; timely results','Industry partnerships, better recruiters, PhD completion'],['OI','Report all fee reimbursements; audit divyang facilities','National and international admissions; women in leadership'],['PR','Update recruiter and peer contact lists; share achievements','Long-term brand, alumni and industry engagement']]},
    {t:'cards', title:'Where marks are usually lost', cols:4, items:[['FSR','Too few regular faculty'],['QP','Low citations per faculty'],['GMS','Low median salary'],['RD','Mostly local students']]},
    {t:'steps', title:'Five-step improvement method', items:[['Baseline','Compute your score with last year’s data'],['Benchmark','Compare with institutions ranked 20-50 places above'],['Gap list','Rank sub-parameters by marks lost × ease of fixing'],['Owners','Assign each gap to a named officer with a target'],['Review','Track quarterly in the IQAC / NIRF committee']]},
    {t:'table', title:'Sample target sheet', head:['Indicator','Now','Target','Owner'], rows:[['Faculty-student ratio','1 : 19','1 : 16','Registrar'],['PhD faculty share','55%','70%','Deans'],['Indexed papers per faculty','0.8','1.2','Research Dean'],['Placement + higher studies','65%','75%','SPCR']], foot:'Illustrative; use your own baseline.'},
    {t:'table', title:'Research integrity safeguards', head:['Safeguard','Practice'], rows:[['Retraction watch','Check faculty papers for retractions every quarter'],['Journal screening','Approved journal list maintained by the research cell'],['Self-citation','Monitor unusually high self-citation rates'],['Authorship policy','Clear rules on authorship and affiliation']]},
    {t:'cards', title:'Building the research culture', cols:4, items:[['Incentives','Tied to quartile and citations'],['Seed grants','Lead to external proposals'],['Research time','Reduced load for active researchers'],['PhD pipeline','Full-time scholars in every school']]},
    {t:'table', title:'Graduation outcome actions', head:['Sub-parameter','Actions'], rows:[['Placement (GPH)','Training from first year; internship-to-offer pipeline; record every offer'],['Higher studies','Track PG and PhD admissions; collect admission letters'],['Median salary','Target recruiters in higher bands; verify CTC from offer letters'],['On-time pass (GUE)','Mentoring, remedial classes, timely supplementary exams'],['PhD graduated','Six-monthly reviews; thesis submission targets']]},
    {t:'cards', title:'Perception: who to reach', cols:4, items:[['Employers','Recruiter meets, advisory boards, live projects'],['Academic peers','Conferences, joint research, active MoUs'],['Alumni','Ambassadors in industry and academia'],['Communication','Newsletters and achievement reports']]},
  ]},
  {id:'cell', title:'NIRF cell & checklist', p:'44-46', blocks:[
    {t:'table', title:'NIRF cell', head:['Role','Who'], rows:[['Chair','Vice-Chancellor or Pro-Vice-Chancellor'],['NIRF coordinator','Director IQAC: consolidation, consistency, submission'],['Data owners','Registrar, CFO, CoE, Admissions, SPCR, Research, IPR, Welfare, Estate'],['School nodal officers','Faculty data and evidence for each school'],['Analyst','Score estimation, benchmarking, dashboards']]},
    {t:'timeline', title:'Annual calendar', items:[['Jun - Jul','Close academic-year data; update registers'],['Aug - Sep','Analyse new rankings; benchmark against peers'],['Oct','Gap list and targets approved'],['Nov - Jan','Fill DCS; cross-check with AISHE / NAAC; submit'],['Feb','Publish submitted data on the website'],['Mar - May','Respond to queries; run improvement actions'],['Every quarter','Review targets and evidence files']]},
    {t:'check', id:'nirf-submit', title:'Submission checklist', items:['Categories selected','Student strength by programme','Faculty PhD and experience proof','Placement and salary evidence','PhD enrolled and awarded','Patents granted and published','Divyang facilities audit','Sanctioned intake letters','Faculty list with IDs','Audited expenditure, 3 years','Higher-studies proof','Sponsored projects and consultancy','Fee reimbursement data','Cross-check with AISHE / NAAC','Data published on website','VC approval']},
    {t:'list', title:'Common pitfalls', items:['Faculty count includes staff who did not teach both semesters','Capital spend includes new buildings, which are excluded','Placement claimed without offer letters','Several spellings of the university name','NIRF and AISHE figures differ','Submitted data not published on the website','Retractions not tracked before submission','Data rushed in the final week']},
    {t:'summary', items:['Ranking, not accreditation: NIRF compares institutions every year.','Five parameters: TLR 30, RP 30, GO 20, OI 10, PR 10 (Colleges differ).','Apply in every category where the university is eligible.','Faculty drive TLR: aim for 1 : 15 and a high PhD share.','Research quality counts: citations and top journals; retractions cost marks.','Outcomes need proof: placement, salary and higher-studies evidence.','One source of truth: NIRF, AISHE, NAAC and NBA data must match.']},
  ]},
]);

group('ranking', 'qs', 'QS', 'World, Asia, Subject and Sustainability rankings', [
  {id:'status', title:'Our status', sample:true, render: qs},
  {id:'glance', title:'QS at a glance', p:'48', blocks:[
    {t:'stats', items:[['2004','First world ranking'],['1,504','Ranked in WUR 2027'],['~8,800','Institutions evaluated'],['52','Indian universities in WUR 2027']]},
    {t:'table', title:'The QS family', head:['Product','What it measures','Usual release'], rows:[['World University Rankings','Flagship global ranking, 9 weighted indicators','June'],['Rankings by Subject','Subject and broad-area tables','March - April'],['Regional rankings','Asia, Latin America, Arab Region, Europe and others','Varies'],['Sustainability Rankings','Environmental, social and governance impact','Nov - Dec'],['QS Stars','Paid audit-based rating, 1 to 5+ stars','On request']], foot:'WUR 2027 was released on 18 June 2026.'},
    {t:'cards', title:'Why QS matters', cols:4, items:[['Global visibility','Students, partners and recruiters abroad'],['Regulatory use','UGC joint / dual degree rules use top-1,000 QS or THE rank'],['Partnerships','Foreign universities shortlist partners by rank'],['Benchmarking','Compare with peers worldwide']]},
    {t:'note', tone:'info', x:'Half of the QS score comes from global reputation surveys, so visibility outside India matters as much as data.'},
  ]},
  {id:'methodology', title:'World ranking method', p:'49-51', blocks:[
    {t:'weights', title:'Nine weighted indicators (WUR 2026-2027)', items:[['Academic Reputation',30],['Citations per Faculty',20],['Employer Reputation',15],['Faculty Student Ratio',10],['Employment Outcomes',5],['International Faculty Ratio',5],['International Student Ratio',5],['International Research Network',5],['Sustainability',5]], foot:'International Student Diversity is published but carries 0% weight.'},
    {t:'stats', items:[['50%','Research & Discovery'],['20%','Employability & Outcomes'],['15%','Global Engagement'],['10%','Learning Experience'],['5%','Sustainability']]},
    {t:'note', tone:'warn', x:'65% of the score (two surveys plus citations) cannot be changed by a data submission. It moves only with sustained research and visibility.'},
    {t:'flow', title:'How a score becomes a rank', items:[['Normalise','Top institution scores 100'],['Weight','Multiply by indicator weights'],['Sum','Overall score'],['Publish','Exact ranks at the top; bands further down']]},
    {t:'table', title:'Indicators in depth', head:['Code','Indicator','What it is','Lever'], rows:[
      ['AR','Academic Reputation','Survey of academics naming the best in their field','Academic contact lists; visible research collaborations abroad'],
      ['CPF','Citations per Faculty','Scopus citations per academic, normalised by area; no self-citations','Fewer, stronger papers; international co-authorship'],
      ['ER','Employer Reputation','Employers naming institutions with the best graduates','Employer contact lists; strong recruiter relationships'],
      ['FSR','Faculty Student Ratio','FTE academic staff relative to students','Report staff correctly as FTE; plan faculty growth'],
      ['EO','Employment Outcomes','Graduate employment rate plus notable alumni','Track graduate employment; record notable alumni'],
      ['IFR','International Faculty Ratio','Share of academic staff who are foreign nationals','Recruit international faculty, incl. visiting where counted'],
      ['ISR','International Student Ratio','Share of students who are foreign nationals','International admissions office; scholarships'],
      ['IRN','International Research Network','Countries with sustained partnerships (3+ joint papers in 5 years)','Long-term joint research in many countries'],
      ['SUS','Sustainability','Score from the QS Sustainability Rankings','Participate; publish ESG evidence']]},
    {t:'table', title:'How the reputation surveys work', head:['','Academic survey','Employer survey'], rows:[['Respondents','Academics worldwide','Employers and recruiters worldwide'],['Question','Best institutions in their field','Institutions producing the best graduates'],['Pooling','Five years; older responses weigh less','Five years'],['Institution input','Can submit academic contacts','Can submit employer contacts']]},
    {t:'cards', title:'What can move fastest', cols:3, items:[['Within 1-2 years','Correct staff and student data; Sustainability evidence; employment tracking'],['Within 3-5 years','International research network; citations; faculty ratio'],['Long term','Academic and employer reputation; international students']]},
  ]},
  {id:'asia', title:'Asia rankings', p:'52', blocks:[
    {t:'weights', title:'Eleven indicators', items:[['Academic Reputation',30],['Employer Reputation',20],['Faculty Student Ratio',10],['International Research Network',10],['Citations per Paper',10],['Papers per Faculty',5],['Staff with PhD',5],['International Faculty Ratio',2.5],['International Student Ratio',2.5],['Inbound Exchange Students',2.5],['Outbound Exchange Students',2.5]], foot:'Weights as listed by a third-party site; confirm with QS’s Asia methodology.'},
    {t:'stats', items:[['294','Indian institutions in QS Asia 2026'],['7','In the Asia top 100'],['66','In the Asia top 500'],['=59','IIT Delhi, best in India']]},
    {t:'note', x:'Indian universities score well on papers per faculty and staff with PhD. Exchange students in both directions are a fast, practical lever.'},
    {t:'table', title:'Asia-specific levers', head:['Indicator','Action','Owner'], rows:[['Staff with PhD','Fund faculty PhDs; prefer PhD holders in hiring','Registrar / Deans'],['Papers per faculty','Steady Scopus output from every school','Research Dean'],['Inbound exchange','Semester programmes for partner students','International Office'],['Outbound exchange','Credit-transfer semesters abroad','International Office']]},
  ]},
  {id:'sustainability', title:'Sustainability rankings', p:'53', blocks:[
    {t:'stats', items:[['2,001','Universities ranked (2026)'],['108','Countries'],['18 Nov 2025','Release of the 2026 edition']]},
    {t:'weights', title:'Categories and weights', items:[['Environmental Education',17,'Environmental 45%'],['Environmental Sustainability',15,'Environmental'],['Environmental Research',13,'Environmental'],['Equality',12,'Social 45%'],['Employability & Opportunities',11,'Social'],['Knowledge Exchange',10,'Social'],['Good Governance',10,'Governance 10%'],['Impact of Education',7,'Social'],['Health & Wellbeing',5,'Social']]},
    {t:'flow', title:'Three-step action plan', items:[['Policy','Sustainability policy and climate action plan'],['Measure','Energy, emissions, waste and water every year'],['Publish','Annual sustainability report on the website']]},
    {t:'note', x:'The same evidence supports NIRF’s SDG category, THE’s Sustainability Impact Ratings and NAAC’s environment metrics.'},
  ]},
  {id:'subjects', title:'Subject rankings', p:'54', blocks:[
    {t:'lead', x:'A university with one strong school can be ranked globally in that subject even if it is not in the world ranking.'},
    {t:'table', title:'Five indicators (weights vary by subject)', head:['Indicator','What it captures'], rows:[['Academic Reputation','Survey responses in that subject'],['Employer Reputation','Employer responses for that subject'],['Citations per Paper','Average Scopus citations in the subject'],['H-index','Productivity and impact of subject publications'],['International Research Network','Partnership breadth']]},
    {t:'cards', title:'Five broad areas', cols:5, items:[['Arts & Humanities'],['Engineering & Technology'],['Life Sciences & Medicine'],['Natural Sciences'],['Social Sciences & Management']]},
    {t:'steps', title:'Choosing subjects to target', items:[['Publication threshold','Each subject needs a minimum number of Scopus papers'],['Strength','Pick subjects with high citations and an active research group'],['Reputation','Pick subjects where the school is known to employers and peers']]},
  ]},
  {id:'india', title:'India in QS', p:'55', blocks:[
    {t:'stats', items:[['52','Indian universities in WUR 2027'],['14','In 2015'],['24','Private universities among the 52'],['4th','Most represented country']]},
    {t:'table', title:'Top Indian institutions, WUR 2027', head:['Institution','Rank'], rows:[['IIT Delhi','118'],['IIT Bombay','134'],['IIT Madras','170'],['IIT Kharagpur','205'],['IISc Bengaluru','=221'],['IIT Kanpur','=221'],['University of Delhi','322'],['IIT Roorkee','335'],['IIT Guwahati','349'],['Anna University','470']]},
    {t:'cards', cols:2, items:[['Strengths','Research impact (11 Indian universities in the global top 100 on research indicators); employer reputation (6 in the top 100)'],['Common gaps','International faculty and students; faculty-student ratio; global academic reputation']]},
    {t:'note', x:'24 private universities are now ranked. Research output and employer links get you in; internationalisation decides how far you climb.'},
  ]},
  {id:'data', title:'Eligibility & data', p:'56', blocks:[
    {t:'list', title:'Basic eligibility for the World ranking', items:['Offers both undergraduate and postgraduate degrees','Teaches in at least two of the five broad faculty areas','Meets a minimum Scopus publication count over five years','Submits institutional data, or QS uses public sources']},
    {t:'timeline', title:'Annual cycle (typical)', items:[['Ongoing','Academic and employer surveys'],['Dec - Feb','QS Hub data window; survey contact lists'],['Feb - Apr','Validation and data queries'],['Mar - Apr','Subject rankings released'],['June','World University Rankings released'],['Oct - Dec','Asia and Sustainability rankings released']]},
    {t:'cards', title:'What you submit in QS Hub', cols:3, items:[['People','Academic staff (FTE), international staff, students, international and exchange students'],['Survey lists','Academics and employers QS may invite'],['Evidence','Sustainability and employment data, with web links']]},
    {t:'note', tone:'warn', x:'Ask Elsevier to merge all affiliation variants into one Scopus institution profile. Missing papers mean missing citations.'},
    {t:'list', title:'Common data errors', items:['Headcount reported instead of FTE','Part-time staff counted as full-time','Nationality missing for staff and students','Figures differ from NIRF / AISHE']},
  ]},
  {id:'strategy', title:'Strategy', p:'57-59', blocks:[
    {t:'cards', title:'Academic reputation', cols:3, items:[['Joint research','With universities in many countries'],['Visiting faculty','Post-docs and visitors from abroad'],['Conferences','Hosted on campus with global speakers'],['Editorial roles','Faculty on international journal boards'],['Global partners','Active MoUs, not paper ones'],['Contact list','Academics who know your work']]},
    {t:'cards', title:'Employer reputation', cols:4, items:[['Recruiters','Long-term national and global relationships'],['Internships','Structured programmes with partners'],['Advisory boards','Industry leaders on school boards'],['Contact list','Employers who hire your graduates']]},
    {t:'note', tone:'warn', x:'Never coach respondents or offer incentives. QS screens survey responses and penalises manipulation.'},
    {t:'table', title:'Research levers', head:['Lever','Action'], rows:[['Scopus profile','One merged institution ID; correct author affiliations'],['Quality','Target Q1 and Q2 journals; fewer low-impact papers'],['Collaboration','International co-authors raise citations and IRN'],['Field balance','QS normalises by faculty area, so every school contributes'],['Open access','Increases reach and citations'],['Integrity','No citation cartels; QS excludes self-citations']]},
    {t:'flow', title:'International Research Network', items:[['Map','Current co-authoring institutions by country'],['Deepen','Turn one-off papers into repeat collaborations'],['Widen','Add partners in new countries']]},
    {t:'table', title:'Internationalisation', head:['Area','Start with','Grow into'], rows:[['International faculty','Visiting and adjunct faculty from partners','Regular foreign faculty in key schools'],['International students','Short-term and exchange students','Full-degree admissions; scholarships'],['Exchange (Asia)','Semester exchange with partners','Credit transfer and dual degrees'],['Research network','Joint papers with partners','Joint labs and funded projects']]},
    {t:'table', title:'Sample targets', head:['Indicator','Now','Year 3','Year 5'], rows:[['International faculty (%)','1%','3%','6%'],['International students (%)','0.5%','2%','4%'],['Inbound exchange students','20','60','150'],['Outbound exchange students','30','80','200']], foot:'Illustrative; set targets from your own baseline.'},
  ]},
  {id:'vs-nirf', title:'QS vs NIRF', p:'60', blocks:[
    {t:'table', head:['Area','QS World','NIRF'], rows:[['Scope','Global (1,504 ranked)','India only'],['Reputation','45% from surveys','10% perception'],['Research','Citations per faculty 20% + IRN 5%','RP 30%'],['Faculty ratio','10%','Part of TLR (30%)'],['Internationalisation','15%','Small part of OI'],['Outcomes','Employment Outcomes 5%','GO 20%'],['Sustainability','5%','Separate SDG category'],['Data','QS Hub + Scopus + surveys','NIRF DCS + external databases']]},
    {t:'table', title:'Same data, different definitions', head:['Item','QS','NIRF'], rows:[['Faculty','FTE and headcount; all academic staff','Faculty who taught both semesters'],['Students','FTE, UG and PG','Sanctioned and enrolled, incl. PhD'],['International','By nationality','Students from other countries (RD)'],['Research','Scopus, five-year window','Scopus / WoS, three-year window']]},
    {t:'note', x:'Faculty and student figures should match across QS, NIRF, AISHE and NAAC, with any difference in definition documented.'},
  ]},
  {id:'cell', title:'QS cell & roadmap', p:'61-62', blocks:[
    {t:'table', title:'QS cell', head:['Role','Owner'], rows:[['Lead','Director IQAC / Rankings'],['Research data','Research Dean: Scopus profile, IRN'],['Students & staff','Registrar, Admissions, International Office'],['Surveys','Corporate Relations (employers), Deans (academics)'],['Sustainability','Estate, Finance, NSS / Green committee']]},
    {t:'timeline', title:'Five-year roadmap', items:[['Year 1','Scopus clean-up; QS Hub registration; Sustainability entry; survey lists'],['Year 2','Asia and Subject rankings; exchange programmes; IRN mapping'],['Year 3','World ranking entry; international faculty; employer engagement'],['Years 4-5','Climb by band: citations, reputation, international students']]},
    {t:'check', id:'qs-submit', title:'Submission checklist', items:['Scopus profile merged','International staff list','Exchange student data','Employer contact list','Sustainability evidence','Staff FTE and headcount','Student and international numbers','Academic contact list','Employment outcome data','Data matched with NIRF / AISHE']},
    {t:'list', title:'Mistakes to avoid', items:['Rushing into the World ranking before the data is ready','Survey lists full of contacts who do not know you','Paper MoUs that produce no exchange or research','No English website content on achievements']},
    {t:'summary', items:['Reputation is half: academic 30% and employer 15% come from global surveys.','Citations per faculty (20%) come from Scopus: one clean institutional profile.','Enter step by step: Sustainability, Asia and Subject before the World ranking.','Asia suits India: PhD staff, papers per faculty and exchange students count.','Internationalise steadily: faculty, students, exchange and research partners.','Never game surveys: build real relationships with academics and employers.','One data, many rankings: QS, NIRF, AISHE and NAAC numbers must agree.']},
  ]},
]);

const SDG_METRICS = [
  ['No Poverty','Research 27% · Students receiving poverty-related aid 27% · University anti-poverty programmes 23% · Community anti-poverty programmes 23%'],
  ['Zero Hunger','Research 27% · Campus food waste 15.4% · Student hunger 19.2% · Graduates in sustainable agriculture 19.2% · National hunger 19.2%'],
  ['Good Health & Well-being','Research 27% · Graduates in health professions 34.6% · Collaborations and health services 38.4%'],
  ['Quality Education','Research 27% · Graduates with teaching qualification 15.4% · Lifelong learning 26.8% · First-generation students 30.8%'],
  ['Gender Equality','Research 27% · First-gen female students 15.4% · Student access 15.4% · Senior female academics 15.4% · Women receiving degrees 11.5% · Women’s progress 15.3%'],
  ['Clean Water & Sanitation','Research 27% · Water consumption 19% · Water care 23% · Water reuse 12% · Water in the community 19%'],
  ['Affordable & Clean Energy','Research 27% · Clean energy measures 23% · Energy use 17% · Energy and the community 23% · Low-carbon energy use 10%'],
  ['Decent Work & Economic Growth','Research 27% · Employment practices 19.6% · Expenditure per employee 15.4% · Work placements 19% · Secure contracts 19%'],
  ['Industry, Innovation & Infrastructure','Research 11.6% · Patents 15.4% · Spin-offs 34.6% · Research income from industry 38.4%'],
  ['Reduced Inequalities','Research 27% · First-generation students 15.5% · Students from developing countries 15.5% · Students and staff with disabilities 23% · Anti-discrimination 19%'],
  ['Sustainable Cities & Communities','Research 27% · Arts and heritage support 22.6% · Arts and heritage expenditure 15.3% · Sustainable practices 35.1%'],
  ['Responsible Consumption & Production','Research 27% · Operational measures 26.7% · Recycled waste 27% · Sustainability report published 19.3%'],
  ['Climate Action','Research 27% · Low-carbon energy use 27% · Environmental education 23% · Carbon neutrality 23%'],
  ['Life Below Water','Research 27% · Aquatic education 15.3% · Supporting aquatic ecosystems 19.4% · Water-sensitive waste disposal 19.3% · Local ecosystem 19%'],
  ['Life on Land','Research 27% · Land ecosystems education 23% · Supporting land ecosystems 27% · Land-sensitive waste disposal 23%'],
  ['Peace, Justice & Strong Institutions','Research 27% · Governance measures 26.6% · Working with government 23.2% · Graduates in law and civil enforcement 23.2%'],
  ['Partnerships for the Goals','Research with lower-income countries 27.1% · Relationships 18.5% · SDG reports 27.2% · Education on the SDGs 27.2%'],
];

group('ranking', 'the', 'THE', 'World, Asia, Subject and Sustainability Impact', [
  {id:'status', title:'Our status', sample:true, render: the},
  {id:'glance', title:'THE at a glance', p:'64', blocks:[
    {t:'stats', items:[['2,297','Universities in WUR 2027'],['143','Indian universities in WUR 2027'],['1,646','In Sustainability Impact Ratings 2026'],['110','Indian universities in that table']]},
    {t:'table', title:'The THE family', head:['Product','What it covers','Usual release'], rows:[['World University Rankings','Flagship; 18 metrics in 5 pillars (WUR 3.0)','Sept - Oct'],['Rankings by Subject','11 subject tables, same pillars re-weighted','Oct - Nov'],['Asia / regional','WUR metrics re-weighted','April - May'],['Young University','Universities aged 50 years or less','May - June'],['Emerging Economies','Universities in emerging economies','Varies'],['Interdisciplinary Science','With Schmidt Science Fellows; 11 metrics','Nov - Dec'],['Reputation Rankings','Academic reputation survey only','Feb - Mar'],['Sustainability Impact Ratings','Formerly Impact Rankings; all 17 SDGs','June']], foot:'WUR 2027 released 30 Sep 2026; Sustainability Impact Ratings 2026 on 24 Jun 2026.'},
    {t:'note', x:'One submission, many tables: World ranking data also feeds Asia, Young, Emerging Economies, Subject and Interdisciplinary rankings.'},
  ]},
  {id:'wur', title:'WUR 3.0 method', p:'65-66', blocks:[
    {t:'stats', items:[['29.5%','Teaching'],['29%','Research environment'],['30%','Research quality'],['7.5%','International outlook'],['4%','Industry']]},
    {t:'weights', title:'17 weighted metrics (2026 edition)', items:[['Teaching reputation',15,'Teaching'],['Student-staff ratio',4.5,'Teaching'],['Doctorate-staff ratio',5.5,'Teaching'],['Doctorate-bachelor ratio',2,'Teaching'],['Institutional income',2.5,'Teaching'],['Research reputation',18,'Research environment'],['Research income',5.5,'Research environment'],['Research productivity',5.5,'Research environment'],['Citation impact',15,'Research quality'],['Research strength',5,'Research quality'],['Research excellence',5,'Research quality'],['Research influence',5,'Research quality'],['International students',2.5,'International outlook'],['International staff',2.5,'International outlook'],['International co-authorship',2.5,'International outlook'],['Industry income',2,'Industry'],['Patents',2,'Industry']], foot:'A “studying abroad” metric is collected but carries 0%.'},
    {t:'note', tone:'info', x:'Reputation weighs 33%: teaching (15%) and research (18%) reputation come from one academic survey with over 108,000 responses pooled over two years.'},
    {t:'table', title:'What to do, pillar by pillar', head:['Pillar','Measures','Levers'], rows:[['Teaching','Reputation, staff ratios, PhDs awarded per staff, income per staff','Grow PhD awards; recruit faculty; report income correctly'],['Research environment','Research reputation, income and papers per staff','Funded projects; steady Scopus output from every school'],['Research quality','Field-weighted citation impact, strength, excellence, influence','Fewer, better papers; collaboration; open access'],['International outlook','International students, staff and co-authored papers','Exchange, foreign faculty, international co-authors'],['Industry','Industry income per staff; patents citing the university','Industry-funded research; applied work that patents cite']]},
    {t:'cards', title:'Research quality: four ways to measure citations', cols:4, items:[['Citation impact · 15%','Field-weighted citations per paper'],['Research strength · 5%','75th percentile of field-weighted impact'],['Research excellence · 5%','Papers in the world’s top 10%'],['Research influence · 5%','Citations from highly cited papers']]},
    {t:'note', tone:'warn', x:'THE has signalled revisions for 2028, including a cap on self-citations. Avoid any reliance on self-citation now.'},
    {t:'table', title:'What you report in the THE Portal', head:['Area','Data'], rows:[['Staff','Academic and research staff; international staff; by subject'],['Students','UG, PG, international and exchange'],['Doctorates','PhDs awarded; bachelor’s degrees awarded'],['Income','Institutional, research and industry income'],['Subjects','Which of the 11 subjects apply']]},
  ]},
  {id:'eligibility', title:'Eligibility & data', p:'67', blocks:[
    {t:'check', id:'the-elig', title:'Seven conditions to be ranked in WUR', items:['More than 1,000 relevant publications over five years and over 100 in any year','Teaches at undergraduate level','No more than 80% of output in one subject area','Submits “overall” numbers for the ranking year','No more than two critical data values missing','At least one subject marked as applicable','Not on THE’s exclusion list']},
    {t:'note', tone:'info', x:'Institutions meeting only some conditions appear as “Reporters”, without a rank. Sustainability Impact Ratings have no research threshold.'},
    {t:'cards', title:'Data sources', cols:3, items:[['THE Portal','Staff, students, PhDs, income, by subject'],['Elsevier','Scopus publications and citations, 5-year window'],['Reputation survey','Academics worldwide, two years pooled']]},
    {t:'list', title:'Things to know', items:['From WUR 2027: individual ranks up to 300, then bands of 25, 50, 100 and 200 (18 bands)','Institutional data refers to two years before the edition (e.g. 2023 data for WUR 2026)','Common errors: income at the wrong exchange rate; headcount instead of FTE; doctorates in the wrong year; staff not split by subject']},
  ]},
  {id:'india', title:'India in THE', p:'68', blocks:[
    {t:'stats', items:[['143','Indian universities in WUR 2027'],['2nd','Most represented, after the US'],['=254','IISc Bengaluru, best in India'],['23rd','LPU in Sustainability Impact Ratings 2026']]},
    {t:'table', title:'Top Indian universities, WUR 2027', head:['Institution','Rank / band'], rows:[['Indian Institute of Science, Bengaluru','=254'],['Saveetha Institute of Medical & Technical Sciences','326-350'],['Shoolini University','451-500'],['Jamia Millia Islamia','501-550'],['KIIT University','501-550'],['IIT Indore · Amrita · Sharda','651-700']]},
    {t:'cards', title:'Should you enter?', cols:2, items:[['Yes, if','1,000+ Scopus papers in 5 years and reliable data'],['Not yet, if','Below the threshold: start with the SDG ratings and Asia data']]},
  ]},
  {id:'other-tables', title:'Asia & other tables', p:'69', blocks:[
    {t:'table', title:'Asia 2026: re-weighted WUR', head:['Pillar','World 2026','Asia 2026'], rows:[['Teaching','29.5%','24.5%'],['Research environment','29%','28%'],['Research quality','30%','30%'],['International outlook','7.5%','7.5%'],['Industry','4%','10%']], foot:'Asia gives industry income and patents 5% each, and lowers teaching reputation to 10%.'},
    {t:'cards', title:'Interdisciplinary Science Rankings 2026', cols:3, items:[['Inputs · 19%','Interdisciplinary and industry research funding'],['Process · 16%','Success measures, facilities, admin support, promotion'],['Outputs · 65%','Publications, utility, quality and reputation']]},
    {t:'cards', title:'Which table suits a private university?', cols:4, items:[['Young University','If 50 years old or younger'],['Asia','Industry weight is higher (10%)'],['Subject','For one or two strong schools'],['SDG ratings','No research threshold to enter']]},
  ]},
  {id:'impact', title:'Sustainability Impact', p:'70', blocks:[
    {t:'lead', x:'Renamed from the Impact Rankings in 2026. Universities are assessed against the 17 SDGs in research, stewardship, outreach and teaching.'},
    {t:'stats', items:[['22%','SDG 17 (mandatory)'],['26%','Best SDG'],['26%','2nd best SDG'],['26%','3rd best SDG']]},
    {t:'html', title:'Overall score calculator', html: sdgCalcHtml()},
    {t:'list', items:['Minimum: SDG 17 plus at least three other SDGs to appear in the overall table','Overall rank uses the average of the last two years’ scores','One overall table plus 17 SDG tables; submit as many SDGs as you like']},
    {t:'table', title:'What changed in 2026', head:['Item','Detail'], rows:[['Name','Impact Rankings → Sustainability Impact Ratings'],['Access','Membership of the Sustainability Impact Network required'],['Fee','£3,500 a year (high / upper-middle income); £1,000 (lower-middle); free (low income)'],['Benefits','Score breakdowns, benchmarking, certification, webinars'],['Method','Unchanged for now; bands may replace exact positions later']]},
    {t:'note', tone:'warn', x:'Data for the 2027 ratings is due by 9 November 2026; results in June 2027. India is currently lower-middle income (fee £1,000); confirm with THE.'},
  ], mount: sdgCalcMount},
  {id:'sdg-metrics', title:'SDG metrics 1-17', p:'71-72', blocks:[
    {t:'lead', x:'Each SDG has a research metric (usually 27%) plus policy, practice and data metrics. Weights within each SDG total 100%.'},
    {t:'html', html:`<div class="sdglist">${SDG_METRICS.map(([n,m],i)=>`<div class="sdgrow"><div class="sdgno ${i===16?'must':''}">${i+1}</div><div><b>${esc(n)}</b>${i===16?' '+pill('Mandatory','bad'):''}<p>${esc(m)}</p></div></div>`).join('')}</div>`, foot:'THE Impact Rankings 2025 methodology; the 2026 ratings keep the same structure.'},
    {t:'cards', title:'SDG 17 in practice', cols:2, items:[['Relationships · 18.5%','Work with government, NGOs and other universities on SDG policy and data'],['SDG reports · 27.2%','A published annual report on the university’s SDG contribution'],['SDG education · 27.2%','SDG courses, electives and community outreach'],['Research · 27.1%','Papers on SDG themes and with lower-income countries']]},
  ]},
  {id:'evidence', title:'Evidence rules & toolkit', p:'73, 77', blocks:[
    {t:'table', title:'How each evidence item is scored', head:['Test','Best','Middle','Lowest'], rows:[['Answers the question','Fully: 1','Partly: 0.5','No: 0'],['Relevance','Specific: 1','General: 0.5','Not relevant: 0'],['Public','Credit for publicly available evidence','','']]},
    {t:'list', title:'Rules to follow', items:['Self-contained: reviewers do not follow links or browse other pages','One document per link','Keep public evidence online until the next data collection','Evidence relates to the data year (e.g. 2024 for the 2026 edition)','An AI model does the first pass; humans check flagged items','Any metric left blank scores zero']},
    {t:'cards', title:'A good evidence item', cols:3, items:[['Title & date','Policy name, approval date, approving body'],['Exact match','Highlights the clause that answers the question'],['Public URL','On the university website, not a shared drive']]},
    {t:'cards', title:'Policies to have on the website', cols:4, items:[['Sustainability policy'],['Climate action / net-zero plan'],['Energy efficiency'],['Water conservation & reuse'],['Waste & recycling'],['Sustainable procurement'],['Anti-discrimination'],['Gender equality & maternity'],['Disability access'],['Anti-poverty / fee support'],['Freedom of speech'],['Ethics & anti-bribery'],['Community engagement'],['Lifelong learning'],['Food security on campus']]},
    {t:'cards', title:'Reports to publish every year', cols:3, items:[['Sustainability report','Energy, water, waste, emissions (SDG 12)'],['SDG report','Contribution to each SDG (SDG 17)'],['Community report','Outreach, health camps, schools']]},
    {t:'steps', title:'Approval workflow', items:[['Draft','SDG champion with the data owner'],['Approve','Competent authority'],['Publish','Dedicated SDG web page with a stable URL'],['Review','Every year before submission']]},
  ]},
  {id:'choose-sdgs', title:'Choosing SDGs', p:'74-75', blocks:[
    {t:'table', title:'Typical fit for a multidisciplinary Indian university', head:['SDG','Evidence sources','Usual fit'], rows:[['SDG 3 Good Health','Pharmacy, nursing, health camps, hospital tie-ups','Strong'],['SDG 4 Quality Education','First-generation students, lifelong learning, teacher training','Strong'],['SDG 5 Gender Equality','Women students, women in senior roles, policies','Strong'],['SDG 9 Industry & Innovation','Patents, spin-offs, industry income','Medium'],['SDG 8 Decent Work','Placements, internships, employment policy','Medium'],['SDG 11 Sustainable Cities','Arts, heritage, sustainable campus','Medium'],['SDG 17 Partnerships','SDG reports, SDG education, partners','Must']]},
    {t:'steps', title:'Four-step selection', items:[['Map','Each school and office to SDGs'],['Score','Yourself on every metric with current evidence'],['Shortlist','6-8 SDGs with the most evidence'],['Submit','All shortlisted SDGs; let the best three count']]},
    {t:'table', title:'Sustainability across rankings', head:['','THE Sustainability Impact','QS Sustainability','NIRF SDG'], rows:[['Basis','17 SDGs: research, stewardship, outreach, teaching','Environmental 45%, social 45%, governance 10%','SDG category (new 2025)'],['Entry','Network membership (fee)','Through QS (feeds 5% of QS World)','Through NIRF DCS'],['Evidence','Uploaded documents + Elsevier data','Data, policies + Scopus','Institutional data'],['Release','June','Nov - Dec','With NIRF results']]},
    {t:'table', title:'Annual sustainability data sheet', head:['Indicator','Unit','Owner'], rows:[['Electricity used, incl. renewable share','kWh, %','Estate'],['Water used and reused','kL, %','Estate'],['Waste generated and recycled','tonnes, %','Estate'],['Carbon emissions (scope 1 and 2)','tCO₂e','Estate / Finance'],['Women in senior roles','%','Registrar'],['First-generation students','%','Admissions'],['Students and staff with disabilities','number','Welfare']]},
    {t:'note', x:'Collect once, use everywhere: one sheet, approved each year, feeds THE, QS, NIRF and NAAC.'},
  ]},
  {id:'strategy', title:'World ranking strategy', p:'76', blocks:[
    {t:'table', head:['Pillar','Quick wins','Structural'], rows:[['Teaching','Report staff, students and income correctly by subject','More PhDs awarded per staff; better staff ratio'],['Research environment','Capture all research income; one Scopus profile','Funded projects; productive researchers in every school'],['Research quality','Remove affiliation errors; open access','Top-10% papers; international collaboration'],['International outlook','Count international staff and students correctly','Exchange and foreign faculty; co-authorship'],['Industry','Record all industry income','Applied research that patents cite']]},
    {t:'note', x:'Research quality and reputation decide about 63% of the world score. Invest in research quality first; good data protects the rest.'},
    {t:'table', title:'Sample five-year targets', head:['Indicator','Now','Year 3','Year 5'], rows:[['Scopus papers per year','600','900','1,300'],['Field-weighted citation impact','0.8','1.0','1.2'],['International co-authored papers','15%','22%','30%'],['PhDs awarded per year','40','70','110'],['Industry income (₹ crore)','2','5','10']], foot:'Illustrative only.'},
  ]},
  {id:'cell', title:'THE cell & checklist', p:'78-79', blocks:[
    {t:'timeline', title:'Annual calendar', items:[['Jan - Mar','WUR data collection in the THE Portal'],['Apr - Jun','Asia and Young rankings; Sustainability Impact Ratings released (June)'],['Jul - Aug','Review SDG scores; plan evidence improvements'],['Sep - Nov','Submit Sustainability Impact data (2027 cycle: by 9 Nov 2026)'],['Sep - Oct','World University Rankings released']]},
    {t:'table', title:'THE cell', head:['Role','Who'], rows:[['Lead','Director IQAC / Rankings'],['SDG champions','One faculty member per SDG'],['Data owners','Registrar, Finance, Research, Estate, Welfare'],['Web team','Publishes evidence pages']]},
    {t:'check', id:'the-submit', title:'Submission checklist', items:['Network membership active','At least 3 other SDGs','SDG 17 evidence complete','One document per link','Evidence public and dated','Data year correct','Portal data matches NIRF / QS','Scopus profile merged']},
    {t:'list', title:'Mistakes to avoid', items:['Late start: evidence written in the final month','Private links: documents on shared drives','Old evidence outside the data year','Missing SDG 17: no overall score without it']},
    {t:'summary', items:['One data collection feeds World, Asia, Young, Subject and Interdisciplinary tables.','WUR 3.0: five pillars, 18 metrics; research quality 30%, reputation 33%.','Eligibility: 1,000+ papers in five years for the world table.','Impact Rankings are now the Sustainability Impact Ratings, with network membership.','Overall SDG score: SDG 17 (22%) plus your best three SDGs (26% each).','Evidence wins: public, dated, self-contained documents.','Act now: 2027 SDG data is due by 9 November 2026.']},
  ]},
]);

/* NIRF estimator: the closed-form sub-parameters from the handbook (pp. 34-37, 39). */
function nirfCalcHtml(){
  const f = (id,l,v) => `<label>${l}<input type="number" id="${id}" value="${v}" min="0" step="any"></label>`;
  return `<div class="calc">${f('nf-n','Students incl. PhD (N)',3000)}${f('nf-f','Faculty who taught both semesters (F)',170)}${f('nf-phd','Faculty with PhD (%)',60)}
    ${f('nf-pass','Passing in stipulated time (%)',70)}${f('nf-pl','Placed (%)',62)}${f('nf-hs','Higher studies (%)',13)}
    ${f('nf-ws','Women students (%)',35)}${f('nf-wf','Women faculty (%)',18)}${f('nf-os','Students from other states (%)',20)}${f('nf-fr','Students from other countries (%)',1)}</div>
    <div class="tbl-wrap"><table class="ht"><thead><tr><th>Sub-parameter</th><th>Calculation</th><th>Marks</th></tr></thead><tbody id="nf-out"></tbody></table></div>`;
}
function nirfCalcMount(){
  const ids = ['nf-n','nf-f','nf-phd','nf-pass','nf-pl','nf-hs','nf-ws','nf-wf','nf-os','nf-fr'];
  const go = () => {
    const [N,F,phd,pass,pl,hs,ws,wf,os,fr] = ids.map(id => +document.getElementById(id).value || 0);
    const r = x => Math.round(x * 100) / 100;
    const rows = [
      ['FSR (30)', `30 × 15 × ${F} ÷ ${N}`, N ? (F/N < 1/50 ? 0 : Math.min(30, 30*15*F/N)) : 0],
      ['FQ (10)', `10 × ${phd} ÷ 95`, Math.min(10, 10*phd/95)],
      ['GUE (15)', `15 × min(${pass} ÷ 80, 1)`, 15*Math.min(pass/80, 1)],
      ['GPH (40)', `40 × (${pl}% + ${hs}%)`, Math.min(40, 40*(pl+hs)/100)],
      ['WD (30)', `15 × ${ws}/50 + 15 × ${wf}/20`, Math.min(15, 15*ws/50) + Math.min(15, 15*wf/20)],
      ['RD (30)', `25 × ${os}% + 5 × ${fr}%`, Math.min(30, 25*os/100 + 5*fr/100)],
    ];
    document.getElementById('nf-out').innerHTML = rows.map(([a,b,c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td><b>${r(c)}</b></td></tr>`).join('');
  };
  ids.forEach(id => document.getElementById(id).oninput = go); go();
}

/* THE Sustainability Impact overall score: 22% SDG 17 + 26% each of the best three others. */
function sdgCalcHtml(){
  return `<div class="calc">${['SDG 17',...Array.from({length:6},(_,i)=>'Other SDG '+(i+1))].map((l,i)=>`<label>${l} score<input type="number" id="sdg-${i}" min="0" max="100" value="${[62,71,58,66,0,0,0][i]}"></label>`).join('')}</div>
    <div id="sdg-out" class="stats"></div>`;
}
function sdgCalcMount(){
  const go = () => {
    const v = Array.from({length:7}, (_,i) => Math.min(100, +document.getElementById('sdg-'+i).value || 0));
    const others = v.slice(1).filter(x => x > 0).sort((a,b) => b-a);
    const best = others.slice(0,3), ok = v[0] > 0 && best.length === 3;
    const score = 0.22*v[0] + best.reduce((a,x) => a + 0.26*x, 0);
    document.getElementById('sdg-out').innerHTML = `<div class="stat"><b>${ok ? score.toFixed(1) : '—'}</b><span>Overall score</span></div>
      <div class="stat"><b>${best.join(' · ') || '—'}</b><span>Best three counted</span></div>
      <div class="stat"><b>${ok ? pill('Eligible','good') : pill('Needs SDG 17 + 3 others','bad')}</b><span>Overall table</span></div>`;
  };
  for (let i = 0; i < 7; i++) document.getElementById('sdg-'+i).oninput = go; go();
}

/* Ratings & certifications (ch. 6). */

/* QS Stars worksheet categories and per-category star thresholds (pp. 83, 85). */
const WS = [['Teaching',150],['Research or Academic development',150],['Global engagement',150],['Employability',150],['Facilities or Online learning',100],['Social or Environmental impact',100],['Good governance',100],['Elective 1',50],['Elective 2',50]];
const STAR_MIN = {150:[15,35,60,85,105], 100:[10,25,40,55,70], 50:[5,15,20,30,35]};

group('ratings', 'overview', 'Overview', 'How ratings differ, what to pursue, and who owns what', [
  {id:'compare', title:'Ratings vs rankings', p:'81', blocks:[
    {t:'lead', x:'Ratings and certifications measure an institution against a fixed standard, not against others. Everyone who meets the standard can earn the same badge.'},
    {t:'table', head:['','Ranking','Rating','Certification'], rows:[['Question','Where do we stand among peers?','How good are we on a scale?','Do our systems meet a standard?'],['Result','Rank or band','Stars, levels or badges','Certificate (yes / no)'],['Examples','NIRF, QS, THE','QS Stars, QS I-GAUGE, IIC, GreenMetric','ISO 21001, 9001, 14001, NABL'],['Who applies','All eligible are assessed','Institution chooses','Institution chooses'],['Cost','Usually free (fee for some)','Fee-based (except IIC)','Certification body / NABL fees']]},
    {t:'table', title:'How ratings support other frameworks', head:['Framework','What ratings contribute'], rows:[['NAAC','Green audits, ISO, IIC and innovation evidence in several metrics'],['NIRF','Innovation category; consultancy income from NABL labs'],['QS rankings','QS Stars data and habits prepare for QS World and Asia'],['THE SDG ratings','Green campus and policy evidence for many SDGs']]},
  ]},
  {id:'choose', title:'Choosing what to pursue', p:'93', blocks:[
    {t:'table', head:['Option','Effort','Cost','Main benefit'], rows:[['IIC stars','Low','Free','Innovation evidence for NIRF and NAAC; MoE visibility'],['UI GreenMetric','Low','Low','Green campus data reused for THE, QS, NAAC'],['ISO 21001 / 9001','Medium','Medium','Documented processes; audit culture'],['ISO 14001 / 50001','Medium','Medium','Environmental and energy savings'],['NABL','High','High','Consultancy revenue; research credibility'],['QS I-GAUGE','Medium','Fee','Indian benchmark and roadmap; marketing'],['QS Stars','High','Fee','International benchmark; prepares for QS rankings']], foot:'Effort and cost are relative guides, not quotes.'},
    {t:'timeline', title:'Suggested sequence', items:[['Year 1','IIC 5 stars; GreenMetric; green and energy audits; ISO 21001 gap analysis'],['Year 2','ISO 21001 and 14001 certification; NABL for one strong lab'],['Year 3','QS I-GAUGE or QS Stars, once data systems are mature']]},
    {t:'steps', title:'Decision questions', items:[['Capability','Does it build real capability, or only a badge?'],['Reuse','Will its evidence be reused in NAAC, NIRF, QS or THE?'],['Value','Is the cost justified by admissions, partnerships or revenue?'],['Ownership','Do we have an owner who will maintain it every year?']]},
    {t:'note', x:'Fewer recognitions, maintained well, are worth more than many that lapse.'},
  ]},
  {id:'cell', title:'Ratings cell & checklist', p:'94-95', blocks:[
    {t:'table', title:'Who owns what', head:['Owner','Responsibility'], rows:[['Director IQAC','Overall coordination; QS Stars and I-GAUGE'],['IIC President / Convenor','IIC calendar, uploads, 5th-star checklist'],['Estate / Green committee','GreenMetric, ISO 14001 / 50001, audits'],['Quality coordinator','ISO 21001 / 9001 documents and internal audits'],['Lab in-charges','NABL quality system and proficiency tests']]},
    {t:'timeline', title:'Yearly rhythm', items:[['Every quarter','IIC activities and uploads; ISO internal checks'],['Mid-year','Green, energy and environment audits'],['Annually','ISO surveillance audit; management review; GreenMetric submission'],['Every 2-3 years','I-GAUGE (2 yrs) or QS Stars re-rating; ISO recertification (3 yrs)']]},
    {t:'check', id:'ratings-cell', items:['IIC calendar planned for all quarters','Green campus data sheet updated','Internal audit and management review done','Rating certificates and logos tracked by expiry date','IIC annual report submitted','ISO documents and records current','NABL proficiency tests on schedule','Evidence shared with NAAC / NIRF teams']},
    {t:'note', tone:'warn', x:'Set reminders six months before any rating or certificate expires. A lapsed certificate cannot be claimed in NAAC or marketing.'},
    {t:'list', title:'Mistakes to avoid', items:['Lapsed badges still shown on the website','ISO documents nobody follows','One-person ownership: knowledge lost when staff move','IIC reports missed at quarter end']},
    {t:'summary', items:['Ratings are absolute: meet the standard and you earn the badge.','QS Stars: seven mandatory categories plus two electives; 5 stars needs 700+ points and prerequisites.','QS I-GAUGE: Indian rating, valid for two years.','IIC stars: plan every quarter; the 5th star needs the checklist.','GreenMetric: six criteria; the same data serves THE, QS and NAAC.','ISO 21001 is the education standard; certificates last three years.','NABL turns strong labs into trusted, revenue-earning services.']},
  ]},
]);

group('ratings', 'qsstars', 'QS Stars', 'Audit-based rating from 1 to 5+ stars', [
  {id:'status', title:'Our rating', sample:true, render: RATINGS.qsstars},
  {id:'structure', title:'Structure', p:'82', blocks:[
    {t:'stats', items:[['900','Mandatory points'],['+100','Two electives'],['1,000','Standard audit total'],['5+','Highest overall rating']]},
    {t:'weights', title:'Seven mandatory categories', unit:' pts', items:[['Teaching',150],['Research / Academic development',150],['Global engagement',150],['Employability',150],['Facilities / Online learning',100],['Social / Environmental impact',100],['Good governance',100]], foot:'Where a slash appears, the institution chooses one of the two.'},
    {t:'cards', title:'Electives (50 points each, pick two)', cols:3, items:[['Programme strength / Specialist programme'],['Arts'],['Innovation & knowledge transfer'],['Entrepreneurship'],['Diversity, equity & inclusion']]},
    {t:'table', title:'What the overall ratings mean', head:['Rating','Description (summary)'], rows:[['5+','Outstanding: world-class in every category'],['5','Highly international, excellent in research and teaching'],['4','Excellent; strong in research and teaching'],['3','Nationally well recognised; may be internationally active'],['1 - 2','Satisfactory; good national standing or developing']]},
    {t:'note', x:'A teaching-focused university can choose Academic development instead of Research, and Online learning instead of Facilities.'},
  ]},
  {id:'levels', title:'Levels & calculator', p:'83', blocks:[
    {t:'table', title:'Overall rating', head:['Rating','Points','Prerequisites (summary)'], rows:[['1','100+','Authority to award recognised degrees; at least one graduating cohort'],['2','250+','As above'],['3','400+','At least 2 stars in two mandatory categories'],['4','550+','At least 3 stars in two mandatory categories; 1% international students (or 85 Global engagement points); 75 academic referees or 2 citations per faculty'],['5','700+','5% international faculty and students; 70 Facilities / Online points; 85 Employability points; 150 referees or 3 citations per faculty'],['5+','900+','5 stars in every category, all 5-star prerequisites, and 105 Research points']], foot:'QS Stars University Methodology v6.0.'},
    {t:'table', title:'Category stars: minimum points', head:['Category size','1★','2★','3★','4★','5★'], rows:[['150-point','15','35','60','85','105'],['100-point','10','25','40','55','70'],['50-point','5','15','20','30','35']]},
    {t:'html', title:'Points-to-rating calculator', html: starsCalcHtml()},
    {t:'note', tone:'warn', x:'Points alone are not enough for 4 or 5 stars. International students and faculty are usually the hardest prerequisites for Indian universities.'},
  ], mount: starsCalcMount},
  {id:'measured', title:'What is measured', p:'84', blocks:[
    {t:'table', head:['Category','Indicators (summary)'], rows:[['Teaching','Student-faculty ratio, retention, completion, satisfaction, further study, library spending'],['Research','Papers per faculty, citations per paper, research funding, academic reputation'],['Academic development','Learning development centre, faculty development, teaching awards, PhD faculty'],['Global engagement','International faculty and students, networks, exchange, support centre'],['Employability','Graduate employment, employer reputation, career services, internships, alumni'],['Facilities','Campus, classroom technology, sports, accommodation, health, clubs'],['Online learning','Online programmes, LMS, engagement and support, completion, staff training'],['Social impact','Community funding, volunteering, scholarships, outreach, local employment'],['Environmental impact','Sustainability staff, carbon and energy metrics, climate plan, policies'],['Good governance','Audited finances, ethics committee, policies, staff satisfaction, published minutes']]},
    {t:'cards', title:'Electives', cols:3, items:[['Innovation','Patents, spin-offs, industry co-publications'],['Entrepreneurship','Start-ups, incubator, founders’ clubs'],['Arts','Events, awards, arts facilities'],['DEI','Under-represented groups, disability support, gender'],['Programme strength','Subject rankings'],['Specialist programme','One programme’s outcomes']]},
    {t:'flow', title:'Audit process', items:[['Contract','QS analyst assigned'],['Data','Submission with evidence'],['Validation','QS checks data and third-party sources'],['Result','Category and overall badges']]},
  ]},
  {id:'readiness', title:'Readiness plan', p:'85', blocks:[
    {t:'lead', x:'Before signing up, self-assess against every category. It shows the likely rating and the gaps to close first.'},
    {t:'html', title:'Self-assessment worksheet', html: worksheetHtml()},
    {t:'cards', title:'Typical choices for an Indian private university', cols:2, items:[['Choose','Academic development (if research is modest), Facilities, Environmental impact'],['Electives','Entrepreneurship and Innovation, where incubation and patents are strong']]},
    {t:'timeline', title:'Six-month preparation', items:[['Month 1','Self-assessment; choose categories and electives'],['Months 2-3','Close quick gaps: policies, published minutes, surveys'],['Months 4-5','Collect data and evidence; internal review'],['Month 6','Sign up and submit to QS']]},
    {t:'note', x:'Category badges help admissions marketing, but treat the QS report mainly as an external audit and improvement roadmap.'},
  ], mount: worksheetMount},
]);

group('ratings', 'igauge', 'QS I-GAUGE', 'Indian rating by QS', [
  {id:'status', title:'Our rating', sample:true, render: RATINGS.igauge},
  {id:'about', title:'How I-GAUGE works', p:'86', blocks:[
    {t:'lead', x:'A rating for Indian universities, colleges and schools, run by a QS subsidiary and supervised by the QS Intelligence Unit in London.'},
    {t:'stats', items:[['6 + 8','Core and advanced criteria'],['2 years','Validity of a rating'],['120+','Points for E-LEAD'],['1 year','E-LEAD validity']]},
    {t:'cards', title:'Criteria areas (examples)', cols:3, items:[['Teaching & learning'],['Employability'],['Research & innovation'],['Social responsibility'],['Competency development'],['Internationalisation']]},
    {t:'steps', title:'Process', items:[['Sign-up','Agreement; Bangalore-based analyst assigned'],['Data submission','Six-week window (can be extended)'],['Verification','About eight weeks; evidence requested'],['Interim report','Chance to submit missing data'],['Result','Overall and criteria badges, certificate and roadmap']]},
    {t:'note', tone:'info', x:'Badges range from Bronze to Platinum+; many universities also report “Diamond”. E-LEAD certifies online-education readiness and does not give an I-GAUGE rating.'},
    {t:'table', title:'I-GAUGE or QS Stars?', head:['','QS I-GAUGE','QS Stars'], rows:[['Benchmark','Indian institutions','Global institutions'],['Prerequisites','Indian context','International ratios needed for 4-5 stars'],['Best for','Admissions and national visibility','International partnerships and QS ranking preparation']]},
  ]},
]);

group('ratings', 'iic', 'IIC', 'MoE Innovation Cell star rating', [
  {id:'status', title:'Our rating', sample:true, render: RATINGS.iic},
  {id:'about', title:'How IIC is rated', p:'87', blocks:[
    {t:'stats', items:[['14,000+','Institutions with an IIC'],['4','Quarters in the IIC year'],['1 - 5','Star scale'],['6 Oct 2026','IIC 7.0 ratings announced']]},
    {t:'weights', title:'How the rating has been built', items:[['IIC annual calendar plan',50,'Activities from the MIC calendar, spread across quarters'],['Self-driven activities',30,'Activities the IIC designs itself'],['MIC-driven activities',20,'Activities announced by MIC during the year']], foot:'Weights and the 5th-star checklist change between cycles; follow iic.mic.gov.in.'},
    {t:'note', tone:'info', x:'A score out of 100 gives up to 4 stars; the 5th star comes from a checklist.'},
    {t:'check', id:'iic-5th', title:'5th-star checklist (examples)', items:['Annual report submitted','Innovation Ambassador training','Teams in national contests','NISP adopted','NIRF Innovation participation']},
    {t:'cards', title:'Getting to 5 stars', cols:3, items:[['Plan','Every quarter against the MIC calendar'],['Upload','Reports with photos and attendance on time'],['Ambassadors','Train faculty as Innovation Ambassadors'],['Policy','Adopt the National Innovation and Start-up Policy'],['Contests','Send teams to national challenges'],['Link','Connect with pre-incubation and incubation']]},
    {t:'note', x:'The former ARIIA is now NIRF’s Innovation category. IIC evidence supports it directly.'},
  ]},
]);

group('ratings', 'greenmetric', 'GreenMetric', 'UI GreenMetric green campus ranking', [
  {id:'status', title:'Our standing', sample:true, render: RATINGS.greenmetric},
  {id:'about', title:'Criteria & quick wins', p:'88', blocks:[
    {t:'lead', x:'Run by Universitas Indonesia since 2010; ranks universities on campus sustainability. Self-reported with evidence, once a year.'},
    {t:'weights', title:'Six criteria, 39 indicators', items:[['Energy & Climate Change',21,'8 indicators'],['Waste',18,'6 indicators'],['Transportation',18,'8 indicators'],['Education & Research',18,'7 indicators'],['Setting & Infrastructure',15,'6 indicators'],['Water',10,'4 indicators']]},
    {t:'table', title:'What to measure on campus', head:['Criterion','Examples of indicators'], rows:[['Setting','Open space, forest and planted area, campus population'],['Energy','Efficient appliances, renewable energy, smart buildings, emissions'],['Waste','Recycling, paper and plastic reduction, organic and toxic waste, sewage'],['Water','Conservation, recycling, efficient appliances, treated water'],['Transport','Vehicles on campus, shuttles, zero-emission vehicles, pedestrian paths'],['Education','Sustainability courses, research, events, student groups, reports']]},
    {t:'cards', title:'Quick wins', cols:4, items:[['Solar','Rooftop solar and LED retrofit'],['Water','Rainwater harvesting and STP reuse'],['Waste','Segregation, composting, e-waste tie-up'],['Mobility','E-shuttles and walkable zones']]},
    {t:'note', x:'The same data supports THE SDG 6, 7, 12 and 13, QS Sustainability and NAAC green-audit metrics.'},
  ]},
]);

group('ratings', 'iso', 'ISO', 'Management-system certifications', [
  {id:'status', title:'Our certificates', sample:true, render: RATINGS.iso},
  {id:'standards', title:'Standards for universities', p:'89', blocks:[
    {t:'lead', x:'A certification body audits the institution; certificates usually last three years, with surveillance audits every year.'},
    {t:'table', head:['Standard','System','Best fit in a university'], rows:[['ISO 21001:2018','Educational Organisations Management','Whole university: teaching, learning, learner satisfaction'],['ISO 9001:2015','Quality Management','Administration, examinations, admissions, finance'],['ISO 14001:2015','Environmental Management','Campus environment, waste, compliance'],['ISO 45001:2018','Occupational Health & Safety','Labs, workshops, hostels, construction'],['ISO 50001:2018','Energy Management','Energy planning and savings'],['ISO/IEC 27001:2022','Information Security','ERP, exam data, student records, IT'],['ISO 41001:2018','Facility Management','Estate and campus services'],['ISO 22000:2018','Food Safety Management','Mess, canteens, kitchens']]},
    {t:'flow', title:'Certification cycle', items:[['Gap analysis','Compare practice with the standard'],['Implement','Policies, procedures, records, training'],['Audit','Internal audit, management review, Stage 1 and 2'],['Maintain','Yearly surveillance; recertify in year 3']]},
    {t:'note', tone:'info', x:'Use a certification body accredited by NABCB (India) or another IAF member, so the certificate is recognised.'},
    {t:'note', x:'ISO 21001, 14001, 45001 and 50001 share a clause structure and can run as one integrated system with combined audits.'},
  ]},
  {id:'21001', title:'ISO 21001 for education', p:'90', blocks:[
    {t:'lead', x:'The management-system standard written for education. It builds on ISO 9001 but focuses on learners, and fits naturally with NAAC and NBA.'},
    {t:'cards', title:'Eleven principles', cols:4, items:[['1','Focus on learners and beneficiaries'],['2','Visionary leadership'],['3','Engagement of people'],['4','Process approach'],['5','Improvement'],['6','Evidence-based decisions'],['7','Relationship management'],['8','Social responsibility'],['9','Accessibility and equity'],['10','Ethical conduct in education'],['11','Data security and protection']]},
    {t:'table', title:'Clause structure', head:['Clause','Title','University examples'], rows:[['4','Context','Interested parties, scope of the system'],['5','Leadership','Policy, roles, learner focus'],['6','Planning','Risks, opportunities, objectives'],['7','Support','Resources, competence, communication, documents'],['8','Operation','Curriculum design, delivery, assessment, learner support'],['9','Evaluation','Monitoring, satisfaction, internal audit, management review'],['10','Improvement','Nonconformity, corrective action, continual improvement']]},
    {t:'note', x:'Clause 8 (curriculum, assessment) and clause 9 (feedback, audit) map closely to OBE, IQAC audits and the Academic and Administrative Audit.'},
  ]},
]);

group('ratings', 'nabl', 'NABL', 'Laboratory accreditation', [
  {id:'about', title:'NABL accreditation', p:'91', blocks:[
    {t:'lead', x:'NABL, a board of the Quality Council of India, accredits laboratories against international standards. It is an ILAC and APAC signatory.'},
    {t:'table', head:['Standard','For','University use'], rows:[['ISO/IEC 17025','Testing and calibration laboratories','Materials, civil, electrical, chemical, food and pharma labs'],['ISO 15189','Medical laboratories','Pathology and diagnostic labs in teaching hospitals'],['ISO/IEC 17043','Proficiency testing providers','Specialist research centres'],['ISO 17034','Reference material producers','Specialist research centres']]},
    {t:'flow', title:'Steps to accreditation', items:[['Prepare','Quality manual, procedures, trained staff'],['Validate','Method validation, calibration, uncertainty'],['PT','Proficiency testing / inter-lab comparison'],['Apply','Online application; document review'],['Assess','On-site assessment; committee decision']]},
    {t:'cards', title:'Why it matters for a university', cols:4, items:[['Revenue','Accredited test reports earn consultancy income (NIRF FPPP)'],['Credibility','Results accepted by industry and regulators'],['Research quality','Traceable, reliable data'],['Industry links','Testing services build partnerships']]},
    {t:'check', id:'nabl-lab', title:'Lab readiness checklist', items:['Quality manual and procedures approved','Calibrated equipment with traceable certificates','Trained staff with authorisation records','Temperature and humidity controls logged']},
  ]},
]);

group('ratings', 'other', 'Others', 'Audits, green buildings, SIRO and more', [
  {id:'about', title:'Other recognitions', p:'92', blocks:[
    {t:'table', head:['Recognition','What it is','Owner'], rows:[['GRIHA / IGBC','Green building rating for campus buildings','Estate'],['Green, energy & environment audits','Required as evidence by NAAC; qualified auditors','Estate / IQAC'],['Accessibility audit','Barrier-free campus check for divyang users','Estate / Welfare'],['Academic & Administrative Audit','Internal or external review of departments','IQAC'],['DSIR SIRO','Scientific and Industrial Research Organisation status','Research Dean'],['NABH','Hospital accreditation for teaching hospitals','Medical school'],['State rankings','State ranking frameworks where they exist','IQAC']]},
    {t:'note', tone:'warn', x:'Be selective: pursue recognitions that build capability or open doors. Avoid paid “awards” with no audit or method.'},
    {t:'table', title:'Recognition register (example entries)', head:['Recognition','Status','Since','Valid / renew'], rows:[['IIC rating','4 ★','2026','Annual'],['ISO 21001','Certified','2025','2028'],['GreenMetric','Rank / score','2025','Annual'],['NABL (Materials lab)','Accredited','2026','As per NABL']]},
    {t:'cards', title:'Communicating recognitions', cols:4, items:[['Website','One page listing all current recognitions'],['Prospectus','Cite the year and issuing body'],['Logos','Use only as licensed and while valid'],['NAAC / NIRF','Keep certificates in the evidence bank']]},
  ]},
]);

/* QS Stars: points + prerequisites → overall rating (p. 83). */
function starsCalcHtml(){
  return `<div class="calc"><label>Total points (of 1,000)<input type="number" id="qs-pts" value="590" min="0" max="1000"></label>
    <label>International students (%)<input type="number" id="qs-isr" value="0.5" step="0.1" min="0"></label>
    <label>Global engagement points (of 150)<input type="number" id="qs-ge" value="70" min="0" max="150"></label>
    <label>International faculty (%)<input type="number" id="qs-ifr" value="1" step="0.1" min="0"></label></div><div id="qs-out" class="stats"></div>`;
}
function starsCalcMount(){
  const ids = ['qs-pts','qs-isr','qs-ge','qs-ifr'];
  const go = () => {
    const [pts,isr,ge,ifr] = ids.map(id => +document.getElementById(id).value || 0);
    const byPts = pts >= 900 ? 6 : pts >= 700 ? 5 : pts >= 550 ? 4 : pts >= 400 ? 3 : pts >= 250 ? 2 : pts >= 100 ? 1 : 0;
    let r = Math.min(byPts, 5), why = 'Points threshold';
    if (r >= 5 && (isr < 5 || ifr < 5)) { r = 4; why = '5★ needs 5% international faculty and students'; }
    if (r >= 4 && !(isr >= 1 || ge >= 85)) { r = 3; why = '4★ needs 1% international students or 85 Global engagement points'; }
    document.getElementById('qs-out').innerHTML = `<div class="stat"><b>${byPts >= 6 ? '5+' : byPts} ★</b><span>By points alone</span></div>
      <div class="stat"><b>${r} ★</b><span>Likely rating</span></div><div class="stat"><b style="font-size:15px">${r < Math.min(byPts,5) ? why : 'Prerequisites met (other gates not checked)'}</b><span>Limiting factor</span></div>`;
  };
  ids.forEach(id => document.getElementById(id).oninput = go); go();
}

/* QS Stars self-assessment worksheet (p. 85): estimated points per category → stars. */
function worksheetHtml(){
  return `<div class="tbl-wrap"><table class="ht"><thead><tr><th>Category</th><th>Max</th><th>Estimated</th><th>Stars</th></tr></thead><tbody>${WS.map(([n,m],i)=>`<tr><td><b>${n}</b></td><td>${m}</td>
    <td><input class="ws" type="number" id="ws-${i}" min="0" max="${m}" value="${Math.round(m*0.6)}"></td><td id="ws-s-${i}"></td></tr>`).join('')}
    <tr><td><b>Total</b></td><td>1,000</td><td id="ws-tot"></td><td></td></tr></tbody></table></div>`;
}
function worksheetMount(){
  const go = () => {
    let tot = 0;
    WS.forEach(([n,m],i) => { const x = Math.min(m, +document.getElementById('ws-'+i).value || 0); tot += x;
      const s = STAR_MIN[m].filter(t => x >= t).length; document.getElementById('ws-s-'+i).innerHTML = stars(s); });
    document.getElementById('ws-tot').innerHTML = `<b>${tot}</b>`;
  };
  WS.forEach((_,i) => document.getElementById('ws-'+i).oninput = go); go();
}

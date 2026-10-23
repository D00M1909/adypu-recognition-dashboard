/* Awards & recognition (ch. 8). */

group('awards', 'overview', 'Overview', 'The awards landscape, credibility and the awards cell', [
  {id:'register', title:'Institution awards', sample:true, render: () => awards('institution')},
  {id:'landscape', title:'The awards landscape', p:'112', blocks:[
    {t:'table', title:'Seven groups of awards', head:['Group','Examples','Who is recognised'], rows:[['Global impact','WURI (innovative, real-world impact programmes)','Institution'],['Media surveys','India Today-MDRA, THE WEEK-Hansa, Outlook-ICARE, Times Engineering Survey','Institution / programme'],['Industry bodies','FICCI, CII, ASSOCHAM, IDA and others','Institution'],['Government & AICTE','AICTE Lilavati, Chhatra Vishwakarma, Clean & Smart Campus; MoE awards','Institution / students'],['Professional societies','IEEE, IETE, CSI, IE(I), ISTE, SAE India and others','Chapters, faculty, students'],['Faculty honours','National science awards, academy fellowships, best-teacher awards','Individual'],['Student honours','Hackathons, competitions, fellowships, sports, NSS / NCC','Individual / team']]},
    {t:'cards', title:'Why awards matter', cols:4, items:[['Perception','Feeds NIRF PR, QS and THE reputation surveys'],['Admissions','Media rankings influence parents and students'],['NAAC evidence','Awards to institution, faculty and students are metrics'],['Morale','Recognition motivates faculty and students']]},
    {t:'table', title:'Rankings, ratings and awards', head:['Ranking','Rating','Award'], bold:false, rows:[['Relative position against peers','Score against a fixed standard','Recognition of a specific achievement, often by a jury']]},
    {t:'note', x:'Prefer awards with a published method, independent jury or verified data. Avoid “pay-to-win” awards.'},
  ]},
  {id:'credibility', title:'Is this award worth it?', p:'124', blocks:[
    {t:'lead', x:'Many “awards” are commercial events where recognition is linked to a fee or sponsorship. They can harm credibility with peers, regulators and accreditors.'},
    {t:'dodont', do:['Published method and criteria','Independent jury or verified data','No fee to be considered','Limited winners per category','Known organiser with a track record','Respected by peers and regulators'], dont:['No method, or vague criteria','Jury not named; no data asked','Fee, “package” or sponsorship to receive the award','Many winners; everyone who pays wins','New or unknown organiser','Not cited by any credible body']},
    {t:'check', id:'award-5q', title:'Five questions before accepting', items:['Who organises it, and what is their track record?','How were we selected, and by whom?','Is any payment linked to the award?','Would we be proud to show this to NAAC peer reviewers?','Does it add anything our existing recognitions do not?']},
    {t:'table', title:'Decision record (examples)', head:['Invitation','Check','Decision'], rows:[['“Best University Award 2026”','Fee asked','Declined'],['FICCI Higher Education Excellence Award','No fee to nominate','Nominated'],['IEEE Region 10 award','Society process','Nominated']]},
    {t:'note', tone:'warn', x:'Adopt a written awards policy approved by the Board: the institution does not pay to receive awards, and the IQAC checks every invitation.'},
  ]},
  {id:'cell', title:'Awards cell & calendar', p:'125', blocks:[
    {t:'table', title:'Awards cell', head:['Role','Who'], rows:[['Chair','Pro-Vice-Chancellor or Dean (Academics)'],['Coordinator','IQAC / rankings office'],['Faculty nodal officers','One per school: faculty and student nominations'],['Student affairs','Sports, cultural, NSS, NCC awards'],['Corporate relations','Industry awards and partner nominations'],['Communications','Announcements and media']]},
    {t:'timeline', title:'Annual calendar (typical)', items:[['Apr - Jun','India Today, THE WEEK, Outlook data; WURI submissions'],['Jul - Sep','Teachers’ awards; AICTE schemes; FICCI / CII nominations'],['Oct - Dec','FICCI summit; academy fellowships; SIH'],['Jan - Mar','Society awards; state awards; annual register update']]},
    {t:'check', id:'awards-cell', items:['Monthly scan of open calls','Standard dossier template','Student awards register by level','Results announced with year and source','Awards policy approved','Faculty achievement profiles updated','Certificates stored with proof','Register shared with NAAC / NIRF teams']},
    {t:'note', x:'Measure the cell: nominations filed, awards won, and share of schools with at least one national award each year.'},
  ]},
  {id:'using', title:'Recording & using awards', p:'126-127', blocks:[
    {t:'table', title:'Where awards count', head:['Use','How'], rows:[['NAAC','Awards to institution, teachers and students; extension and sports metrics'],['NIRF','Perception; innovation category; outcomes'],['QS / THE','Reputation through visibility; employer links'],['Admissions','Prospectus, website, social media'],['Staff appraisal','Faculty awards in performance and promotion']]},
    {t:'cards', title:'Communicating awards', cols:4, items:[['Accurate','Name the award, organiser and year'],['Timely','Announce within a week'],['Shared','Website, newsletter, social media, alumni'],['Durable','“Achievements” page updated every semester']]},
    {t:'note', x:'One source of truth: the same awards register feeds NAAC, NIRF, media surveys and the annual report, so figures always match.'},
    {t:'summary', items:['Seven groups: global, media, industry, government, societies, faculty, students.','WURI rewards innovative programmes with real impact.','Media surveys mix facts and perception; submit consistent, provable data.','FICCI and CII recognise employment, research, global and industry links.','Professional chapters bring competitions, awards and visibility.','Nominate proactively: a standard dossier and a monthly scan of calls.','Credibility first: never pay to receive an award; record every genuine one.']},
  ]},
]);

group('awards', 'media', 'WURI & media', 'Impact ranking and media surveys', [
  {id:'wuri', title:'WURI', p:'113', blocks:[
    {t:'lead', x:'World’s Universities with Real Impact ranks universities on innovative programmes that create real impact, from submitted case studies.'},
    {t:'stats', items:[['16','Categories (2025)'],['3','Criteria per programme'],['Top 400','Global list, 2025'],['2020','First results year']]},
    {t:'table', title:'Sixteen categories in eight groups', head:['Group','Categories'], rows:[['Students','Student support & engagement · Student mobility & openness'],['Industry','Industrial application · Entrepreneurial spirit'],['Society','Crisis management · Ethics & integrity'],['Global community','Technology development & application · SDG-based responses'],['Leadership','Visionary leadership · Empowerment-based management (new)'],['Environment','ESG trend (new) · Culture / values'],['Resources','Funding for sustainability · Infrastructure / technologies'],['Mechanism','Cost-effectiveness management (new) · Brand and reputation']]},
    {t:'cards', title:'How each programme is judged', cols:3, items:[['Innovativeness','How new the content or process is'],['Implementability','Feasibility, costs and benefits'],['Impact','Scope and intensity across the university']]},
    {t:'list', title:'Preparing a submission', items:['Pick programmes with clear, measurable impact','One page each: problem, innovation, implementation, results','Evidence: numbers, photos, partner letters','Map each programme to the best-fit category']},
  ]},
  {id:'media', title:'Media rankings', p:'114-115', blocks:[
    {t:'cards', title:'India Today - MDRA', cols:3, items:[['Intake quality & governance'],['Academic excellence'],['Infrastructure & living experience'],['Personality & leadership development'],['Placement & career progression'],['Perception survey component']]},
    {t:'table', title:'THE WEEK - Hansa Research (2026)', head:['Item','Detail'], rows:[['Perceptual score','400 marks: experts nominate and rank top institutions'],['Factual score','600 marks: age and accreditation, infrastructure, faculty, research, intake and exposure'],['Eligibility','UGC-recognised; full-time PG in 2+ disciplines; 3+ graduated batches'],['Lists','Multidisciplinary, technical, medical; zone, private / deemed, government, emerging, state-wise']]},
    {t:'weights', title:'Outlook - ICARE (State Private Universities 2026)', unit:' marks', items:[['Academic & research excellence',400],['Industry interface & placement',200],['Infrastructure & facilities',150],['Governance & extension',150],['Diversity & outreach',100]]},
    {t:'table', title:'Other media surveys', head:['Survey','What it is','Stream'], rows:[['Times Engineering Survey','Top 175 engineering institutes; private, emerging and regional lists','Engineering'],['Times / Education Times awards','Education excellence awards and features','Various'],['Business Today - MDRA','Best B-schools survey','Management'],['Education World','India Higher Education Rankings','Universities, colleges'],['Careers360','Rankings and ratings by discipline','Many'],['Dataquest','T-School survey','Engineering / IT'],['The Week - Hansa (B-schools)','Best B-schools survey','Management']]},
    {t:'flow', title:'How media surveys usually work', items:[['Data form','Institution submits facts with proof'],['Perception','Survey of academics, recruiters, students or parents'],['Score','Factual + perceptual, often out of 1,000']]},
    {t:'note', x:'Many media surveys give 30-40% weight to perception. Submit the same data as NIRF and AISHE, with proof, and track deadlines in one calendar.'},
  ]},
]);

group('awards', 'industry', 'Industry & government', 'FICCI, CII, AICTE and government awards', [
  {id:'industry', title:'Industry body awards', p:'116', blocks:[
    {t:'cards', title:'FICCI Higher Education Excellence Awards (2023 categories)', cols:3, items:[['Employment creation excellence'],['Globalisation excellence'],['Research, innovation & entrepreneurship'],['Institutional social responsibility'],['University of the Year (Emerging)'],['University of the Year (Established)'],['Lifetime Achievement']]},
    {t:'cards', cols:1, items:[['CII Industry-Academia Partnership Award','Recognises sustained industry-academia collaboration, in tiers (e.g. Diamond in 2025). Evidence: joint projects, industry-funded labs, internships, curriculum co-design, placements.']]},
    {t:'table', title:'Other industry and sector bodies', head:['Body','Recognition'], rows:[['ASSOCHAM','Education excellence awards and summits'],['PHDCCI','Education and skill awards'],['IDA','India Didactics Association awards and DIDAC India'],['NASSCOM','Industry-academia talent initiatives'],['AIMA','Management education recognition']]},
    {t:'table', title:'Building an award-winning case', head:['Category','Evidence to prepare'], rows:[['Employment','Placement rate, salary growth, recruiter diversity, start-ups'],['Global','Exchange, international students and faculty, joint degrees'],['Research','Funding, patents, products, industry projects'],['Social','Community projects, villages adopted, outreach numbers']]},
    {t:'note', x:'Prepare a two-page institutional “achievement brief” every year; it can be adapted to most industry-body nominations.'},
  ]},
  {id:'government', title:'AICTE & government', p:'117', blocks:[
    {t:'table', title:'AICTE schemes and awards', head:['Award / scheme','Recognises','Who'], rows:[['Lilavati Award','Efforts towards women’s empowerment and gender equity','Institution'],['Chhatra Vishwakarma Award','Student teams solving community problems with engineering','Students'],['Clean & Smart Campus Award','Clean, green and smart campus practices','Institution'],['Smart India Hackathon','National hackathon on ministry and industry problems','Students'],['Toycathon / YUKTI','Innovation challenges with MIC','Students, faculty'],['Productization Fellowship','Turning prototypes into products','Innovators'],['IIC star rating','Innovation council rating','Institution']]},
    {t:'table', title:'Government awards', head:['Award','Notes'], rows:[['National Teachers’ Award','Ministry of Education; higher education included since 2023'],['NSS Awards','Best NSS units, programme officers and volunteers'],['NCC recognitions','Best cadets and units at national level'],['Khelo India University Games','National university sports competition'],['State awards','Best institution and teacher awards']]},
    {t:'note', tone:'info', x:'Government and AICTE awards to the institution, teachers and students count as NAAC evidence of quality and extension activities.'},
  ]},
]);

group('awards', 'societies', 'Societies', 'Professional societies and chapters', [
  {id:'engineering', title:'Engineering & IT', p:'118', blocks:[
    {t:'table', head:['Society','Recognition'], rows:[['IEEE','Student branch awards, Region 10 awards, Senior Member and Fellow grades'],['IETE','Fellowship, named awards, IETE Students’ Forum recognition'],['CSI','Best student branch, best branch counsellor, awards and fellowship'],['IE(I)','Young Engineers Award, Eminent Engineer, student chapter recognition'],['ISTE','Best college / polytechnic, best teacher, best student chapter']]},
    {t:'cards', title:'Making a chapter award-ready', cols:4, items:[['Membership','Steady student and faculty growth'],['Activities','Regular events with reports and photos'],['Competitions','National and regional events'],['Reporting','Annual reports on time']]},
    {t:'cards', title:'Faculty role', cols:2, items:[['Counsellor','A faculty advisor for each chapter'],['Credit','Recognise chapter work in appraisal']]},
  ]},
  {id:'others', title:'Other disciplines', p:'119', blocks:[
    {t:'table', head:['Body','Field','Recognition'], rows:[['SAE India','Mobility engineering','BAJA, SUPRA, Efficycle'],['ASME','Mechanical engineering','Student sections, E-Fest, design challenges'],['ACM / ICPC','Computing','Student chapters; ICPC programming contest'],['IIChE','Chemical engineering','Student chapters, awards, Chemcon'],['ICI / IGBC','Civil, concrete, green building','Student chapters, project and green-campus awards'],['ISA / IEI divisions','Automation, specialised','Student sections, paper awards'],['AIMA / NHRD','Management','Management games, HR and leadership awards'],['ICAI / ICSI / ICMAI','Commerce and accounting','Student chapters, toppers’ recognition'],['APTI / IPA','Pharmacy','Best teacher, student awards, poster competitions'],['Bar Council / moot courts','Law','National moot court competitions']]},
    {t:'cards', title:'Map societies to schools', cols:3, items:[['Engineering','IEEE, IETE, CSI, IE(I), ISTE, SAE India, ASME, ACM'],['Management & commerce','AIMA, NHRD, ICAI, ICSI, ICMAI'],['Pharmacy, law, design','APTI, IPA, moot courts, design councils']]},
  ]},
]);

group('awards', 'faculty', 'Faculty', 'Faculty honours and nominations', [
  {id:'register', title:'Faculty awards', sample:true, render: () => awards('faculty')},
  {id:'honours', title:'Faculty honours', p:'120', blocks:[
    {t:'table', head:['Category','Examples'], rows:[['Rashtriya Vigyan Puraskar','Vigyan Ratna, Vigyan Shri, Vigyan Yuva-Shanti Swarup Bhatnagar, Vigyan Team (since 2023)'],['Academy fellowships','INSA, IASc, NASI (science); INAE (engineering); NAMS (medicine)'],['National Teachers’ Award','Ministry of Education; includes higher education'],['AICTE / ISTE teacher awards','Best teacher and young teacher awards'],['Professional society honours','IEEE Fellow, IETE / IE(I) / CSI fellowships and named awards'],['Research recognition','Highly cited lists; Stanford-Elsevier top 2% scientists'],['Funding as recognition','ANRF (formerly SERB) and DST schemes, INSPIRE Faculty, Fulbright, Newton, DAAD'],['Patents & innovation','National IP awards; start-up and technology transfer awards']]},
    {t:'cards', title:'What makes a strong nominee', cols:4, items:[['Sustained output','Research, patents, projects over years'],['Impact','Citations, products, policy, community'],['Teaching','Innovation, student outcomes, feedback'],['Service','Leadership in societies and institution']]},
    {t:'table', title:'Award pipeline by career stage', head:['Stage','Typical targets'], rows:[['Early career','Young scientist / teacher awards; society young-engineer awards; INSPIRE'],['Mid career','Vigyan Yuva; society fellowships; best-teacher awards'],['Senior','Academy fellowships; Vigyan Shri; lifetime awards']]},
    {t:'note', x:'Most faculty awards need the institution to nominate or endorse. A proactive awards cell makes sure good candidates are not missed.'},
  ]},
  {id:'dossier', title:'Nomination dossier', p:'121', blocks:[
    {t:'steps', title:'Standard dossier format', items:[['Summary','Half-page citation: what the nominee achieved and why it matters'],['Profile','Qualifications, positions, key roles'],['Achievements','Research, patents, projects, products, teaching innovations'],['Impact evidence','Citations, users, revenue, policy change, student outcomes'],['Recognition so far','Earlier awards and fellowships'],['Letters','Endorsement from head of institution; referee letters'],['Annexures','Certificates, papers, photos, media coverage']]},
    {t:'flow', title:'Internal process', items:[['Scan','Awards cell lists open calls monthly'],['Shortlist','Deans propose names'],['Prepare','Dossier with the nominee'],['Approve','Head of institution signs']]},
    {t:'dodont', title:'Citation writing', do:['Specific numbers and outcomes','Plain language for a mixed jury','Impact on people and society','One clear headline achievement'], dont:['Long lists of duties','Jargon and acronyms','Only inputs (courses taught, paper counts)','Many small items with equal weight']},
    {t:'note', x:'Keep an updated “achievement profile” for every faculty member in the ERP, so dossiers take days, not weeks. Log every nomination and result.'},
  ]},
]);

group('awards', 'students', 'Students', 'Student awards and competitions', [
  {id:'register', title:'Student awards', sample:true, render: () => awards('student')},
  {id:'areas', title:'Student awards & competitions', p:'122', blocks:[
    {t:'table', head:['Area','Examples'], rows:[['Innovation','Smart India Hackathon, Toycathon, YUKTI, Chhatra Vishwakarma, start-up challenges'],['Technical competitions','SAE BAJA / SUPRA, robotics (e.g. Robocon), ICPC, IEEE and CSI contests'],['Research','Paper and poster awards; PMRF for PhD'],['International fellowships','Fulbright, Chevening, Commonwealth, DAAD, Rhodes'],['Exams','GATE, CAT, GRE, GMAT, UPSC and other top scores'],['Sports','Khelo India University Games, AIU inter-university events'],['NSS / NCC','National awards, Republic Day parade contingents'],['Cultural','AIU youth festivals, national cultural competitions'],['Professional','Society scholarships and student awards']]},
    {t:'cards', title:'Why it matters', cols:4, items:[['NAAC','Student awards in sports, cultural and other activities are metrics'],['NIRF','Perception, outcomes and higher studies'],['Admissions','Stories that attract applicants'],['Employability','Proof of skills for recruiters']]},
    {t:'html', title:'Recording student awards (count by area and level)', html: studentGrid()},
    {t:'note', x:'Record every student award, at every level, with certificate, date and level. NAAC asks for the split by area and level.'},
  ]},
  {id:'support', title:'Supporting students to win', p:'123', blocks:[
    {t:'table', title:'Competitions cell', head:['Function','What it does'], rows:[['Scouting','Track national and international competitions; publish a calendar'],['Teams','Inter-disciplinary teams with faculty mentors'],['Resources','Lab access, maker space, materials and travel budget'],['Training','Bootcamps, mock rounds, alumni mentors'],['Recognition','Internal awards, certificates, credits under NEP where allowed']]},
    {t:'timeline', title:'Yearly competition calendar (typical)', items:[['Jul - Sep','Team formation; SIH internal hackathon'],['Oct - Dec','SIH, ICPC regionals, design competitions'],['Jan - Mar','SAE BAJA / SUPRA; robotics; cultural and sports'],['Apr - Jun','Paper and poster awards; fellowship applications']]},
    {t:'cards', title:'Funding model', cols:3, items:[['University fund','Annual competition budget per school'],['Sponsors','Industry partners and alumni'],['Prize reuse','Part of prize money reinvested in the team']]},
    {t:'note', x:'Turn each major win into a short story (team, problem, result, mentor) for the website, admissions and alumni.'},
  ]},
]);

function studentGrid(){
  const areas = ['Sports','Cultural','Technical','Innovation','NSS / NCC'], levels = ['University','State','National','International'];
  return `<div class="tbl-wrap"><table class="ht"><thead><tr><th>Area</th>${levels.map(l=>`<th>${l}</th>`).join('')}</tr></thead><tbody>${areas.map(a=>`<tr><td><b>${a}</b></td>${levels.map((l,i)=>`<td>${v('sg'+a+l,[14,9,5,1][i],[10,6,4,1][i],0,40)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="hfoot">Counts are sample data.</p>`;
}

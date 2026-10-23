/* Sample-data status pages and shared helpers. */
/* ---------- config ---------- */
const INSTITUTIONS = [
  ['all','All schools (university view)'],
  ['eng','School of Engineering'],
  ['mgmt','School of Management'],
  ['law','School of Law'],
  ['design','School of Design'],
  ['science','School of Science'],
  ['arch','School of Architecture'],
  ['hosp','School of Hospitality'],
  ['lib','School of Liberal Arts'],
  ['film','School of Film & Media'],
];

/* ---------- deterministic sample data per institution ---------- */
let INST = 'all';
try{ INST = localStorage.getItem('arr-inst') || 'all' }catch(e){}
if(!INSTITUTIONS.some(i=>i[0]===INST)) INST='all';
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function v(key,base,spread,min=0,max=100,inst=INST){const r=((hash(inst+'|'+key)%10007)/10007-.5)*2;return Math.round(Math.max(min,Math.min(max,base+r*spread)))}
function pick(key,arr,inst=INST){return arr[hash(inst+'|'+key)%arr.length]}
const instName = id => (INSTITUTIONS.find(i=>i[0]===id)||[])[1];

/* ---------- small render helpers ---------- */
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pill = (t,tone='mute') => `<span class="pill ${tone}">${esc(t)}</span>`;
const kpi = (l,val,s='') => `<div class="kpi"><div class="l">${l}</div><div class="v">${val}</div><div class="s">${s}</div></div>`;
const kpis = arr => `<div class="kpis">${arr.join('')}</div>`;
const card = (title,sub,body,extra='') => `<section class="card" ${extra}><h3>${title}</h3>${sub?`<p class="sub">${sub}</p>`:''}${body}</section>`;
function bars(items){ // {label, small, weight, score, suffix}
  return `<div class="bars">${items.map(i=>{
    const cls = i.neutral?'sec':i.score<45?'lo':i.score<65?'mid':'hi';
    return `<div class="bar-row"><div class="lab">${esc(i.label)}${i.small?`<small>${esc(i.small)}</small>`:''}</div>
      <div class="w">${i.weight??''}</div><div class="track"><div class="fill ${cls}" style="width:${i.score}%"></div></div>
      <div class="val">${i.display??i.score+(i.suffix??'%')}</div></div>`}).join('')}</div>`;
}
const table = (head,rows) => `<div class="tbl-wrap"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
function steps(list,cur){return `<div class="steps">${list.map((s,i)=>`<div class="step ${i<cur?'done':i===cur?'cur':''}"><div class="d">${i<cur?'✓':i+1}</div>${esc(s)}</div>`).join('')}</div>`}
const stars = (n,max=5) => `<span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(max-n)}</span></span>`;
const meterTone = p => p>=75?'good':p>=50?'warn':'bad';

/* ---------- HOME ---------- */
function snapshotRows(){
  return INSTITUTIONS.slice(1).map(([id,name])=>{
    const ev = v('naacev',70,25,20,100,id);
    const nirfCat = {eng:'Engineering',mgmt:'Management',law:'Law',arch:'Architecture & Planning'}[id];
    const nbaTot = {eng:8,mgmt:2}[id];
    const nbaOk = nbaTot? v('nbaok',nbaTot-1,1,0,nbaTot,id):0;
    const nirf = nirfCat ? pick('nirfband',['Rank 78','101-150','151-200','Rank 64','Not ranked'],id) : null;
    const iic = v('iic',3.5,1.6,1,5,id);
    const aw = v('awards',22,14,4,60,id);
    const ready = v('ready',68,22,20,98,id);
    return [`<b>${esc(name)}</b>`, `<span class="pill ${meterTone(ev)}">${ev}%</span>`,
      nbaTot?`${nbaOk} / ${nbaTot} programmes`:'<span class="pill mute">N/A</span>',
      nirf ? `${pill(nirf, nirf==='Not ranked'?'mute':'info')} <small style="color:var(--muted)">${nirfCat}</small>` : '<span class="pill mute">Overall only</span>', stars(iic), `<b>${aw}</b>`,
      `<span class="pill ${meterTone(ready)}">${ready}%</span>`];
  });
}
const DEADLINES = [
  ['09','Nov','THE Sustainability Impact Ratings – SDG data deadline','Ranking · THE','#1e7a45'],
  ['14','Nov','NIRF DCS submission (India Rankings 2027)','Ranking · NIRF','#1e7a45'],
  ['30','Nov','NAAC AQAR upload & data cross-check with AISHE','Accreditation · NAAC','#1f5fae'],
  ['15','Dec','IIC Q2 activity reports due on portal','Ratings · IIC','#c4561b'],
  ['10','Jan','QS Hub data window & THE data portal open','Ranking · QS / THE','#1e7a45'],
  ['20','Jan','Society award nominations (IEEE, ISTE, CSI)','Awards · Faculty','#963a14'],
];
/* ---------- ACCREDITATION ---------- */
const NAAC_ATTR = [
  ['Curriculum Design','Input',75],['Faculty Resources','Input',50],['Infrastructure','Input',50],['Financial Resources & Management','Input',50],
  ['Learning & Teaching','Process',125],['Extended Curricular Engagements','Process',100],['Governance & Administration','Process',100],
  ['Student Outcomes','Outcome',150],['Research & Innovation Outcomes','Outcome',125],['Sustainability Outcomes & Green Initiatives','Outcome',75]];
function naac(){
  const ready=v('naac-ready',68,15), ev=v('ev',412,80,0,580), grade=pick('naacgrade',['A+ (RAF) · valid till Mar 2028','A++ (RAF) · valid till Aug 2029','A (RAF) · valid till Jan 2027'],'all');
  const lvl = pick('mbgl',[1,1,2]), stepNow = v('step',2,1,0,7);
  const attrRows = NAAC_ATTR.map(([n,t,w],i)=>{const p=v('attr'+i,70,25,15,100);return {label:n,small:t+' · '+w+' marks',weight:'',score:p}});
  const ladder = [[5,'Global excellence'],[4,'National excellence'],[3,'Distinguished'],[2,'Performing well'],[1,'Consolidating quality']]
    .map(([n,t])=>`<div class="rung ${n===lvl?'now':''} ${n===lvl+1?'target':''}"><b>Level ${n}</b>${t}${n===lvl?pill('Eligible to apply','good'):n===lvl+1?pill('3-year target','warn'):''}</div>`).join('')
    + `<div class="rung"><b>Base</b>Basic (Binary) Accreditation ${pill('Foundation','info')}</div>`;
  return kpis([kpi('Current status',grade.split(' · ')[0],grade.split(' · ')[1]),kpi('Next framework','Basic + MBGL','Move when current grade expires'),
      kpi('Readiness',ready+'%',`${NAAC_ATTR.length} attributes · 900 marks`),kpi('Evidence uploaded',`${ev}<small style="font-size:15px;color:var(--muted)"> / 580</small>`,'Indexed by attribute')])
  + `<div class="row3">
    ${card('10 attributes · readiness','Input, process and outcome framework (university weights). Red = needs attention.',bars(attrRows))}
    ${card('Maturity ladder (MBGL)','Where we are and where we aim to be',`<div class="ladder">${ladder}</div>`)}
  </div><div style="height:16px"></div>
  ${card('Basic accreditation journey','Current step highlighted',steps(['Register','Eligibility check','Submit data','Digital verification','Stakeholder validation','Peer verification','Decision','Sustain & progress'],stepNow))}`;
}
const NBA_PROGS = [
  ['eng','B.Tech CSE','Tier I'],['eng','B.Tech AI & Data Science','Tier I'],['eng','B.Tech Mechanical','Tier I'],['eng','B.Tech Civil','Tier I'],
  ['eng','B.Tech Robotics','Tier I'],['eng','B.Tech Biomedical','Tier I'],['eng','B.Tech Biotechnology','Tier I'],['eng','M.Tech','Tier I'],
  ['mgmt','MBA','—'],['mgmt','BBA','—']];
const NBA_STATUS = [['Accredited · 6 yrs','good','2030'],['Accredited · 3 yrs','info','2027'],['SAR in progress','warn','—'],['Pre-qualifier submitted','warn','—'],['Not yet eligible','mute','—']];
function nba(){
  const list = NBA_PROGS.filter(p=>INST==='all'||p[0]===INST);
  const rows = list.map(([i,p,t],k)=>{const s=pick('nbast'+p,NBA_STATUS,'x');const sar=s[0].startsWith('Acc')?100:v('sar'+p,55,30,10,95,'x');
    return [`<b>${p}</b>`,esc(instName(i)),t,pill(s[0],s[1]),s[2],bars([{label:'',score:sar}]).replace('bar-row','bar-row" style="grid-template-columns:0 0 1fr 44px')]});
  const acc = rows.filter(r=>r[3].includes('Accredited')).length;
  const gates = [['Admissions (3-yr avg)','≥ 60% of intake',v('adm',72,15)],['PhD faculty','≥ 20% of required',v('phd',24,10,0,60)],['Faculty–student ratio','1 : 20',v('fsr',19,4,10,30)],['Placement + higher studies','≥ 60% (MBA)',v('plc',68,12)]];
  return kpis([kpi('Programmes tracked',list.length||'—',INST==='all'?'All schools':esc(instName(INST))),kpi('Accredited',acc,'6-yr or 3-yr cycle'),
      kpi('SAR in progress',rows.filter(r=>r[3].includes('SAR')).length,'Self-Assessment Reports'),kpi('Next expiry','Jun 2027','Start SAR 12 months before')])
  + (list.length?card('Programme accreditation status','Status is programme-specific and tied to the years in the NBA letter',
      table(['Programme','School','Tier','Status','Valid till','SAR readiness'],rows)):card('No NBA programmes','NBA covers Engineering and Management only.',''))
  + `<div style="height:16px"></div>` + card('Pre-qualifier gates','Must be green before applying',
      table(['Gate','Requirement','Current','Status'],gates.map(([g,r,c])=>{const ok=g.includes('ratio')?c<=20:g.includes('PhD')?c>=20:c>=60;
        return [g,r,`<b>${g.includes('ratio')?'1 : '+c:c+'%'}</b>`,pill(ok?'Meets':'Gap',ok?'good':'bad')]})));
}
function intl(){
  const STAGES=['Exploring','Eligibility','Self-study','Visit','Accredited'];
  const list=[['ABET','Engineering · Washington Accord route','eng'],['IET (UK)','Engineering · AHEP','eng'],['AACSB','Business school · 9 standards','mgmt'],
    ['AMBA','MBA programmes','mgmt'],['EQUIS','Business school (Triple Crown)','mgmt'],['RIBA / Other','Architecture & design','arch']];
  return kpis([kpi('Pursuing',v('intl-p',3,1,1,6),'International accreditations'),kpi('Achieved',v('intl',1,1,0,3),'Active and valid'),kpi('Furthest along','ABET','Self-study under way'),kpi('Typical journey','3–5 yrs','Eligibility to decision')])
  + card('Accreditation pipeline','Stage of each international accreditation',`<div class="pipes">${list.map(([n,f,i])=>{const st=v('st'+n,2,2,0,4,i);
     return `<div class="card pipe"><h4>${n}</h4><div class="for">${f}</div><div class="dots">${STAGES.map((_,k)=>`<i class="${k<=st?'on':''}"></i>`).join('')}</div>
       <div class="stage">${STAGES[st]}</div><div class="note">Owner: ${i==='eng'?'Dean, Engineering':i==='mgmt'?'Director, Management':'Director, Architecture'}</div></div>`}).join('')}</div>`);
}

/* ---------- RANKING ---------- */
function trend(points,label){ // points: [[year,rank]] lower is better
  const W=520,H=170,p=34, ys=points.map(x=>x[1]), mx=Math.max(...ys)*1.1, mn=Math.max(0,Math.min(...ys)*.85);
  const X=i=>p+i*(W-2*p)/(points.length-1), Y=r=>p/2+(r-mn)/(mx-mn)*(H-p*1.5);
  const d=points.map((pt,i)=>`${i?'L':'M'}${X(i)},${Y(pt[1])}`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${label}">
   <line x1="${p}" x2="${W-p}" y1="${H-p+4}" y2="${H-p+4}" stroke="#e1e6ef"/>
   <path d="${d}" fill="none" stroke="var(--sec)" stroke-width="3" stroke-linejoin="round"/>
   ${points.map((pt,i)=>`<circle cx="${X(i)}" cy="${Y(pt[1])}" r="5" fill="#fff" stroke="var(--sec)" stroke-width="3"/>
     <text x="${X(i)}" y="${Y(pt[1])-11}" text-anchor="middle" font-size="13" font-weight="700" fill="#0f1b33">${pt[1]}</text>
     <text x="${X(i)}" y="${H-6}" text-anchor="middle" font-size="12" fill="#5b6680">${pt[0]}</text>`).join('')}
  </svg><div class="note">Rank (lower is better) · ${label}</div>`;
}
function nirf(){
  const params=[['TLR','Teaching, Learning & Resources',30],['RP','Research & Professional Practice',30],['GO','Graduation Outcomes',20],['OI','Outreach & Inclusivity',10],['PR','Perception',10]];
  const sc=params.map(([k],i)=>v('nirf'+k,[62,38,71,58,22][i],12));
  const total=params.reduce((a,p,i)=>a+p[2]*sc[i]/100,0).toFixed(1);
  const base=v('nirfbase',120,40,40,220); const pts=[2022,2023,2024,2025,2026].map((y,i)=>[y,Math.max(20,base+(4-i)*v('dr'+i,9,6,0,20))]);
  const cats=[['Overall','Applied'],['Universities','Applied'],['Engineering','Applied'],['Management','Applied'],['Pharmacy','Applied'],['Innovation','Applied'],['SDG (new 2025)','Not applied'],['Research Institutions','Not eligible']];
  return kpis([kpi('Overall score',total,'out of 100 · sample'),kpi('Best rank (2026)',pts[4][1],'Engineering category'),kpi('Categories applied',`${cats.filter(c=>c[1]==='Applied').length} / 17`,'Each category = separate chance'),kpi('DCS submission','14 Nov',pill('Data 82% filled','warn'))])
  + `<div class="row2">
    ${card('Parameter scores','Score = 0.30·TLR + 0.30·RP + 0.20·GO + 0.10·OI + 0.10·PR',bars(params.map(([k,n,w],i)=>({label:`${k} · ${n}`,small:`contributes ${(w*sc[i]/100).toFixed(1)} pts`,weight:w+'%',score:sc[i]}))))}
    ${card('Rank trend','Engineering category, last five cycles',trend(pts,'NIRF Engineering'))}
  </div><div style="height:16px"></div>
  ${card('Categories','Apply in Overall and in every subject category where eligible',table(['Category','Status','2026 result','Owner'],
    cats.map(([c,s],i)=>[`<b>${c}</b>`,pill(s,s==='Applied'?'good':s==='Not applied'?'warn':'mute'),s==='Applied'?pick('cr'+c,['Rank 78','101-150','151-200','Band 51-100','Rank 64']):'—',pick('ow'+i,['NIRF Cell','Dean Academics','IQAC Director','Innovation Cell'])])))}`;
}
function qs(){
  const ind=[['Academic Reputation',30,24],['Citations per Faculty',20,31],['Employer Reputation',15,38],['Faculty Student Ratio',10,62],['Employment Outcomes',5,71],
    ['International Faculty Ratio',5,8],['International Student Ratio',5,6],['International Research Network',5,44],['Sustainability',5,35]];
  return kpis([kpi('QS World',pick('qsw',['Not yet ranked','1201-1400']),'WUR 2027'),kpi('QS Asia',pick('qsa',['451-500','401-450','501-550']),'Southern Asia: top 120'),kpi('QS Sustainability','Applied','Feeds 5% of WUR'),kpi('Next data window','Jan 2027','QS Hub')])
  + `<div class="row3">${card('World University Rankings · indicator readiness','65% of the score is reputation + citations — slow to move, plan early',
      bars(ind.map(([n,w,b])=>({label:n,weight:w+'%',score:v('qs'+n,b,12)}))))}
    ${card('Action levers','From the handbook strategy pages',`<div class="bars">${[['Submit academic & employer contact lists','Reputation','warn'],['Scopus profile clean-up & affiliation','Citations','good'],['International faculty & exchange MoUs','International','bad'],['Join QS Sustainability ranking','Sustainability','good']]
      .map(([t,a,s])=>`<div class="dl"><div><div class="t">${t}</div><div class="m">${a} · ${pill(s==='good'?'On track':s==='warn'?'In progress':'Not started',s)}</div></div></div>`).join('')}</div>`)}</div>`;
}
function the(){
  const pill5=[['Teaching',29.5,40],['Research Environment',29,28],['Research Quality',30,33],['International Outlook',7.5,22],['Industry',4,55]];
  const sel=[3,4,5,17]; const names=['No poverty','Zero hunger','Health','Education','Gender','Water','Energy','Work','Industry','Inequality','Cities','Consumption','Climate','Ocean','Land','Peace','Partner'];
  return kpis([kpi('THE World',pick('thew',['Not yet ranked','1201-1500']),'WUR 3.0 · 18 metrics'),kpi('THE Asia',pick('thea',['501-600','401-500']),'2026 edition'),kpi('Impact Ratings','401-600','SDG 3, 4, 5 + 17'),kpi('SDG deadline','9 Nov 2026',pill('3 weeks left','bad'))])
  + `<div class="row2">${card('WUR 3.0 · five pillars','Pillar weight and our readiness',bars(pill5.map(([n,w,b])=>({label:n,weight:w+'%',score:v('the'+n,b,12)}))))}
    ${card('Sustainability Impact · SDG selection','SDG 17 is mandatory plus three others. Highlighted = submitting this cycle.',
      `<div class="sdgs">${names.map((n,i)=>`<div class="sdg ${sel.includes(i+1)?'sel':''}" title="SDG ${i+1} ${n}">${i+1}<small>${n.split(' ')[0].toUpperCase()}</small></div>`).join('')}</div>
       <div class="note">Shared evidence: the same campus data feeds GreenMetric, QS Sustainability and NAAC green-audit metrics.</div>`)}</div>`;
}

/* ---------- RATINGS ---------- */
function ratingPage(o){
  return kpis(o.k.map(x=>kpi(...x))) + `<div class="row3">${card(o.ct,o.cs,bars(o.crit))}${card('Renewal checklist','Keep the rating current',
     table(['Item','Status'],o.check.map(([t,s])=>[t,pill(s==='y'?'Done':s==='p'?'In progress':'Pending',s==='y'?'good':s==='p'?'warn':'bad')])))}</div>`;
}
const RATINGS = {
  qsstars:()=>ratingPage({k:[['Overall rating',stars(v('qsst',4,1,1,5)),'QS Stars v6.0'],['Valid till','Mar 2027','3-year cycle'],['Points (est.)',v('qspts',640,90,0,1000)+' / 1000','900 core + 100 electives'],['Next audit','Jan 2027','Data due Nov']],
    ct:'Category scores',cs:'Seven mandatory categories + two electives',
    crit:[['Teaching',150],['Research / Academic development',150],['Global engagement',150],['Employability',150],['Facilities / Online learning',100],['Social / Environmental impact',100],['Good governance',100],['Elective: Innovation & knowledge transfer',50],['Elective: Entrepreneurship',50]].map(([n,w])=>{const s=v('qss'+n,68,24);return{label:n,weight:w+' pts',score:s,display:Math.round(w*s/100)}}),
    check:[['Self-assessment worksheet','y'],['International ratios evidence','p'],['Employer survey contacts','n'],['Audit fee & agreement','y']]}),
  igauge:()=>ratingPage({k:[['Current rating',pick('ig',['Diamond','Platinum','Gold']),'QS I-GAUGE'],['Valid till','Aug 2027','2-year validity'],['E-LEAD',pick('el',['Certified','Not applied']),'Online-readiness certificate'],['Criteria','6 + 8','Core + advanced']],
    ct:'Criteria badges',cs:'Six core criteria areas (sample readiness)',
    crit:['Teaching & learning','Employability','Research & innovation','Social responsibility','Competency development','Internationalisation'].map(n=>({label:n,score:v('ig'+n,70,22)})),
    check:[['Six-week data submission','y'],['Evidence for self-reported data','p'],['Interim report response','n'],['Development roadmap actions','n']]}),
  iic:()=>ratingPage({k:[['IIC rating',stars(v('iic',4,1,1,5)),'IIC 7.0 (2024-25)'],['Results announced','6 Oct 2026','Ministry of Education Innovation Cell'],['Quarter','Q2 of 4','Reports due 15 Dec'],['Innovation Ambassadors',v('amb',14,8,0,40),'Trained faculty']],
    ct:'Score build-up',cs:'Score out of 100 gives up to 4 stars; 5th star from checklist',
    crit:[['IIC annual calendar plan','50%',74],['Self-driven activities','30%',61],['MIC-driven activities','20%',48]].map(([n,w,b])=>({label:n,weight:w,score:v('iicx'+n,b,15)})),
    check:[['Annual report uploaded','y'],['NISP adopted','y'],['National innovation contest teams','p'],['NIRF Innovation participation','y']]}),
  greenmetric:()=>ratingPage({k:[['World rank',pick('gm',['312','287','341']),'UI GreenMetric 2025'],['India rank',pick('gmi',['24','31','19']),'Among participating HEIs'],['Indicators','39','Six criteria'],['Data due','Oct 2026','Self-reported with evidence']],
    ct:'Six criteria',cs:'Weight and our score (sample)',
    crit:[['Energy & Climate Change',21],['Waste',18],['Transportation',18],['Education & Research',18],['Setting & Infrastructure',15],['Water',10]].map(([n,w])=>({label:n,weight:w+'%',score:v('gm'+n,62,25)})),
    check:[['Rooftop solar & LED data','y'],['Waste segregation records','p'],['Rainwater harvesting / STP reuse','y'],['E-shuttle & walkable zones','n']]}),
  iso:()=>kpis([kpi('Active certificates',v('iso',2,1,0,4),'ISO 9001 · 14001 · 21001'),kpi('NABL labs',v('nabl',1,1,0,3),'Testing & calibration'),kpi('Next surveillance audit','Feb 2027','ISO 21001'),kpi('Green building','IGBC Silver','Main academic block')])
    + card('Certificates & audits','Certification = do our systems meet a standard? (yes / no)',table(['Certificate','Scope','Status','Valid till','Next audit'],
      [['ISO 21001:2018','Educational organisation management','Certified','May 2028','Feb 2027'],['ISO 9001:2015','Administration & examinations','Certified','Sep 2027','Mar 2027'],['ISO 14001:2015','Environmental management','In progress','—','Stage 1: Dec 2026'],['NABL (ISO/IEC 17025)','Materials testing lab','Applied','—','Assessment: Jan 2027'],['Green / energy audit','Campus-wide','Done','Annual','Jun 2027']]
      .map(([a,b,c,d,e])=>[`<b>${a}</b>`,b,pill(c,c==='Certified'||c==='Done'?'good':'warn'),d,e]))),
};

/* ---------- AWARDS ---------- */
const AWARDS = {
  institution:[['WURI – Top 300 (Industrial Application)','Global impact','International','Apr 2026'],['India Today–MDRA Best Colleges','Media survey','National','Jun 2026'],['FICCI Higher Education Excellence – Employability','Industry body','National','Sep 2026'],['AICTE Clean & Smart Campus Award','Government & AICTE','National','Feb 2026'],['CII Industry–Academia Partnership','Industry body','National','Nov 2025']],
  faculty:[['IEEE Senior Member elevation','Professional society','International','Mar 2026'],['ISTE Best Teacher Award','Professional society','National','Jan 2026'],['AICTE Lilavati Award (team)','Government & AICTE','National','Feb 2026'],['National academy fellowship','Faculty honour','National','Aug 2026'],['Best paper – international conference','Faculty honour','International','Jul 2026']],
  student:[['Smart India Hackathon – Winner','Student honour','National','Dec 2025'],['SAE BAJA – All India 3rd','Professional society','National','Feb 2026'],['Khelo India University Games – Silver','Student honour','National','Apr 2026'],['IEEE student paper contest – Region 10','Professional society','International','May 2026'],['NSS state-level best volunteer','Student honour','State','Sep 2026']],
};
function awards(tab){
  const list=AWARDS[tab]; const groups=['Global impact','Media surveys','Industry bodies','Government & AICTE','Professional societies','Faculty honours','Student honours'];
  const counts=groups.map(g=>v('g'+g+tab,12,10,1,30)); const mx=Math.max(...counts);
  const recips={institution:a=>esc(instName(INST==='all'?pick('ri'+a,INSTITUTIONS.slice(1).map(x=>x[0])):INST)),faculty:a=>'Faculty · '+pick('d'+a,['Engineering','Management','Design','Law']),student:a=>'Team · '+pick('s'+a,['CSE','Robotics','Design','Film & Media'])};
  return kpis([kpi('This academic year',v('aw-'+tab[0],tab==='student'?96:tab==='faculty'?42:18,10,0,200),'Awards recorded'),kpi('International',v('awi'+tab,6,4,0,40),'Highest weight in perception'),
     kpi('Used as NAAC evidence',v('awn'+tab,70,15)+'%','Linked to attribute'),kpi('Credibility checked',pill('All verified','good'),'No pay-to-win awards')])
  + `<div class="row3">${card('Awards register',`${tab[0].toUpperCase()+tab.slice(1)} awards · newest first`,table(['Award','Group','Level','Date','Recipient','Used in'],
      list.map(([a,g,l,d])=>[`<b>${a}</b>`,g,pill(l,l==='International'?'info':l==='National'?'good':'mute'),d,recips[tab](a),
        `<span class="flag y">NAAC</span><span class="flag ${l!=='State'?'y':''}">NIRF PR</span><span class="flag ${l==='International'?'y':''}">QS/THE</span>`])))}
    ${card('By award group','Seven groups from the handbook',bars(groups.map((g,i)=>({label:g,score:Math.round(counts[i]/mx*100),display:counts[i],neutral:true}))))}</div>`;
}

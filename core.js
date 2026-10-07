(function(g){
'use strict';
const C={};const day=86400000;
C.today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
C.iso=v=>{if(v instanceof Date)return v.toISOString().slice(0,10);if(typeof v==='number')return v>=18264&&v<100000?new Date((v-25569)*day).toISOString().slice(0,10):'';if(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}/.test(v)){const s=v.slice(0,10),d=new Date(s+'T12:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===s&&s>='1950-01-01'?s:'';}return '';};
C.serial=s=>Math.round(Date.parse(s+'T00:00:00Z')/day)+25569;
C.addMonths=(s,n)=>{const d=new Date(s+'T12:00:00Z'),v=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+Number(n));d.setUTCDate(Math.min(v,new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate()));return d.toISOString().slice(0,10);};
C.days=(a,b)=>Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/day);
C.review=d=>d.KontrolaPodkladov||(d.OverenieUdajov==='Neoverene'?'Neskontrolovane':d.OverenieUdajov==='Overene'?'Skontrolovane':'NaUpresnenie');
C.status=(p,d,t=C.today(),months=1)=>{
 if(d.PrevadzkovyStav==='Vyradene'||['NevztahujeSa','NevyzadujeSa'].includes(p.Rezim))return 'inactive';
 if(C.review(d)!=='Skontrolovane'||p.Overenie!=='Overene')return 'unknown';
 if(['PredPouzitim','PredUvedenim'].includes(p.Rezim))return 'event';
 const due=C.iso(p.Termin);if(!due||['Neurceny','PodlaVyrobcu'].includes(p.Rezim))return 'unknown';
 if(due<t)return 'overdue';if(due<=C.addMonths(t,months))return 'soon';return 'ok';
};
C.next=(s,p)=>p.Rezim!=='Pravidelna'||!(Number(p.IntervalHodnota)>0)?'':p.IntervalJednotka==='Mesiac'?C.addMonths(s,p.IntervalHodnota):p.IntervalJednotka==='Den'?new Date(Date.parse(s+'T12:00:00Z')+p.IntervalHodnota*day).toISOString().slice(0,10):'';
C.validate=t=>{for(const [name,fields]of Object.entries({Zariadenia:['ZariadenieID','StrediskoID','KategoriaID','Nazov'],PlanKontrol:['PlanID','ZariadenieID','DruhKontrolyID','Termin','Overenie'],Strediska:['StrediskoID','Nazov'],DruhyKontrol:['DruhKontrolyID','Nazov'],Revizie:['ReviziaID','PlanID','DatumVykonania']})){
 if(!t[name])throw Error(`Chýba hárok ${name}. Použi pripravený databázový zošit.`);for(const f of fields)if(!t[name].headers.includes(f))throw Error(`V hárku ${name} chýba stĺpec ${f}.`);
 const ids=t[name].rows.map(r=>r[fields[0]]);if(new Set(ids).size!==ids.length)throw Error(`Duplicitné ID v hárku ${name}.`);
 }const ids=new Set(t.Zariadenia.rows.map(r=>r.ZariadenieID));const kinds=new Set(t.DruhyKontrol.rows.map(r=>r.DruhKontrolyID));const centres=new Set(t.Strediska.rows.map(r=>r.StrediskoID));const plans=new Set(t.PlanKontrol.rows.map(r=>r.PlanID));
 if(t.Zariadenia.rows.some(r=>!centres.has(r.StrediskoID)))throw Error('Zariadenie odkazuje na neznáme stredisko.');
 if(t.PlanKontrol.rows.some(r=>!ids.has(r.ZariadenieID)||!kinds.has(r.DruhKontrolyID)))throw Error('Plán kontroly má neplatnú väzbu na zariadenie alebo druh kontroly.');
 if(t.Revizie.rows.some(r=>!plans.has(r.PlanID)))throw Error('Revízia odkazuje na neznámy plán.');return t;};
C.demo=()=>{
 const rows={},define=(n,h)=>{rows[n]={headers:h.split(','),rows:[]};};
 define('Zariadenia','ZariadenieID,StrediskoID,KategoriaID,Nazov,EvidencneCislo,TypoveOznacenie,Vyrobca,VyrobneCislo,RokVyroby,Umiestnenie,Skupina,KontrolaPodkladov,PrevadzkovyStav,PovodnyStav,DodavatelID,Poznamka,ZdrojRiadok');
 define('Strediska','StrediskoID,Nazov,Oznacenie');define('Kategorie','KategoriaID,Nazov');define('DruhyKontrol','DruhKontrolyID,KategoriaID,Nazov');
 define('PlanKontrol','PlanID,ZariadenieID,DruhKontrolyID,Rezim,IntervalHodnota,IntervalJednotka,Termin,Overenie,Poznamka');
 define('Revizie','ReviziaID,PlanID,DatumVykonania,Vysledok,DodavatelID,Technik,NasledujuciTermin,Overenie,PovodZaznamu,Poznamka,ZapisalEmail,ZapisaneDna,Zrusena');
 define('Dokumenty','DokumentID,Nazov,CisloSpravy,DatumDokumentu,Subor');define('DokumentZariadenia','VazbaID,DokumentID,ZariadenieID');define('DokumentRevizie','VazbaID,DokumentID,ReviziaID');
 const names=['Ivanka','Budimír','Strečno','Banská Bystrica','Trenčín','Nitra','Trnava','Petržalka','Pezinok','Express One'];
 names.forEach((n,i)=>rows.Strediska.rows.push({StrediskoID:'S'+i,Nazov:n,Oznacenie:String(i+1).padStart(2,'0')+' – '+n}));
 const cats=[['EL','Elektrické zariadenia','Rozvádzač','Odborná prehliadka a skúška'],['HP','Hasiace prístroje','Hasiaci prístroj','Kontrola'],['TN','Tlakové nádoby','Expanzná nádoba','Vonkajšia prehliadka'],['ZD','Zdvíhacie zariadenia','Zdvíhacia plošina','Odborná skúška'],['NO','Núdzové osvetlenie','Núdzové svietidlo','Funkčná kontrola']];
 cats.forEach(c=>{rows.Kategorie.rows.push({KategoriaID:c[0],Nazov:c[1]});rows.DruhyKontrol.rows.push({DruhKontrolyID:c[0]+'_K',KategoriaID:c[0],Nazov:c[3]});});
 const today=C.today();for(let i=0;i<60;i++){
  const c=cats[i%5],id='DEMO'+String(i+1).padStart(3,'0'),offset=[-72,-18,-3,0,9,21,40,70,120,230][i%10],due=new Date(Date.parse(today+'T12:00:00Z')+offset*day).toISOString().slice(0,10),unknown=i%7===0;
  rows.Zariadenia.rows.push({ZariadenieID:id,StrediskoID:'S'+(Math.floor(i/6)%10),KategoriaID:c[0],Nazov:c[2]+' '+String(i+1).padStart(2,'0'),EvidencneCislo:'UK-'+(i+1),Umiestnenie:['Hala A','Administratíva','Technická miestnosť'][i%3],RokVyroby:'2020',KontrolaPodkladov:unknown?'Neskontrolovane':'Skontrolovane',PrevadzkovyStav:i===59?'Vyradene':'VPrevadzke',PovodnyStav:unknown?'test':'real',Poznamka:'Fiktívny záznam na vyskúšanie aplikácie.'});
  rows.PlanKontrol.rows.push({PlanID:id+'_K',ZariadenieID:id,DruhKontrolyID:c[0]+'_K',Rezim:'Pravidelna',IntervalHodnota:12,IntervalJednotka:'Mesiac',Termin:unknown?'':C.serial(due),Overenie:unknown?'Neoverene':'Overene'});
  if(!unknown)rows.Revizie.rows.push({ReviziaID:id+'_R',PlanID:id+'_K',DatumVykonania:C.serial(C.addMonths(due,-12)),Vysledok:'Vyhovuje',NasledujuciTermin:C.serial(due),Overenie:'Overene',PovodZaznamu:'UkazkoveUdaje',Zrusena:false});
 }return rows;};
g.RevizieCore=C;if(typeof module!=='undefined')module.exports=C;
})(globalThis);

(function(g){'use strict';
const ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const el=(name,attributes={},elements=[])=>({type:'element',name,attributes,elements});
const local=n=>n.name?.split(':').pop();
const children=(n,name)=>(n.elements||[]).filter(x=>x.type==='element'&&local(x)===name);
const one=(n,name)=>children(n,name)[0];
const text=n=>!n?'':(n.elements||[]).map(x=>x.type==='text'?x.text:text(x)).join('');
const parse=s=>g.xml2js(s,{compact:false});
const stringify=x=>g.js2xml(x,{compact:false});
const path=(base,target)=>{const bits=(target.startsWith('/')?target.slice(1):base+target).split('/'),out=[];for(const b of bits){if(b==='..')out.pop();else if(b!=='.'&&b)out.push(b);}return out.join('/');};
const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
const index=s=>[...s.replace(/[0-9]/g,'')].reduce((a,c)=>a*26+c.charCodeAt(0)-64,0)-1;
const doc=root=>({declaration:{attributes:{version:'1.0',encoding:'UTF-8',standalone:'yes'}},elements:[root]});
const prefixTree=(node,prefix)=>{if(node.type==='element')node.name=prefix+local(node);for(const x of node.elements||[])prefixTree(x,prefix);return node;};
async function read(bytes){
 const zip=await g.JSZip.loadAsync(bytes);if(!zip.file('xl/workbook.xml'))throw Error('Súbor nie je platný Excel .xlsx.');
 const wb=parse(await zip.file('xl/workbook.xml').async('string')),root=one(wb,'workbook');if(one(root,'workbookPr')?.attributes?.date1904==='1')throw Error('Zošity s dátumovým systémom 1904 nie sú podporované.');
 const rel=parse(await zip.file('xl/_rels/workbook.xml.rels').async('string')),rels=children(one(rel,'Relationships'),'Relationship');
 const shared=zip.file('xl/sharedStrings.xml')?children(one(parse(await zip.file('xl/sharedStrings.xml').async('string')),'sst'),'si').map(text):[];
 const tables={};for(const s of children(one(root,'sheets'),'sheet')){
  const r=rels.find(r=>r.attributes.Id===s.attributes['r:id']);if(!r)continue;const p=path('xl/',r.attributes.Target);const file=zip.file(p);if(!file)continue;
  const x=parse(await file.async('string')),ws=one(x,'worksheet'),data=one(ws,'sheetData');if(!data)continue;
  const matrix=[];for(const row of children(data,'row')){const a=[];for(const c of children(row,'c')){
   const t=c.attributes.t,v=text(one(c,'v'));a[index(c.attributes.r)]=t==='s'?(shared[Number(v)]??''):t==='inlineStr'?text(one(c,'is')):t==='b'?v==='1':t==='str'||t==='e'?v:v===''?'':Number.isFinite(Number(v))?Number(v):v;
  }matrix.push({n:Number(row.attributes.r),a});}
  const h=matrix.find(r=>r.n===1)?.a.map(x=>String(x??''))||[];if(!h.length)continue;
  if(new Set(h).size!==h.length||h.some(v=>!v))throw Error(`Neplatné hlavičky v hárku ${s.attributes.name}.`);
  const rows=matrix.filter(r=>r.n>1&&r.a[0]!==undefined&&r.a[0]!=='').map(r=>Object.assign(Object.fromEntries(h.map((k,i)=>[k,r.a[i]??''])),{_row:r.n}));
  tables[s.attributes.name]={headers:h,rows,path:p,xml:x};
 }
 return {zip,tables,changes:new Map(),added:new Map()};
}
function set(book,sheet,record,field,value){const t=book.tables[sheet];if(!t.headers.includes(field))throw Error(`Chýba stĺpec ${field}.`);record[field]=value;if(!book.changes.has(sheet))book.changes.set(sheet,new Map());if(!book.changes.get(sheet).has(record._row))book.changes.get(sheet).set(record._row,new Map());book.changes.get(sheet).get(record._row).set(field,value);}
function append(book,sheet,record){const t=book.tables[sheet];record._row=Math.max(1,...t.rows.map(r=>r._row))+1;t.rows.push(record);if(!book.added.has(sheet))book.added.set(sheet,[]);book.added.get(sheet).push(record);return record;}
function cell(address,value,style){const a={r:address};if(style!==undefined)a.s=style;
 if(typeof value==='number'&&Number.isFinite(value))return el('c',a,[el('v',{},[{type:'text',text:String(value)}])]);
 if(typeof value==='boolean')return el('c',{...a,t:'b'},[el('v',{},[{type:'text',text:value?'1':'0'}])]);
 return el('c',{...a,t:'inlineStr'},[el('is',{},[el('t',{'xml:space':'preserve'},[{type:'text',text:String(value??'')}])])]);}
async function write(book){
 const zip=book.zip;for(const name of new Set([...book.changes.keys(),...book.added.keys()])){
  const t=book.tables[name],x=t.xml,ws=one(x,'worksheet'),data=one(ws,'sheetData');const edits=book.changes.get(name)||new Map();
  const prefix=data.name.includes(':')?data.name.split(':')[0]+':':'';
  const existing=children(data,'row');const styles=new Map(children(existing.at(-1)||{},'c').map(c=>[index(c.attributes.r),c.attributes.s]));
  const added=book.added.get(name)||[];for(const rec of added){const fields=new Map(t.headers.map(k=>[k,rec[k]??'']));for(const [k,v]of edits.get(rec._row)||[])fields.set(k,v);edits.set(rec._row,fields);}
  for(const [rn,fields]of edits){let row=children(data,'row').find(r=>Number(r.attributes.r)===rn);if(!row){row=el(prefix+'row',{r:String(rn)});data.elements.push(row);}
   for(const [field,value]of fields){const ci=t.headers.indexOf(field),address=col(ci)+rn,old=children(row,'c').find(c=>c.attributes.r===address),c=prefixTree(cell(address,value,old?.attributes.s??styles.get(ci)),prefix);if(old)row.elements[row.elements.indexOf(old)]=c;else row.elements.push(c);}
   row.elements.sort((a,b)=>index(a.attributes?.r||'A')-index(b.attributes?.r||'A'));
  }
  if(added.length){const last=Math.max(...t.rows.map(r=>r._row)),ref='A1:'+col(t.headers.length-1)+last;const dim=one(ws,'dimension');if(dim)dim.attributes.ref=ref;const af=one(ws,'autoFilter');if(af)af.attributes.ref=ref;
   const slash=t.path.lastIndexOf('/'),rp=t.path.slice(0,slash+1)+'_rels/'+t.path.slice(slash+1)+'.rels';
   if(zip.file(rp)){const rr=parse(await zip.file(rp).async('string'));for(const link of children(one(rr,'Relationships'),'Relationship').filter(r=>r.attributes.Type.endsWith('/table'))){const tp=path(t.path.slice(0,slash+1),link.attributes.Target),tx=parse(await zip.file(tp).async('string')),tab=one(tx,'table');tab.attributes.ref=ref;if(one(tab,'autoFilter'))one(tab,'autoFilter').attributes.ref=ref;zip.file(tp,stringify(tx));}}
  }zip.file(t.path,stringify(x));
 }
 return zip.generateAsync({type:'uint8array',compression:'DEFLATE'});
}
async function fromTables(tables){const zip=new g.JSZip(),sheets=[],rels=[],types=[];let i=0;
 for(const [name,t]of Object.entries(tables)){i++;const p=`xl/worksheets/sheet${i}.xml`,all=[t.headers,...t.rows.map(r=>t.headers.map(h=>r[h]??''))];zip.file(p,stringify(doc(el('worksheet',{xmlns:ns},[el('dimension',{ref:`A1:${col(t.headers.length-1)}${all.length}`}),el('sheetData',{},all.map((r,j)=>el('row',{r:String(j+1)},r.map((v,k)=>cell(col(k)+(j+1),v,j>0&&/^(Termin|DatumVykonania|NasledujuciTermin|DatumDokumentu)$/.test(t.headers[k])&&typeof v==='number'?'1':undefined)))))]))));
  sheets.push(el('sheet',{name,sheetId:String(i),'r:id':'rId'+i}));rels.push(el('Relationship',{Id:'rId'+i,Type:'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet',Target:`worksheets/sheet${i}.xml`}));types.push(el('Override',{PartName:'/'+p,ContentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'}));
 }
 zip.file('xl/workbook.xml',stringify(doc(el('workbook',{xmlns:ns,'xmlns:r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'},[el('sheets',{},sheets)]))));
 rels.push(el('Relationship',{Id:'styles',Type:'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles',Target:'styles.xml'}));zip.file('xl/_rels/workbook.xml.rels',stringify(doc(el('Relationships',{xmlns:'http://schemas.openxmlformats.org/package/2006/relationships'},rels))));
 zip.file('_rels/.rels',stringify(doc(el('Relationships',{xmlns:'http://schemas.openxmlformats.org/package/2006/relationships'},[el('Relationship',{Id:'rId1',Type:'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument',Target:'xl/workbook.xml'})]))));
 zip.file('xl/styles.xml',`<?xml version="1.0"?><styleSheet xmlns="${ns}"><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs></styleSheet>`);
 zip.file('[Content_Types].xml',stringify(doc(el('Types',{xmlns:'http://schemas.openxmlformats.org/package/2006/content-types'},[el('Default',{Extension:'rels',ContentType:'application/vnd.openxmlformats-package.relationships+xml'}),el('Default',{Extension:'xml',ContentType:'application/xml'}),el('Override',{PartName:'/xl/workbook.xml',ContentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'}),el('Override',{PartName:'/xl/styles.xml',ContentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml'}),...types]))));
 return read(await zip.generateAsync({type:'uint8array'}));}
g.ExcelLocal={read,write,set,append,fromTables};if(typeof module!=='undefined')module.exports=g.ExcelLocal;
})(globalThis);

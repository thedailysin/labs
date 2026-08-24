(function(){
  const fallback=Array.isArray(window.PORTFOLIO_PROJECTS)?window.PORTFOLIO_PROJECTS:[];
  const configuredUrl=(window.PORTFOLIO_SHEET_URL||window.PORTFOLIO_SHEET_CSV_URL||'').trim();
  const isGoogleSheet=/docs\.google\.com\/spreadsheets/i.test(configuredUrl);

  function csvRows(text){
    const rows=[];let row=[],cell='',quoted=false;
    for(let i=0;i<text.length;i++){
      const char=text[i],next=text[i+1];
      if(char==='"'&&quoted&&next==='"'){cell+='"';i++;continue}
      if(char==='"'){quoted=!quoted;continue}
      if(char===','&&!quoted){row.push(cell);cell='';continue}
      if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')i++;row.push(cell);if(row.some(value=>value.trim()))rows.push(row);row=[];cell='';continue}
      cell+=char;
    }
    row.push(cell);if(row.some(value=>value.trim()))rows.push(row);return rows;
  }

  const list=value=>(value||'').split(/\n|;|,|\s+·\s+/).map(item=>item.trim()).filter(Boolean);
  const longList=value=>(value||'').split(/\n|\|\|/).map(item=>item.replace(/^\s*[•·*-]\s*/,'').trim()).filter(Boolean);
  const slugify=value=>(value||'project').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  function mediaCell(value){
    const raw=(value||'').trim();if(!raw)return null;
    const match=raw.match(/^([fhov])\s*(?:\||,|:)\s*(.+)$/i);
    const code=match?match[1].toUpperCase():'F',mediaUrl=(match?match[2]:raw).trim();
    return mediaUrl?{layout:{F:'full',H:'half',O:'original',V:'video'}[code]||'full',url:mediaUrl}:null;
  }
  function recordsToProjects(records){
    return records.filter(record=>record.Projects).map((record,sheetOrder)=>{
      const media=Array.from({length:11},(_,index)=>mediaCell(record[`M${index+1}`])).filter(Boolean);
      return {
        priority:Number(record.Priority)||0,sheetOrder,
        slug:slugify(record.Projects),title:record.Projects,
        categories:list(record.Discipline),industries:list(record.Sector),client:record.Client||'Independent',
        roles:list(record.Roles),summary:record.Desc||'',about:record['About the Project']||'',
        challenge:record['The Challenge']||'',solution:record['The Solution']||'',
        blurbs:longList(record.Blurbs),tools:list(record['Tools used']),credits:list(record.Collaborators),
        media,cover:media[0]?.url||''
      };
    });
  }
  function parseCsv(text){
    const rows=csvRows(text),headers=(rows.shift()||[]).map(header=>header.trim());
    return recordsToProjects(rows.map(values=>Object.fromEntries(headers.map((header,index)=>[header,String(values[index]??'').trim()]))));
  }
  function parseGoogleTable(data){
    if(data?.status==='error')throw new Error(data.errors?.[0]?.detailed_message||'Google Sheets query failed');
    const headers=(data?.table?.cols||[]).map(column=>String(column.label||column.id||'').trim());
    const records=(data?.table?.rows||[]).map(row=>Object.fromEntries(headers.map((header,index)=>[header,String(row.c?.[index]?.v??'').trim()])));
    return recordsToProjects(records);
  }
  function loadGoogleSheet(value){
    return new Promise((resolve,reject)=>{
      const callback=`__portfolioSheet_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const timer=setTimeout(()=>finish(new Error('Google Sheets timed out')),12000),script=document.createElement('script');
      function finish(error,data){clearTimeout(timer);script.remove();delete window[callback];error?reject(error):resolve(data)}
      window[callback]=data=>{try{finish(null,parseGoogleTable(data))}catch(error){finish(error)}};
      const source=new URL(value,location.href),match=source.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
      if(match&&!source.pathname.includes('/gviz/tq'))source.pathname=`/spreadsheets/d/${match[1]}/gviz/tq`;
      source.searchParams.delete('usp');source.searchParams.set('tqx',`out:json;responseHandler:${callback}`);
      script.src=source.href;script.onerror=()=>finish(new Error('Google Sheets script could not load'));document.head.appendChild(script);
    });
  }

  window.PORTFOLIO_DATA_READY=(async()=>{
    if(!configuredUrl)return fallback;
    try{
      let projects;
      if(isGoogleSheet)projects=await loadGoogleSheet(configuredUrl);
      else{const response=await fetch(configuredUrl,{cache:'no-store'});if(!response.ok)throw new Error(`Content source returned ${response.status}`);projects=parseCsv(await response.text())}
      if(!projects.length)throw new Error('No project rows found');
      window.PORTFOLIO_PROJECTS=projects;
      document.documentElement.dataset.contentSource='google-sheets';
      return projects;
    }catch(error){
      console.warn('Using bundled project data because Google Sheets could not be loaded.',error);
      document.documentElement.dataset.contentSource='fallback';
      return fallback;
    }
  })();
})();

(() => {
  'use strict';
  const SIZES={'1:1':[1080,1080],'4:5':[1080,1350],'9:16':[1080,1920],'16:9':[1920,1080]};
  const THEMES=[
    {key:'minimal-light',name:'Minimalista claro',colors:['#f8f6f1','#e8e1d7','#b9aa96'],font:'Manrope',text:'#172033',size:72,position:'center',shapes:['lines','circles'],gradient:'linear',direction:'135',contrast:.08},
    {key:'minimal-dark',name:'Minimalista escuro',colors:['#101218','#252a35','#5d6575'],font:'Inter',text:'#ffffff',size:72,position:'center',shapes:['lines','blocks'],gradient:'linear',direction:'135',contrast:.26},
    {key:'corporate-blue',name:'Azul corporativo',colors:['#092a52','#0d62a8','#32a4dc'],font:'Montserrat',text:'#ffffff',size:70,position:'left',shapes:['blocks','lines'],gradient:'linear',direction:'45',contrast:.28},
    {key:'impact-red',name:'Vermelho de impacto',colors:['#280407','#b20d19','#ff4538'],font:'Anton',text:'#ffffff',size:82,position:'left',shapes:['blocks','lines'],gradient:'radial',direction:'center',contrast:.30},
    {key:'news',name:'Jornalístico',colors:['#f5f0e6','#1d2633','#b51e27'],font:'Merriweather',text:'#172033',size:64,position:'left',shapes:['lines','blocks'],gradient:'linear',direction:'180',contrast:.10,break:true},
    {key:'politics-blue',name:'Política azul',colors:['#061b3c','#174c8f','#d8b85a'],font:'Merriweather',text:'#ffffff',size:68,position:'center',shapes:['waves','lines'],gradient:'linear',direction:'135',contrast:.28,break:true},
    {key:'politics-red',name:'Política vermelho',colors:['#330608','#8f111a','#e0b85c'],font:'Merriweather',text:'#ffffff',size:68,position:'center',shapes:['waves','lines'],gradient:'linear',direction:'135',contrast:.30,break:true},
    {key:'technology',name:'Tecnologia',colors:['#07172d','#044f63','#17e5c1'],font:'DM Sans',text:'#ecfffb',size:70,position:'left',shapes:['circles','lines'],gradient:'radial',direction:'top-right',contrast:.24},
    {key:'modern-gradient',name:'Gradiente moderno',colors:['#4527a0','#c43ad6','#ff8a5b'],font:'Plus Jakarta Sans',text:'#ffffff',size:72,position:'center',shapes:['circles','waves'],gradient:'linear',direction:'135',contrast:.18},
    {key:'piseiro',name:'Entretenimento e piseiro',colors:['#42115f','#ec1879','#ffca28'],font:'Bebas Neue',text:'#ffffff',size:86,position:'center',shapes:['waves','circles','blocks'],gradient:'radial',direction:'center',contrast:.22,break:true}
  ];
  const esc=v=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));
  const data=svg=>'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));
  function geometry(s,w,h){
    const portrait=h>w,wide=w/h>1.35,o=Math.max(.05,Math.min(.8,+s.opacity||.28)),out=[];
    if(s.shapes.includes('circles')){
      out.push(`<circle cx="${portrait?w*.82:w*.88}" cy="${portrait?h*.16:h*.22}" r="${Math.min(w,h)*.24}" fill="${s.colors[2]}" opacity="${o}"/>`);
      out.push(`<circle cx="${portrait?w*.08:w*.16}" cy="${portrait?h*.82:h*.8}" r="${Math.min(w,h)*.14}" fill="none" stroke="${s.colors[1]}" stroke-width="${Math.max(8,w*.012)}" opacity="${o*.8}"/>`);
    }
    if(s.shapes.includes('blocks')){
      const bw=portrait?w*.38:w*.26,bh=portrait?h*.18:h*.42;
      out.push(`<rect x="${w-bw*.72}" y="${portrait?h*.68:-h*.05}" width="${bw}" height="${bh}" rx="${Math.min(w,h)*.04}" transform="rotate(${portrait?-12:8} ${w-bw/2} ${h*.6})" fill="${s.colors[2]}" opacity="${o}"/>`);
      out.push(`<rect x="${-bw*.38}" y="${portrait?h*.05:h*.58}" width="${bw}" height="${bh*.55}" rx="${Math.min(w,h)*.025}" fill="${s.colors[1]}" opacity="${o*.65}"/>`);
    }
    if(s.shapes.includes('lines')){
      const count=wide?9:7;
      for(let i=0;i<count;i++)out.push(`<line x1="${w*(.05+i/count)}" y1="${portrait?0:h*.04}" x2="${w*(.25+i/count)}" y2="${portrait?h*.28:h*.55}" stroke="${s.colors[2]}" stroke-width="${Math.max(2,w*.003)}" opacity="${o*.35}"/>`);
    }
    if(s.shapes.includes('waves')){
      const y=portrait?h*.78:h*.73,amp=portrait?h*.07:h*.13;
      out.push(`<path d="M0 ${y} C ${w*.18} ${y-amp},${w*.32} ${y+amp},${w*.5} ${y} S ${w*.82} ${y-amp},${w} ${y+amp*.15} V${h}H0Z" fill="${s.colors[2]}" opacity="${o}"/>`);
      out.push(`<path d="M0 ${y+amp*.35} C ${w*.25} ${y+amp},${w*.7} ${y-amp*.25},${w} ${y+amp*.7}" fill="none" stroke="#fff" stroke-width="${Math.max(3,w*.005)}" opacity="${o*.45}"/>`);
    }
    return out.join('');
  }
  function render(settings,ratio){
    const [w,h]=SIZES[ratio],s={...settings,colors:[...(settings.colors||['#172033','#6d4aff','#38e0a0'])],shapes:[...(settings.shapes||[])]};
    const dir={'0':['0%','50%','100%','50%'],'45':['0%','100%','100%','0%'],'90':['50%','100%','50%','0%'],'135':['0%','0%','100%','100%'],'180':['100%','50%','0%','50%']}[s.direction]||['0%','0%','100%','100%'];
    const grad=s.gradient==='radial'?`<radialGradient id="g" cx="${s.direction==='top-right'?'85%':'50%'}" cy="${s.direction==='top-right'?'15%':'50%'}"><stop stop-color="${esc(s.colors[2])}"/><stop offset=".48" stop-color="${esc(s.colors[1])}"/><stop offset="1" stop-color="${esc(s.colors[0])}"/></radialGradient>`:`<linearGradient id="g" x1="${dir[0]}" y1="${dir[1]}" x2="${dir[2]}" y2="${dir[3]}"><stop stop-color="${esc(s.colors[0])}"/><stop offset=".55" stop-color="${esc(s.colors[1])}"/><stop offset="1" stop-color="${esc(s.colors[2])}"/></linearGradient>`;
    const texture=s.texture?`<filter id="noise"><feTurbulence baseFrequency=".7" numOctaves="2" seed="8" type="fractalNoise"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .055 0"/></filter>`:'';
    const portrait=h>w,pad=(s.padding||7)/100,x=s.position==='left'?w*pad:s.position==='right'?w*(1-pad):w*.5,areaW=w*(s.maxWidth||80)/100,areaH=portrait?h*.42:h*.62,areaY=portrait?h*.5:h*.5;
    const contrast=`<rect x="${Math.max(0,x-(s.position==='center'?areaW/2:s.position==='left'?w*.02:areaW-w*.02))}" y="${areaY-areaH/2}" width="${areaW}" height="${areaH}" rx="${Math.min(w,h)*.035}" fill="${s.contrastColor||'#000'}" opacity="${Math.max(0,Math.min(.7,+s.contrast||0))}"/>`;
    return data(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${grad}${texture}</defs><rect width="${w}" height="${h}" fill="url(#g)"/>${geometry(s,w,h)}${s.texture?`<rect width="${w}" height="${h}" filter="url(#noise)" opacity=".55"/>`:''}${contrast}</svg>`);
  }
  function breakImage(settings,ratio){
    if(!settings.break)return null;const [w,h]=SIZES[ratio],portrait=h>w,y=portrait?h*.76:h*.82;
    return data(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M0 ${y} C${w*.25} ${y-h*.025},${w*.7} ${y+h*.025},${w} ${y}" fill="none" stroke="${settings.colors[2]}" stroke-width="${Math.max(8,w*.012)}" opacity=".9"/></svg>`);
  }
  function makeTemplate(settings,ratio,extra={}){
    const pos=settings.position||'center';
    return {id:extra.id||`theme-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,name:extra.name||settings.name,ratio,background:render(settings,ratio),breakImage:breakImage(settings,ratio),logo:null,builtin:!!extra.builtin,generator:{...settings,ratio},config:{fontFamily:settings.font||'Inter',fill:settings.text||'#ffffff',textAlign:pos==='center'?'center':pos==='right'?'right':'left',fontSize:+settings.size||72,minFontSize:+settings.minSize||28,maxWidth:+settings.maxWidth||80,padding:+settings.padding||7,lineHeight:+settings.lineHeight||1.12,x:pos==='left'?10:pos==='right'?90:50,y:50,palette:settings.colors,safeArea:{padding:+settings.padding||7}}};
  }
  function seed(db){
    if(db.libraryVersion)return false;
    db.libraryVersion=1;
    for(const theme of THEMES)for(const ratio of Object.keys(SIZES))db.templates.push(makeTemplate({...theme,opacity:.28,texture:true,padding:7,maxWidth:80,minSize:28,lineHeight:1.12},ratio,{id:`builtin-${theme.key}-${ratio.replace(':','x')}`,name:`${theme.name} — ${ratio}`,builtin:true}));
    return true;
  }
  window.ThemeLibrary={themes:THEMES,sizes:SIZES,render,makeTemplate,seed};
})();

/* Hakeem Al Raazi concept. Kit 11 (accordion), 18 (reveals), 19 (micro) from ~/projects/leads/kit, plus clinic hours + Hijama days. */
/* 11-services-accordion.html */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.querySelectorAll('[data-k-acc]').forEach(function(root){
    var rows=[].slice.call(root.querySelectorAll('.k-acc__row'));
    // smooth open/close
    rows.forEach(function(d){var s=d.querySelector('summary'),b=d.querySelector('.k-acc__body');
      s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
        if(d.open){var h=b.offsetHeight;b.animate({height:[h+'px','0px'],opacity:[1,0]},{duration:380,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){d.open=false};}
        else{d.open=true;var h2=b.offsetHeight;b.animate({height:['0px',h2+'px'],opacity:[0,1]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});}});});
    if(!FINE||RM)return;
    var fl=document.createElement('div');fl.className='k-acc__float';fl.setAttribute('aria-hidden','true');document.body.appendChild(fl);
    var imgs={};rows.forEach(function(d){var u=d.getAttribute('data-img');if(!u)return;var i=new Image();i.src=u;i.alt='';i.decoding='async';fl.appendChild(i);imgs[u]=i});
    var tx=0,ty=0,x=0,y=0,run=false,rtl=getComputedStyle(root).direction==='rtl';
    function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;fl.style.setProperty('--fx',x+'px');fl.style.setProperty('--fy',y+'px');if(run)requestAnimationFrame(loop)}
    root.addEventListener('pointermove',function(e){var w=fl.offsetWidth,h=fl.offsetHeight;tx=rtl?e.clientX-w-40:e.clientX+40;ty=e.clientY-h/2;
      if(tx+w>innerWidth)tx=e.clientX-w-40;if(tx<0)tx=e.clientX+40;});
    rows.forEach(function(d){var s=d.querySelector('summary'),u=d.getAttribute('data-img');if(!u)return;
      s.addEventListener('pointerenter',function(){for(var k in imgs)imgs[k].classList.toggle('is-on',k===u);fl.classList.add('is-on');if(!run){run=true;x=tx;y=ty;loop()}});
      s.addEventListener('pointerleave',function(){fl.classList.remove('is-on');run=false});});
  });
})();

/* 18-reveal-utilities.html */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;
  // stagger
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  // split lines (by measuring word tops)
  function split(el){
    // keeps inline child elements (e.g. <span class="ar" lang="ar">, <em>) whole, with their class/lang/style
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    // screen readers get the text once from a visually hidden copy (aria-label isn't allowed on spans)
    el.innerHTML='<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  // observe
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  // clip reveals are fully clipped (zero visible area), which IntersectionObserver never reports, so watch their parent
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  // parallax
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&px.length){var tk=false;function upd(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}
  // Lenis (opt-in)
  if(DESK&&d.hasAttribute('data-lenis')){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js';s.async=true;
    s.onload=function(){if(!window.Lenis)return;var l=new Lenis({lerp:.11,smoothWheel:true});window.kLenis=l;(function raf(t){l.raf(t);requestAnimationFrame(raf)})(performance.now());
      document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();l.scrollTo(t,{offset:-70})}})};
    document.head.appendChild(s);}
})();

/* 19-magnetic-micro.html */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();


/* Clinic: split-shift hours, live badge in Abu Dhabi time. 0=Sun..6=Sat, hours as [from,to] pairs */
(function(){
  var H={0:[[10,14]],1:[[10,14],[18,22]],2:[[10,14],[18,22]],3:[[10,14],[18,22]],4:[[10,14],[18,22]],5:[[18,22]],6:[[10,14],[18,22]]};
  var AR=document.documentElement.lang==='ar';
  function nowUAE(){var p={};new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
    return {d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),h:(+p.hour%24)+(+p.minute)/60}}
  function fmt(h){if(AR)return (h>12?h-12:h)+(h<12?' صباحاً':' مساءً');return (h>12?h-12:h)+(h<12?'am':'pm')}
  var DN=AR?['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function status(){var n=nowUAE(),t=H[n.d]||[];
    for(var i=0;i<t.length;i++)if(n.h>=t[i][0]&&n.h<t[i][1])return {open:true,txt:AR?'مفتوح الآن، حتى '+fmt(t[i][1]):'Open now, until '+fmt(t[i][1])};
    for(i=0;i<t.length;i++)if(n.h<t[i][0])return {open:false,txt:AR?'مغلق الآن، نفتح '+fmt(t[i][0]):'Closed now, opens at '+fmt(t[i][0])};
    for(var k=1;k<8;k++){var d=(n.d+k)%7;if(H[d]&&H[d].length)return {open:false,txt:AR?'مغلق الآن، نفتح '+DN[d]+' '+fmt(H[d][0][0]):'Closed now, opens '+(k===1?'tomorrow':DN[d])+' at '+fmt(H[d][0][0])}}}
  var s=status(),n=nowUAE();
  document.querySelectorAll('[data-open-badge]').forEach(function(b){b.hidden=false;b.classList.toggle('is-open',s.open);b.querySelector('span').textContent=s.txt});
  document.querySelectorAll('[data-day="'+n.d+'"]').forEach(function(r){r.classList.add('is-today')});
})();

/* Hijama days: the odd days from the 15th to the 29th of the Islamic month (as on the clinic's monthly poster),
   from the Umm al-Qura calendar. The static list in the HTML is the fallback for no-JS. */
(function(){
  var box=document.querySelector('[data-hijama]'),nx=document.querySelector('[data-hijama-next]');if(!box&&!nx)return;
  try{
    var AR=document.documentElement.lang==='ar',loc=AR?'ar-AE-u-ca-islamic-umalqura-nu-latn':'en-u-ca-islamic-umalqura';
    var hf=new Intl.DateTimeFormat(loc,{day:'numeric',month:'long',timeZone:'Asia/Dubai'});
    var gf=new Intl.DateTimeFormat(AR?'ar-AE-u-nu-latn':'en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'Asia/Dubai'});
    var parts=function(d){var o={};hf.formatToParts(d).forEach(function(x){o[x.type]=x.value});return o};
    var today=new Date(),list=[],month=null;
    for(var i=0;i<60&&list.length<8;i++){var d=new Date(today.getTime()+i*864e5),p=parts(d),day=+p.day;
      if(day>=15&&day%2===1){if(month===null)month=p.month;if(p.month!==month)break;list.push({d:d,day:day,m:p.month})}}
    if(!list.length)return;
    var sf=new Intl.DateTimeFormat(AR?'ar-AE-u-nu-latn':'en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'Asia/Dubai'});
    if(nx){var f=list[0],wd=f.d.toLocaleDateString('en-US',{weekday:'short',timeZone:'Asia/Dubai'}),
      nt=wd==='Fri'?(AR?'مساءً فقط':'evening only'):wd==='Sun'?(AR?'صباحاً فقط':'morning only'):'';
      nx.innerHTML='<b>'+f.day+'</b><span>'+sf.format(f.d).replace(',','')+'<small>'+f.day+' '+f.m+(nt?' · '+nt:'')+'</small></span>'}
    if(!box)return;
    var ul=box.querySelector('ol'),head=box.querySelector('[data-hijama-month]');
    if(head)head.textContent=list[0].m;
    ul.innerHTML=list.map(function(x){var g=gf.format(x.d),fri=x.d.toLocaleDateString('en-US',{weekday:'short',timeZone:'Asia/Dubai'})==='Fri',sun=x.d.toLocaleDateString('en-US',{weekday:'short',timeZone:'Asia/Dubai'})==='Sun';
      var note=fri?(AR?'مساءً فقط':'evening only'):sun?(AR?'صباحاً فقط':'morning only'):'';
      return '<li><b>'+x.day+'</b><span>'+g+(note?'<small>'+note+'</small>':'')+'</span></li>'}).join('');
  }catch(e){}
})();

/* Map: loads only when tapped */
(function(){
  document.querySelectorAll('[data-map]').forEach(function(m){var b=m.querySelector('button');if(!b)return;
    b.addEventListener('click',function(){var f=document.createElement('iframe');f.src=m.getAttribute('data-map');f.title=b.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.innerHTML='';m.appendChild(f);m.classList.add('is-loaded')})});
})();

/* Header: hairline shadow once scrolled; mobile menu */
(function(){
  var h=document.querySelector('.hd');if(!h)return;
  var on=function(){h.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on();
  var t=h.querySelector('.hd__menu'),n=document.getElementById('nav');
  if(t&&n)t.addEventListener('click',function(){var o=t.getAttribute('aria-expanded')==='true';t.setAttribute('aria-expanded',String(!o));h.classList.toggle('is-open',!o)});
})();

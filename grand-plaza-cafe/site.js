/* Grand Plaza Cafe concept, Websmith. Kit 18 reveals, kit 19 magnetic, kit 12 menu tabs, kit 16 hours (New York time). */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* header border on scroll */
  var hd=document.querySelector('.hd');
  if(hd){var onS=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',onS,{passive:true});onS()}

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim().replace(/\s+/g,' '));
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&DESK&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* kit 12: menu tabs */
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]'),ink=tabs.querySelector('.k-menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function line(b){ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+b.offsetLeft+'px)'}
    function pick(b){btns.forEach(function(x){x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b)}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var n=btns[(i+(e.key==='ArrowRight'?1:-1)+btns.length)%btns.length];n.focus();pick(n)}});
    var first=btns[0];pick(first);
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
  });

  /* kit 16: open now, New York time. Hours from their site. */
  var H={0:[8,14],2:[9,16],3:[9,16],4:[9,16],5:[8,16],6:[8,14.5]};
  var CLOSE={0:'2pm',2:'4pm',3:'4pm',4:'4pm',5:'4pm',6:'2:30pm'},OPEN={0:'8am',2:'9am',3:'9am',4:'9am',5:'8am',6:'8am'};
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  try{
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var span=H[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    var msg;
    if(open)msg='Open now, until '+CLOSE[day];
    else{var nd=day,add=0;if(span.length&&now<span[0]){msg='Closed now, opens '+OPEN[day]+' today'}else{do{nd=(nd+1)%7;add++}while(!H[nd]&&add<8);msg='Closed now, opens '+(add===1?'tomorrow':DAYS[nd])+' '+OPEN[nd]}}
    document.querySelectorAll('[data-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=msg});
    document.querySelectorAll('tr[data-day="'+day+'"]').forEach(function(r){r.classList.add('is-today')});
  }catch(e){}

  /* menu page: jump bar marks the section in view */
  var jl=[].slice.call(document.querySelectorAll('.jump a'));
  if(jl.length&&'IntersectionObserver' in window){
    var map={};jl.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var jo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){jl.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a){a.classList.add('is-on');var p=a.parentElement;p.scrollTo({left:a.offsetLeft-20,behavior:RM?'auto':'smooth'})}}})},{rootMargin:'-30% 0px -60% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)jo.observe(s)});
  }
})();

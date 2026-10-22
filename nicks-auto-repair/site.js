/* Nick's Auto Repair concept: reveals (kit 18), magnetic + roll (kit 19), live open/closed in Canandaigua time, mobile call bar */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero / page hero: start once fonts are ready (so the name doesn't reflow mid-rise)
  var heroes=document.querySelectorAll('.hero,.pghero');
  function go(){heroes.forEach(function(h){h.classList.add('is-in')})}
  if(RM)go();else if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,900)})]).then(function(){requestAnimationFrame(go)})}else go();

  // ---- kit 18: stagger, line split, observer
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var full=el.textContent.trim().replace(/\s+/g,' ');
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML='<span class="vh">'+esc(full)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
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

  // ---- kit 19: magnetic main buttons (fine pointers only)
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  // ---- open / closed, Canandaigua (America/New_York) time
  // Mon-Fri 7:30-5:30, Sat 8:00-noon, Sun closed (from their Services page)
  var H={1:[7.5,17.5],2:[7.5,17.5],3:[7.5,17.5],4:[7.5,17.5],5:[7.5,17.5],6:[8,12]};
  var NAMES=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function fmt(h){var hh=Math.floor(h),m=Math.round((h-hh)*60);if(hh===12&&!m)return'noon';var ap=hh>=12?'pm':'am';var h12=hh%12||12;return h12+(m?':'+String(m).padStart(2,'0'):'')+' '+ap}
  try{
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(p.find(function(x){return x.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday'));var now=(+g('hour')%24)+(+g('minute'))/60;
    var today=H[day],open=today&&now>=today[0]&&now<today[1],txt;
    if(open)txt='Open now, until '+fmt(today[1]);
    else{
      var d=day,first=true,nx=null;
      for(var i=0;i<8;i++){var hh=H[d];if(hh&&!(first&&now>=hh[0])){nx=[d,hh];break}d=(d+1)%7;first=false}
      txt='Closed now. Opens '+(nx[0]===day?'today':(nx[0]===(day+1)%7?'tomorrow':NAMES[nx[0]]))+' at '+fmt(nx[1][0]);
    }
    document.querySelectorAll('[data-status]').forEach(function(s){s.classList.add(open?'is-open':'is-closed');var t=s.querySelector('[data-status-text]');if(t)t.textContent=txt+' (Canandaigua time)'});
    document.querySelectorAll('.hours tr[data-day]').forEach(function(r){if(+r.getAttribute('data-day')===day)r.classList.add('is-today')});
  }catch(e){}

  // ---- mobile call bar: appears once the hero's own call button has scrolled away
  var bar=document.querySelector('.callbar'),anchor=document.querySelector('[data-callbar-after]');
  if(bar&&anchor&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(e){var past=!e.isIntersecting&&e.boundingClientRect.top<0;bar.classList.toggle('is-on',past);bar.toggleAttribute('inert',!past)})}).observe(anchor);
  }
})();

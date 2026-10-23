/* Shai Wa Rigag concept · Websmith · motion + small behaviours (kit 12/16/18/19, restyled) */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero: start once fonts are in (or after 900ms) */
  var hero=document.querySelector('[data-hero]');
  if(hero){var go=function(){hero.classList.add('is-go')};
    if(RM)go();else{var t=setTimeout(go,900);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){clearTimeout(t);requestAnimationFrame(go)})}}

  /* header border on scroll */
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};on();addEventListener('scroll',on,{passive:true})}

  /* live open/closed (Dubai time) — open daily 7:00–24:00 */
  document.querySelectorAll('[data-hours]').forEach(function(b){
    var s=JSON.parse(b.getAttribute('data-hours'));
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return +((p.find(function(x){return x.type===t})||{}).value||0)};
    var now=(g('hour')%24)+g('minute')/60,open=now>=s[0]&&now<s[1];
    b.hidden=false;b.classList.add(open?'is-open':'is-shut');
    b.querySelector('span').textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut');
  });

  /* kit 18: reveals + line split */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;
    var words=el.textContent.trim().split(/\s+/);
    el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(top===null||Math.abs(t-top)>4){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML='<span class="vh">'+esc(words.join(' '))+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
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
  /* parallax (desktop) */
  var DESK=matchMedia('(min-width:980px) and (pointer:fine)').matches,px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;e.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0) scale(1.12)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd()}

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* kit 16: tap-to-load map */
  document.querySelectorAll('[data-map]').forEach(function(m){
    var btn=m.querySelector('button');
    var load=function(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)};
    if(btn)btn.addEventListener('click',load);
  });

  /* kit 12: menu tabs */
  document.querySelectorAll('[data-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-menu-tabs]'),ink=tabs.querySelector('.menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.mi li'),function(li,i){li.style.setProperty('--i',i)})});
    var line=function(b){ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+b.offsetLeft+'px)'};
    var pick=function(b,focusPanel){btns.forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b);
      if(b.scrollIntoView&&tabs.scrollWidth>tabs.clientWidth)b.scrollIntoView({block:'nearest',inline:'center',behavior:RM?'auto':'smooth'})};
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b);var top=root.getBoundingClientRect().top+scrollY-parseInt(getComputedStyle(d).getPropertyValue('--hh'));if(scrollY>top+40)scrollTo({top:top,behavior:RM?'auto':'smooth'})})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});var rtl=d.dir==='rtl';var nx=e.key==='ArrowRight'?(rtl?-1:1):e.key==='ArrowLeft'?(rtl?1:-1):0;if(nx){var n=btns[(i+nx+btns.length)%btns.length];n.focus();pick(n)}});
    var first=btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||btns[0];
    pick(first);
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){line(first)});
  });
})();

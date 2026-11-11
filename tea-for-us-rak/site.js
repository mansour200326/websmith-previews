/* Tea For Us concept, Websmith. Kit 18 reveal, 19 magnetic, 07 marquee, 12 menu tabs, 06 counter + header + tap-to-load map. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;
  // stagger
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  // split lines (by measuring word tops)
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
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
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr||m.dataset.kReady)return;m.dataset.kReady=1;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.querySelectorAll('a,button').forEach(function(a){a.tabIndex=-1});m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });
})();
(function(){
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]'),ink=tabs.querySelector('.k-menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function line(b){ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+(b.offsetLeft)+'px)'}
    function pick(b){btns.forEach(function(x){x.setAttribute('aria-selected',x===b)});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b)}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var n=btns[(i+(e.key==='ArrowRight'?1:-1)+btns.length)%btns.length];n.focus();pick(n)}});
    var hb=location.hash&&btns.find(function(b){return b.dataset.tab===location.hash.slice(1)});var first=hb||btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||btns[0];pick(first);
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){pick(first);o.disconnect()}},{threshold:.15}).observe(root);
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
    line(first);
  });
})();
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('[data-k-count]');if(!els.length||RM)return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);run(e.target)})},{threshold:.5});
  els.forEach(function(el){
    var to=parseFloat(el.getAttribute('data-k-count')),dec=+el.getAttribute('data-k-count-dec')||0,from=parseFloat(el.getAttribute('data-k-count-from')||0);
    el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';
    el.textContent=fmt(el,from,dec);io.observe(el);
  });
  function fmt(el,v,dec){var loc=el.getAttribute('data-k-count-locale')||'en-US';return v.toLocaleString(loc,{minimumFractionDigits:dec,maximumFractionDigits:dec})+(el.getAttribute('data-k-count-suffix')||'')}
  function run(el){
    var to=parseFloat(el.getAttribute('data-k-count')),dec=+el.getAttribute('data-k-count-dec')||0,from=parseFloat(el.getAttribute('data-k-count-from')||0),d=1600,t0=performance.now();
    (function f(t){var k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,4);el.textContent=fmt(el,from+(to-from)*e,dec);if(k<1)requestAnimationFrame(f)})(t0);
  }
})();
(function(){
  // header rule once the page scrolls
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',f,{passive:true});f();}
  // map loads only when tapped (saves ~400KB of Google JS)
  document.querySelectorAll('[data-map]').forEach(function(box){
    var b=box.querySelector('button,.visit__maplink');if(!b)return;
    b.addEventListener('click',function(e){e.preventDefault();
      var i=document.createElement('iframe');i.src=box.getAttribute('data-map');i.title=box.getAttribute('data-map-title')||'Map';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';
      i.onload=function(){i.classList.add('is-on')};box.appendChild(i);var p=box.querySelector('p');if(p)p.remove();else b.remove();
    });
  });
})();
(function(){
  // deep links from the home page (services.html#juice): scroll to the menu once it is laid out
  var h=location.hash.slice(1);if(!h||!document.querySelector('[data-k-menu-tabs] [data-tab="'+h+'"]'))return;
  addEventListener('load',function(){var m=document.querySelector('[data-k-menu]');if(m)m.scrollIntoView()});
})();
(function(){
  // keep the selected menu tab visible inside its scroll row (moves the row only, never the page)
  var row=document.querySelector('[data-k-menu-tabs]');if(!row)return;
  function show(b){var r=row.getBoundingClientRect(),q=b.getBoundingClientRect(),m=24;
    if(q.right>r.right-m)row.scrollLeft+=q.right-r.right+m;else if(q.left<r.left+m)row.scrollLeft-=r.left+m-q.left;}
  row.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',function(){show(b)})});
  addEventListener('load',function(){var b=row.querySelector('[aria-selected=true]');if(b)show(b)});
})();

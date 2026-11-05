/* 07-marquee.html */
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

/* 08-gallery-masonry-lightbox.html */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,RTL=document.documentElement.dir==='rtl';
  document.querySelectorAll('[data-k-gal]').forEach(function(root){
    var items=[].slice.call(root.querySelectorAll('.k-gal__item'));
    // reveal
    var io=new IntersectionObserver(function(es){es.forEach(function(e,k){if(e.isIntersecting){var el=e.target;setTimeout(function(){el.classList.add('is-in')},RM?0:(k%4)*90);io.unobserve(el)}})},{rootMargin:'0px 0px -8% 0px'});
    // items on a CSS-column break can be skipped by the observer: on scroll, reveal anything above the fold line
    var sweep=function(){var left=0;items.forEach(function(i){if(i.classList.contains('is-in'))return;left++;if(i.getBoundingClientRect().top<innerHeight*.92)i.classList.add('is-in')});if(!left)removeEventListener('scroll',onS)},tk=0;
    var onS=function(){clearTimeout(tk);tk=setTimeout(sweep,150)};addEventListener('scroll',onS,{passive:true});
    items.forEach(function(i){io.observe(i)});
    // filter
    var fb=root.querySelector('[data-k-gal-filter]');
    if(fb)fb.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var c=b.dataset.cat;
      fb.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      items.forEach(function(i){i.hidden=!(c==='all'||i.dataset.cat===c);if(!i.hidden)i.classList.add('is-in')})});
    // lightbox
    var lb=document.querySelector('.k-lb');
    if(!lb){lb=document.createElement('dialog');lb.className='k-lb';lb.setAttribute('aria-label','Photo viewer');
      lb.innerHTML='<div class="k-lb__top"><span class="k-lb__count"></span><button class="k-lb__close" aria-label="Close">×</button></div><div class="k-lb__stage"><button class="k-lb__nav k-lb__prev" aria-label="Previous">←</button><img alt=""><button class="k-lb__nav k-lb__next" aria-label="Next">→</button></div><p class="k-lb__cap"></p>';
      document.body.appendChild(lb);}
    var img=lb.querySelector('img'),cap=lb.querySelector('.k-lb__cap'),cnt=lb.querySelector('.k-lb__count'),cur=0,list=items;
    function show(n){list=items.filter(function(i){return!i.hidden});cur=(n+list.length)%list.length;var a=list[cur];
      img.src=a.href;img.alt=(a.querySelector('img')||{}).alt||'';cap.textContent=a.dataset.cap||'';cnt.textContent=(cur+1)+' / '+list.length;
      img.style.animation='none';void img.offsetWidth;img.style.animation='';}
    items.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();list=items.filter(function(i){return!i.hidden});show(list.indexOf(a));lb.showModal()})});
    lb.querySelector('.k-lb__prev').onclick=function(){show(cur-1)};
    lb.querySelector('.k-lb__next').onclick=function(){show(cur+1)};
    lb.querySelector('.k-lb__close').onclick=function(){lb.close()};
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('k-lb__stage'))lb.close()});
    lb.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(cur+(RTL?-1:1));if(e.key==='ArrowLeft')show(cur+(RTL?1:-1))});
    var x0=null;lb.addEventListener('pointerdown',function(e){x0=e.clientX});
    lb.addEventListener('pointerup',function(e){if(x0===null)return;var dx=e.clientX-x0;x0=null;if(Math.abs(dx)>50)show(cur+((dx<0)!==RTL?1:-1))});
  });
})();

/* 16-map-hours.html */
(function(){
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var tz=root.getAttribute('data-k-tz')||'Asia/Dubai';
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-k-open')||'Open now'):(root.getAttribute('data-k-shut')||'Closed now')}
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
    // desktop: load automatically when near; phones: wait for tap (data + scroll-trap)
    if(!m.hasAttribute('data-k-map-tap')&&matchMedia('(min-width:900px)').matches)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();load()}},{rootMargin:'200px'}).observe(m);
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

/* 19-magnetic-micro.html */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();


/* KADI: header edge once scrolled */
(function(){var h=document.querySelector('.hdr');if(!h)return;function f(){h.classList.toggle('is-stuck',scrollY>8)}addEventListener('scroll',f,{passive:true});f()})();
/* KADI: drop the hero mark's entry animation once it has played (keeps it stable for print and full-page captures) */
document.querySelectorAll('.hero__word-in,.hero__mark').forEach(function(e){e.addEventListener('animationend',function(){e.style.animation='none'},{once:true})});
/* KADI: phone menu sheet */
(function(){
  var b=document.querySelector('.hdr__menu'),s=document.getElementById('menu');if(!b||!s)return;
  var labOpen=b.textContent,labClose=document.documentElement.lang==='ar'?'إغلاق':'Close';
  function set(o){s.hidden=!o;b.setAttribute('aria-expanded',o);b.textContent=o?labClose:labOpen;document.documentElement.classList.toggle('is-menu',o);if(o){var f=s.querySelector('a');f&&f.focus()}}
  b.addEventListener('click',function(){set(s.hidden)});
  s.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!s.hidden){set(false);b.focus()}});
  matchMedia('(min-width:900px)').addEventListener('change',function(m){if(m.matches)set(false)});
})();

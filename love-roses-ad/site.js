/* Love Roses concept · kit 05, 07, 16 (hours badge), 18, 19 restyled. Everything is readable without JS. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
      DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* header border once scrolled */
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-stuck',scrollY>40)};addEventListener('scroll',on,{passive:true});on();}

  /* kit 18: reveal */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(function(e){var was=e.classList.contains('is-in');split(e);if(was)e.classList.add('is-in')})};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;ready()}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }

  /* kit 05: one arrangement at a time */
  document.querySelectorAll('[data-k-story]').forEach(function(root){
    var steps=[].slice.call(root.querySelectorAll('[data-k-story-step]')),media=[].slice.call(root.querySelectorAll('[data-k-story-media]'));
    var box=root.querySelector('.k-story__media'),cnt=root.querySelector('.k-story__count');
    if(!('IntersectionObserver' in window))return;
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var n=steps.indexOf(e.target);
      steps.forEach(function(s,k){s.classList.toggle('is-on',k===n)});media.forEach(function(m,k){m.classList.toggle('is-on',k===n)});
      if(box)box.style.setProperty('--k-story-p',((n+1)/steps.length).toFixed(3));
      if(cnt)cnt.textContent=(n+1)+' / '+steps.length;})},{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){so.observe(s)});
  });

  /* kit 07: marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr)return;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 16: live open/closed (Abu Dhabi time, 10am-10pm as posted on their Instagram) */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h=JSON.parse(root.getAttribute('data-k-hours'));
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var now=(+g('hour')%24)+(+g('minute'))/60,open=now>=h[0]&&now<h[1];
    var b=root.querySelector('[data-k-badge]');if(!b)return;b.hidden=false;b.classList.add(open?'is-open':'is-shut');
    b.querySelector('span').textContent=open?root.getAttribute('data-k-open'):root.getAttribute('data-k-shut');
  });

  /* index list: floating photo follows the pointer (desktop only) */
  var peek=document.querySelector('.idx__peek');
  if(peek&&FINE&&!RM){
    document.querySelectorAll('.idx [data-img]').forEach(function(a){
      a.addEventListener('pointerenter',function(){peek.style.backgroundImage='url('+a.getAttribute('data-img')+')';peek.classList.add('is-on')});
      a.addEventListener('pointerleave',function(){peek.classList.remove('is-on')});
      a.addEventListener('pointermove',function(e){peek.style.left=(e.clientX+150*(d.dir==='rtl'?-1:1))+'px';peek.style.top=e.clientY+'px'});
    });
  }

  /* kit 19: magnetic buttons */
  if(FINE&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* Lenis smooth scroll, desktop only (opt-in via <html data-lenis>) */
  if(DESK&&!RM&&d.hasAttribute('data-lenis')){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js';s.async=true;
    s.onload=function(){if(!window.Lenis)return;var l=new Lenis({lerp:.11,smoothWheel:true});(function raf(t){l.raf(t);requestAnimationFrame(raf)})(performance.now());
      document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();l.scrollTo(t,{offset:-70})}})};
    document.head.appendChild(s);}
})();

/* Websmith kit parts: 07 marquee, 11 accordion, 18 reveal, 19 micro */
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


/* Grandma Nursery: header state, menu, timetable progress */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on();}
  var b=document.querySelector('.menu-btn'),dr=document.getElementById('drawer');
  if(b&&dr)b.addEventListener('click',function(){var o=dr.classList.toggle('is-open');b.setAttribute('aria-expanded',o)});
  var list=document.querySelector('.day__list');
  if(list&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    var tk=false;var upd=function(){tk=false;var r=list.getBoundingClientRect(),vh=innerHeight;var p=(vh*.6-r.top)/r.height;p=Math.max(0,Math.min(1,p));list.style.setProperty('--p',p.toFixed(3))};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();
  }
})();

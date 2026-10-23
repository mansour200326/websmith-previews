/* 06-stats-counter.html */
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

/* 09-gallery-drag-scroller.html */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-k-drag]').forEach(function(root){
    var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.15}).observe(root);
    function pos(){return Math.abs(tr.scrollLeft)}
    function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
      if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
      if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
      if(!RM)tr.querySelectorAll('.k-drag__card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-6).toFixed(2)+'%')});}
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
    function step(d){var c=tr.querySelector('.k-drag__card');var w=c?c.getBoundingClientRect().width+20:400;tr.scrollBy({left:d*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
    if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
    // mouse drag with inertia (touch uses native scrolling)
    var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4){tr.classList.add('is-drag')}moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
    addEventListener('pointerup',function(){if(!down)return;down=false;
      if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
    tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
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
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  // safety net (round 2): after a fast scroll the observer can miss elements. On scroll end, and once 3s after load,
  // show every reveal whose top is already above the bottom of the viewport.
  function sweep(){var vh=innerHeight;els.forEach(function(e){if(!e.classList.contains('is-in')&&e.getBoundingClientRect().top<vh){e.classList.add('is-in');var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;io.unobserve(t)}});
    document.querySelectorAll('[data-k-drag]:not(.is-in),.k-fx:not(.is-in)').forEach(function(e){if(e.getBoundingClientRect().top<vh)e.classList.add('is-in')})}
  var se;addEventListener('scroll',function(){clearTimeout(se);se=setTimeout(sweep,160)},{passive:true});
  if('onscrollend' in window)addEventListener('scrollend',sweep);
  setTimeout(sweep,3000);
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

/* 25-photo-print.html */
(function(){
  var els=document.querySelectorAll('[data-k-fx]');if(!els.length)return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var B=[0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  function rgb(h){h=h.replace('#','');var v=parseInt(h.length===3?h.replace(/./g,'$&$&'):h,16);return [v>>16&255,v>>8&255,v&255];}
  function lum(h){var c=rgb(h);return c[0]*.3+c[1]*.59+c[2]*.11;}
  function render(fig){
    var img=fig.querySelector('img'),dith=fig.getAttribute('data-k-fx')==='dither',W=fig.clientWidth,H=fig.clientHeight;
    if(!W||!H||!img.naturalWidth)return;
    var cell=+fig.getAttribute('data-k-fx-cell')||(dith?2:7);cell=dith?Math.max(1.5,cell*Math.min(1,W/700)):Math.min(cell,Math.max(4,W/110));
    var k=+fig.getAttribute('data-k-fx-contrast')||(dith?1.4:1.25),ink=fig.getAttribute('data-k-fx-ink')||'#1b1b1b',paper=fig.getAttribute('data-k-fx-paper')||'#f1ebde';
    var cols=Math.ceil(W/cell),rows=Math.ceil(H/cell),s=document.createElement('canvas');s.width=cols;s.height=rows;
    var sx=s.getContext('2d',{willReadFrequently:true});sx.imageSmoothingQuality='high';
    var sc=Math.max(cols/img.naturalWidth,rows/img.naturalHeight),dw=img.naturalWidth*sc,dh=img.naturalHeight*sc;sx.drawImage(img,(cols-dw)/2,(rows-dh)/2,dw,dh);
    var d;try{d=sx.getImageData(0,0,cols,rows).data}catch(e){return}
    var inv=lum(paper)<lum(ink),L=new Float32Array(cols*rows);
    for(var i=0;i<L.length;i++){var l=(.2126*d[i*4]+.7152*d[i*4+1]+.0722*d[i*4+2])/255;l=Math.min(1,Math.max(0,(l-.5)*k+.5));L[i]=inv?1-l:l;}
    var cv=fig.querySelector('canvas')||fig.appendChild(document.createElement('canvas'));cv.setAttribute('aria-hidden','true');
    fig.style.setProperty('--k-fx-paper',paper);
    if(dith){
      cv.width=cols;cv.height=rows;var cx=cv.getContext('2d'),o=cx.createImageData(cols,rows),a=rgb(ink),b=rgb(paper);
      for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){var j=y*cols+x,c=L[j]<(B[(y%8)*8+x%8]+.5)/64?a:b;o.data[j*4]=c[0];o.data[j*4+1]=c[1];o.data[j*4+2]=c[2];o.data[j*4+3]=255;}
      cx.putImageData(o,0,0);
    }else{
      var dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
      var c2=cv.getContext('2d');c2.scale(dpr,dpr);c2.fillStyle=paper;c2.fillRect(0,0,W,H);c2.fillStyle=ink;c2.beginPath();
      for(var y2=0;y2<rows;y2++)for(var x2=0;x2<cols;x2++){var r=cell*.62*Math.sqrt(1-L[y2*cols+x2]);if(r<.35)continue;var px=x2*cell+cell/2+(y2&1?cell/2:0),py=y2*cell+cell/2;c2.moveTo(px+r,py);c2.arc(px,py,r,0,6.2832);}
      c2.fill();
    }
    fig.classList.add('is-fx');
  }
  els.forEach(function(fig){
    if(fig.dataset.kReady)return;fig.dataset.kReady=1;var img=fig.querySelector('img');if(!img)return;
    var go=function(){render(fig)};if(img.complete&&img.naturalWidth)go();else img.addEventListener('load',go);
    var lw=fig.clientWidth,rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(fig.clientWidth!==lw){lw=fig.clientWidth;go();}},200)});
    if(fig.hasAttribute('data-k-fx-peek'))fig.addEventListener('click',function(){fig.classList.toggle('is-peek')});
    if(RM){fig.classList.add('is-in');return;}
    var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){fig.classList.add('is-in');io.disconnect();}},{threshold:.25});io.observe(fig);
  });
})();

/* Frontyard concept: header state, hero oval window, menu index photo, open-now badge, menu tabs */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px)');
  var hd=document.querySelector('.hd');
  function onScroll(){if(hd)hd.classList.toggle('is-scrolled',scrollY>8)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* open now: both cafés open 7am to 1am, every day (Instagram bio). Abu Dhabi time. */
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var h=+(parts.find(function(p){return p.type==='hour'})||{}).value%24;
  var open=h>=7||h<1;
  document.querySelectorAll('[data-open]').forEach(function(b){
    b.hidden=false;b.classList.add(open?'is-open':'is-shut');
    var t=b.querySelector('span');if(t)t.textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut');
  });
  /* hero branch lines: a small open/closed dot on each line, with its state for screen readers */
  document.querySelectorAll('[data-odot]').forEach(function(d){
    d.hidden=false;d.classList.add(open?'is-open':'is-shut');
    var s=d.querySelector('.sr');if(s)s.textContent=open?d.getAttribute('data-open'):d.getAttribute('data-shut');
  });

  /* hero: the oval opens on load and the words rise (kit 02). Round 3: no scroll widen at all. The oval keeps its
     load-in size (about 490 x 630 at 1440x900); on scroll only the photo inside it drifts, scale 1 to 1.06 and up
     about 4%, while the hero (100vh, not sticky) scrolls away with the name and branch list on it. */
  var hero=document.querySelector('[data-hero]');
  if(hero){
    var win=hero.querySelector('.hero__win'),img=win&&win.querySelector('img');
    var t0=null,intro=RM?1:0,prog=0;
    function ease(x){return 1-Math.pow(1-x,4)}
    function draw(){
      if(!win)return;
      var W=innerWidth,H=innerHeight,kb=(1.14-.14*intro)*(1+.06*prog);
      if(DESK.matches){
        var rx=Math.min(W*.17,H*.36)*intro,ry=H*.35*intro;
        win.style.setProperty('--rx',rx.toFixed(1)+'px');win.style.setProperty('--ry',ry.toFixed(1)+'px');
        if(img){
          img.style.setProperty('--iw',(Math.min(W*.17,H*.36)*2*1.04).toFixed(1)+'px');
          img.style.setProperty('--ty',(-50-4*prog).toFixed(2)+'%');
          img.style.setProperty('--kb',kb.toFixed(4));
        }
      }else{
        win.style.setProperty('--rx',(44*intro).toFixed(2)+'%');win.style.setProperty('--ry',(50*intro).toFixed(2)+'%');
        if(img){img.style.setProperty('--kb',(1.14-.14*intro).toFixed(4));img.style.removeProperty('--iw');img.style.removeProperty('--ty')}
      }
    }
    function measure(){
      if(RM||!DESK.matches){prog=0;return}
      var r=hero.getBoundingClientRect();
      prog=Math.min(1,Math.max(0,-r.top/(hero.offsetHeight||innerHeight)));
    }
    measure();draw();
    requestAnimationFrame(function(){hero.classList.add('is-in')});
    setTimeout(function(){hero.classList.add('is-settled')},1800);
    if(!RM){
      (function tick(t){if(t0===null)t0=t;var k=Math.min(1,(t-t0)/1300);intro=ease(k);draw();if(k<1)requestAnimationFrame(tick)})(performance.now());
      var tk=false;addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;measure();draw()})},{passive:true});
    }
    addEventListener('resize',function(){measure();draw()});
  }

  /* what people order: the sticky photo follows the row you point at or focus */
  var pic=document.querySelector('[data-order-pic]');
  if(pic){
    var imgs=[].slice.call(pic.querySelectorAll('img'));
    var cap=document.querySelector('[data-order-cap]');
    function show(k){
      imgs.forEach(function(im){im.classList.toggle('is-on',im.getAttribute('data-k')===k)});
      /* round 3: the dish name under the photo follows it */
      var li=document.querySelector('[data-order="'+k+'"] h3');
      if(cap&&li&&cap.textContent!==li.textContent){cap.classList.remove('is-on');void cap.offsetWidth;cap.textContent=li.textContent;cap.classList.add('is-on')}
    }
    document.querySelectorAll('[data-order]').forEach(function(li){
      var k=li.getAttribute('data-order');
      function on(){document.querySelectorAll('[data-order].is-on').forEach(function(x){x.classList.remove('is-on')});li.classList.add('is-on');if(k)show(k)}
      li.addEventListener('pointerenter',on);li.addEventListener('focusin',on);
    });
    if(DESK.matches&&'IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var k=e.target.getAttribute('data-order');if(k)show(k)}})},{rootMargin:'-45% 0px -45% 0px'});
      document.querySelectorAll('[data-order]').forEach(function(li){io.observe(li)});
    }
  }

  /* map: loads only when tapped (phones) or when near (desktop) */
  document.querySelectorAll('[data-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on')};m.appendChild(f);if(btn)btn.remove()}
    if(btn)btn.addEventListener('click',load);
    if(DESK.matches&&'IntersectionObserver' in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();load()}},{rootMargin:'200px'}).observe(m);
  });

  /* menu page tabs: mark the category in view */
  var tabs=[].slice.call(document.querySelectorAll('.tabs a'));
  if(tabs.length&&'IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tabs.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('is-on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');if(on&&a.scrollIntoView&&a.parentElement.scrollWidth>a.parentElement.clientWidth){a.parentElement.scrollTo({left:a.offsetLeft-a.parentElement.clientWidth/2+a.offsetWidth/2,behavior:RM?'auto':'smooth'})}})}})},{rootMargin:'-40% 0px -55% 0px'});
    tabs.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)io2.observe(s)});
  }
})();

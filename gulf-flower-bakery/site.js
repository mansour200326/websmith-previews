/* kit 03-hero-sequence.html */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-k-seq]').forEach(function(root){
    var frames=[].slice.call(root.querySelectorAll('[data-k-seq-frame]'));
    var bars=root.querySelector('[data-k-seq-bars]'),cap=root.querySelector('[data-k-seq-cap]'),cnt=root.querySelector('[data-k-seq-count]');
    var ms=+root.getAttribute('data-k-seq-ms')||4200,i=0,t=null,visible=true,hover=false;
    root.style.setProperty('--k-seq-ms',ms+'ms');
    var pad=function(n){return(n<10?'0':'')+n};
    var btns=frames.map(function(f,n){var b=document.createElement('button');b.className='k-seq__bar';b.type='button';b.setAttribute('aria-label','Show photo '+(n+1));b.onclick=function(){go(n,true)};bars.appendChild(b);return b});
    function go(n,user){
      frames[i].classList.remove('is-on');i=(n+frames.length)%frames.length;
      var img=frames[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager';
      frames[i].classList.add('is-on');
      btns.forEach(function(b,k){b.classList.toggle('is-done',k<i);b.classList.remove('is-on')});
      void btns[i].offsetWidth;btns[i].classList.add('is-on');
      if(cap)cap.textContent=frames[i].getAttribute('data-cap')||'';
      if(cnt)cnt.textContent=pad(i+1)+' / '+pad(frames.length);
      schedule();
    }
    function schedule(){clearTimeout(t);if(RM||!visible||hover||document.hidden){root.classList.add('is-paused');return}root.classList.remove('is-paused');t=setTimeout(function(){go(i+1)},ms)}
    new IntersectionObserver(function(e){visible=e[0].isIntersecting;schedule()},{threshold:.2}).observe(root);
    root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hover=true;schedule()}});
    root.addEventListener('pointerleave',function(){hover=false;schedule()});
    document.addEventListener('visibilitychange',schedule);
    // preload next frames after first paint
    addEventListener('load',function(){frames.forEach(function(f){var im=f.querySelector('img');if(im)im.loading='eager'})});
    go(0);
  });
})();
/* kit 07-marquee.html */
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
/* kit 16-map-hours.html */
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
/* kit 18-reveal-utilities.html */
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
/* kit 19-magnetic-micro.html */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();
/* kit 25-photo-print.html */
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
/* Gulf Flower Bakery: stamp turns with the scroll (no loop) */
(function(){
  var s=document.querySelector('[data-stamp]');if(!s||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var tk=false,dir=document.documentElement.dir==='rtl'?-1:1;
  function u(){tk=false;s.style.setProperty('--rot',(scrollY*.18*dir).toFixed(1)+'deg')}
  addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(u)}},{passive:true});
})();

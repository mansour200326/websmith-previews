/* Cross Coffee concept — motion layer (Websmith kit 03, 07, 09, 12, 16, 18, 19, 25, restyled). All content is visible without JS. */
(function(){
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches,d=document.documentElement;
var $$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};

/* header: solid after the first screen */
var hd=document.querySelector('.hd');
if(hd){var tick=function(){hd.classList.toggle('is-solid',scrollY>40)};addEventListener('scroll',tick,{passive:true});tick();}

/* kit 18: reveals */
$$('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;$$('[data-reveal]',p).forEach(function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
$$('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
function split(el){
  if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
  el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim().replace(/\s+/g,' '));
  var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
  var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
  var lines=[],top=null;$$('.k-rv-w',el).forEach(function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
  el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
  el.classList.add('k-rv-ready');
}
var lineEls=$$('[data-reveal=lines]');
if(!RM){
  var ready=function(){lineEls.forEach(split)};
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
  var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
}
var els=$$('[data-reveal]');
if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
else{
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
}
var px=$$('[data-speed]');
if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
  addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

/* kit 19: magnetic */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
  $$('[data-k-magnetic]').forEach(function(el){var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});});
}

/* kit 03: hero sequence */
$$('[data-k-seq]').forEach(function(root){
  var frames=$$('[data-k-seq-frame]',root),cap=root.querySelector('[data-k-seq-cap]');
  var ms=+root.getAttribute('data-k-seq-ms')||4200,i=0,t=null,visible=true,hover=false;
  function go(n){
    frames[i].classList.remove('is-on');i=(n+frames.length)%frames.length;
    var img=frames[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager';
    frames[i].classList.add('is-on');
    if(cap){var nx=frames[i].getAttribute('data-cap')||'';if(RM||!cap.textContent)cap.textContent=nx;else{cap.style.opacity=0;setTimeout(function(){cap.textContent=nx;cap.style.opacity=''},380)}}
    schedule();
  }
  function schedule(){clearTimeout(t);if(RM||!visible||hover||document.hidden){root.classList.add('is-paused');return}root.classList.remove('is-paused');t=setTimeout(function(){go(i+1)},ms)}
  new IntersectionObserver(function(e){visible=e[0].isIntersecting;schedule()},{threshold:.2}).observe(root);
  root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hover=true;schedule()}});
  root.addEventListener('pointerleave',function(){hover=false;schedule()});
  root.addEventListener('focusin',function(){hover=true;schedule()});root.addEventListener('focusout',function(){hover=false;schedule()});
  document.addEventListener('visibilitychange',schedule);
  addEventListener('load',function(){frames.forEach(function(f){var im=f.querySelector('img');if(im)im.loading='eager'})});
  go(0);
});

/* ways: the sticky photo follows the row you point at */
$$('[data-ways]').forEach(function(root){
  var rows=$$('.way',root),imgs=$$('.ways__stage img',root),cap=root.querySelector('.ways__stage figcaption');
  function on(n){rows.forEach(function(r,k){r.classList.toggle('is-on',k===n)});imgs.forEach(function(m,k){m.classList.toggle('is-on',k===n)});if(cap&&imgs[n])cap.textContent=imgs[n].getAttribute('data-cap')||''}
  rows.forEach(function(r,n){r.addEventListener('pointerenter',function(){on(n)});r.addEventListener('focusin',function(){on(n)})});
  on(0);
});

/* kit 07: marquee */
$$('[data-k-marquee]').forEach(function(m){
  var tr=m.querySelector('.k-marquee__track');if(!tr)return;
  m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
  if(RM)return;
  var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
  new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
});

/* kit 09: drag scroller */
$$('[data-k-drag]').forEach(function(root){
  var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
  var rtl=getComputedStyle(tr).direction==='rtl';
  new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.12}).observe(root);
  function pos(){return Math.abs(tr.scrollLeft)}
  function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
    if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
    if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
    if(!RM)$$('.k-drag__card',tr).forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-6).toFixed(2)+'%')});}
  tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
  function step(dir){var c=tr.querySelector('.k-drag__card');var w=c?c.getBoundingClientRect().width+18:400;tr.scrollBy({left:dir*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
  if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
  var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
  tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
  addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)tr.classList.add('is-drag');moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
  addEventListener('pointerup',function(){if(!down)return;down=false;
    if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
    var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
  tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
});

/* kit 12: menu tabs */
$$('[data-k-menu]').forEach(function(root){
  var tabs=root.querySelector('[data-k-menu-tabs]'),ink=tabs.querySelector('.k-menu__ink'),btns=$$('[data-tab]',tabs),panels=$$('[data-panel]',root);
  panels.forEach(function(p){$$('.k-menu__item',p).forEach(function(li,i){li.style.setProperty('--i',i)})});
  function line(b){ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+b.offsetLeft+'px)'}
  function pick(b,focus){btns.forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});
    panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});
    line(b);b.scrollIntoView({block:'nearest',inline:'nearest',behavior:RM?'auto':'smooth'});
    if(history.replaceState)history.replaceState(null,'','#'+b.dataset.tab)}
  btns.forEach(function(b){b.addEventListener('click',function(){pick(b);var top=root.getBoundingClientRect().top+scrollY-70;if(scrollY>top)scrollTo({top:top,behavior:RM?'auto':'smooth'})})});
  tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});var k=e.key,rtl=d.dir==='rtl';
    if(k==='ArrowRight'||k==='ArrowLeft'){var f=(k==='ArrowRight')!==rtl?1:-1;var n=btns[(i+f+btns.length)%btns.length];n.focus();pick(n)}});
  var h=location.hash.slice(1),first=btns.find(function(b){return b.dataset.tab===h})||btns[0];
  pick(first);
  addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){line(first)});
});

/* menu: the sticky feature photo follows the row you point at, focus or scroll past (desktop, r2) */
if(matchMedia('(min-width:900px)').matches)$$('.k-menu__panel').forEach(function(p){
  var fig=p.querySelector('.k-menu__feat');if(!fig)return;
  var base=fig.querySelector('img'),fc=fig.querySelector('figcaption'),rows=$$('.k-menu__item',p),cur=null,tm;
  var top=document.createElement('img');top.className='k-feat-next';top.alt='';top.setAttribute('aria-hidden','true');fig.insertBefore(top,fc);
  function show(r){if(r===cur)return;cur=r;rows.forEach(function(x){x.classList.toggle('is-on',x===r)});
    var src=r.getAttribute('data-feat');if(!src)return;var name=(r.querySelector('.k-menu__name')||{}).firstChild;name=name?name.textContent.trim():'';
    if(RM){base.src=src;if(fc)fc.textContent=name;return}
    clearTimeout(tm);if(top.classList.contains('is-on')&&top.getAttribute('src'))base.src=top.getAttribute('src');top.classList.remove('is-on');top.onload=function(){requestAnimationFrame(function(){top.classList.add('is-on')});if(fc)fc.textContent=name;tm=setTimeout(function(){base.src=src;base.alt=name},750)};top.src=src;
  }
  rows.forEach(function(r){r.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')show(r)});r.addEventListener('focusin',function(){show(r)})});
  var io3=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!p.hidden)show(e.target)})},{rootMargin:'-45% 0px -50% 0px'});
  rows.forEach(function(r){io3.observe(r)});
});

/* kit 16: open now + tap-to-load map */
$$('[data-k-hours]').forEach(function(root){
  var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:root.getAttribute('data-k-tz')||'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
  var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
  $$('[data-k-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-k-open')||'Open now'):(root.getAttribute('data-k-shut')||'Closed now')});
});
$$('[data-k-map]').forEach(function(m){
  var btn=m.querySelector('button');
  function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
  if(btn)btn.addEventListener('click',load);
  if(!m.hasAttribute('data-k-map-tap')&&matchMedia('(min-width:900px)').matches)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();load()}},{rootMargin:'200px'}).observe(m);
});

/* kit 25: halftone print on ONE room photo */
(function(){
  var fx=$$('[data-k-fx]');if(!fx.length)return;
  function rgb(h){h=h.replace('#','');var v=parseInt(h.length===3?h.replace(/./g,'$&$&'):h,16);return[v>>16&255,v>>8&255,v&255]}
  function lum(h){var c=rgb(h);return c[0]*.3+c[1]*.59+c[2]*.11}
  function render(fig){
    var img=fig.querySelector('img'),W=fig.clientWidth,H=fig.clientHeight;if(!W||!H||!img.naturalWidth)return;
    var cell=+fig.getAttribute('data-k-fx-cell')||7;cell=Math.min(cell,Math.max(4,W/62));
    var k=+fig.getAttribute('data-k-fx-contrast')||1.25,ink=fig.getAttribute('data-k-fx-ink')||'#1b1b1b',paper=fig.getAttribute('data-k-fx-paper')||'#f1f0eb';
    var cols=Math.ceil(W/cell),rows=Math.ceil(H/cell),s=document.createElement('canvas');s.width=cols;s.height=rows;
    var sx=s.getContext('2d',{willReadFrequently:true});sx.imageSmoothingQuality='high';
    var sc=Math.max(cols/img.naturalWidth,rows/img.naturalHeight),dw=img.naturalWidth*sc,dh=img.naturalHeight*sc;sx.drawImage(img,(cols-dw)/2,(rows-dh)/2,dw,dh);
    var dd;try{dd=sx.getImageData(0,0,cols,rows).data}catch(e){return}
    var inv=lum(paper)<lum(ink),L=new Float32Array(cols*rows);
    for(var i=0;i<L.length;i++){var l=(.2126*dd[i*4]+.7152*dd[i*4+1]+.0722*dd[i*4+2])/255;l=Math.min(1,Math.max(0,(l-.5)*k+.5));L[i]=inv?1-l:l}
    var cv=fig.querySelector('canvas')||fig.appendChild(document.createElement('canvas'));cv.setAttribute('aria-hidden','true');
    fig.style.setProperty('--k-fx-paper',paper);
    var dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    var c2=cv.getContext('2d');c2.scale(dpr,dpr);c2.fillStyle=paper;c2.fillRect(0,0,W,H);c2.fillStyle=ink;c2.beginPath();
    for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){var r=cell*.62*Math.sqrt(1-L[y*cols+x]);if(r<.35)continue;var px=x*cell+cell/2+(y&1?cell/2:0),py=y*cell+cell/2;c2.moveTo(px+r,py);c2.arc(px,py,r,0,6.2832)}
    c2.fill();fig.classList.add('is-fx');
  }
  fx.forEach(function(fig){
    var img=fig.querySelector('img');if(!img)return;
    var go=function(){render(fig)};if(img.complete&&img.naturalWidth)go();else img.addEventListener('load',go);
    var lw=fig.clientWidth,rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(fig.clientWidth!==lw){lw=fig.clientWidth;go()}},200)});
    if(fig.hasAttribute('data-k-fx-peek')){fig.addEventListener('click',function(){fig.classList.toggle('is-peek')});fig.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fig.classList.toggle('is-peek')}})}
    if(RM){fig.classList.add('is-in');return}
    var io2=new IntersectionObserver(function(e){if(e[0].isIntersecting){fig.classList.add('is-in');io2.disconnect()}},{threshold:.25});io2.observe(fig);
  });
})();

/* kit 18: Lenis smooth scroll on desktop only */
if(DESK&&!RM&&d.hasAttribute('data-lenis')){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js';s.async=true;
  s.onload=function(){if(!window.Lenis)return;var l=new Lenis({lerp:.11,smoothWheel:true});(function raf(t){l.raf(t);requestAnimationFrame(raf)})(performance.now());
    document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();l.scrollTo(t,{offset:-70})}})};
  document.head.appendChild(s);}
})();

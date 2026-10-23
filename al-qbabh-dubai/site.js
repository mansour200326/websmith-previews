/* Al Qbabh concept: motion + small helpers. Built on Websmith kit 06/07/09/16/18/19, trimmed and restyled.
   Everything is visible without JS (motion is gated behind html.k-js) and off under prefers-reduced-motion. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
      FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,RTL=d.dir==='rtl';

  /* hero: split h1 into masked lines, then play once */
  var hero=document.querySelector('.hero');
  if(hero){
    var h1=hero.querySelector('h1');
    if(h1&&!RM){h1.querySelectorAll('.ln').length||(h1.innerHTML='<span class="ln"><span>'+h1.innerHTML+'</span></span>')}
    var go=function(){requestAnimationFrame(function(){hero.classList.add('is-in')})};
    if(RM)hero.classList.add('is-in');else if(document.fonts&&document.fonts.ready)Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,900)})]).then(go);else go();
    /* tray turns a little as you scroll (scroll-linked, not looping) */
    var tray=hero.querySelector('.tray');
    if(tray&&!RM){var tk=false;addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;var y=Math.min(scrollY,1400);tray.style.setProperty('--rot',(RTL?-1:1)*(y*.045).toFixed(2)+'deg')})},{passive:true})}
  }

  /* open now (Asia/Dubai). Hours 11:00 to 02:00 every day: open if hour >= 11 or hour < 2 */
  document.querySelectorAll('[data-open]').forEach(function(b){
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',hour12:false}).formatToParts(new Date());
    var h=+((p.find(function(x){return x.type==='hour'})||{}).value)%24,open=h>=11||h<2;
    b.hidden=false;b.classList.toggle('is-open',open);
    b.querySelector('span').textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut');
  });

  /* reveal (kit 18) */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;
    var keep=el.querySelector('.ar-t,.en-t'),keepHTML=keep?keep.outerHTML:'';if(keep)keep.remove();
    el.setAttribute('aria-label',(el.textContent+' '+(keep?keep.textContent:'')).trim());
    var words=el.textContent.trim().split(/\s+/);
    el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('')+(keepHTML?keepHTML.replace('<span','<span aria-hidden="true"'):'');
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

  /* magnetic main buttons (kit 19) */
  if(FINE&&!RM)document.querySelectorAll('[data-mag]').forEach(function(el){
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*.22).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.3).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.style.transform=''});
  });

  /* menu index: the sticky photo follows the row you hover or focus */
  document.querySelectorAll('[data-order]').forEach(function(root){
    var pics=root.querySelectorAll('.order__pic img'),cap=root.querySelector('.order__pic figcaption'),rows=root.querySelectorAll('.idx li');
    function on(i){rows.forEach(function(r,k){r.classList.toggle('on',k===i)});var key=rows[i].getAttribute('data-pic');
      pics.forEach(function(p){var m=p.getAttribute('data-key')===key;p.classList.toggle('on',m);if(m&&cap)cap.textContent=p.getAttribute('data-cap')})}
    rows.forEach(function(r,i){r.addEventListener('pointerenter',function(){on(i)});r.addEventListener('focusin',function(){on(i)})});
  });

  /* marquee (kit 07) */
  document.querySelectorAll('[data-mq]').forEach(function(m){
    var tr=m.querySelector('.mq__track');if(!tr||RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* drag strip (kit 09) */
  document.querySelectorAll('[data-drag]').forEach(function(root){
    var tr=root.querySelector('.drag__track'),bar=root.querySelector('.drag__bar'),prev=root.querySelector('[data-prev]'),next=root.querySelector('[data-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    function pos(){return Math.abs(tr.scrollLeft)}
    function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
      if(bar)bar.style.setProperty('--prog',Math.max(.08,Math.min(1,p*.92+.08)));
      if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
      if(!RM)tr.querySelectorAll('.card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--px',(cx*-6).toFixed(2)+'%')});}
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
    function step(k){var c=tr.querySelector('.card');var w=c?c.getBoundingClientRect().width+18:400;tr.scrollBy({left:k*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
    if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
    var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)tr.classList.add('is-drag');moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
    addEventListener('pointerup',function(){if(!down)return;down=false;
      if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
    tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  });

  /* count up (kit 06) */
  (function(){
    var els=document.querySelectorAll('[data-count]');if(!els.length||RM)return;
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);run(e.target)})},{threshold:.5});
    els.forEach(function(el){el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';el.textContent=fmt(el,0);io.observe(el)});
    function fmt(el,v){var dec=+el.getAttribute('data-dec')||0;return v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})}
    function run(el){var to=parseFloat(el.getAttribute('data-count')),t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/1600),e=1-Math.pow(1-k,4);el.textContent=fmt(el,to*e);if(k<1)requestAnimationFrame(f)})(t0)}
  })();

  /* tap-to-load map (kit 16) */
  document.querySelectorAll('[data-map]').forEach(function(m){
    var btn=m.querySelector('button');
    btn&&btn.addEventListener('click',function(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-map');f.title=btn.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');btn.remove()};m.appendChild(f)});
  });

  /* mobile bottom bar: shows once the hero buttons scroll away */
  var bar=document.querySelector('.mbar'),anchor=document.querySelector('[data-bar-anchor]');
  if(bar&&anchor&&'IntersectionObserver' in window){
    new IntersectionObserver(function(e){var gone=!e[0].isIntersecting&&e[0].boundingClientRect.top<0;bar.classList.toggle('on',gone);bar.toggleAttribute('inert',!gone)}).observe(anchor);
    bar.setAttribute('inert','');
  }
})();

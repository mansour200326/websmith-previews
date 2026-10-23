/* Crab & Crack concept: kit 06/07/09/16/18/19 (restyled) + call badge + menu index stage. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim().replace(/\s+/g,' '));
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
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

  /* kit 19: magnetic */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });

  /* call badge turns with scroll */
  var ring=document.querySelector('.badge');
  if(ring&&!RM){var tk=false;addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;ring.style.setProperty('--rot',(scrollY*.25%360).toFixed(1)+'deg')})},{passive:true})}

  /* menu index: sticky photo follows the hovered/focused dish */
  document.querySelectorAll('[data-idx]').forEach(function(root){
    var stage=root.querySelector('.idx__stage');if(!stage)return;
    var imgs=stage.querySelectorAll('img'),cap=stage.querySelector('figcaption'),rows=root.querySelectorAll('.idx__row');
    function on(i,mark){rows.forEach(function(r,j){r.classList.toggle('is-on',mark!==false&&i===j)});imgs.forEach(function(m,j){m.classList.toggle('is-on',i===j)});if(cap&&imgs[i])cap.textContent=imgs[i].getAttribute('data-cap')||''}
    rows.forEach(function(r,i){var a=r.querySelector('a');a.addEventListener('mouseenter',function(){on(i)});a.addEventListener('focus',function(){on(i)})});
    /* r2: open on the boat photo (data-idx-start), no row marked until hover/focus */
    on(+root.getAttribute('data-idx-start')||0,false);
  });

  /* kit 07: marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr)return;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 09: drag strip */
  document.querySelectorAll('[data-k-drag]').forEach(function(root){
    var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.1}).observe(root);
    function pos(){return Math.abs(tr.scrollLeft)}
    function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
      if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
      if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
      if(!RM)tr.querySelectorAll('.k-drag__card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-6).toFixed(2)+'%')});}
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
    function step(d){var c=tr.querySelector('.k-drag__card');var w=c?c.getBoundingClientRect().width+20:400;tr.scrollBy({left:d*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
    if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
    var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)tr.classList.add('is-drag');moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
    addEventListener('pointerup',function(){if(!down)return;down=false;
      if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
    tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  });

  /* kit 06: count up */
  var cs=document.querySelectorAll('[data-k-count]');
  if(cs.length&&!RM){
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);run(e.target)})},{threshold:.5});
    cs.forEach(function(el){el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';el.textContent=fmt(0,+el.getAttribute('data-k-count-dec')||0);cio.observe(el)});
  }
  function fmt(v,dec){return v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})}
  function run(el){var to=parseFloat(el.getAttribute('data-k-count')),dec=+el.getAttribute('data-k-count-dec')||0,t0=performance.now();
    (function f(t){var k=Math.min(1,(t-t0)/1600),e=1-Math.pow(1-k,4);el.textContent=fmt(to*e,dec);if(k<1)requestAnimationFrame(f)})(t0)}

  /* kit 16: tap-to-load map */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* menu page: jump bar marks the section in view */
  var jl=document.querySelectorAll('.jump a');
  if(jl.length&&'IntersectionObserver' in window){
    var map={};jl.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var jio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){jl.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a){a.classList.add('is-on');if(a.scrollIntoView&&innerWidth<900){a.parentNode.scrollTo({left:a.offsetLeft-20,behavior:RM?'auto':'smooth'})}}}})},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)jio.observe(s)});
  }
})();

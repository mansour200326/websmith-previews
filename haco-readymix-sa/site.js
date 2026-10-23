/* HACO concept · Websmith. Kit 18 (reveals), 19 (micro), 06 (count), 09 (drag), 16 (hours/map) + hero, calculator, map. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* header state + mobile menu */
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>10)};addEventListener('scroll',on,{passive:true});on()}
  var mb=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)})}

  /* fit the name to the column width (Haven-style edge-to-edge wordmark) */
  function fit(){document.querySelectorAll('[data-fit]').forEach(function(el){el.style.fontSize='';el.style.justifyContent='flex-start';var w=(el.parentElement.classList.contains('hero__head')?el.parentElement.clientWidth:el.clientWidth),sw=0;[].forEach.call(el.children,function(c){sw+=c.getBoundingClientRect().width});if(sw>0){var fs=parseFloat(getComputedStyle(el).fontSize);var cap=innerWidth>=900?innerHeight*(el.classList.contains('ar')?0.5:0.62):1e9;el.style.fontSize=Math.min(fs*w/sw*0.995,cap)+'px'}el.style.justifyContent=''})}
  fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);addEventListener('resize',fit);

  /* hero: name rises, photo opens, then grows to full bleed on scroll (LPAS-style) */
  requestAnimationFrame(function(){d.querySelector('body').classList.add('is-loaded')});
  setTimeout(function(){document.body.classList.add('is-settled')},1900);
  var hp=document.querySelector('.hero__photo');
  if(hp&&!RM){var t=false;function g(){t=false;var r=hp.getBoundingClientRect(),vh=innerHeight;var p=Math.min(1,Math.max(0,(vh-r.top)/(vh*0.9)-0.35));hp.style.setProperty('--g',p.toFixed(3))}
    addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(g)}},{passive:true});addEventListener('resize',g);g()}

  /* kit 18: stagger, line split, observe, parallax */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
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
    var ready=function(){lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;ready()}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io2.unobserve(e.target)}})},{rootMargin:'0px',threshold:0});
    els.forEach(function(e){var clip=e.getAttribute('data-reveal')==='clip';var t=clip&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);(clip?io2:io).observe(t)});
  }
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;function upd(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* map draws in */
  document.querySelectorAll('.map').forEach(function(m){if(RM||!('IntersectionObserver' in window)){m.classList.add('is-in');return}
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){m.classList.add('is-in');o.disconnect()}},{threshold:.3}).observe(m)});

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* kit 06: counters */
  var cs=document.querySelectorAll('[data-k-count]');
  if(cs.length&&!RM&&'IntersectionObserver' in window){
    var fmt=function(el,v){var loc=el.getAttribute('data-k-count-locale')||'en-US';return Math.round(v).toLocaleString(loc)};
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=+el.getAttribute('data-k-count'),from=+(el.getAttribute('data-k-count-from')||0),t0=performance.now();
      (function f(t){var k=Math.min(1,(t-t0)/1700),q=1-Math.pow(1-k,4);el.textContent=fmt(el,from+(to-from)*q);if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
    cs.forEach(function(el){el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';el.textContent=fmt(el,+(el.getAttribute('data-k-count-from')||0));cio.observe(el)});
  }

  /* kit 09: drag strip */
  document.querySelectorAll('[data-k-drag]').forEach(function(root){
    var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    if('IntersectionObserver' in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.15}).observe(root);else root.classList.add('is-in');
    function pos(){return Math.abs(tr.scrollLeft)}
    function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
      if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
      if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
      if(!RM)tr.querySelectorAll('.k-drag__card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-6).toFixed(2)+'%')});}
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
    function step(dd){var c=tr.querySelector('.k-drag__card');var w=c?c.getBoundingClientRect().width+20:400;tr.scrollBy({left:dd*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
    if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
    var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)tr.classList.add('is-drag');moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
    addEventListener('pointerup',function(){if(!down)return;down=false;
      if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
  });

  /* kit 16: open/closed in Saudi time + tap-to-load map */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var tz=root.getAttribute('data-k-tz')||'Asia/Riyadh';
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var gp=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(gp('weekday')),now=(+gp('hour')%24)+(+gp('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-k-open')||'Order line open now'):(root.getAttribute('data-k-shut')||'Order line closed now')}
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* concrete volume calculator (rebuilt from their contact page) */
  document.querySelectorAll('[data-calc]').forEach(function(f){
    var ins=f.querySelectorAll('input'),out=f.querySelector('output [data-v]'),loc=f.getAttribute('data-locale')||'en-US';
    function calc(){var v=1;ins.forEach(function(i){var n=parseFloat(String(i.value).replace(',','.'));v*=isFinite(n)&&n>0?n:0});
      out.textContent=v.toLocaleString(loc,{minimumFractionDigits:v<100?2:0,maximumFractionDigits:v<100?2:0})}
    ins.forEach(function(i){i.addEventListener('input',calc)});calc();
  });
})();

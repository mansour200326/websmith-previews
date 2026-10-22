/* La Vida Home Spa concept · Websmith. Kit 18 reveal, 19 magnetic, 12 price tabs, 14 reviews, 06 counter, 16 hours badge. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;
  var AR=/^ar/.test(d.lang);

  /* ---- kit 18: reveals ---- */
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
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}
  if(DESK&&!RM&&d.hasAttribute('data-lenis')){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js';s.async=true;
    s.onload=function(){if(!window.Lenis)return;var l=new Lenis({lerp:.11,smoothWheel:true});window.kLenis=l;(function raf(t){l.raf(t);requestAnimationFrame(raf)})(performance.now());
      document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();l.scrollTo(t,{offset:-90})}})};
    document.head.appendChild(s);}

  /* ---- kit 19: magnetic ---- */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* ---- kit 12: price tabs ---- */
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]'),ink=tabs.querySelector('.k-menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function line(b){ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+(b.offsetLeft)+'px)'}
    function pick(b){btns.forEach(function(x){x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b)}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var fw=(e.key==='ArrowRight')!==AR;var n=btns[(i+(fw?1:-1)+btns.length)%btns.length];n.focus();pick(n)}});
    var first=btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||btns[0];
    btns.forEach(function(x){x.tabIndex=x===first?0:-1});
    panels.forEach(function(p){if(!p.hidden)p.classList.add('is-in')});
    if('IntersectionObserver' in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){pick(first);o.disconnect()}},{threshold:.1}).observe(root);
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
    line(first);
  });

  /* ---- kit 14: reviews ---- */
  document.querySelectorAll('[data-k-quotes]').forEach(function(root){
    var tr=root.querySelector('.k-quotes__track'),sl=[].slice.call(root.querySelectorAll('.k-quotes__slide')),dots=root.querySelector('.k-quotes__dots'),cur=0,t,auto=+root.getAttribute('data-k-quotes-auto')||0,hold=false,vis=false;
    var rtl=getComputedStyle(tr).direction==='rtl';
    if(!RM)sl.forEach(function(s){var q=s.querySelector('blockquote');var w=q.textContent.trim().split(/\s+/);q.setAttribute('aria-label',q.textContent.trim());q.innerHTML=w.map(function(x,i){return'<span class="k-w" aria-hidden="true" style="--w:'+i+'">'+x.replace(/</g,'&lt;')+'</span>'}).join(' ')});
    var db=sl.map(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',(AR?'رأي ':'Review ')+(i+1));b.onclick=function(){go(i)};dots&&dots.appendChild(b);return b});
    function mark(i){cur=i;sl.forEach(function(s,k){s.classList.toggle('is-on',k===i)});db.forEach(function(b,k){b.setAttribute('aria-current',k===i)})}
    function go(i){i=(i+sl.length)%sl.length;tr.scrollTo({left:(rtl?-1:1)*sl[i].offsetWidth*i,behavior:RM?'auto':'smooth'});mark(i);sched()}
    var st;tr.addEventListener('scroll',function(){clearTimeout(st);st=setTimeout(function(){var i=Math.round(Math.abs(tr.scrollLeft)/tr.clientWidth);if(i!==cur)mark(i)},80)},{passive:true});
    var p=root.querySelector('[data-k-quotes-prev]'),n=root.querySelector('[data-k-quotes-next]');if(p)p.onclick=function(){go(cur-1)};if(n)n.onclick=function(){go(cur+1)};
    function sched(){clearTimeout(t);if(auto&&!RM&&!hold&&vis)t=setTimeout(function(){go(cur+1)},auto)}
    root.addEventListener('pointerenter',function(){hold=true;sched()});root.addEventListener('pointerleave',function(){hold=false;sched()});
    root.addEventListener('focusin',function(){hold=true;sched()});root.addEventListener('focusout',function(){hold=false;sched()});
    new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)sl[cur].classList.add('is-on');sched()},{threshold:.4}).observe(root);
    mark(0);if(!RM)sl[0].classList.remove('is-on');
  });

  /* ---- kit 06: counter ---- */
  var cs=document.querySelectorAll('[data-k-count]');
  if(cs.length&&!RM&&'IntersectionObserver' in window){
    var fmt=function(el,v,dec){return v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})};
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=parseFloat(el.getAttribute('data-k-count')),dec=+el.getAttribute('data-k-count-dec')||0,from=parseFloat(el.getAttribute('data-k-count-from')||0),t0=performance.now();
      (function f(tm){var k=Math.min(1,(tm-t0)/1600),ee=1-Math.pow(1-k,4);el.textContent=fmt(el,from+(to-from)*ee,dec);if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
    cs.forEach(function(el){var dec=+el.getAttribute('data-k-count-dec')||0;el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';el.textContent=fmt(el,parseFloat(el.getAttribute('data-k-count-from')||0),dec);cio.observe(el)});
  }

  /* ---- kit 16: open now (Dubai time), every day 12:00-22:00 ---- */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?root.getAttribute('data-k-open'):root.getAttribute('data-k-shut')}
  });

  /* ---- services index: mark the group in view ---- */
  var idx=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(idx.length&&'IntersectionObserver' in window){
    var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;idx.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});
    idx.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)sio.observe(t)});
  }
})();

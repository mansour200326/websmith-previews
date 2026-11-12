/* Hola concept · motion and widgets from the Websmith kit (18 reveal, 19 magnetic, 11 accordion, 12 menu tabs, 14 reviews, 16 hours/map) */
/* open the price tab named in the URL hash (services.html#hair) before kit 12 picks its first tab */
(function(){var h=location.hash.slice(1);if(!h)return;var b=document.querySelector('[data-k-menu-tabs] [data-tab="'+h+'"]');if(!b)return;
  document.querySelectorAll('[data-k-menu-tabs] [data-tab]').forEach(function(x){x.setAttribute('aria-selected',x===b)});
  document.querySelectorAll('[data-k-menu] [data-panel]').forEach(function(p){p.hidden=p.dataset.panel!==h});
  var m=document.querySelector('[data-k-menu]');if(m)setTimeout(function(){m.scrollIntoView()},60)})();
/* kit 18 */
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
  if(DESK&&px.length){var tk=false;function upd(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2),lim=r.height*.08,v=Math.max(-lim,Math.min(lim,c*(+e.getAttribute('data-speed'))));e.style.transform='translate3d(0,'+v.toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}
  // Lenis (opt-in)
  if(DESK&&d.hasAttribute('data-lenis')){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js';s.async=true;
    s.onload=function(){if(!window.Lenis)return;var l=new Lenis({lerp:.11,smoothWheel:true});window.kLenis=l;(function raf(t){l.raf(t);requestAnimationFrame(raf)})(performance.now());
      document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();l.scrollTo(t,{offset:-70})}})};
    document.head.appendChild(s);}
})();
/* kit 19 */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();
/* kit 11 */
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
/* kit 12 */
(function(){
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]'),ink=tabs.querySelector('.k-menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function line(b){ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+(b.offsetLeft)+'px)'}
    function pick(b){btns.forEach(function(x){x.setAttribute('aria-selected',x===b)});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b)}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var n=btns[(i+(e.key==='ArrowRight'?1:-1)+btns.length)%btns.length];n.focus();pick(n)}});
    var first=btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||btns[0];
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){pick(first);o.disconnect()}},{threshold:0,rootMargin:"0px 0px -10% 0px"}).observe(root);
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
    line(first);
  });
})();
/* kit 14 */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-k-quotes]').forEach(function(root){
    var tr=root.querySelector('.k-quotes__track'),sl=[].slice.call(root.querySelectorAll('.k-quotes__slide')),dots=root.querySelector('.k-quotes__dots'),cur=0,t,auto=+root.getAttribute('data-k-quotes-auto')||0,hold=false,vis=false;
    var rtl=getComputedStyle(tr).direction==='rtl',ar=/^ar/.test(document.documentElement.lang);
    // keyboard + screen-reader basics even on older markup: the track scrolls, so it must take focus; dots are a group, not tabs
    if(!tr.hasAttribute('tabindex')){tr.tabIndex=0;tr.setAttribute('role','region');tr.setAttribute('aria-label',ar?'آراء العملاء':'Customer reviews')}
    if(dots){dots.setAttribute('role','group');dots.hasAttribute('aria-label')||dots.setAttribute('aria-label',ar?'اختر رأياً':'Choose a review')}
    // split words for the reveal (text stays readable to screen readers)
    if(!RM)sl.forEach(function(s){var q=s.querySelector('blockquote');var w=q.textContent.trim().split(/\s+/);q.setAttribute('aria-label',q.textContent.trim());q.innerHTML=w.map(function(x,i){return'<span class="k-w" aria-hidden="true" style="--w:'+i+'">'+x.replace(/</g,'&lt;')+'</span>'}).join(' ')});
    var db=sl.map(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Review '+(i+1));b.onclick=function(){go(i)};dots&&dots.appendChild(b);return b});
    function mark(i){cur=i;sl.forEach(function(s,k){s.classList.toggle('is-on',k===i)});db.forEach(function(b,k){b.setAttribute('aria-current',k===i)})}
    function go(i){i=(i+sl.length)%sl.length;tr.scrollTo({left:(rtl?-1:1)*sl[i].offsetWidth*i,behavior:RM?'auto':'smooth'});mark(i);sched()}
    var st;tr.addEventListener('scroll',function(){clearTimeout(st);st=setTimeout(function(){var i=Math.round(Math.abs(tr.scrollLeft)/tr.clientWidth);if(i!==cur)mark(i)},80)},{passive:true});
    var p=root.querySelector('[data-k-quotes-prev]'),n=root.querySelector('[data-k-quotes-next]');if(p)p.onclick=function(){go(cur-1)};if(n)n.onclick=function(){go(cur+1)};
    function sched(){clearTimeout(t);if(auto&&!RM&&!hold&&vis)t=setTimeout(function(){go(cur+1)},auto)}
    root.addEventListener('pointerenter',function(){hold=true;sched()});root.addEventListener('pointerleave',function(){hold=false;sched()});
    root.addEventListener('focusin',function(){hold=true;sched()});root.addEventListener('focusout',function(){hold=false;sched()});
    new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)sl[cur].classList.add('is-on');sched()},{threshold:.4}).observe(root);
    mark(0);sl[0].classList.remove('is-on');
  });
})();
/* kit 16 */
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

/* Al Asayel concept. Kit 12/16/18/19 scripts (Websmith kit), trimmed, plus header/dock/index helpers. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header border + mobile dock */
  var hd=document.querySelector('.hd'),dock=document.querySelector('.dock');
  function onScroll(){var y=scrollY;if(hd)hd.classList.toggle('is-stuck',y>8);if(dock)dock.classList.toggle('is-on',y>420)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* kit 12: menu tabs. Panels are all visible without JS; JS hides the inactive ones at once. */
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function pick(b,anim){btns.forEach(function(x){x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on){if(anim)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})});}})}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b,true)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});var fwd=document.dir==='rtl'?'ArrowLeft':'ArrowRight',back=document.dir==='rtl'?'ArrowRight':'ArrowLeft';if(e.key===fwd||e.key===back){e.preventDefault();var n=btns[(i+(e.key===fwd?1:-1)+btns.length)%btns.length];n.focus();pick(n,true)}});
    var first=btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||btns[0];
    pick(first,false);
    if(RM||!('IntersectionObserver' in window)){panels.forEach(function(p){p.classList.add('is-in')});return}
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){var cur=btns.find(function(b){return b.getAttribute('aria-selected')==='true'});pick(cur,true);o.disconnect()}},{threshold:.12}).observe(root);
  });

  /* kit 16: live open badge (Dubai time) + today row + tap-to-load map */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    root.querySelectorAll('[data-k-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?root.getAttribute('data-k-open'):root.getAttribute('data-k-shut')});
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* services index: mark the section in view */
  var idx=document.querySelectorAll('.svc__idx a');
  if(idx.length&&'IntersectionObserver' in window){
    var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a){a.classList.add('is-on');if(innerWidth<1000){var p=a.parentElement;p.scrollTo({left:a.offsetLeft-p.clientWidth/2+a.clientWidth/2,behavior:RM?'auto':'smooth'})}}}})},{rootMargin:'-30% 0px -60% 0px'});
    document.querySelectorAll('.cat[id]').forEach(function(c){io2.observe(c)});
  }

  /* kit 18: reveals + line split */
  var stg=document.querySelectorAll('[data-reveal-stagger]');
  stg.forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
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
  /* parallax, desktop only */
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&matchMedia('(min-width:900px) and (pointer:fine)').matches&&px.length){var tk=false;function upd(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;e.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic buttons */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }
})();

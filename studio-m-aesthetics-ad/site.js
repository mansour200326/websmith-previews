/* Studio M concept: kit 18 reveals, 19 magnetic, 12 menu tabs, 05 sticky story, 16 hours + map, plus the
   statement word-light. Everything no-ops when its hooks are missing; all content is visible without JS. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
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
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic buttons */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* statement: words light up as it scrolls through the middle of the screen */
  document.querySelectorAll('[data-words]').forEach(function(q){
    if(RM)return;
    var words=[].slice.call(q.querySelectorAll('.sw'));if(!words.length)return;
    q.classList.add('is-live');
    var tk=false;function upd(){tk=false;var r=q.getBoundingClientRect(),vh=innerHeight;var p=(vh*.82-r.top)/(r.height+vh*.35);p=Math.max(0,Math.min(1,p));var n=Math.round(p*words.length);words.forEach(function(w,i){if(i<n)w.classList.add('on')})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();
  });

  /* kit 12: treatment menu tabs (panels all visible without JS) */
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]');if(!tabs)return;tabs.hidden=false;
    var ink=tabs.querySelector('.menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function line(b){if(!b)return;ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+b.offsetLeft+'px)'}
    function pick(b,focus){btns.forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b);if(focus)b.focus()}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});var rtl=d.dir==='rtl';var f=e.key===(rtl?'ArrowLeft':'ArrowRight'),bk=e.key===(rtl?'ArrowRight':'ArrowLeft');if(f||bk){e.preventDefault();pick(btns[(i+(f?1:-1)+btns.length)%btns.length],true)}});
    var first=btns[0];pick(first);
    panels.forEach(function(p){if(p.dataset.panel===first.dataset.tab){p.classList.remove('is-in')}});
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){pick(btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||first);o.disconnect()}},{threshold:.1}).observe(root);
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
  });

  /* kit 05: sticky story */
  document.querySelectorAll('[data-k-story]').forEach(function(root){
    var steps=[].slice.call(root.querySelectorAll('[data-k-story-step]')),media=[].slice.call(root.querySelectorAll('[data-k-story-media]')),box=root.querySelector('.story__media');
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var n=steps.indexOf(e.target);
      steps.forEach(function(s,k){s.classList.toggle('is-on',k===n)});media.forEach(function(m,k){m.classList.toggle('is-on',k===n)});
      if(box)box.style.setProperty('--k-story-p',((n+1)/steps.length).toFixed(3))})},{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){io2.observe(s)});
  });

  /* kit 16: open now (UAE time) + tap-to-load map */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row){row.classList.add('is-today');var td=row.querySelector('td');if(td&&root.dataset.kToday)td.insertAdjacentHTML('beforeend',' <small>· '+root.dataset.kToday+'</small>')}
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    root.querySelectorAll('[data-k-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-k-open')||'Open now'):(root.getAttribute('data-k-shut')||'Closed now')});
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });
})();

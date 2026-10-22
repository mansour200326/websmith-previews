/* Nail Atelier by Katrina concept: kit 18 (reveals), 19 (magnetic), 12 (menu tabs), 16 (hours + map), plus header + index. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* header border on scroll */
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on()}

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
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
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var o=e.classList.contains('is-in');split(e);if(o)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  /* parallax (desktop) */
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&DESK&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2),y=c*(+e.getAttribute('data-speed')),mx=+e.getAttribute('data-max')||0;if(mx){mx*=r.height;y=Math.max(-mx,Math.min(mx,y))}e.style.transform='translate3d(0,'+y.toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* kit 12: menu tabs */
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]'),ink=tabs.querySelector('.k-menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function line(b){ink.style.width=b.offsetWidth+'px';var x=b.offsetLeft;ink.style.transform='translateX('+x+'px)'}
    function pick(b,focus){btns.forEach(function(x){var s=x===b;x.setAttribute('aria-selected',s);x.tabIndex=s?0:-1});panels.forEach(function(p){var o=p.dataset.panel===b.dataset.tab;p.hidden=!o;p.classList.remove('is-in');if(o)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b);if(focus)b.focus()}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});var rtl=document.dir==='rtl';var nx=e.key===(rtl?'ArrowLeft':'ArrowRight'),pv=e.key===(rtl?'ArrowRight':'ArrowLeft');if(nx||pv){e.preventDefault();pick(btns[(i+(nx?1:-1)+btns.length)%btns.length],true)}});
    var first=btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||btns[0];
    pick(first);
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
  });

  /* kit 16: open now + today + tap-to-load map */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row){row.classList.add('is-today');var td=row.querySelector('td');if(td)td.insertAdjacentHTML('beforeend',' <span class="vh">(today)</span>')}
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-k-open')||'Open now'):(root.getAttribute('data-k-shut')||'Closed now')}
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.onload=function(){f.classList.add('is-on');var cd=m.querySelector('.map-card');if(cd)cd.remove();else if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* services index: mark the category in view */
  var idx=[].slice.call(document.querySelectorAll('.idx a'));
  if(idx.length&&'IntersectionObserver' in window){
    var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.remove('is-on');a.removeAttribute('aria-current')});var a=map[e.target.id];if(a){a.classList.add('is-on');a.setAttribute('aria-current','true');var ul=a.closest('ul');if(ul&&ul.scrollWidth>ul.clientWidth){ul.scrollTo({left:a.offsetLeft-20,behavior:RM?'auto':'smooth'})}}}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.cat[id]').forEach(function(s){so.observe(s)});
  }
})();

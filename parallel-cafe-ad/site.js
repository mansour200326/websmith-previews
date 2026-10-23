/* Parallel Cafe concept, Websmith. Vanilla, ~6KB. Everything is visible without JS (motion gated by html.k-js). */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
      FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,DESK=matchMedia('(min-width:900px)').matches;

  /* header border on scroll */
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on()}

  /* hero: wordmark letters rise, // draws, photos wipe in opposite directions */
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    document.querySelectorAll('.word-xl,.mark--draw,.wipe-d,.wipe-u').forEach(function(e){e.classList.add('is-in')});
  })});

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var words=el.textContent.trim().split(/\s+/);
    el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
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

  /* kit 19: magnetic main buttons */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });

  /* kit 16: live open badge + today's row (Abu Dhabi time) */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var s=h[day]||[],open=s.length===2&&now>=s[0]&&now<s[1];
    root.querySelectorAll('[data-k-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut')});
  });
  /* tap-to-load map */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* menu index: a photo follows the pointer over the rows (desktop) */
  var list=document.querySelector('.idx__list'),fl=document.querySelector('.idx__float');
  if(list&&fl&&FINE&&DESK&&!RM){
    var imgs={},tx=0,ty=0,cx=0,cy=0,run=false;
    fl.querySelectorAll('img').forEach(function(i){imgs[i.getAttribute('data-k')]=i});
    function loop(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;fl.style.transform='translate3d('+(cx-130).toFixed(1)+'px,'+(cy-165).toFixed(1)+'px,0)';if(run)requestAnimationFrame(loop)}
    list.querySelectorAll('.idx__row').forEach(function(r){
      r.addEventListener('pointerenter',function(e){var k=r.getAttribute('data-k');for(var n in imgs)imgs[n].classList.toggle('is-on',n===k);if(!run){cx=tx=e.clientX;cy=ty=e.clientY;run=true;loop()}fl.classList.add('is-on')});
    });
    list.addEventListener('pointermove',function(e){tx=e.clientX+(d.dir==='rtl'?-170:170);ty=e.clientY});
    list.addEventListener('pointerleave',function(){fl.classList.remove('is-on');setTimeout(function(){if(!fl.classList.contains('is-on'))run=false},400)});
  }

  /* the room: two rows of photos slide in parallel, opposite ways, as you scroll */
  var rows=[].slice.call(document.querySelectorAll('[data-row]'));
  if(rows.length&&!RM){
    var tick=false,sec=rows[0].closest('section'),rtl=d.dir==='rtl';
    function upd(){tick=false;var r=sec.getBoundingClientRect(),vh=innerHeight;if(r.bottom<0||r.top>vh)return;
      var p=(vh-r.top)/(vh+r.height);/* 0..1 */
      rows.forEach(function(row){var max=row.scrollWidth-innerWidth;if(max<0)max=0;var dir=+row.getAttribute('data-row');
        var x=dir>0?-max*p:-max*(1-p);if(rtl)x=-x;row.style.transform='translate3d('+x.toFixed(1)+'px,0,0)'})}
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd();
  }

  /* menu page: sticky tabs follow the section in view */
  var tabs=[].slice.call(document.querySelectorAll('.tabs a'));
  if(tabs.length&&'IntersectionObserver' in window){
    var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tabs.forEach(function(t){t.classList.toggle('is-on',t.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    tabs.forEach(function(t){var s=document.querySelector(t.getAttribute('href'));if(s)tio.observe(s)});
  }
})();

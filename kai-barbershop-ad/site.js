/* KAI Barbershop concept. Kit 18 (reveals), 19 (magnetic), 16 (hours/map) and 06 (counter), restyled. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* header border once scrolled */
  var hd=document.querySelector('.hd');
  if(hd){var onS=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',onS,{passive:true});onS()}

  /* pick a service, then one tap on WhatsApp (message is prefilled) */
  document.querySelectorAll('[data-book]').forEach(function(root){
    var wa=root.querySelector('[data-wa]'),label=root.querySelector('[data-wa-label]');
    root.querySelectorAll('.chip').forEach(function(c){
      c.addEventListener('click',function(){
        root.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false')});
        wa.href='https://wa.me/971509707524?text='+encodeURIComponent(c.getAttribute('data-msg'));
        if(label)label.textContent=c.getAttribute('data-label');
      });
    });
  });

  /* hours: today's column + open now (Abu Dhabi time = Asia/Dubai) */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    root.querySelectorAll('[data-day="'+day+'"]').forEach(function(c){c.classList.add('is-today')});
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    document.querySelectorAll('[data-k-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut')});
  });

  /* map loads only when asked */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    if(btn)btn.addEventListener('click',function(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');btn.remove()};m.appendChild(f)});
  });

  /* services page: highlight the category in view */
  var jump=document.querySelectorAll('.jump a');
  if(jump.length&&'IntersectionObserver' in window){
    var jio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)jump.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('.cat[id]').forEach(function(s){jio.observe(s)});
  }

  /* counter (kit 06) */
  var cs=document.querySelectorAll('[data-k-count]');
  if(cs.length&&!RM&&'IntersectionObserver' in window){
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=parseFloat(el.getAttribute('data-k-count')),dec=+el.getAttribute('data-k-count-dec')||0,t0=performance.now();
      (function f(t){var k=Math.min(1,(t-t0)/1600),v=to*(1-Math.pow(1-k,4));el.textContent=v.toFixed(dec);if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
    cs.forEach(function(el){el.textContent=(0).toFixed(+el.getAttribute('data-k-count-dec')||0);cio.observe(el)});
  }

  /* magnetic buttons (kit 19) */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* reveals (kit 18) */
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
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }

  /* parallax on the wide room photo (desktop only) */
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;e.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd()}
})();

/* Classy Salon concept · Websmith. Kit 18 (reveals), 19 (magnetic), 06 (counter), 16 (map + open badge), plus the
   sign spread, the 24h bars and the mobile dock. Everything is visible without JS; all motion is off under reduced motion. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* ---- kit 18: reveals ---- */
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
  var els=document.querySelectorAll('[data-reveal],[data-in]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&DESK&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* ---- the sign: letters gather at the centre, then spread to the edges (like the lettering on their door) ---- */
  document.querySelectorAll('[data-spread]').forEach(function(w){
    if(RM)return;
    var ls=[].slice.call(w.children);
    function gather(){var r=w.getBoundingClientRect(),cx=r.left+r.width/2,tot=0;ls.forEach(function(l){l.style.transform='';tot+=l.getBoundingClientRect().width});
      var x=cx-tot/2;ls.forEach(function(l){var b=l.getBoundingClientRect();l.style.transform='translateX('+(x-b.left).toFixed(1)+'px)';x+=b.width})}
    function go(){ls.forEach(function(l,i){l.style.transition='transform 1.5s cubic-bezier(.16,1,.3,1) '+(Math.abs(i-(ls.length-1)/2)*60)+'ms';l.style.transform=''})}
    var start=function(){gather();w.getBoundingClientRect();
      if(w.hasAttribute('data-spread-now')){setTimeout(function(){requestAnimationFrame(go)},500)}
      else{var o=new IntersectionObserver(function(e){if(e[0].isIntersecting){o.disconnect();go()}},{threshold:.4});o.observe(w)}};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else start();
  });

  /* ---- kit 19: magnetic ---- */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* ---- kit 06: counters ---- */
  var cs=document.querySelectorAll('[data-k-count]');
  if(cs.length&&!RM&&'IntersectionObserver' in window){
    var fmt=function(el,v,dec){return v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec,useGrouping:false})};
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=parseFloat(el.getAttribute('data-k-count')),dec=+el.getAttribute('data-k-count-dec')||0,from=parseFloat(el.getAttribute('data-k-count-from')||0),t0=performance.now();
      (function f(t){var k=Math.min(1,(t-t0)/1600),q=1-Math.pow(1-k,4);el.textContent=fmt(el,from+(to-from)*q,dec);if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
    cs.forEach(function(el){el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';el.textContent=fmt(el,parseFloat(el.getAttribute('data-k-count-from')||0),+el.getAttribute('data-k-count-dec')||0);cio.observe(el)});
  }

  /* ---- hours (Dubai time): today row, now line, open badge ---- */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('[data-day="'+day+'"]');
    if(row){row.classList.add('is-today');var bar=row.querySelector('.clock__bar');if(bar){var n=document.createElement('span');n.className='clock__now';n.style.setProperty('--n',now.toFixed(2));n.setAttribute('aria-hidden','true');bar.appendChild(n)}
      var lab=row.querySelector('.clock__d');if(lab)lab.insertAdjacentHTML('beforeend',' <small>'+(root.getAttribute('data-today')||'· today')+'</small>')}
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?root.getAttribute('data-k-open'):root.getAttribute('data-k-shut')}
  });

  /* ---- kit 16: tap-to-load map ---- */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* ---- mobile dock: shows once the hero buttons scroll away ---- */
  var dock=document.querySelector('.dock'),anchor=document.querySelector('[data-dock-after]');
  if(dock&&anchor&&'IntersectionObserver' in window){
    new IntersectionObserver(function(e){var past=!e[0].isIntersecting&&e[0].boundingClientRect.top<0;dock.classList.toggle('is-on',past);dock.toggleAttribute('inert',!past)}).observe(anchor);
    dock.setAttribute('inert','');
  }
})();

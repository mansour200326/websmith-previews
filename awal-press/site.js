/* Awal Press concept · Websmith. Kit 18 (reveals), 19 (magnetic), 06 (counters), 16 (hours, Bahrain time). */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* kit 18: stagger + line split + observer */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||80;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',Math.min(i*s,900))})});
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
  /* parallax on the band photo, desktop only */
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&px.length&&matchMedia('(min-width:900px) and (pointer:fine)').matches){var tk=false;function upd(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;e.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* kit 06: counters */
  var cs=document.querySelectorAll('[data-k-count]');
  if(cs.length&&!RM&&'IntersectionObserver' in window){
    var fmt=function(el,v){var dec=+el.getAttribute('data-k-count-dec')||0;return v.toLocaleString(el.getAttribute('data-k-count-locale')||'en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec})};
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=parseFloat(el.getAttribute('data-k-count')),t0=performance.now();
      (function f(t){var k=Math.min(1,(t-t0)/1600),q=1-Math.pow(1-k,4);el.textContent=fmt(el,to*q);if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
    cs.forEach(function(el){el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';el.textContent=fmt(el,0);cio.observe(el)});
  }

  /* kit 16: open now, Bahrain time */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:root.getAttribute('data-k-tz')||'Asia/Bahrain',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var s=h[day]||[],open=s.length===2&&now>=s[0]&&now<s[1];
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-k-open')||'Open now'):(root.getAttribute('data-k-shut')||'Closed now')}
  });
})();

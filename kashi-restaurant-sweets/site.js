/* Kashi concept: kit 18 reveals, kit 19 magnetic, kit 16 hours/map, plus seal-on-scroll and menu scrollspy. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- kit 18: reveals ---- */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    el.innerHTML='<span class="vh">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  var els=[].slice.call(document.querySelectorAll('[data-reveal]'));
  function showAll(){els.forEach(function(e){e.classList.add('is-in')})}
  if(RM||!('IntersectionObserver' in window)){showAll()}
  else{
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
    /* safety: anything already scrolled past (anchor jumps, restored scroll) is shown, so no section is ever left blank */
    var sweep=function(){var vh=innerHeight;els.forEach(function(e){if(!e.classList.contains('is-in')){var r=(e.getAttribute('data-reveal')==='clip'?e.parentElement:e).getBoundingClientRect();if(r.top<vh*0.92)e.classList.add('is-in')}})};
    var st=false;addEventListener('scroll',function(){if(!st){st=true;setTimeout(function(){st=false;sweep()},120)}},{passive:true});
    addEventListener('load',sweep);addEventListener('beforeprint',showAll);addEventListener('hashchange',function(){setTimeout(sweep,60)});
  }

  /* ---- kit 19: magnetic main buttons ---- */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });

  /* ---- the Kashi seal turns as you scroll (stops when you stop) ---- */
  var seals=[].slice.call(document.querySelectorAll('[data-spin]'));
  if(seals.length&&!RM){var tk=false;addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;var y=scrollY;seals.forEach(function(s){s.style.rotate=(y*0.12).toFixed(1)+'deg'})})},{passive:true})}

  /* ---- kit 16: open now (Dubai time), today's row, tap-to-load map ---- */
  var H={0:[11,23.75],1:[11,23],2:[11,23.75],3:[11,23.75],4:[11,23.75],5:[11,23.75],6:[11,23.75]};
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var span=H[day],open=now>=span[0]&&now<span[1],fmt=function(h){var m=Math.round((h%1)*60),hh=Math.floor(h),ap=hh>=12?'pm':'am',h12=hh%12||12;return h12+(m?':'+String(m).padStart(2,'0'):'')+ap};
  var msg=open?'Open now, until '+fmt(span[1])+' tonight':(now<span[0]?'Opens today at '+fmt(span[0]):'Closed now, opens tomorrow at 11am');
  document.querySelectorAll('[data-open]').forEach(function(b){var d=b.querySelector('.dot'),t=b.querySelector('[data-open-t]');if(d)d.classList.add(open?'is-open':'is-shut');b.classList.add(open?'is-open':'is-shut');if(t)t.textContent=msg});
  document.querySelectorAll('.hours tr[data-day="'+day+'"]').forEach(function(r){r.classList.add('is-today')});
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Map: Kashi Restaurant and Sweets, Al Karama';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* ---- phone action bar: appears once the first screen (which has its own buttons) is scrolled past ---- */
  var bar=document.querySelector('.abar'),top1=document.querySelector('.hero,.intro');
  if(bar){var ab=function(){bar.classList.toggle('is-on',scrollY>innerHeight*0.6)};addEventListener('scroll',ab,{passive:true});ab()}

  /* ---- full menu: highlight the section you're reading ---- */
  var links=[].slice.call(document.querySelectorAll('.mn__nav a'));
  if(links.length){
    var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
    var cur=null;
    var spy=function(){var y=innerHeight*0.32,on=secs[0];secs.forEach(function(s){if(s&&s.getBoundingClientRect().top<y)on=s});
      if(on===cur)return;cur=on;links.forEach(function(a,i){var hit=secs[i]===on;a.classList.toggle('is-on',hit);if(hit){a.setAttribute('aria-current','location');var ol=a.closest('ol');if(ol&&ol.scrollWidth>ol.clientWidth){ol.scrollTo({left:a.offsetLeft-24,behavior:RM?'auto':'smooth'})}}else a.removeAttribute('aria-current')})};
    var sp=false;addEventListener('scroll',function(){if(!sp){sp=true;requestAnimationFrame(function(){sp=false;spy()})}},{passive:true});spy();
  }
})();

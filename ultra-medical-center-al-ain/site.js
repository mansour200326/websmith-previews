/* Ultra Medical Center concept. Kit 18 (reveal), 19 (micro), 13 (team), 16 (hours/map) + hero hours line. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR=document.documentElement.lang==='ar';

  /* ---- kit 18: reveals ---- */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    var words=el.textContent.trim().split(/[ \t\n\r]+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
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

  /* ---- kit 13: team stagger ---- */
  var cards=document.querySelectorAll('.k-team__card');
  if(cards.length){
    if(RM||!('IntersectionObserver' in window))cards.forEach(function(c){c.classList.add('is-in')});
    else{var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target,i=[].indexOf.call(el.parentNode.children,el)%4;setTimeout(function(){el.classList.add('is-in')},i*110);tio.unobserve(el)}})},{threshold:.12});cards.forEach(function(c){tio.observe(c)})}
  }

  /* ---- hours (Dubai/Al Ain time): Sat-Thu 8-24, Fri 8-22 ---- */
  var H={0:[8,24],1:[8,24],2:[8,24],3:[8,24],4:[8,24],5:[8,22],6:[8,24]};
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var span=H[day],open=now>=span[0]&&now<span[1];
  var until=span[1]===24?(AR?'حتى منتصف الليل':'until midnight'):(AR?'حتى ١٠ مساءً':'until 10pm');
  document.querySelectorAll('[data-open-line]').forEach(function(el){
    var dot=el.querySelector('.dot');if(dot){dot.hidden=false;if(!open)dot.classList.add('is-shut')}
    var t=el.querySelector('[data-open-text]');if(t)t.textContent=open?(AR?'مفتوح الآن، '+until:'Open now, '+until):(AR?'مغلق الآن، نفتح ٨ صباحاً':'Closed now, opens 8am');
  });
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(AR?'مفتوح الآن':'Open now'):(AR?'مغلق الآن':'Closed now')}
  });
  /* ---- kit 16: tap-to-load map ---- */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=AR?'خريطة مركز الترا الطبي':'Map of Ultra Medical Center';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* ---- kit 19: magnetic ---- */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }
})();

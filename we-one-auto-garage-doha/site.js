/* We One Auto Garage concept · Websmith. Kit 18 (reveals) + 19 (magnetic) + live split-shift hours in Doha time. */
(function(){
  var AR=document.documentElement.lang==='ar',RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hours: JS day 0=Sun..6=Sat, two shifts a day, Friday closed (Google Maps listing) ---- */
  var H={0:[[7,12.5],[15,20.5]],1:[[7,12],[15,20.5]],2:[[7,12],[15,20.5]],3:[[7,12],[15,20.5]],4:[[7,12],[15,20.5]],5:[],6:[[7,12.5],[15,20.5]]};
  var DN=AR?['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function fmt(h){var m=Math.round((h%1)*60);return Math.floor(h)+':'+(m<10?'0':'')+m}
  var p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Qatar',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(p.find(function(x){return x.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var spans=H[day]||[],open=false,msg='';
  for(var i=0;i<spans.length;i++){if(now>=spans[i][0]&&now<spans[i][1]){open=true;msg=AR?'مفتوح الآن حتى '+fmt(spans[i][1]):'Open now until '+fmt(spans[i][1]);break}}
  if(!open){
    var nxt=null;for(var j=0;j<spans.length;j++){if(now<spans[j][0]){nxt=spans[j][0];break}}
    if(nxt!==null)msg=(spans.length&&now>=spans[0][1])?(AR?'استراحة الظهر، نعود الساعة '+fmt(nxt):'On the midday break, back at '+fmt(nxt)):(AR?'مغلق الآن، نفتح الساعة '+fmt(nxt):'Closed now, opens at '+fmt(nxt));
    else{var d=(day+1)%7;while(!(H[d]||[]).length)d=(d+1)%7;msg=AR?'مغلق الآن، نفتح '+DN[d]+' الساعة '+fmt(H[d][0][0]):'Closed now, opens '+DN[d]+' at '+fmt(H[d][0][0])}
  }
  document.querySelectorAll('[data-live]').forEach(function(el){
    var t=el.querySelector('[data-live-text]');if(t)t.textContent=msg;
    el.classList.toggle('is-open',open);el.hidden=false;
  });
  document.querySelectorAll('.hours tr[data-day="'+day+'"]').forEach(function(r){r.classList.add('is-today')});

  /* ---- mobile menu ---- */
  var mb=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(mb&&nav){
    var setTop=function(){var hd=document.querySelector('.hd');document.documentElement.style.setProperty('--hd-top',hd.getBoundingClientRect().bottom+'px')};
    mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o);if(o)setTop()});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('is-open')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false');mb.focus()}});
  }

  /* ---- map: tap to load ---- */
  document.querySelectorAll('[data-map]').forEach(function(m){
    var b=m.querySelector('button');if(!b)return;
    b.addEventListener('click',function(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-map');f.title=AR?'خريطة الموقع':'Map to We One Auto Garage';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');b.remove();var pin=m.querySelector('.map__pin');if(pin)pin.remove()};m.appendChild(f)});
  });

  /* ---- service rows: photo peeks beside the pointer (desktop only) ---- */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    var rows=document.querySelectorAll('.job[data-img]');
    if(rows.length){
      var pk=document.createElement('div');pk.className='peek';pk.setAttribute('aria-hidden','true');var im=new Image();im.alt='';pk.appendChild(im);document.body.appendChild(pk);
      var tx=0,ty=0,cx=0,cy=0,run=false;
      function loop(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;pk.style.left=cx+'px';pk.style.top=cy+'px';if(run)requestAnimationFrame(loop)}
      rows.forEach(function(r){
        r.addEventListener('pointerenter',function(e){im.src=r.getAttribute('data-img');tx=cx=e.clientX+(AR?-330:30);ty=cy=e.clientY-180;pk.classList.add('is-on');if(!run){run=true;loop()}});
        r.addEventListener('pointermove',function(e){tx=e.clientX+(AR?-330:30);ty=e.clientY-180});
        r.addEventListener('pointerleave',function(){pk.classList.remove('is-on');run=false});
      });
    }
  }
})();

/* ---- kit 18 · reveals ---- */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    el.innerHTML='<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
})();

/* ---- kit 19 · magnetic buttons ---- */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();

/* Hairworks concept. Motion from the Websmith kit (07 marquee, 16 hours/map, 18 reveal, 19 micro), restyled. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Opening times exactly as published: Tue-Wed 9.30-6.00, Thu 9.30-8.00, Sat 9.30-5.00 (Irish time) */
  var H={2:[9.5,18],3:[9.5,18],4:[9.5,20],6:[9.5,17]},TZ='Europe/Dublin';
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function t(h){var hh=Math.floor(h),m=Math.round((h-hh)*60),ap=hh>=12?'pm':'am',h12=hh%12||12;return h12+'.'+(m<10?'0':'')+m+ap}
  var p=new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(k){return(p.find(function(x){return x.type===k})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var span=H[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
  function next(){for(var i=0;i<8;i++){var d=(day+i)%7,s=H[d];if(!s)continue;if(i===0&&now>=s[0])continue;
    return (i===0?'today':i===1?'tomorrow':DAYS[d])+' at '+t(s[0])}return''}

  /* header status */
  document.querySelectorAll('[data-open-line]').forEach(function(el){
    el.hidden=false;el.classList.toggle('is-shut',!open);
    el.querySelector('span').textContent=open?'Open now, until '+t(span[1]):'Closed now, opens '+next();
  });
  /* hero "today" line */
  document.querySelectorAll('[data-today]').forEach(function(el){
    var s=el.querySelector('strong'),m=el.querySelector('span');
    if(open){s.textContent='Open today till '+t(span[1]);m.textContent=DAYS[day]+', '+t(span[0])+' to '+t(span[1])+'.'}
    else if(span.length===2&&now<span[0]){s.textContent='Open today at '+t(span[0]);m.textContent=DAYS[day]+', '+t(span[0])+' to '+t(span[1])+'.'}
    else{var n=next();s.textContent='Next open '+n.replace(' at ',', ');m.textContent='Ring ahead to book your time.'}
  });
  /* Tuesday line */
  document.querySelectorAll('[data-tue]').forEach(function(el){
    if(day===2)el.textContent=open||now<9.5?'That’s today.':'';
    else{var d=new Date();var add=(2-day+7)%7||7;d.setDate(d.getDate()+add);
      el.textContent='Next one: Tuesday '+d.toLocaleDateString('en-IE',{day:'numeric',month:'long'})+'.'}
  });
  /* kit 16: hours table + badge */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');
      b.querySelector('span').textContent=open?'Open now, until '+t(span[1]):'Closed now. We open '+next()+'.'}
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Map: Hairworks, 4 Douglas West, Douglas, Cork';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');var c=m.querySelector('.map-cta');if(c)c.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener("click",load);
    if(matchMedia("(min-width:900px)").matches)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();load()}},{rootMargin:"300px"}).observe(m);
  });

  /* header shadow */
  var hd=document.querySelector('.hd');if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on()}

  /* hero entrance */
  var hero=document.querySelector('[data-hero]');
  if(hero){if(RM)hero.classList.add('is-go');else requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add('is-go')})})}

  /* kit 07 marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr)return;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||60)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* row stagger index */
  document.querySelectorAll('.rv-rows').forEach(function(r){[].forEach.call(r.querySelectorAll('.row'),function(li,i){li.style.setProperty('--i',i)})});

  /* kit 18 reveal */
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var parts=[];[].forEach.call(el.childNodes,function(n){var it=n.nodeType===1&&n.tagName==='EM';(n.textContent||'').split(/\s+/).forEach(function(w){if(w)parts.push({w:w,i:it})})});
    el.innerHTML=parts.map(function(x){return'<span class="k-rv-w">'+esc(x.w)+'</span>'}).join(' ');
    var lines=[],top=null,ws=el.querySelectorAll('.k-rv-w');[].forEach.call(ws,function(w,k){var tp=w.offsetTop;if(tp!==top){lines.push([]);top=tp}lines[lines.length-1].push(parts[k])});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.map(function(x){return x.i?'<em>'+esc(x.w)+'</em>':esc(x.w)}).join(' ')+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal],.rv-rows');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var tg=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(tg.__kRv=tg.__kRv||[]).push(e);io.observe(tg)});
  }
  /* parallax (desktop) */
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&matchMedia('(min-width:900px) and (pointer:fine)').matches&&px.length){var tk=false;
    var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;e.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd()}

  /* kit 19 magnetic */
  if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});});
  }
})();

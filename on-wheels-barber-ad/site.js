/* On Wheels concept: kit 07 marquee, kit 18 reveal, kit 19 magnetic (from ~/projects/leads/kit/core/kit.js) + site bits. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR=document.documentElement.lang==='ar';

  /* kit 07 marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr||m.dataset.kReady)return;m.dataset.kReady=1;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 18 reveal (+ custom groups: .road, .rows, .inside__fig use the same observer) */
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var words=el.textContent.trim().split(/\s+/);
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=[].slice.call(document.querySelectorAll('[data-reveal],.road,.rows,.inside__fig,[data-count]'));
  function fire(x){x.classList.add('is-in');if(x.hasAttribute('data-count'))count(x)}
  if(RM||!('IntersectionObserver' in window)){els.forEach(fire)}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(fire);io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  function count(el){
    var to=+el.getAttribute('data-count');if(RM||el.dataset.done)return;el.dataset.done=1;
    var t0=performance.now(),d=1400;
    (function f(t){var p=Math.min(1,(t-t0)/d);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0);
  }

  /* kit 19 magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* open now (Abu Dhabi time). Shifts from their Fresha listing; hours past 24 run into the next morning. */
  var S={0:[14,26],1:[12,24],3:[12,24],4:[12,24],5:[14,26],6:[14,26]};
  var DAYS=AR?['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function hr(h){h=h%24;if(AR){return h===0?'12 منتصف الليل':h===12?'12 الظهر':h<12?h+' الفجر':h<16?(h-12)+' الظهر':(h-12)+' العصر'}return h===0?'12am':h===12?'12pm':h<12?h+'am':(h-12)+'pm'}
  try{
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var y=S[(day+6)%7],t=S[day],open=false,until=null,next='';
    if(y&&y[1]>24&&now<y[1]-24){open=true;until=y[1]}
    else if(t&&now>=t[0]&&now<t[1]){open=true;until=t[1]}
    if(!open){
      if(t&&now<t[0])next=(AR?'نفتح اليوم ':'opens today ')+hr(t[0]);
      else for(var i=1;i<8;i++){var dd=(day+i)%7;if(S[dd]){next=(AR?'نفتح ':'opens ')+(i===1?(AR?'بكرة':'tomorrow'):DAYS[dd])+' '+hr(S[dd][0]);break}}
    }
    var txt=open?(AR?'مفتوح الحين · لين '+hr(until):'Open now · until '+hr(until)):(AR?'مسكّر · ':'Closed · ')+next;
    document.querySelectorAll('[data-ow-status]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');var s=b.querySelector('span:last-child');if(s)s.textContent=txt});
    var row=document.querySelector('.tbl tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
  }catch(e){}

  /* inside the van: legend <-> pin highlight */
  document.querySelectorAll('[data-pin]').forEach(function(li){
    var p=document.querySelector('.pin[data-n="'+li.getAttribute('data-pin')+'"]');if(!p)return;
    var on=function(){li.classList.add('is-hot');p.classList.add('is-hot')},off=function(){li.classList.remove('is-hot');p.classList.remove('is-hot')};
    li.addEventListener('pointerenter',on);li.addEventListener('pointerleave',off);
  });

  /* services: sticky photo follows the group in view */
  var media=document.querySelector('.svc__media');
  if(media&&'IntersectionObserver' in window){
    var imgs=media.querySelectorAll('img'),cap=media.querySelector('figcaption');
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var k=e.target.getAttribute('data-img');
      imgs.forEach(function(im){var on=im.getAttribute('data-k')===k;im.classList.toggle('is-on',on);if(on&&cap)cap.textContent=im.getAttribute('data-cap')})})},{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('.grp[data-img]').forEach(function(g){so.observe(g)});
  }
})();

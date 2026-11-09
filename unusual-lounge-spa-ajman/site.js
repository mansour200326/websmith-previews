/* Unusual Lounge Spa concept · kit 16, 18, 19, 26 + header, menu hover photo, tabs */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* header: solid after the hero top, hides on scroll down, shows on scroll up */
  var head=document.querySelector('.u-head');
  if(head){var last=0,tk=false;function hs(){tk=false;var y=scrollY;head.classList.toggle('is-solid',y>40);head.classList.toggle('is-hidden',y>500&&y>last+4&&!head.contains(document.activeElement));if(y<last-4||y<500)head.classList.remove('is-hidden');last=y}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(hs)}},{passive:true});hs();}


  /* hero arch outline: drawn 14px outside the photo arch, from the real photo size, one continuous line */
  document.querySelectorAll('.u-hero__arch').forEach(function(w){
    var ph=w.querySelector('.u-arch'),svg=w.querySelector('svg'),path=svg&&svg.querySelector('path');if(!ph||!path)return;
    var G=14,first=true;
    function geo(){var pw=ph.offsetWidth,hh=ph.offsetHeight;if(!pw)return;var W=pw+2*G,H=hh+G,r=pw/2+G-.7,cx=W/2,cy=pw/2+G;
      svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.style.width=W+'px';svg.style.height=H+'px';
      path.setAttribute('d','M'+(cx-r).toFixed(1)+' '+H+'V'+cy.toFixed(1)+'A'+r.toFixed(1)+' '+r.toFixed(1)+' 0 0 1 '+(cx+r).toFixed(1)+' '+cy.toFixed(1)+'V'+H);
      var L=path.getTotalLength();path.style.strokeDasharray=L;
      if(first&&!RM){first=false;path.style.strokeDashoffset=L;path.getBoundingClientRect();setTimeout(function(){path.style.transition='stroke-dashoffset 2.2s cubic-bezier(.16,1,.3,1)';path.style.strokeDashoffset=0},700)}else{first=false;path.style.strokeDashoffset=0}}
    geo();addEventListener('resize',geo);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(geo);
  });

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var words=el.textContent.trim().split(/[ \t\n\r]+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){var ready=function(){lineEls.forEach(split)};if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});}
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});}
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&FINE&&innerWidth>=900&&px.length){var pk=false;function upd(){pk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;e.style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!pk){pk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});});

  /* kit 16: open now (Dubai time) + tap-to-load map */
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60,open=now>=11&&now<23;
  document.querySelectorAll('[data-u-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut')});
  document.querySelectorAll('tr[data-day="'+day+'"]').forEach(function(r){r.style.fontWeight='700'});
  document.querySelectorAll('[data-k-map]').forEach(function(m){var btn=m.querySelector('button');
    btn&&btn.addEventListener('click',function(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');btn.remove()};m.appendChild(f)});});

  /* kit 26: tilt card */
  document.querySelectorAll('[data-k-tilt]').forEach(function(w){var c=w.querySelector('.k-tilt__card');if(!c)return;
    if(RM){w.classList.add('is-in');return}
    var o=new IntersectionObserver(function(e){if(e[0].isIntersecting){w.classList.add('is-in');o.disconnect()}},{threshold:.3});o.observe(w);
    if(!matchMedia('(hover: hover)').matches)return;
    var max=+w.getAttribute('data-k-tilt-max')||10,raf=0,x=.5,y=.5;
    function ap(){raf=0;c.style.setProperty('--ry',((x-.5)*2*max).toFixed(2)+'deg');c.style.setProperty('--rx',((.5-y)*2*max).toFixed(2)+'deg');c.style.setProperty('--mx',(x*100).toFixed(1)+'%');c.style.setProperty('--my',(y*100).toFixed(1)+'%')}
    w.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;var r=c.getBoundingClientRect();x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));y=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));w.classList.add('is-live');if(!raf)raf=requestAnimationFrame(ap)});
    w.addEventListener('pointerleave',function(){x=y=.5;w.classList.remove('is-live');ap()});});

  /* menu index: an arch photo follows the pointer over the category names (desktop) */
  var fl=document.querySelector('.u-float');
  if(fl&&FINE&&!RM){var im=fl.querySelector('img'),tx=0,ty=0,cx=0,cy=0,run=false;
    function loop(){cx+=(tx-cx)*.14;cy+=(ty-cy)*.14;fl.style.transform='translate3d('+(cx-130).toFixed(1)+'px,'+(cy-170).toFixed(1)+'px,0) scale('+(fl.classList.contains('is-on')?1:.85)+')';if(Math.abs(tx-cx)>.3||Math.abs(ty-cy)>.3)requestAnimationFrame(loop);else run=false}
    document.querySelectorAll('[data-img]').forEach(function(a){
      a.addEventListener('pointerenter',function(e){im.src=a.getAttribute('data-img');fl.classList.add('is-on');if(!cx){cx=e.clientX;cy=e.clientY}});
      a.addEventListener('pointerleave',function(){fl.classList.remove('is-on')});
      a.addEventListener('pointermove',function(e){tx=e.clientX+(d.dir==='rtl'?-170:170);ty=e.clientY;if(!run){run=true;requestAnimationFrame(loop)}});});}

  /* services tabs: mark the category in view */
  var tabs=[].slice.call(document.querySelectorAll('.u-tabs a'));
  if(tabs.length&&'IntersectionObserver' in window){var to=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tabs.forEach(function(t){var on=t.getAttribute('href')==='#'+e.target.id;t.classList.toggle('is-on',on);if(on){t.setAttribute('aria-current','true');var p=t.parentElement;p.scrollTo({left:t.offsetLeft-p.offsetWidth/2+t.offsetWidth/2,behavior:RM?'auto':'smooth'})}else t.removeAttribute('aria-current')})}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.u-cat').forEach(function(s){to.observe(s)});}
})();

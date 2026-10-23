/* Lyons Transmission Centre concept - motion layer (Websmith kit 05/07/11/16/18/19, restyled) */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
      DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* header border on scroll */
  var hd=document.querySelector('.hd');
  if(hd){var lg=document.querySelector('.hero__logo');var onS=function(){hd.classList.toggle('is-scrolled',scrollY>8);if(lg)hd.classList.toggle('is-past',lg.getBoundingClientRect().bottom<60)};addEventListener('scroll',onS,{passive:true});onS();}

  /* hero entrance: waits for the intro panel if it is playing */
  var hero=document.querySelector('.hero');
  if(hero){var go=function(){hero.classList.add('is-go')};
    if(RM)go();else if(d.classList.contains('k-intro-on'))setTimeout(go,1150);else requestAnimationFrame(function(){setTimeout(go,60)});}

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
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
  var els=document.querySelectorAll('[data-reveal],.band,.bays');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  /* parallax */
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });

  /* kit 11: accordion open/close */
  document.querySelectorAll('[data-k-acc] .k-acc__row').forEach(function(dt){var s=dt.querySelector('summary'),b=dt.querySelector('.k-acc__body');
    s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
      if(dt.open){var h=b.offsetHeight;b.animate({height:[h+'px','0px'],opacity:[1,0]},{duration:380,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){dt.open=false};}
      else{dt.open=true;var h2=b.offsetHeight;b.animate({height:['0px',h2+'px'],opacity:[0,1]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});}});});

  /* kit 05: sticky story */
  document.querySelectorAll('[data-k-story]').forEach(function(root){
    var steps=[].slice.call(root.querySelectorAll('[data-k-story-step]')),media=[].slice.call(root.querySelectorAll('[data-k-story-media]'));
    var box=root.querySelector('.k-story__media'),cnt=root.querySelector('.k-story__count b');
    var o=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var n=steps.indexOf(e.target);
      steps.forEach(function(s,k){s.classList.toggle('is-on',k===n)});media.forEach(function(m,k){m.classList.toggle('is-on',k===n)});
      if(cnt)cnt.textContent=('0'+(n+1)).slice(-2);
      if(box)box.style.setProperty('--k-story-p',((n+1)/steps.length).toFixed(3));})},{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){o.observe(s)});
  });

  /* kit 07: marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr)return;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 16: hours (split day with lunch) in Brandon time + tap-to-load map */
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var tz=root.getAttribute('data-k-tz')||'America/Winnipeg';
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var spans=h[day]||[],state='shut';
    spans.forEach(function(s){if(now>=s[0]&&now<s[1])state='open'});
    if(state==='shut'&&spans.length>1&&now>=spans[0][1]&&now<spans[1][0])state='lunch';
    var txt={open:'Open now',lunch:'Closed for lunch, back at 1 pm',shut:'Closed now. Open weekdays 8 am to 5 pm'};
    document.querySelectorAll('[data-k-badge]').forEach(function(b){b.hidden=false;b.classList.add('is-'+state);b.querySelector('span').textContent=b.hasAttribute('data-short')&&state==='shut'?'Closed now':txt[state]});
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Map of Lyons Transmission Centre, 2127 Lyndale Drive, Brandon';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
    if(matchMedia('(min-width:900px)').matches)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();load()}},{rootMargin:'200px'}).observe(m);
  });

  /* services index + mobile chips: mark the group in view */
  var setH=function(){var h=document.querySelector('.hd');if(h)d.style.setProperty('--hd-h',h.offsetHeight+'px')};setH();addEventListener('resize',setH);
  var idx=[].slice.call(document.querySelectorAll('.idx__nav a,.chips a'));
  [].forEach.call(document.querySelectorAll('.idx__nav a:first-child,.chips li:first-child a'),function(a){a.classList.add('is-on')});
  if(idx.length&&'IntersectionObserver' in window){
    var oi=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;idx.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('is-on',on);
      if(on&&a.closest('.chips')){var ol=a.closest('ol');ol.scrollTo({left:a.offsetLeft-20,behavior:RM?'auto':'smooth'})}})})},{rootMargin:'-35% 0px -60% 0px'});
    document.querySelectorAll('.grp[id],.cell[id],.tires[id]').forEach(function(s){oi.observe(s)});
  }
})();

/* Khatt Water System concept - kit 18 (reveals), 19 (magnetic), 16 (map), plus the purification pipe */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile menu */
  var hd=document.querySelector('.hd'),mb=document.querySelector('.hd__menu');
  if(hd&&mb)mb.addEventListener('click',function(){var o=hd.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});

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
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }

  /* parallax (desktop) */
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(!RM&&matchMedia('(min-width:900px) and (pointer:fine)').matches&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* hero: the water inside the letters moves with the scroll, on phones too (scroll is the gesture there) */
  var dr=document.querySelector('[data-drift]');
  if(dr&&!RM){var dt=false,sp=matchMedia('(max-width:899px)').matches?600:900;var dup=function(){dt=false;var k=Math.min(scrollY,sp)/sp;dr.querySelectorAll('.lt').forEach(function(l){l.style.setProperty('--drift',(k*-22).toFixed(2)+'%');l.style.setProperty('--drifty',(k*30).toFixed(2)+'%')})};
    addEventListener('scroll',function(){if(!dt){dt=true;requestAnimationFrame(dup)}},{passive:true});}

  /* the pipe: water line fills as you scroll through the steps; each step lights when reached */
  document.querySelectorAll('[data-pipe]').forEach(function(p){
    if(RM){p.classList.add('is-static');return}
    var steps=[].slice.call(p.querySelectorAll('.step')),tick=false;
    function run(){tick=false;var r=p.getBoundingClientRect(),vh=innerHeight,mark=vh*.62;
      var f=Math.min(1,Math.max(0,(mark-r.top)/r.height));p.style.setProperty('--fill',f.toFixed(3));
      steps.forEach(function(s){var d=s.querySelector('.step__dot').getBoundingClientRect();s.classList.toggle('is-on',d.top+24<mark)})}
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});addEventListener('resize',run);run();
  });

  /* about: index highlights the section in view */
  var idx=[].slice.call(document.querySelectorAll('.doc__idx a'));
  if(idx.length&&'IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-30% 0px -60% 0px'});
    idx.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io2.observe(t)});
  }

  /* kit 16: tap-to-load map */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
    /* load on its own when the section comes near, so the map is simply there */
    if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){load();mo.disconnect()}},{rootMargin:'600px 0px'});mo.observe(m)}
  });

  /* kit 19: magnetic main buttons */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }
})();

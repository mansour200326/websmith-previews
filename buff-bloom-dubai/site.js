/* Buff & Bloom concept: reveal layer (kit 18, trimmed), magnetic buttons (kit 19), header + mobile bar, services chips. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header border + mobile action bar after the hero
  var hd=document.querySelector('.hd'),bar=document.querySelector('.mbar'),hero=document.querySelector('.hero,.ph');
  function onScroll(){
    var y=scrollY;if(hd)hd.classList.toggle('is-scrolled',y>8);
    if(bar&&hero){bar.classList.toggle('is-on',y>hero.offsetTop+hero.offsetHeight*0.6)}
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // stagger
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){c.style.setProperty('--d',(i*s)+'ms')})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--d',e.getAttribute('data-reveal-delay')+'ms')});

  // split headings into masked lines
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;
    var txt=el.textContent.trim();
    var words=txt.split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML='<span class="sr">'+esc(txt)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }

  // observe reveals + the route scale
  var els=[].slice.call(document.querySelectorAll('[data-reveal],.scale'));
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }

  // magnetic main buttons (desktop only)
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  // services page: highlight the chip of the group in view
  var chips=[].slice.call(document.querySelectorAll('.chips a'));
  if(chips.length&&'IntersectionObserver' in window){
    var map={};chips.forEach(function(c){map[c.getAttribute('href').slice(1)]=c});
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){chips.forEach(function(c){c.classList.remove('is-on')});var c=map[e.target.id];if(c){c.classList.add('is-on');var p=c.parentElement,pr=p.getBoundingClientRect(),cr=c.getBoundingClientRect();p.scrollBy({left:(cr.left+cr.width/2)-(pr.left+pr.width/2),behavior:RM?'auto':'smooth'})}}})},{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('.grp[id]').forEach(function(g){cio.observe(g)});
  }
})();

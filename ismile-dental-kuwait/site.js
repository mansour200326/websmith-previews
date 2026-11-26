/* iSmile concept · kit 18 (reveals), 10 (before/after), 11 (accordion), 19 (magnetic + roll), plus header/menu/tabs/map */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* header shadow + mobile menu */
  var hdr=document.querySelector('.hdr');
  if(hdr){var f=function(){hdr.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',f,{passive:true});f();}
  var mb=document.querySelector('.hdr__menu'),nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('is-open')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false');mb.focus()}});}

  /* kit 18: stagger + line split + observer */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    el.innerHTML='<span class="sr">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
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

  /* kit 10: before/after */
  document.querySelectorAll('[data-k-ba]').forEach(function(el){
    var r=el.querySelector('.k-ba__range');
    function set(v){v=Math.max(0,Math.min(100,v));el.style.setProperty('--x',v+'%');r.value=v}
    r.addEventListener('input',function(){set(+r.value)});
    var on=false;
    function at(e){var b=el.getBoundingClientRect(),p=(e.clientX-b.left)/b.width*100;if(getComputedStyle(el).direction==='rtl')p=100-p;set(p)}
    el.addEventListener('pointerdown',function(e){on=true;at(e)});
    addEventListener('pointermove',function(e){if(on)at(e)});
    addEventListener('pointerup',function(){on=false});
    el.__sweep=function(){if(RM)return;var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/1800);set(50+Math.sin(k*Math.PI*2)*18*(1-k));if(k<1)requestAnimationFrame(f)})(t0)};
    if(RM||!('IntersectionObserver' in window))return;
    new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();el.__sweep()},{threshold:.6}).observe(el);
  });

  /* result tabs */
  document.querySelectorAll('[data-tabs]').forEach(function(t){
    var bs=[].slice.call(t.querySelectorAll('[role=tab]'));
    function sel(b,focus){bs.forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});
      if(focus)b.focus();var ba=document.getElementById(b.getAttribute('aria-controls')).querySelector('[data-k-ba]');if(ba&&ba.__sweep)ba.__sweep();}
    bs.forEach(function(b,i){b.addEventListener('click',function(){sel(b)});
      b.addEventListener('keydown',function(e){var d=getComputedStyle(t).direction==='rtl'?-1:1;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();var n=(i+(e.key==='ArrowRight'?d:-d)+bs.length)%bs.length;sel(bs[n],true)}})});
  });

  /* kit 11: accordion height animation */
  document.querySelectorAll('[data-k-acc] .k-acc__row').forEach(function(d){var s=d.querySelector('summary'),b=d.querySelector('.k-acc__body');
    s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
      if(d.open){var h=b.offsetHeight;b.animate({height:[h+'px','0px'],opacity:[1,0]},{duration:380,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){d.open=false};}
      else{d.open=true;var h2=b.offsetHeight;b.animate({height:['0px',h2+'px'],opacity:[0,1]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});}});});

  /* map: load on tap only */
  document.querySelectorAll('[data-map]').forEach(function(b){b.addEventListener('click',function(){var f=document.createElement('iframe');f.src=b.getAttribute('data-map');f.title=b.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';b.replaceWith(f)})});

  /* kit 19: magnetic */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();
document.querySelectorAll('[data-scroll]').forEach(function(b){b.addEventListener('click',function(){var t=b.closest('section').querySelector('.docs__track');var rtl=getComputedStyle(t).direction==='rtl';var d=+b.getAttribute('data-scroll')*(rtl?-1:1);t.scrollBy({left:d*t.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})});

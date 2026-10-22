/* FinZ Center concept: header state, mobile drawer, depth gauge, dive-flag reveal. Kit behaviours live in kit.js. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hd=document.querySelector('.hd'),solidAt=hd&&hd.hasAttribute('data-solid')?-1:40,lastY=0;
  function onScroll(){
    var y=scrollY;
    if(hd){hd.classList.toggle('is-solid',y>solidAt);hd.classList.toggle('is-hide',y>520&&y>lastY+4&&!document.body.classList.contains('drawer-open'));if(y<lastY-4)hd.classList.remove('is-hide')}
    lastY=y;gauge();
  }
  /* depth gauge: scroll position read as depth on a 0–30 m scale (decorative, desktop only) */
  var g=document.querySelector('.gauge'),pin,val;
  if(g){pin=g.querySelector('.gauge__pin');val=g.querySelector('.gauge__val')}
  function gauge(){
    if(!g||g.offsetParent===null)return;
    var max=document.documentElement.scrollHeight-innerHeight,f=max>0?Math.min(1,Math.max(0,scrollY/max)):0,h=g.clientHeight;
    g.style.setProperty('--gy',(f*h).toFixed(1)+'px');
    val.textContent=(f*30).toFixed(1)+' m';
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',gauge);onScroll();

  /* drawer */
  var btn=document.querySelector('.hd__menu'),dr=document.getElementById('drawer'),x=dr&&dr.querySelector('.drawer__x');
  function setDr(o){if(!dr)return;dr.classList.toggle('is-open',o);document.body.classList.toggle('drawer-open',o);btn.setAttribute('aria-expanded',o);dr.inert=!o;document.body.style.overflow=o?'hidden':'';if(o){x.focus()}else{btn.focus()}}
  if(btn&&dr){dr.inert=true;btn.addEventListener('click',function(){setDr(true)});x.addEventListener('click',function(){setDr(false)});
    dr.addEventListener('click',function(e){if(e.target.tagName==='A')setDr(false)});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('is-open'))setDr(false)})}

  /* dive flag stripe draws in */
  var fl=document.querySelectorAll('.flag');
  if('IntersectionObserver' in window&&!RM){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.25});fl.forEach(function(f){io.observe(f)})}
  else fl.forEach(function(f){f.classList.add('is-in')});
})();

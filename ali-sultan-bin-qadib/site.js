/* Site behaviour (kit.js carries reveals, marquee, accordion, counters, magnetic, hours). */
(function(){
  var hd=document.querySelector('.hd'),last=0;
  function onScroll(){
    var y=window.scrollY||0;
    if(hd){hd.classList.toggle('is-solid',y>40);hd.classList.toggle('is-hidden',y>400&&y>last&&!document.querySelector('.drawer.is-open'));}
    last=y;
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var btn=document.querySelector('.menu-btn'),dr=document.querySelector('.drawer');
  if(btn&&dr){
    var close=dr.querySelector('.drawer__close');
    function set(o){dr.classList.toggle('is-open',o);btn.setAttribute('aria-expanded',o);if(o){dr.removeAttribute('inert');close&&close.focus()}else{dr.setAttribute('inert','');btn.focus()}document.body.style.overflow=o?'hidden':''}
    dr.setAttribute('inert','');
    btn.addEventListener('click',function(){set(true)});
    close&&close.addEventListener('click',function(){set(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('is-open'))set(false)});
    dr.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){dr.classList.remove('is-open');document.body.style.overflow=''})});
  }

  /* services page: mark the TOC link of the section in view */
  var toc=document.querySelectorAll('.toc a[href^="#"]');
  if(toc.length&&'IntersectionObserver' in window){
    var map={};toc.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){toc.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];a&&a.classList.add('is-on')}})},{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){var el=document.getElementById(id);el&&io.observe(el)});
  }
})();

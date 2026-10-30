/* Site behaviour: header rule on scroll, career spine drawn by scroll, services index highlight. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hd=document.querySelector('.hd');
  function onScroll(){if(hd)hd.classList.toggle('is-scrolled',scrollY>8)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // career spine: the navy line grows with scroll; items reveal once (add-only) as they enter
  var tl=document.querySelector('.tl__list');
  if(tl&&!RM){
    var items=[].slice.call(tl.querySelectorAll('.tl__item'));var tk=false;
    function upd(){tk=false;var r=tl.getBoundingClientRect(),vh=innerHeight,mid=vh*.62;
      var p=Math.max(0,Math.min(1,(mid-r.top)/r.height));tl.style.setProperty('--p',p.toFixed(4));
      items.forEach(function(it){if(it.getBoundingClientRect().top<vh*.88)it.classList.add('is-in')})}
    tl.style.setProperty('--p',0);
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();
  }else if(tl){tl.querySelectorAll('.tl__item').forEach(function(i){i.classList.add('is-in')})}

  // services page: mark the treatment in view
  var links=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-30% 0px -60% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
  }
})();

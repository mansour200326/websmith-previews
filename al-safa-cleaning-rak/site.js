/* Al Safa concept: small extras on top of kit.js */
(function(){
  var hd=document.querySelector('.hd');
  function onS(){if(hd)hd.classList.toggle('is-scrolled',scrollY>8)}
  addEventListener('scroll',onS,{passive:true});onS();

  // The two halves of the logo slide together when they come into view
  var discs=[].slice.call(document.querySelectorAll('.disc--anim'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-set');io.unobserve(e.target)}})},{threshold:.35});
    discs.forEach(function(d){io.observe(d)});
  }else discs.forEach(function(d){d.classList.add('is-set')});

  // Services page: highlight the current service in the index strip
  var links=[].slice.call(document.querySelectorAll('.idx a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a){a.classList.add('is-on');var s=a.parentNode;s.scrollTo({left:a.offsetLeft-s.offsetWidth/2+a.offsetWidth/2,behavior:'smooth'})}}})},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)so.observe(el)});
  }
})();

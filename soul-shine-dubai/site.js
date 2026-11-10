/* Soul Shine concept: small page helpers on top of kit.js */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',f,{passive:true});f()}
  // services index: mark the category in view
  var links=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id;links.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+id)})}})},{rootMargin:'-30% 0px -60% 0px'});
    links.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  }
})();

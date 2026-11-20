/* Legal Circle concept: header state + services index highlight. Kit motion lives in kit.js. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};f();addEventListener('scroll',f,{passive:true})}
  var links=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on');a.removeAttribute('aria-current')});var a=map[e.target.id];if(a){a.classList.add('is-on');a.setAttribute('aria-current','true')}}})},{rootMargin:'-35% 0px -55% 0px'});
    document.querySelectorAll('.area[id]').forEach(function(s){io.observe(s)});
  }
})();

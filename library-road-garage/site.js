/* Library Road Garage concept: header state, one-shot reveals (odometer, stamp, checklist ticks), services scrollspy */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',f,{passive:true});f();}

  // close the mobile menu after picking an in-page link
  document.querySelectorAll('.menu__list a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.removeAttribute('open')})});

  // one-shot "is-in" for odometers, the guarantee stamp and the checklist ticks
  var els=document.querySelectorAll('.odo,.stamp,.step');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -18% 0px'});
    els.forEach(function(e){io.observe(e)});
  }

  // services page: highlight the service in view in the side index
  var idx=document.querySelectorAll('.svc-index a');
  if(idx.length&&'IntersectionObserver' in window){
    var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.svc[id]').forEach(function(s){so.observe(s)});
  }
})();

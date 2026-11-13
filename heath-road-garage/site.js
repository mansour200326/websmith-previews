/* Heath Road Garage concept: services index highlight (services.html). Kit motion lives in kit.js. */
(function(){
  var idx=document.querySelectorAll('.sp__idx a');
  if(!idx.length||!('IntersectionObserver' in window))return;
  var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){idx.forEach(function(a){a.classList.remove('is-on');a.removeAttribute('aria-current')});
        var a=map[e.target.id];if(a){a.classList.add('is-on');a.setAttribute('aria-current','true')}}
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('.s[id]').forEach(function(s){io.observe(s)});
})();

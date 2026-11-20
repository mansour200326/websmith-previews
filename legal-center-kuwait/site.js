/* The Legal Center concept: header shadow, phone menu, services index highlight. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>10)};on();addEventListener('scroll',on,{passive:true})}
  var btn=document.querySelector('.hd__menu'),nav=document.getElementById('mnav');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('is-open');btn.setAttribute('aria-expanded',o)})}
  var links=[].slice.call(document.querySelectorAll('.svc__nav a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-30% 0px -60% 0px'});
    document.querySelectorAll('.svc__item[id]').forEach(function(s){io.observe(s)});
  }
})();

/* Al Reyadah Nursery concept - small extras on top of kit.js */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};on();addEventListener('scroll',on,{passive:true})}
  var btn=document.querySelector('.menu-btn'),mn=document.getElementById('mnav');
  if(btn&&mn){btn.addEventListener('click',function(){var o=mn.classList.toggle('is-open');btn.setAttribute('aria-expanded',o)})}
  // growth chart + EYFS marker bands: play once in view
  var els=document.querySelectorAll('[data-grow]');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.35});
  els.forEach(function(e){io.observe(e)});
})();

/* Star Private School concept: header + menu. Motion lives in kit.js. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};on();addEventListener('scroll',on,{passive:true})}
  var b=document.querySelector('.menu-btn'),d=document.getElementById('drawer');
  if(b&&d){
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));d.classList.toggle('is-open',!o);if(o){d.setAttribute('inert','')}else{d.removeAttribute('inert')}});
    d.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(){b.click()})});
  }
})();

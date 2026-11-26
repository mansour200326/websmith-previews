/* Little Wonders concept: small page behaviours on top of the Websmith kit (kit.js). */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};on();addEventListener('scroll',on,{passive:true});}
  // close the mobile menu after choosing a link, or on Escape / outside tap
  var menu=document.querySelector('.hd__menu');
  if(menu){
    menu.addEventListener('click',function(e){if(e.target.closest('a'))menu.open=false;});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
    document.addEventListener('click',function(e){if(menu.open&&!menu.contains(e.target))menu.open=false;});
  }
  // the session bars grow when the ruler scrolls into view
  var rulers=document.querySelectorAll('.day__ruler');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}})},{threshold:.25});
    rulers.forEach(function(r){io.observe(r)});
  }else rulers.forEach(function(r){r.classList.add('is-in')});
  // very tall viewports (full-page captures): show everything at once
  if(innerHeight>1800){document.querySelectorAll('[data-reveal],.day__ruler,.k-drag').forEach(function(el){el.classList.add('is-in')});}
})();

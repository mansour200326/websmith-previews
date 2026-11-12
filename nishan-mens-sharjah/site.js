/* Nishan concept: small extras on top of kit.js */
(function(){
  // header gets a hairline once the page moves
  var top=document.querySelector('.top');
  if(top){var f=function(){top.classList.toggle('is-stuck',scrollY>8)};addEventListener('scroll',f,{passive:true});f()}

  // the name fills the width like the shop sign (CSS clamp is the no-JS fallback)
  var name=document.querySelector('.hero__name');
  if(name){
    var inner=name.firstElementChild;
    var fit=function(){
      name.style.fontSize='';
      inner.style.display='inline-block';
      var w=name.clientWidth,tw=inner.scrollWidth,cur=parseFloat(getComputedStyle(name).fontSize);
      if(tw>0&&w>0){var desk=innerWidth>=960,avail=desk?document.querySelector('.hero__head').clientWidth*.66:w;name.style.fontSize=Math.min(cur*avail/tw*.995,desk?innerHeight*.4:w*.62)+'px'}
      inner.style.display='';
    };
    (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(fit);
    var t;addEventListener('resize',function(){clearTimeout(t);t=setTimeout(fit,120)});
  }

  // services page: mark the category you are reading in the side index
  var links=[].slice.call(document.querySelectorAll('.svc__index a'));
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
  }
})();

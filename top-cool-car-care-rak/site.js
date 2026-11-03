// Top Cool concept: header border on scroll. Everything else (reveals, marquee, gallery, magnetic) is kit.js.
(function(){
  var hd=document.querySelector('.hd');
  if(!hd) return;
  var on=function(){hd.classList.toggle('is-scrolled',window.scrollY>8)};
  on(); window.addEventListener('scroll',on,{passive:true});
})();
// Services index: the sticky photo follows the row in the middle of the screen (rows without a photo keep the last one).
(function(){
  var stick=document.querySelector('.sx__stick'); if(!stick||!('IntersectionObserver' in window)) return;
  var imgs=stick.querySelectorAll('img');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting) return; var k=e.target.getAttribute('data-sx-img');
    imgs.forEach(function(i){i.classList.toggle('is-on',i.getAttribute('data-sx-key')===k)});
  })},{rootMargin:'-45% 0px -45% 0px'});
  document.querySelectorAll('.sx__row').forEach(function(r){io.observe(r)});
})();
// Hero: the white copy of the name starts exactly at the photo's left edge (--cut), on load, resize and font load.
(function(){
  var n=document.querySelector('.hero__name'), p=document.querySelector('.k-split__photo');
  if(!n||!p||!n.querySelector('.hero__ghost')) return;
  var set=function(){n.style.setProperty('--cut',Math.max(0,p.getBoundingClientRect().left-n.getBoundingClientRect().left)+'px')};
  set(); window.addEventListener('resize',set,{passive:true}); window.addEventListener('load',set);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(set);
  var g=n.querySelector('.hero__ghost'), rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(function(){g.classList.add('is-on')}, rm?0:1250);
})();

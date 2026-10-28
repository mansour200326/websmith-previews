/* Salmiya Clinic concept: small page behaviours (kit.js holds the kit motion) */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){
    var onS=function(){hd.classList.toggle('is-scrolled',scrollY>8)};onS();addEventListener('scroll',onS,{passive:true});
    var mb=hd.querySelector('.hd__menu');
    if(mb)mb.addEventListener('click',function(){var o=hd.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
  }
  // ECG lines (outside the hero) draw when they scroll in
  var lines=document.querySelectorAll('.ecg:not(.hero .ecg)');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.4});
    lines.forEach(function(l){io.observe(l)});
  }else lines.forEach(function(l){l.classList.add('is-in')});
  // services index: mark the department in view
  var idx=document.querySelectorAll('.svc__idx a');
  if(idx.length&&'IntersectionObserver' in window){
    var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.dep[id]').forEach(function(d){so.observe(d)});
  }
})();

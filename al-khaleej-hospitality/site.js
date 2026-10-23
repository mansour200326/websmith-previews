/* Al Khaleej Hospitality concept: page glue (kit.js loads first) */
(function(){
  var hd=document.querySelector('.hd'),btn=document.querySelector('.hd__menu');
  function solid(){if(hd)hd.classList.toggle('is-solid',scrollY>40)}
  addEventListener('scroll',solid,{passive:true});solid();
  if(btn&&hd){
    var nav=document.getElementById('nav');
    btn.addEventListener('click',function(){var o=hd.classList.toggle('is-open');btn.setAttribute('aria-expanded',o);});
    if(nav)nav.addEventListener('click',function(e){if(e.target.closest('a')){hd.classList.remove('is-open');btn.setAttribute('aria-expanded','false')}});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&hd.classList.contains('is-open')){hd.classList.remove('is-open');btn.setAttribute('aria-expanded','false');btn.focus()}});
  }
  // drawn ellipse around the main call links + arch photo opening
  var els=document.querySelectorAll('.ring,[data-arch]');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-drawn','is-in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
    var t=e.target;setTimeout(function(){t.classList.add(t.classList.contains('ring')?'is-drawn':'is-in')},t.classList.contains('ring')?900:0);io.unobserve(t)})},{threshold:.25});
  els.forEach(function(e){io.observe(e)});
})();

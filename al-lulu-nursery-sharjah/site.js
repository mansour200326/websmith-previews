/* Al Lulu Nursery concept: page-level motion on top of kit.js */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.add('is-loaded')})});
  var hd=document.querySelector('.hd');
  var st=document.querySelector('.sticker svg');
  var tick=false;
  function onScroll(){
    if(tick)return;tick=true;
    requestAnimationFrame(function(){
      var y=window.scrollY||0;
      if(hd)hd.classList.toggle('is-scrolled',y>8);
      if(st&&!reduce)st.style.setProperty('--rot',(y*0.18)+'deg');
      tick=false;
    });
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  /* rooms: one colour column open at a time (desktop) */
  var rooms=[].slice.call(document.querySelectorAll('.room'));
  function open(r){rooms.forEach(function(x){x.classList.toggle('is-open',x===r)})}
  rooms.forEach(function(r){
    r.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover) and (min-width:900px)').matches)open(r)});
    r.addEventListener('focus',function(){open(r)});
    r.addEventListener('click',function(){open(r)});
  });
  /* Arabic labels for the hero sequence buttons */
  if(document.documentElement.lang==='ar'){
    setTimeout(function(){[].forEach.call(document.querySelectorAll('.k-seq__bar'),function(b,i){b.setAttribute('aria-label','الصورة '+(i+1))})},50);
  }
})();

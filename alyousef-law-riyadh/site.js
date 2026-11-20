/* Yasir S. Alyousef concept: header state + the case line (gold column fills as the stages scroll past) */
(function(){
  var hd=document.querySelector('.hd');
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var lines=[].slice.call(document.querySelectorAll('[data-line]'));
  var tick=0;
  function frame(){
    tick=0;
    if(hd)hd.classList.toggle('is-scrolled',scrollY>8);
    var mid=innerHeight*.6;
    lines.forEach(function(l){
      var r=l.getBoundingClientRect(),p=(mid-r.top)/Math.max(1,r.height);
      p=Math.max(0,Math.min(1,p));
      l.style.setProperty('--p',RM?1:p.toFixed(4));
      [].forEach.call(l.querySelectorAll('.stage'),function(s){
        s.classList.toggle('is-on',RM||s.getBoundingClientRect().top<mid);
      });
    });
  }
  function onS(){if(!tick){tick=1;requestAnimationFrame(frame)}}
  addEventListener('scroll',onS,{passive:true});addEventListener('resize',onS);frame();
})();

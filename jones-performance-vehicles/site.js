/* Jones concept: header, mobile menu, Evo rail */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on();}
  var b=document.querySelector('.hd__menu'),m=document.getElementById('mnav');
  if(b&&m){m.hidden=true;b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));m.hidden=o;});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden){m.hidden=true;b.setAttribute('aria-expanded','false');b.focus()}});}
  // Evo rail: the model numbers slide sideways as the section crosses the screen
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rail=document.querySelector('.evo__rail'),row=rail&&rail.querySelector('.evo__row');
  if(rail&&row&&!RM){var tk=false;
    function upd(){tk=false;var r=rail.getBoundingClientRect(),vh=innerHeight;if(r.bottom<0||r.top>vh)return;
      var p=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));var max=Math.max(0,row.scrollWidth-rail.clientWidth);
      row.style.transform='translate3d('+(-p*max).toFixed(1)+'px,0,0)';}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd();}
})();

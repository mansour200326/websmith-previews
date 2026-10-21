/* Beauty Look concept: header state on scroll. Everything else is kit.js. */
(function(){
  var hd=document.querySelector('.hd:not(.hd--page)');if(!hd)return;
  var on=false;
  function f(){var s=window.scrollY>60;if(s!==on){on=s;hd.classList.toggle('is-solid',s)}}
  f();window.addEventListener('scroll',f,{passive:true});
})();

/* Dental Health Clinic concept: header state. Kit motion lives in kit.js. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};f();addEventListener('scroll',f,{passive:true})}
})();

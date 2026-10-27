/* Pitstop Barbers concept: header turns solid once you leave the hero. Everything else is kit.js. */
(function(){
  var hd=document.querySelector('.hd');if(!hd)return;
  var solid=hd.hasAttribute('data-solid');
  function on(){hd.classList.toggle('is-solid',solid||scrollY>40)}
  on();addEventListener('scroll',on,{passive:true});
})();

/* NAP Foot Spa concept: header state + phone dock. Kit motion lives in kit.js. */
(function(){
  var hd=document.querySelector('.hd');
  var tk=false;
  function upd(){tk=false;var y=scrollY;
    if(hd)hd.classList.toggle('is-solid',y>40);
  }
  addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});
  upd();
})();

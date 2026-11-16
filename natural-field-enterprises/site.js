/* Natural Field concept: small extras on top of kit.js */
(function(){
  var hd=document.querySelector('.hd');if(!hd)return;
  var on=false;addEventListener('scroll',function(){var s=scrollY>8;if(s!==on){on=s;hd.style.boxShadow=s?'0 6px 24px -18px rgba(0,0,0,.5)':''}},{passive:true});
})();

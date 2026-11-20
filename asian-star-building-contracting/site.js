/* Asian Star concept: small site helpers (kit.js does the motion). */
(function(){
  // year in footer
  var y=document.querySelectorAll('[data-year]');for(var i=0;i<y.length;i++)y[i].textContent=new Date().getFullYear();
  // header gets a hairline shadow once the page scrolls
  var hd=document.querySelector('.hd');if(!hd)return;
  var on=false;function f(){var s=window.scrollY>8;if(s!==on){on=s;hd.style.boxShadow=s?'0 8px 24px -18px rgba(15,29,43,.55)':'none'}}
  window.addEventListener('scroll',f,{passive:true});f();
})();

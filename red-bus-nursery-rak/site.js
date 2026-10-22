/* Red Bus Nursery concept: small page helpers (kit.js does the motion). */
(function(){
  // Their own YouTube film, loaded only when tapped (no YouTube weight on page load).
  document.querySelectorAll('[data-yt]').forEach(function(box){
    var b=box.querySelector('button');if(!b)return;
    b.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+box.getAttribute('data-yt')+'?autoplay=1&rel=0';
      f.title=box.getAttribute('data-title')||'Video';
      f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;
      box.innerHTML='';box.appendChild(f);f.focus();
    });
  });
  // Close the phone menu after choosing a link.
  document.querySelectorAll('.nav-m a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.open=false})});
})();

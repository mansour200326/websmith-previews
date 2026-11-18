/* Southbourne Park Garage concept: small extras on top of kit.js */
(function(){
  // close the phone menu after choosing a link (same-page anchors)
  document.querySelectorAll('.menu__list a').forEach(function(a){
    a.addEventListener('click',function(){var d=a.closest('details');if(d)d.removeAttribute('open')});
  });
})();

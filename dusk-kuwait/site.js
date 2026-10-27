/* Danah concept: small extras on top of kit.js (menu toggle, current year) */
(function(){
  var b=document.querySelector('.menu-btn'),n=document.getElementById('nav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('is-open');b.setAttribute('aria-expanded',o)});}
})();

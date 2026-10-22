/* New U concept: mobile menu */
(function(){
  var b=document.querySelector('.hd__menu'),n=document.getElementById('nav');
  if(!b||!n)return;
  b.addEventListener('click',function(){
    var o=n.classList.toggle('is-open');
    b.setAttribute('aria-expanded',o?'true':'false');
    b.textContent=o?'Close':'Menu';
  });
})();

/* Open Spaces concept: header state + mobile menu */
(function(){
  var h=document.querySelector('.head');if(!h)return;
  var solidAlways=document.body.hasAttribute('data-solid'),last=scrollY,tk=false;
  function upd(){tk=false;var y=scrollY;
    h.classList.toggle('is-solid',solidAlways||y>40);
    var menuOpen=nav&&nav.classList.contains('is-open');
    h.classList.toggle('is-hidden',!menuOpen&&y>700&&y>last+4);
    if(y<last-4||y<700)h.classList.remove('is-hidden');
    last=y}
  var nav=document.getElementById('nav'),btn=document.querySelector('.menu-btn');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('is-open');btn.setAttribute('aria-expanded',o);btn.textContent=o?'Close':'Menu';if(o)h.classList.add('is-solid');else upd()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('is-open')){btn.click();btn.focus()}})}
  addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();
})();

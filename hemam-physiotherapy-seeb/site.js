/* Hemam concept: header state + mobile menu close. Motion lives in kit.js (reveals, magnetic, accordion, map). */
(function(){
  var h=document.querySelector('.hdr');
  if(h){var f=function(){h.classList.toggle('is-scrolled',scrollY>8)};f();addEventListener('scroll',f,{passive:true})}
  var m=document.querySelector('.menu');
  if(m){m.addEventListener('click',function(e){if(e.target.closest('.menu__panel a'))m.removeAttribute('open')});
    document.addEventListener('click',function(e){if(m.open&&!m.contains(e.target))m.removeAttribute('open')});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.open){m.removeAttribute('open');m.querySelector('summary').focus()}})}
  // open the accordion row named in the URL hash (services.html#speech etc.)
  var openHash=function(){var id=location.hash.slice(1);if(!id)return;var d=document.getElementById(id);
    if(d&&d.tagName==='DETAILS'){d.open=true;setTimeout(function(){d.scrollIntoView({block:'start'})},60)}};
  openHash();addEventListener('hashchange',openHash);
})();

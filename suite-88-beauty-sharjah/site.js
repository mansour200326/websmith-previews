/* Suite 88 concept: small extras on top of kit.js */
(function(){
  var h=document.querySelector('.hdr');
  if(h){var f=function(){h.classList.toggle('is-stuck',window.scrollY>8)};f();window.addEventListener('scroll',f,{passive:true});}
})();

/* open the right menu tab from a link like services.html#hair */
(function(){
  function go(){var k=location.hash.slice(1);if(!k)return;var b=document.querySelector('[data-k-menu-tabs] [data-tab="'+k+'"]');if(b){b.click();var m=document.querySelector('[data-k-menu]');if(m)m.scrollIntoView();}}
  window.addEventListener('load',function(){setTimeout(go,60)});window.addEventListener('hashchange',go);
})();

/* kit 14 flattens quotes into words: set emoji back to body size */
(function(){
  function fix(){document.querySelectorAll('.k-quotes__slide .k-w').forEach(function(w){if(/^\p{Extended_Pictographic}/u.test(w.textContent))w.classList.add('emo')})}
  if(document.readyState==='complete')fix();else window.addEventListener('load',fix);
  document.addEventListener('DOMContentLoaded',function(){setTimeout(fix,0)});
  document.querySelectorAll('.k-quotes__track').forEach(function(t){new MutationObserver(fix).observe(t,{childList:true,subtree:true})});
})();

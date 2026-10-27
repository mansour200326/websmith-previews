/* Tajriba Mithaliya concept: page-load motion trigger (hero lines, mirror wipe, light line). Kit handles the rest. */
(function(){
  var go=function(){requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.add('is-loaded')})})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

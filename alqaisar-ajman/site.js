/* AlQaisar concept: sector columns (widen on hover/focus, desktop), show-more on phones, open equipment row from hash. */
(function(){
  var wrap=document.querySelector('.cols');
  var cols=[].slice.call(document.querySelectorAll('.col'));
  if(wrap&&cols.length){
    var open=function(c){wrap.classList.add('is-live');cols.forEach(function(x,i){var on=x===c;x.classList.toggle('is-open',on);if(on)wrap.setAttribute('data-open',i)})};
    cols.forEach(function(c){
      c.addEventListener('mouseenter',function(){open(c)});
      c.addEventListener('focusin',function(){open(c)});
      c.addEventListener('click',function(){open(c)});
    });
  }
  [].slice.call(document.querySelectorAll('[data-more-btn]')).forEach(function(b){
    var sel=b.getAttribute('data-more-target');
    var t=sel?b.parentNode.querySelector(sel):b.parentNode.querySelector('[data-more]');
    if(!t){b.remove();return}
    var n=t.children.length,lim=t.classList.contains('k-gal__grid')?8:5;
    if(n<=lim){b.remove();return}
    b.textContent+=' ('+n+')';
    b.addEventListener('click',function(){t.classList.add('is-all');b.remove()});
  });
  /* gallery filters: show every match (the phone 8-photo limit would hide some) */
  [].slice.call(document.querySelectorAll('[data-k-gal-filter] button')).forEach(function(b){b.addEventListener('click',function(){var g=document.querySelector('.k-gal__grid');if(!g)return;g.classList.add('is-all');var mb=document.querySelector('[data-more-target]');if(mb)mb.remove()})});
  function go(){var h=location.hash.slice(1);if(!h)return;var d=document.getElementById(h);if(d&&d.tagName==='DETAILS')d.open=true}
  go();addEventListener('hashchange',go);
})();
setTimeout(function(){document.documentElement.classList.add('aq-done')},2600);

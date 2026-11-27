/* Al Ameer concept: header, drawer, ledger bars */
(function(){
  var h=document.querySelector('[data-hdr]');
  if(h&&!h.classList.contains('hdr--plain')){var f=function(){h.classList.toggle('is-solid',scrollY>40)};f();addEventListener('scroll',f,{passive:true})}
  var d=document.getElementById('drawer'),b=document.querySelector('[data-menu]'),c=document.querySelector('[data-menu-close]');
  function set(o){if(!d)return;d.classList.toggle('is-open',o);if(o)d.removeAttribute('inert');else d.setAttribute('inert','');if(b)b.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';if(o&&c)c.focus();else if(b)b.focus()}
  if(b)b.addEventListener('click',function(){set(true)});
  if(c)c.addEventListener('click',function(){set(false)});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&d&&d.classList.contains('is-open'))set(false)});
  document.querySelectorAll('[data-ledger]').forEach(function(t){
    if(!('IntersectionObserver' in window)){t.classList.add('is-in');return}
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){t.classList.add('is-in');o.disconnect()}},{threshold:.25}).observe(t)});
})();

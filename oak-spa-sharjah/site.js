/* Oak Spa concept: small page glue on top of kit.js */
(function(){
  // services.html#nails opens the matching price tab
  function openHash(){
    var k=(location.hash||'').slice(1);if(!k)return;
    var b=document.querySelector('[data-k-menu-tabs] [data-tab="'+k+'"]');
    if(b){b.click();var m=document.querySelector('[data-k-menu]');if(m)m.scrollIntoView({block:'start'})}
  }
  window.addEventListener('load',openHash);window.addEventListener('hashchange',openHash);
  // name the map iframe once it loads
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    new MutationObserver(function(){var f=m.querySelector('iframe');if(f)f.title=m.getAttribute('data-title')||'Map'}).observe(m,{childList:true});
  });
})();
/* services: crossfade the sticky photo to the open tab */
(function(){
  var feat=document.querySelector('.menu__feat');if(!feat)return;
  var tabs=[].slice.call(document.querySelectorAll('[data-k-menu-tabs] [data-tab]'));
  function sync(){var on=tabs.filter(function(b){return b.getAttribute('aria-selected')==='true'})[0];if(!on)return;
    [].forEach.call(feat.querySelectorAll('[data-feat]'),function(p){p.classList.toggle('is-on',p.getAttribute('data-feat')===on.getAttribute('data-tab'))})}
  var mo=new MutationObserver(sync);tabs.forEach(function(b){mo.observe(b,{attributes:true,attributeFilter:['aria-selected']})});sync();
})();

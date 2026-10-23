/* Mehdi Abdul Ghaffar Bakery concept: small page-specific behaviour (the kit handles the rest). */
(function(){
  // "What we make" index: hovering or focusing a row swaps the sticky photo and its caption.
  document.querySelectorAll('[data-make]').forEach(function(root){
    var imgs=[].slice.call(root.querySelectorAll('.make__photo img')),cap=root.querySelector('.make__photo figcaption');
    var rows=[].slice.call(root.querySelectorAll('.idx__row'));
    function show(row){
      var k=row.getAttribute('data-img');if(k===null)return;
      rows.forEach(function(r){r.classList.toggle('is-on',r===row)});
      imgs.forEach(function(im){im.classList.toggle('is-on',im.getAttribute('data-k')===k)});
      var on=root.querySelector('.make__photo img[data-k="'+k+'"]');if(on&&cap)cap.textContent=on.getAttribute('data-cap')||'';
    }
    rows.forEach(function(r){r.addEventListener('mouseenter',function(){show(r)});r.addEventListener('focus',function(){show(r)});r.addEventListener('click',function(){show(r)})});
  });
})();
// Menu page: every panel is in the HTML (no-JS visitors see the whole menu). With JS, hide the inactive ones on init;
// kit.js then switches them with the hidden attribute.
(function(){
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var on=root.querySelector('[role=tab][aria-selected=true]'),k=on?on.getAttribute('data-tab'):null;
    root.querySelectorAll('[data-panel]').forEach(function(p){p.hidden=k!==null&&p.getAttribute('data-panel')!==k});
    root.classList.add('is-ready');
  });
})();

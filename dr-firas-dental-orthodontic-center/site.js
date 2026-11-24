/* Dr Firas concept: clinic switcher, mobile menu, today's hours, services index */
(function(){
  /* clinics: tabs (no JS = all three panels stacked, tabs are plain anchors) */
  document.querySelectorAll('[data-clinics]').forEach(function(root){
    var tabs=[].slice.call(root.querySelectorAll('[role=tab]')),panels=tabs.map(function(t){return document.getElementById(t.getAttribute('aria-controls'))});
    root.classList.add('is-tabs');
    function sel(i,focus){tabs.forEach(function(t,k){var on=k===i;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;panels[k].hidden=!on});if(focus)tabs[i].focus()}
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(e){e.preventDefault();sel(i)});
      t.addEventListener('keydown',function(e){var d=e.key==='ArrowDown'||e.key==='ArrowRight'?1:e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:0;if(document.dir==='rtl'&&(e.key==='ArrowLeft'||e.key==='ArrowRight'))d=-d;if(!d)return;e.preventDefault();sel((i+d+tabs.length)%tabs.length,true)});
    });
    sel(0);
  });
  /* mobile menu */
  var hdr=document.querySelector('.hdr'),mb=document.querySelector('.hdr__menu');
  if(hdr&&mb){mb.hidden=false;mb.addEventListener('click',function(){var o=hdr.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
    hdr.querySelectorAll('.hdr__nav a').forEach(function(a){a.addEventListener('click',function(){hdr.classList.remove('is-open');mb.setAttribute('aria-expanded','false')})});}
  /* today's hours line (Abu Dhabi time) */
  document.querySelectorAll('[data-today]').forEach(function(el){
    var h={};try{h=JSON.parse(el.getAttribute('data-today'))}catch(e){}
    var wd=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short'}).format(new Date());
    var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(wd);
    if(h[d])el.textContent=h[d];
  });
  /* services index: mark the section in view */
  var idx=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(idx.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;idx.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});
    idx.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  }
})();

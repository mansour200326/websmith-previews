/* Gulf Clinic concept: phone menu, doctor filter, lab stamp turn, services index. Websmith. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR=document.documentElement.lang==='ar';

  /* phone menu */
  var mb=document.querySelector('.bar__menu'),dr=document.getElementById('drawer');
  if(mb&&dr){
    mb.addEventListener('click',function(){var open=mb.getAttribute('aria-expanded')==='true';mb.setAttribute('aria-expanded',!open);dr.hidden=open;document.body.style.overflow=open?'':'hidden'});
    dr.addEventListener('click',function(e){if(e.target.closest('a')){mb.setAttribute('aria-expanded','false');dr.hidden=true;document.body.style.overflow=''}});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&!dr.hidden){mb.click();mb.focus()}});
  }

  /* doctors: filter by what you need */
  var chips=[].slice.call(document.querySelectorAll('[data-doc-filter]'));
  var docs=[].slice.call(document.querySelectorAll('.doc'));
  var out=document.querySelector('[data-doc-count]');
  chips.forEach(function(c){c.addEventListener('click',function(){
    var f=c.getAttribute('data-doc-filter'),n=0;
    chips.forEach(function(x){x.setAttribute('aria-pressed',x===c)});
    var g=document.querySelector('.docs__grid');if(g)g.classList.toggle('is-filtered',f!=='all');
    docs.forEach(function(d,i){
      var on=f==='all'||(' '+d.getAttribute('data-tags')+' ').indexOf(' '+f+' ')>-1;
      if(on){n++;if(d.hidden){d.hidden=false;if(!RM){d.style.opacity=0;d.style.transform='translateY(16px)';requestAnimationFrame(function(){requestAnimationFrame(function(){d.style.opacity='';d.style.transform=''})})}}}
      else d.hidden=true;
    });
    if(out)out.textContent=AR?(n===14?'الأطباء الـ14 جميعاً':n+' من 14 طبيباً'):(n===14?'All 14 dentists':n+' of 14 dentists');
  })});

  /* lab stamp turns a little as the band scrolls past (no loop) */
  var st=document.querySelector('.lab__stamp');
  if(st&&!RM){
    var tick=false;
    function turn(){tick=false;var r=st.getBoundingClientRect(),p=(r.top+r.height/2)/innerHeight-.5;st.style.transform='rotate('+Math.max(-10,Math.min(10,p*-20)).toFixed(2)+'deg)'}
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(turn)}},{passive:true});turn();
  }

  /* services index: mark the section in view */
  var toc=[].slice.call(document.querySelectorAll('.toc a'));
  if(toc.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){toc.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    toc.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  }
})();

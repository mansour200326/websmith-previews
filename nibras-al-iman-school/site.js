/* Nibras Al Iman concept: header state, mobile menu, vision/mission/values switcher */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){
    var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};on();addEventListener('scroll',on,{passive:true});
    var mb=hd.querySelector('.hd__menu');
    if(mb)mb.addEventListener('click',function(){var o=hd.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
  }
  document.querySelectorAll('[data-vmv]').forEach(function(root){
    var tabs=[].slice.call(root.querySelectorAll('[role=tab]'));
    function pick(t,focus){
      tabs.forEach(function(x){var s=x===t;x.setAttribute('aria-selected',s);x.tabIndex=s?0:-1;
        var p=document.getElementById(x.getAttribute('aria-controls'));p.hidden=!s;if(s){p.classList.remove('is-anim');void p.offsetWidth;p.classList.add('is-anim')}});
      if(focus)t.focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){pick(t)});
      t.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches)pick(t)});
      t.addEventListener('keydown',function(e){var k=e.key,n=null;
        if(k==='ArrowDown'||k==='ArrowRight')n=tabs[(i+1)%tabs.length];
        if(k==='ArrowUp'||k==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];
        if(n){e.preventDefault();pick(n,true)}});
    });
  });
})();

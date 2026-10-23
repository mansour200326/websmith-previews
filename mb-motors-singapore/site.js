/* MB Motors concept — page behaviour (kit.js holds marquee/accordion/map/reveal/magnetic) */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // header: solid after scroll, mobile menu
  var hd=document.querySelector('.hd');
  if(hd){
    var solid=function(){hd.classList.toggle('is-solid',scrollY>30)};solid();addEventListener('scroll',solid,{passive:true});
    var mb=hd.querySelector('.menu-btn');
    if(mb)mb.addEventListener('click',function(){var o=hd.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
  }
  // hero entrance
  var hero=document.querySelector('.hero');
  if(hero){requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add('is-in')})})}
  // live Singapore time (no opening hours are published, so no open/closed claim)
  var clk=document.querySelectorAll('[data-sgt]');
  if(clk.length){
    var f=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Singapore',hour:'2-digit',minute:'2-digit',hour12:false});
    var tick=function(){var p=f.format(new Date()).split(':');clk.forEach(function(c){c.innerHTML=p[0]+'<span>:</span>'+p[1]})};
    tick();setInterval(tick,15000);
  }
  // brand index: hover/focus a row, the stage shows that brand's logo (from their own site)
  document.querySelectorAll('[data-brands]').forEach(function(root){
    var rows=[].slice.call(root.querySelectorAll('.brands__list li')),figs=[].slice.call(root.querySelectorAll('.brands__stage figure'));
    function on(i){rows.forEach(function(r,j){r.classList.toggle('is-on',j===i)});figs.forEach(function(g,j){g.classList.toggle('is-on',j===i)})}
    rows.forEach(function(r,i){var b=r.querySelector('button');
      b.addEventListener('pointerenter',function(){on(i)});b.addEventListener('focus',function(){on(i)});b.addEventListener('click',function(){on(i)});});
    on(0);
    // slow auto-advance only while the stage is in view and the user hasn't interacted
    if(!RM&&figs.length){var idx=0,touched=false,vis=false,t;
      root.addEventListener('pointerenter',function(){touched=true});root.addEventListener('focusin',function(){touched=true});
      new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(root);
      t=setInterval(function(){if(touched){clearInterval(t);return}if(!vis)return;idx=(idx+1)%rows.length;on(idx);if(idx===0)clearInterval(t)},1600); /* one pass, then it stops */
    }
  });
})();

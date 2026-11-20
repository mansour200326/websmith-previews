/* Al Habbai concept: menu, project-register peek, project filter */
(function(){
  var hd=document.querySelector('.hd'),mb=document.querySelector('.hd__menu');
  if(hd&&mb)mb.addEventListener('click',function(){var o=hd.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});

  // Register: photo follows the pointer on desktop
  var peek=document.querySelector('.reg__peek');
  if(peek&&matchMedia('(hover:hover) and (pointer:fine) and (min-width:861px)').matches){
    var img=peek.querySelector('img'),cap=peek.querySelector('span'),x=0,y=0,tx=0,ty=0,raf=0;
    var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function loop(){x+=(tx-x)*(RM?1:.18);y+=(ty-y)*(RM?1:.18);peek.style.transform='translate3d('+x+'px,'+y+'px,0)'+(peek.classList.contains('is-on')?'':' scale(.92)');raf=Math.abs(tx-x)+Math.abs(ty-y)>.5?requestAnimationFrame(loop):0}
    document.querySelectorAll('.reg__row[data-img]').forEach(function(r){
      r.addEventListener('mouseenter',function(){img.src=r.getAttribute('data-img');img.alt='';cap.textContent=r.getAttribute('data-cap')||'';cap.hidden=!cap.textContent;peek.classList.add('is-on')});
      r.addEventListener('mouseleave',function(){peek.classList.remove('is-on')});
      r.addEventListener('mousemove',function(e){var rtl=document.documentElement.dir==='rtl';tx=e.clientX+(rtl?-330:30);ty=e.clientY-120;if(!raf)raf=requestAnimationFrame(loop)});
    });
  }

  // Projects page filter
  var f=document.querySelector('[data-filter]');
  if(f){var bs=f.querySelectorAll('button'),cs=document.querySelectorAll('.pc[data-st]'),out=document.querySelector('[data-count]');
    bs.forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-v'),n=0;
      bs.forEach(function(o){o.setAttribute('aria-pressed',o===b)});
      cs.forEach(function(c){var on=v==='all'||c.getAttribute('data-st')===v;c.hidden=!on;if(on)n++});
      if(out)out.textContent=n;
    })});
  }
})();

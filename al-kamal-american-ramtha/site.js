/* Al Kamal Al Ramtha concept: small extras on top of kit.js */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  /* grade index: a photo follows the pointer over each row (desktop only) */
  var list=document.querySelector('[data-peek-list]');
  if(list&&fine&&!RM){
    var box=document.createElement('div');box.className='gpeek';box.setAttribute('aria-hidden','true');
    var img=document.createElement('img');img.alt='';box.appendChild(img);document.body.appendChild(box);
    var x=0,y=0,tx=0,ty=0,raf=0,off=document.documentElement.dir==="rtl"?-150:150;
    function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;box.style.left=x+'px';box.style.top=y+'px';raf=requestAnimationFrame(loop)}
    list.querySelectorAll('[data-peek]').forEach(function(row){
      row.addEventListener('mouseenter',function(e){img.src=row.getAttribute('data-peek');tx=x=e.clientX+off;ty=y=e.clientY;box.classList.add('is-on');if(!raf)loop()});
      row.addEventListener('mousemove',function(e){tx=e.clientX+off;ty=e.clientY});
      row.addEventListener('mouseleave',function(){box.classList.remove('is-on');cancelAnimationFrame(raf);raf=0});
    });
  }
})();

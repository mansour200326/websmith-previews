/* Future Contracting concept: header state, project index filter + hover photo. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',window.scrollY>8)};on();addEventListener('scroll',on,{passive:true});}

  var idx=document.querySelector('.idx');
  if(!idx)return;
  var rows=[].slice.call(idx.querySelectorAll('tr.row'));
  var count=document.querySelector('[data-count]');
  document.querySelectorAll('.filters button').forEach(function(b){
    b.addEventListener('click',function(){
      var f=b.getAttribute('data-f'),n=0;
      document.querySelectorAll('.filters button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      rows.forEach(function(r){var show=f==='all'||r.getAttribute('data-cat')===f;r.hidden=!show;if(show)n++;});
      if(count)count.textContent=n;
    });
  });

  // floating photo on hover (mouse only)
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var peek=document.createElement('div');peek.className='peek';peek.setAttribute('aria-hidden','true');
  var im=document.createElement('img');im.alt='';peek.appendChild(im);document.body.appendChild(peek);
  var x=0,y=0,tx=0,ty=0,raf=0;
  function loop(){x+=(tx-x)*(reduce?1:.18);y+=(ty-y)*(reduce?1:.18);peek.style.left=x+'px';peek.style.top=y+'px';
    if(Math.abs(tx-x)>.5||Math.abs(ty-y)>.5)raf=requestAnimationFrame(loop);else raf=0;}
  rows.forEach(function(r){
    var src=r.getAttribute('data-img');if(!src)return;
    r.addEventListener('mouseenter',function(e){im.src=src;peek.classList.add('is-on');});
    r.addEventListener('mouseleave',function(){peek.classList.remove('is-on');});
    r.addEventListener('mousemove',function(e){
      var w=peek.offsetWidth,h=peek.offsetHeight;
      tx=Math.min(innerWidth-w-16,e.clientX+28);ty=Math.max(16,Math.min(innerHeight-h-16,e.clientY-h/2));
      if(!raf)raf=requestAnimationFrame(loop);
    });
  });
})();

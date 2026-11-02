/* Al Marsa concept: live open/closed (10:00 to 05:00 Dubai time) + the 24h clock marker. */
(function(){
  var ar=document.documentElement.lang==='ar';
  function dubaiNow(){
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return +((p.find(function(x){return x.type===t})||{}).value||0)};
    return {h:g('hour')%24,m:g('minute')};
  }
  function paint(){
    var n=dubaiNow(),t=n.h+n.m/60,open=(t>=10||t<5);
    document.querySelectorAll('[data-open]').forEach(function(el){
      el.classList.toggle('is-open',open);
      var s=el.querySelector('span');
      if(s)s.textContent=open?(ar?'مفتوحين الحين · نسكّر 5 الفجر':'Open now · until 5am'):(ar?'مسكّرين الحين · نفتح 10 الصبح':'Closed now · opens 10am');
    });
    var hh=(n.h<10?'0':'')+n.h,mm=(n.m<10?'0':'')+n.m;
    document.querySelectorAll('.clock__now').forEach(function(el){
      el.style.setProperty('--now',(t/24*100)+'%');
      el.setAttribute('data-label',(ar?'الحين ':'Now ')+hh+':'+mm);
    });
  }
  paint();setInterval(paint,60000);
  // clock bar draws in when it scrolls into view
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.4});
    document.querySelectorAll('.clock').forEach(function(c){io.observe(c)});
  }else document.querySelectorAll('.clock').forEach(function(c){c.classList.add('is-in')});
})();
/* Board: on desktop, one photo follows the cursor over the dish rows (replaces the thumbnails). */
(function(){
  var board=document.querySelector('.board');if(!board)return;
  if(!matchMedia('(min-width:900px) and (hover:hover) and (pointer:fine)').matches)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var f=document.createElement('div');f.className='board__float';f.setAttribute('aria-hidden','true');
  var im=document.createElement('img');im.alt='';f.appendChild(im);document.body.appendChild(f);
  document.documentElement.classList.add('has-float');
  var x=0,y=0,tx=0,ty=0,raf=0;
  function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;f.style.transform='translate('+(x+28)+'px,'+(y-190)+'px)';raf=(Math.abs(tx-x)+Math.abs(ty-y)>.5)?requestAnimationFrame(loop):0}
  board.querySelectorAll('.dish').forEach(function(d){
    var src=d.querySelector('.dish__img img');if(!src)return;
    d.addEventListener('mouseenter',function(e){im.src=src.currentSrc||src.src;im.style.objectPosition=src.style.objectPosition||'';if(!f.classList.contains('is-on')){x=tx=e.clientX;y=ty=e.clientY;loop()}f.classList.add('is-on')});
    d.addEventListener('mouseleave',function(){f.classList.remove('is-on')});
    d.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop)});
  });
  addEventListener('scroll',function(){f.classList.remove('is-on')},{passive:true});
})();

/* The British Salon JLT concept: header state, hero entrance, services index hover photo */
(function(){
  var hd=document.querySelector('.hd');
  if(hd&&!hd.classList.contains('hd--light')){
    var hero=document.querySelector('.k-seq');
    var lim=function(){return hero?hero.offsetHeight-80:40};
    var on=function(){hd.classList.toggle('is-solid',scrollY>lim())};
    addEventListener('scroll',on,{passive:true});on();
  }
  var seq=document.querySelector('.k-seq');
  if(seq)requestAnimationFrame(function(){requestAnimationFrame(function(){seq.classList.add('is-in')})});

  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var idx=document.querySelector('[data-idx]');
  if(idx&&fine&&!RM){
    var box=document.createElement('div');box.className='idx__thumb';box.setAttribute('aria-hidden','true');
    var im=document.createElement('img');im.alt='';box.appendChild(im);document.body.appendChild(box);
    var x=0,y=0,tx=0,ty=0,raf=null;
    function loop(){x+=(tx-x)*.16;y+=(ty-y)*.16;box.style.left=x+'px';box.style.top=y+'px';raf=Math.abs(tx-x)+Math.abs(ty-y)>.5?requestAnimationFrame(loop):null}
    idx.querySelectorAll('a[data-img]').forEach(function(a){
      a.addEventListener('mouseenter',function(e){im.src=a.getAttribute('data-img');im.style.objectPosition=a.getAttribute('data-pos')||'50% 50%';x=tx=e.clientX+150;y=ty=e.clientY;box.classList.add('is-on')});
      a.addEventListener('mousemove',function(e){tx=e.clientX+(document.dir==='rtl'?-150:150);ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop)});
      a.addEventListener('mouseleave',function(){box.classList.remove('is-on')});
    });
  }
  // open a price-list tab from the URL hash (services.html#nails)
  var menu=document.querySelector('[data-k-menu]');
  if(menu){
    var openTab=function(){var k=location.hash.slice(1);if(!k)return;var b=menu.querySelector('[data-tab="'+k+'"]');if(b){b.click();setTimeout(function(){menu.scrollIntoView({behavior:RM?'auto':'smooth'})},60)}};
    addEventListener('hashchange',openTab);setTimeout(openTab,120);
  }
})();

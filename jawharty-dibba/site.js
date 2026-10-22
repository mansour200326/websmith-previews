/* Jawharty concept: small page behaviours on top of kit.js */
(function(){
  var AR=document.documentElement.lang==='ar';
  // WhatsApp links carry a prefilled message (plain wa.me link still works without JS)
  [].forEach.call(document.querySelectorAll('[data-wa]'),function(a){a.href='https://wa.me/971561686911?text='+encodeURIComponent(a.getAttribute('data-wa'))});
  // header hairline once scrolled
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};f();addEventListener('scroll',f,{passive:true})}

  // bridal index: hovering / focusing a row swaps the photo in the sticky phone frame
  var stage=document.querySelector('.bstage');
  if(stage){
    var imgs=[].slice.call(stage.querySelectorAll('img')),cap=stage.querySelector('.bstage__cap');
    var rows=[].slice.call(document.querySelectorAll('.brow'));
    var on=function(k){rows.forEach(function(r,j){r.classList.toggle('is-on',j===k)});imgs.forEach(function(im,j){im.classList.toggle('is-on',j===k)});if(cap)cap.textContent=rows[k].getAttribute('data-cap')||''};
    rows.forEach(function(r,k){r.addEventListener('pointerenter',function(){on(k)});r.addEventListener('focusin',function(){on(k)})});
    on(0);
  }

  // story bars: when the sequence wraps back to the first photo, no bar may stay filled
  var seqCnt=document.querySelector('.snap [data-k-seq-count]');
  if(seqCnt&&'MutationObserver' in window){
    new MutationObserver(function(){
      if(/^0?1\s*\//.test(seqCnt.textContent.trim()))[].forEach.call(document.querySelectorAll('.snap .k-seq__bar'),function(b){b.classList.remove('is-done')});
    }).observe(seqCnt,{childList:true,characterData:true,subtree:true});
  }

  // services index: mark the section in view
  var idx=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(idx.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    idx.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  }

  // Arabic labels for the kit lightbox and story bars
  if(AR){
    addEventListener('load',function(){
      var lb=document.querySelector('.k-lb');
      if(lb){lb.setAttribute('aria-label','عارض الصور');
        var m={'.k-lb__close':'إغلاق','.k-lb__prev':'السابق','.k-lb__next':'التالي'};
        Object.keys(m).forEach(function(s){var b=lb.querySelector(s);if(b)b.setAttribute('aria-label',m[s])});}
      [].forEach.call(document.querySelectorAll('.k-seq__bar'),function(b,i){b.setAttribute('aria-label','الصورة '+(i+1))});
    });
  }
})();

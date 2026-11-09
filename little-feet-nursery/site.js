/* Little Feet Nursery concept — small site script (kit.js does reveals, story, quotes, map, faq, magnetic) */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hero name: letters rise one by one, like little steps
  var h=document.querySelector('[data-steps]');
  if(h&&!RM){
    var i=0;
    h.querySelectorAll('[data-word]').forEach(function(w){
      var t=w.textContent;w.textContent='';w.setAttribute('aria-hidden','true');
      t.split('').forEach(function(c){
        var m=document.createElement('span');m.className='mask';
        var s=document.createElement('span');s.className='ch';s.textContent=c;s.style.setProperty('--i',i++);
        m.appendChild(s);w.appendChild(m);
      });
    });
  }
  // sticky header border
  var hdr=document.querySelector('.hdr');
  if(hdr){var f=function(){hdr.classList.toggle('is-stuck',scrollY>40)};f();addEventListener('scroll',f,{passive:true});}
  // simple in-view class for the ruler and the lab stripes
  var els=document.querySelectorAll('[data-inview]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -15% 0px'});
    els.forEach(function(e){io.observe(e)});
  }else els.forEach(function(e){e.classList.add('is-in')});
  // index children for staggered CSS
  document.querySelectorAll('[data-index]').forEach(function(p){[].forEach.call(p.children,function(c,k){c.style.setProperty('--i',k)})});
})();

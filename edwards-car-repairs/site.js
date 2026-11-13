/* Edwards Car Repairs concept: small page behaviours (kit.js does the motion) */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};f();addEventListener('scroll',f,{passive:true})}
  // services page: highlight the index entry for the service in view
  var links=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on');a.removeAttribute('aria-current')});var a=map[e.target.id];if(a){a.classList.add('is-on');a.setAttribute('aria-current','true')}}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.svc__item[id]').forEach(function(s){io.observe(s)});
  }
})();
/* booking docket: build the mailto from the card (nothing is sent by the page itself) */
(function(){
  var f=document.getElementById('docket');if(!f)return;
  var send=f.querySelector('.docket__send');
  var L=[['make','Make'],['model','Model'],['reg','Reg'],['mot','MOT due'],['issue',"What's wrong"],['phone','Best number']];
  function build(){
    var body=L.map(function(x){var v=(f.elements[x[0]].value||'').trim();if(x[0]==='reg')v=v.toUpperCase();return x[1]+': '+v}).join('\n');
    var reg=(f.elements.reg.value||'').trim().toUpperCase();
    return 'mailto:enquiries@edwardscarrepairs.co.uk?subject='+encodeURIComponent('Booking my car in'+(reg?' ('+reg+')':''))+'&body='+encodeURIComponent(body+'\n');
  }
  send.addEventListener('click',function(){send.href=build()});
  f.addEventListener('submit',function(e){e.preventDefault();location.href=build()});
})();

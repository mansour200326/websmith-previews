/* AB Jordan Solicitors concept: small page behaviours on top of kit.js */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header hairline once scrolled
  var hd=document.querySelector('.hd');
  if(hd){var t=function(){hd.classList.toggle('is-stuck',scrollY>8)};t();addEventListener('scroll',t,{passive:true})}

  // close the phone menu after choosing a link
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){a.closest('details').open=false})});

  // word-fill paragraph (Ario technique): words turn from grey to ink as it scrolls through the view
  document.querySelectorAll('[data-fill]').forEach(function(el){
    if(RM)return;
    var walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),nodes=[],n;
    while((n=walk.nextNode()))nodes.push(n);
    nodes.forEach(function(tn){
      var frag=document.createDocumentFragment();
      tn.nodeValue.split(/(\s+)/).forEach(function(part){
        if(!part)return;
        if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return}
        var s=document.createElement('span');s.className='w';s.textContent=part;frag.appendChild(s);
      });
      tn.parentNode.replaceChild(frag,tn);
    });
    var words=[].slice.call(el.querySelectorAll('.w'));
    el.classList.add('is-armed');
    var ticking=false,best=0;
    function update(){ticking=false;
      var r=el.getBoundingClientRect(),vh=innerHeight;
      var p=(vh*.85-r.top)/(r.height+vh*.35);p=Math.max(0,Math.min(1,p));
      var k=Math.max(best,Math.round(p*words.length));best=k;
      for(var i=0;i<words.length;i++)words[i].classList.toggle('on',i<k);
    }
    addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
    addEventListener('resize',update);update();
  });

  // practice-areas page: mark the area being read in the side index
  var idx=document.querySelectorAll('.pa__index a');
  if(idx.length&&'IntersectionObserver' in window){
    var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){idx.forEach(function(a){a.classList.remove('is-on');a.removeAttribute('aria-current')});var a=map[e.target.id];if(a){a.classList.add('is-on');a.setAttribute('aria-current','true')}}
    })},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.area[id]').forEach(function(s){io.observe(s)});
  }
})();

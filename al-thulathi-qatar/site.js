/* Al-Thulathi concept: small site behaviours (kit.js does the section motion) */
(function(){
  // fit the big name edge to edge
  function fit(){
    document.querySelectorAll('[data-fit]').forEach(function(el){
      var box=el.parentElement, inner=el.querySelector('[data-fit-inner]')||el;
      el.style.fontSize='100px';
      var w=inner.getBoundingClientRect().width, avail=box.clientWidth-parseFloat(getComputedStyle(box).paddingLeft)-parseFloat(getComputedStyle(box).paddingRight);
      var mx=+el.getAttribute('data-fit-max')||1e9;
      if(w>0) el.style.fontSize=Math.min(mx,Math.floor(100*avail/w*0.995))+'px';
    });
  }
  fit(); addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);

  // header hides on scroll down, returns on scroll up
  var hd=document.querySelector('.hd'), last=scrollY;
  addEventListener('scroll',function(){
    var y=scrollY; if(!hd) return;
    hd.classList.toggle('is-hidden', y>last && y>400 && !document.querySelector('.nav.is-open'));
    last=y;
  },{passive:true});

  // mobile menu
  var mb=document.querySelector('.menu-btn'), nav=document.querySelector('.nav');
  if(mb&&nav) mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});

  // register: short by default (JS only), show all on click
  var more=document.querySelector('[data-pf-more]'), tbl=more&&more.closest('section').querySelector('.pidx');
  if(more&&tbl){tbl.classList.add('is-short');more.hidden=false;
    more.addEventListener('click',function(){tbl.classList.remove('is-short');more.hidden=true;});}
  // project register filter
  var fb=document.querySelectorAll('[data-pf]');
  fb.forEach(function(b){b.addEventListener('click',function(){
    var k=b.getAttribute('data-pf');
    fb.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    var n=0;
    document.querySelectorAll('[data-tags]').forEach(function(r){
      var on=k==='all'||r.getAttribute('data-tags').split(' ').indexOf(k)>-1; r.hidden=!on; if(on)n++;
    });
    document.querySelectorAll('.k-gal__item[data-cat]').forEach(function(g){var on=k==='all'||g.getAttribute('data-cat')===k; g.hidden=!on; if(on)g.classList.add('is-in');});
    var c=document.querySelector('[data-pf-count]'); if(c) c.textContent=n;
    if(tbl&&k!=='all'){tbl.classList.remove('is-short');more.hidden=true;}
  })});
})();

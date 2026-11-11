/* ISM Rehab concept — small site behaviours (kit.js does the rest) */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};on();addEventListener('scroll',on,{passive:true})}

  // "Where it hurts": sticky photo follows the hovered/focused body area (desktop)
  var fig=document.querySelector('.hurt__fig');
  if(fig){
    var imgs=fig.querySelectorAll('img'),rows=document.querySelectorAll('.hurt__row');
    function show(key){
      [].forEach.call(imgs,function(i){i.classList.toggle('is-on',i.getAttribute('data-key')===key)});
      [].forEach.call(rows,function(r){r.classList.toggle('is-on',r.getAttribute('data-key')===key)});
    }
    [].forEach.call(rows,function(r){
      var k=r.getAttribute('data-key');
      r.addEventListener('mouseenter',function(){show(k)});
      r.addEventListener('focusin',function(){show(k)});
    });
  }

  // close the phone menu after choosing a link
  document.querySelectorAll('.hd__menu a').forEach(function(a){a.addEventListener('click',function(){a.closest('details').removeAttribute('open')})});
})();

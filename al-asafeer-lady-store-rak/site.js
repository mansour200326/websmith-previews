/* Al Asafeer concept: hero letters, header state, Arabic labels for the reel bars */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ar=document.documentElement.lang==='ar';
  // hero name: split into letters that rise one after another (text stays readable without JS)
  document.querySelectorAll('[data-letters]').forEach(function(el){
    if(RM||ar)return; // Arabic letters must stay joined: the word rises as one
    var t=el.textContent;
    el.innerHTML='<span class="vh">'+t+'</span>'+Array.from(t).map(function(c,i){return '<span class="ch" aria-hidden="true" style="--i:'+i+'">'+c+'</span>'}).join('');
  });
  document.querySelectorAll('[data-word-rise]').forEach(function(el){
    if(RM)return;var t=el.textContent;el.innerHTML='<span class="ch" style="--i:0">'+t+'</span>';
  });
  // header border once scrolled
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};on();addEventListener('scroll',on,{passive:true})}
  // reel bars: Arabic labels on Arabic pages
  if(ar)setTimeout(function(){document.querySelectorAll('.k-seq__bar').forEach(function(b,i){b.setAttribute('aria-label','عرض الصورة '+(i+1))})},0);
})();

/* Al Ain Juniors School concept: small page glue (kit.js does the motion). */
(function(){
  var hd=document.querySelector('.hd');
  function onS(){if(hd)hd.classList.toggle('is-scrolled',scrollY>8)}
  addEventListener('scroll',onS,{passive:true});onS();

  // phone bar slides in after the hero has played
  var bar=document.querySelector('.mbar');
  if(bar)setTimeout(function(){bar.classList.add('is-in')},1400);

  // close the phone menu after a tap
  document.querySelectorAll('.nav-m__panel a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');if(d)d.open=false})});

  // mark today's column in the school-day table (Al Ain time)
  try{
    var wd=new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'Asia/Dubai'}).format(new Date());
    var col=/Fri/.test(wd)?'fri':(/Mon|Tue|Wed|Thu/.test(wd)?'mt':null);
    if(col)document.querySelectorAll('.tt td[data-c="'+col+'"]').forEach(function(td){td.classList.add('is-today-c');td.style.color='var(--blue)';td.style.fontWeight='700'});
  }catch(e){}
})();

/* Qatar Plaster concept: small site script (kit.js does the motion) */
(function(){
  var b=document.querySelector('.hd__menu'),m=document.getElementById('mnav');
  if(b&&m){b.addEventListener('click',function(){var o=m.classList.toggle('is-open');b.setAttribute('aria-expanded',o)});}
  // project table: all rows are in the HTML (readable without JS); JS folds the long list behind one button
  document.querySelectorAll('[data-fold]').forEach(function(t){
    var n=+t.getAttribute('data-fold')||12,rows=[].slice.call(t.querySelectorAll('tbody tr'));if(rows.length<=n)return;
    rows.slice(n).forEach(function(r){r.hidden=true});
    var btn=document.createElement('button');btn.type='button';btn.className='fold-btn';
    btn.innerHTML=t.getAttribute('data-fold-label')||('Show all '+rows.length+' projects');
    btn.addEventListener('click',function(){rows.forEach(function(r){r.hidden=false});btn.remove();rows[n].querySelector('td').setAttribute('tabindex','-1');rows[n].querySelector('td').focus({preventScroll:true});});
    t.parentNode.insertBefore(btn,t.nextSibling);
  });
})();

/* Price search on services.html: filters every row across all tabs. */
(function(){
  var input=document.querySelector('[data-pfind]');if(!input)return;
  var menu=document.querySelector('[data-k-menu]'),out=document.querySelector('[data-pfind-out]');
  var items=[].slice.call(menu.querySelectorAll('.k-menu__item'));
  var norm=function(s){return s.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')};
  items.forEach(function(li){li._t=norm(li.textContent)});
  var lang=document.documentElement.lang;
  input.addEventListener('input',function(){
    var q=norm(input.value.trim());
    if(!q){menu.classList.remove('is-search');items.forEach(function(li){li.hidden=false});
      menu.querySelectorAll('.k-menu__panel').forEach(function(p){p.classList.remove('is-empty')});out.textContent='';return}
    menu.classList.add('is-search');var n=0;
    items.forEach(function(li){var hit=li._t.indexOf(q)>-1;li.hidden=!hit;if(hit)n++});
    menu.querySelectorAll('.k-menu__panel').forEach(function(p){p.classList.add('is-in');p.classList.toggle('is-empty',!p.querySelector('.k-menu__item:not([hidden])'))});
    out.textContent=lang==='ar'?(n?n+' نتيجة':'لا توجد نتائج، اتصل بنا على 920007882'):(n?n+(n===1?' treatment':' treatments')+' found':'Nothing found. Call us on 920007882 and ask.');
  });
})();

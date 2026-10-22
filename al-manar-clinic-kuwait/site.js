/* Al Manar Clinic concept: header state + mobile menu. Motion utilities live in kit.js (Websmith kit 11/16/18/19). */
(function(){
  var top=document.querySelector('.top');
  if(top){
    var hero=document.querySelector('.hero,.phead');
    var lim=function(){return hero?Math.max(40,hero.offsetHeight-90):40};
    var on=function(){top.classList.toggle('is-solid',scrollY>lim())};
    on();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);
  }
  var btn=document.querySelector('.top__menu'),menu=document.getElementById('mnav');
  if(btn&&menu){
    btn.addEventListener('click',function(){var o=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!o));menu.hidden=o;if(!o&&top)top.classList.add('is-solid')});
    menu.addEventListener('click',function(e){if(e.target.closest('a')){btn.setAttribute('aria-expanded','false');menu.hidden=true}});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){btn.setAttribute('aria-expanded','false');menu.hidden=true;btn.focus()}});
  }
})();

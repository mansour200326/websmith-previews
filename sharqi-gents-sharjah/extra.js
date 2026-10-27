/* Sharqi: header turns solid after the first screen (pages with a page header stay solid) */
(function(){var h=document.querySelector('[data-hd]');if(!h||h.getAttribute('data-hd')==='solid')return;var t=0;function f(){var s=scrollY>40;if(s!==t){t=s;h.classList.toggle('is-solid',s)}}addEventListener('scroll',f,{passive:true});f()})();

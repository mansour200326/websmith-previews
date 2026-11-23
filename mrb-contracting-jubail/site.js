/* MRB concept: header line on scroll */
(function(){var h=document.querySelector('.hd');if(!h)return;var on=false;
addEventListener('scroll',function(){var s=scrollY>8;if(s!==on){on=s;h.style.boxShadow=s?'0 10px 30px -18px rgba(13,22,32,.35)':''}},{passive:true});})();

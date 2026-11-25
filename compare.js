(function(){
var btns=[].slice.call(document.querySelectorAll('.pick button')),panels=[].slice.call(document.querySelectorAll('.h2h'));
function show(id){btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.b===id))});panels.forEach(function(p){p.hidden=p.id!=='b-'+id});if(id){var p=document.getElementById('b-'+id);if(p&&p.scrollIntoView)p.scrollIntoView({behavior:'smooth',block:'nearest'});}}
btns.forEach(function(b){b.onclick=function(){show(b.getAttribute('aria-pressed')==='true'?null:b.dataset.b)}});
var h=(location.hash||'').slice(1).toLowerCase();if(h&&document.getElementById('b-'+h))show(h);
window.addEventListener('hashchange',function(){var x=(location.hash||'').slice(1).toLowerCase();if(document.getElementById('b-'+x))show(x)});
})();
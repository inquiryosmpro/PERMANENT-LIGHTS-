(function(){
// FORM EMAILS: Web3Forms access key (web3forms.com). Every answer in the form is emailed to you.
var WEB3FORMS_KEY='5c0f2739-38e9-4c23-8fde-5b4b9a2ccad7';
var f=document.getElementById('est'),steps=[].slice.call(f.querySelectorAll('.step')),cur=0;
var all=document.getElementById('all'),cov=[].slice.call(f.querySelectorAll('input[name=coverage]:not(#all)'));
function $(id){return document.getElementById(id)}
function chk(n){return f.querySelector('input[name='+n+']:checked')}
function anyc(n){return !!chk(n)}
function val(n){return f.elements[n].value.trim()}
function okField(n){return val(n)&&f.elements[n].checkValidity()}
function phoneOk(){return val('phone').replace(/\D/g,'').length>=10}
function ok(i){var s=steps[i].dataset.step;
 if(s==='house'||s==='time')return anyc(s==='house'?'house':'timeline');
 if(s==='coverage')return anyc('coverage');if(s==='reason')return anyc('reason');
 if(s==='address')return val('address').length>3;
 return okField('name')&&phoneOk()&&okField('email');}
function update(){
 steps[cur].querySelectorAll('.next').forEach(function(b){b.disabled=!ok(cur)});
 var n=[anyc('house'),anyc('coverage'),anyc('reason'),anyc('timeline'),val('address').length>3,okField('name'),phoneOk(),okField('email')].filter(Boolean).length;
 var p=Math.round(n/8*50);$('dfill').style.width=p+'%';$('dstat').textContent='Your quote is being prepared… '+p+'%';
 $('calc').disabled=!ok(steps.length-1);
}
function show(n){cur=n;steps.forEach(function(s,k){s.classList.toggle('on',k===n)});$('back').hidden=n===0;$('tfill').style.width=(n/steps.length*100)+'%';update();window.scrollTo({top:0});}
function next(){if(ok(cur)&&cur<steps.length-1)show(cur+1);}
$('back').onclick=function(){if(cur>0)show(cur-1)};
f.querySelectorAll('.next').forEach(function(b){b.onclick=next});
f.addEventListener('change',function(e){
 if(e.target.id==='all'){cov.forEach(function(x){x.checked=all.checked});}
 else if(e.target.name==='coverage'){all.checked=cov.every(function(y){return y.checked});}
 update();
 if(e.target.type==='radio')setTimeout(next,250);
});
f.addEventListener('input',update);
f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.name==='address'){e.preventDefault();next();}});
function list(n){return [].slice.call(f.querySelectorAll('input[name='+n+']:checked')).map(function(x){return x.value}).join(', ')}
// Sends every answer to you by email. Resolves true if it was accepted.
function send(){
 if(!WEB3FORMS_KEY||WEB3FORMS_KEY.indexOf('PASTE')===0||val('bot-field'))return Promise.resolve(false);
 var d={access_key:WEB3FORMS_KEY,subject:'New free quote request: '+val('name')+' ('+chk('house').value+')',from_name:'OSMPRO Permanent Lights',
  name:val('name'),email:val('email'),phone:val('phone'),address:val('address'),home_type:chk('house').value,areas_to_light:list('coverage'),reasons:list('reason'),install_timeline:chk('timeline').value,notes:f.elements.message.value};
 function go(){return fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)}).then(function(r){return r.json()}).then(function(j){return !!(j&&j.success)});}
 return go().catch(function(){return false}).then(function(okk){return okk?true:go().catch(function(){return false});});
}
$('calc').onclick=function(){
 if(!ok(steps.length-1))return;
 $('calc').disabled=true;
 var sent=send();
 $('wizard').hidden=true;$('loading').hidden=false;window.scrollTo({top:0});
 var v=$('vid'),done=false,fb=false;
 function pct(p){$('lfill').style.width=p+'%';$('lstat').textContent=(p<100?'Preparing your custom quote… ':'All done ')+Math.round(p)+'%';}
 function finish(){if(done)return;done=true;pct(100);
  sent.then(function(okk){
   if(!okk){$('rtitle').textContent='We couldn’t send your form';$('rmsg').textContent='Please call us at 437-967-6464 and we’ll take your details over the phone.';}
   setTimeout(function(){$('result').hidden=false;if($('result').scrollIntoView)$('result').scrollIntoView({behavior:'smooth',block:'center'});},500);});}
 function fallback(){if(fb||done)return;fb=true;v.style.display='none';var t=0,iv=setInterval(function(){t++;pct(50+t*5);if(t>=10){clearInterval(iv);finish();}},800);}
 pct(50);
 v.ontimeupdate=function(){if(v.duration)pct(50+50*v.currentTime/v.duration)};
 v.onended=finish;v.onerror=fallback;$('vsrc').onerror=fallback;
 var pr=v.play();if(pr&&pr.catch)pr.catch(function(){v.muted=true;var p2=v.play();if(p2&&p2.catch)p2.catch(fallback);});
 setTimeout(function(){if(v.readyState===0)fallback();},5000);
};
// ADDRESS SUGGESTIONS. Optional: paste a free Geoapify key (geoapify.com, 3,000 lookups/day) for the best results.
var GEOAPIFY_KEY='';
(function(){
 var ai=f.elements.address,ul=$('sug'),tm,items=[],act=-1,seq=0,PROV={Ontario:'ON',Quebec:'QC','Québec':'QC','British Columbia':'BC',Alberta:'AB',Manitoba:'MB',Saskatchewan:'SK','Nova Scotia':'NS','New Brunswick':'NB','Newfoundland and Labrador':'NL','Prince Edward Island':'PE'};
 function hide(){ul.hidden=true;ai.setAttribute('aria-expanded','false');act=-1;}
 function mk(num,street,city,prov,zip){var main=((num?num+' ':'')+(street||'')).trim();return {main:main,sub:[city,PROV[prov]||prov,zip].filter(Boolean).join(', '),full:[main,city,PROV[prov]||prov,zip].filter(Boolean).join(', ')};}
 function get(u){return fetch(u).then(function(r){if(!r.ok)throw 0;return r.json()});}
 function viaGeoapify(q){return get('https://api.geoapify.com/v1/geocode/autocomplete?format=json&limit=6&filter=countrycode:ca&bias=proximity:-80.25,43.55&text='+encodeURIComponent(q)+'&apiKey='+GEOAPIFY_KEY).then(function(d){return (d.results||[]).map(function(r){return mk(r.housenumber,r.street||r.name,r.city||r.town||r.village,r.state_code||r.state,r.postcode)})});}
 function viaNominatim(q){return get('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=ca&limit=6&viewbox=-81.6,43.0,-79.4,44.2&q='+encodeURIComponent(q)).then(function(d){return d.map(function(r){var a=r.address||{};return mk(a.house_number,a.road||r.display_name.split(',')[0],a.city||a.town||a.village||a.suburb||a.municipality,a.state,a.postcode)})});}
 function viaPhoton(q){return get('https://photon.komoot.io/api/?lang=en&limit=8&lat=43.55&lon=-80.25&q='+encodeURIComponent(q)).then(function(d){return (d.features||[]).filter(function(x){return x.properties.countrycode==='CA'}).map(function(x){var p=x.properties;return mk(p.housenumber,p.street||p.name,p.city||p.town||p.village||p.district,p.state,p.postcode)})});}
 function find(q){var a=GEOAPIFY_KEY?viaGeoapify(q):viaNominatim(q);return a.catch(function(){return []}).then(function(r){return r.length?r:viaPhoton(q).catch(function(){return []})});}
 function pick(k){ai.value=items[k].full;hide();update();}
 function render(q){var seen={},list=items.filter(function(x){if(!x.main||seen[x.full])return false;seen[x.full]=1;return true}).slice(0,5);list.push({main:'Use “'+q+'” as my address',sub:'',full:q,typed:true});items=list;ul.innerHTML='';
  items.forEach(function(it,k){var li=document.createElement('li');li.setAttribute('role','option');if(it.typed)li.className='typed';li.innerHTML='<b></b><small></small>';li.firstChild.textContent=it.main;li.lastChild.textContent=it.sub;li.onmousedown=function(e){e.preventDefault();pick(k);};ul.appendChild(li);});
  ul.hidden=false;ai.setAttribute('aria-expanded','true');}
 ai.addEventListener('input',function(){clearTimeout(tm);var q=ai.value.trim();if(q.length<4){items=[];hide();return;}var my=++seq;tm=setTimeout(function(){find(q).then(function(r){if(my!==seq)return;items=r;render(q);});},450);});
 ai.addEventListener('keydown',function(e){if(ul.hidden)return;var n=items.length;
  if(e.key==='ArrowDown'){e.preventDefault();act=(act+1)%n;}else if(e.key==='ArrowUp'){e.preventDefault();act=(act-1+n)%n;}
  else if(e.key==='Enter'&&act>=0){e.preventDefault();e.stopPropagation();pick(act);return;}else if(e.key==='Escape'){hide();return;}else return;
  [].forEach.call(ul.children,function(li,k){li.setAttribute('aria-selected',k===act)});},true);
 ai.addEventListener('blur',function(){setTimeout(hide,150)});
})();
show(0);
})();

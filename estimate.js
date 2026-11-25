(function(){
// EDIT PRICES HERE (CAD). front = [low, high]; SIDE = per easy side; BACK = [low, high]. Large / estate = custom quote.
var P={'Detached':{front:[3000,4000]},'Semi-detached':{front:[2200,3000]},'Bungalow':{front:[2500,3500]}},SIDE=800,BACK=[1000,1500];
// FORM EMAILS: get a free access key at https://web3forms.com (enter inquiry@osmpro.ca) and paste it here.
var WEB3FORMS_KEY='5c0f2739-38e9-4c23-8fde-5b4b9a2ccad7';
var f=document.getElementById('est'),steps=[].slice.call(f.querySelectorAll('.step')),cur=0;
var all=document.getElementById('all'),cov=[].slice.call(f.querySelectorAll('input[name=coverage]:not(#all)'));
function $(id){return document.getElementById(id)}
function chk(n){return f.querySelector('input[name='+n+']:checked')}
function anyc(n){return !!chk(n)}
function val(n){return f.elements[n].value.trim()}
function okField(n){return val(n)&&f.elements[n].checkValidity()}
function ok(i){var s=steps[i].dataset.step;
 if(s==='house'||s==='time')return anyc(s==='house'?'house':'timeline');
 if(s==='coverage')return anyc('coverage');if(s==='reason')return anyc('reason');
 if(s==='address')return val('address').length>3;
 return okField('name')&&val('phone').replace(/\D/g,'').length>=10&&okField('email');}
function update(){
 steps[cur].querySelectorAll('.next').forEach(function(b){b.disabled=!ok(cur)});
 var n=[anyc('house'),anyc('coverage'),anyc('reason'),anyc('timeline'),val('address').length>3,okField('name'),val('phone').replace(/\D/g,'').length>=10,okField('email')].filter(Boolean).length;
 var p=Math.round(n/8*50);$('dfill').style.width=p+'%';$('dstat').textContent='Your estimate is loading… '+p+'%';
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
function money(n){return '$'+n.toLocaleString('en-CA')}
function compute(){
 var h=chk('house').value,c=function(v){return f.querySelector('input[name=coverage][value="'+v+'"]').checked};
 if(!P[h])return {txt:'Custom quote',note:'We’ll price your '+h.toLowerCase()+' property after a quick review.'};
 var p=P[h],lo=0,hi=0;
 if(c('Front')){lo+=p.front[0];hi+=p.front[1];}
 ['Left side','Right side'].forEach(function(s){if(c(s)){lo+=SIDE;hi+=SIDE;}});
 if(c('Back')){lo+=BACK[0];hi+=BACK[1];}
 var areas=cov.filter(function(x){return x.checked}).map(function(x){return x.value.toLowerCase()}).join(', ');
 return {txt:money(lo)+' – '+money(hi),note:h+' home: '+areas+'. Plus HST.'};
}
function list(n){return [].slice.call(f.querySelectorAll('input[name='+n+']:checked')).map(function(x){return x.value}).join(', ')}
function send(r){
 if(!WEB3FORMS_KEY||WEB3FORMS_KEY.indexOf('PASTE')===0||val('bot-field'))return;
 var d={access_key:WEB3FORMS_KEY,subject:'New estimate request: '+val('name')+' ('+r.txt+')',from_name:'OSMPRO Permanent Lights',name:val('name'),email:val('email'),phone:val('phone'),address:val('address'),home_type:chk('house').value,areas:list('coverage'),reasons:list('reason'),timeline:chk('timeline').value,estimate:r.txt,notes:f.elements.message.value};
 try{fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)}).catch(function(){});}catch(e){}
}
$('calc').onclick=function(){
 if(!ok(steps.length-1))return;
 var r=compute();$('estimate').value=r.txt;
 send(r);
 $('wizard').hidden=true;$('loading').hidden=false;window.scrollTo({top:0});
 var v=$('vid'),done=false,fb=false;
 function pct(p){$('lfill').style.width=p+'%';$('lstat').textContent=(p<100?'Your estimate is loading… ':'Your estimate is ready ')+Math.round(p)+'%';}
 function finish(){if(done)return;done=true;pct(100);$('price').textContent=r.txt;$('note').textContent=r.note;setTimeout(function(){$('result').hidden=false;$('result').scrollIntoView({behavior:'smooth',block:'center'});},500);}
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

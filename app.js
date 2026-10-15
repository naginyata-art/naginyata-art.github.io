(function(){
  var S = window.SITE;
  var $ = function(id){return document.getElementById(id)};
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

  $("logo").textContent = S.name.toUpperCase();
  $("role").textContent = S.role;
  $("name").textContent = S.name;
  $("tagline").textContent = S.tagline;
  $("foot").textContent = S.name;
  $("year").textContent = new Date().getFullYear();

  $("aboutText").innerHTML = S.about.map(function(p){return "<p>"+esc(p)+"</p>"}).join("");
  if(S.avatar) $("avatar").innerHTML = '<img src="'+esc(S.avatar)+'" alt="'+esc(S.name)+'">';

  $("links").innerHTML = S.links.map(function(l){
    var on = !!l.url;
    return '<a class="link'+(on?'':' off')+'"'+(on?' href="'+esc(l.url)+'" target="_blank" rel="noopener"':'')+'>'
      +'<span>'+esc(l.label)+'</span><small>'+esc(on?(l.handle||'→'):'coming soon')+'</small></a>';
  }).join("");

  // gallery
  var current = "All";
  function renderFilters(){
    var cats = ["All"].concat(S.categories);
    $("filters").innerHTML = cats.map(function(c){
      return '<button class="chip'+(c===current?' on':'')+'" data-c="'+esc(c)+'">'+esc(c)+'</button>';
    }).join("");
  }
  function renderGrid(){
    var list = S.artworks.map(function(a,i){a._i=i;return a}).filter(function(a){return current==="All"||a.category===current});
    if(!list.length){$("grid").innerHTML='<p class="empty">No works in this category yet.</p>';return}
    $("grid").innerHTML = list.map(function(a){
      var th = a.image ? '<img loading="lazy" src="'+esc(a.image)+'" alt="'+esc(a.title)+'">' : esc(a.title);
      return '<div class="art" data-i="'+a._i+'"><div class="thumb">'+th+'</div><div class="meta"><b>'+esc(a.title)+'</b><span>'+esc(a.category)+(a.year?' · '+esc(a.year):'')+'</span></div></div>';
    }).join("");
  }
  $("filters").addEventListener("click",function(e){
    var b=e.target.closest(".chip"); if(!b) return;
    current=b.getAttribute("data-c"); renderFilters(); renderGrid();
  });
  $("grid").addEventListener("click",function(e){
    var c=e.target.closest(".art"); if(!c) return;
    var a=S.artworks[+c.getAttribute("data-i")];
    $("lbBox").innerHTML=(a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.title)+'">':'<div class="ph"></div>')
      +'<p>'+esc(a.title)+' · '+esc(a.category)+'</p>';
    $("lb").classList.add("on");
  });
  $("lb").addEventListener("click",function(){$("lb").classList.remove("on")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")$("lb").classList.remove("on")});
  renderFilters(); renderGrid();

  // contact
  $("form").addEventListener("submit",function(e){
    e.preventDefault();
    var note=$("note");
    var data={name:$("fn").value.trim(),email:$("fe").value.trim(),message:$("fm").value.trim()};
    if(!S.contactEndpoint){
      note.textContent="Opening your mail app. If nothing opens, please DM on X instead.";
      var body=data.message+"\n\n— "+data.name+" ("+data.email+")";
      location.href="mailto:"+S.contactEmail+"?subject="+encodeURIComponent("Message from "+data.name)+"&body="+encodeURIComponent(body);
      return;
    }
    note.textContent="Sending...";
    fetch(S.contactEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
      .then(function(r){if(!r.ok)throw 0;note.textContent="Thank you! Your message has been sent.";$("form").reset()})
      .catch(function(){note.textContent="Sorry, something went wrong. Please try again or DM on X."});
  });
})();

(function(){
  var S = window.SITE;
  var $ = function(id){return document.getElementById(id)};
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

  // ---- opening (Start screen) ----
  $("iTitle").textContent = S.name + " portfolio";
  $("iSub").textContent = S.introSub;
  var seen = false;
  try { seen = sessionStorage.getItem("seen") === "1"; } catch(e){}
  function closeIntro(){
    $("intro").classList.add("off");
    document.body.classList.remove("lock");
    try { sessionStorage.setItem("seen","1"); } catch(e){}
    setTimeout(function(){ $("intro").style.display = "none"; }, 700);
  }
  if(seen){ $("intro").style.display = "none"; document.body.classList.remove("lock"); }
  else { $("start").addEventListener("click", closeIntro); try{ $("start").focus(); }catch(e){} }

  // ---- screens: one at a time, switched by the URL hash ----
  var screens = ["home","work","about","contact"];
  function route(){
    var h = (location.hash || "#home").slice(1);
    if(screens.indexOf(h) < 0) h = "home";
    screens.forEach(function(s){ $(s).classList.toggle("on", s === h); });
    window.scrollTo(0,0);
  }
  window.addEventListener("hashchange", route);
  route();

  // ---- static text ----
  $("logo").textContent = S.name.toUpperCase();
  $("slogan").textContent = S.slogan;
  $("small").textContent = S.smallText;
  $("foot").textContent = S.name;
  $("year").textContent = new Date().getFullYear();

  var menu = [["My Work","#work"],["About Me","#about"],["Work With Me","#contact"]];
  $("menu").innerHTML = menu.map(function(m){return '<a href="'+m[1]+'">'+esc(m[0])+'<span>→</span></a>'}).join("");

  // ---- about ----
  $("aboutText").innerHTML = S.about.map(function(p){return "<p>"+esc(p)+"</p>"}).join("");
  if(S.avatar) $("avatar").innerHTML = '<img src="'+esc(S.avatar)+'" alt="'+esc(S.name)+'">';
  $("aLinks").innerHTML = S.links.map(function(l){
    if(l.url){
      return '<a class="lbox" href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(l.label)+'<small>'+esc(l.handle||'')+'</small></a>';
    }
    return '<div class="lbox off">'+esc(l.label)+'<small>coming soon</small></div>';
  }).join("");

  // ---- My Work gallery ----
  function card(a,i){
    var label = a.alt || a.title;
    var th = a.image ? '<img loading="lazy" src="'+esc(a.image)+'" alt="'+esc(label)+'">' : esc(a.title);
    return '<div class="art" tabindex="0" role="button" aria-label="'+esc(label)+'" data-i="'+i+'"><div class="thumb">'+th+'</div><div class="cap">'+esc(label)+'</div></div>';
  }
  function showLB(a){
    $("lbBox").innerHTML = (a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt||a.title)+'">':'<div class="ph"></div>')
      + '<p>'+esc(a.title)+(a.category?' · '+esc(a.category):'')+'</p>';
    $("lb").classList.add("on");
  }
  var current = "All";
  function visible(){
    return S.artworks.filter(function(a){return current==="All"||a.category===current});
  }
  function renderFilters(){
    var cats = S.categories.concat(["All"]);
    $("filters").innerHTML = cats.map(function(c){
      return '<button class="chip'+(c===current?' on':'')+'" data-c="'+esc(c)+'">'+esc(c)+'</button>';
    }).join("");
  }
  function renderWork(){
    var list = visible();
    $("grid").innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No works in this category yet.</p>';
  }
  $("filters").addEventListener("click",function(e){
    var b=e.target.closest(".chip"); if(!b) return;
    current=b.getAttribute("data-c"); renderFilters(); renderWork();
  });
  $("grid").addEventListener("click",function(e){
    var c=e.target.closest(".art"); if(!c) return;
    showLB(visible()[+c.getAttribute("data-i")]);
  });
  $("grid").addEventListener("keydown",function(e){
    if(e.key!=="Enter" && e.key!==" ") return;
    var c=e.target.closest(".art"); if(!c) return;
    e.preventDefault(); showLB(visible()[+c.getAttribute("data-i")]);
  });
  $("lb").addEventListener("click",function(){$("lb").classList.remove("on")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")$("lb").classList.remove("on")});
  renderFilters(); renderWork();

  // ---- contact ----
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

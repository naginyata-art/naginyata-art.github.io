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

  // ---- static text ----
  $("logo").textContent = S.name.toUpperCase();
  $("role").textContent = S.role;
  $("slogan").textContent = S.slogan;
  $("small").textContent = S.smallText;
  $("handle").textContent = S.handle;
  $("foot").textContent = S.name;
  $("year").textContent = new Date().getFullYear();

  var menu = [["My Work","#work"],["Other Work","#other"],["Socials","#socials"],["About Me","#about"],["Work With Me","#contact"]];
  $("menu").innerHTML = menu.map(function(m){return '<a href="'+m[1]+'">'+esc(m[0])+'<span>→</span></a>'}).join("");

  $("aboutText").innerHTML = S.about.map(function(p){return "<p>"+esc(p)+"</p>"}).join("");
  ["avatar","avatarHome"].forEach(function(id){
    if(S.avatar) $(id).innerHTML = '<img src="'+esc(S.avatar)+'" alt="'+esc(S.name)+'">';
  });

  // ---- links (socials / about / footer) ----
  $("links").innerHTML = S.links.map(function(l){
    var on = !!l.url;
    return '<a class="link'+(on?'':' off')+'"'+(on?' href="'+esc(l.url)+'" target="_blank" rel="noopener"':'')+'>'
      +'<span>'+esc(l.label)+'</span><small>'+esc(on?(l.handle||'→'):'coming soon')+'</small></a>';
  }).join("");
  $("aLinks").innerHTML = S.links.map(function(l){
    return l.url ? '<a href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(l.label)+'</a>' : '<span>'+esc(l.label)+'</span>';
  }).join("");
  $("fLinks").innerHTML = S.links.filter(function(l){return l.url}).map(function(l){
    return '<a href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(l.label)+'</a>';
  }).join("");

  // ---- galleries ----
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
  function bind(gridId, getList){
    var g = $(gridId);
    g.addEventListener("click",function(e){
      var c=e.target.closest(".art"); if(!c) return;
      showLB(getList()[+c.getAttribute("data-i")]);
    });
    g.addEventListener("keydown",function(e){
      if(e.key!=="Enter" && e.key!==" ") return;
      var c=e.target.closest(".art"); if(!c) return;
      e.preventDefault(); showLB(getList()[+c.getAttribute("data-i")]);
    });
  }

  var current = "All";
  function visible(){
    return S.artworks.filter(function(a){return current==="All"||a.category===current});
  }
  function renderFilters(){
    var cats = ["All"].concat(S.categories);
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
  bind("grid", visible);
  renderFilters(); renderWork();

  var other = S.otherWorks || [];
  if(other.length){
    $("gridOther").innerHTML = other.map(card).join("");
    bind("gridOther", function(){return other});
  } else {
    $("other").style.display = "none";
  }

  $("lb").addEventListener("click",function(){$("lb").classList.remove("on")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")$("lb").classList.remove("on")});

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

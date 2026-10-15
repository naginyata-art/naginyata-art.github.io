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

  // ---- social embeds (loaded only when My work is opened, once) ----
  var embedsDone = false;
  function addScript(src){ var s=document.createElement("script"); s.async=true; s.src=src; s.charset="utf-8"; document.body.appendChild(s); }
  function loadEmbeds(){
    if(embedsDone) return; embedsDone = true;
    var E = S.embeds || {}, html = "", x = S.links.filter(function(l){return /x\.com|twitter\.com/.test(l.url||"")})[0];
    var needX = false, needIG = false;
    if(E.xTimeline && x){
      html += '<h3>Latest from X</h3><a class="twitter-timeline" data-theme="dark" data-chrome="noheader nofooter transparent" data-height="640" data-dnt="true" href="'+esc(x.url.replace("x.com","twitter.com"))+'">Posts by '+esc(x.handle||"")+'</a>';
      needX = true;
    }
    (E.xPosts||[]).forEach(function(u){ html += '<blockquote class="twitter-tweet" data-theme="dark" data-dnt="true"><a href="'+esc(u.replace("x.com","twitter.com"))+'"></a></blockquote>'; needX = true; });
    (E.instagramPosts||[]).forEach(function(u){ html += '<blockquote class="instagram-media" data-instgrm-permalink="'+esc(u)+'" data-instgrm-version="14"></blockquote>'; needIG = true; });
    if(!html) return;
    $("embeds").hidden = false; $("embeds").innerHTML = html + '<p class="embed-note">Posts are shown by X / Instagram and open on their sites.</p>';
    if(needX) addScript("https://platform.twitter.com/widgets.js");
    if(needIG) addScript("https://www.instagram.com/embed.js");
  }

  // ---- screens: one at a time, switched by the URL hash ----
  var screens = ["home","work","about","contact"];
  function route(){
    var h = (location.hash || "#home").slice(1);
    if(screens.indexOf(h) < 0) h = "home";
    screens.forEach(function(s){ $(s).classList.toggle("on", s === h); });
    window.scrollTo(0,0);
    if(h==="work") loadEmbeds();
  }
  window.addEventListener("hashchange", route);
  route();

  // ---- static text ----
  $("logo").textContent = S.name.toUpperCase();
  $("slogan").textContent = S.slogan;
  $("small").textContent = S.smallText;
  $("foot").textContent = S.name;
  $("year").textContent = new Date().getFullYear();

  var menu = [["My work","#work"],["About me","#about"],["Work with me","#contact"]];
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

  // ---- My work gallery ----
  var lastFocus = null;
  function card(a,i){
    var label = a.alt || a.title;
    var small = a.thumb || a.image; // small image for the grid, full image for the lightbox
    var th = small ? '<img loading="lazy" decoding="async" src="'+esc(small)+'" alt="'+esc(label)+'">' : '<div class="ph">'+esc(a.title)+'</div>';
    var tag = a.sample ? '<span class="tag">SAMPLE</span>' : '';
    return '<div class="art" tabindex="0" role="button" aria-label="'+esc(label)+'" data-i="'+i+'"><div class="thumb">'+th+'</div>'+tag+'<div class="cap">'+esc(a.title)+(a.category?' · '+esc(a.category):'')+'</div></div>';
  }
  function showLB(a){
    $("lbBox").innerHTML = (a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt||a.title)+'">':'<div class="ph"></div>')
      + '<p>'+esc(a.title)+(a.category?' · '+esc(a.category):'')+(a.year?' · '+esc(a.year):'')+'</p>';
    $("lb").classList.add("on");
    document.body.classList.add("lock");
  }
  function closeLB(){
    $("lb").classList.remove("on");
    if(!$("intro") || $("intro").style.display==="none" || $("intro").classList.contains("off")) document.body.classList.remove("lock");
    if(lastFocus){ try{ lastFocus.focus({preventScroll:true}); }catch(e){} lastFocus=null; }
  }
  var current = "All";
  function visible(){
    return S.artworks.filter(function(a){return current==="All"||a.category===current});
  }
  function renderFilters(){
    var cats = S.categories.concat(["All"]);
    $("filters").innerHTML = cats.map(function(c){
      return '<button type="button" class="chip'+(c===current?' on':'')+'" aria-pressed="'+(c===current)+'" data-c="'+esc(c)+'">'+esc(c)+'</button>';
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
  function open(el){ lastFocus=el; showLB(visible()[+el.getAttribute("data-i")]); }
  $("grid").addEventListener("click",function(e){
    var c=e.target.closest(".art"); if(c) open(c);
  });
  $("grid").addEventListener("keydown",function(e){
    if(e.key!=="Enter" && e.key!==" ") return;
    var c=e.target.closest(".art"); if(!c) return;
    e.preventDefault(); open(c);
  });
  $("lb").addEventListener("click",closeLB);
  document.addEventListener("keydown",function(e){if(e.key==="Escape" && $("lb").classList.contains("on")) closeLB()});
  renderFilters(); renderWork();

  // ---- contact ----
  $("ft").innerHTML = '<option value="">Select...</option>' + (S.contactTypes||["Other"]).map(function(t){return '<option>'+esc(t)+'</option>'}).join("");
  var fields = [["fn","en","Please enter your name."],["fe","ee","Please enter a valid email address."],["ft","et","Please choose a type of request."],["fm","em","Please write your message."]];
  function validate(){
    var ok = true, first = null;
    fields.forEach(function(f){
      var el=$(f[0]), bad = !el.value.trim() || (el.type==="email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      $(f[1]).textContent = bad ? f[2] : "";
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      if(bad){ ok=false; if(!first) first=el; }
    });
    if(first) first.focus();
    return ok;
  }
  fields.forEach(function(f){ $(f[0]).addEventListener("input",function(){ $(f[1]).textContent=""; $(f[0]).setAttribute("aria-invalid","false"); }); });
  $("form").addEventListener("submit",function(e){
    e.preventDefault();
    var note=$("note");
    if(!validate()){ note.textContent="Please check the highlighted fields."; return; }
    var data={name:$("fn").value.trim(),email:$("fe").value.trim(),type:$("ft").value,message:$("fm").value.trim()};
    if(!S.contactEndpoint){
      // Not connected to a sending service yet: be honest, open the visitor's mail app instead.
      note.textContent="This form isn't connected yet. Opening your mail app so you can send it from there. If nothing opens, please DM on X instead.";
      var body=data.message+"\n\n— "+data.name+" ("+data.email+")";
      location.href="mailto:"+S.contactEmail+"?subject="+encodeURIComponent("["+data.type+"] Message from "+data.name)+"&body="+encodeURIComponent(body);
      return;
    }
    note.textContent="Sending...";
    fetch(S.contactEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
      .then(function(r){if(!r.ok)throw 0;note.textContent="Thank you! Your message has been sent.";$("form").reset()})
      .catch(function(){note.textContent="Sorry, something went wrong. Please try again or DM on X."});
  });
})();

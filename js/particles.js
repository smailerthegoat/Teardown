/* Hero figure — sampled particles.
   The title is drawn to an offscreen canvas, its alpha channel read once, and
   every opaque pixel becomes a particle. Same routine the lab demos; here it
   does real work, because the article is about turning input into pixels. */
(function(){
  "use strict";
  var cv = document.getElementById("heroCanvas");
  if(!cv) return;

  var T = window.TD;
  var view = null, parts = [], mouse = { x:-999, y:-999 }, H = 220;

  function build(){
    view = T.fit(cv, H);
    var W = view.w;

    var off = document.createElement("canvas");
    off.width = W; off.height = H;
    var o = off.getContext("2d");
    var size = Math.min(W * 0.155, 116);
    o.fillStyle = "#fff";
    o.textAlign = "center"; o.textBaseline = "middle";
    o.font = "800 " + size + "px Syne, Arial, sans-serif";
    o.fillText("TEARDOWN", W / 2, H / 2);

    var data = o.getImageData(0, 0, W, H).data;
    var gap = W < 620 ? 5 : 4;
    parts = [];
    for(var y = 0; y < H; y += gap){
      for(var x = 0; x < W; x += gap){
        if(data[(y * W + x) * 4 + 3] > 140){
          parts.push({ hx:x, hy:y, x:x, y:y + (Math.random() - 0.5) * 6, vx:0, vy:0 });
        }
      }
    }
  }

  cv.addEventListener("pointermove", function(e){
    var r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  cv.addEventListener("pointerleave", function(){ mouse.x = -999; mouse.y = -999; });

  var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(function(){
    build();
    T.loop(cv, function(){
      var ctx = view.ctx;
      ctx.clearRect(0, 0, view.w, H);
      for(var i = 0; i < parts.length; i++){
        var p = parts[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y, dsq = dx * dx + dy * dy;
        if(dsq < 6400){
          var f = (6400 - dsq) / 6400, d = Math.sqrt(dsq) || 1;
          p.vx += (dx / d) * f * 5;
          p.vy += (dy / d) * f * 5;
        }
        p.vx += (p.hx - p.x) * 0.05;
        p.vy += (p.hy - p.y) * 0.05;
        p.vx *= 0.87; p.vy *= 0.87;
        p.x += p.vx; p.y += p.vy;

        var disp = Math.abs(p.x - p.hx) + Math.abs(p.y - p.hy);
        ctx.fillStyle = disp > 8 ? "#F0A03C" : "#E6E8EA";
        ctx.fillRect(p.x, p.y, 1.8, 1.8);
      }
    });
  });

  addEventListener("resize", function(){
    if(!view || Math.abs(cv.clientWidth - view.w) > 40) build();
  });
})();

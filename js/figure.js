/* The sticky figure. Six diagrams, one per step of the argument, all drawn to
   the same canvas. `TD.fig.step` says which, `TD.fig.p` is progress within it.
   js/steps.js owns those two numbers; this file only draws. */
(function(){
  "use strict";
  var cv = document.getElementById("fig");
  if(!cv) return;

  var T = window.TD;
  var HEIGHT = 430, view = null;
  var eased = 0;                    /* the lagging value shown in step 5 */
  var state = { step: 0, p: 0 };
  T.fig = state;

  var C = {
    line:"#272C33", dim:"#7C838D", fg:"#E6E8EA",
    amber:"#F0A03C", teal:"#5BC8AF", red:"#E2685F", surface:"#1C2026"
  };

  function size(){ view = T.fit(cv, cv.clientHeight || HEIGHT); }

  function label(ctx, text, x, y, color){
    ctx.fillStyle = color || C.dim;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(text, x, y);
  }
  function big(ctx, text, x, y, color){
    ctx.fillStyle = color || C.fg;
    ctx.font = "700 30px Syne, Arial, sans-serif";
    ctx.fillText(text, x, y);
  }
  function box(ctx, x, y, w, h, stroke, fill){
    if(fill){ ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
    ctx.strokeStyle = stroke || C.line;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
  function grid(ctx, w, h){
    ctx.strokeStyle = "rgba(39,44,51,.55)";
    ctx.lineWidth = 1;
    for(var x = 0; x < w; x += 28){
      ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, h); ctx.stroke();
    }
    for(var y = 0; y < h; y += 28){
      ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(w, y + .5); ctx.stroke();
    }
  }

  /* 0 — scrollY is a pixel count and nothing else */
  function drawRaw(ctx, w, h, p){
    var px = 22, pw = 74, py = 40, ph = h - 110;
    box(ctx, px, py, pw, ph, C.line, C.surface);
    label(ctx, "document", px, py - 12);

    var thumbH = 58;
    var ty = py + p * (ph - thumbH);
    ctx.fillStyle = C.amber;
    ctx.fillRect(px + pw - 7, ty, 4, thumbH);

    box(ctx, px + pw + 34, py + ph / 2 - 46, w - px - pw - 60, 92, C.line);
    label(ctx, "window.scrollY", px + pw + 50, py + ph / 2 - 20);
    big(ctx, Math.round(p * 4820) + " px", px + pw + 50, py + ph / 2 + 18, C.amber);
    label(ctx, "no meaning yet — just a distance from the top", px, h - 44);
  }

  /* 1 — normalise the number against a range you chose */
  function drawNormalise(ctx, w, h, p){
    var x0 = 40, x1 = w - 40, y = h / 2 - 20;
    ctx.strokeStyle = C.line; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();

    [0, 0.5, 1].forEach(function(t){
      var x = x0 + t * (x1 - x0);
      ctx.strokeStyle = C.dim;
      ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x, y + 7); ctx.stroke();
      label(ctx, t.toFixed(1), x - 8, y + 26);
    });

    var mx = x0 + p * (x1 - x0);
    ctx.fillStyle = C.amber;
    ctx.beginPath(); ctx.arc(mx, y, 7, 0, Math.PI * 2); ctx.fill();

    label(ctx, "start", x0, y - 24);
    label(ctx, "end", x1 - 22, y - 24);
    label(ctx, "(scrollY − start) / (end − start)", 40, h - 84);
    big(ctx, p.toFixed(3), 40, h - 46, C.teal);
  }

  /* 2 — pin the stage so progress has somewhere to happen */
  function drawPin(ctx, w, h, p){
    var vx = 40, vy = 46, vw = w - 80, vh = h - 130;
    label(ctx, "viewport", vx, vy - 12);
    box(ctx, vx, vy, vw, vh, C.teal);

    /* the long content behind it keeps moving */
    var contentY = vy - p * (vh * 1.4);
    ctx.save();
    ctx.beginPath(); ctx.rect(vx, vy, vw, vh); ctx.clip();
    for(var i = 0; i < 9; i++){
      var by = contentY + i * 56;
      box(ctx, vx + 16, by, vw - 32, 40, C.line, "rgba(28,32,38,.8)");
    }
    /* the pinned element does not */
    box(ctx, vx + vw / 2 - 70, vy + vh / 2 - 34, 140, 68, C.amber, "#191C22");
    ctx.fillStyle = C.amber;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText("sticky", vx + vw / 2 - 18, vy + vh / 2 + 4);
    ctx.restore();

    label(ctx, "content scrolls · the stage holds still", vx, h - 44);
  }

  /* 3 — spend the progress on one property */
  function drawMap(ctx, w, h, p){
    var vx = 40, vy = 70, vw = w - 80, vh = 150;
    label(ctx, "position: sticky container", vx, vy - 12);
    box(ctx, vx, vy, vw, vh, C.line);

    var cardW = 120, gap = 16, n = 6;
    var total = n * (cardW + gap);
    var overflow = Math.max(0, total - vw + gap);
    var shift = -p * overflow;

    ctx.save();
    ctx.beginPath(); ctx.rect(vx, vy, vw, vh); ctx.clip();
    for(var i = 0; i < n; i++){
      var x = vx + gap + i * (cardW + gap) + shift;
      var mid = Math.abs(x + cardW / 2 - (vx + vw / 2));
      var near = mid < vw * 0.22;
      box(ctx, x, vy + 24, cardW, vh - 48, near ? C.amber : C.line, C.surface);
      label(ctx, "0" + (i + 1), x + 12, vy + 48, near ? C.amber : C.dim);
    }
    ctx.restore();

    label(ctx, "translateX( −progress × overflow )", vx, h - 92);
    big(ctx, Math.round(shift) + "px", vx, h - 54, C.amber);
    label(ctx, "transform only — never left/top", vx, h - 28);
  }

  /* 4 — the eased value is what the eye reads */
  function drawSmooth(ctx, w, h, p){
    var x0 = 50, x1 = w - 50, y = h / 2;
    var target = x0 + p * (x1 - x0);
    eased = T.lerp(eased, target, 0.08);

    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();

    /* the gap between the two dots IS the effect */
    ctx.strokeStyle = C.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(eased, y); ctx.lineTo(target, y); ctx.stroke();

    ctx.fillStyle = C.dim;
    ctx.beginPath(); ctx.arc(target, y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.teal;
    ctx.beginPath(); ctx.arc(eased, y, 10, 0, Math.PI * 2); ctx.fill();

    label(ctx, "raw target", target - 26, y - 22);
    label(ctx, "what you render", eased - 40, y + 34, C.teal);
    label(ctx, "value += (target − value) × 0.08", 50, h - 74);
    label(ctx, "lag: " + Math.abs(target - eased).toFixed(1) + "px", 50, h - 46, C.amber);
  }

  /* 5 — the frame budget is the whole constraint */
  function drawBudget(ctx, w, h){
    var bx = 46, bw = w - 100, rowH = 46, top = 74;
    label(ctx, "one frame at 60fps = 16.7ms", bx, top - 22);

    var rows = [
      { name:"transform / opacity", cost:0.22, color:C.teal,  note:"compositor only" },
      { name:"top / left",          cost:0.78, color:C.red,   note:"layout + paint" },
      { name:"box-shadow",          cost:0.61, color:C.amber, note:"paint" },
      { name:"filter: blur()",      cost:0.48, color:C.amber, note:"paint" }
    ];

    rows.forEach(function(r, i){
      var y = top + i * rowH;
      box(ctx, bx, y, bw, 22, C.line, C.surface);
      ctx.fillStyle = r.color;
      ctx.fillRect(bx + 1, y + 1, (bw - 2) * r.cost, 20);
      label(ctx, r.name, bx, y - 6);
      label(ctx, r.note, bx + bw - 110, y + 16, "#0F1113");
    });

    var lx = bx + bw * 0.86;
    ctx.strokeStyle = C.red; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lx, top - 10); ctx.lineTo(lx, top + rows.length * rowH); ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, "dropped frame", lx - 44, top + rows.length * rowH + 20, C.red);
  }

  var draws = [drawRaw, drawNormalise, drawPin, drawMap, drawSmooth, drawBudget];
  var stepName = document.getElementById("figname");

  size();
  addEventListener("resize", size);

  T.loop(cv, function(){
    var ctx = view.ctx, w = view.w, h = view.h;
    ctx.clearRect(0, 0, w, h);
    grid(ctx, w, h);
    ctx.textBaseline = "alphabetic";
    (draws[state.step] || draws[0])(ctx, w, h, T.clamp(state.p, 0, 1));
    if(stepName) stepName.textContent = "fig. " + String(state.step + 1).padStart(2, "0");
  });
})();

/* Drives the figure from the prose. Each .step owns one diagram; the step
   nearest the middle of the viewport is the live one, and how far it has
   travelled through the middle band becomes the figure's local progress. */
(function(){
  "use strict";
  var steps = [].slice.call(document.querySelectorAll(".step"));
  if(!steps.length) return;

  var T = window.TD;
  var caption = document.getElementById("figcap");
  var current = -1;
  var ticking = false;

  function update(){
    ticking = false;
    var mid = innerHeight * 0.5;
    var best = 0, bestDist = Infinity;

    steps.forEach(function(s, i){
      var r = s.getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - mid);
      if(d < bestDist){ bestDist = d; best = i; }
    });

    if(best !== current){
      current = best;
      steps.forEach(function(s, i){ s.classList.toggle("live", i === best); });
      T.fig.step = +steps[best].dataset.fig;
      if(caption) caption.textContent = steps[best].dataset.cap || "";
    }

    /* progress through the live step, measured across the viewport */
    var r = steps[best].getBoundingClientRect();
    T.fig.p = T.clamp((mid - r.top) / Math.max(1, r.height), 0, 1);
  }

  addEventListener("scroll", function(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener("resize", update);
  update();
})();

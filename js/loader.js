/* Column wipe. Runs once, then removes itself from the page entirely:
   a curtain that stays in the DOM is a curtain that eats clicks. */
(function(){
  "use strict";
  var curtain = document.getElementById("curtain");
  if(!curtain) return;

  var T = window.TD;
  var cols = [].slice.call(curtain.querySelectorAll(".cols i"));
  var count = curtain.querySelector(".count");
  var DURATION = T.reduced ? 200 : 1200;

  var t0 = performance.now();
  (function step(t){
    var p = T.clamp((t - t0) / DURATION, 0, 1);
    count.textContent = Math.round(p * 100);
    if(p < 1){ requestAnimationFrame(step); return; }

    cols.forEach(function(c, i){
      c.style.transition = "transform .8s cubic-bezier(.76,0,.24,1) " + (i * 70) + "ms";
      c.style.transform = "scaleY(0)";
    });
    count.style.transition = "opacity .5s";
    count.style.opacity = "0";
    setTimeout(function(){ curtain.classList.add("done"); }, 1500);
  })(t0);
})();

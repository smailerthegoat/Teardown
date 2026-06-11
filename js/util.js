window.TD = (function(){
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function lerp(a,b,n){ return a + (b-a)*n; }
  function clamp(v,a,b){ return Math.min(b, Math.max(a, v)); }

  function loop(el, cb){
    var live=false, last=0, id=0;
    function frame(t){
      if(!live) return;
      var dt=Math.min(50, t-last)||16; last=t; cb(dt);
      id=requestAnimationFrame(frame);
    }
    new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting && !live){ live=true; last=performance.now(); id=requestAnimationFrame(frame); }
        else if(!e.isIntersecting && live){ live=false; cancelAnimationFrame(id); }
      });
    },{rootMargin:"150px"}).observe(el);
  }

  /* hi-dpi canvas sizing, returns CSS pixel dimensions */
  function fit(cv, h){
    var dpr = Math.min(2, devicePixelRatio || 1);
    var w = cv.clientWidth || cv.parentElement.clientWidth;
    cv.width = w*dpr; cv.height = h*dpr;
    cv.style.height = h+"px";
    var ctx = cv.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return { ctx:ctx, w:w, h:h };
  }

  return { reduced:reduced, lerp:lerp, clamp:clamp, loop:loop, fit:fit };
})();

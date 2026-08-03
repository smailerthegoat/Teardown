/* Closing deck. Each card sticks a little lower than the one before it and
   shrinks as the next climbs over it. */
(function(){
  "use strict";
  var deck = document.getElementById("deck");
  if(!deck) return;

  var T = window.TD;
  var cards = [].slice.call(deck.querySelectorAll(".dcard"));

  cards.forEach(function(c, i){ c.style.top = (90 + i * 16) + "px"; });

  function update(){
    cards.forEach(function(c, i){
      var next = cards[i + 1];
      if(!next){ c.style.transform = ""; c.style.filter = ""; return; }
      var r = c.getBoundingClientRect(), nr = next.getBoundingClientRect();
      var overlap = T.clamp((r.bottom - nr.top) / r.height, 0, 1);
      c.style.transform = "scale(" + (1 - overlap * 0.06) + ")";
      c.style.filter = "brightness(" + (1 - overlap * 0.3) + ")";
    });
  }

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
})();

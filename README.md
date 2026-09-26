# Teardown : how a scroll becomes a frame

A scrollytelling article: prose on the left, a sticky canvas figure on the right
that redraws itself at every step of the argument.

**Live:** https://smailerthegoat.github.io/website3/

## Patterns used

Pulled from [Bench](https://github.com/smailerthegoat/website1):

- **Sampled particles** (`js/particles.js`) : the title figure in the hero.
- **Column wipe** (`js/loader.js`) : opens the article, then removes itself.
- **Stacking deck** (`js/stack.js`) : the six-step summary at the end.

## How the figure is driven

`js/steps.js` finds the `.step` nearest the middle of the viewport, sets
`TD.fig.step` to that section's `data-fig`, and writes how far it has travelled
through the middle band to `TD.fig.p`. `js/figure.js` never listens to scroll,
it only draws whatever those two numbers currently say.

Adding a step means adding a `<section class="step" data-fig="6">` and a draw
function to the `draws` array. Nothing else changes.

## Running it

```bash
python3 -m http.server 8000
```

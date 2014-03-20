Basics of JavaScript Canvas Game Development
============================================

In this live coding sessions I will introduce you to the basics of JavaScript and Canvas game development.
We will do something like this little game (http://zeigermann.eu/balls/) more or less from scratch.

Topics will include canvas basics, game loop, player control, physics, and game logic.

20-25 minutes talk
------------------
0. Introduction and Explain game idea
   * Show game
   * Strategies:
     * Go slow, easily avoid red balls
     * Be fast, collect many green balls before there even are that many red ones
1. Canvas
2. Loop
3. Control
4. Physics
5. Logic
6. The complete Ball Game / Wrap Up
7. Extension: Sound
8. Pause and High Scores
9. Possible extensions
   * No direct collision of newly created red ball with extended radius check
   * Variable FPS and delta times (either using Date.now() or performance.now() for higher
     * http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
     * https://developer.mozilla.org/en-US/docs/Web/API/Performance.now()
     * https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/HighResolutionTime/Overview.html
   * Snake like tail (must be avoided)
   * Moving pray (green) balls
   * (Moving) Barriers (elastic collision)
   * Resize listener to expand canvas on window resize
   * Use Mobile Device Orientation to control ball
     * http://www.html5rocks.com/en/tutorials/device/orientation/
   * Better audio
     * http://blog.jetienne.com/blog/2014/02/27/webaudiox-jsfx/
     * https://github.com/jeromeetienne/webaudiox
     * https://github.com/meenie/band.js

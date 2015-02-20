var io = io || {};
(function () {
    "use strict";

    var context;
    window.addEventListener('load', init, false);
    function init() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
        }
        catch (e) {
            console.warn('Web Audio API is not supported in this browser');
        }
    }

    function createOscillator(frequency, gain) {
        var oscillator = context.createOscillator(); // Oscillator defaults to sine wave
        oscillator.type = oscillator.SQUARE;
        oscillator.frequency.value = frequency; // in hertz

//    Create a gain node.
        var gainNode = context.createGain();
        // Connect the source to the gain node.
        oscillator.connect(gainNode);
        // Connect the gain node to the destination.
        gainNode.connect(context.destination);
        // Reduce the volume.
        gainNode.gain.value = gain || 0.1;

        return oscillator;
    }

    function playSoundGood(frequency) {
        frequency = frequency || 440;
        var oscillator = createOscillator(frequency);
        oscillator.start(context.currentTime); // play now
        oscillator.stop(context.currentTime + 0.2); // seconds
    }

    function playSound(frequency, duration, type, gain) {
        var oscillator = createOscillator(frequency, gain);
        if (typeof type != 'undefined') {
            oscillator.type = type;
        }
        oscillator.start(context.currentTime); // play now
        oscillator.stop(context.currentTime + duration); // seconds
    }

    function playSoundBad(frequency) {
        frequency = frequency || 55;
        var oscillator = createOscillator(frequency);
        oscillator.type = oscillator.SAWTOOTH;
        oscillator.start(context.currentTime); // play now
        oscillator.stop(context.currentTime + 0.5); // seconds
    }

    io.playSoundGood = playSoundGood;
    io.playSoundBad = playSoundBad;
    io.playSound = playSound;
})();

var io = io || {};
(function () {
    "use strict";

    var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');

    function fullsizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener("orientationchange", function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log("New orientation:" + window.orientation);
        }, false);
    }

    io.canvas = canvas;
    io.context = context;
    io.fullsizeCanvas = fullsizeCanvas;
})();

var io = io || {};
(function () {
    "use strict";
    var pressed = {};
    var orientationSupported = false;
    var orientationEvent;
    var onReadyCallbacks = [];


    window.onkeydown = function (e) {
        if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
            e.preventDefault();
        }
        pressed[e.keyCode] = true;
    };

    window.onkeyup = function (e) {
        delete pressed[e.keyCode];
    };

    function control() {
        var currentControl = {};
        if (38 in pressed) currentControl['up'] = true;
        if (40 in pressed) currentControl['down'] = true;
        if (37 in pressed) currentControl['left'] = true;
        if (39 in pressed) currentControl['right'] = true;
        return currentControl;
    }

    function ready(callback) {
        onReadyCallbacks.push(callback);
    }

    window.onload = function() {
        onReadyCallbacks.forEach(function (callback) {
            callback();
        })
    }

    io.control = control;
    io.pressed = pressed;
    io.ready = ready;

})();

var io = io || {};
(function () {
    "use strict";

    // adapted from
    // http://www.html5canvastutorials.com/labs/html5-canvas-animals-on-the-beach-game-with-kineticjs/
    function loadImages(rootUrl, sources, callback) {
        var images = {};
        var loadedImages = 0;
        for(var index in sources) {
            var src = sources[index];
            var image = new Image();
            images[src] = image;
            image.onload = function() {
                // trigger callback only if all required images have been loaded
                if(++loadedImages >= sources.length) {
                    callback(images);
                }
            };
            image.src = rootUrl + '/' + src + '.png';
        }
    }

    io.loadImages = loadImages;
})();

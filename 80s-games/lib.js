////////////////////////////
// Sound
////////////////////////////

var audioContext;
window.addEventListener('load', init, false);
function init() {
    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    catch(e) {
        console.warn('Web Audio API is not supported in this browser');
    }
}

function createOscillator(context, frequency) {
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
    gainNode.gain.value = 0.2;

    return oscillator;
}

function playSoundGood(frequency) {
    frequency = frequency || 440;
    var oscillator = createOscillator(audioContext, frequency);
    oscillator.start(audioContext.currentTime); // play now
    oscillator.stop(audioContext.currentTime + 0.2); // seconds
}

function playSoundBad(frequency) {
    frequency = frequency || 55;
    var oscillator = createOscillator(audioContext, frequency);
    oscillator.type = oscillator.SAWTOOTH;
    oscillator.start(audioContext.currentTime); // play now
    oscillator.stop(audioContext.currentTime + 0.5); // seconds
}

////////////////////////////
// Canvas
////////////////////////////

var canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

function drawBall() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

////////////////////////////
// Loop
////////////////////////////

function now() {
//    return performance.now();
    return Date.now() / 10;
}

var running = true;
var previousNow = now();

function loop() {
    if (running) requestAnimationFrame(loop);
    var nextNow = now();
    var deltaT = nextNow - previousNow;
    previousNow = nextNow;
    objects.forEach(function(object) {
        object.update(deltaT);
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(function(object) {
        object.draw();
    });
}

var objects = [];

function addObject(object) {
    // push new balls to front so game logic will draw tests in front of them
    objects.splice(0, 0, object);
}
function removeObject(object) {
    objects.splice(objects.indexOf(object), 1);
}

var gameOver = false;

function loose() {
    playSoundBad();
    gameOver = true;
}

////////////////////////////
// Control
////////////////////////////

var pressed = {};
window.onkeydown = function (e) {
    if (e.keyCode === 27 && !gameOver) {
        running = !running;
        if (running) {
            previousNow = now()
            loop();
        }
        return;
    }
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
        e.preventDefault();
    }
    pressed[e.keyCode] = true;
};

window.onkeyup = function (e) {
    delete pressed[e.keyCode];
};

window.addEventListener("orientationchange", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("New orientation:" + window.orientation);
}, false);

if (window.DeviceOrientationEvent) {
//    console.log("DeviceOrientation is supported");
    orientationSupported = true;
}

// http://www.html5rocks.com/en/tutorials/device/orientation/
window.addEventListener('deviceorientation', function(event) {
    orientationEvent = event;
//    console.log(orientationEvent);
}, false);

function orientationControl(currentControl) {
    var threshold = 45,
        offsetBeta = 90;
    if (orientationEvent.beta - offsetBeta > threshold) {
        currentControl['down'] = true;
    }
    if (orientationEvent.beta - offsetBeta < -threshold) {
        currentControl['up'] = true;
    }
    if (orientationEvent.gamma > threshold) {
        currentControl['right'] = true;
    }
    if (orientationEvent.gamma < -threshold) {
        currentControl['left'] = true;
    }
}

function keyboardControl(currentControl) {
    if (38 in pressed) currentControl['up'] = true;
    if (40 in pressed) currentControl['down'] = true;
    if (37 in pressed) currentControl['left'] = true;
    if (39 in pressed) currentControl['right'] = true;
}

function control() {
    var currentControl = {};
//    if (orientationSupported && orientationEvent) {
//        orientationControl(currentControl);
//    }
    keyboardControl(currentControl);
    return currentControl;
}


////////////////////////////
// Physics
////////////////////////////

// http://www.adambrookesprojects.co.uk/project/canvas-collision-elastic-collision-tutorial/
function ballsCollide(ball1, ball2) {
    // a^2 + b^2 = c^2
    var a = ball2.position.x - ball1.position.x;
    var b = ball2.position.y - ball1.position.y;
    var c = ball1.r + ball2.r;
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) < c;
}

function move(deltaT) {
    this.position.x += this.velocity.x * deltaT;
    this.position.y += this.velocity.y * deltaT;

    if (this.position.x < this.r) {
        this.position.x = this.r;
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.x >= canvas.width - this.r) {
        this.position.x = canvas.width - this.r;
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.y < this.r) {
        this.position.y = this.r;
        this.velocity.y = -this.velocity.y;
    }
    if (this.position.y >= canvas.height - this.r) {
        this.position.y = canvas.height - this.r;
        this.velocity.y = -this.velocity.y;
    }

    this.velocity.y += (this.gravity || 0) * deltaT;
}
function updatePlayer (deltaT) {
    var currentControl = this.control();

    if ('up' in currentControl) this.velocity.y -= this.acceleration * deltaT;
    if ('down' in currentControl) this.velocity.y += this.acceleration * deltaT;
    if ('left' in currentControl) this.velocity.x -= this.acceleration * deltaT;
    if ('right' in currentControl) this.velocity.x += this.acceleration * deltaT;
    move.call(this, deltaT);
}

////////////////////////////
// Logic
////////////////////////////

function drawOverview(gameName, description, currentScore) {
    var highScoreKey = gameName + '-highscore';
    var highScore = localStorage.getItem(highScoreKey) || 0;
    var text;
    if (gameOver) {
        if (currentScore > highScore) {
            text = 'Game over, NEW HIGHTSCORE: ' + currentScore;
            localStorage.setItem(highScoreKey, currentScore);
        } else {
            text = 'Game over, final score: ' + currentScore;
        }
    } else {
        text = "Score: " + currentScore;
    }
    context.fillStyle = 'black';
    context.font = '12px sans-serif';
    context.fillText(text, 20, canvas.height - 20);
    context.fillText(description + ' Hit ESC to pause. Reload page to try again. Current high score: '+ highScore, 20, 20);
    if (!running && !gameOver) {
        context.fillText('Paused, hit ESC to resume', 100, 100);
    }
}

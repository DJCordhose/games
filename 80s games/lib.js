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

function playSound(frequency) {
    frequency = frequency || 440;
    var oscillator = createOscillator(audioContext, frequency);
    oscillator.start(audioContext.currentTime); // play now
    oscillator.stop(audioContext.currentTime + 0.1); // seconds
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

function updatePlayer (deltaT) {
    if (38 in pressed) this.velocity.y -= acceleration * deltaT; // up
    if (40 in pressed) this.velocity.y += acceleration * deltaT; // down
    if (37 in pressed) this.velocity.x -= acceleration * deltaT; // left
    if (39 in pressed) this.velocity.x += acceleration * deltaT; // right

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

    this.velocity.y += gravity * deltaT;
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
    context.fillText(text, 20, canvas.height - 20);
    context.fillText(description + ' Hit ESC to pause. Reload page to try again. Current high score: '+ highScore, 20, 20);
    if (!running && !gameOver) {
        context.fillText('Paused, hit ESC to resume', 100, 100);
    }
}

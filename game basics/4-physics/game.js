////////////////////////////
// Framework
////////////////////////////

var pressed = {};
window.onkeydown = function (e) {
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
        e.preventDefault();
    }
    pressed[e.keyCode] = true;
};

window.onkeyup = function (e) {
    delete pressed[e.keyCode];
};

function loop() {
    objects.forEach(function(object) {
        object.update();
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(function(object) {
        object.draw();
    });
}

var loopId = setInterval(loop, 10);
function stop() {
    clearInterval(loopId);
}

var canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

var objects = [];

function addObject(object) {
    objects.push(object);
}
function removeObject(object) {
    objects.splice(objects.indexOf(object), 1);
}

var gameOver = false;

////////////////////////////
// Generic Game
////////////////////////////

function updatePlayer () {
    if (38 in pressed) this.velocity.y -= acceleration; // up
    if (40 in pressed) this.velocity.y += acceleration; // down
    if (37 in pressed) this.velocity.x -= acceleration; // left
    if (39 in pressed) this.velocity.x += acceleration; // right

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

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

    this.velocity.y += gravity;
}

function drawBall() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

////////////////////////////
// Game
////////////////////////////

var acceleration = 0.1;
var gravity = 0.01;

var player = {
    r: 10,
    color: 'blue',
    velocity: {
        x: 0,
        y: 0
    },
    position: {
        x: 100,
        y: 100
    },
    update: updatePlayer,
    draw: drawBall
};
addObject(player);

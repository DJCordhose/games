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

var objects = [];

function addObject(object) {
    objects.push(object);
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
function ballsCollide(object1, object2) {
    // a^2 + c^2 = c^2
    var a = object2.position.x - object1.position.x;
    var b = object2.position.y - object1.position.y;
    var c = object1.r + object2.r;
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) < c;
}

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

////////////////////////////
// Logic
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

var logic = {
    ballsCaught: 0,
    greenBallLikeliness: 0.1,
    redBallLikeliness: 0.01,
    createBall: function() {
        var r = 10;
        var ball = {
            r: r,
            position: {
                x: Math.round(Math.random() * (canvas.width - r) + r),
                y: Math.round(Math.random() * (canvas.height - r) + r)
            },
            draw: drawBall
        };
        addObject(ball);
        return ball;
    },
    createGreenBall: function () {
        var thisLogic = this;
        var ball = this.createBall();
        ball.color = 'green';
        ball.update = function() {
            if (ballsCollide(ball, player)) {
                thisLogic.ballsCaught++;
                removeObject(ball);
            }
        };
    },
    createRedBall: function () {
        var ball = this.createBall();
        // don't immediately collide with player
        if (ballsCollide(ball, player)) {
            removeObject(ball);
        }
        ball.color = 'red';
        ball.update = function() {
            if (ballsCollide(ball, player)) {
                gameOver = true;
            }
        };
    },
    update: function() {
        if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
        if (Math.random() < this.redBallLikeliness) this.createRedBall();
        if (gameOver) stop();
    },
    draw: function() {
        var text;
        if (gameOver) {
            text = 'Game over, final score: ' + this.ballsCaught;
        } else {
            text = "Balls caught: " + this.ballsCaught;
        }
        context.fillStyle = 'black';
        context.fillText(text, 20, canvas.height - 20);
        context.fillText('Hit green balls and avoid red ones. Accelerate by using cursor keys. Reload page to try again', 20, 20);
    }
};
addObject(logic);

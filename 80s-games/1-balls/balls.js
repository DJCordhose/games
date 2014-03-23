function updatePlayer(deltaT) {
    var currentControl = this.control();
    accelerate.call(this, currentControl, deltaT);
    inertiaMove.call(this, deltaT);
}

var player = {
    r: 10,
    color: 'blue',
    velocity: {
        x: 0,
        y: 0
    },
    maxSpeed: 5,
    position: {
        x: 100,
        y: 100
    },
    gravity: 0.01,
    acceleration: 0.1,
    friction: 0,
    update: updatePlayer,
    draw: drawBall,
    control: control
};
addObject(player);

logic.name = 'balls';
logic.description = 'Hit green balls and avoid red ones. Accelerate by using cursor keys.';
logic.ballsCaught = 0;
logic.greenBallLikeliness = 0.1;
logic.redBallLikeliness = 0.01;

logic.createBall = function () {
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
};

logic.createGreenBall = function () {
    var thisLogic = this;
    var ball = this.createBall();
    ball.color = 'green';
    ball.update = function () {
        if (ballsCollide(ball, player)) {
            playSoundGood();
            thisLogic.ballsCaught++;
            removeObject(ball);
        }
    };
};

logic.createRedBall = function () {
    var ball = this.createBall();
    // don't immediately collide with player
    var playerWithExtendedRadius = {
        position: {
            x: player.position.x,
            y: player.position.y
        },
        r: player.r * 5
    };
    if (ballsCollide(ball, playerWithExtendedRadius)) {
        removeObject(ball);
    }
    ball.color = 'red';
    ball.update = function () {
        if (ballsCollide(ball, player)) {
            loose();
        }
    };
};

logic.update = function () {
    if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
    if (Math.random() < this.redBallLikeliness) this.createRedBall();
    if (gameOver) running = false;
};

loop();
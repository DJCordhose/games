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
    acceleration: 0.1,
    update: updatePlayer,
    draw: drawBall
};
addObject(player);

var logic = {
    name: 'balls',
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
                playSoundGood();
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
                loose();
            }
        };
    },
    update: function() {
        if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
        if (Math.random() < this.redBallLikeliness) this.createRedBall();
        if (gameOver) running = false;
    },
    draw: function() {
        drawOverview(this.name, 'Hit green balls and avoid red ones. Accelerate by using cursor keys.', this.ballsCaught)
    }
};
addObject(logic);

loop();


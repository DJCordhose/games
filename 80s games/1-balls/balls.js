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
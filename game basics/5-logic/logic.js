var logicObject = {
    ballsCaught: 0,
    greenBallLikeliness: 0.1,
    redBallLikeliness: 0.01,
    update: function() {
        if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
        if (Math.random() < this.redBallLikeliness) this.createRedBall();
    },
    createGreenBall: function () {
        var ball = this.createBallAtRandomLocation();
        ball.color = 'green';
        ball.update = function() {
            if (ballsCollide(ball, player)) {
                ballsCaught++;
                removeObject(ball);
            }
        };
    },
    createRedBall: function () {
        var ball = this.createBallAtRandomLocation();
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
    createBallAtRandomLocation: function() {
        var ball = {
            r: 10,
            position: {
                x: Math.round(Math.random() * (canvas.width - r) + r),
                y: Math.round(Math.random() * (canvas.height - r) + r)
            },
            draw: drawBall
        };
        addObject(ball);
        return ball;
    }
};

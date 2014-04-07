var balls = balls || {};
(function (_extends, _mixin, MovingObject, Ball, control) {
    "use strict";

    function Player() {
        var config =         {
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
            friction: 0
        };
        MovingObject.call(this, config);
        Ball.call(this, config);
    }

    _extends(Player, MovingObject);
    _mixin(Player, Ball);

    Player.prototype.control = control;
    Player.prototype.update = function (deltaT) {
        this.accelerate(deltaT);
        this.inertiaMove(deltaT);
    };

    balls.Player = Player;

})(util._extends, util._mixin, game.MovingObject, game.Ball, io.control);

var balls = balls || {};
(function (_extends, SimpleLogic, Ball, canvas) {
    "use strict";

    function BallsGame(player) {
        BallsGame._super.constructor.call(this, {
            gameName: 'balls',
            description: 'Hit green balls and avoid red ones. Accelerate by using cursor keys.'

        });
        this.greenBallLikeliness = 0.1;
        this.redBallLikeliness = 0.01;
        this.player = player;
    }

    _extends(BallsGame, SimpleLogic);

    BallsGame.prototype.createBall = function () {
        var r = 10;
        var ball = new Ball({
            r: r,
            position: {
                x: Math.round(Math.random() * (canvas.width - r) + r),
                y: Math.round(Math.random() * (canvas.height - r) + r)
            }
        });
        this.addObject(ball);
        return ball;
    };

    BallsGame.prototype.createGreenBall = function () {
        var thisLogic = this;
        var ball = this.createBall();
        ball.color = 'green';
        ball.update = function () {
            if (this.collidesWith(thisLogic.player)) {
                io.playSoundGood();
                thisLogic.currentScore++;
                thisLogic.removeObject(ball);
            }
        };
    };

    BallsGame.prototype.createRedBall = function () {
        var thisLogic = this;
        var ball = this.createBall();
        // don't immediately collide with player
        var playerWithExtendedRadius = {
            position: {
                x: thisLogic.player.position.x,
                y: thisLogic.player.position.y
            },
            r: thisLogic.player.r * 5
        };
        if (ball.collidesWith(playerWithExtendedRadius)) {
            this.removeObject(ball);
        }
        ball.color = 'red';
        ball.update = function () {
            if (this.collidesWith(thisLogic.player)) {
                thisLogic.loose();
            }
        };
    };

    BallsGame.prototype.update = function () {
        if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
        if (Math.random() < this.redBallLikeliness) this.createRedBall();
        if (this.gameOver) this.suspend();
    };

    balls.BallsGame = BallsGame;
})(util._extends, game.SimpleLogic, game.Ball, io.canvas);

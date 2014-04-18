var snake = snake || {};
(function (_extends, Player, Ball, context) {
    "use strict";

    function Snake() {
        Snake._super.constructor.call(this);
        this.color = '#A08020';
        this.velocity.x = 1;
        this.gravity = 0;
        this.acceleration = 0.05;
        this.friction = 0.0001;
        this.past = [];
        this.tailLength = 50;
        this.tailGrowthPerBall = 1;
        this.maxSpeed = 2;
    }
//    function Snake() {
//        Snake._super.constructor.call(this);
//        this.color = '#A08020';
//        this.velocity.x = 2;
//        this.gravity = 0.01;
//        this.acceleration = 0.1;
//        this.friction = 0.001;
//        this.past = [];
//        this.tailLength = 100;
//        this.tailGrowthPerBall = 100;
//        this.maxSpeed = 3;
//    }

    _extends(Snake, Player);

    Snake.prototype._drawTail = function () {
        this.past.forEach(function (tailBall) {
            tailBall.draw();
        });
    };

    Snake.prototype._checkTailCollision = function () {
        this.past.forEach(function (tailBall, index) {
            // skip the first few tail balls in order not to collide with directly adjacent ones
            if (index > this.past.length - this.r * 5) return;
            if (this.collidesWith(tailBall)) {
                this.game.loose();
            }
        }, this);
    };

    Snake.prototype.addToPast = function () {
        var tailBall = new Ball({
            color: this.color,
            r: this.r,
            position: {
                x: this.position.x,
                y: this.position.y
            }
        });
        this.past.push(tailBall);
        // let the tail grow with each ball caught
        if (this.past.length > this.tailLength + this.game.currentScore * this.tailGrowthPerBall) {
            this.past.splice(0, 1);
        }
    };

    Snake.prototype.draw = function () {
        Snake._super.draw.call(this);
        this._drawTail();
        this._drawFace();
    };

    Snake.prototype._drawFace = function () {
        context.fillStyle = '#101010';
        context.beginPath();
        context.arc(this.position.x + this.r / 2, this.position.y, 2, 0, Math.PI * 2);
        context.fill();
        context.closePath();
        context.beginPath();
        context.arc(this.position.x - this.r / 2, this.position.y, 2, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }


    Snake.prototype.update = function (deltaT) {
        Snake._super.update.call(this, deltaT);
        this._checkTailCollision();
        this.addToPast();
    };

    Snake.prototype.control = function () {
        var originalControl = Snake._super.control.call(this);
        var relativeControl = {};

        if (this.movesLeft()) {
            if ('left' in originalControl) relativeControl['down'] = true;
            if ('right' in originalControl) relativeControl['up'] = true;
        } else if (this.movesRight()) {
            if ('left' in originalControl) relativeControl['up'] = true;
            if ('right' in originalControl) relativeControl['down'] = true;
        } else if (this.movesUp()) {
            if ('left' in originalControl) relativeControl['left'] = true;
            if ('right' in originalControl) relativeControl['right'] = true;
        } else if (this.movesDown()) {
            if ('left' in originalControl) relativeControl['right'] = true;
            if ('right' in originalControl) relativeControl['left'] = true;
        }

        return relativeControl;
    };

    snake.Snake = Snake;

})(util._extends, balls.Player, game.Ball, io.context);

var snake = snake || {};
(function (_extends, BallsGame) {
    "use strict";

    function SnakeGame(snakePlayer) {
        SnakeGame._super.constructor.call(this, snakePlayer);
        this.gameName = "Snake";
        this.description = 'Snake! Hit green balls and avoid red ones and your own tail. Control snake relative to current direction by using left and right cursor keys.'
        this.greenBallLikeliness = 0.01;
        this.redBallLikeliness = 0.001;
    }

    _extends(SnakeGame, BallsGame);

    snake.SnakeGame = SnakeGame;
})(util._extends, balls.BallsGame);

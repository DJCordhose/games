var game = game || {};
(function (util, io) {
    "use strict";
    function GameObject(config) {
        this.config = config;
    }

    function Ball(config) {
        GameObject.call(config);
        this.position = config.position;
        this.r = config.r;
        this.color = config.color;
    }

    util._extends(Ball, GameObject);

    Ball.prototype.draw = function () {
        io.context.fillStyle = this.color;
        io.context.beginPath();
        io.context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
        io.context.fill();
        io.context.closePath();
    };

    // http://www.adambrookesprojects.co.uk/project/canvas-collision-elastic-collision-tutorial/
    Ball.prototype.collidesWith = function (otherBall) {
        // a^2 + b^2 = c^2
        var a = otherBall.position.x - this.position.x;
        var b = otherBall.position.y - this.position.y;
        var c = this.r + otherBall.r;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) < c;
    };

    function MovingObject(config) {
        MovingObject._super.constructor.call(this, config);
        this.position = config.position;
        this.velocity = config.velocity;
        this.maxSpeed = config.maxSpeed;
        this.gravity = config.gravity || 0;
        this.acceleration = config.acceleration;
        this.friction = config.friction || 0;
    }

    util._extends(MovingObject, GameObject);

    MovingObject.prototype.inertiaMove = function (deltaT) {
        this.moveByVelocity(deltaT);
        this.bounceOnEdges();
        this.applyGravity(deltaT);
        this.applyFriction(deltaT);
        this.limitSpeed();
    };

    MovingObject.prototype.moveByVelocity = function (deltaT) {
        this.position.x += this.velocity.x * deltaT;
        this.position.y += this.velocity.y * deltaT;
    };

    MovingObject.prototype.bounceOnEdges = function () {
        if (this.position.x < this.r) {
            this.position.x = this.r;
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.x >= io.canvas.width - this.r) {
            this.position.x = io.canvas.width - this.r;
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y < this.r) {
            this.position.y = this.r;
            this.velocity.y = -this.velocity.y;
        }
        if (this.position.y >= io.canvas.height - this.r) {
            this.position.y = io.canvas.height - this.r;
            this.velocity.y = -this.velocity.y;
        }
    };

    MovingObject.prototype.applyGravity = function (deltaT) {
        var gravity = this.gravity || 0;
        this.velocity.y += gravity * deltaT;
    };

    MovingObject.prototype.applyFriction = function (deltaT) {
        var friction = this.friction || 0;
        this.velocity.x = this.velocity.x + (this.velocity.x > 0 ? -1 : +1) * friction * deltaT;
        this.velocity.y = this.velocity.y + (this.velocity.y > 0 ? -1 : +1) * friction * deltaT;
    };

    MovingObject.prototype.limitSpeed = function () {
        var maxSpeed = this.maxSpeed || Number.MAX_VALUE;
        if (this.velocity.x > 0 && this.velocity.x > this.maxSpeed) {
            this.velocity.x = this.maxSpeed;
        }
        if (this.velocity.x < 0 && -this.velocity.x > this.maxSpeed) {
            this.velocity.x = -this.maxSpeed;
        }
        if (this.velocity.y > 0 && this.velocity.y > this.maxSpeed) {
            this.velocity.y = this.maxSpeed;
        }
        if (this.velocity.y < 0 && -this.velocity.y > this.maxSpeed) {
            this.velocity.y = -this.maxSpeed;
        }
    };

    MovingObject.prototype.accelerate = function (deltaT) {
        var currentControl = this.control();
        if ('up' in currentControl) this.velocity.y -= this.acceleration * deltaT;
        if ('down' in currentControl) this.velocity.y += this.acceleration * deltaT;
        if ('left' in currentControl) this.velocity.x -= this.acceleration * deltaT;
        if ('right' in currentControl) this.velocity.x += this.acceleration * deltaT;
    };

    MovingObject.prototype.movesLeft = function () {
        return this.velocity.x <= 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y);
    };

    MovingObject.prototype.movesRight = function () {
        return this.velocity.x > 0 && Math.abs(this.velocity.x) >= Math.abs(this.velocity.y);
    };

    MovingObject.prototype.movesUp = function () {
        return this.velocity.y <= 0 && Math.abs(this.velocity.x) <= Math.abs(this.velocity.y);
    };

    MovingObject.prototype.movesDown = function () {
        return this.velocity.y > 0 && Math.abs(this.velocity.x) <= Math.abs(this.velocity.y);
    };

    game.GameObject = GameObject;
    game.Ball = Ball;
    game.MovingObject = MovingObject;
})(util, io);


var game = game || {};
(function (util, io) {
    "use strict";

    function SimpleLogic(config) {
        this.gameName = config.gameName;
        this.description = config.description;
        this.currentScore = 0;
        this.gameOver = false;
        this.running = false;
    }

    util._extends(SimpleLogic, game.GameObject);

    SimpleLogic.prototype.draw = function () {
        var highScoreKey = this.gameName + '-highscore';
        var highScore = localStorage.getItem(highScoreKey) || 0;
        var text;
        if (this.gameOver) {
            if (this.currentScore > highScore) {
                text = 'Game over, NEW HIGHTSCORE: ' + this.currentScore;
                localStorage.setItem(highScoreKey, this.currentScore);
            } else {
                text = 'Game over, final score: ' + this.currentScore;
            }
        } else {
            text = "Score: " + this.currentScore;
        }
        io.context.fillStyle = 'black';
        io.context.font = '12px sans-serif';
        io.context.fillText(text, 20, io.canvas.height - 20);
        io.context.fillText(this.description + ' Hit ESC to pause. Reload page to try again. Current high score: ' + highScore, 20, 20);
        if (!this.running && !this.gameOver) {
            io.context.fillText('Paused, hit ESC to resume', 100, 100);
        }
    };

    SimpleLogic.prototype.loose = function () {
        io.playSoundBad();
        this.gameOver = true;
    };

    function now() {
//    return performance.now();
        return Date.now() / 10;
    }

    var previousNow = now();

    SimpleLogic.prototype.loop = function () {
        if (!this.gameOver) requestAnimationFrame(SimpleLogic.prototype.loop.bind(this));
        var control = io.control();
        if (27 in io.pressed && !this.gameOver) {
            if (this.running) {
                this.suspend();
            } else {
                this.resume();
            }
            return;
        }
        if (!this.running) {
            return;
        }

        var nextNow = now();
        var deltaT = nextNow - previousNow;
        previousNow = nextNow;
        objects.forEach(function (object) {
            if (object.update) {
//                try {
                object.update(deltaT);
//                } catch (e) {
//                    console.error("Error while updating object " + JSON.stringify(object), e);
//                }
            }
        });
        io.context.clearRect(0, 0, io.canvas.width, io.canvas.height);
        objects.forEach(function (object) {
            if (object.draw) {
//                try {
                object.draw();
//                } catch (e) {
//                    console.error("Error while drawing object " + JSON.stringify(object), e);
//                }
            }
        });
    };

    var objects = [];

    SimpleLogic.prototype.addObject = function (object) {
        // push new balls to front so game logic will draw tests in front of them
        objects.splice(0, 0, object);
    };

    SimpleLogic.prototype.removeObject = function (object) {
        objects.splice(objects.indexOf(object), 1);
    };

    SimpleLogic.prototype.start = function () {
        this.running = true;
        this.loop();
    };

    SimpleLogic.prototype.suspend = function () {
        this.running = false;
    };

    SimpleLogic.prototype.resume = function () {
        this.running = true;
        previousNow = now();
    };

    game.SimpleLogic = SimpleLogic;

})(util, io);

/**
 *
 */
var bricks = bricks || {};


// ------------------------------------------------------------------------------------------------------
// ----- M O V I N G  B A L L
// ------------------------------------------------------------------------------------------------------
(function (_extends, _mixin, GameObject, Ball, control, io) {

	function MovingBall(game, player, bricks, config) {
		this.velocity = {
			x: 0.2,
			y: 200
		};
		this.maxSpeed = 2;
		this.gravity = 0;
		this.acceleration = 0.1;
		this.friction = 0;
		this.game = config.game;

		GameObject.call(this, config);
		Ball.call(this, config);

		this.x = config.position.x;
		this.y = config.position.y;
		this.game = game;
		this.player = player;
		this.bricks = bricks;
	}

	_extends(MovingBall, GameObject);
	_mixin(MovingBall, Ball);

	MovingBall.prototype.inertiaMove = function (deltaT) {
		this.moveByVelocity(deltaT);
		this.bounceOnEdges();
		this.applyGravity(deltaT);
		this.applyFriction(deltaT);
		this.limitSpeed();
	};

	MovingBall.prototype.moveByVelocity = function (deltaT) {
		this.position.x += this.velocity.x * deltaT;
		this.position.y += this.velocity.y * deltaT;
	};

	MovingBall.prototype.bounceOnEdges = function () {
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

		if (this.player.collidesWith(this)) {
			this.position.y = io.canvas.height - 55;
			this.velocity.y = -this.velocity.y;

			return;
		} else if (this.position.y >= io.canvas.height - this.r) {
			this.position.y = io.canvas.height - this.r;
			this.velocity.y = -this.velocity.y;
			this.game.loose();
		}
		var thisMovingBall = this;
		this.bricks.forEach(function (b) {
			if (b.collidesWith(thisMovingBall)) {
				thisMovingBall.game.removeObject(b);
				thisMovingBall.game.currentScore++;
				thisMovingBall.bricks.splice(thisMovingBall.bricks.indexOf(b), 1);
				io.playSoundGood();
			}
		});
	};

	MovingBall.prototype.applyGravity = function (deltaT) {
		var gravity = this.gravity || 0;
		this.velocity.y += gravity * deltaT;
	};

	MovingBall.prototype.applyFriction = function (deltaT) {
		var friction = this.friction || 0;
		this.velocity.x = this.velocity.x + (this.velocity.x > 0 ? -1 : +1) * friction * deltaT;
		this.velocity.y = this.velocity.y + (this.velocity.y > 0 ? -1 : +1) * friction * deltaT;
	};

	MovingBall.prototype.limitSpeed = function () {
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

	MovingBall.prototype.accelerate = function (deltaT) {
		/*
		 var currentControl = this.control();
		 if ('up' in currentControl) this.velocity.y -= this.acceleration * deltaT;
		 if ('down' in currentControl) this.velocity.y += this.acceleration * deltaT;
		 if ('left' in currentControl) this.velocity.x -= this.acceleration * deltaT;
		 if ('right' in currentControl) this.velocity.x += this.acceleration * deltaT;
		 */
	};

	MovingBall.prototype.control = control;


	MovingBall.prototype.update = function (deltaT) {
		this.accelerate(deltaT);
		this.inertiaMove(deltaT);
	};

	bricks.MovingBall = MovingBall;

}(util._extends, util._mixin, game.GameObject, game.Ball, io.control, io));

// ------------------------------------------------------------------------------------------------------
// ----- B R I C K
// ------------------------------------------------------------------------------------------------------
(function (_extends, SimpleLogic, GameObject, context) {

	var COUNT = 0;

	function Brick(x, y, r, g, b) {
		COUNT = COUNT + 1;
		this.brickId = "brick_" + COUNT;
		var config = {
			position: {
				x: x,
				y: y
			},
			width: 70,
			height: 20,
			color: 'rgb(' + r + ',' + g + ',' + b + ')'
		};
		GameObject.call(this, config);
	}

	_extends(Brick, GameObject);

	Brick.prototype.draw = function () {
		context.fillStyle = this.config.color;
		context.fillRect(this.config.position.x, this.config.position.y, 70, 30);
	};

	Brick.prototype.collidesWith = function (ball) {
		var pos = this.config.position;
		pos.w = 70;
		pos.h = 30;
		var distX = Math.abs(ball.position.x - pos.x - pos.w / 2);
		var distY = Math.abs(ball.position.y - pos.y - pos.h / 2);

		if (distX > (pos.w / 2 + ball.r)) {
			return false;
		}
		if (distY > (pos.h / 2 + ball.r)) {
			return false;
		}

		if (distX <= (pos.w / 2)) {
			return true;
		}
		if (distY <= (pos.h / 2)) {
			return true;
		}

		var dx = distX - pos.w / 2;
		var dy = distY - pos.h / 2;
		return (dx * dx + dy * dy <= (ball.r * ball.r));
	};

	bricks.Brick = Brick;

}(util._extends, game.SimpleLogic, game.GameObject, io.context));

// ------------------------------------------------------------------------------------------------------
// ----- P L A Y E R
// ------------------------------------------------------------------------------------------------------
(function (_extends, Brick, canvas, context) {
	"use strict";

	function Player() {
		Brick.call(this, (canvas.width - 70) / 2, canvas.height - 40, 255, 0, 0);
		this.stepSize = 5;
	}

	_extends(Player, Brick);

	Player.prototype.update = function () {
		var c = io.control();
		var pos = this.config.position;

		if (c.right) {
			this.direction = 'right';
		} else if (c.left) {
			this.direction = 'left';
		}

		if ('right' === this.direction) {
			pos.x = pos.x + this.stepSize;
		} else if ('left' === this.direction) {
			pos.x = pos.x - this.stepSize;
		}

		if (pos.x < 1) {
			pos.x = 1;
			this.direction = 'right';
		} else if (pos.x > canvas.width - 70) {
			pos.x = canvas.width - 70;
			this.direction = 'left';
		}
	};

	// Export Player
	bricks.Player = Player;

})(util._extends, bricks.Brick, io.canvas, io.context);

// ------------------------------------------------------------------------------------------------------
// ----- G A M E
// ------------------------------------------------------------------------------------------------------
(function (_extends, SimpleLogic, Ball, canvas) {
	"use strict";

	function BricksGame() {
		BricksGame._super.constructor.call(this, {
			gameName: 'bricks',
			description: 'Tear down this wall, Mr. Gorbatschow'
		});
	}

	_extends(BricksGame, SimpleLogic);

	bricks.BricksGame = BricksGame;

}(util._extends, game.SimpleLogic, game.Ball, io.canvas));



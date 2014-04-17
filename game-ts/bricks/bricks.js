/**
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../lib/io.ts" />
/// <reference path="../lib/game.ts" />
var __extends = this.__extends || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() {
		this.constructor = d;
	}

	__.prototype = b.prototype;
	d.prototype = new __();
};
var eighties;
(function (eighties) {
	(function (bricks) {
		var game = eighties.lib.game;
		var io = eighties.lib.io;

		var BRICK_HEIGHT = 20;
		var BRICK_WIDTH = 70;

		var Brick = (function (_super) {
			__extends(Brick, _super);
			function Brick(bricksGame, position, r, g, b) {
				_super.call(this, { position: position, width: BRICK_WIDTH, height: BRICK_HEIGHT, color: 'rgb(' + r + ',' + g + ',' + b + ')' });
				this.bricksGame = bricksGame;
				this.position = position;
			}

			Brick.prototype.update = function (deltaT) {
				// Check if the current ball collides with this brick
				if (this.collidesWith(this.bricksGame.ball())) {
					io.soundManager.playSoundGood();
					this.bricksGame.removeObject(this);
				}
			};
			return Brick;
		})(game.Rectangle);
		bricks.Brick = Brick;

		var Player = (function (_super) {
			__extends(Player, _super);
			function Player() {
				_super.call(this, { position: { x: (io.canvas.width - BRICK_WIDTH) / 2, y: io.canvas.height - BRICK_HEIGHT - 20 }, color: 'black', width: BRICK_WIDTH, height: BRICK_HEIGHT });
				this.stepSize = 5;
				this.movement = new game.Movement();
			}

			Player.prototype.update = function (deltaT) {
				var c = io.control();
				var pos = this.position;

				// React to direction changes from the user's keyboard
				if (c.right) {
					this.movement.moveRight();
				} else if (c.left) {
					this.movement.moveLeft();
				}

				// calculate new position according to direction
				if (this.movement.isRight()) {
					pos.x = pos.x + this.stepSize;
				} else if (this.movement.isLeft()) {
					pos.x = pos.x - this.stepSize;
				}

				// flip direction on both sides of canvas
				if (pos.x < 1) {
					pos.x = 1;
					this.movement.moveRight();
				} else if (pos.x > io.canvas.width - 70) {
					pos.x = io.canvas.width - 70;
					this.movement.moveLeft();
				}
			};
			return Player;
		})(game.Rectangle);
		bricks.Player = Player;

		var MovingBallEngine = (function (_super) {
			__extends(MovingBallEngine, _super);
			function MovingBallEngine(bricksGame, movingBall, config) {
				_super.call(this, movingBall, config);
				this.bricksGame = bricksGame;
				this.movingBall = movingBall;
			}

			MovingBallEngine.prototype.accelerate = function () {
				// noop;
			};

			MovingBallEngine.prototype.bounceOnEdges = function () {
				// When leaving the canvas at its bottom, player looses the game
				if (this.targetPosition().y >= io.canvas.height - this.movingBall.r) {
					this.bricksGame.loose();
				}

				// run 'regular' bouncing
				_super.prototype.bounceOnEdges.call(this);

				// when the ball hits the player's paddle, bound the ball
				if (this.bricksGame.player().collidesWith(this.movingBall)) {
					this.targetPosition().y = io.canvas.height - 55;
					this.velocity.y = -this.velocity.y;
				}
			};
			return MovingBallEngine;
		})(game.PhysicsEngine);

		var MovingBall = (function (_super) {
			__extends(MovingBall, _super);
			function MovingBall(config, bricksGame) {
				_super.call(this, config.position, config.radius, config.color);
				this.bricksGame = bricksGame;

				// Create the PhysicsEngine for this ball
				this.physicsEngine = new MovingBallEngine(bricksGame, this, {
					velocity: { x: 0.2, y: 200 },
					maxSpeed: 2,
					gravity: 0,
					friction: 0,
					height: config.radius,
					width: config.radius
				});
			}

			MovingBall.prototype.update = function (deltaT) {
				// The actual movement is made by the physicsEngine
				this.physicsEngine.inertiaMove(deltaT);
			};
			return MovingBall;
		})(game.Ball);
		bricks.MovingBall = MovingBall;

		var BricksGame = (function (_super) {
			__extends(BricksGame, _super);
			function BricksGame() {
				_super.call(this, 'Bricks', 'Tear Down This Wall!');

				// CREATE THE PLAYER
				this._player = new Player();

				// CREATE THE BALL
				this._ball = new MovingBall({
					position: { x: (io.canvas.width - 10) / 2, y: 300 },
					radius: 10,
					color: 'red'
				}, this);

				// CREATE SOME BRICKS
				BricksGame.createAndAddBricks(this, 5, 7);

				// ADD'EM ALL...
				this.addObject(this._player);
				this.addObject(this._ball);
				this.addObject(this);
			}

			BricksGame.createAndAddBricks = function (game, rows, cols) {
				var sizeRequired = cols * (BRICK_WIDTH + 10);
				var width = ((io.canvas.width - sizeRequired - 10) / (cols - 1)) + BRICK_WIDTH + 10;

				for (var row = 0; row < rows; row++) {
					for (var col = 0; col < cols; col++) {
						var x = 5 + (col * width);
						var y = 70 + (row * (BRICK_HEIGHT + 10));
						var r = 255 - (row * 10);
						var g = 0 + (row * 30);
						var brick = new bricks.Brick(game, { x: x, y: y }, r, g, 0);
						game.addObject(brick);
					}
				}
			};

			BricksGame.prototype.player = function () {
				return this._player;
			};

			BricksGame.prototype.ball = function () {
				return this._ball;
			};
			return BricksGame;
		})(game.SimpleLogic);
		bricks.BricksGame = BricksGame;
	})(eighties.bricks || (eighties.bricks = {}));
	var bricks = eighties.bricks;
})(eighties || (eighties = {}));
//# sourceMappingURL=bricks.js.map

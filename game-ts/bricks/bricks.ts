/**
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../lib/io.ts" />
/// <reference path="../lib/game.ts" />

module eighties.bricks {

	import game = eighties.lib.game;
	import io = eighties.lib.io;

	var BRICK_HEIGHT = 20;
	var BRICK_WIDTH = 70;

	export class Brick extends game.Rectangle {

		constructor(private bricksGame:BricksGame, public position:game.Position, r:number, g:number, b:number) {
			super({position: position, width: BRICK_WIDTH, height: BRICK_HEIGHT, color: 'rgb(' + r + ',' + g + ',' + b + ')'});
		}

		update(deltaT:number) {
			// Check if the current ball collides with this brick
			if (this.collidesWith(this.bricksGame.ball())) {
				io.soundManager.playSoundGood();
				this.bricksGame.removeObject(this);
			}
		}
	}

	export class Player extends game.Rectangle {
		private stepSize = 5;
		private movement:game.Movement = new game.Movement();

		constructor() {
			super({position: {x: (io.canvas.width - BRICK_WIDTH) / 2, y: io.canvas.height - BRICK_HEIGHT - 20}, color: 'black', width: BRICK_WIDTH, height: BRICK_HEIGHT});
		}

		update(deltaT:number) {

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
		}
	}

	export interface MovingBallConfig {
		position: game.Position;
		radius: number;
		color: string;
	}

	class MovingBallEngine extends game.PhysicsEngine {

		constructor(private bricksGame:BricksGame, private movingBall:MovingBall, config:game.PhysicsEngineConfig) {
			super(movingBall, config);
		}

		accelerate() {
			// noop;
		}

		bounceOnEdges() {
			// When leaving the canvas at its bottom, player looses the game
			if (this.targetPosition().y >= io.canvas.height - this.movingBall.r) {
				this.bricksGame.loose();
			}

			// run 'regular' bouncing
			super.bounceOnEdges();

			// when the ball hits the player's paddle, bound the ball
			if (this.bricksGame.player().collidesWith(this.movingBall)) {
				this.targetPosition().y = io.canvas.height - 55;
				this.velocity.y = -this.velocity.y;
			}
		}
	}

	export class MovingBall extends game.Ball {

		private physicsEngine:game.PhysicsEngine;

		constructor(config:MovingBallConfig, private bricksGame:BricksGame) {
			super(config.position, config.radius, config.color);

			// Create the PhysicsEngine for this ball
			this.physicsEngine = new MovingBallEngine(
				bricksGame, this, {
					velocity: {x: 0.2, y: 200},
					maxSpeed: 2,
					gravity: 0,
					friction: 0,
					height: config.radius,
					width: config.radius
				});
		}

		update(deltaT:number) {
			// The actual movement is made by the physicsEngine
			this.physicsEngine.inertiaMove(deltaT);
		}
	}

	export class BricksGame extends game.SimpleLogic {

		private _player:Player;
		private _ball:MovingBall;

		static createAndAddBricks(game, rows, cols) {
			var sizeRequired = cols * (BRICK_WIDTH + 10);
			var width = ((io.canvas.width - sizeRequired - 10) / (cols - 1)) + BRICK_WIDTH + 10;

			for (var row = 0; row < rows; row++) {
				for (var col = 0; col < cols; col++) {
					var x = 5 + (col * width);
					var y = 70 + (row * (BRICK_HEIGHT + 10));
					var r = 255 - (row * 10);
					var g = 0 + (row * 30);
					var brick = new bricks.Brick(game, {x: x, y: y}, r, g, 0);
					game.addObject(brick);
				}
			}
		}

		constructor() {
			super('Bricks', 'Tear Down This Wall!');

			// CREATE THE PLAYER
			this._player = new Player();

			// CREATE THE BALL
			this._ball = new MovingBall({
				position: {x: (io.canvas.width - 10) / 2, y: 300},
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

		player() {
			return this._player;
		}

		ball() {
			return this._ball;
		}
	}
}
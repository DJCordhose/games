/**
 * Typescript-based variant of Olli Zeigermann's Game Engine
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../lib/io.ts" />
module eighties.lib.game {


	// ------------------------------------------------------------------------------------------------------
	// --- P O S I T I O N   A N D   M O V E M E N T
	// ------------------------------------------------------------------------------------------------------
	export interface Position {
		x: number;
		y: number;
	}

	export enum Direction {
		up,
		down,
		left,
		right
	}

	export class Movement {
		constructor(private direction?:Direction) {
		}

		moveRight() {
			this.direction = Direction.right;
		}

		moveLeft() {
			this.direction = Direction.left;
		}

		moveUp() {
			this.direction = Direction.up;
		}

		moveDown() {
			this.direction = Direction.down;
		}


		turnOpposite() {
			if (this.isRight()) {
				this.direction = Direction.left;
			} else if (this.isLeft()) {
				this.direction = Direction.right;
			} else if (this.isUp()) {
				this.direction = Direction.down;
			} else if (this.isDown()) {
				this.direction = Direction.up;
			}
		}

		isRight() {
			return Direction.right === this.direction;
		}

		isLeft() {
			return Direction.left === this.direction;
		}

		isUp() {
			return Direction.up === this.direction;
		}

		isDown() {
			return Direction.down === this.direction;
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// --- E N T I T Y:  G A M E   O B J E C T
	// ------------------------------------------------------------------------------------------------------
	export interface GameObject {
		update?(deltaT?:number): void;
		draw?(): void
	}

	// ------------------------------------------------------------------------------------------------------
	// --- E N T I T Y:  B A L L
	// ------------------------------------------------------------------------------------------------------
	export interface BallCoordinates {
		position:Position;
		r:number;
	}

	export class Ball implements GameObject, BallCoordinates, Positionable {

		position:Position;
		r:number;
		private color:string;

		constructor(position:Position, radius:number, color:string) {
			this.position = position;
			this.r = radius;
			this.color = color;
		}

		draw() {
			io.context.fillStyle = this.color;
			io.context.beginPath();
			io.context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
			io.context.fill();
			io.context.closePath();
		}


		update(deltaT:number):void {
			// noop
		}

		collidesWith(otherBall:BallCoordinates) {
			// a^2 + b^2 = c^2
			var a = otherBall.position.x - this.position.x;
			var b = otherBall.position.y - this.position.y;
			var c = this.r + otherBall.r;
			return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) < c;
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// --- E N T I T Y:   R E C T A N G L E
	// ------------------------------------------------------------------------------------------------------

	export interface RectangleConfig {
		position: Position;
		color: string;
		width: number;
		height: number;
	}

	export class Rectangle implements game.GameObject {
		public position:Position;
		private color:string;
		private width:number;
		private height:number;

		constructor(config:RectangleConfig) {
			this.position = config.position;
			this.color = config.color;
			this.width = config.width;
			this.height = config.height;
		}

		collidesWith(ball:Ball):boolean {
			var pos = this.position;
			var distX = Math.abs(ball.position.x - pos.x - this.width / 2);
			var distY = Math.abs(ball.position.y - pos.y - this.height / 2);

			if (distX > (this.width / 2 + ball.r)) {
				return false;
			}
			if (distY > (this.height / 2 + ball.r)) {
				return false;
			}

			if (distX <= (this.width / 2)) {
				return true;
			}
			if (distY <= (this.height / 2)) {
				return true;
			}

			var dx = distX - this.width / 2;
			var dy = distY - this.height / 2;
			return (dx * dx + dy * dy <= (ball.r * ball.r));
		}

		draw():void {
			io.context.fillStyle = this.color;
			io.context.fillRect(this.position.x, this.position.y, this.width, this.height);
		}
	}

	// ------------------------------------------------------------------------------------------------------
	// --- P H Y S I C S
	// ------------------------------------------------------------------------------------------------------
	export interface Velocity {
		x: number;
		y: number;
	}

	export interface Positionable {
		position: Position;
	}

	export interface PhysicsEngineConfig {
		velocity?: game.Velocity;
		maxSpeed?: number;
		gravity?: number;
		friction?: number;
		acceleration?: number;
		height:number;
		width:number;
	}

	export class PhysicsEngine {
		velocity:Velocity;
		private maxSpeed:number;
		private gravity:number;
		private friction:number;
		private acceleration:number;
		private objectWidth:number;
		private objectHeight:number;

		constructor(private target:Positionable, config:PhysicsEngineConfig) {
			this.velocity = config.velocity || {x: 0.2, y: 200};
			this.maxSpeed = config.maxSpeed || 2;
			this.gravity = config.gravity || 0;
			this.friction = config.friction || 0;
			this.acceleration = config.acceleration || 0;
			this.objectWidth = config.width;
			this.objectHeight = config.height;
		}

		inertiaMove = function (deltaT) {
			this.moveByVelocity(deltaT);
			this.bounceOnEdges();
			this.applyGravity(deltaT);
			this.applyFriction(deltaT);
			this.limitSpeed();
		};

		bounceOnEdges():void {
			if (this.target.position.x < this.objectWidth) {
				this.target.position.x = this.objectWidth;
				this.velocity.x = -this.velocity.x;
			}
			if (this.target.position.x >= io.canvas.width - this.objectWidth) {
				this.target.position.x = io.canvas.width - this.objectWidth;
				this.velocity.x = -this.velocity.x;
			}
			if (this.target.position.y < this.objectHeight) {
				this.target.position.y = this.objectHeight;
				this.velocity.y = -this.velocity.y;
			}
			if (this.target.position.y >= io.canvas.height - this.objectHeight) {
				this.target.position.y = io.canvas.height - this.objectHeight;
				this.velocity.y = -this.velocity.y;
			}
		}

		limitSpeed() {
			var maxSpeed = this.maxSpeed || Number.MAX_VALUE;
			if (this.velocity.x > 0 && this.velocity.x > maxSpeed) {
				this.velocity.x = maxSpeed;
			}
			if (this.velocity.x < 0 && -this.velocity.x > maxSpeed) {
				this.velocity.x = -maxSpeed;
			}
			if (this.velocity.y > 0 && this.velocity.y > maxSpeed) {
				this.velocity.y = maxSpeed;
			}
			if (this.velocity.y < 0 && -this.velocity.y > maxSpeed) {
				this.velocity.y = -maxSpeed;
			}
		}

		applyFriction(deltaT:number) {
			var friction = this.friction || 0;
			this.velocity.x = this.velocity.x + (this.velocity.x > 0 ? -1 : +1) * friction * deltaT;
			this.velocity.y = this.velocity.y + (this.velocity.y > 0 ? -1 : +1) * friction * deltaT;
		}

		applyGravity(deltaT:number) {
			this.velocity.y += this.gravity * deltaT;
		}

		moveByVelocity(deltaT:number) {
			this.target.position.x += this.velocity.x * deltaT;
			this.target.position.y += this.velocity.y * deltaT;
		}

		accelerate(deltaT:number) {
			var currentControl = io.control();
			if (currentControl.up) {
				this.velocity.y -= this.acceleration * deltaT;
			}
			if (currentControl.down) {
				this.velocity.y += this.acceleration * deltaT;
			}
			if (currentControl.left) {
				this.velocity.x -= this.acceleration * deltaT;
			}
			if (currentControl.right) {
				this.velocity.x += this.acceleration * deltaT;
			}
		}

		targetPosition() {
			return this.target.position;
		}
	}


	// ---------------------------------------------------------------------------------
	// --- S I M P L E  L O G I C   ('T H E   G A M E')
	// ---------------------------------------------------------------------------------
	export class SimpleLogic implements GameObject {
		currentScore:number = 0;
		private gameOver:boolean = false;
		private running:boolean = false;
		private previousNow:number;

		private counter:number = 0;
		private objects:GameObject[];

		private static now() {
			return Date.now() / 10;
		}

		constructor(private gameName:string, private description:string) {
			this.objects = [];
			this.previousNow = SimpleLogic.now();
		}

		loop() {

			// http://stackoverflow.com/a/21924757
			if (!this.gameOver) requestAnimationFrame(() => this.loop());

			var control = io.control();
			if (control.esc && !this.gameOver) {
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

			var nextNow = SimpleLogic.now();
			var deltaT = nextNow - this.previousNow;
			this.previousNow = nextNow;

			this.counter++;

			this.objects.forEach(function (object) {
				if (object.update) {
					object.update(deltaT);
				}
			});

			io.context.clearRect(0, 0, io.canvas.width, io.canvas.height);

			this.objects.forEach(function (object) {
				if (object.draw) {
					object.draw();
				}
			});
		}

		draw() {
			var highScoreKey = this.gameName + '-highscore';
			var highScore = localStorage.getItem(highScoreKey) || 0;
			var text;
			if (this.gameOver) {
				if (this.currentScore > highScore) {
					text = 'Game over, NEW HIGHTSCORE: ' + this.currentScore;
					localStorage.setItem(highScoreKey, "" + this.currentScore);
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
		}

		start() {
			this.running = true;
			this.loop();
		}

		suspend() {
			this.running = false;
		}

		resume() {
			this.running = true;
			this.previousNow = SimpleLogic.now();
		}

		loose() {
			io.soundManager.playSoundBad();
			this.gameOver = true;
		}

		addObject(object:GameObject) {
			this.objects.splice(0, 0, object);
		}

		removeObject(object:GameObject) {
			this.objects.splice(this.objects.indexOf(object), 1);
		}
	}
}
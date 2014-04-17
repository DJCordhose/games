var eighties;
(function (eighties) {
	(function (lib) {
		/**
		 * Typescript-based variant of Olli Zeigermann's Game Engine
		 * Nils Hartmann (nils@nilshartmann.net)
		 */
			/// <reference path="../lib/io.ts" />
		(function (game) {


			(function (Direction) {
				Direction[Direction["up"] = 0] = "up";
				Direction[Direction["down"] = 1] = "down";
				Direction[Direction["left"] = 2] = "left";
				Direction[Direction["right"] = 3] = "right";
			})(game.Direction || (game.Direction = {}));
			var Direction = game.Direction;

			var Movement = (function () {
				function Movement(direction) {
					this.direction = direction;
				}

				Movement.prototype.moveRight = function () {
					this.direction = 3 /* right */;
				};

				Movement.prototype.moveLeft = function () {
					this.direction = 2 /* left */;
				};

				Movement.prototype.moveUp = function () {
					this.direction = 0 /* up */;
				};

				Movement.prototype.moveDown = function () {
					this.direction = 1 /* down */;
				};

				Movement.prototype.turnOpposite = function () {
					if (this.isRight()) {
						this.direction = 2 /* left */;
					} else if (this.isLeft()) {
						this.direction = 3 /* right */;
					} else if (this.isUp()) {
						this.direction = 1 /* down */;
					} else if (this.isDown()) {
						this.direction = 0 /* up */;
					}
				};

				Movement.prototype.isRight = function () {
					return 3 /* right */ === this.direction;
				};

				Movement.prototype.isLeft = function () {
					return 2 /* left */ === this.direction;
				};

				Movement.prototype.isUp = function () {
					return 0 /* up */ === this.direction;
				};

				Movement.prototype.isDown = function () {
					return 1 /* down */ === this.direction;
				};
				return Movement;
			})();
			game.Movement = Movement;


			var Ball = (function () {
				function Ball(position, radius, color) {
					this.position = position;
					this.r = radius;
					this.color = color;
				}

				Ball.prototype.draw = function () {
					lib.io.context.fillStyle = this.color;
					lib.io.context.beginPath();
					lib.io.context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
					lib.io.context.fill();
					lib.io.context.closePath();
				};

				Ball.prototype.update = function (deltaT) {
					// noop
				};

				Ball.prototype.collidesWith = function (otherBall) {
					// a^2 + b^2 = c^2
					var a = otherBall.position.x - this.position.x;
					var b = otherBall.position.y - this.position.y;
					var c = this.r + otherBall.r;
					return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) < c;
				};
				return Ball;
			})();
			game.Ball = Ball;


			var Rectangle = (function () {
				function Rectangle(config) {
					this.position = config.position;
					this.color = config.color;
					this.width = config.width;
					this.height = config.height;
				}

				Rectangle.prototype.collidesWith = function (ball) {
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
				};

				Rectangle.prototype.draw = function () {
					lib.io.context.fillStyle = this.color;
					lib.io.context.fillRect(this.position.x, this.position.y, this.width, this.height);
				};
				return Rectangle;
			})();
			game.Rectangle = Rectangle;


			var PhysicsEngine = (function () {
				function PhysicsEngine(target, config) {
					this.target = target;
					this.inertiaMove = function (deltaT) {
						this.moveByVelocity(deltaT);
						this.bounceOnEdges();
						this.applyGravity(deltaT);
						this.applyFriction(deltaT);
						this.limitSpeed();
					};
					this.velocity = config.velocity || { x: 0.2, y: 200 };
					this.maxSpeed = config.maxSpeed || 2;
					this.gravity = config.gravity || 0;
					this.friction = config.friction || 0;
					this.acceleration = config.acceleration || 0;
					this.objectWidth = config.width;
					this.objectHeight = config.height;
				}

				PhysicsEngine.prototype.bounceOnEdges = function () {
					if (this.target.position.x < this.objectWidth) {
						this.target.position.x = this.objectWidth;
						this.velocity.x = -this.velocity.x;
					}
					if (this.target.position.x >= lib.io.canvas.width - this.objectWidth) {
						this.target.position.x = lib.io.canvas.width - this.objectWidth;
						this.velocity.x = -this.velocity.x;
					}
					if (this.target.position.y < this.objectHeight) {
						this.target.position.y = this.objectHeight;
						this.velocity.y = -this.velocity.y;
					}
					if (this.target.position.y >= lib.io.canvas.height - this.objectHeight) {
						this.target.position.y = lib.io.canvas.height - this.objectHeight;
						this.velocity.y = -this.velocity.y;
					}
				};

				PhysicsEngine.prototype.limitSpeed = function () {
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
				};

				PhysicsEngine.prototype.applyFriction = function (deltaT) {
					var friction = this.friction || 0;
					this.velocity.x = this.velocity.x + (this.velocity.x > 0 ? -1 : +1) * friction * deltaT;
					this.velocity.y = this.velocity.y + (this.velocity.y > 0 ? -1 : +1) * friction * deltaT;
				};

				PhysicsEngine.prototype.applyGravity = function (deltaT) {
					this.velocity.y += this.gravity * deltaT;
				};

				PhysicsEngine.prototype.moveByVelocity = function (deltaT) {
					this.target.position.x += this.velocity.x * deltaT;
					this.target.position.y += this.velocity.y * deltaT;
				};

				PhysicsEngine.prototype.accelerate = function (deltaT) {
					var currentControl = lib.io.control();
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
				};

				PhysicsEngine.prototype.targetPosition = function () {
					return this.target.position;
				};
				return PhysicsEngine;
			})();
			game.PhysicsEngine = PhysicsEngine;

			// ---------------------------------------------------------------------------------
			// --- S I M P L E  L O G I C   ('T H E   G A M E')
			// ---------------------------------------------------------------------------------
			var SimpleLogic = (function () {
				function SimpleLogic(gameName, description) {
					this.gameName = gameName;
					this.description = description;
					this.currentScore = 0;
					this.gameOver = false;
					this.running = false;
					this.counter = 0;
					this.objects = [];
					this.previousNow = SimpleLogic.now();
				}

				SimpleLogic.now = function () {
					return Date.now() / 10;
				};

				SimpleLogic.prototype.loop = function () {
					var _this = this;
					// http://stackoverflow.com/a/21924757
					if (!this.gameOver)
						requestAnimationFrame(function () {
							return _this.loop();
						});

					var control = lib.io.control();
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

					lib.io.context.clearRect(0, 0, lib.io.canvas.width, lib.io.canvas.height);

					this.objects.forEach(function (object) {
						if (object.draw) {
							object.draw();
						}
					});
				};

				SimpleLogic.prototype.draw = function () {
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
					lib.io.context.fillStyle = 'black';
					lib.io.context.font = '12px sans-serif';
					lib.io.context.fillText(text, 20, lib.io.canvas.height - 20);
					lib.io.context.fillText(this.description + ' Hit ESC to pause. Reload page to try again. Current high score: ' + highScore, 20, 20);
					if (!this.running && !this.gameOver) {
						lib.io.context.fillText('Paused, hit ESC to resume', 100, 100);
					}
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
					this.previousNow = SimpleLogic.now();
				};

				SimpleLogic.prototype.loose = function () {
					lib.io.soundManager.playSoundBad();
					this.gameOver = true;
				};

				SimpleLogic.prototype.addObject = function (object) {
					this.objects.splice(0, 0, object);
				};

				SimpleLogic.prototype.removeObject = function (object) {
					this.objects.splice(this.objects.indexOf(object), 1);
				};
				return SimpleLogic;
			})();
			game.SimpleLogic = SimpleLogic;
		})(lib.game || (lib.game = {}));
		var game = lib.game;
	})(eighties.lib || (eighties.lib = {}));
	var lib = eighties.lib;
})(eighties || (eighties = {}));
//# sourceMappingURL=game.js.map

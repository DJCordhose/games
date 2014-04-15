/**
 * TypeScript adaption of 'balls' game by Olli Zeigermann
 *
 * Nils Hartmann (nils@nilshartmann.net)
 */
/// <reference path="../lib/io.ts" />
/// <reference path="../lib/game.ts" />


module eighties.balls {
	import game = eighties.lib.game;
	import io = eighties.lib.io;

	export class Player extends game.Ball {
		private physicsEngine:game.PhysicsEngine;

		constructor() {
			super({x: 100, y: 100}, 10, 'blue');

			// Create PhysicsEngine
			this.physicsEngine = new game.PhysicsEngine(this, {
				velocity: {x: 0, y: 0},
				maxSpeed: 5,
				gravity: 0.01,
				acceleration: 0.1,
				friction: 0,
				width: 5,
				height: 5
			});
		}


		update(deltaT:number):void {
			this.physicsEngine.accelerate(deltaT);
			this.physicsEngine.inertiaMove(deltaT);
		}
	}

	export class BallsGame extends game.SimpleLogic {

		private greenBallLikeliness = 0.1;
		private redBallLikeliness = 0.01;

		constructor(private player:Player) {
			super('balls', 'Hit green balls and avoid red ones. Accelerate by using cursor keys.');

			this.addObject(this);
			this.addObject(player);
		}

		private createBall(color:string):game.Ball {
			var r = 10;
			var ball = new game.Ball({
					x: Math.round(Math.random() * (io.canvas.width - r) + r),
					y: Math.round(Math.random() * (io.canvas.height - r) + r)
				},
				r,
				color
			);
			this.addObject(ball);
			return ball;
		}

		private createGreenBall() {
			var ball = this.createBall('green');
			ball.update = () => {
				if (ball.collidesWith(this.player)) {
					io.soundManager.playSoundGood();
					this.currentScore++;
					this.removeObject(ball);
				}
			};
		}

		private createRedBall() {
			// TODO
			var ball = this.createBall('red');
			// don't immediately collide with player
			var playerWithExtendedRadius = {
				position: {
					x: this.player.position.x,
					y: this.player.position.y
				},
				r: this.player.r * 5
			};
			if (ball.collidesWith(playerWithExtendedRadius)) {
				this.removeObject(ball);
			}

			ball.update = () => {
				if (ball.collidesWith(this.player)) {
					this.loose();
				}
			};
		}

		update() {
			if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
			if (Math.random() < this.redBallLikeliness) this.createRedBall();
		}
	}
}
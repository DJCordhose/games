/**
* TypeScript adaption of 'balls' game by Olli Zeigermann
*
* Nils Hartmann (nils@nilshartmann.net)
*/
/// <reference path="../lib/io.ts" />
/// <reference path="../lib/game.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var eighties;
(function (eighties) {
    (function (balls) {
        var game = eighties.lib.game;
        var io = eighties.lib.io;

        var Player = (function (_super) {
            __extends(Player, _super);
            function Player() {
                _super.call(this, { x: 100, y: 100 }, 10, 'blue');

                // Create PhysicsEngine
                this.physicsEngine = new game.PhysicsEngine(this, {
                    velocity: { x: 0, y: 0 },
                    maxSpeed: 5,
                    gravity: 0.01,
                    acceleration: 0.1,
                    friction: 0,
                    width: 5,
                    height: 5
                });
            }
            Player.prototype.update = function (deltaT) {
                this.physicsEngine.accelerate(deltaT);
                this.physicsEngine.inertiaMove(deltaT);
            };
            return Player;
        })(game.Ball);
        balls.Player = Player;

        var BallsGame = (function (_super) {
            __extends(BallsGame, _super);
            function BallsGame(player) {
                _super.call(this, 'balls', 'Hit green balls and avoid red ones. Accelerate by using cursor keys.');
                this.player = player;
                this.greenBallLikeliness = 0.1;
                this.redBallLikeliness = 0.01;

                this.addObject(this);
                this.addObject(player);
            }
            BallsGame.prototype.createBall = function (color) {
                var r = 10;
                var ball = new game.Ball({
                    x: Math.round(Math.random() * (io.canvas.width - r) + r),
                    y: Math.round(Math.random() * (io.canvas.height - r) + r)
                }, r, color);
                this.addObject(ball);
                return ball;
            };

            BallsGame.prototype.createGreenBall = function () {
                var _this = this;
                var ball = this.createBall('green');
                ball.update = function () {
                    if (ball.collidesWith(_this.player)) {
                        io.soundManager.playSoundGood();
                        _this.currentScore++;
                        _this.removeObject(ball);
                    }
                };
            };

            BallsGame.prototype.createRedBall = function () {
                var _this = this;
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

                ball.update = function () {
                    if (ball.collidesWith(_this.player)) {
                        _this.loose();
                    }
                };
            };

            BallsGame.prototype.update = function () {
                if (Math.random() < this.greenBallLikeliness)
                    this.createGreenBall();
                if (Math.random() < this.redBallLikeliness)
                    this.createRedBall();
            };
            return BallsGame;
        })(game.SimpleLogic);
        balls.BallsGame = BallsGame;
    })(eighties.balls || (eighties.balls = {}));
    var balls = eighties.balls;
})(eighties || (eighties = {}));
//# sourceMappingURL=balls.js.map

var wurfram = wurfram || {};
(function (exports, _extends, _mixin, BallsPlayer, Sprite, playSound) {
    "use strict";

    function playSoundBounce() {
        playSound(220, 0.1, 0, 0.15);
    }

    function Wurfram(images) {
        Wurfram._super.constructor.call(this);
        this.velocity.x = 1;
        this.gravity = 0.01;
        this.acceleration = 0.05;
        this.friction = 0.0001;
        this.maxSpeed = 2;
        this.rCollide = 23;
        this.r = 23;
        Sprite.call(this, {
            image: images['wurfram'],
            position: {
                x: 100,
                y: 100
            },
            imageInfo: {
                dh: 60, dw: 60
            }
        });
    }

    _extends(Wurfram, BallsPlayer);
    _mixin(Wurfram, Sprite);

    Wurfram.prototype.draw = function () {
        Sprite.prototype.draw.call(this);
    };

    Wurfram.prototype.on = function (type, event) {
        if (type === 'bounce') {
            playSoundBounce();
        }
    };
    exports.Player = Wurfram;

})(wurfram, util._extends, util._mixin, balls.Player, game.Sprite, io.playSound);

(function (exports, _extends, BallsGame) {
    "use strict";

    function WurframGame(snakePlayer) {
        WurframGame._super.constructor.call(this, snakePlayer);
        this.gameName = "Wurfram";
        this.description = 'Wurfram! Hit green balls and avoid red ones and your own tail. Control snake relative to current direction by using left and right cursor keys.'
        this.greenBallLikeliness = 0.01;
        this.redBallLikeliness = 0.001;
    }

    _extends(WurframGame, BallsGame);

    exports.WurframGame = WurframGame;
})(wurfram, util._extends, balls.BallsGame);

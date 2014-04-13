var hoverlord = hoverlord || {};
(function (exports, _extends, _mixin, BallsPlayer, Sprite, context) {
    "use strict";

    function Player(images) {
        Player._super.constructor.call(this);
        this.velocity.x = 1;
        this.gravity = 0;
        this.acceleration = 0.05;
        this.friction = 0.0001;
        this.maxSpeed = 2;
        this.rCollide = 10;
        this.r = 10;
        // Credit for the art goes to Hyptosis@gmail.com (http://www.newgrounds.com/art/view/hyptosis/tile-art-batch-1)
//        Sprite.call(this, {
//            image: images['hyptosis_tile-art-batch-1'],
//            position: {
//                x: 100,
//                y: 100
//            },
//            // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#drawImage()
//            imageInfo: {
//                sx: 290, sy: 258, sw: 28, sh: 26
//            }
//        });
//        http://4vector.com/free-vector/free-vector-vector-clip-art-alien-spaceship-icon-98467
//        Sprite.call(this, {
//            image: images['alien_spaceship'],
//            position: {
//                x: 100,
//                y: 100
//            },
//            imageInfo: {
//                sx: 200, sy: 0, sw: 200, dh: 40, dw: 40
//            }
//        });

        // adapted from
        // http://www.flaticon.com/png/256/44079.png
        Sprite.call(this, {
            image: images['tank'],
            position: {
                x: 100,
                y: 100
            },
            imageInfo: {
                dh: 40, dw: 40
            }
        });
    }

    _extends(Player, BallsPlayer);
    _mixin(Player, Sprite);

    Player.prototype.draw = function () {
        Sprite.prototype.draw.call(this);
    };

    exports.Player = Player;

})(hoverlord, util._extends, util._mixin, balls.Player, game.Sprite, io.context);

(function (exports, _extends, BallsGame) {
    "use strict";

    function HoverlordGame(snakePlayer) {
        HoverlordGame._super.constructor.call(this, snakePlayer);
        this.gameName = "Snake";
        this.description = 'Snake! Hit green balls and avoid red ones and your own tail. Control snake relative to current direction by using left and right cursor keys.'
        this.greenBallLikeliness = 0.01;
        this.redBallLikeliness = 0.001;
    }

    _extends(HoverlordGame, BallsGame);

    exports.HoverlordGame = HoverlordGame;
})(hoverlord, util._extends, balls.BallsGame);

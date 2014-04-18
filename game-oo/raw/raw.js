var balls = balls || {};
(function (_extends, _mixin, MovingObject, Ball, control) {
    "use strict";

    function Player() {
        var config =         {
            r: 10,
            color: 'blue',
            velocity: {
                x: 0,
                y: 0
            },
            position: {
                x: 100,
                y: 100
            },
            gravity: 0.01,
            acceleration: 0.1,
            friction: 0
        };
        MovingObject.call(this, config);
        Ball.call(this, config);
    }

    _extends(Player, MovingObject);
    _mixin(Player, Ball);

    Player.prototype.control = control;
    Player.prototype.update = function (deltaT) {
        this.accelerate(deltaT);
        this.inertiaMove(deltaT);
    };

    balls.Player = Player;

})(util._extends, util._mixin, game.MovingObject, game.Ball, io.control);


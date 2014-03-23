function updateBall(deltaT) {
    inertiaMove.call(this, deltaT);
}

var ball = {
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
    gravity: 0.05,
    update: updateBall,
    draw: drawBall
};
addObject(ball);

logic.name = 'ricochet';
logic.description = 'Ricochet! Hit ball with batter. Control batter with left and right cursor key';

loop();
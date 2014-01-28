var player = {
    velocity: {
        x: 0,
        y: 0
    },
    update: updatePlayer
};

var pressed = {};
window.onkeydown = function (e) {
    pressed[e.keyCode] = true;
};

window.onkeyup = function (e) {
    delete pressed[e.keyCode];
};

function updatePlayer () {
    var acceleration = 0.1;
    if (38 in pressed) this.velocity.y -= acceleration; // up
    if (40 in pressed) this.velocity.y += acceleration; // down
    if (37 in pressed) this.velocity.x -= acceleration; // left
    if (39 in pressed) this.velocity.x += acceleration; // right
}


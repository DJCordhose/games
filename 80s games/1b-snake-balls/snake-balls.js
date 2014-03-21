player.color = '#A08020';
player.past = [];
player.tailLength = 100;
player.update = function(deltaT) {
    updatePlayer.call(this, deltaT);

    // move tail
    addToPast.call(this);

    // check for tail collision
    this.past.forEach(function (coordinate, index) {
        // skip the first few tail balls in order not to collide with directly adjacent ones
        if (index > this.past.length - this.r * 5) return;
        var tailBall = {
            r: this.r,
            position: {
                x: coordinate.x,
                y: coordinate.y
            }
        };
        if (ballsCollide(this, tailBall)) {
            loose();
        }
    }, this);
};

player.draw = function() {
    drawBall.call(this);
    this.past.forEach(function (coordinate) {
        var tailBall = {
            color: this.color,
            r: this.r,
            position: {
                x: coordinate.x,
                y: coordinate.y
            }
        };
        drawBall.call(tailBall);

    }, this);
}

logic.name = "wurmspringen";

function addToPast() {
    this.past.push({x: this.position.x, y: this.position.y});
    // let the tail grow with each ball caught
    if (this.past.length > this.tailLength + logic.ballsCaught) {
        this.past.splice(0, 1);
    }
}

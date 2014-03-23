player.color = '#A08020';
player.past = [];
player.tailLength = 50;
player.velocity.x = 1;
player.velocity.y = 0;
player.acceleration = 0.05;
player.initialSpeed = 2;
player.maxSpeed = player.initialSpeed;
player.gravity = 0;
player.friction = 0.0001;

function checkTailCollision() {
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
}
player.update = function (deltaT) {
    updatePlayer.call(this, deltaT);

    // move tail
    addToPast.call(this);

    checkTailCollision.call(this);

    this.maxSpeed = this.initialSpeed + logic.ballsCaught / 100;
};

player.control = relativeControl;

function drawTail() {
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
player.draw = function () {
    drawTail.call(this);
    drawBall.call(this);
    drawFace.call(this);
}

function drawFace() {
    context.fillStyle = '#101010';
    context.beginPath();
    context.arc(this.position.x + this.r / 2, this.position.y, 2, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.beginPath();
    context.arc(this.position.x - this.r / 2, this.position.y, 2, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

logic.name = "wurmspringen";
logic.description = 'Wurmspringen! Hit green balls and avoid red ones and your own tail. Control worm relative to current direction by using left and right cursor keys.'
logic.greenBallLikeliness = 0.01;
logic.redBallLikeliness = 0.001;

function addToPast() {
    this.past.push({x: this.position.x, y: this.position.y});
    // let the tail grow with each ball caught
    if (this.past.length > this.tailLength + logic.ballsCaught / 2) {
        this.past.splice(0, 1);
    }
}
